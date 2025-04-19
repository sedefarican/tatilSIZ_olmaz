import React from 'react';


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} SIZ App. Tüm hakları saklıdır.</p>
        <div className="footer-links">
          <a href="/about">Hakkımızda</a>
          <a href="/contact">İletişim</a>
          <a href="/privacy">Gizlilik</a>
        </div>
      </div>
    </footer>
  );
}
