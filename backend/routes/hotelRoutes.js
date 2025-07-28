import express from 'express';
const router = express.Router();

import { getHotels } from '../controllers/hotelController.js'; // .js uzantısı önemli

router.get('/', getHotels);

export default router; 