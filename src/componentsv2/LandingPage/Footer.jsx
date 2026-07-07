import React from 'react';
import './Footer.scss';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../images/AdorLogoDarkBlue.svg';

const FOOTER_COLUMNS = [
  {
    key: 'product',
    links: [
      { key: 'features', sectionId: 'interface' },
      { key: 'solutions', sectionId: 'solutions' },
      // { key: 'templates' },
      { key: 'pricing', sectionId: 'pricing' },
    ],
  },
  {
    key: 'resources',
    links: [
      { key: 'blog', route: '/blog' },
      { key: 'guides' },
      { key: 'faq', sectionId: 'faq' },
      // { key: 'apiDocs' },
    ],
  },
  {
    key: 'legal',
    links: [
      { key: 'gdpr' },
      { key: 'terms' },
      { key: 'privacy' },
      { key: 'contact', sectionId: 'contact' },
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (sectionId) => (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="landing-footer">
      <div className="landing-footer__top">
        <div className="landing-footer__brand">
          <img src={logo} alt="adorCV" className="landing-footer__logo" />
          <p className="landing-footer__tagline">
            {t('landing.footer.tagline', 'The AI-powered HR platform that transforms recruitment.')}
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.key} className="landing-footer__column">
            <span className="landing-footer__column-title">
              {t(`landing.footer.${column.key}`, column.key)}
            </span>
            {column.links.map((link) =>
              link.route ? (
                <Link key={link.key} to={link.route} className="landing-footer__link">
                  {t(`landing.footer.links.${link.key}`, link.key)}
                </Link>
              ) : link.sectionId ? (
                <a
                  key={link.key}
                  href={`/#${link.sectionId}`}
                  className="landing-footer__link"
                  onClick={goToSection(link.sectionId)}
                >
                  {t(`landing.footer.links.${link.key}`, link.key)}
                </a>
              ) : (
                <span key={link.key} className="landing-footer__link landing-footer__link--disabled">
                  {t(`landing.footer.links.${link.key}`, link.key)}
                </span>
              )
            )}
          </div>
        ))}
      </div>

      <div className="landing-footer__divider" />

      <span className="landing-footer__copyright">
        © {new Date().getFullYear()} {t('landing.footer.copyright', 'adorCV. All rights reserved.')}
      </span>
    </footer>
  );
};

export default Footer;
