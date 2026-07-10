import React from 'react';
import './BenefitsSection.scss';
import { useTranslation } from 'react-i18next';
import { SparkleIcon, CheckIcon } from '../../../constants/icons';

const BENEFITS = ['hours', 'archive', 'feedback', 'export', 'languages', 'security', 'onboarding'];

const BenefitsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="benefits" className="benefits-section">
      <div className="benefits-section__intro">
        <span className="benefits-section__eyebrow">{t('landing.benefits.eyebrow', 'Benefits')}</span>
        <h2 className="benefits-section__title">{t('landing.benefits.title', 'Why HR teams choose adorCV')}</h2>
        <p className="benefits-section__subtitle">
          {t(
            'landing.benefits.subtitle',
            'Built specifically for HR teams and hiring managers who want to recruit faster, more precisely, and without repetitive manual work.'
          )}
        </p>

        <div className="benefits-section__differentiator">
          <div className="benefits-section__differentiator-icon">
            <SparkleIcon />
          </div>
          <div>
            <span className="benefits-section__differentiator-label">
              {t('landing.benefits.differentiator.label', 'The AI differentiator')}
            </span>
            <p className="benefits-section__differentiator-text">
              {t(
                'landing.benefits.differentiator.text',
                'adorCV is the only HR tool that uses AI to automatically match candidates to new roles — even if they applied two years ago.'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="benefits-section__list">
        {BENEFITS.map((key) => (
          <div key={key} className="benefits-section__item">
            <span className="benefits-section__check">
              <CheckIcon />
            </span>
            <span className="benefits-section__item-text">{t(`landing.benefits.items.${key}`)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
