import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import MapView from './MapView';

export default function ResultPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { hotel, checkIn, checkOut } = location.state || {};

  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(22000);
  const [filter, setFilter] = useState('');
  const [payment, setPayment] = useState('');
  const [stayType, setStayType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showFilterResultBox, setShowFilterResultBox] = useState(false);

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
  

  const applyPriceFilter = () => {
    setShowPricePopup(false);
  };

  const handleFullFilter = () => {
    setShowFilterResultBox(true);
  };

  return (
    <div className="results-page-column">
      <SearchBar
        hotel={hotel}
        checkIn={checkIn}
        checkOut={checkOut}
        guests="2 Misafir, 1 Oda"
      />

      <div className="filter-bar">
        {/* Fiyat */}
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

        {/* Özellik */}
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

        {/* Ödeme */}
        <div className="filter-block">
          <label>{t('resultPage.payment')}</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">{t('common.select')}</option>
            <option value="pesin">{t('resultPage.cash')}</option>
            <option value="kredi">{t('resultPage.card')}</option>
            <option value="iptal">{t('resultPage.cancelable')}</option>
          </select>
        </div>

        {/* Konaklama */}
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

        {/* Konum */}
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
        {showFilterResultBox && (
          <div style={{ width: '50%', height: '400px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '16px' }}>
            {t('resultPage.placeholder')}
          </div>
        )}
        <div style={{ width: '50%' }}>
          <MapView
            hotels={[
              { name: 'Megasaray Westbeach Antalya', price: 9845, coords: [36.8595, 30.6189] },
              { name: 'Royal Loft Suit', price: 3107, coords: [36.8609, 30.6201] },
            ]}
          />
        </div>
      </div>
    </div>
  );
}