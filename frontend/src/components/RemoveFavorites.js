import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RemoveFromFavoritesPage() {
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

  const handleRemove = async (hotelId) => {
    try {
      await axios.delete('http://localhost:5000/api/favorites/remove', {
        data: { userEmail, hotelId },
      });
      setFavorites((prev) => prev.filter((fav) => fav.hotelId !== hotelId));
    } catch (err) {
      console.error('Silme hatası:', err.message);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  if (!userEmail) return <p>Giriş yapmadan favorileri göremezsiniz.</p>;

  return (
    <div className="favorites-list">
      <h2>💔 Favorilerden Kaldır</h2>
      {favorites.length === 0 ? (
        <p>Favori otel bulunamadı.</p>
      ) : (
        favorites.map((fav, index) => (
          <div key={index} className="favorite-card">
            <img
              src={fav.image || 'https://via.placeholder.com/100'}
              alt={fav.hotelTitle}
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
            <div>
              <h3>{fav.hotelTitle}</h3>
              <p>{fav.price}</p>
              <button onClick={() => handleRemove(fav.hotelId)}>Kaldır</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
