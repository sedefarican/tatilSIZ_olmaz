import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DateSelector() {
  const { t } = useTranslation();

  return (
    <div className="date-selector">
      <div>
        <small>{t('check_in')}</small>
        <p>Pzt, 28.04.25</p>
      </div>
      <div>
        <small>{t('check_out')}</small>
        <p>Cum, 02.05.25</p>
      </div>
 </div>
 );
}