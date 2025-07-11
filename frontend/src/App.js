import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ResultPage from './components/ResultPage';
import FavoritesPage from './components/FavoritesPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdateAccountPage from './components/UpdateAccountPage';
import DeleteAccountPage from './components/DeleteAccountPage';
import AddtoFavorites from './components/AddtoFavorites';
import RemoveFavorites from './components/RemoveFavorites';
import FloatingAssistant from './components/FloatingAssistant';
import Footer from './components/Footer';
import PrivateRoute from './routes/PrivateRoute';

import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <Header />
      <FloatingAssistant />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>{t('promo.headline')}</h1>
                <p>{t('promo.subtext')}</p>
                <SearchBar />
              </>
            }
          />
          <Route path="/results" element={<ResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Giriş yapmış kullanıcılar için korumalı sayfalar */}
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-account"
            element={
              <PrivateRoute>
                <UpdateAccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/delete-account"
            element={
              <PrivateRoute>
                <DeleteAccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-to-favorites"
            element={
              <PrivateRoute>
                <AddtoFavorites />
              </PrivateRoute>
            }
          />
          <Route
            path="/remove-from-favorites"
            element={
              <PrivateRoute>
                <RemoveFavorites />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
