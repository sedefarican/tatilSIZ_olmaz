const express = require('express');
const router = express.Router();

// --- DOĞRU DEĞİŞKENİ İMPORT EDİYORUZ ---
// currencyController'dan gelen paketten sadece 'getExchangeRates' fonksiyonunu alıyoruz.
const { getExchangeRates } = require('../controllers/currencyController');

// 5. Satır artık 'getExchangeRates' fonksiyonunu bulabildiği için sunucu çökmeyecek.
router.get('/rates', getExchangeRates);

module.exports = router;