const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  hotelId: { type: String, required: true },
  hotelTitle: { type: String },
  price: { type: String },
  image: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);