
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes('@') || password.length < 6) {
      setErrorMsg(t('login.invalidInput'));
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // ✅ Başarılı giriş → veriyi localStorage’a kaydet
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('isLoggedIn', 'true');

      setErrorMsg('');
      navigate('/'); // ✅ Anasayfaya yönlendir
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMsg(t('login.wrongCredentials'));
      } else {
        setErrorMsg(t('login.error') || 'Giriş başarısız.');
      }
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
