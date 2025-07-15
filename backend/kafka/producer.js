
const { sendMessage } = require('../utils/kafkaClient'); // Doğru yolu belirttiğinden emin ol

const sendHotelSearchEvent = async (searchData) => {
  // Bağlantı yönetimi yok! Sadece işini yap.
  // Hata yönetimi zaten merkezi modülde yapılıyor.
  await sendMessage('hotel-search-events', searchData);
  console.log('Otel arama eventi başarıyla gönderildi:', searchData);
};

module.exports = { sendHotelSearchEvent };