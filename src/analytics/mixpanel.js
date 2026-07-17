import mixpanel from 'mixpanel-browser';

const token = process.env.REACT_APP_MIXPANE_TOKEN;

let initialized = false;

export const initMixpanel = () => {
  if (!token || initialized) return;
  mixpanel.init(token, {
    api_host: 'https://api-eu.mixpanel.com',
    track_pageview: false,
    persistence: 'localStorage',
  });
  initialized = true;
};

export const trackPageView = (pageName, properties) => {
  if (!initialized) return;
  mixpanel.track('page_view', { page: pageName, ...properties });
};

export const trackEvent = (eventName, properties) => {
  if (!initialized) return;
  mixpanel.track(eventName, properties);
};
