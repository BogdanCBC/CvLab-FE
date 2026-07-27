import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TermsPage.scss';
import LandingHeader from '../LandingPage/LandingHeader';
import Footer from '../LandingPage/Footer';
import renderArticleBody from '../BlogPage/renderArticleBody';

const LAST_UPDATED = '2026-07-24';

// Part 1 of the Terms and Conditions (sections 1-15). The remaining sections
// will be appended here once received.
const TERMS_CONTENT = `## 1. Introduction

Welcome to AdorCV ("AdorCV", the "Platform", "Service", "Application", or "Software").

These Terms and Conditions ("Terms", "Agreement") constitute a legally binding agreement between you ("User", "Customer", "Subscriber", "Organization", "Company", or "you") and FEEL IT SERVICES SAS, a company incorporated under the laws of France, registered under RCS Paris B 531 361 459, with its registered office at:

- FEEL IT SERVICES SAS
- 13bis Avenue de la Motte Picquet
- 75007 Paris, France
- Phone: +33 6 62 88 36 50
- Email: connect@feel-it-services.com
- Website: https://adorcv.com

By creating an account, accessing, browsing, purchasing, downloading, installing, or otherwise using AdorCV, you acknowledge that you have read, understood, and agree to be bound by these Terms and by all applicable laws and regulations.

If you do not agree to these Terms, you must immediately discontinue your use of the Services.

These Terms govern every version of AdorCV, including but not limited to:

- the publicly accessible SaaS platform
- enterprise subscriptions
- internally deployed installations
- white-label implementations
- API integrations
- mobile applications
- desktop software
- beta releases
- preview features
- future updates and enhancements

These Terms apply regardless of whether AdorCV is accessed through a browser, mobile application, desktop application, API, embedded software, or any other distribution channel operated by FEEL IT SERVICES SAS.

## 2. About AdorCV

AdorCV is an AI-powered software platform designed to assist individuals, businesses, recruiters, HR departments, career consultants, educational institutions, and organizations in creating, editing, transforming, optimizing, managing, organizing, and generating professional curriculum vitae (CVs), resumes, cover letters, employment-related documents, and other career documentation.

Depending on the subscription or licensing model, AdorCV may provide services including, but not limited to:

- AI-powered resume generation
- CV redesign
- conversion between visual templates
- resume parsing
- AI-assisted writing
- cover letter generation
- job application document management
- career profile optimization
- multilingual document generation
- ATS optimization
- export to multiple formats
- cloud storage
- enterprise management dashboards
- internal HR document workflows
- collaborative editing
- analytics
- document version history
- AI recommendations
- automation tools
- integrations with third-party platforms
- APIs
- administrative tools
- internal company deployments

The exact functionality available to a particular Customer depends upon the selected subscription plan, enterprise agreement, licensing arrangement, beta participation, or custom implementation.

FEEL IT SERVICES SAS reserves the right to modify, discontinue, replace, improve, remove, or introduce new functionality at any time without prior notice.

## 3. Definitions

For the purposes of these Terms:

Account means a registered user profile created for accessing AdorCV.

Affiliate means any entity controlling, controlled by, or under common control with FEEL IT SERVICES SAS.

AI Services means any artificial intelligence, machine learning, language models, automation systems, recommendation engines, or generative technologies integrated into AdorCV.

Authorized User means an individual permitted by an organization to use an Enterprise Account.

Business Customer means a company, institution, or legal entity using AdorCV for business purposes.

Content means any information uploaded, submitted, generated, imported, exported, or processed through AdorCV.

Customer Data means any data submitted by Users, including CVs, resumes, employment history, uploaded files, personal information, and generated documents.

Enterprise Deployment means any internally hosted, private cloud, on-premises, dedicated infrastructure, or custom installation of AdorCV provided to an organization.

Intellectual Property Rights include copyrights, trademarks, patents, trade secrets, database rights, software rights, know-how, moral rights, and all related proprietary rights.

Organization means any business, governmental entity, educational institution, nonprofit organization, or employer using AdorCV.

Services means all software, APIs, websites, infrastructure, applications, AI systems, documentation, updates, support services, and related offerings made available by FEEL IT SERVICES SAS.

Subscription means any paid, trial, enterprise, educational, promotional, or custom license granted for using AdorCV.

User Content means all information uploaded or created by Users.

## 4. Eligibility

You represent and warrant that:

- you are at least eighteen (18) years old, or the age of majority in your jurisdiction
- you possess the legal capacity to enter into binding contracts
- your use of AdorCV does not violate any applicable law
- all information provided during registration is accurate
- you will maintain accurate account information
- you are not prohibited from receiving software or cloud services under applicable export control laws
- you are authorized to upload any documents submitted to the Platform

Organizations represent that the individual accepting these Terms possesses sufficient authority to legally bind the organization.

## 5. User Accounts

Certain functionality requires the creation of an account.

When registering, Users agree to:

- provide accurate information
- maintain updated information
- maintain the confidentiality of login credentials
- immediately report unauthorized access
- use strong passwords
- not share credentials with unauthorized individuals

You remain fully responsible for all activities performed through your account.

FEEL IT SERVICES SAS shall not be liable for damages resulting from unauthorized account access caused by inadequate password security, credential sharing, phishing, malware, or negligence by the User.

The Company reserves the right to suspend, restrict, or permanently terminate any account suspected of violating these Terms or applicable law.

## 6. Description of the Services

AdorCV is provided as a Software-as-a-Service (SaaS) platform and may also be licensed as an enterprise or internally deployed solution.

Depending on the applicable agreement, Customers may access the Services through:

- cloud-hosted infrastructure
- dedicated private cloud
- on-premises deployment
- internal corporate infrastructure
- managed enterprise environments
- APIs
- desktop applications
- mobile applications
- embedded software integrations

The Company may update the Services periodically to improve security, performance, reliability, usability, scalability, regulatory compliance, and functionality.

Certain features may rely on third-party artificial intelligence providers, cloud infrastructure providers, payment processors, analytics services, authentication providers, or other external technologies.

The availability of specific features may vary by region, subscription tier, enterprise agreement, or technical compatibility.

## 7. License Grant

### 7.1 Grant of License

Subject to your compliance with these Terms and payment of all applicable fees, FEEL IT SERVICES SAS grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use AdorCV solely for the purposes permitted under your subscription plan or enterprise agreement.

### 7.2 Scope of License

The license granted herein permits you to:

- access and use AdorCV through supported interfaces
- create, edit, store, and export documents within the Platform
- use AI-powered features as part of the subscribed services
- integrate with authorized third-party services as documented
- allow Authorized Users access within the scope of your subscription tier

### 7.3 License Restrictions

You shall not, directly or indirectly:

- copy, reproduce, modify, adapt, translate, or create derivative works of AdorCV
- reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code
- sublicense, lease, rent, loan, sell, resell, or distribute AdorCV to any third party
- circumvent, disable, or interfere with security features or usage restrictions
- use AdorCV to build a competitive or substantially similar product
- remove, alter, or obscure proprietary notices, trademarks, or labels
- access AdorCV through automated means, bots, scrapers, or crawlers unless expressly authorized via API
- exceed usage limits, rate limits, or storage allocations established for your subscription
- share, transfer, or assign your account or credentials to any unauthorized party
- use AdorCV in violation of any applicable law, regulation, or third-party rights

### 7.4 Reservation of Rights

All rights not expressly granted herein are reserved by FEEL IT SERVICES SAS. No implied licenses are granted by these Terms. The Company retains full ownership of the Platform, including all updates, modifications, enhancements, and derivative works thereof.

### 7.5 License Termination

The license granted herein shall automatically terminate upon:

- expiration or non-renewal of your subscription
- termination of your account for any reason
- material breach of these Terms
- discontinuation of the Services by FEEL IT SERVICES SAS

Upon termination, you must immediately cease all use of AdorCV and destroy any copies of materials obtained through the Platform.

## 8. Acceptable Use Policy

### 8.1 General Conduct

You agree to use AdorCV only for lawful purposes and in a manner consistent with the intended professional use of the Platform.

### 8.2 Prohibited Activities

You shall not use AdorCV to:

- generate fraudulent, misleading, or deceptive documents
- fabricate qualifications, certifications, employment history, or academic credentials
- create documents intended to deceive employers, recruiters, institutions, or government bodies
- impersonate another individual or misrepresent your identity
- distribute spam, malware, viruses, or harmful code
- engage in phishing, social engineering, or identity theft
- harass, threaten, defame, or discriminate against any individual or group
- upload content that is obscene, pornographic, violent, hateful, or otherwise objectionable
- violate intellectual property rights, trade secrets, or confidentiality obligations of third parties
- interfere with the operation, security, integrity, or availability of AdorCV
- conduct vulnerability testing, penetration testing, load testing, or security assessments without prior written authorization
- mine data, scrape content, or extract information from AdorCV for unauthorized purposes
- use AdorCV in connection with illegal employment practices, forced labor, human trafficking, or exploitation
- circumvent geographic restrictions, export controls, or sanctions compliance
- resell, redistribute, or commercially exploit access to AdorCV without authorization
- use AdorCV in any manner that could damage, disable, overburden, or impair the Platform

### 8.3 Enforcement

FEEL IT SERVICES SAS reserves the right to investigate suspected violations of the Acceptable Use Policy and to take appropriate action, including but not limited to:

- issuing warnings
- temporarily suspending access
- permanently terminating accounts
- removing or disabling content
- reporting illegal activities to law enforcement authorities
- pursuing legal remedies and damages

### 8.4 Reporting Violations

Users are encouraged to report suspected Acceptable Use Policy violations by contacting connect@feel-it-services.com.

## 9. AI Features

### 9.1 Nature of AI Services

AdorCV integrates artificial intelligence technologies, including but not limited to natural language processing, machine learning models, large language models, recommendation systems, text generation, document parsing, and automation tools.

### 9.2 AI-Generated Content

Content generated, suggested, recommended, or modified by AI features is provided on an "as-is" basis. FEEL IT SERVICES SAS does not guarantee:

- the accuracy, completeness, or correctness of AI-generated content
- the suitability of AI outputs for any particular purpose
- that AI-generated content will be free from errors, biases, or inaccuracies
- that AI suggestions will result in successful employment outcomes
- that AI outputs will comply with specific industry standards or regulatory requirements

### 9.3 User Responsibility for AI Outputs

Users are solely responsible for:

- reviewing all AI-generated content before use
- verifying the accuracy of information produced by AI features
- ensuring AI-generated documents accurately represent their qualifications and experience
- making final decisions regarding the use, modification, or submission of AI-generated content
- compliance with applicable laws regarding the use of AI-generated documents in employment contexts

### 9.4 AI Limitations

Users acknowledge and accept that:

- AI systems may produce inaccurate, incomplete, or inappropriate content
- AI outputs may contain hallucinations, fabrications, or errors
- AI recommendations are not substitutes for professional career advice
- AI technologies are continuously evolving and may produce different results over time
- AI performance may vary based on input quality, language, domain, and other factors

### 9.5 AI Training and Improvement

FEEL IT SERVICES SAS may use aggregated, anonymized, and de-identified data derived from platform usage to improve AI models, algorithms, and services. Such use shall comply with applicable data protection laws and the Company's Privacy Policy.

Individual User Content shall not be used to train AI models without explicit consent, unless required by law or contractual obligation.

### 9.6 Third-Party AI Providers

Certain AI features may rely on third-party artificial intelligence providers. FEEL IT SERVICES SAS selects providers based on quality, reliability, security, and compliance standards but does not control third-party AI outputs. Additional terms from third-party providers may apply.

## 10. User Content

### 10.1 Ownership

Users retain all ownership rights in the original content they upload, create, or submit to AdorCV, including personal information, employment history, educational background, skills, certifications, and other career-related data.

### 10.2 License to FEEL IT SERVICES SAS

By submitting content to AdorCV, you grant FEEL IT SERVICES SAS a worldwide, non-exclusive, royalty-free, sublicensable license to:

- store, process, and display your content within the Platform
- use your content to provide the Services
- create backups and redundant copies for disaster recovery
- analyze aggregated and anonymized data to improve the Services
- comply with legal obligations, court orders, or regulatory requirements

This license terminates when you delete your content or close your account, except for:

- content already incorporated into backups or archives (which shall be deleted in accordance with retention policies)
- aggregated, anonymized data that no longer identifies you
- content required to be retained by law

### 10.3 Content Representations

By uploading content, you represent and warrant that:

- you own or have the necessary rights to submit such content
- your content does not infringe upon third-party intellectual property rights
- your content does not contain false, fraudulent, or misleading information intended to deceive
- your content does not violate applicable laws or regulations
- your content does not contain malware, viruses, or harmful code
- you have obtained necessary consents for any personal data of third parties included in your content

### 10.4 Content Removal

FEEL IT SERVICES SAS reserves the right to remove, disable, or restrict access to any content that violates these Terms, applicable laws, or Company policies.

Users may delete their content at any time through account settings, subject to technical limitations and legal retention obligations.

### 10.5 Content Portability

Users may export their content in available formats through the Platform's export functionality. FEEL IT SERVICES SAS shall provide reasonable assistance with content portability upon request, subject to technical feasibility and applicable fees.

## 11. Intellectual Property

### 11.1 Company Intellectual Property

FEEL IT SERVICES SAS owns all rights, title, and interest in and to AdorCV, including but not limited to:

- the software source code, object code, architecture, and infrastructure
- algorithms, AI models, machine learning systems, and training data
- user interface designs, layouts, templates, and visual elements
- trademarks, trade names, logos, service marks, and brand elements
- documentation, guides, tutorials, and instructional materials
- APIs, SDKs, development tools, and technical specifications
- patents, patent applications, and inventions
- trade secrets, proprietary methods, and know-how
- databases, data structures, and organizational systems
- all derivative works, improvements, and modifications

### 11.2 Template Intellectual Property

CV templates, design assets, visual themes, formatting structures, and layout systems provided within AdorCV are the intellectual property of FEEL IT SERVICES SAS or its licensors. Users receive a limited license to use templates for personal and professional document creation but may not:

- redistribute, resell, or sublicense templates
- use templates to create competing products
- remove attribution, watermarks, or proprietary notices
- modify templates for redistribution purposes

### 11.3 Feedback and Suggestions

Any feedback, suggestions, ideas, feature requests, or improvement recommendations submitted to FEEL IT SERVICES SAS become the property of the Company. Users waive any claims to compensation or ownership regarding submitted feedback.

### 11.4 Third-Party Intellectual Property

AdorCV may incorporate or integrate third-party technologies, libraries, frameworks, fonts, icons, or other materials subject to their respective licenses. Users agree to comply with applicable third-party license terms.

### 11.5 DMCA and Copyright Complaints

FEEL IT SERVICES SAS respects intellectual property rights and responds to valid copyright infringement notices in accordance with applicable law, including the EU Copyright Directive and the Digital Millennium Copyright Act (DMCA) where applicable.

To report intellectual property infringement, contact connect@feel-it-services.com with:

- identification of the copyrighted work
- identification of the allegedly infringing material
- your contact information
- a statement of good faith belief
- a statement under penalty of perjury
- your physical or electronic signature

## 12. Enterprise and Internal Tool Licensing

### 12.1 Enterprise Agreements

Organizations deploying AdorCV under enterprise agreements may be subject to additional terms, including but not limited to:

- custom service level agreements (SLAs)
- dedicated infrastructure provisions
- custom integration requirements
- volume licensing terms
- data residency requirements
- compliance certifications
- custom security configurations
- priority support arrangements
- professional services engagements
- training and onboarding programs

### 12.2 Internal Deployment

Organizations licensed to deploy AdorCV internally agree that:

- the deployment shall be limited to Authorized Users within the organization
- the organization shall maintain adequate security controls
- the organization shall comply with all applicable data protection laws
- the organization shall not sublicense, resell, or redistribute the software
- the organization shall cooperate with compliance audits upon reasonable notice
- the organization shall maintain accurate records of Authorized Users
- the organization shall report security incidents promptly
- the organization shall apply security patches and updates in a timely manner

### 12.3 White-Label Licensing

White-label implementations of AdorCV are subject to separate licensing agreements that govern:

- branding requirements and restrictions
- distribution channels and territories
- revenue sharing or fixed-fee arrangements
- support responsibilities
- liability allocation
- intellectual property attribution
- termination and transition provisions

### 12.4 API Licensing

Access to AdorCV APIs is subject to:

- rate limiting and usage quotas
- authentication requirements
- acceptable use restrictions
- version deprecation policies
- uptime commitments (per applicable SLA)
- data handling requirements
- security standards compliance

## 13. Data Processing

### 13.1 Data Controller and Processor

For individual Users, FEEL IT SERVICES SAS acts as the data controller. For Enterprise Customers whose employees or contractors use AdorCV, the Customer is typically the data controller, and FEEL IT SERVICES SAS acts as the data processor.

### 13.2 Data Processing Agreement

Enterprise Customers may require a Data Processing Agreement (DPA) to comply with applicable data protection regulations, including but not limited to:

- the General Data Protection Regulation (GDPR)
- the California Consumer Privacy Act (CCPA)
- the UK Data Protection Act 2018
- Brazil's Lei Geral de Proteção de Dados (LGPD)
- other applicable national and regional data protection laws

FEEL IT SERVICES SAS shall execute DPAs upon reasonable request from Enterprise Customers.

### 13.3 Data Location

Customer Data may be processed and stored in data centers located in the European Union, the European Economic Area, or other jurisdictions where FEEL IT SERVICES SAS or its infrastructure providers maintain facilities.

International data transfers shall comply with applicable legal mechanisms, including Standard Contractual Clauses (SCCs), adequacy decisions, binding corporate rules, or other lawful transfer mechanisms.

### 13.4 Data Retention

FEEL IT SERVICES SAS retains Customer Data for the duration of the subscription and for a reasonable period thereafter to:

- fulfill legal obligations
- resolve disputes
- enforce agreements
- maintain backups in accordance with disaster recovery policies
- comply with regulatory requirements

Upon account termination, Customer Data shall be deleted within ninety (90) days, except where longer retention is required by law.

### 13.5 Sub-processors

FEEL IT SERVICES SAS may engage sub-processors to assist in providing the Services. A current list of sub-processors is available upon request. The Company shall notify Enterprise Customers of changes to sub-processors in accordance with applicable DPA terms.

### 13.6 Data Subject Rights

Users may exercise their data protection rights, including the right to access, rectification, erasure, restriction, portability, and objection, by contacting connect@feel-it-services.com. FEEL IT SERVICES SAS shall respond to valid requests within the timeframes established by applicable law.

## 14. Security Obligations

### 14.1 Company Security Measures

FEEL IT SERVICES SAS implements and maintains appropriate technical and organizational security measures, including but not limited to:

- encryption of data in transit and at rest
- access controls and authentication mechanisms
- regular security assessments and penetration testing
- intrusion detection and prevention systems
- vulnerability management programs
- security incident response procedures
- employee security training and awareness programs
- physical security controls for data center facilities
- backup and disaster recovery systems
- logging, monitoring, and audit trail capabilities

### 14.2 Security Certifications

FEEL IT SERVICES SAS maintains or pursues security certifications and compliance standards as appropriate for its operations, which may include ISO 27001, SOC 2, GDPR compliance attestations, or other relevant frameworks.

### 14.3 Incident Notification

In the event of a security breach affecting Customer Data, FEEL IT SERVICES SAS shall:

- notify affected Customers without undue delay and within the timeframes required by applicable law
- provide information about the nature of the breach
- describe measures taken to address and mitigate the breach
- provide recommendations for protective measures Users may take
- cooperate with regulatory authorities as required

### 14.4 Customer Security Responsibilities

Customers are responsible for:

- maintaining the security of their account credentials
- implementing appropriate access controls for Authorized Users
- ensuring the security of their own systems and networks
- reporting suspected security incidents promptly
- cooperating with security investigations
- complying with security requirements specified in enterprise agreements

### 14.5 Vulnerability Disclosure

Security researchers who discover vulnerabilities in AdorCV are encouraged to report them responsibly to connect@feel-it-services.com. FEEL IT SERVICES SAS commits to:

- acknowledging receipt of vulnerability reports
- investigating reported vulnerabilities
- providing reasonable remediation timelines
- not pursuing legal action against good-faith security researchers who comply with responsible disclosure practices

## 15. User Responsibilities

### 15.1 General Responsibilities

Users are responsible for:

- maintaining the accuracy and truthfulness of all documents created through AdorCV
- ensuring compliance with applicable laws in their jurisdiction
- reviewing and verifying all AI-generated content before use or submission
- maintaining appropriate backups of important documents
- using the Platform in a professional and ethical manner
- respecting the intellectual property rights of third parties
- complying with employer policies regarding the use of AI tools
- reporting bugs, errors, or security issues to the Company

### 15.2 Professional Conduct

Users shall not use AdorCV to:

- misrepresent qualifications, experience, or credentials
- create documents that facilitate discrimination, fraud, or deception
- violate employment laws, labor regulations, or professional standards
- infringe upon the rights of former or current employers
- disclose trade secrets or confidential information of third parties
- engage in any activity that could harm the reputation of AdorCV or its users

### 15.3 Compliance with Local Laws

Users are solely responsible for ensuring that their use of AdorCV and any documents created through the Platform comply with all applicable local, national, and international laws, including but not limited to:

- employment and labor laws
- data protection and privacy regulations
- anti-discrimination laws
- professional licensing requirements
- export control regulations
- sanctions and embargo restrictions

### 15.4 Indemnification

You agree to indemnify, defend, and hold harmless FEEL IT SERVICES SAS, its affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or related to:

- your violation of these Terms
- your use of AdorCV
- content you upload, create, or distribute through the Platform
- your violation of any applicable law or third-party rights
- your negligence or willful misconduct

### 15.5 Cooperation

Users agree to cooperate with FEEL IT SERVICES SAS in connection with:

- investigations of suspected Terms violations
- legal proceedings related to the Platform
- security incident responses
- compliance audits and assessments
- regulatory inquiries

This document shall be read in conjunction with the Privacy Policy, Cookie Policy, and any applicable Enterprise Agreement or Data Processing Agreement. FEEL IT SERVICES SAS reserves the right to modify these Terms at any time. Continued use of AdorCV after modifications constitutes acceptance of the revised Terms.

FEEL IT SERVICES SAS — All rights reserved.`;

const TermsPage = ({ isLoggedIn }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formattedDate = new Date(LAST_UPDATED).toDateString(i18n.language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="landing-page">
      <LandingHeader isLoggedIn={isLoggedIn} />
      <main className="terms-page">
        <Link to="/" className="terms-page__back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 8H3.33334M3.33334 8L8.00001 12.6667M3.33334 8L8.00001 3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('blog.backToMain', 'Go back to Main Page')}
        </Link>

        <h1 className="terms-page__title">{t('legal.termsTitle', 'Terms and Conditions')}</h1>
        <span className="terms-page__date">
          {t('legal.lastUpdated', 'Last updated on {{date}}', { date: formattedDate })}
        </span>

        <div className="terms-page__body">{renderArticleBody(TERMS_CONTENT)}</div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
