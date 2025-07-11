import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DeleteAccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm'); // confirm | success | cancel

  const handleConfirm = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.email) {
      setStep('cancel');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: storedUser.email })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        setStep('success');
      } else {
        console.error(result.message);
        setStep('cancel');
      }
    } catch (err) {
      console.error('Silme isteği başarısız:', err);
      setStep('cancel');
    }
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
