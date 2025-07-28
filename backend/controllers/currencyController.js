import xml2js from 'xml2js';
import axios from 'axios';

let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000;

// Kur oranlarını getirme ve cache'leme mantığı
async function getRatesLogic() {
  const now = Date.now();
  // Cache süresi dolmadıysa ve cache'lenmiş oranlar varsa cache'den dön
  if (now - lastFetchTime < CACHE_DURATION && cachedRates) {
    console.log('[INFO] Kur verisi (USD ve EUR) cache\'den getirildi.');
    return cachedRates;
  }
  
  try {
    console.log('[INFO] Kur verisi (USD ve EUR) TCMB\'den alınıyor...');
    // TCMB'den XML verisini çek
    const response = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml');
    
    // XML'i JSON'a çevirmek için parser oluştur
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    // Para birimi listesini al
    const currencyList = result.Tarih_Date.Currency;

    // Hem USD hem de EUR kurunu buluyoruz.
    const usd = currencyList.find(c => c.$.CurrencyCode === 'USD');
    const eur = currencyList.find(c => c.$.CurrencyCode === 'EUR');

    // Eğer kurlar bulunamazsa hata fırlat.
    if (!usd || !eur) {
        throw new Error('USD veya EUR kuru TCMB verisinde bulunamadı.');
    }

    // Kur oranlarını formatla ve kaydet
    const rates = { 
      USD: parseFloat(usd.ForexSelling[0].replace(',', '.')),
      EUR: parseFloat(eur.ForexSelling[0].replace(',', '.')) 
    };
    
    // Cache'i güncelle
    cachedRates = rates;
    lastFetchTime = now;
    console.log('[INFO] Kur verisi başarıyla alınıp cache\'lendi:', cachedRates);
    return cachedRates;

  } catch (error) {
    console.error('getRatesLogic hatası:', error.message);
    // Hata durumunda, en azından bir varsayılan değer dönelim ki sistem çökmesin.
    return { USD: 32.5, EUR: 35.0 }; // Varsayılan değerler
  }
}

// Dışa aktarılacak ana fonksiyon: Kur oranlarını döndüren API endpoint'i
export const getExchangeRates = async (req, res) => {
  const rates = await getRatesLogic(); // Kur oranlarını al
  if (rates) {
    // Başarılı olursa 200 OK ve oranları gönder
    return res.status(200).json({ source: 'cache_or_tcmb', rates });
  } else {
    // Hata olursa 500 Internal Server Error gönder
    return res.status(500).json({ message: 'Kur verisi alınamadı' });
  }
};

export { getRatesLogic }; 
