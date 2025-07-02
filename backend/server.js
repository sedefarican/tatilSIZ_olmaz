const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Çevresel değişkenleri yükleyelim
dotenv.config();

const app = express();

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB’ye başarıyla bağlanıldı');
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası: ', err);
  });

app.get('/', (req, res) => {
  res.send('Backend sunucu çalışıyor');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend sunucu ${port} portunda çalışıyor`);
});
