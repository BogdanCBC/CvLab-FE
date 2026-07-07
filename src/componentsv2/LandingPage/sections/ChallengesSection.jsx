import React from 'react';
import './ChallengesSection.scss';
import { useTranslation } from 'react-i18next';
import { ClockIcon, DocumentIcon, FolderIcon } from '../../../constants/icons';

const CARDS = [
  { key: 'hours', icon: ClockIcon, className: 'challenges-section__icon-wrap--red' },
  { key: 'reformat', icon: DocumentIcon, className: 'challenges-section__icon-wrap--orange' },
  { key: 'archive', icon: FolderIcon, className: 'challenges-section__icon-wrap--purple' },
];

const ChallengesSection = () => {
  const { t } = useTranslation();

  return (
    <section id="challenges" className="challenges-section">
      <span className="challenges-section__eyebrow">{t('landing.challenges.eyebrow', 'Challenges')}</span>
      <h2 className="challenges-section__title">
        {t('landing.challenges.title', 'Why is managing recruitment so hard today?')}
      </h2>

      <div className="challenges-section__grid">
        {CARDS.map(({ key, icon: Icon, className }) => (
          <div key={key} className="challenges-section__card">
            <div className={`challenges-section__icon-wrap ${className}`}>
              <Icon />
            </div>
            <h3 className="challenges-section__card-title">
              {t(`landing.challenges.${key}Title`)}
            </h3>
            <p className="challenges-section__card-description">
              {t(`landing.challenges.${key}Description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChallengesSection;
