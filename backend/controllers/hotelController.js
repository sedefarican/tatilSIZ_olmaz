
require("dotenv").config();
const axios = require("axios");
const { getRatesLogic } = require("./currencyController");
const mockDataApiResponse = require("../mock-hotels.json");

const IS_DEV_MODE = process.env.NODE_ENV === "development";

const getHotels = async (req, res) => {
  try {
    let {
      minPrice = 50,
      maxPrice = 50000,
      currency = "TRY",
      location: rawLocation = "Antalya",
      checkIn,
      checkOut,
      lang = "tr",
    } = req.query;

    const exchangeRates = await getRatesLogic();
    const usdToTryRate = exchangeRates.USD;
    const eurToTryRate = exchangeRates.EUR;

    // 2. Fiyatları işleyen ve istenen para birimine çeviren yardımcı fonksiyon
    const processAndConvertPrices = (hotels) => {
      return hotels.map((hotel) => {
        const priceStr = hotel.priceForDisplay;
        const priceUsd =
          parseInt(String(priceStr).replace(/[^\d]/g, ""), 10) || 0;

        let displayPriceText = "Fiyat bilgisi yok";
        let finalPriceValue = 0; // Bu, filtreleme için kullanılacak olan sayısal değerdir.

        if (priceUsd > 0) {
          if (currency.toUpperCase() === "TRY") {
            const priceTry = Math.round(priceUsd * usdToTryRate);
            finalPriceValue = priceTry;
            displayPriceText = `₺${priceTry.toLocaleString("tr-TR")}`;
          } else if (currency.toUpperCase() === "EUR") {
            const usdToEurRate = usdToTryRate / eurToTryRate;
            const priceEur = Math.round(priceUsd * usdToEurRate);
            finalPriceValue = priceEur;
            displayPriceText = `€${priceEur.toLocaleString("de-DE")}`;
          } else {
            finalPriceValue = priceUsd;
            displayPriceText = `$${priceUsd.toLocaleString("en-US")}`;
          }
        }
        return {
          ...hotel,
          priceValue: finalPriceValue,
          priceForDisplay: displayPriceText,
        };
      });
    };

    // 3. Fiyat aralığına göre filtreleyen yardımcı fonksiyon
    const applyFilters = (hotels) => {  
      return hotels.filter((hotel) => {
        // Fiyatı olmayanları, bir fiyat filtresi aktifse gösterme.
        if (hotel.priceValue === 0 && (minPrice > 0 || maxPrice < 50000)) {
          return false;
        }
        // Fiyat aralığı kontrolü
        if (hotel.priceValue < minPrice || hotel.priceValue > maxPrice) {
          return false;
        }
        // Buraya ileride başka filtreler (özellik, ödeme vs) eklenebilir.
        return true;
      });
    };


    if (IS_DEV_MODE) {
      console.log(
        `✅ [DEV MODU] API çağrısı atlandı. İstenen Dil: ${lang}, Kur: ${currency}`
      );
      const hotelsRaw = mockDataApiResponse.data?.data;
      if (!Array.isArray(hotelsRaw) || hotelsRaw.length === 0) {
        return res.status(200).json({ data: [] });
      }

      // Sahte veriyi al, fiyatlarını işle ve çevir.
      const hotelsWithConvertedPrices = processAndConvertPrices(hotelsRaw);
      // Fiyatı işlenmiş sahte veriyi, filtreden geçir.
      const filteredHotels = applyFilters(hotelsWithConvertedPrices);

      console.log(
        `[DEV MODU] ${filteredHotels.length} adet filtrelenmiş sahte otel gönderildi.`
      );
      return res.status(200).json({ data: filteredHotels });
    }

  
    console.log(
      `[INFO] GERÇEK VERİ MODU AKTİF. İstenen Dil: ${lang}, Kur: ${currency}`
    );

    if (!checkIn || !checkOut) {
      const today = new Date();
      checkIn = today.toISOString().slice(0, 10);
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      checkOut = tomorrow.toISOString().slice(0, 10);
    }

    const location =
      rawLocation.charAt(0).toUpperCase() + rawLocation.slice(1).toLowerCase();
    const geoIdMap = {
      İstanbul: "293974",
      Ankara: "298656",
      İzmir: "298006",
      Antalya: "298484",
    };
    const geoId = geoIdMap[location];
    if (!geoId) return res.status(200).json({ data: [] });

    const response = await axios.get(
      "https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        params: { geoId, checkIn, checkOut, adults: "2", rooms: "1", lang },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
        },
      }
    );

    const hotelsRawFromApi = response.data?.data?.data;
    if (!Array.isArray(hotelsRawFromApi) || hotelsRawFromApi.length === 0) {
      return res.status(200).json({ data: [] });
    }
    const hotelsWithConvertedPricesFromApi =
      processAndConvertPrices(hotelsRawFromApi);
    const filteredHotelsFromApi = applyFilters(
      hotelsWithConvertedPricesFromApi
    );

    res.status(200).json({ data: filteredHotelsFromApi });
  } catch (error) {
    console.error("Hotel API hatası:", error.message);
    if (error.response) {
      console.error("API error details:", error.response.data);
      res
        .status(error.response.status)
        .json({
          message: "Harici API hatası veya limit dolu.",
          error: error.response.data,
        });
    } else {
      res
        .status(500)
        .json({
          message: "Sunucu tarafında kritik bir hata oluştu.",
          error: error.toString(),
        });
    }
  }
};

module.exports = { getHotels };
