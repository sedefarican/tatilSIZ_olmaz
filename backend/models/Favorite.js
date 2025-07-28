import mongoose from 'mongoose';
const favoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  hotelId: { type: String, required: true },
  hotelTitle: { type: String },
  price: { type: String },
  image: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Favorite', favoriteSchema);