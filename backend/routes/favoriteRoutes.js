const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require('../controllers/favoriteController');

router.get('/', getFavorites);         // GET /api/favorites?userEmail=...
router.post('/add', addFavorite);      // POST /api/favorites/add
router.delete('/remove', removeFavorite); // DELETE /api/favorites/remove

module.exports = router;