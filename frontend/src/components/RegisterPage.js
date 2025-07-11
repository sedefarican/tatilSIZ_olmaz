import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = form;

    // Basit frontend doğrulama
    if (!firstName || !lastName || !email.includes('@') || password.length < 6) {
      setErrorMsg(t('register.invalidInput'));
      setSuccessMsg('');
      return;
    }

    try {
      // Backend'e kayıt isteği gönder
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        firstName,
        lastName,
        email,
        password
      });

      setSuccessMsg(t('register.success'));
      setErrorMsg('');

      // Başarılı kayıt sonrası yönlendirme
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMsg('Bu e-mail zaten kayıtlı.');
      } else {
        setErrorMsg('Kayıt başarısız.');
      }
      setSuccessMsg('');
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>{t('register.title')}</h1>
        <form onSubmit={handleRegister}>
          <label htmlFor="firstName">{t('register.firstName')}</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">{t('register.lastName')}</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">{t('register.email')}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">{t('register.password')}</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}

          <button type="submit" className="register-button">{t('register.button')}</button>
        </form>

        <p className="login-text">
          {t('register.haveAccount')} <a href="/login">{t('register.login')}</a>
        </p>
      </div>
    </div>
  );
}
