import React from 'react';
import './HeroSection.scss';
import { useTranslation } from 'react-i18next';
import { StarIcon, HeroIconLeft, HeroIconRight } from '../../../constants/icons';
import useIsMobile from '../../../hooks/useIsMobile';
import heroBg from '../../../images/landing-background-image.png';
import heroBgMobile from '../../../images/hero-background-mobile.png';

const HeroSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile(768);

  const mainCard = (
    <div className="hero-section__card hero-section__card--main">
      <span className="hero-section__badge">{t('landing.hero.suitable', 'Suitable')}</span>
      <div className="hero-section__card-info">
        <span className="hero-section__card-name">{t('landing.hero.candidate1', 'Candidate 1')}</span>
        <span className="hero-section__card-tags">
          {t('landing.hero.candidate1Tags', 'Technical skills, loyal, charismatic')}
        </span>
        <div className="hero-section__skill">
          <span>{t('landing.hero.technical', 'Technical')}</span>
          <div className="hero-section__skill-bar">
            <span style={{ width: '82%' }} />
          </div>
        </div>
        <div className="hero-section__skill">
          <span>{t('landing.hero.emotional', 'Emotional')}</span>
          <div className="hero-section__skill-bar">
            <span style={{ width: '65%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const trust = (
    <div className="hero-section__trust">
      <div className="hero-section__stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} />
        ))}
      </div>
      <span>{t('landing.hero.trustedBy', 'Trusted by 120 firms')}</span>
    </div>
  );

  if (isMobile) {
    return (
      <section id="hero" className="hero-section hero-section--mobile">
        <div className="hero-section__banner">
          <img className="hero-section__bg" src={heroBgMobile} alt="" />
            <div className="hero-section__intro">
              <h1 className="hero-section__title">
                {t('landing.hero.title', 'Transform CVs into hiring decisions with AI')}
              </h1>
              <p className="hero-section__subtitle">
                {t(
                  'landing.hero.subtitle',
                  'Centralize candidate data, automate CV formatting, match talent to job requirements, and streamline hiring decisions.'
                )}
              </p>
              <div className="hero-section__carousel">{mainCard}</div>
              {trust}
            </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="hero-section">
      <div className="hero-section__banner">
        <img className="hero-section__bg" src={heroBg} alt="" />

        <div className="hero-section__overlay">
          <h1 className="hero-section__title">
            {t('landing.hero.title', 'Transform CVs into hiring decisions with AI')}
          </h1>
          <p className="hero-section__subtitle">
            {t(
              'landing.hero.subtitle',
              'Centralize candidate data, automate CV formatting, match talent to job requirements, and streamline hiring decisions.'
            )}
          </p>

          <div className="hero-section__carousel">
            <div className="hero-section__nav-btn hero-section__nav-btn--left">
              <HeroIconLeft />
            </div>

            <div className="hero-section__card hero-section__card--side">
              <div className="hero-section__avatar" />
              <span className="hero-section__card-name">{t('landing.hero.candidate2', 'Candidate 2')}</span>
            </div>

            {mainCard}

            <div className="hero-section__card hero-section__card--side">
              <div className="hero-section__avatar" />
              <span className="hero-section__card-name">{t('landing.hero.candidate3', 'Candidate 3')}</span>
            </div>

            <div className="hero-section__nav-btn hero-section__nav-btn--right">
              <HeroIconRight />
            </div>
          </div>

          {trust}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
