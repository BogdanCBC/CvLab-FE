import React, { useState } from "react";
import { Button, Input, Select, Tag, Space, message } from "antd";
import { PlusIconBlue } from "../../../../../constants/icons";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";
import api from "../../../../../api";
import { useTranslation } from "react-i18next";
import "./EditMode.scss";
import { SaveIcon } from "../../../../../constants/icons";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function EditMode({ jobInfo, setEditMode, setJobs, setJobInfo, selectedJob, updateJobInfoFromJobs }) {
    const { t, i18n } = useTranslation();

    const languageLevels = [
        { label: t("jdEditMode.beginner"), value: "Beginner" },
        { label: t("jdEditMode.intermediate"), value: "Intermediate" },
        { label: t("jdEditMode.advanced"), value: "Advanced" },
        { label: t("jdEditMode.proficient"), value: "Proficient" },
        { label: t("jdEditMode.native"), value: "Native" },
    ];

    const [jobData, setJobData] = useState(jobInfo);
    const [skills, setSkills] = useState(jobInfo.skills || []);
    const [newSkill, setNewSkill] = useState("");
    const [yearsInput, setYearsInput] = useState("");

    const [languages, setLanguages] = useState(jobInfo.languages || []);
    const [newLanguage, setNewLanguage] = useState("");
    const [languageLevel, setLanguageLevel] = useState("Beginner");

    const handleAddSkill = () => {
        if (!newSkill.trim() || !yearsInput.trim()) return;
        setSkills((prev) => [
            ...prev,
            { skill: newSkill.trim(), years: parseInt(yearsInput, 10) },
        ]);
        setNewSkill("");
        setYearsInput("");
    };

    const handleAddLanguage = () => {
        if (!newLanguage.trim() || !languageLevel.trim()) return;
        const upperCaseLanguage =
            String(newLanguage).charAt(0).toUpperCase() +
            String(newLanguage).slice(1).toLowerCase();
        setLanguages((prev) => [
            ...prev,
            { language: upperCaseLanguage.trim(), level: languageLevel.trim() },
        ]);
        setNewLanguage("");
        setLanguageLevel("Beginner");
    };

    const handleDeleteSkill = (index) => {
        setSkills((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteLanguage = (index) => {
        setLanguages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = { ...jobData, skills, languages };
        try {
            const result = await api.put("/job-description", dataToSubmit);
            if (result.data.success) {
                const response = await fetchJobDescription(i18n.language);
                if (response.success) {
                    message.success(t("jdEditMode.editSuccess"));
                    const jobsList = response.jobs || [];
                    setJobs(jobsList);
                    updateJobInfoFromJobs(jobsList, selectedJob);
                }
                setJobInfo({ ...jobData, skills, languages });
                setEditMode(false);
            }
        } catch (err) {
            message.error(err?.response?.data?.message || "Error");
            console.log("Error updating");
        }
    };

    return (
        <>
        <div className="jd-card-header">
            <div className="jd-edit-left">
                <Button type="text" icon={<ArrowLeftOutlined />} className="back-btn" onClick={() => setEditMode(false)} />
                <div className="jd-name-block">
                    <span className="jd-label">Job name</span>
                    <h2 className="jd-title">{jobInfo.title}</h2>
                </div>
            </div>
            <div className="jd-header-actions">
                <Button
                    icon={<SaveIcon />}
                    onClick={handleSubmit}
                    className="edit-jd-btn filled-btn"
                >
                    {t("editProfile.saveBtn")}
                </Button>
            </div>
        </div>
        <form onSubmit={handleSubmit} className="jd-edit-mode">
            <div className="title">{t("generalInfo.general")}</div>
            <div className="edit-field">
                <label className="edit-label">{t("jdEditMode.title")} <span className="jd-required">*</span></label>
                <Input
                    className="edit-input"
                    value={jobData.title}
                    onChange={(e) =>
                        setJobData((prev) => ({ ...prev, title: e.target.value }))
                    }
                />
            </div>

            <div className="edit-field">
                <label className="edit-label">{t("jdEditMode.jobDescription")} <span className="jd-required">*</span></label>
                <TextArea
                    value={jobData.description}
                    rows={10}
                    onChange={(e) =>
                        setJobData((prev) => ({ ...prev, description: e.target.value }))
                    }
                />
            </div>

            <div className="edit-field">
                <label className="edit-label">{t("editProfile.skills")} <span className="jd-required">*</span></label>
                <Space.Compact className="add-row">
                    <Input
                        placeholder={t("jdEditMode.addSkill")}
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <Input
                        placeholder={t("jdEditMode.years")}
                        type="number"
                        min={0}
                        value={yearsInput}
                        onChange={(e) => setYearsInput(e.target.value)}
                        style={{ width: 100 }}
                    />
                    <Button
                        icon={<PlusIconBlue />}
                        onClick={handleAddSkill}
                        type="default"
                    />
                </Space.Compact>
                <Space wrap style={{ marginTop: 8, marginBottom: 8 }}>
                    {skills.map((s, index) => (
                        <Tag
                            className="tag"
                            key={index}
                            closable
                            onClose={() => handleDeleteSkill(index)}
                        >
                            {`${s.skill} (${s.years} ${t("jdEditMode.yrs")})`}
                        </Tag>
                    ))}
                </Space>
            </div>
            <div className="edit-field">
                <label className="edit-label">{t("editProfile.lang")} <span className="jd-required">*</span></label>
                <Space.Compact className="add-row">
                    <Input
                        placeholder={t("jdEditMode.addLanguage")}
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                    />
                    <Select
                        value={languageLevel}
                        onChange={(val) => setLanguageLevel(val)}
                        options={languageLevels}
                        style={{ minWidth: 140 }}
                    />
                    <Button
                        icon={<PlusIconBlue />}
                        onClick={handleAddLanguage}
                        type="default"
                    />
                </Space.Compact>
                <Space wrap style={{ marginTop: 8, marginBottom: 8 }}>
                    {languages.map((l, index) => (
                        <Tag
                            className="tag"
                            key={index}
                            closable
                            onClose={() => handleDeleteLanguage(index)}
                        >
                            {`${l.language} (Level: ${l.level})`}
                        </Tag>
                    ))}
                </Space>
            </div>
        </form>
        </>
    );
}
