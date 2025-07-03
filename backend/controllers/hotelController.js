const axios = require('axios');
require('dotenv').config();

const getHotels = async (req, res) => {
  try {
    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: {
  geoId: '298656',       // Antalya
  checkIn: '2025-08-01',
  checkOut: '2025-08-07',
  adults: '2',
  rooms: '1'
},
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    const hotels = response.data?.data?.data ?? []; // 🌟 Sadece dizi
    res.status(200).json({ data: hotels });         // 🌟 Tek katmanlı döndür

  } catch (error) {
    console.error('Hotel API hatası:', error.message);
    res.status(500).json({ message: 'Otel verisi alınamadı' });
  }
};

module.exports = { getHotels };
