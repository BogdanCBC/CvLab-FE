const CONSENT_KEY = 'cookie_consent';

export const getStoredConsent = () => localStorage.getItem(CONSENT_KEY);

export const storeConsent = (status) => {
  localStorage.setItem(CONSENT_KEY, status);
};
