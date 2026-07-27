import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TermsPage.scss';
import LandingHeader from '../LandingPage/LandingHeader';
import Footer from '../LandingPage/Footer';
import renderArticleBody from '../BlogPage/renderArticleBody';

const LAST_UPDATED = '2026-07-24';

const PRIVACY_CONTENT = `## 1. Introduction

This Privacy Policy describes how AdorCV ("we", "us", "our", the "Platform") collects, uses, stores, and protects your personal information when you use our website, SaaS platform, and internal tools. By accessing or using our services, you agree to the practices described in this policy.

## 2. Information We Collect

We collect the following categories of personal data:

- Account Information: Name, email address, phone number, company name, job title, and login credentials.
- Usage Data: Pages visited, features used, session duration, clicks, and interaction patterns within the platform.
- Device & Technical Data: IP address, browser type and version, operating system, device identifiers, and referring URLs.
- Payment Information: Billing address and payment method details (processed securely through third-party payment processors).
- Communications: Messages sent through support channels, feedback forms, and email correspondence.
- Cookies & Tracking Technologies: Information collected through cookies, web beacons, and similar technologies to improve your experience.

## 3. How We Use Your Information

We use the collected data for the following purposes:

- To provide, operate, and maintain our SaaS platform and internal tools.
- To create and manage your user account.
- To process transactions and send related billing information.
- To communicate with you regarding service updates, security alerts, and support.
- To personalize your experience and improve platform functionality.
- To analyze usage patterns and optimize performance.
- To detect, prevent, and address fraud, abuse, or technical issues.
- To comply with legal obligations and enforce our Terms and Conditions.

## 4. Legal Basis for Processing (GDPR)

We process personal data under the following legal bases:

- Consent: Where you have given explicit consent for specific processing activities.
- Contractual Necessity: Processing necessary for the performance of our service agreement with you.
- Legitimate Interests: For purposes such as improving our services, preventing fraud, and ensuring platform security, provided these do not override your fundamental rights.
- Legal Obligation: Where processing is required to comply with applicable laws and regulations.

## 5. Data Sharing and Third Parties

We do not sell your personal information. We may share data with:

- Service Providers: Hosting providers, payment processors, analytics services, and customer support tools that assist in operating the platform.
- Legal Requirements: When required by law, regulation, legal process, or governmental request.
- Business Transfers: In connection with a merger, acquisition, or sale of assets, with prior notice to affected users.
- With Your Consent: When you explicitly authorize us to share your data with third parties.

All third-party service providers are contractually bound to protect your data and process it only as instructed by us.

## 6. Data Retention

We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Specifically:

- Active account data is retained for the duration of your subscription.
- After account deletion, data is retained for up to 30 days before permanent removal.
- Financial records are retained for the legally required period (typically 5-7 years).
- Usage analytics may be retained in anonymized form indefinitely for statistical purposes.

## 7. Data Security

We implement industry-standard technical and organizational measures to protect your personal data, including:

- Encryption of data in transit (TLS/SSL) and at rest (AES-256).
- Regular security audits and vulnerability assessments.
- Role-based access controls and multi-factor authentication for internal systems.
- Secure data centers with physical access controls.
- Employee training on data protection best practices.

## 8. Your Rights

Depending on your jurisdiction, you may have the following rights:

- Right to Access: Request a copy of the personal data we hold about you.
- Right to Rectification: Request correction of inaccurate or incomplete data.
- Right to Erasure: Request deletion of your personal data ("right to be forgotten").
- Right to Restrict Processing: Request limitation of how we process your data.
- Right to Data Portability: Receive your data in a structured, machine-readable format.
- Right to Object: Object to processing based on legitimate interests or direct marketing.
- Right to Withdraw Consent: Withdraw previously given consent at any time.

To exercise any of these rights, please contact us at privacy@adorcv.com. We will respond within 30 days of receiving your request.

## 9. Cookies and Tracking

Our platform uses cookies and similar technologies to:

- Maintain session state and authentication.
- Remember your preferences and settings.
- Analyze platform usage and performance.
- Provide relevant content and recommendations.

You can manage cookie preferences through your browser settings or our cookie consent banner. Disabling certain cookies may affect platform functionality.

## 10. International Data Transfers

If your data is transferred outside the European Economic Area (EEA), we ensure adequate protection through:

- Standard Contractual Clauses (SCCs) approved by the European Commission.
- Data processing agreements with all international service providers.
- Compliance with applicable data transfer frameworks.

## 11. Children's Privacy

Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we become aware that we have inadvertently collected such data, we will promptly delete it.

## 12. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by posting a notice on our platform or sending an email to registered users. Continued use of the service after changes constitutes acceptance of the updated policy.

## 13. Contact Us

If you have questions about this Privacy Policy, wish to exercise your data rights, or have concerns about our data practices, please contact us:

- Email: privacy@adorcv.com
- Data Protection Officer: dpo@adorcv.com

You also have the right to lodge a complaint with your local data protection supervisory authority if you believe your data has been processed unlawfully.`;

const PrivacyPage = ({ isLoggedIn }) => {
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
      <main className="terms-page privacy-page">
        <Link to="/" className="terms-page__back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 8H3.33334M3.33334 8L8.00001 12.6667M3.33334 8L8.00001 3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('blog.backToMain', 'Go back to Main Page')}
        </Link>

        <h1 className="terms-page__title">{t('legal.privacyTitle', 'Privacy Policy')}</h1>
        <span className="terms-page__date">
          {t('legal.lastUpdated', 'Last updated on {{date}}', { date: formattedDate })}
        </span>

        <div className="terms-page__body">{renderArticleBody(PRIVACY_CONTENT)}</div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
