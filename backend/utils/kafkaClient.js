// /utils/kafkaClient.js

const { Kafka } = require('kafkajs');

// 1. Kafka client'ını SADECE BİR KERE oluştur.
//    Broker adresi doğru: 'kafka:9092'
const kafka = new Kafka({
  clientId: 'tatilsiz-backend-app', // Uygulamana özel bir isim ver
  brokers: ['kafka:9092']
});

// 2. Producer'ı SADECE BİR KERE oluştur.
const producer = kafka.producer();
let isConnected = false;

// 3. Bağlantıyı yönetecek fonksiyonları oluştur.
const connectProducer = async () => {
  if (isConnected) {
    console.log('Kafka Producer zaten bağlı.');
    return;
  }
  try {
    console.log('Kafka Producer bağlanıyor...');
    await producer.connect();
    isConnected = true;
    console.log('Kafka Producer başarıyla bağlandı.');
  } catch (error) {
    console.error('Kafka Producer bağlanırken hata oluştu:', error);
    // Hata durumunda uygulamayı kapatabilir veya yeniden deneme mekanizması kurabilirsin.
    process.exit(1); 
  }
};

const disconnectProducer = async () => {
  if (!isConnected) {
    return;
  }
  try {
    console.log('Kafka Producer bağlantısı kesiliyor...');
    await producer.disconnect();
    isConnected = false;
    console.log('Kafka Producer bağlantısı başarıyla kesildi.');
  } catch (error) {
    console.error('Kafka Producer bağlantısı kesilirken hata oluştu:', error);
  }
};

// 4. Dışa aktaracağımız asıl fonksiyon: Sadece mesaj gönderir.
const sendMessage = async (topic, message) => {
  if (!isConnected) {
    // Bu, uygulamanın başlangıcında connectProducer'ın çağrıldığından emin olmamız gerektiğini gösterir.
    throw new Error('Kafka Producer bağlı değil. Mesaj gönderilemedi.');
  }
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  } catch (error) {
    console.error(`Mesaj gönderilirken hata oluştu (topic: ${topic}):`, error);
  }
};

// Modülden producer'ı, bağlantı fonksiyonlarını ve mesaj gönderme fonksiyonunu dışa aktar.
module.exports = {
  connectProducer,
  disconnectProducer,
  sendMessage,
};