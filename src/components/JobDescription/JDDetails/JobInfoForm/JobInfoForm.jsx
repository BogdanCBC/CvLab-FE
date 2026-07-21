import React, { useState } from "react";
import { Modal, Button, Input, Select, Tag, Space, notification } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../../../api";
import { fetchJobDescription } from "../../../../utils/fetchJobDescription";
import { PlusIconBlue } from "../../../../constants/icons";
import "../SelectedJD/EditMode/EditMode.scss";

const { TextArea } = Input;

const JobIconBlue = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.3334 5.83333C13.3334 5.05836 13.3334 4.67087 13.2482 4.35295C13.017 3.49022 12.3431 2.81635 11.4804 2.58519C11.1625 2.5 10.775 2.5 10 2.5C9.22504 2.5 8.83756 2.5 8.51964 2.58519C7.65691 2.81635 6.98304 3.49022 6.75187 4.35295C6.66669 4.67087 6.66669 5.05836 6.66669 5.83333M10.6667 14.5833H14.75C14.9834 14.5833 15.1001 14.5833 15.1892 14.5379C15.2676 14.498 15.3313 14.4342 15.3713 14.3558C15.4167 14.2667 15.4167 14.15 15.4167 13.9167V11.9167C15.4167 11.6833 15.4167 11.5666 15.3713 11.4775C15.3313 11.3991 15.2676 11.3354 15.1892 11.2954C15.1001 11.25 14.9834 11.25 14.75 11.25H10.6667C10.4333 11.25 10.3167 11.25 10.2275 11.2954C10.1491 11.3354 10.0854 11.3991 10.0454 11.4775C10 11.5666 10 11.6833 10 11.9167V13.9167C10 14.15 10 14.2667 10.0454 14.3558C10.0854 14.4342 10.1491 14.498 10.2275 14.5379C10.3167 14.5833 10.4333 14.5833 10.6667 14.5833ZM5.66669 17.5H14.3334C15.7335 17.5 16.4335 17.5 16.9683 17.2275C17.4387 16.9878 17.8212 16.6054 18.0609 16.135C18.3334 15.6002 18.3334 14.9001 18.3334 13.5V9.83333C18.3334 8.4332 18.3334 7.73314 18.0609 7.19836C17.8212 6.72795 17.4387 6.3455 16.9683 6.10582C16.4335 5.83333 15.7335 5.83333 14.3334 5.83333H5.66669C4.26656 5.83333 3.56649 5.83333 3.03171 6.10582C2.56131 6.3455 2.17885 6.72795 1.93917 7.19836C1.66669 7.73314 1.66669 8.4332 1.66669 9.83333V13.5C1.66669 14.9001 1.66669 15.6002 1.93917 16.135C2.17885 16.6054 2.56131 16.9878 3.03171 17.2275C3.56649 17.5 4.26656 17.5 5.66669 17.5Z" stroke="#0BA5EC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function JobInfoForm({ open, setJobs, setUploadNew, clientId }) {
    const { t, i18n } = useTranslation();
    const [uploading, setUploading] = useState(false);

    const languageLevels = [
        { label: t("jdEditMode.beginner"), value: "Beginner" },
        { label: t("jdEditMode.intermediate"), value: "Intermediate" },
        { label: t("jdEditMode.advanced"), value: "Advanced" },
        { label: t("jdEditMode.proficient"), value: "Proficient" },
        { label: t("jdEditMode.native"), value: "Native" },
    ];

    const [formData, setFormData] = useState({ title: "", description: "" });
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [yearsInput, setYearsInput] = useState("");
    const [languages, setLanguages] = useState([]);
    const [newLanguage, setNewLanguage] = useState("");
    const [languageLevel, setLanguageLevel] = useState("Beginner");

    const handleAddSkill = () => {
        if (!newSkill.trim() || !yearsInput.trim()) return;
        setSkills((prev) => [...prev, { skill: newSkill.trim(), years: parseInt(yearsInput, 10) }]);
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

    const handleDeleteSkill = (index) => setSkills((prev) => prev.filter((_, i) => i !== index));
    const handleDeleteLanguage = (index) => setLanguages((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        setUploading(true);
        const currentLang = i18n.language?.startsWith("fr") ? "French" : "English";
        const payload = { ...formData, skills, languages, language: currentLang, client_id: clientId };

        try {
            const response = await api.post("/job-description", payload);
            if (response.data.success) {
                notification.success({ message: t("jdEditMode.createdSuccess"), description: t("jdEditMode.createdSuccessDescription") });
                setFormData({ title: "", description: "" });
                setSkills([]);
                setLanguages([]);
                fetchJobDescription(i18n.language, clientId).then((res) => {
                    if (res.success) setJobs(res.jobs || []);
                });
            }
            setUploading(false);
            setTimeout(() => setUploadNew(false), 500);
        } catch (err) {
            notification.error({ message: err?.response?.data?.message || "Error" });
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: "", description: "" });
        setSkills([]);
        setLanguages([]);
        setUploadNew(false);
    };

    const isSubmitDisabled = !formData.title.trim() || !formData.description.trim() || uploading;

    const modalTitle = (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
                background: "#EFF8FF",
                border: "1px solid #B2DDFF",
                borderRadius: 10,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}>
                <JobIconBlue />
            </div>
            <span style={{ fontWeight: 600, fontSize: 16, color: "#101828" }}>{t("jdEditMode.createNew")}</span>
        </div>
    );

    const modalFooter = (
        <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <Button onClick={handleClose} disabled={uploading} style={{ flex: 1, height: 40 }}>
                {t("jdEditMode.cancel")}
            </Button>
            <Button
                className="default-button"
                type="primary"
                onClick={handleSubmit}
                loading={uploading}
                disabled={isSubmitDisabled}
                style={{ flex: 1, height: 40 }}
            >
                {t("jdEditMode.addJobDescription", "Add job description")}
            </Button>
        </div>
    );

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={modalTitle}
            footer={modalFooter}
            width={764}
            closable={!uploading}
            mask={{ closable: !uploading }}
            destroyOnHidden
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 0 8px" }}>
                <div>
                    <label style={{ fontWeight: 500, fontSize: 13, display: "block", marginBottom: 6, color: "#344054" }}>
                        {t("jdEditMode.title")} <span style={{ color: "#2391D1" }}>*</span>
                    </label>
                    <Input
                        style={{ height: 44 }}
                        placeholder="ex: Front end developer"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        disabled={uploading}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 500, fontSize: 13, display: "block", marginBottom: 6, color: "#344054" }}>
                        {t("jdEditMode.jobDescription")} <span style={{ color: "#2391D1" }}>*</span>
                    </label>
                    <TextArea
                        placeholder="Enter a description..."
                        rows={8}
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        disabled={uploading}
                    />
                </div>

                <div className="jd-edit-mode" style={{ padding: 0, margin: 0, border: "none", background: "none", borderRadius: 0, maxHeight: "none", overflow: "visible", gap: 16 }}>
                    <div className="edit-field">
                        <label className="edit-label">{t("editProfile.skills")} <span className="jd-required">*</span></label>
                        <Space.Compact className="add-row">
                            <Input
                                placeholder={t("jdEditMode.addSkill")}
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                disabled={uploading}
                            />
                            <Input
                                placeholder={t("jdEditMode.years")}
                                type="number"
                                min={0}
                                value={yearsInput}
                                onChange={(e) => setYearsInput(e.target.value)}
                                style={{ width: 100 }}
                                disabled={uploading}
                            />
                            <Button
                                icon={<PlusIconBlue />}
                                onClick={handleAddSkill}
                                type="default"
                                disabled={uploading}
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
                                disabled={uploading}
                            />
                            <Select
                                value={languageLevel}
                                onChange={(val) => setLanguageLevel(val)}
                                options={languageLevels}
                                style={{ minWidth: 140 }}
                                disabled={uploading}
                            />
                            <Button
                                icon={<PlusIconBlue />}
                                onClick={handleAddLanguage}
                                type="default"
                                disabled={uploading}
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
                </div>
            </div>
        </Modal>
    );
}
