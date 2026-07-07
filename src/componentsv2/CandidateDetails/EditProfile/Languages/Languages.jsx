import React from 'react';
import { Input, Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Languages.scss';
import { useTranslation } from "react-i18next";
import { TrashIcon } from "../../../../constants/icons";

export default function Languages({ profileData, updateLanguage, addLanguage, removeLanguage }) {
    const { t } = useTranslation();

    const levelOptions = [
        { value: t("languages.beginner"),     label: "Beginner" },
        { value: t("languages.intermediate"),  label: "Intermediate" },
        { value: t("languages.advanced"),      label: "Advanced" },
        { value: t("languages.proficient"),    label: "Proficient" },
        { value: t("languages.native"),        label: "Native" },
    ];

    return (
        <div className="ep-section">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("languages.languages")}</h2>
                <Button className="ep-add-language-btn" type="link" icon={<PlusOutlined />} onClick={addLanguage}>
                    {t("languages.addLang")}
                </Button>
            </div>

            {profileData.languages.map((language, index) => (
                <div key={index} className="ep-inline-item ep-language-row">
                    <Input
                        value={language.language || ""}
                        placeholder={t("languages.language")}
                        onChange={(e) => updateLanguage(index, "language", e.target.value)}
                        className="ep-language-input"
                    />
                    <Select
                        value={language.level || undefined}
                        placeholder={t("languages.level")}
                        options={levelOptions}
                        onChange={(val) => updateLanguage(index, "level", val)}
                        className="ep-level-select"
                    />
                    <Button type="text" danger icon={<TrashIcon />} onClick={() => removeLanguage(index)} />
                </div>
            ))}
        </div>
    );
}
