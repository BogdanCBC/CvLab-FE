import React, { useState ,useEffect } from "react";
import "./EditProfile.css";
import api from "../../../api";
import GenerlInfo from "./GeneralInfo/GeneralInfo";
import Education from "./Education/Education";
import WorkExperience from "./WorkExperience/WorkExperience";
import Skills from "./Skills/Skills";
import Languages from "./Languages/Languages";
import Certifications from "./Certifications/Certifications";
import FeelIt from "./FeelIt/FeelIt"
import PersonalProjects from "./PersonalProjects/PersonalProjects"

import { Button, Box, Alert, Typography } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, grey } from '@mui/material/colors';
import {useTranslation} from "react-i18next";

const theme = createTheme({
  palette: {
    primary: green,
    secondary: grey,
  },
});

function EditProfile(props) {
    const {t} = useTranslation();

    const { candidateId, setEditMode } = props;
    const [profileData, setProfileData] = useState(null);
    const [selectedSection, setSelectedSection] = useState('GeneralInfo');
    const [unvalidMessage, setUnvalidMessage] = useState("");
    const [unvalidError, setUnvalidError] = useState(false);

    const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchCandidateData();
    }, []);

    const fetchCandidateData = async () => {
        try {
            const response = await api.get(`/profile/${candidateId}`)
            setProfileData(response.data);
        } catch (error) {
            // console.error("Error fetching candidate data:", error);
        }
    }

    function formatValidationErrors(detail) {
        if (!Array.isArray(detail)) return t("editProfile.validationError");

        // turn snake_case or camelCase into "Title Case"
        const humanize = (str) =>
            str
                .replace(/_/g, " ")
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/^./, (s) => s.toUpperCase());

        return detail.map((err) => {
            const loc = err.loc;
            let msg = err.msg;
            console.log(err.msg)
            console.log(err.loc)
            if (msg.includes("none is not an allowed value")) {
                msg = t("editProfile.requiredField");
            } else if (msg.includes("ensure this value is greater than 0")) {
                msg = t("editProfile.greaterThan");
            } else if (msg.includes("value is not a valid email address")) {
                msg = t("editProfile.validEmail");
            }

            let section = "";
            let fieldStr = "";
            let fieldNumber = "";
            let field = "";
            let subIndex = "";

            // example: ["body", "work_experience", 0, "responsibilities", 1]
            if (loc.length >= 2) {
                section = humanize(loc[1]); // work_experience → Work Experience
            }
            if (loc.length >= 3 && typeof loc[2] === "string"){
                fieldStr = ` ${loc[2].charAt(0).toUpperCase() + loc[2].slice(1)} `
            }
            if (loc.length >= 3 && typeof loc[2] === "number") {
                fieldNumber = ` at field ${loc[2] + 1}`;
            }
            if (loc.length >= 4) {
                field = humanize(loc[3]); // end_date → End date
            }
            if (loc.length === 5 && typeof loc[4] === "number") {
                subIndex = ` no ${loc[4] + 1}`;
            }

            return `${section}${fieldStr}${fieldNumber} ${field}${subIndex} is invalid. ${msg}`;
        }).join("\n");
    }

    const saveNewObject = async (newData) => {
        try {
            // console.log("New Data:", newData)
            const response = await api.put(`/candidates/${candidateId}`, newData);
            if (response.data){
                setUnvalidMessage("");
                setUnvalidError(false);

                setSaveSuccessMessage(t("editProfile.candidateSaved"));
                setSaveSuccess(true);
                setTimeout(() => {
                    setSaveSuccessMessage("");
                    setSaveSuccess(false);
                }, 5000);
            }

            // console.log("Status", response)
        } catch (err) {
            if (err.response?.status === 422) {
                const message = formatValidationErrors(err.response.data?.detail);
                setUnvalidMessage(message);
                setUnvalidError(true);
            }
        }
    }

    const updateGeneralInfo = (field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            general_info: {
                ...prevData.general_info,
                [field]: value
            }
        }));
    };

    const updateEducation = (index, field, value) => {
        setProfileData(prevData => ({
            ...prevData,
            education: prevData.education.map((edu, i) => 
                i === index ? {...edu, [field]: value === "" ? null : value} : edu)
        }));
    };

    const addEducation = () => {
        setProfileData(prevData => ({
            ...prevData,
            education: [...prevData.education, {
                institute_name: "",
                degree: "",
                start_year: new Date().getFullYear(),
                end_year: new Date().getFullYear(),
            }]
        }));
    };

    const removeEducation = (index) => {
        setProfileData(prevData => ({
            ...prevData,
            education: prevData.education.filter((_, i) => i !==index)
        }));
    };

    const addWorkExperience = () => {
        setProfileData(prevData => ({
            ...prevData,
            work_experience: [...prevData.work_experience, {
                company_name: "",
                job_title: "",
                country: "",
                link: null,
                start_date: new Date().getFullYear(),
                end_date: new Date().getFullYear(),
                responsibilities: []
            }]
        }))
    }

    const updateWorkExperience = (index, field, value) => {
        setProfileData(prevData => ({
            ...prevData,
            work_experience: prevData.work_experience.map((work, i) =>
                i === index
                    ? { ...work, [field]: value === "" ? null : value }
                    : work
            )
        }));
    };

    const removeWorkExperience = (index) => {
        setProfileData(prevData => ({
            ...prevData,
            work_experience: prevData.work_experience.filter((_, i) => i !== index)
        }))
    }

    const addResponsability = (index) => {
        setProfileData(prevData => ({
            ...prevData,
            work_experience: prevData.work_experience.map((work, i) => 
                i === index 
                    ? { ...work, responsibilities: [...(work.responsibilities || []), ""] }
                    : work
            )
        }))
    }

    const updateResponsability = (workIndex, respIndex, value) => {
        setProfileData(prevData => ({
            ...prevData,
            work_experience: prevData.work_experience.map((exp, i) => 
                i === workIndex 
                ? { ...exp,
                    responsibilities: exp.responsibilities.map((resp, j) => 
                        j === respIndex ? (value === "" ? null : value) : resp
                    )
                } : exp
            )
        }));
    }

    const removeResponsability = (workIndex, respIndex) => {
        setProfileData(prevData => ({
            ...prevData,
            work_experience: prevData.work_experience.map((exp, i) => 
                i === workIndex 
                ? { ...exp,
                    responsibilities: exp.responsibilities.filter((_, j) => j !== respIndex)
                } : exp
            )
        }))
    }

    const updateSkills = (index, field, value) => {
        setProfileData(prevData => ({
            ...prevData,
            skills: prevData.skills.map((skill, i) => 
                i === index ? {...skill, [field] : value} : skill
            )
        }));
    }

    const addSkill = () => {
        setProfileData(prevData => ({
            ...prevData,
            skills: [ {skill: "", years: 0}, ...prevData.skills]
        }));
    }

    const removeSkill = (index) => {
        setProfileData(prevData => ({
            ...prevData,
            skills: prevData.skills.filter((_, i) => i !== index)
        }));
    }

    const updateSkillPosition = (oldIndex, newIndex) => {
        setProfileData(prevData => {
            const updatedSkills = [...prevData.skills];
            const [moved] = updatedSkills.splice(oldIndex, 1);
            updatedSkills.splice(newIndex, 0, moved);

            return {
            ...prevData,
            skills: updatedSkills
            };
        });
    };


    const updateLanguage = (index, field, value) => {
        setProfileData(prevData => ({
            ...prevData,
            languages: prevData.languages.map((lang, i) => 
                i === index ? { ...lang, [field]: value } : lang
            )
        }))
    }

    const addLanguage = () => {
        setProfileData(prevData => ({
            ...prevData,
            languages: [...prevData.languages, {language: "", level: ""}]
        }))
    }

    const removeLanguage = (index) => {
        setProfileData(prevData => ({
            ...prevData,
            languages: prevData.languages.filter((_, i) => i !== index)
        }))
    }

    const updateCertifications = (index, value) => {
        setProfileData(prev => ({
            ...prev,
            certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
        }));
    };

    const addCertification = () => {
        setProfileData(prev => ({
            ...prev,
            certifications: [...prev.certifications, ""]
        }));
    };

    const removeCertification = (index) => {
        setProfileData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const addFeelItClient = () => {
        setProfileData(prev => ({
            ...prev, 
            feel_it : [...prev.feel_it, {
                client_name: "",
                client_description: "",
                link: "",
                responsibilities: []
            }]
        }));
    }

    const updateFeelItClient = (index, field, value) => {
        setProfileData(prev => ({
            ...prev,
            feel_it: prev.feel_it.map((client, i) => 
                i === index ? {...client, [field]: value === "" ? null : value} : client
            ) 
        }));
    };

    const updateFeelItClientPosition = (oldIndex, newIndex) => {
        setProfileData(prevData => {
            const updatedClients = [...prevData.feel_it];
            const [moved] = updatedClients.splice(oldIndex, 1);
            updatedClients.splice(newIndex, 0, moved);

            return {
                ...prevData,
                feel_it: updatedClients
            };
        });
    }

    const removeFeelItClient = (index) => {
        setProfileData(prev => ({
            ...prev,
            feel_it: prev.feel_it.filter((_, i) => i !== index)
        }));
    }

    const addFeelItResponsibility = (clientIndex) => {
        setProfileData(prev => ({
            ...prev,
            feel_it: prev.feel_it.map((client, i) => 
                i === clientIndex ? {
                    ...client,
                    responsibilities: [...(client.responsibilities || []), ""]
                } : client
            )
        }));
    };


    const updateFeelItResponsibility = (clientIndex, respIndex, value) => {
        setProfileData(prev => ({
        ...prev,
        feel_it: prev.feel_it.map((client, i) => 
            i === clientIndex ? { 
            ...client, 
            responsibilities: client.responsibilities.map((resp, j) => 
                j === respIndex ? value : resp
            )
            } : client
        )
        }));
    }

    const removeFeelItResponsibility = (clientIndex, respIndex) => {
        setProfileData(prev => ({
        ...prev,
        feel_it: prev.feel_it.map((client, i) => 
            i === clientIndex ? { 
            ...client, 
            responsibilities: client.responsibilities.filter((_, j) => j !== respIndex)
            } : client
        )
        }));
    };

    const addPersonalProject = () => {
        setProfileData(prev => ({
            ...prev, 
            personal_projects : [...prev.personal_projects, {
                project_name: "",
                achievements: []
            }]
        }));
    }

    const removePersonalProject = (index) => {
        setProfileData(prev => ({
            ...prev,
            personal_projects: prev.personal_projects.filter((_, i) => i !== index)
        }));
    }

    const updatePersonalProject = (index, field, value) => {
        setProfileData(prev => ({
            ...prev,
            personal_projects: prev.personal_projects.map((project, i) => 
                i === index ? {...project, [field]: value === "" ? null : value} : project
            ) 
        }));
    };

    const addPersonalProjectAchievement = (achievementIndex) => {
        setProfileData(prev => ({
            ...prev,
            personal_projects: prev.personal_projects.map((project, i) => 
                i === achievementIndex ? {
                    ...project,
                    achievements: [...(project.achievements || []), ""]
                } : project
            )
        }));
    };

    const updatePersonalProjectAchievement = (projectIndex, achIndex, value) => {
        setProfileData(prev => ({
        ...prev,
        personal_projects: prev.personal_projects.map((project, i) => 
            i === projectIndex ? { 
            ...project, 
            achievements: project.achievements.map((resp, j) => 
                j === achIndex ? value : resp
            )
            } : project
        )
        }));
    }

    const removePersonalProjectAchievement = (projectIndex, achIndex) => {
        setProfileData(prev => ({
        ...prev,
        personal_projects: prev.personal_projects.map((project, i) => 
            i === projectIndex ? { 
            ...project, 
            achievements: project.achievements.filter((_, j) => j !== achIndex)
            } : project
        )
        }));
    };

    return (
        <div className="edit-profile-wrapper">
            <div className="select-field">
                <Box
                    className="button-grid"       
                    display="flex"
                    flexWrap="wrap"
                    gap={1}
                >
                    <Button variant="contained" onClick={() => setSelectedSection('GeneralInfo')}>{t("editProfile.general")}</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Education')}>{t("editProfile.education")}</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('WorkExperience')}>{t("editProfile.workExperience")}</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Skills')}>{t("editProfile.skills")}</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Languages')}>{t("editProfile.lang")}</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Certifications')}>{t("editProfile.certifications")}</Button>
                    {
                        (localStorage.getItem('clientName') === 'default' ||  localStorage.getItem('clientName') === 'feelit') && (
                            <Button variant="contained" onClick={() => setSelectedSection('FeelIt')}>FeelIt</Button>
                        )
                    }
                    <Button variant="contained" onClick={() => setSelectedSection('PersonalProjects')}>{t("editProfile.personalProj")}</Button>
                </Box>
            </div>

            <ThemeProvider theme={theme}>
                {unvalidError && (
                    <Alert
                        severity="error"
                        sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                    >
                    {unvalidMessage.split("\n").map((line, index) => (
                            <Typography key={index} variant="body2">{line}</Typography>
                    ))}
                    </Alert>
                )}

                {saveSuccess && (
                    <Alert severity="success">
                        {saveSuccessMessage}
                    </Alert>
                )}

                <div className="action-buttons">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setEditMode(false);

                            //UNCOMMENT THIS IN ORDER TO SEE THE JSON
                            // console.log(JSON.stringify(profileData.languages, null, 4));
                        }}
                    >
                        {t("editProfile.goBackBtn")}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            saveNewObject(profileData);
                        }}
                    >
                        {t("editProfile.saveBtn")}
                    </Button>
                </div>
            </ThemeProvider>

            {profileData ? (
                <div className="edit-profile">
                    {selectedSection === 'GeneralInfo' && (
                    <GenerlInfo
                        profileData={profileData} 
                        updateGeneralInfo={updateGeneralInfo}
                    />
                    )}
                    {selectedSection === 'Education' && (
                    <Education 
                        profileData={profileData}
                        updateEducation={updateEducation}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                    />
                    )}
                    {selectedSection === 'WorkExperience' && (
                    <WorkExperience 
                        profileData={profileData}
                        updateWorkExperience={updateWorkExperience}
                        addWorkExperience={addWorkExperience}   
                        removeWorkExperience={removeWorkExperience}
                        addResponsability={addResponsability}
                        updateResponsability={updateResponsability}
                        removeResponsability={removeResponsability}
                    />
                    )}
                    {selectedSection === 'Skills' && (
                    <Skills
                        profileData={profileData}
                        updateSkills={updateSkills}
                        addSkill={addSkill}
                        removeSkill={removeSkill}
                        updateSkillPosition={updateSkillPosition}
                    />
                    )}
                    {selectedSection === 'Languages' && (
                    <Languages 
                        profileData={profileData}
                        updateLanguage={updateLanguage}
                        addLanguage={addLanguage}
                        removeLanguage={removeLanguage}
                    />
                    )}
                    {selectedSection === 'Certifications' && (
                    <Certifications 
                        profileData={profileData}
                        updateCertifications={updateCertifications}
                        addCertification={addCertification}
                        removeCertification={removeCertification}
                    />
                    )}
                    {selectedSection === 'FeelIt' && (
                    <FeelIt
                        profileData={profileData}
                        updateFeelItClient={updateFeelItClient}
                        addFeelItClient={addFeelItClient}
                        removeFeelItClient={removeFeelItClient}
                        updateFeelItResponsibility={updateFeelItResponsibility}
                        addFeelItResponsibility={addFeelItResponsibility}
                        removeFeelItResponsibility={removeFeelItResponsibility}
                        updateFeelItClientPosition={updateFeelItClientPosition}
                    />
                    )}

                    {selectedSection === 'PersonalProjects' && (
                    <PersonalProjects
                        profileData={profileData}
                        updatePersonalProject={updatePersonalProject}
                        addPersonalProject={addPersonalProject}
                        removePersonalProject={removePersonalProject}
                        updatePersonalProjectAchievement={updatePersonalProjectAchievement}
                        addPersonalProjectAchievement={addPersonalProjectAchievement}
                        removePersonalProjectAchievement={removePersonalProjectAchievement}
                    />
                    )}
                </div>
            ) : (
                <p>{t("editProfile.loadingData")}</p>
            )}

        </div>
    )
}

export default EditProfile;