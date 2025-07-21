const mockDataApiResponse = require("../mock-hotels.json");

const getHotels = async (req, res) => {
  try {
    let {
      minPrice = 50,
      maxPrice = 50000,
      currency = "TRY",
    } = req.query;

    // Fiyatları işleyen ve istenen para birimine çeviren yardımcı fonksiyon
    const processAndConvertPrices = (hotels) => {
      return hotels.map((hotel) => {
        const priceStr = hotel.priceForDisplay;
        const priceUsd =
          parseInt(String(priceStr).replace(/[^\d]/g, ""), 10) || 0;

        let displayPriceText = "Fiyat bilgisi yok";
        let finalPriceValue = 0;

        if (priceUsd > 0) {
          if (currency.toUpperCase() === "TRY") {
            // USD->TRY dönüşümü için sabit bir oran kullanabilirsin (ör: 33)
            const priceTry = Math.round(priceUsd * 33);
            finalPriceValue = priceTry;
            displayPriceText = `₺${priceTry.toLocaleString("tr-TR")}`;
          } else if (currency.toUpperCase() === "EUR") {
            // USD->EUR dönüşümü için sabit bir oran kullanabilirsin (ör: 0.9)
            const priceEur = Math.round(priceUsd * 0.9);
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

    // Fiyat aralığına göre filtreleyen yardımcı fonksiyon
    const applyFilters = (hotels) => {
      return hotels.filter((hotel) => {
        if (hotel.priceValue === 0 && (minPrice > 0 || maxPrice < 50000)) {
          return false;
        }
        if (hotel.priceValue < minPrice || hotel.priceValue > maxPrice) {
          return false;
        }
        return true;
      });
    };

    const hotelsRaw = mockDataApiResponse.data?.data;
    if (!Array.isArray(hotelsRaw) || hotelsRaw.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const hotelsWithConvertedPrices = processAndConvertPrices(hotelsRaw);
    const filteredHotels = applyFilters(hotelsWithConvertedPrices);

    return res.status(200).json({ data: filteredHotels });
  } catch (error) {
    res.status(500).json({
      message: "Mock veri okunurken hata oluştu.",
      error: error.toString(),
    });
  }
};

module.exports = { getHotels };