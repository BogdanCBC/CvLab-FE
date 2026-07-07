import React from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Education.scss';
import { useTranslation } from "react-i18next";
import { TrashIcon } from '../../../../constants/icons';

export default function Education({ profileData, updateEducation, addEducation, removeEducation }) {
    const { t } = useTranslation();

    return (
        <div className="ep-section education">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("education.education")}</h2>
                <Button className="add-education-button" type="link" icon={<PlusOutlined />} onClick={addEducation}>
                    {t("education.addEducation")}
                </Button>
            </div>

            {profileData.education.map((edu, index) => (
                <div key={index} className="ep-item-card">
                    <div className="ep-item-header">
                        <span className="ep-item-title">{t("education.education")} {index + 1}</span>
                        <Button className="delete-education-button" type="link" danger icon={<TrashIcon />} onClick={() => removeEducation(index)}>
                            {t("education.delete", "Delete")}
                        </Button>
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">{t("education.instituteName")} <span className="ep-required">*</span></label>
                        <Input value={edu.institute_name || ""} onChange={(e) => updateEducation(index, "institute_name", e.target.value)} />
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">{t("education.degree")} <span className="ep-required">*</span></label>
                        <Input value={edu.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                    </div>

                    <div className="ep-row-2">
                        <div className="ep-field">
                            <label className="ep-label">{t("education.startYear")} <span className="ep-required">*</span></label>
                            <Input type="number" value={edu.start_year || ""} onChange={(e) => updateEducation(index, "start_year", e.target.value)} />
                        </div>
                        <div className="ep-field">
                            <label className="ep-label">{t("education.endYear")} <span className="ep-required">*</span></label>
                            <Input type="number" value={edu.end_year || ""} onChange={(e) => updateEducation(index, "end_year", e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
