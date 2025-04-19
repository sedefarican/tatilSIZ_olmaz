import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { t } = useTranslation();

  return (
    <div className="favorites-page">
      {/* Sol Menü */}
      <aside className="favorites-sidebar">
        <div className="sidebar-top">
        </div>

        <nav className="sidebar-nav">
          <Link to="/remove-from-favorites">💔 {t('favorites.remove')}</Link>
          <Link to="/add-to-favorites" className="active">❤️ {t('favorites.add')}</Link>
          <Link to="/add-to-favorites">➕ {t('favorites.new_list')}</Link>
        </nav>
      </aside>

      {/* İçerik */}
      <main className="favorites-main">
        <header className="favorites-header">
          <div>
            <h1>{t('favorites.title')}</h1>
            <p>0/0 {t('favorites.list_label')}</p>
          </div>
        </header>
      </main>
    </div>
  );
}
