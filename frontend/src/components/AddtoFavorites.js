import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddToFavoritesPage() {
  const [hotels, setHotels] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored?.email) setUserEmail(stored.email);
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hotels', {
        params: {
          location: 'İstanbul',
          checkIn: '2025-08-01',
          checkOut: '2025-08-07',
          minPrice: 0,
          maxPrice: 5000
        }
      });

      setHotels(res.data.data || []);
    } catch (err) {
      console.error('Otel verisi alınamadı:', err.message);
      setError('Otel verisi alınamadı.');
    }
  };

  const handleAddFavorite = async (hotel) => {
    if (!userEmail) {
      setError('Giriş yapmadan favori ekleyemezsiniz.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/favorites/add', {
        userEmail,
        hotelId: hotel.id || hotel.locationId,
        hotelTitle: hotel.title,
        price: hotel.priceForDisplay || 'Fiyat yok',
        image:
          hotel.cardPhotos?.[0]?.sizes?.urlTemplate
            ?.replace('{width}', '100')
            ?.replace('{height}', '100') || ''
      });

      setMessage(`${hotel.title} favorilere eklendi.`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
      setMessage('');
    }
  };

  return (
    <div className="favorites-add-box">
      <h2>❤ Favorilere Ekle</h2>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {hotels.length === 0 ? (
        <p>Yükleniyor veya otel bulunamadı.</p>
      ) : (
        hotels.slice(0, 5).map((hotel, index) => {
          const image =
            hotel.cardPhotos?.[0]?.sizes?.urlTemplate
              ?.replace('{width}', '100')
              ?.replace('{height}', '100') || 'https://via.placeholder.com/100';

          return (
            <div key={index} className="favorite-card" style={{ marginBottom: '20px' }}>
              <img
                src={image}
                alt={hotel.title}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h3>{hotel.title}</h3>
                <p>{hotel.priceForDisplay || 'Fiyat bilgisi yok'}</p>
                <button onClick={() => handleAddFavorite(hotel)}>Favorilere Ekle</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
