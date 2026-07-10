import React from 'react';
import './PricingSection.scss';
import { useTranslation } from 'react-i18next';

const STATS = ['companies', 'implementation', 'trial'];

const PricingSection = () => {
  const { t } = useTranslation();

  const goToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="pricing-section">
      <span className="pricing-section__eyebrow">{t('landing.pricing.eyebrow', 'Pricing')}</span>
      <h2 className="pricing-section__title">{t('landing.pricing.title', 'Pricing tailored to every team')}</h2>
      <p className="pricing-section__subtitle">
        {t(
          'landing.pricing.subtitle',
          "We don't believe in rigid plans. We build a custom offer based on your team size and the specific needs of your organization."
        )}
      </p>

      <div className="pricing-section__card">
        <div className="pricing-section__cta">
          <button type="button" className="pricing-section__quote-btn" onClick={goToContact}>
            {t('landing.pricing.cta', 'Request a quote')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33334M12.6667 8L8.00001 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="pricing-section__cta-note">{t('landing.pricing.ctaNote', 'We respond in less than 24 hours')}</span>
        </div>

        <div className="pricing-section__divider" />

        <div className="pricing-section__stats">
          {STATS.map((key) => (
            <div key={key} className="pricing-section__stat">
              <span className="pricing-section__stat-value">{t(`landing.pricing.stats.${key}.value`)}</span>
              <span className="pricing-section__stat-label">{t(`landing.pricing.stats.${key}.label`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
