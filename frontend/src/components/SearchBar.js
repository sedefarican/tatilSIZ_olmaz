import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../App.css';
import GuestSelector from './GuestSelector';

export default function SearchBar() {
  const { t } = useTranslation();
  const [hotel, setHotel] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate('/results', {
      state: {
        hotel,
        checkIn,
        checkOut,
      },
    });
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <div className="search-box">
        {/* Otel */}
        <div className="hotel-input">
          <small>{t('search.hotelLabel')}</small>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaSearch size={16} />
            <input
              type="text"
              placeholder={t('search.hotelPlaceholder')}
              value={hotel}
              onChange={(e) => setHotel(e.target.value)}
            />
          </div>
        </div>

        {/* Giriş */}
        <div className="date-selector">
          <small>{t('check_in')}</small>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaCalendarAlt size={14} />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ border: 'none', outline: 'none', fontWeight: 'bold', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Çıkış */}
        <div className="date-selector">
          <small>{t('check_out')}</small>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaCalendarAlt size={14} />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ border: 'none', outline: 'none', fontWeight: 'bold', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Misafir */}
        <GuestSelector />

        {/* Ara butonu */}
        <button className="search-button" type="submit">
          {t('search.searchButton')}
        </button>
      </div>
    </form>
  );
}