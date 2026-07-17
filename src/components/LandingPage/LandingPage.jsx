import React, { useEffect } from 'react';
import './LandingPage.scss';
import LandingHeader from './LandingHeader';
import HeroSection from './sections/HeroSection';
import ChallengesSection from './sections/ChallengesSection';
import SolutionsSection from './sections/SolutionsSection';
import DemoSection from './sections/DemoSection';
import TestimonialsSection from './sections/TestimonialsSection';
import InterfaceSection from './sections/InterfaceSection';
import BenefitsSection from './sections/BenefitsSection';
import PricingSection from './sections/PricingSection';
import FaqSection from './sections/FaqSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import { trackPageView } from '../../analytics';

const LandingPage = ({ isLoggedIn }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('Landing Page');
  }, []);

  return (
    <div className="landing-page">
      <LandingHeader isLoggedIn={isLoggedIn} />
      <main className="landing-page__main">
        <HeroSection />
        <ChallengesSection />
        <SolutionsSection />
        <DemoSection />
        <TestimonialsSection />
        <InterfaceSection />
        <BenefitsSection />
        <PricingSection />
        <FaqSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default LandingPage;
