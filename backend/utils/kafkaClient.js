// utils/kafkaClient.js
const { Kafka } = require('kafkajs');

let producer = null;

const connectProducer = async () => {
    if (producer) {
        console.log('Kafka Producer zaten bağlı.');
        return producer;
    }

    const kafka = new Kafka({
        clientId: 'tatilsiz-backend-app',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        // KafkaJS bağlantı zaman aşımlarını artır
        connectionTimeout: 30000, // 30 saniye
        requestTimeout: 60000,    // 60 saniye
        // Eğer KafkaJS v2.0.0 uyarısını susturmak istiyorsanız:
        // createPartitioner: Partitioners.LegacyPartitioner, // Eğer eski bölümleme davranışını istiyorsanız
    });

    producer = kafka.producer();

    const MAX_RETRIES = 15; // Maksimum deneme sayısı artırıldı
    const RETRY_DELAY_MS = 5000; // Her deneme arasında 5 saniye bekle

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            console.log(`Kafka Producer'a bağlanmaya çalışılıyor... (Deneme ${i + 1}/${MAX_RETRIES})`);
            await producer.connect();
            console.log('✅ Kafka Producer’a başarıyla bağlanıldı');
            return producer;
        } catch (error) {
            console.error(`❌ Kafka Producer bağlanırken hata oluştu (Deneme ${i + 1}):`, error.message);
            if (i < MAX_RETRIES - 1) {
                console.log(`Tekrar denemeden önce ${RETRY_DELAY_MS / 1000} saniye bekleniyor...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            } else {
                // Maksimum deneme sayısına ulaşıldıysa hatayı fırlat
                throw new Error(`Kafka Producer bağlanamadı, maksimum deneme sayısına ulaşıldı: ${error.message}`);
            }
        }
    }
};

const disconnectProducer = async () => {
    if (producer) {
        console.log('Kafka Producer bağlantısı kesiliyor...');
        await producer.disconnect();
        console.log('Kafka Producer bağlantısı kesildi.');
        producer = null;
    }
};

const sendMessage = async (topic, messages) => {
    if (!producer) {
        console.error('Kafka Producer bağlı değil, mesaj gönderilemiyor.');
        return;
    }
    await producer.send({
        topic,
        messages,
    });
};

module.exports = {
    connectProducer,
    disconnectProducer,
    sendMessage,
};
