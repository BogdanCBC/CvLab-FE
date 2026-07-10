import React from 'react';
import { Input } from 'antd';
import './GeneralInfo.css';
import { useTranslation } from "react-i18next";

export default function GenerlInfo({ profileData, updateGeneralInfo }) {
    const { t } = useTranslation();
    const gi = profileData.general_info;

    const Field = ({ label, name, multiline, maxLength }) => (
        <div className="ep-field">
            <label className="ep-label">{label} <span className="ep-required">*</span></label>
            {multiline
                ? <Input.TextArea
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    maxLength={maxLength}
                    showCount={!!maxLength}
                    value={gi[name] || ""}
                    onChange={(e) => updateGeneralInfo(name, e.target.value)}
                  />
                : <Input
                    value={gi[name] || ""}
                    onChange={(e) => updateGeneralInfo(name, e.target.value)}
                  />
            }
        </div>
    );

    return (
        <div className="ep-section">
            <h2 className="ep-section-title">{t("generalInfo.general", "General Information")}</h2>

            <div className="ep-row-2">
                <Field label={t("generalInfo.firstName")} name="first_name" />
                <Field label={t("generalInfo.lastName")} name="last_name" />
            </div>

            <Field label={t("generalInfo.experience")} name="experience" />
            <Field label={t("generalInfo.position")} name="position" />
            <Field label={t("generalInfo.email")} name="email" />
            <Field label={t("generalInfo.phone")} name="phone" />
            <Field label={t("generalInfo.description")} name="description" multiline maxLength={500} />
        </div>
    );
}
