import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SkillsList from './SkillsList/SkillsList';
import { closestCorners, DndContext } from '@dnd-kit/core';
import './Skills.scss';
import { useTranslation } from "react-i18next";

export default function Skills({ profileData, updateSkills, addSkill, removeSkill, updateSkillPosition }) {
    const { t } = useTranslation();

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        updateSkillPosition(parseInt(active.id), parseInt(over.id));
    };

    return (
        <div className="ep-section">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("skills.skills")}</h2>
                <Button type="link" icon={<PlusOutlined />} onClick={addSkill} className="add-skill-button">
                    {t("skills.addSkill")}
                </Button>
            </div>

            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <SkillsList
                    skills={profileData.skills}
                    updateSkills={updateSkills}
                    removeSkill={removeSkill}
                />
            </DndContext>
        </div>
    );
}
