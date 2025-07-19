// RemoveFromFavoritesPage.js DOSYASININ SON VE DOĞRU HALİ

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RemoveFromFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Kullanıcı bilgisini localStorage'dan alıyoruz, bu kısım doğru.
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored?.email) {
      setUserEmail(stored.email);
      fetchFavorites(stored.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = async (email) => {
    setLoading(true);
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
    // Eğer hotelId yoksa veya kullanıcı bilgisi yoksa işlemi durdur.
    if (!hotelId || !userEmail) {
      console.error("Silme işlemi için Hotel ID veya User Email eksik.");
      return;
    }
    
    try {
      // --- ANA DEĞİŞİKLİK BURADA ---
      // ESKİ HALİ: axios.delete('.../remove', { data: { userEmail, hotelId } });
      // YENİ VE DOĞRU HALİ: URL'ye hotelId'yi ekliyoruz ve body'de sadece userEmail gönderiyoruz.
      await axios.delete(`http://localhost:5000/api/favorites/${hotelId}`, {
        data: { userEmail }, 
      });

      // Silme işlemi başarılı olunca, favori listesini lokal olarak güncelliyoruz.
      // Bu, sayfa yenilemeden otelin anında kaybolmasını sağlar.
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.hotelId !== hotelId));

    } catch (err) {
      console.error('Silme hatası:', err.response ? err.response.data : err.message);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!userEmail) return <p>Giriş yapmadan favorileri göremezsiniz.</p>;

  return (
    <div className="favorites-list" style={{ padding: '20px' }}>
      <h2>💔 Favorilerden Kaldır</h2>
      {favorites.length === 0 ? (
        <p>Kaldırılacak favori otel bulunamadı.</p>
      ) : (
        favorites.map((fav, index) => (
          <div key={index} className="favorite-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
            <img
              src={fav.image || 'https://via.placeholder.com/100'}
              alt={fav.hotelTitle}
              style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
            />
            <div style={{ flex: 1 }}>
              <h3>{fav.hotelTitle}</h3>
              <p>{fav.price}</p>
            </div>
            <button 
              onClick={() => handleRemove(fav.hotelId)} 
              style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Kaldır
            </button>
          </div>
        ))
      )}
    </div>
  );
}