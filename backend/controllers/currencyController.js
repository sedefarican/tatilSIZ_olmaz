// currencyController.js DOSYASININ YENİ VE TAM HALİ

const axios = require('axios');
const xml2js = require('xml2js');

let cachedRates = null;
let lastFetchTime = 0;
// Cache süresini 1 saat olarak ayarlıyoruz (milisaniye cinsinden)
const CACHE_DURATION = 60 * 60 * 1000;

async function getRatesLogic() {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_DURATION && cachedRates) {
    console.log('[INFO] Kur verisi (USD ve EUR) cache\'den getirildi.');
    return cachedRates;
  }
  
  try {
    console.log('[INFO] Kur verisi (USD ve EUR) TCMB\'den alınıyor...');
    const response = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    const currencyList = result.Tarih_Date.Currency;

    // Hem USD hem de EUR kurunu buluyoruz.
    const usd = currencyList.find(c => c.$.CurrencyCode === 'USD');
    const eur = currencyList.find(c => c.$.CurrencyCode === 'EUR');

    // Eğer kurlar bulunamazsa hata fırlat.
    if (!usd || !eur) {
        throw new Error('USD veya EUR kuru TCMB verisinde bulunamadı.');
    }

    const rates = { 
      USD: parseFloat(usd.ForexSelling[0].replace(',', '.')),
      EUR: parseFloat(eur.ForexSelling[0].replace(',', '.')) 
    };
    
    cachedRates = rates;
    lastFetchTime = now;
    console.log('[INFO] Kur verisi başarıyla alınıp cache\'lendi:', cachedRates);
    return cachedRates;

  } catch (error) {
    console.error('getRatesLogic hatası:', error.message);
    // Hata durumunda, en azından bir varsayılan değer dönelim ki sistem çökmesin.
    return { USD: 32.5, EUR: 35.0 };
  }
}

const getExchangeRates = async (req, res) => {
  const rates = await getRatesLogic();
  if (rates) {
    return res.status(200).json({ source: 'cache_or_tcmb', rates });
  } else {
    return res.status(500).json({ message: 'Kur verisi alınamadı' });
  }
};

module.exports = { getExchangeRates, getRatesLogic };