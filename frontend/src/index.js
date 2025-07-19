import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import i18n from "./i18n"; // i18n örneğini import ediyoruz
import { I18nextProvider } from "react-i18next";
import { CurrencyProvider } from "./context/CurrencyContext"; // Bizim oluşturduğumuz Provider

// Sadece BİR TANE root oluşturuyoruz
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Dış Provider (Dil). Bu, içindeki her şeye dil özelliklerini sağlar. */}
    <I18nextProvider i18n={i18n}>
      {/* İç Provider (Para Birimi). Bu da içindeki her şeye para birimi özelliklerini sağlar. */}
      <CurrencyProvider>
        {/* En içte de asıl uygulamamız var. Artık hem dil hem de para birimi özelliklerine sahip. */}
        <App />
      </CurrencyProvider>
    </I18nextProvider>
  </React.StrictMode>
);
