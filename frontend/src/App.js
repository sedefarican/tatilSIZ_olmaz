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
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-account" element={<UpdateAccountPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />
          <Route path="/remove-from-favorites" element={<RemoveFavorites />} />
          <Route path="/add-to-favorites" element={<AddtoFavorites />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
