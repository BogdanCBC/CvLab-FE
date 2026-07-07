import React from 'react';
import { Input, Button, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './WorkExperience.scss';
import { useTranslation } from "react-i18next";
import { TrashIcon } from '../../../../constants/icons';

const COUNTRIES = [
    'Albania','Austria','Belgium','Bosnia','Bulgaria','Croatia','Cyprus','Czech Republic',
    'Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland',
    'Italy','Kosovo','Latvia','Lithuania','Luxembourg','Malta','Moldova','Montenegro',
    'Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Serbia',
    'Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom',
    'United States','Canada','Australia','India','China','Japan','Brazil','Argentina',
    'Mexico','South Africa','Egypt','Turkey',
].map((c) => ({ value: c, label: c }));

const toDate = (val) => {
    if (!val) return null;
    const d = dayjs(val);
    return d.isValid() ? d : null;
};

export default function WorkExperience(props) {
    const { t } = useTranslation();
    const { profileData, updateWorkExperience, addWorkExperience, removeWorkExperience,
            addResponsability, updateResponsability, removeResponsability } = props;

    return (
        <div className="ep-section work-experience">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("workExperience.workExp")}</h2>
                <Button type="link" icon={<PlusOutlined />} onClick={addWorkExperience} className="add-work-experience-button">
                    {t("workExperience.addWorkBtn")}
                </Button>
            </div>

            {profileData.work_experience.map((work, index) => (
                <div key={index} className="ep-item-card">
                    <div className="ep-item-header">
                        <span className="ep-item-title">{t("workExperience.workExp")} {index + 1}</span>
                        <Button type="link" danger icon={<TrashIcon />} className="delete-work-experience-button" onClick={() => removeWorkExperience(index)}>
                            {t("education.delete", "Delete")}
                        </Button>
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">{t("workExperience.companyName")} <span className="ep-required">*</span></label>
                        <Input value={work.company_name || ""} onChange={(e) => updateWorkExperience(index, "company_name", e.target.value)} />
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">{t("workExperience.jobTitle")} <span className="ep-required">*</span></label>
                        <Input value={work.job_title || ""} onChange={(e) => updateWorkExperience(index, "job_title", e.target.value)} />
                    </div>

                    <div className="ep-row-2">
                        <div className="ep-field">
                            <label className="ep-label">{t("workExperience.country")} <span className="ep-required">*</span></label>
                            <Select
                                showSearch
                                value={work.country || undefined}
                                placeholder={t("workExperience.country")}
                                options={COUNTRIES}
                                onChange={(val) => updateWorkExperience(index, "country", val)}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="ep-field">
                            <label className="ep-label">{t("workExperience.link")} <span className="ep-required">*</span></label>
                            <Input value={work.link || ""} onChange={(e) => updateWorkExperience(index, "link", e.target.value)} />
                        </div>
                    </div>

                    <div className="ep-row-2">
                        <div className="ep-field">
                            <label className="ep-label">{t("workExperience.startDate")} <span className="ep-required">*</span></label>
                            <DatePicker
                                format="DD.MM.YYYY"
                                value={toDate(work.start_date)}
                                onChange={(date) => updateWorkExperience(index, "start_date", date ? date.format("YYYY-MM-DD") : null)}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="ep-field">
                            <label className="ep-label">{t("workExperience.endDate")} <span className="ep-required">*</span></label>
                            <DatePicker
                                format="DD.MM.YYYY"
                                value={toDate(work.end_date)}
                                onChange={(date) => updateWorkExperience(index, "end_date", date ? date.format("YYYY-MM-DD") : null)}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">{t("workExperience.description")}</label>
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} value={work.work_description || ""} onChange={(e) => updateWorkExperience(index, "work_description", e.target.value)} />
                    </div>

                    <div className="ep-sub-section">
                        <div className="ep-sub-header">
                            <span className="ep-sub-title">{t("workExperience.responsibilities")}</span>
                            <Button type="link" icon={<PlusOutlined />} onClick={() => addResponsability(index)} className="add-responsability-button">
                                {t("workExperience.responsibility", "Add responsibility")}
                            </Button>
                        </div>
                        {work.responsibilities?.map((resp, respIndex) => (
                            <div key={respIndex} className="ep-inline-item">
                                <Input
                                    value={resp || ""}
                                    onChange={(e) => updateResponsability(index, respIndex, e.target.value)}
                                />
                                <Button type="text" danger icon={<TrashIcon />} onClick={() => removeResponsability(index, respIndex)} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
