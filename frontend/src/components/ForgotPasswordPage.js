import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError(t('forgot.invalid_email'));
      setMessage('');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      setMessage(res.data.message);  // Backend'den gelen başarı mesajı
      setError('');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('forgot.error_generic'));
      }
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-box">
        <h1>{t('forgot.title')}</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">{t('forgot.label')}</label>
          <input
            type="email"
            id="email"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" className="reset-button">
            {t('forgot.send')}
          </button>
        </form>
      </div>
    </div>
  );
}
