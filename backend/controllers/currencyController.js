const axios = require('axios');
const xml2js = require('xml2js');

const getExchangeRatesFromTCMB = async (req, res) => {
  try {
    const response = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml');
    
    // XML'i JS objesine çevir
    const parser = new xml2js.Parser();
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error('XML parse hatası:', err);
        return res.status(500).json({ message: 'Veri işlenemedi' });
      }

      const currencyList = result.Tarih_Date.Currency;
      const usd = currencyList.find(c => c.$.CurrencyCode === 'USD');
      const eur = currencyList.find(c => c.$.CurrencyCode === 'EUR');

      const rates = {
        USD: parseFloat(usd.ForexSelling[0].replace(',', '.')),
        EUR: parseFloat(eur.ForexSelling[0].replace(',', '.'))
      };

      return res.status(200).json({ rates });
    });
  } catch (error) {
    console.error('TCMB API hatası:', error.message);
    res.status(500).json({ message: 'TCMB verisi alınamadı' });
  }
};

module.exports = { getExchangeRatesFromTCMB };
