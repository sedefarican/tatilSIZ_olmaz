import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!email.includes('@')) {
      setError(t('forgot.invalid_email'));
      setMessage('');
      return;
    }

    if (!storedUser || storedUser.email !== email) {
      setError(t('forgot.email_not_found'));
      setMessage('');
      return;
    }

    setMessage(t('forgot.success_message'));
    setError('');
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
