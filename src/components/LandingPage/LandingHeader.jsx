import React, { useEffect, useState } from 'react';
import './LandingHeader.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useIsMobile from '../../hooks/useIsMobile';
import logo from '../../images/adorCvLogo.svg';
import logoDark from '../../images/adorCvLogoDark.svg';

const NAV_ITEMS = ['solutions', 'demo', 'product', 'pricing', 'blog'];
const NAV_ROUTES = {};
const SECTION_IDS = { solutions: 'solutions', demo: 'demo', product: 'interface', pricing: 'pricing', blog: 'blog' };
const HEADER_OFFSET = 70;
const SCROLL_DURATION = 700;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const smoothScrollTo = (targetY, duration = SCROLL_DURATION) => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const targetY = Math.max(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, 0);
  smoothScrollTo(targetY);
};

const LandingHeader = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isMobile = useIsMobile(1100);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const isOnLandingPage = location.pathname === '/';
  const isLight = !isMobile && !isOnLandingPage;

  useEffect(() => {
    if (!isOnLandingPage) {
      setActiveSection(null);
      return;
    }

    const elements = Object.values(SECTION_IDS)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setActiveSection((prev) => {
            if (entry.isIntersecting) return entry.target.id;
            return prev === entry.target.id ? null : prev;
          });
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isOnLandingPage]);

  const isNavItemActive = (key) => {
    if (key === 'blog' && location.pathname.startsWith('/blog')) return true;
    return isOnLandingPage && activeSection === SECTION_IDS[key];
  };

  const goToNavItem = (key) => {
    setMenuOpen(false);
    const route = NAV_ROUTES[key];
    if (route) {
      navigate(route);
      return;
    }

    const sectionId = SECTION_IDS[key];
    if (!sectionId) return;

    if (isOnLandingPage) {
      scrollToSection(sectionId);
    } else {
      navigate('/');
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  };

  const goToLogin = () => {
    setMenuOpen(false);
    navigate(isLoggedIn ? '/candidates' : '/login');
  };

  const goToContact = () => {
    setMenuOpen(false);
    if (isOnLandingPage) {
      scrollToSection('contact');
    } else {
      navigate('/');
      setTimeout(() => scrollToSection('contact'), 100);
    }
  };

  return (
    <header
      className={`landing-header${scrolled && isOnLandingPage ? ' landing-header--scrolled' : ''}${isMobile ? ' landing-header--mobile' : ''}${isLight ? ' landing-header--light' : ''}`}
    >
      <div className="landing-header__inner">
        <div className="landing-header__logo" onClick={() => { setMenuOpen(false); navigate('/'); }}>
          <img src={isMobile || isLight || scrolled ? logoDark : logo} alt="adorCV" />
        </div>

        {isMobile ? (
          <button
            type="button"
            className="landing-header__burger"
            aria-label={t('landing.header.menu', 'Menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 5.5L5.5 16.5M5.5 5.5L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75 6.41667H19.25M2.75 11H19.25M2.75 15.5833H19.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ) : (
          <>
            <nav className="landing-header__nav">
              {NAV_ITEMS.map((key) => {
                const active = isNavItemActive(key);
                return (
                  <span
                    key={key}
                    className={`landing-header__nav-item${active ? ' active' : ''}`}
                    onClick={() => goToNavItem(key)}
                  >
                    {active && <span className="landing-header__nav-dot" />}
                    {t(`landing.nav.${key}`, key.charAt(0).toUpperCase() + key.slice(1))}
                  </span>
                );
              })}
            </nav>

            <div className="landing-header__actions">
              <button type="button" className="landing-header__login" onClick={goToLogin}>
                {t('landing.header.login', 'Login')}
              </button>
              <button type="button" className="landing-header__contact" onClick={goToContact}>
                {t('landing.header.contact', 'Contact')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33334M12.6667 8L8.00001 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {isMobile && menuOpen && (
        <div className="landing-header__mobile-menu">
          <nav className="landing-header__mobile-nav">
            {NAV_ITEMS.map((key) => (
              <span
                key={key}
                className={`landing-header__mobile-nav-item${isNavItemActive(key) ? ' active' : ''}`}
                onClick={() => goToNavItem(key)}
              >
                {t(`landing.nav.${key}`, key.charAt(0).toUpperCase() + key.slice(1))}
              </span>
            ))}
          </nav>

          <div className="landing-header__mobile-actions">
            <button type="button" className="landing-header__login" onClick={goToLogin}>
              {t('landing.header.login', 'Login')}
            </button>
            <button type="button" className="landing-header__contact" onClick={goToContact}>
              {t('landing.header.contact', 'Contact')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33334M12.6667 8L8.00001 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
