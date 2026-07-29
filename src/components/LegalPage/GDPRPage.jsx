import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TermsPage.scss';
import LandingHeader from '../LandingPage/LandingHeader';
import Footer from '../LandingPage/Footer';
import renderArticleBody from '../BlogPage/renderArticleBody';

const LAST_UPDATED = '2026-07-24';

const GDPR_CONTENT = `Your privacy matters to us. This page outlines how we handle your personal data in compliance with the European Union's General Data Protection Regulation (GDPR). Please read this policy carefully to understand your rights and our obligations.

## 1. Introduction

This Privacy Policy explains how we collect, use, store, and protect your personal data in accordance with the General Data Protection Regulation (EU) 2016/679 (GDPR). We are committed to ensuring that your privacy is protected and that we handle your personal information transparently and lawfully.

## 2. Data Controller

The data controller responsible for your personal data is our company, operating through this website. For any questions regarding data processing, you may contact us using the details provided on our Contact page or by emailing us at privacy@adorcv.com.

## 3. What Data We Collect

We may collect the following types of personal data:

- Name and contact information (email address, phone number)
- Company name and job title
- IP address and browser information
- Cookies and usage data from website interactions
- Any information you voluntarily provide through contact forms or service requests

## 4. How We Use Your Data

Your personal data is processed for the following purposes:

- To provide and manage our services
- To respond to inquiries and customer support requests
- To send relevant communications, including service updates
- To improve our website and user experience
- To comply with legal obligations

## 5. Legal Basis for Processing

We process your personal data based on one or more of the following legal grounds:

- Your explicit consent
- Performance of a contract or pre-contractual steps
- Compliance with a legal obligation
- Our legitimate interests, provided they do not override your rights

## 6. Data Retention

We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations. Once data is no longer needed, it is securely deleted or anonymized.

## 7. Your Rights

Under the GDPR, you have the following rights:

- Right of access — to request a copy of your personal data
- Right to rectification — to correct inaccurate or incomplete data
- Right to erasure — to request deletion of your data
- Right to restrict processing — to limit how we use your data
- Right to data portability — to receive your data in a structured format
- Right to object — to object to processing based on legitimate interests
- Right to withdraw consent at any time

## 8. Cookies

Our website uses cookies to enhance your browsing experience. You can manage your cookie preferences through your browser settings. For more details, please refer to our Cookie Policy.

## 9. Data Security

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures are regularly reviewed and updated to maintain a high level of security.

## 10. Contact Us

If you have any questions about this Privacy Policy, wish to exercise your rights, or want to file a complaint, please contact us at privacy@adorcv.com. You also have the right to lodge a complaint with your local data protection supervisory authority.`;

const GDPRPage = ({ isLoggedIn }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formattedDate = new Date(LAST_UPDATED).toLocaleDateString(i18n.language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="landing-page">
      <LandingHeader isLoggedIn={isLoggedIn} />
      <main className="terms-page gdpr-page">
        <Link to="/" className="terms-page__back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 8H3.33334M3.33334 8L8.00001 12.6667M3.33334 8L8.00001 3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('blog.backToMain', 'Go back to Main Page')}
        </Link>

        <h1 className="terms-page__title">{t('legal.gdprTitle', 'GDPR')}</h1>
        <span className="terms-page__date">
          {t('legal.lastUpdated', 'Last updated on {{date}}', { date: formattedDate })}
        </span>

        <div className="terms-page__body">{renderArticleBody(GDPR_CONTENT)}</div>
      </main>
      <Footer />
    </div>
  );
};

export default GDPRPage;
