import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function UpdateAccountPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setForm({
        ...storedUser,
        phone: storedUser.phone || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = form;

    if (!firstName || !lastName || !email.includes('@') || password.length < 6) {
      setError(t('update.error'));
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('update.success'));
        setError('');
        localStorage.setItem('user', JSON.stringify(form));
      } else {
        setError(data.message || 'Güncelleme başarısız');
        setSuccess('');
      }
    } catch (err) {
      console.error('Hesap güncelleme hatası:', err);
      setError('Sunucu hatası');
      setSuccess('');
    }
  };

  return (
    <div className="update-account-page">
      <div className="update-box">
        <h1>{t('update.title')}</h1>
        <form onSubmit={handleSubmit}>
          <label>{t('update.firstName')}</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label>{t('update.lastName')}</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <label>{t('update.email')}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>{t('update.password')}</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>{t('update.phone')}</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="05xx xxx xx xx"
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="update-button">
            {t('update.save')}
          </button>
        </form>
      </div>
    </div>
  );
}
