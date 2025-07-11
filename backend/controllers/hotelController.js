const axios = require('axios');
require('dotenv').config();

const getHotels = async (req, res) => {
  try {
    const {
      minPrice = 0,
      maxPrice = Infinity,
      stayType = '',
      location = 'Antalya',
      checkIn = '2025-08-01',
      checkOut = '2025-08-07'
    } = req.query;

    const geoIdMap = {
      'İstanbul': '293974',
      'Ankara': '298656',
      'İzmir': '298006',
      'Antalya': '298484',
      // ... diğer şehirler
    };

    const geoId = geoIdMap[location] || '298656';

    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: {
        geoId,
        checkIn,
        checkOut,
        adults: '2',
        rooms: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });


    const hotelsRaw = response.data?.data?.data;
    

    const hotels = Array.isArray(hotelsRaw) ? hotelsRaw : [];

    console.log("Gelen oteller:", hotels.map(h => h.title));
console.log("API tam response:", response.data);

    const filtered = hotels.filter(hotel => {
      const priceStr = hotel.priceForDisplay || '';
      if (!priceStr.match(/\d/)) return false;

      const price = parseInt(priceStr.replace(/[^\d]/g, ''));
      const matchesPrice = price >= parseInt(minPrice) && price <= parseInt(maxPrice);
      const matchesType = stayType ? hotel.title?.toLowerCase().includes(stayType.toLowerCase()) : true;
      const matchesCity = location ? hotel.title?.toLowerCase().includes(location.toLowerCase()) : true;

      return matchesPrice && matchesType && matchesCity;
    });

    res.status(200).json({ data: filtered });

  } catch (error) {
    console.error('Hotel API hatası:', error.message);
    res.status(500).json({ message: 'Otel verisi alınamadı' });
  }
};

module.exports = { getHotels };
