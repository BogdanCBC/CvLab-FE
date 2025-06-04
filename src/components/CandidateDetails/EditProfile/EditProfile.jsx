import React, { useState ,useEffect, use } from "react";
import "./EditProfile.css";
import api from "../../../api";
import GenerlInfo from "./GeneralInfo/GeneralInfo";
import Education from "./Education/Education";
import WorkExperience from "./WorkExperience/WorkExperience";
import Skills from "./Skills/Skills";
import Languages from "./Languages/Languages";

function EditProfile(props) {
    const { candidateId, setEditMode } = props;
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        fetchCandidateData();
    }, []);

    const fetchCandidateData = async () => {
        try {
            const response = await api.get(`/profile/${candidateId}`)
            setProfileData(response.data);
            console.log("Candidate data fetched successfully:", profileData);
        } catch (error) {
            console.error("Error fetching candidate data:", error);
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

    return (
        <div className="edit-profile-wrapper">
            {profileData ? (
                <div className="edit-profile">
                    <GenerlInfo
                        profileData={profileData} 
                        updateGeneralInfo={updateGeneralInfo}
                    />

                    <Education 
                        profileData={profileData}
                        updateGeneralInfo={updateGeneralInfo}
                        updateEducation={updateEducation}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                    />

                    <WorkExperience 
                        profileData={profileData}
                        updateWorkExperience={updateWorkExperience}
                        addWorkExperience={addWorkExperience}   
                        removeWorkExperience={removeWorkExperience}
                        addResponsability={addResponsability}
                        updateResponsability={updateResponsability}
                        removeResponsability={removeResponsability}
                    />

                    <Skills 
                        profileData={profileData}
                        updateSkills={updateSkills}
                        addSkill={addSkill}
                        removeSkill={removeSkill}
                    />

                    <Languages 
                        profileData={profileData}
                        updateLanguage={updateLanguage}
                        addLanguage={addLanguage}
                        removeLanguage={removeLanguage}
                    />
                    {/* Certificari */}
                </div>
            ) : (
                <p>Loading profile data...</p>
            )}

            <button onClick={() => {
                setEditMode(false)
                console.log(profileData.work_experience)
                }
            }
            >   
                GO BACK
            </button>
        </div>
    )
}

export default EditProfile;