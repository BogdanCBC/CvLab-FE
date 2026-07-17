import React, { useEffect, useState } from 'react';
import './CookieConsent.scss';
import { useTranslation } from 'react-i18next';
import { getStoredConsent, setConsent, trackPageView } from '../../analytics';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getStoredConsent());
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    trackPageView('Landing Page');
    setVisible(false);
  };

  const handleReject = () => {
    setConsent('rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label={t('landing.cookieConsent.title', 'We value your privacy')}>
      <div className="cookie-consent__card">
        <div className="cookie-consent__text">
          <span className="cookie-consent__title">{t('landing.cookieConsent.title', 'We value your privacy')}</span>
          <p className="cookie-consent__description">
            {t(
              'landing.cookieConsent.description',
              'We use cookies to understand how visitors use adorCV and to improve your experience. You can accept or reject non-essential cookies at any time.'
            )}
          </p>
        </div>
        <div className="cookie-consent__actions">
          <button type="button" className="cookie-consent__reject" onClick={handleReject}>
            {t('landing.cookieConsent.reject', 'Reject')}
          </button>
          <button type="button" className="cookie-consent__accept" onClick={handleAccept}>
            {t('landing.cookieConsent.accept', 'Accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
