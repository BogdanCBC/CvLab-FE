import React from 'react';
import './SolutionsSection.scss';
import { useTranslation } from 'react-i18next';
import { ZapIcon, DocumentIcon, DatabaseIcon } from '../../../constants/icons';

const CARDS = [
  { key: 'match', icon: ZapIcon, className: 'solutions-section__icon-wrap--blue' },
  { key: 'format', icon: DocumentIcon, className: 'solutions-section__icon-wrap--green' },
  { key: 'archive', icon: DatabaseIcon, className: 'solutions-section__icon-wrap--purple' },
];

const SolutionsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="solutions" className="solutions-section">
      <span className="solutions-section__eyebrow">{t('landing.solutions.eyebrow', 'Solutions')}</span>
      <h2 className="solutions-section__title">
        {t('landing.solutions.title', 'adorCV solves all of this')}
      </h2>
      <p className="solutions-section__subtitle">
        {t('landing.solutions.subtitle', 'One tool that centralizes, formats, and matches automatically.')}
      </p>

      <div className="solutions-section__grid">
        {CARDS.map(({ key, icon: Icon, className }) => (
          <div key={key} className="solutions-section__card">
            <div className={`solutions-section__icon-wrap ${className}`}>
              <Icon />
            </div>
            <h3 className="solutions-section__card-title">
              {t(`landing.solutions.${key}Title`)}
            </h3>
            <p className="solutions-section__card-description">
              {t(`landing.solutions.${key}Description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionsSection;
