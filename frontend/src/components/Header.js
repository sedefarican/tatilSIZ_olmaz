import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('lang') || i18n.language);
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('currency') || 'TRY');

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(status);
  }, [location]); // sayfa değiştikçe kontrol et

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
    setShowLogoutConfirm(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    setDropdownOpen(false);
    setLogoutSuccess(true);
    setIsLoggedIn(false);

    setTimeout(() => {
      setLogoutSuccess(false);
      navigate('/login');
    }, 2000);
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleLanguageApply = () => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('lang', selectedLang);
    localStorage.setItem('currency', selectedCurrency);
    setShowLangModal(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <Link to="/">
        <img src="/assets/logo.png" alt="Siz Logo" className="site-logo" />
      </Link>

      <nav className="nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          🏠 {t('Home')}
        </Link>

        <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
          ❤️ {t('favorites.link_fav')}
        </Link>

        <button
          onClick={() => setShowLangModal(true)}
          className="lang-button"
        >
          🌐 {i18n.language.toUpperCase()} · {selectedCurrency}
        </button>

        {!isLoggedIn && (
          <Link to="/login" className="nav-link no-border">
            🔐 {t('login.title')}
          </Link>
        )}

        {isLoggedIn && (
          <div className="menu-dropdown">
            <span onClick={toggleDropdown} className="nav-link">
              📂 {t('header.menu')} ▾
            </span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/update-account">⚙️ {t('header.updateAccount')}</Link>
                <Link to="/delete-account">🗑️ {t('header.deleteAccount')}</Link>
                <button onClick={() => setShowLogoutConfirm(true)}>🚪 {t('header.logout')}</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {showLangModal && (
        <div className="overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{t('header.languageAndCurrency')}</h3>
              <button onClick={() => setShowLangModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <label>{t('language')}</label>
              <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>

              <label>{t('currency')}</label>
              <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                <option value="TRY">TRY - Türk Lirası</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <button className="apply-button" onClick={handleLanguageApply}>{t('header.apply')}</button>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="logout-confirm">
          <p>{t('header.logoutConfirm')}</p>
          <div className="button-group">
            <button onClick={confirmLogout} className="confirm-btn">{t('header.yes')}</button>
            <button onClick={cancelLogout} className="cancel-btn">{t('header.no')}</button>
          </div>
        </div>
      )}

      {logoutSuccess && (
        <div className="logout-message">{t('header.logoutSuccess')}</div>
      )}
    </header>
  );
}
