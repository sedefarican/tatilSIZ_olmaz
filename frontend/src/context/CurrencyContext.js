import React, { createContext, useState, useEffect } from 'react';

// 1. Context'i (Bankayı) oluştur
export const CurrencyContext = createContext();

// 2. Provider'ı (Banka şubesini) oluştur. Bu, tüm uygulamayı saracak.
export const CurrencyProvider = ({ children }) => {
  // State'i, başlangıç değerini localStorage'den alarak oluşturuyoruz
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'TRY');

  // Currency state'i her değiştiğinde, yeni değeri localStorage'e yaz.
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    // 'currency' değerini ve onu değiştirecek 'setCurrency' fonksiyonunu tüm çocuklara sun
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};