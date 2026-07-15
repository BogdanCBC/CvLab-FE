import React, { useState } from 'react';
import './ContactSection.scss';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import api from '../../../api';

const initialFormState = { fullName: '', workEmail: '', company: '', message: '' };

const ContactSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isSubmitDisabled =
    !formData.fullName.trim() || !formData.workEmail.trim() || !formData.message.trim() || submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setSubmitting(true);
    try {
      await api.post('/contact', {
        full_name: formData.fullName,
        work_email: formData.workEmail,
        company: formData.company,
        message: formData.message,
      });
      notification.success({ message: t('landing.contact.success', "Thanks! We'll get back to you within 24 hours.") });
      setFormData(initialFormState);
    } catch (err) {
      notification.error({ message: err?.response?.data?.message || t('landing.contact.error', 'Something went wrong. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <span className="contact-section__eyebrow">{t('landing.contact.eyebrow', 'Contact')}</span>
      <h2 className="contact-section__title">{t('landing.contact.title', "Let's talk")}</h2>
      <p className="contact-section__subtitle">
        {t(
          'landing.contact.subtitle',
          'Tell us about your team and recruitment challenges — we will get back to you in less than 24 hours.'
        )}
      </p>

      <form className="contact-section__card" onSubmit={handleSubmit} noValidate>
        <div className="contact-section__row">
          <div className="contact-section__field">
            <label htmlFor="contact-full-name">
              {t('landing.contact.fullName', 'Full name')} <span>*</span>
            </label>
            <input
              id="contact-full-name"
              type="text"
              placeholder={t('landing.contact.fullNamePlaceholder', 'Jane Smith')}
              value={formData.fullName}
              onChange={handleChange('fullName')}
              disabled={submitting}
              required
            />
          </div>

          <div className="contact-section__field">
            <label htmlFor="contact-work-email">
              {t('landing.contact.workEmail', 'Work email')} <span>*</span>
            </label>
            <input
              id="contact-work-email"
              type="email"
              placeholder={t('landing.contact.workEmailPlaceholder', 'jane@company.com')}
              value={formData.workEmail}
              onChange={handleChange('workEmail')}
              disabled={submitting}
              required
            />
          </div>
        </div>

        <div className="contact-section__field">
          <label htmlFor="contact-company">{t('landing.contact.company', 'Company')}</label>
          <input
            id="contact-company"
            type="text"
            placeholder={t('landing.contact.companyPlaceholder', 'Acme Corp')}
            value={formData.company}
            onChange={handleChange('company')}
            disabled={submitting}
          />
        </div>

        <div className="contact-section__field">
          <label htmlFor="contact-message">
            {t('landing.contact.message', 'Message')} <span>*</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder={t('landing.contact.messagePlaceholder', 'Tell us how we can help...')}
            value={formData.message}
            onChange={handleChange('message')}
            disabled={submitting}
            required
          />
        </div>

        <button type="submit" className="contact-section__submit" disabled={isSubmitDisabled}>
          {t('landing.contact.submit', 'Send message')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.6667 1.33334L7.33334 8.66668M14.6667 1.33334L10 14.6667L7.33334 8.66668M14.6667 1.33334L1.33334 6.00001L7.33334 8.66668"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </section>
  );
};

export default ContactSection;
