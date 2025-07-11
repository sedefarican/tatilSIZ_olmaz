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
    console.error('Favoriler alınamadı:', err.message);
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

    res.status(201).json({ message: 'Favoriye eklendi.' });
  } catch (err) {
    console.error('Favori ekleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE: Favori sil
const removeFavorite = async (req, res) => {
  const { userEmail, hotelId } = req.body;

  try {
    await Favorite.deleteOne({ userEmail, hotelId });
    res.status(200).json({ message: 'Favoriden silindi.' });
  } catch (err) {
    console.error('Silme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };