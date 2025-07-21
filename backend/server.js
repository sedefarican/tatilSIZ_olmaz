const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Redis = require('ioredis');

const { connectProducer, disconnectProducer } = require('./utils/kafkaClient');

// Route dosyalarını içeri aktar
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

// .env dosyasını yükle
dotenv.config();

const app = express();

// Redis istemcisini global olarak tanımlayın
let redisClient;

// Middleware'ler
app.use(cors());
app.use(express.json());

// Route'ları tanımla
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/currency', currencyRoutes);

// Temel test endpoint'i
app.get('/', (req, res) => {
    res.send('Backend sunucu çalışıyor');
});

// Tüm başlatma işlemlerini (DB, Kafka, Redis, Sunucu) asenkron bir fonksiyona taşı
const startServer = async () => {
    try {
        // A. Sunucu dinlemeye başlamadan ÖNCE veritabanına bağlan.
        console.log('MongoDB\'ye bağlanılıyor...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB’ye başarıyla bağlanıldı');

        // B. Redis'e bağlan
        console.log('Redis\'e bağlanılıyor...');
        redisClient = new Redis(process.env.REDIS_HOST || 'redis://localhost:6379'); 
        
        redisClient.on('connect', () => {
            console.log('✅ Redis’e başarıyla bağlanıldı');
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis bağlantı hatası:', err);
        });
        console.log('Redis event listenerlar kuruldu. (Adım 3)');

        // C. Kafka Producer'a bağlan.
        await connectProducer();

        // D. Tüm bağlantılar başarılı olduktan SONRA sunucuyu dinlemeye başla.
        // PORT'u doğrudan 5000 olarak sabitledik.
        const port = 5000; 
        const server = app.listen(port, () => {
            console.log(`🚀 Backend sunucu ${port} portunda çalışıyor`);
        });

        // GRACEFUL SHUTDOWN (DÜZGÜN KAPATMA) İŞLEMİNİ EKLE
        const signals = ['SIGINT', 'SIGTERM'];
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n${signal} sinyali alındı. Kapatma işlemi başlıyor...`);

                await disconnectProducer();
                console.log('Kafka Producer bağlantısı kapatıldı.');
                
                if (redisClient) {
                    await redisClient.quit();
                    console.log('Redis bağlantısı kapatıldı.');
                }
                
                server.close(async () => {
                    console.log('HTTP sunucusu kapatıldı.');
                    await mongoose.connection.close(false);
                    console.log('MongoDB bağlantısı kapatıldı.');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('❌ Sunucu başlatılırken kritik bir hata oluştu:', error);
        process.exit(1);
    }
};

startServer();