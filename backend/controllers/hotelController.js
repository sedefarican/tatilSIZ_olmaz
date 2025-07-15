const axios = require('axios');
require('dotenv').config();
const { sendHotelSearchEvent } = require('../kafka/producer');

const getHotels = async (req, res) => {
  try {
    const {
      minPrice = 0,
      maxPrice = Infinity,
      stayType = '',
      location: rawLocation = 'Antalya',
      checkIn = '2025-08-01',
      checkOut = '2025-08-07'
    } = req.query;
    
    const location = rawLocation.charAt(0).toUpperCase() + rawLocation.slice(1).toLowerCase();

    const geoIdMap = {
        'İstanbul': '293974', 'Ankara': '298656', 'İzmir': '298006', 'Antalya': '298484',
    };
    const geoId = geoIdMap[location] || '298484';

    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: { geoId, checkIn, checkOut, adults: '2', rooms: '1' },
      headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com' }
    });

    const hotelsRaw = response.data?.data?.data;
    const hotels = Array.isArray(hotelsRaw) ? hotelsRaw : [];

    console.log(`[DEBUG] TripAdvisor'dan "${location}" için ${hotels.length} adet ham otel verisi alındı.`);

    if (!hotels.length) {
      return res.status(200).json({ data: [] });
    }
    
    // ---- EN KRİTİK DEĞİŞİKLİK BURADA ----
    // TÜM FİLTRELEME LOGIC'INI DEVRE DIŞI BIRAKIYORUZ.
    // Gelen tüm otelleri doğrudan 'filtered' dizisine atıyoruz.
    const filtered = hotels; 
    
    // Önceki filtreleme kodunun tamamı artık kullanılmıyor:
    /*
    const filtered = hotels.filter(hotel => {
      const priceStr = hotel.priceForDisplay || '';
      if (minPrice > 0 || maxPrice < Infinity) {
        if (!priceStr.match(/\d/)) return false;
        const price = parseInt(priceStr.replace(/[^\d]/g, ''));
        if (price < parseInt(minPrice) || price > parseInt(maxPrice)) {
            return false;
        }
      }
      return true;
    });
    */

    console.log(`[DEBUG] Filtreleme sonrası "${location}" için ${filtered.length} adet otel bulundu.`);
    
    // Kullanıcıya filtrelenmemiş, ham listeyi gönderiyoruz.
    res.status(200).json({ data: filtered });

  } catch (error) {
    console.error('Hotel API hatası:', error.message);
    if (error.response) {
      console.error('API error details:', error.response.data);
      res.status(error.response.status).json({ message: 'Otel verisi alınamadı', error: error.response.data });
    } else {
      res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
  }
};

module.exports = { getHotels };