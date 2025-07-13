const express = require('express');
const router = express.Router();
const { getExchangeRatesFromTCMB } = require('../controllers/currencyController');

router.get('/rates', getExchangeRatesFromTCMB);

module.exports = router;
