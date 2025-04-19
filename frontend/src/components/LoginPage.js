import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.includes('@') || password.length < 6) {
      setErrorMsg(t('login.invalidInput'));
      return;
    }

    if (email === 'demo@demo.com' && password === '123456') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/');
    } else {
      setErrorMsg(t('login.wrongCredentials'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>{t('login.title')}</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">{t('login.email')}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            required
          />

          <label htmlFor="password">{t('login.password')}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
          />

          <p className="forgot-password-text">
            <Link to="/forgot-password">{t('login.forgot')}</Link>
          </p>

          {errorMsg && <p className="error">{errorMsg}</p>}

          <button type="submit" className="login-button">{t('login.button')}</button>
        </form>

        <p className="register-text">
          {t('login.noAccount')} <Link to="/register">{t('login.register')}</Link>
        </p>
      </div>
    </div>
  );
}
