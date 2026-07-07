import React, { useState } from 'react';
import './TestimonialsSection.scss';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../constants/icons';
import useIsMobile from '../../../hooks/useIsMobile';
import controlBannerDesktop from '../../../images/hero2.png';
import controlBannerMobile from '../../../images/hero2-mobile.png';

const AVATAR_COLORS = ['#2391D1', '#F79009', '#F4661E', '#7A5AF8', '#12B76A'];

// Add more entries here as new testimonials come in — quote/role text lives in translation.json under landing.testimonials.<key>.
const TESTIMONIALS = [
  { key: 'bogdan', initials: 'BM', name: 'Bogdan Manolache', company: 'TechRom SA' },
  { key: 'elena', initials: 'ER', name: 'Elena Radu', company: 'Globant Romania' },
  { key: 'andreea', initials: 'AV', name: 'Andreea Voicu', company: 'Orange Romania' },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile(768);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    setActiveIndex((index) => (index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % TESTIMONIALS.length);
  };

  const active = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials" className="testimonials-section">
      <span className="testimonials-section__eyebrow">{t('landing.testimonials.eyebrow', 'Testimonials')}</span>
      <h2 className="testimonials-section__title">{t('landing.testimonials.title', 'What our clients say')}</h2>

      <div className="testimonials-section__card">
        <div
          className="testimonials-section__avatar"
          style={{ background: AVATAR_COLORS[activeIndex % AVATAR_COLORS.length] }}
        >
          {active.initials}
        </div>

        <p className="testimonials-section__quote">
          &quot;{t(`landing.testimonials.${active.key}.quote`)}&quot;
        </p>

        <span className="testimonials-section__name">{active.name}</span>
        <span className="testimonials-section__role">
          {t(`landing.testimonials.${active.key}.role`)} &middot; {active.company}
        </span>
      </div>

      <div className="testimonials-section__nav">
        <button
          type="button"
          className="testimonials-section__nav-btn"
          onClick={goToPrev}
          aria-label={t('landing.testimonials.prev', 'Previous testimonial')}
        >
          <ArrowLeftIcon />
        </button>

        <div className="testimonials-section__dots">
          {TESTIMONIALS.map((testimonial, index) => (
            <button
              key={testimonial.key}
              type="button"
              className={`testimonials-section__dot${index === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={t('landing.testimonials.goTo', 'Go to testimonial {{number}}', { number: index + 1 })}
            />
          ))}
        </div>

        <button
          type="button"
          className="testimonials-section__nav-btn"
          onClick={goToNext}
          aria-label={t('landing.testimonials.next', 'Next testimonial')}
        >
          <ArrowRightIcon />
        </button>
      </div>

      <div className="control-banner">
        <img
          className="control-banner__bg"
          src={isMobile ? controlBannerMobile : controlBannerDesktop}
          alt=""
        />

        {!isMobile && (
          <span className="control-banner__badge">{t('landing.controlBanner.badge', 'Suitable')}</span>
        )}

        <div className="control-banner__content">
          <h3 className="control-banner__title">
            {t('landing.controlBanner.title', 'Full control over every CV')}
          </h3>
          <p className="control-banner__subtitle">
            {t(
              'landing.controlBanner.subtitle',
              'Consolidate candidate information, automate resume formatting, align talent with job criteria, and simplify hiring choices.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
