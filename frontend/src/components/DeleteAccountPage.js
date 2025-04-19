import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DeleteAccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm'); // confirm | success | cancel

  const handleConfirm = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setStep('success');
  };

  const handleCancel = () => {
    setStep('cancel');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="delete-account-page">
      {step === 'confirm' && (
        <div className="delete-box">
          <h1>{t('delete_account.confirm_message')}</h1>
          <div className="button-group">
            <button className="confirm-btn" onClick={handleConfirm}>
              {t('common.yes')}
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              {t('common.no')}
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="delete-box">
          <h2>✅ {t('delete_account.success_message')}</h2>
        </div>
      )}

      {step === 'cancel' && (
        <div className="delete-box">
          <h2>❌ {t('delete_account.cancel_message')}</h2>
        </div>
      )}
    </div>
  );
}
