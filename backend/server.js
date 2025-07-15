const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. KAFKA CLIENT MODÜLÜNÜ İÇERİ AKTAR
// Bu dosyanın bir üst dizindeki 'utils' klasöründe olduğunu varsayıyorum.
// Yolu kendi projenize göre güncelleyin.
const { connectProducer, disconnectProducer } = require('./utils/kafkaClient');

const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

// .env dosyasını yükle
dotenv.config();

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Route'lar
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/currency', currencyRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend sunucu çalışıyor');
});


// 2. TÜM BAŞLATMA İŞLEMLERİNİ ASENKRON BİR FONKSİYONA TAŞI
const startServer = async () => {
  try {
    // A. Sunucu dinlemeye başlamadan ÖNCE veritabanına ve Kafka'ya bağlan.
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB’ye başarıyla bağlanıldı');

    // B. Kafka Producer'a bağlan. Başarılı/başarısız mesajları zaten kendi içinde.
    await connectProducer();

    // C. Tüm bağlantılar başarılı olduktan SONRA sunucuyu dinlemeye başla.
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`🚀 Backend sunucu ${port} portunda çalışıyor`);
    });

    // 3. GRACEFUL SHUTDOWN (DÜZGÜN KAPATMA) İŞLEMİNİ EKLE
    // Docker'dan veya Ctrl+C'den gelen kapatma sinyallerini yakala.
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n${signal} sinyali alındı. Kapatma işlemi başlıyor...`);

        // Önce Kafka bağlantısını düzgünce kes.
        await disconnectProducer();
        
        // Sonra HTTP sunucusunu kapat (yeni istek almayı durdur).
        server.close(async () => {
          console.log('HTTP sunucusu kapatıldı.');
          
          // Son olarak veritabanı bağlantısını kes ve işlemi sonlandır.
          await mongoose.connection.close(false);
          console.log('MongoDB bağlantısı kapatıldı.');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    // Başlangıç sırasında kritik bir hata olursa (DB'ye veya Kafka'ya bağlanamazsa)
    // sunucuyu hiç başlatma ve hatayı göstererek işlemi sonlandır.
    console.error('❌ Sunucu başlatılırken kritik bir hata oluştu:', error);
    process.exit(1);
  }
};

// 4. BAŞLATMA FONKSİYONUNU ÇAĞIR
startServer();