// favoriteRoutes.js DOSYASININ YENİ VE TAM İÇERİĞİ
const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require('../controllers/favoriteController');

// GET /api/favorites -> Kullanıcının tüm favorilerini getirir (Query ile)
router.get('/', getFavorites);

// POST /api/favorites -> Yeni bir favori ekler (Body ile)
router.post('/', addFavorite);

// DELETE /api/favorites/:hotelId -> Belirli bir oteli favorilerden siler (Params ve Body ile)
router.delete('/:hotelId', removeFavorite);

module.exports = router;