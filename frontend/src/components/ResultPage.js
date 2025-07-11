import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import MapView from './MapView';
import SearchBar from './SearchBar';

export default function ResultPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { hotel, checkIn, checkOut } = location.state || {};

  const [hotels, setHotels] = useState([]);
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(22000);
  const [filter, setFilter] = useState('');
  const [payment, setPayment] = useState('');
  const [stayType, setStayType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showFilterResultBox, setShowFilterResultBox] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/hotels', {
        params: {
          minPrice,
          maxPrice,
          stayType,
          location: selectedCity,
          checkIn,
          checkOut,
        },
      });
      setHotels(res.data.data);
    } catch (err) {
      console.error('Otel verisi alınamadı:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const applyPriceFilter = () => {
    setShowPricePopup(false);
  };

  const handleFullFilter = () => {
    fetchHotels();
    setShowFilterResultBox(true);
  };

  return (
    <div className="results-page-column">
      <SearchBar hotel={hotel} checkIn={checkIn} checkOut={checkOut} guests="2 Misafir, 1 Oda" />

      <div className="filter-bar">
        <div className="filter-block price-filter-wrapper">
          <label>{t('resultPage.price')}</label>
          <div className="fake-input" onClick={() => setShowPricePopup(!showPricePopup)}>
            ₺{minPrice} - ₺{maxPrice}
          </div>
          {showPricePopup && (
            <div className="price-popup">
              <h4>{t('resultPage.setPriceRange')}</h4>
              <div className="price-toggle">
                <button className="active">{t('resultPage.nightly')}</button>
                <button>{t('resultPage.total')}</button>
              </div>
              <div className="range-wrapper">
                <input type="range" min="50" max="22000" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
                <input type="range" min="50" max="22000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
              </div>
              <div className="price-inputs">
                <input type="text" value={`₺${minPrice}`} readOnly />
                <input type="text" value={`₺${maxPrice}`} readOnly />
              </div>
              <div className="price-popup-actions">
                <button className="cancel" onClick={() => setShowPricePopup(false)}>{t('common.no')}</button>
                <button className="apply" onClick={applyPriceFilter}>{t('common.yes')}</button>
              </div>
            </div>
          )}
        </div>

        <div className="filter-block">
          <label>{t('resultPage.feature')}</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="kahvalti">{t('resultPage.breakfast')}</option>
            <option value="spa">{t('resultPage.spa')}</option>
            <option value="wifi">{t('resultPage.wifi')}</option>
            <option value="otopark">{t('resultPage.parking')}</option>
          </select>
        </div>

        <div className="filter-block">
          <label>{t('resultPage.payment')}</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="pesin">{t('resultPage.cash')}</option>
            <option value="kredi">{t('resultPage.card')}</option>
            <option value="iptal">{t('resultPage.cancelable')}</option>
          </select>
        </div>

        <div className="filter-block">
          <label>{t('resultPage.stayType')}</label>
          <select value={stayType} onChange={(e) => setStayType(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="otel">{t('resultPage.hotel')}</option>
            <option value="villa">{t('resultPage.villa')}</option>
            <option value="apart">{t('resultPage.apart')}</option>
            <option value="bungalov">{t('resultPage.bungalow')}</option>
          </select>
        </div>

        <div className="filter-block">
          <label>{t('resultPage.location')}</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">{t('common.select')}</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="filter-block">
          <label style={{ visibility: 'hidden' }}>Filtrele</label>
          <button className="apply" onClick={handleFullFilter}>{t('resultPage.applyFilter')}</button>
        </div>
      </div>

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
            hotels.slice(0, 5).map((hotel, index) => {
              const image = hotel.cardPhotos?.[0]?.sizes?.urlTemplate?.replace('{width}', '100').replace('{height}', '100');
              return (
                <div key={index} style={{ display: 'flex', marginBottom: '16px', gap: '12px' }}>
                  <img
                    src={image || 'https://via.placeholder.com/100'}
                    alt={hotel.title}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '4px' }}>{hotel.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>{hotel.bubbleRating?.rating} ★ ({hotel.bubbleRating?.count} yorum)</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                      <strong>{hotel.priceForDisplay || 'Fiyat bilgisi yok'}</strong>
                    </p>
                    <button style={{
                      marginTop: '8px', padding: '6px 12px',
                      backgroundColor: '#0071c2', color: 'white',
                      border: 'none', borderRadius: '4px'
                    }}>
                      Fiyatları Görün
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ width: '50%' }}>
          <MapView
            hotels={hotels.slice(0, 5).map(h => ({
              name: h.title,
              price: h.priceForDisplay || '',
              coords: [36.86, 30.62] // dummy coord
            }))}
          />
        </div>
      </div>
    </div>
  );
}
