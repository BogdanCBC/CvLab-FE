import React from 'react';
import './InterfaceSection.scss';
import { useTranslation } from 'react-i18next';
import { NetworkIcon, ChartIcon, DocumentIcon, ArrowRightBlue, PersonIcon, MoreDotsIconSmall } from '../../../constants/icons';

const MATCHES = [
  { key: 'paul', rank: '1st', isMatch: true, score: 100 },
  { key: 'cristian', rank: '2nd', isMatch: false, score: 16 },
];

const PIPELINE_COLUMNS = [
  {
    key: 'screening',
    candidates: [
      { name: 'Olivia Rhye', location: 'Paris', owner: 'James Lucas' },
      { name: 'James Wilson', location: 'Paris', owner: 'James Lucas' },
    ],
  },
  {
    key: 'hrInterview',
    candidates: [{ name: 'Sophia Taylor', location: 'Paris', owner: 'James Lucas' }],
  },
  {
    key: 'technicalInterview',
    candidates: [
      { name: 'Mia Clark', location: 'Paris', owner: 'James Lucas' },
      { name: 'Jack Bennett', location: 'Paris', owner: 'James Lucas' },
      { name: 'Oliver Parker', location: 'Iasi', owner: 'James Lucas' },
    ],
  },
  {
    key: 'clientInterview',
    candidates: [{ name: 'Lily Young', location: 'Paris', owner: 'James Lucas' }],
  },
  {
    key: 'offer',
    candidates: [
      { name: 'Chloe King', location: 'Paris', owner: 'James Lucas' },
      { name: 'Sarah Baker', location: 'Paris', owner: 'James Lucas' },
    ],
  },
  {
    key: 'acceptedDeclined',
    candidates: [
      { name: 'Ella Wright', location: 'Paris', owner: 'James Lucas', status: 'accepted' },
      { name: 'Andrew Lee', location: 'Paris', owner: 'James Lucas', status: 'declined' },
    ],
  },
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
            {MATCHES.map((match, index) => (
              <div key={match.key} className="match-mock__card">
                <div className="match-mock__card-top">
                  <span className="match-mock__rank-badge">{index + 1}</span>
                  <span className="match-mock__card-name">
                    {t(`landing.interface.match.candidates.${match.key}.name`)}
                  </span>
                  <span className="match-mock__card-ordinal">{match.rank}</span>
                  <span
                    className={`match-mock__pill${match.isMatch ? ' match-mock__pill--match' : ' match-mock__pill--no-match'}`}
                  >
                    <span className="match-mock__pill-dot" />
                    {match.isMatch
                      ? t('landing.interface.match.isMatch', "It's a match")
                      : t('landing.interface.match.notMatch', 'Not a match')}
                  </span>
                </div>

                <span className="match-mock__fit-label">
                  {match.isMatch
                    ? t('landing.interface.match.strongFit', 'Strong fit')
                    : t('landing.interface.match.lowFit', 'Low fit')}
                </span>

                <div className="match-mock__fit-bar">
                  <span
                    style={{ width: `${match.score}%`, background: match.isMatch ? '#12B76A' : '#F04438' }}
                  />
                </div>

                <p className={`match-mock__description${index === 1 ? ' match-mock__description--second' : ''}`}>
                  {t(`landing.interface.match.candidates.${match.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="interface-section__col">
          <div className="interface-mock-card candidate-board-mock">
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

            <div className="board-mock__board">
              {PIPELINE_COLUMNS.map((col) => (
                <div key={col.key} className="board-mock__column">
                  <span className="board-mock__column-title">
                    {t(`landing.interface.board.statuses.${col.key}`)}
                  </span>

                  <div className="board-mock__cards">
                    {col.candidates.map((candidate) => (
                      <div key={candidate.name} className="board-mock__candidate">
                        <div className="board-mock__candidate-top">
                          <div className="board-mock__candidate-avatar">
                            <PersonIcon />
                          </div>
                          <div className="board-mock__candidate-details">
                            <span className="board-mock__candidate-name">{candidate.name}</span>
                            <span className="board-mock__candidate-location">{candidate.location}</span>
                          </div>
                          <span className="board-mock__candidate-menu">
                            <MoreDotsIconSmall />
                          </span>
                        </div>
                        <span className="board-mock__candidate-owner-label">
                          {t('landing.interface.board.opportunityOwner', 'Opportunity Owner')}
                        </span>
                        <span className="board-mock__candidate-name-label">
                          {t('landing.interface.board.name', 'Name')}
                        </span>
                        <span className="board-mock__candidate-owner-value">{candidate.owner}</span>

                        {candidate.status && (
                          <span className={`board-mock__candidate-status board-mock__candidate-status--${candidate.status}`}>
                            {t(`landing.interface.board.candidateStatus.${candidate.status}`)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
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
                <ArrowRightBlue />
              </div>

              <div className="format-mock__panel">
                <span className="format-mock__label format-mock__label--brand">adorCV</span>
                <div className="format-mock__box format-mock__box--after">
                  <span className="format-mock__box-item">Your company logo</span>
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
