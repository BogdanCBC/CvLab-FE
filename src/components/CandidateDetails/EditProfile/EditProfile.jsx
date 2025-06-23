import React, { useState ,useEffect, use } from "react";
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

import { Button, Box } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: green,
    secondary: grey,
  },
});

function EditProfile(props) {
    const { candidateId, setEditMode } = props;
    const [profileData, setProfileData] = useState(null);
    const [selectedSection, setSelectedSection] = useState('GeneralInfo');

    useEffect(() => {
        fetchCandidateData();
    }, []);

    const fetchCandidateData = async () => {
        try {
            const response = await api.get(`/profile/${candidateId}`)
            setProfileData(response.data);
        } catch (error) {
            console.error("Error fetching candidate data:", error);
        }
    }

    const saveNewObject = async (newData) => {
        try {
            console.log("New Data:", newData)
            const response = await api.put(`/candidates/${candidateId}`, newData);
            
            console.log("Status", response)
        } catch (error) {
            console.error("Failed to update JSON object:", error);
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

    const updateSkills = (index, value) => {
        setProfileData(prevData => ({
            ...prevData,
            skills: prevData.skills.map((skill, i) => i === index ? value : skill)
        }));
    }

    const addSkill = () => {
        setProfileData(prevData => ({
            ...prevData,
            skills: [...prevData.skills, ""]
        }));
    }

    const removeSkill = (index) => {
        setProfileData(prevData => ({
            ...prevData,
            skills: prevData.skills.filter((_, i) => i !== index)
        }));
    }

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
                    <Button variant="contained" onClick={() => setSelectedSection('GeneralInfo')}>General Info</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Education')}>Education</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('WorkExperience')}>Work Experience</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Skills')}>Skills</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Languages')}>Languages</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('Certifications')}>Certifications</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('FeelIt')}>FeelIt</Button>
                    <Button variant="contained" onClick={() => setSelectedSection('PersonalProjects')}>Personal Projects</Button>
                </Box>
            </div>

            <ThemeProvider theme={theme}>
                <div className="action-buttons">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setEditMode(false);

                            //UNCOMMENT THIS IN ORDER TO SEE THE JSON
                            console.log(JSON.stringify(profileData.languages, null, 4));
                        }}
                    >
                        GO BACK
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            saveNewObject(profileData);
                            setEditMode(false);
                        }}
                    >
                        Save
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
                <p>Loading profile data...</p>
            )}

        </div>
    )
}

export default EditProfile;