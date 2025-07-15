import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import MapView from './MapView';
import SearchBar from './SearchBar';

export default function ResultPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const effectRan = useRef(false);

  const searchState = location.state || {};
  const initialLocation = searchState.hotel || 'Antalya';
  const initialCheckIn = searchState.checkIn || new Date().toISOString().slice(0, 10);
  const initialCheckOut = searchState.checkOut || (() => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().slice(0, 10);
  })();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(22000);
  const [stayType, setStayType] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialLocation);
  const [feature, setFeature] = useState(''); // "Özellik" için state
  const [payment, setPayment] = useState(''); // "Ödeme" için state
  const [showPricePopup, setShowPricePopup] = useState(false);

  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
    'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
    'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
    'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep',
    'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'Mersin', 'İstanbul',
    'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
    'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin',
    'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun',
    'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
    'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt',
    'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır',
    'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ];

  const fetchHotels = async (searchParams) => {
    setLoading(true);
    try {
      console.log("API'ye gönderilen istek parametreleri:", searchParams);
      const res = await axios.get('http://localhost:5000/api/hotels', { params: searchParams });
      // Gelen verinin bir array olduğundan emin olalım.
      setHotels(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Otel verisi alınamadı:', err);
      setHotels([]);
    }
    setLoading(false);
  };

  const handleFilterClick = () => {
    const searchParams = {
      minPrice,
      maxPrice,
      stayType,
      location: selectedCity,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
    };
    fetchHotels(searchParams);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && effectRan.current === true) {
      return;
    }

    const initialSearchParams = {
      minPrice,
      maxPrice,
      stayType,
      location: initialLocation,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
    };
    fetchHotels(initialSearchParams);

    return () => {
      effectRan.current = true;
    };
  }, [location.state]);

  return (
    <div className="results-page-column">
      <SearchBar hotel={initialLocation} checkIn={initialCheckIn} checkOut={initialCheckOut} />

      {/* --- FİLTRE ÇUBUĞU - İÇİ DOLDURULMUŞ HALİ --- */}
      <div className="filter-bar">
        {/* Fiyat Filtresi */}
        <div className="filter-block price-filter-wrapper">
          <label>{t('resultPage.price')}</label>
          <div className="fake-input" onClick={() => setShowPricePopup(!showPricePopup)}>
            ₺{minPrice} - ₺{maxPrice}
          </div>
          {showPricePopup && (
            <div className="price-popup">
              <h4>{t('resultPage.setPriceRange')}</h4>
              <div className="range-wrapper">
                <input type="range" min="50" max="22000" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
                <input type="range" min="50" max="22000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
              </div>
              <div className="price-inputs"><input type="text" value={`₺${minPrice}`} readOnly /><input type="text" value={`₺${maxPrice}`} readOnly /></div>
              <div className="price-popup-actions"><button className="cancel" onClick={() => setShowPricePopup(false)}>{t('common.no')}</button><button className="apply" onClick={() => setShowPricePopup(false)}>{t('common.yes')}</button></div>
            </div>
          )}
        </div>

        {/* Özellik Filtresi */}
        <div className="filter-block">
          <label>{t('resultPage.feature')}</label>
          <select value={feature} onChange={(e) => setFeature(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="wifi">Ücretsiz Wi-Fi</option>
            <option value="havuz">Havuz</option>
            <option value="spa">Spa</option>
            <option value="otopark">Otopark</option>
          </select>
        </div>

        {/* Ödeme Tipi Filtresi */}
        <div className="filter-block">
          <label>{t('resultPage.payment')}</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="tesiste-odeme">Tesiste Ödeme</option>
            <option value="ucretsiz-iptal">Ücretsiz İptal</option>
          </select>
        </div>

        {/* Konaklama Tipi Filtresi */}
        <div className="filter-block">
          <label>{t('resultPage.stayType')}</label>
          <select value={stayType} onChange={(e) => setStayType(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="Otel">Otel</option>
            <option value="Apart">Apart Otel</option>
            <option value="Pansiyon">Pansiyon</option>
            <option value="Herşey Dahil">Herşey Dahil</option>
          </select>
        </div>
        
        {/* Lokasyon Filtresi */}
        <div className="filter-block">
          <label>{t('resultPage.location')}</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">{t('common.select')}</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        {/* Filtrele Butonu */}
        <div className="filter-block">
          <label style={{ visibility: 'hidden' }}>Filtrele</label>
          <button className="apply" onClick={handleFilterClick}>{t('resultPage.applyFilter')}</button>
        </div>
      </div>
      
      {/* Sonuçların Gösterildiği Alan (Değişiklik yok) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
        <div style={{
          width: '50%', maxHeight: '500px', overflowY: 'auto',
          backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: '8px', padding: '16px'
        }}>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : hotels.length === 0 ? (
            <p>Sonuç bulunamadı.</p>
          ) : (
            hotels.map((hotel, index) => {
              const image = hotel.cardPhotos?.[0]?.sizes?.urlTemplate?.replace('{width}', '200').replace('{height}', '200');
              return (
                <div key={hotel.id || index} style={{ display: 'flex', marginBottom: '16px', gap: '12px' }}>
                  <img
                    src={image || 'https://via.placeholder.com/100'}
                    alt={hotel.title}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '4px' }}>{hotel.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>{hotel.bubbleRating?.rating} ★ ({hotel.bubbleRating?.count} yorum)</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                      <strong>{hotel.priceForDisplay || 'Fiyat bilgisi yok'}</strong>
                    </p>
                    <button style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#0071c2', color: 'white', border: 'none', borderRadius: '4px' }}>
                      Fiyatları Görün
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Harita Alanı (Değişiklik yok) */}
        <div style={{ width: '50%' }}>
          <MapView
            hotels={hotels.map(h => ({
              name: h.title,
              price: h.priceForDisplay || '',
              coords: h.mapWidget?.location?.latLong ? [h.mapWidget.location.latLong.latitude, h.mapWidget.location.latLong.longitude] : [36.8969, 30.7133]
            }))}
          />
        </div>
      </div>
    </div>
  );
}