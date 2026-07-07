import React, { useState } from 'react';
import './FaqSection.scss';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from '../../../constants/icons';

const FAQ_KEYS = ['onboarding', 'dataSafety', 'integration', 'exportFormats', 'formattingSpeed'];

const FaqSection = () => {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState(() => new Set());

  const toggle = (key) => {
    setOpenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <section id="faq" className="faq-section">
      <span className="faq-section__eyebrow">{t('landing.faq.eyebrow', 'FAQ')}</span>
      <h2 className="faq-section__title">{t('landing.faq.title', 'Frequently asked questions')}</h2>

      <div className="faq-section__list">
        {FAQ_KEYS.map((key) => {
          const isOpen = openKeys.has(key);
          return (
            <div key={key} className={`faq-section__item${isOpen ? ' open' : ''}`}>
              <button
                type="button"
                className="faq-section__question"
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
              >
                <span>{t(`landing.faq.items.${key}.question`)}</span>
                <span className="faq-section__chevron">
                  <ChevronDownIcon />
                </span>
              </button>

              {isOpen && (
                <p className="faq-section__answer">{t(`landing.faq.items.${key}.answer`)}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
