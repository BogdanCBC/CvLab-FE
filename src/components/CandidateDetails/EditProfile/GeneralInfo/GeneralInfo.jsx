import React from 'react';
import { Input } from 'antd';
import './GeneralInfo.css';
import { useTranslation } from "react-i18next";

const Field = ({ label, name, multiline, maxLength, value, onChange }) => (
    <div className="ep-field">
        <label className="ep-label">{label} <span className="ep-required">*</span></label>
        {multiline
            ? <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                maxLength={maxLength}
                showCount={!!maxLength}
                value={value || ""}
                onChange={onChange}
              />
            : <Input
                value={value || ""}
                onChange={onChange}
              />
        }
    </div>
);

export default function GenerlInfo({ profileData, updateGeneralInfo }) {
    const { t } = useTranslation();
    const gi = profileData.general_info;

    const makeOnChange = (name) => (e) => updateGeneralInfo(name, e.target.value);

    return (
        <div className="ep-section">
            <h2 className="ep-section-title">{t("generalInfo.general", "General Information")}</h2>

            <div className="ep-row-2">
                <Field label={t("generalInfo.firstName")} name="first_name" value={gi.first_name} onChange={makeOnChange("first_name")} />
                <Field label={t("generalInfo.lastName")} name="last_name" value={gi.last_name} onChange={makeOnChange("last_name")} />
            </div>

            <Field label={t("generalInfo.experience")} name="experience" value={gi.experience} onChange={makeOnChange("experience")} />
            <Field label={t("generalInfo.position")} name="position" value={gi.position} onChange={makeOnChange("position")} />
            <Field label={t("generalInfo.email")} name="email" value={gi.email} onChange={makeOnChange("email")} />
            <Field label={t("generalInfo.phone")} name="phone" value={gi.phone} onChange={makeOnChange("phone")} />
            <Field label={t("generalInfo.description")} name="description" value={gi.description} onChange={makeOnChange("description")} multiline maxLength={500} />
        </div>
    );
}
