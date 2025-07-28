import express from 'express';
const router = express.Router();

import { getExchangeRates } from '../controllers/currencyController.js'; // .js uzantısı önemli

router.get('/rates', getExchangeRates);

export default router;