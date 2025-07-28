import express from 'express';
const router = express.Router();

import {
    addFavorite,
    getFavorites,
    deleteFavorite
} from '../controllers/favoriteController.js'; // .js uzantısı önemli

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/:hotelId', deleteFavorite);

export default router;