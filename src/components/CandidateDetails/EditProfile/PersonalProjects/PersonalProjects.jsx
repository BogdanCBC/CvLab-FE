import React from 'react';
import { Input, Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './PersonalProjects.scss';
import { useTranslation } from "react-i18next";
import { TrashIcon } from '../../../../constants/icons';

export default function PersonalProjects(props) {
    const { t } = useTranslation();
    const { profileData, updatePersonalProject, addPersonalProject, removePersonalProject,
            updatePersonalProjectAchievement, addPersonalProjectAchievement, removePersonalProjectAchievement } = props;

    return (
        <div className="ep-section">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("personalProjects.personalProj")}</h2>
                <Button className="add-personal-project-button" type="link" icon={<PlusOutlined />} onClick={addPersonalProject}>
                    {t("personalProjects.addPersonalProj")}
                </Button>
            </div>

            {profileData.personal_projects.map((project, index) => (
                <div key={index} className="ep-item-card">
                    <div className="ep-item-header">
                        <span className="ep-item-title">
                            {t("personalProjects.project")} {index + 1}{project.project_name ? `: ${project.project_name}` : ""}
                        </span>
                        <Button className="delete-personal-project-button" type="link" danger icon={<TrashIcon />} onClick={() => removePersonalProject(index)}>
                            {t("education.delete", "Delete")}
                        </Button>
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">{t("personalProjects.projectName")} <span className="ep-required">*</span></label>
                        <Input value={project.project_name || ""} onChange={(e) => updatePersonalProject(index, "project_name", e.target.value)} />
                    </div>

                    <div className="ep-sub-section">
                        <div className="ep-sub-header">
                            <span className="ep-sub-title">{t("personalProjects.achievements")}</span>
                            <Button className="add-achievement-button" type="link" icon={<PlusOutlined />} onClick={() => addPersonalProjectAchievement(index)}>
                                {t("personalProjects.addAchievements")}
                            </Button>
                        </div>
                        <div className="ep-cert-list">
                            {project.achievements?.map((achieve, achIndex) => (
                                <React.Fragment key={achIndex}>
                                    {achIndex > 0 && <Divider style={{ margin: 0 }} />}
                                    <div className="ep-inline-item personal-projects">
                                        <Input
                                            variant="borderless"
                                            value={achieve || ""}
                                            onChange={(e) => updatePersonalProjectAchievement(index, achIndex, e.target.value)}
                                        />
                                        <Button className="delete-achievement-button" type="text" danger icon={<TrashIcon />} onClick={() => removePersonalProjectAchievement(index, achIndex)} />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
