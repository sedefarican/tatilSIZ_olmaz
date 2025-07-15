const axios = require('axios');
require('dotenv').config();
const { sendHotelSearchEvent } = require('../kafka/producer'); // Kafka producer'ı dahil edilmiş, harika!

const getHotels = async (req, res) => {
  try {
    // 1. ARAMA PARAMETRELERİNİ ALMA
    const {
      minPrice = 0,
      maxPrice = Infinity,
      stayType = '',
      location = 'Antalya',
      checkIn = '2025-08-01',
      checkOut = '2025-08-07'
    } = req.query;

    // Parametrelerin doğru geldiğini kontrol et
    if (!checkIn || !checkOut || !location) {
      return res.status(400).json({
        message: 'Giriş tarihi, çıkış tarihi ve konum gereklidir.'
      });
    }

    // 2. KAFKA EVENT'İNİ GÖNDERME (EN ÖNEMLİ DEĞİŞİKLİK BURADA)
    // Kullanıcının arama yaptığı bilgisini, API'den yanıt beklemeden ÖNCE gönderiyoruz.
    // 'await' kullanmıyoruz, böylece API yanıt süremiz uzamıyor.
    // Hata olursa diye .catch() ile yakalayıp sadece logluyoruz.
    sendHotelSearchEvent({
        location,
        checkIn,
        checkOut,
        minPrice,
        maxPrice,
        user: req.user?.id, // Eğer kullanıcı girişi varsa, kimin arama yaptığını da ekleyebiliriz
        timestamp: new Date().toISOString()
      })
      .catch(e => console.error("[Kafka Error] Arama eventi gönderilemedi:", e));

    
    // 3. TRIPADVISOR API'SİNE İSTEK ATMA (Bu kısım aynı kalıyor)
    const geoIdMap = {
      'İstanbul': '293974',
      'Ankara': '298656',
      'İzmir': '298006',
      'Antalya': '298484',
    };
    const geoId = geoIdMap[location] || '298656';

    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: { geoId, checkIn, checkOut, adults: '2', rooms: '1' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    // 4. VERİYİ İŞLEME VE FİLTRELEME (Bu kısım aynı kalıyor)
    const hotelsRaw = response.data?.data?.data;
    const hotels = Array.isArray(hotelsRaw) ? hotelsRaw : [];

    if (!hotels.length) {
      return res.status(404).json({ message: 'Otel bulunamadı' });
    }
    
    const filtered = hotels.filter(hotel => {
      const priceStr = hotel.priceForDisplay || '';
      if (!priceStr.match(/\d/)) return false;

      const price = parseInt(priceStr.replace(/[^\d]/g, ''));
      const matchesPrice = price >= parseInt(minPrice) && price <= parseInt(maxPrice);
      const matchesType = stayType ? hotel.title?.toLowerCase().includes(stayType.toLowerCase()) : true;
      const matchesCity = location ? hotel.title?.toLowerCase().includes(location.toLowerCase()) : true;

      return matchesPrice && matchesType && matchesCity;
    });

    // 5. KULLANICIYA YANIT DÖNME
    res.status(200).json({ data: filtered });

  } catch (error) {
    // Hata yönetimi zaten çok iyi, aynen bırakıyoruz.
    console.error('Hotel API hatası:', error.message);
    if (error.response) {
      console.error('API error details:', error.response.data);
      res.status(error.response.status).json({
        message: 'Otel verisi alınamadı',
        error: error.response.data
      });
    } else {
      res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
  }
};

module.exports = { getHotels };