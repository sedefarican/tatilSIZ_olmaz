const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Kafka istemci modülünü içeri aktar
// Bu dosyanın bir üst dizindeki 'utils' klasöründe olduğunu varsayıyorum.
// Yolu kendi projenize göre güncelleyin.
const { connectProducer, disconnectProducer } = require('./utils/kafkaClient');

// Route dosyalarını içeri aktar
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

// .env dosyasını yükle
dotenv.config();

const app = express();

// Middleware'ler
// CORS: Çapraz kaynak isteklerine izin verir.
app.use(cors());
// express.json(): Gelen JSON istek gövdelerini ayrıştırır.
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

// Tüm başlatma işlemlerini (DB, Kafka, Sunucu) asenkron bir fonksiyona taşı
const startServer = async () => {
    try {
        // A. Sunucu dinlemeye başlamadan ÖNCE veritabanına bağlan.
        console.log('MongoDB\'ye bağlanılıyor...');
        await mongoose.connect(process.env.MONGO_URI, {
            // Mongoose v6 ve üzeri için useNewUrlParser ve useUnifiedTopology seçenekleri artık varsayılan olarak true'dur
            // ve belirtilmelerine gerek yoktur. Ancak eski versiyonlar için uyumluluk amacıyla bırakılabilir.
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('✅ MongoDB’ye başarıyla bağlanıldı');

        // B. Kafka Producer'a bağlan. Bağlantı başarılı/başarısız mesajları 'kafkaClient' içinde yönetiliyor.
        // Not: KafkaJS v2.0.0'dan sonra varsayılan bölümleyici (partitioner) değişti.
        // Eğer önceki sürümlerdeki bölümleme davranışını korumak isterseniz,
        // Kafka producer'ı oluştururken `createPartitioner: Partitioners.LegacyPartitioner` seçeneğini kullanmanız gerekebilir.
        // Bu uyarıyı susturmak için ortam değişkeni olarak `KAFKAJS_NO_PARTITIONER_WARNING=1` ayarlayabilirsiniz.
        await connectProducer();

        // C. Tüm bağlantılar başarılı olduktan SONRA sunucuyu dinlemeye başla.
        const port = process.env.PORT || 5000;
        const server = app.listen(port, () => {
            console.log(`🚀 Backend sunucu ${port} portunda çalışıyor`);
        });

        // GRACEFUL SHUTDOWN (DÜZGÜN KAPATMA) İŞLEMİNİ EKLE
        // Uygulama kapatma sinyallerini (örneğin Docker'dan SIGTERM, Ctrl+C'den SIGINT) yakala.
        const signals = ['SIGINT', 'SIGTERM'];
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n${signal} sinyali alındı. Kapatma işlemi başlıyor...`);

                // 1. Önce Kafka bağlantısını düzgünce kes.
                await disconnectProducer();
                console.log('Kafka Producer bağlantısı kapatıldı.');
                
                // 2. Sonra HTTP sunucusunu kapat (yeni istek almayı durdur, mevcut isteklerin bitmesini bekle).
                server.close(async () => {
                    console.log('HTTP sunucusu kapatıldı.');
                    
                    // 3. Son olarak veritabanı bağlantısını kes ve işlemi sonlandır.
                    // 'false' parametresi, bağlantı kesilirken bekleyen işlemleri zorla kapatmaz.
                    await mongoose.connection.close(false);
                    console.log('MongoDB bağlantısı kapatıldı.');
                    process.exit(0); // Başarılı kapatma ile çıkış
                });
            });
        });

    } catch (error) {
        // Başlangıç sırasında kritik bir hata olursa (örneğin DB'ye veya Kafka'ya bağlanamazsa)
        // sunucuyu hiç başlatma ve hatayı göstererek işlemi sonlandır.
        console.error('❌ Sunucu başlatılırken kritik bir hata oluştu:', error);
        process.exit(1); // Hata ile çıkış
    }
};

// Başlatma fonksiyonunu çağır
startServer();
