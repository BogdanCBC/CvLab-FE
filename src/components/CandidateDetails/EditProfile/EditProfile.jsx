import React, { useState, useEffect } from "react";
import "./EditProfile.scss";
import api from "../../../api";
import GenerlInfo from "./GeneralInfo/GeneralInfo";
import Education from "./Education/Education";
import WorkExperience from "./WorkExperience/WorkExperience";
import Skills from "./Skills/Skills";
import Languages from "./Languages/Languages";
import Certifications from "./Certifications/Certifications";
import FeelIt from "./FeelIt/FeelIt";
import PersonalProjects from "./PersonalProjects/PersonalProjects";
import { Button, Segmented, Alert, Typography, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { SaveIcon } from "../../../constants/icons";

function EditProfile(props) {
    const { t } = useTranslation();
    const { candidateId, setEditMode } = props;

    const [profileData, setProfileData] = useState(null);
    const [selectedSection, setSelectedSection] = useState("GeneralInfo");
    const [unvalidMessage, setUnvalidMessage] = useState("");
    const [unvalidError, setUnvalidError] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchCandidateData(); }, [candidateId]);

    const fetchCandidateData = async () => {
        try {
            const response = await api.get(`/profile/${candidateId}`);
            setProfileData(response.data);
        } catch (error) {}
    };

    function formatValidationErrors(detail) {
        if (!Array.isArray(detail)) return t("editProfile.validationError");
        const humanize = (str) =>
            str.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/\s+/g, " ").trim().replace(/^./, (s) => s.toUpperCase());

        return detail.map((err) => {
            const loc = err.loc;
            let msg = err.msg;
            if (msg.includes("none is not an allowed value")) msg = t("editProfile.requiredField");
            else if (msg.includes("ensure this value is greater than 0")) msg = t("editProfile.greaterThan");
            else if (msg.includes("value is not a valid email address")) msg = t("editProfile.validEmail");

            let section = "", fieldStr = "", fieldNumber = "", field = "", subIndex = "";
            if (loc.length >= 2) section = humanize(loc[1]);
            if (loc.length >= 3 && typeof loc[2] === "string") fieldStr = ` ${loc[2].charAt(0).toUpperCase() + loc[2].slice(1)} `;
            if (loc.length >= 3 && typeof loc[2] === "number") fieldNumber = ` at field ${loc[2] + 1}`;
            if (loc.length >= 4) field = humanize(loc[3]);
            if (loc.length === 5 && typeof loc[4] === "number") subIndex = ` no ${loc[4] + 1}`;
            return `${section}${fieldStr}${fieldNumber} ${field}${subIndex} is invalid. ${msg}`;
        }).join("\n");
    }

    const saveNewObject = async (newData) => {
        try {
            const response = await api.put(`/candidates/${candidateId}`, newData);
            if (response.data) {
                setUnvalidMessage("");
                setUnvalidError(false);
                notification.success({
                    message: t("editProfile.candidateSaved"),
                    description: t("editProfile.candidateSavedDescription"),
                });
                window.dispatchEvent(new Event('refreshCandidates'));
                setEditMode(false);
            }
        } catch (err) {
            if (err.response?.status === 422) {
                const msg = formatValidationErrors(err.response.data?.detail);
                setUnvalidMessage(msg);
                setUnvalidError(true);
            }
        }
    };

    const updateGeneralInfo = (field, value) =>
        setProfileData((prev) => ({ ...prev, general_info: { ...prev.general_info, [field]: value } }));

    const updateEducation = (index, field, value) =>
        setProfileData((prev) => ({ ...prev, education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value === "" ? null : value } : edu) }));
    const addEducation = () =>
        setProfileData((prev) => ({ ...prev, education: [...prev.education, { institute_name: "", degree: "", start_year: new Date().getFullYear(), end_year: new Date().getFullYear() }] }));
    const removeEducation = (index) =>
        setProfileData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));

    const addWorkExperience = () =>
        setProfileData((prev) => ({ ...prev, work_experience: [...prev.work_experience, { company_name: "", job_title: "", country: "", link: null, start_date: null, end_date: null, responsibilities: [] }] }));
    const updateWorkExperience = (index, field, value) =>
        setProfileData((prev) => ({ ...prev, work_experience: prev.work_experience.map((work, i) => i === index ? { ...work, [field]: value === "" ? null : value } : work) }));
    const removeWorkExperience = (index) =>
        setProfileData((prev) => ({ ...prev, work_experience: prev.work_experience.filter((_, i) => i !== index) }));
    const addResponsability = (index) =>
        setProfileData((prev) => ({ ...prev, work_experience: prev.work_experience.map((work, i) => i === index ? { ...work, responsibilities: [...(work.responsibilities || []), ""] } : work) }));
    const updateResponsability = (workIndex, respIndex, value) =>
        setProfileData((prev) => ({ ...prev, work_experience: prev.work_experience.map((exp, i) => i === workIndex ? { ...exp, responsibilities: exp.responsibilities.map((resp, j) => j === respIndex ? (value === "" ? null : value) : resp) } : exp) }));
    const removeResponsability = (workIndex, respIndex) =>
        setProfileData((prev) => ({ ...prev, work_experience: prev.work_experience.map((exp, i) => i === workIndex ? { ...exp, responsibilities: exp.responsibilities.filter((_, j) => j !== respIndex) } : exp) }));

    const updateSkills = (index, field, value) =>
        setProfileData((prev) => ({ ...prev, skills: prev.skills.map((skill, i) => i === index ? { ...skill, [field]: value } : skill) }));
    const addSkill = () =>
        setProfileData((prev) => ({ ...prev, skills: [{ skill: "", years: 0 }, ...prev.skills] }));
    const removeSkill = (index) =>
        setProfileData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    const updateSkillPosition = (oldIndex, newIndex) =>
        setProfileData((prev) => { const s = [...prev.skills]; const [m] = s.splice(oldIndex, 1); s.splice(newIndex, 0, m); return { ...prev, skills: s }; });

    const updateLanguage = (index, field, value) =>
        setProfileData((prev) => ({ ...prev, languages: prev.languages.map((lang, i) => i === index ? { ...lang, [field]: value } : lang) }));
    const addLanguage = () =>
        setProfileData((prev) => ({ ...prev, languages: [...prev.languages, { language: "", level: "" }] }));
    const removeLanguage = (index) =>
        setProfileData((prev) => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) }));

    const updateCertifications = (index, value) =>
        setProfileData((prev) => ({ ...prev, certifications: prev.certifications.map((cert, i) => i === index ? value : cert) }));
    const addCertification = () =>
        setProfileData((prev) => ({ ...prev, certifications: [...prev.certifications, ""] }));
    const removeCertification = (index) =>
        setProfileData((prev) => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));

    const addFeelItClient = () =>
        setProfileData((prev) => ({ ...prev, feel_it: [...prev.feel_it, { client_name: "", client_description: "", link: "", responsibilities: [] }] }));
    const updateFeelItClient = (index, field, value) =>
        setProfileData((prev) => ({ ...prev, feel_it: prev.feel_it.map((client, i) => i === index ? { ...client, [field]: value === "" ? null : value } : client) }));
    const updateFeelItClientPosition = (oldIndex, newIndex) =>
        setProfileData((prev) => { const c = [...prev.feel_it]; const [m] = c.splice(oldIndex, 1); c.splice(newIndex, 0, m); return { ...prev, feel_it: c }; });
    const removeFeelItClient = (index) =>
        setProfileData((prev) => ({ ...prev, feel_it: prev.feel_it.filter((_, i) => i !== index) }));
    const addFeelItResponsibility = (clientIndex) =>
        setProfileData((prev) => ({ ...prev, feel_it: prev.feel_it.map((client, i) => i === clientIndex ? { ...client, responsibilities: [...(client.responsibilities || []), ""] } : client) }));
    const updateFeelItResponsibility = (clientIndex, respIndex, value) =>
        setProfileData((prev) => ({ ...prev, feel_it: prev.feel_it.map((client, i) => i === clientIndex ? { ...client, responsibilities: client.responsibilities.map((resp, j) => j === respIndex ? value : resp) } : client) }));
    const removeFeelItResponsibility = (clientIndex, respIndex) =>
        setProfileData((prev) => ({ ...prev, feel_it: prev.feel_it.map((client, i) => i === clientIndex ? { ...client, responsibilities: client.responsibilities.filter((_, j) => j !== respIndex) } : client) }));

    const addPersonalProject = () =>
        setProfileData((prev) => ({ ...prev, personal_projects: [...prev.personal_projects, { project_name: "", achievements: [] }] }));
    const removePersonalProject = (index) =>
        setProfileData((prev) => ({ ...prev, personal_projects: prev.personal_projects.filter((_, i) => i !== index) }));
    const updatePersonalProject = (index, field, value) =>
        setProfileData((prev) => ({ ...prev, personal_projects: prev.personal_projects.map((project, i) => i === index ? { ...project, [field]: value === "" ? null : value } : project) }));
    const addPersonalProjectAchievement = (achievementIndex) =>
        setProfileData((prev) => ({ ...prev, personal_projects: prev.personal_projects.map((project, i) => i === achievementIndex ? { ...project, achievements: [...(project.achievements || []), ""] } : project) }));
    const updatePersonalProjectAchievement = (projectIndex, achIndex, value) =>
        setProfileData((prev) => ({ ...prev, personal_projects: prev.personal_projects.map((project, i) => i === projectIndex ? { ...project, achievements: project.achievements.map((resp, j) => j === achIndex ? value : resp) } : project) }));
    const removePersonalProjectAchievement = (projectIndex, achIndex) =>
        setProfileData((prev) => ({ ...prev, personal_projects: prev.personal_projects.map((project, i) => i === projectIndex ? { ...project, achievements: project.achievements.filter((_, j) => j !== achIndex) } : project) }));

    const candidateName = profileData
        ? `${profileData.general_info?.first_name || ""} ${profileData.general_info?.last_name || ""}`.trim()
        : "...";

    const showFeelIt = ["default", "feelit"].includes(localStorage.getItem("clientName"));

    const segmentOptions = [
        { value: "GeneralInfo", label: t("editProfile.general") },
        { value: "Education", label: t("editProfile.education") },
        { value: "WorkExperience", label: t("editProfile.workExperience") },
        { value: "Skills", label: t("editProfile.skills") },
        { value: "Languages", label: t("editProfile.lang") },
        { value: "Certifications", label: t("editProfile.certifications") },
        ...(showFeelIt ? [{ value: "FeelIt", label: "Feel IT" }] : []),
        { value: "PersonalProjects", label: t("editProfile.personalProj") },
    ];

    return (
        <div className="edit-profile-wrapper">
            <div className="edit-profile-header">
                <div className="edit-header-left">
                    <Button type="text" icon={<ArrowLeftOutlined />} className="back-btn" onClick={() => setEditMode(false)} />
                    <div className="edit-candidate-name-block">
                        <span className="edit-candidate-label">{t("candidate.candidateName", "Candidate")}</span>
                        <h2 className="edit-candidate-name">{candidateName}</h2>
                    </div>
                </div>
                <Button
                    icon={<SaveIcon />}
                    onClick={() => saveNewObject(profileData)}
                    className="save-btn filled-btn"
                >
                    {t("editProfile.saveBtn", "Save changes")}
                </Button>
            </div>

            {unvalidError && (
                <Alert
                    type="error"
                    className="edit-alert"
                    message={
                        <div>
                            {unvalidMessage.split("\n").map((line, i) => (
                                <Typography.Text key={i} style={{ display: "block" }}>{line}</Typography.Text>
                            ))}
                        </div>
                    }
                />
            )}

            {!profileData ? (
                <p className="loading-text">{t("editProfile.loadingData")}</p>
            ) : (
                <div className="edit-profile-segmented-wrapper">
                    <div className="edit-profile-segmented-bar">
                        <Segmented options={segmentOptions} value={selectedSection} onChange={setSelectedSection} />
                    </div>
                    <div className="edit-section-content">
                        {selectedSection === "GeneralInfo" && <GenerlInfo profileData={profileData} updateGeneralInfo={updateGeneralInfo} />}
                        {selectedSection === "Education" && <Education profileData={profileData} updateEducation={updateEducation} addEducation={addEducation} removeEducation={removeEducation} />}
                        {selectedSection === "WorkExperience" && <WorkExperience profileData={profileData} updateWorkExperience={updateWorkExperience} addWorkExperience={addWorkExperience} removeWorkExperience={removeWorkExperience} addResponsability={addResponsability} updateResponsability={updateResponsability} removeResponsability={removeResponsability} />}
                        {selectedSection === "Skills" && <Skills profileData={profileData} updateSkills={updateSkills} addSkill={addSkill} removeSkill={removeSkill} updateSkillPosition={updateSkillPosition} />}
                        {selectedSection === "Languages" && <Languages profileData={profileData} updateLanguage={updateLanguage} addLanguage={addLanguage} removeLanguage={removeLanguage} />}
                        {selectedSection === "Certifications" && <Certifications profileData={profileData} updateCertifications={updateCertifications} addCertification={addCertification} removeCertification={removeCertification} />}
                        {selectedSection === "FeelIt" && showFeelIt && <FeelIt profileData={profileData} updateFeelItClient={updateFeelItClient} addFeelItClient={addFeelItClient} removeFeelItClient={removeFeelItClient} updateFeelItResponsibility={updateFeelItResponsibility} addFeelItResponsibility={addFeelItResponsibility} removeFeelItResponsibility={removeFeelItResponsibility} updateFeelItClientPosition={updateFeelItClientPosition} />}
                        {selectedSection === "PersonalProjects" && <PersonalProjects profileData={profileData} updatePersonalProject={updatePersonalProject} addPersonalProject={addPersonalProject} removePersonalProject={removePersonalProject} updatePersonalProjectAchievement={updatePersonalProjectAchievement} addPersonalProjectAchievement={addPersonalProjectAchievement} removePersonalProjectAchievement={removePersonalProjectAchievement} />}
                    </div>
                    <div className="edit-section-content-fade" />
                </div>
            )}
        </div>
    );
}

export default EditProfile;
