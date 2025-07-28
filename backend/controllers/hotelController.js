import mockDataApiResponse from '../mock-hotels.json' assert { type: 'json' };

// getHotels fonksiyonunu adlandırılmış (named) export olarak dışa aktar
export const getHotels = async (req, res) => {
  try {
    let {
      location,
      minPrice = 50,
      maxPrice = 50000,
      currency = "TRY",
      feature,
      payment,
      stayType
    } = req.query;

    minPrice = Number(minPrice);
    maxPrice = Number(maxPrice);

    const processAndConvertPrices = (hotels) => {
      return hotels.map((hotel) => {
        const priceStr = hotel.priceForDisplay;
        const priceUsd = parseInt(String(priceStr).replace(/[^\d]/g, ""), 10) || 0;

        let displayPriceText = "Fiyat bilgisi yok";
        let finalPriceValue = 0;

        if (priceUsd > 0) {
          if (currency.toUpperCase() === "TRY") {
            const priceTry = Math.round(priceUsd * 33);
            finalPriceValue = priceTry;
            displayPriceText = `₺${priceTry.toLocaleString("tr-TR")}`;
          } else if (currency.toUpperCase() === "EUR") {
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

    const applyFilters = (hotelsToFilter) => {
      return hotelsToFilter.filter((hotel) => {
        if (hotel.priceValue < minPrice || hotel.priceValue > maxPrice) {
          return false;
        }
        if (hotel.priceValue === 0 && (minPrice > 0 || maxPrice < 50000)) {
            return false;
        }

        if (location && location !== "" && hotel.city && hotel.city.toLowerCase() !== location.toLowerCase()) {
             return false;
        }

        if (feature && feature !== "" && (!hotel.features || !hotel.features.includes(feature.toLowerCase()))) {
             return false;
        }

        if (payment && payment !== "" && (!hotel.paymentOptions || !hotel.paymentOptions.includes(payment.toLowerCase()))) {
             return false;
        }

        if (stayType && stayType !== "" && (!hotel.type || hotel.type.toLowerCase() !== stayType.toLowerCase())) {
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
    console.error("Oteller işlenirken hata oluştu:", error);
    res.status(500).json({
      message: "Oteller işlenirken dahili sunucu hatası oluştu.",
      error: error.message,
    });
  }
};