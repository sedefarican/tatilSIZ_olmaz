const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

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

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB’ye başarıyla bağlanıldı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// Sunucu başlat
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Backend sunucu ${port} portunda çalışıyor`);
});
