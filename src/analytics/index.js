import { getStoredConsent, storeConsent } from './consent';
import { initMixpanel, trackPageView as trackMixpanelPageView, trackEvent as trackMixpanelEvent } from './mixpanel';
import { initGA4, trackPageView as trackGA4PageView, trackEvent as trackGA4Event } from './ga4';

const initAll = () => {
  initMixpanel();
  initGA4();
};

if (getStoredConsent() === 'accepted') {
  initAll();
}

export { getStoredConsent };

export const setConsent = (status) => {
  storeConsent(status);
  if (status === 'accepted') initAll();
};

export const trackPageView = (pageName, properties) => {
  trackMixpanelPageView(pageName, properties);
  trackGA4PageView(pageName, properties);
};

export const trackEvent = (eventName, properties) => {
  trackMixpanelEvent(eventName, properties);
  trackGA4Event(eventName, properties);
};
