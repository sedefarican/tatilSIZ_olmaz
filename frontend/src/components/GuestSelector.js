import React, { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function GuestSelector() {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [petFriendly, setPetFriendly] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const reset = () => {
    setAdults(2);
    setChildren(0);
    setRooms(1);
    setPetFriendly(false);
  };

  const totalGuests = adults + children;

  return (
    <div className="guest-selector" style={{ position: 'relative' }}>
      <small>{t('guest.label')}</small>
      <div
        onClick={toggleDropdown}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
      >
        <FaUserFriends size={16} />
        <p>{t('guest.summary', { guests: totalGuests, rooms })}</p>
      </div>

      {showDropdown && (
        <div className="dropdown-panel">
          {/* Yetişkin */}
          <div className="row">
            <label>{t('guest.adults')}</label>
            <div className="counter">
              <button onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
              <span>{adults}</span>
              <button onClick={() => setAdults(adults + 1)}>+</button>
            </div>
          </div>

          {/* Çocuk */}
          <div className="row">
            <label>{t('guest.children')}</label>
            <div className="counter">
              <button onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
              <span>{children}</span>
              <button onClick={() => setChildren(children + 1)}>+</button>
            </div>
          </div>

          {/* Oda */}
          <div className="row">
            <label>{t('guest.rooms')}</label>
            <div className="counter">
              <button onClick={() => setRooms(Math.max(1, rooms - 1))}>−</button>
              <span>{rooms}</span>
              <button onClick={() => setRooms(rooms + 1)}>+</button>
            </div>
          </div>

          <hr />

          {/* Evcil Hayvan */}
          <div className="row checkbox-row">
            <input
              type="checkbox"
              checked={petFriendly}
              onChange={() => setPetFriendly(!petFriendly)}
            />
            <div>
              <strong>{t('guest.pet_friendly_title')}</strong><br />
              <small>{t('guest.pet_friendly_note')}</small>
            </div>
          </div>

          <div className="actions">
            <button className="reset" onClick={reset}>
              {t('guest.reset')}
            </button>
            <button className="apply" onClick={toggleDropdown}>
              {t('guest.apply')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}