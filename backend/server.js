const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // CORS'u en başta çağır
const authRoutes = require('./routes/authRoutes');
dotenv.config();

const app = express();

// CORS middleware’i önce tanımla ✅
app.use(cors());

// JSON verileri parse etsin diye body parser
app.use(express.json());
app.use('/api/auth', authRoutes);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB’ye başarıyla bağlanıldı'))
.catch(err => console.error('MongoDB bağlantı hatası: ', err));

// Route’lar
const hotelRoutes = require('./routes/hotelRoutes');
app.use('/api/hotels', hotelRoutes);

// Basit test endpoint
app.get('/', (req, res) => {
  res.send('Backend sunucu çalışıyor');
});

// Sunucuyu başlat
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend sunucu ${port} portunda çalışıyor`);
});
