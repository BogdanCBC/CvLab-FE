import React from 'react';
import './InterfaceSection.scss';
import { useTranslation } from 'react-i18next';
import { NetworkIcon, ChartIcon, DocumentIcon, ArrowRightIcon } from '../../../constants/icons';

const MATCHES = [
  { key: 'radu', initials: 'RP', color: '#12B76A', score: 94 },
  { key: 'mihai', initials: 'MI', color: '#2391D1', score: 87 },
  { key: 'ana', initials: 'AM', color: '#7A5AF8', score: 81 },
  { key: 'elena', initials: 'EC', color: '#F79009', score: 76 },
];

const STATUS_COLUMNS = [
  { key: 'applied', color: '#98a2b3', count: 2, chips: ['Ana M.', 'Dan G.'] },
  { key: 'reviewed', color: '#2391d1', count: 1, chips: ['Radu P.'] },
  { key: 'interview', color: '#f79009', count: 2, chips: ['Ioana D.', 'Alex S.'] },
  { key: 'hired', color: '#12b76a', count: 1, chips: ['Maria P.'], hideOnMobile: true },
];

const InterfaceSection = () => {
  const { t } = useTranslation();

  return (
    <section id="interface" className="interface-section">
      <span className="interface-section__eyebrow">{t('landing.interface.eyebrow', 'Interface')}</span>
      <h2 className="interface-section__title">{t('landing.interface.title', 'adorCV platform in action')}</h2>

      <div className="interface-section__grid">
        <div className="interface-mock-card">
          <div className="interface-mock-card__header">
            <div className="interface-mock-card__icon interface-mock-card__icon--blue">
              <NetworkIcon />
            </div>
            <div>
              <h3 className="interface-mock-card__title">{t('landing.interface.match.title', 'Intelligent AI Match')}</h3>
              <p className="interface-mock-card__subtitle">
                {t('landing.interface.match.subtitle', 'Automatic matching: candidates ↔ roles')}
              </p>
            </div>
          </div>

          <div className="match-mock__position">
            <span className="match-mock__position-label">{t('landing.interface.match.openPosition', 'Open position')}</span>
            <span className="match-mock__position-title">
              {t('landing.interface.match.positionTitle', 'Product Manager — Tech SRL')}
            </span>
            <div className="match-mock__tags">
              {['Agile', 'B2B SaaS', 'Roadmap', '5+ ani exp.'].map((tag) => (
                <span key={tag} className="match-mock__tag">{tag}</span>
              ))}
            </div>
          </div>

          <span className="match-mock__section-label">{t('landing.interface.match.topMatches', 'Top matches')}</span>

          <div className="match-mock__list">
            {MATCHES.map((match) => (
              <div key={match.key} className="match-mock__row">
                <div className="match-mock__avatar" style={{ background: match.color }}>
                  {match.initials}
                </div>
                <div className="match-mock__info">
                  <span className="match-mock__name">{t(`landing.interface.match.candidates.${match.key}.name`)}</span>
                  <span className="match-mock__role">{t(`landing.interface.match.candidates.${match.key}.role`)}</span>
                </div>
                <div className="match-mock__score">
                  <div className="match-mock__bar">
                    <span style={{ width: `${match.score}%`, background: match.color }} />
                  </div>
                  <span className="match-mock__percent" style={{ color: match.color }}>
                    {match.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="interface-section__col">
          <div className="interface-mock-card">
            <div className="interface-mock-card__header">
              <div className="interface-mock-card__icon interface-mock-card__icon--green">
                <ChartIcon />
              </div>
              <div>
                <h3 className="interface-mock-card__title">{t('landing.interface.board.title', 'Candidate Board')}</h3>
                <p className="interface-mock-card__subtitle">
                  {t('landing.interface.board.subtitle', 'Real-time pipeline management')}
                </p>
              </div>
            </div>

            <div className="board-mock__columns">
              {STATUS_COLUMNS.map((col) => (
                <span
                  key={col.key}
                  className={`board-mock__status${col.hideOnMobile ? ' board-mock__status--hide-mobile' : ''}`}
                >
                  <span className="board-mock__dot" style={{ background: col.color }} />
                  {t(`landing.interface.board.statuses.${col.key}`)}
                  <span className="board-mock__count">{col.count}</span>
                </span>
              ))}
            </div>

            <div className="board-mock__grid">
              {STATUS_COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className={`board-mock__chips${col.hideOnMobile ? ' board-mock__chips--hide-mobile' : ''}`}
                >
                  {col.chips.map((chip) => (
                    <span key={chip} className="board-mock__chip">
                      {chip}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="interface-mock-card">
            <div className="interface-mock-card__header">
              <div className="interface-mock-card__icon interface-mock-card__icon--purple">
                <DocumentIcon />
              </div>
              <div>
                <h3 className="interface-mock-card__title">
                  {t('landing.interface.format.title', 'Automatic CV Formatting')}
                </h3>
                <p className="interface-mock-card__subtitle">
                  {t('landing.interface.format.subtitle', 'Branded in seconds')}
                </p>
              </div>
            </div>

            <div className="format-mock__compare">
              <div className="format-mock__panel">
                <span className="format-mock__label">{t('landing.interface.format.before', 'Before')}</span>
                <div className="format-mock__box format-mock__box--before">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="format-mock__arrow">
                <ArrowRightIcon />
              </div>

              <div className="format-mock__panel">
                <span className="format-mock__label format-mock__label--brand">adorCV</span>
                <div className="format-mock__box format-mock__box--after">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterfaceSection;
