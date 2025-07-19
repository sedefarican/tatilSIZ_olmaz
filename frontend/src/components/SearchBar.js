import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import GuestSelector from './GuestSelector';

export default function SearchBar({ initialValues = {} }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State'ler, dışarıdan gelen başlangıç değerlerini veya boş string'i kullanır
  const [hotel, setHotel] = useState(initialValues.location || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tarihlerin boş gitmesini engellemek için son bir kontrol
    const finalCheckIn = checkIn || new Date().toISOString().slice(0, 10);
    const finalCheckOut = checkOut || (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().slice(0, 10);
    })();

    // Veriyi ResultPage'e state olarak gönder
    navigate('/results', {
      state: {
        hotel: hotel || 'Antalya', // Şehir boşsa Antalya'ya git
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
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

        <GuestSelector />
        <button className="search-button" type="submit">{t('search.searchButton')}</button>
      </div>
    </form>
  );
}