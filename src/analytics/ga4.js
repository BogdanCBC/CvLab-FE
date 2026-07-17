const measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID;

let initialized = false;

const gtag = (...args) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

export const initGA4 = () => {
  if (!measurementId || initialized) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: false });
  initialized = true;
};

export const trackPageView = (pageName, properties) => {
  if (!initialized) return;
  gtag('event', 'page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...properties,
  });
};

export const trackEvent = (eventName, properties) => {
  if (!initialized) return;
  gtag('event', eventName, properties);
};
