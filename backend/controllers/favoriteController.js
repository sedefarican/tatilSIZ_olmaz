// favoriteController.js DOSYASININ YENİ VE TAM İÇERİĞİ
const Favorite = require('../models/Favorite');

// GET: Kullanıcının favori otellerini getir
const getFavorites = async (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) {
    return res.status(400).json({ message: 'Kullanıcı e-postası gerekli.' });
  }
  try {
    const favorites = await Favorite.find({ userEmail });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST: Yeni favori ekle
const addFavorite = async (req, res) => {
  const { userEmail, hotelId, hotelTitle, price, image } = req.body;
  if (!userEmail || !hotelId) {
    return res.status(400).json({ message: 'Eksik veri.' });
  }
  try {
    const exists = await Favorite.findOne({ userEmail, hotelId });
    if (exists) {
      return res.status(409).json({ message: 'Zaten favorilerde.' });
    }
    const newFav = new Favorite({ userEmail, hotelId, hotelTitle, price, image });
    await newFav.save();
    // EKLENEN FAVORİYİ GERİ DÖN. Frontend'in state'i güncellemesi için bu daha iyi.
    res.status(201).json(newFav); 
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE: Favori sil
const removeFavorite = async (req, res) => {
  // DEĞİŞİKLİK: hotelId'yi req.params'tan, userEmail'i req.body'den alıyoruz.
  const { hotelId } = req.params;
  const { userEmail } = req.body; // Veya bir auth middleware'den alınabilir. Şimdilik body'de kalsın.

  if (!userEmail || !hotelId) {
    return res.status(400).json({ message: 'Eksik veri.' });
  }
  try {
    const result = await Favorite.deleteOne({ userEmail, hotelId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Silinecek favori bulunamadı.' });
    }
    res.status(200).json({ message: 'Favoriden silindi.', hotelId });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };