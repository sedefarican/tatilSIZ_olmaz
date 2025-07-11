import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored?.email) {
      setUserEmail(stored.email);
      fetchFavorites(stored.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = async (email) => {
    try {
      const res = await axios.get('http://localhost:5000/api/favorites', {
        params: { userEmail: email },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error('Favoriler alınamadı:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorites-page">
      {/* Sol Menü */}
      <aside className="favorites-sidebar">
        <div className="sidebar-top" />
        <nav className="sidebar-nav">
          <Link to="/remove-from-favorites">💔 {t('favorites.remove')}</Link>
          <Link to="/add-to-favorites" className="active">❤ {t('favorites.add')}</Link>
          <Link to="/add-to-favorites">➕ {t('favorites.new_list')}</Link>
        </nav>
      </aside>

      {/* İçerik */}
      <main className="favorites-main">
        <header className="favorites-header">
          <div>
            <h1>{t('favorites.title')}</h1>
            <p>{favorites.length} {t('favorites.list_label')}</p>
          </div>
        </header>

        {loading ? (
          <p>{t('common.loading') || 'Yükleniyor...'}</p>
        ) : favorites.length === 0 ? (
          <p>{t('favorites.empty') || 'Hiç favori oteliniz yok.'}</p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((fav, index) => (
              <div key={index} className="favorite-card">
                <img
                  src={fav.image || 'https://via.placeholder.com/100'}
                  alt={fav.hotelTitle}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <div>
                  <h3>{fav.hotelTitle}</h3>
                  <p>{fav.price}</p>
                  <Link to="/remove-from-favorites">
                    <button style={{ marginTop: '8px' }}>
                      💔 {t('favorites.remove')}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
