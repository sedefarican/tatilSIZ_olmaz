import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

  const handleRegister = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = form;

    if (!firstName || !lastName || !email.includes('@') || password.length < 6) {
      setErrorMsg(t('register.invalidInput'));
      setSuccessMsg('');
      return;
    }

    const userData = { firstName, lastName, email, password };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    setSuccessMsg(t('register.success'));
    setErrorMsg('');

    setTimeout(() => {
      navigate('/');
    }, 2000);
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
