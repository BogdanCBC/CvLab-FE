import React from "react";
import { Input, Button } from 'antd';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { TrashIcon, DragIcon } from '../../../../../constants/icons';

export default function SkillItem({ id, skill_obj, index, updateSkills, removeSkill }) {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="ep-skill-item">
            <span className="ep-drag-handle" {...attributes} {...listeners}>
                <DragIcon />
            </span>
            <Input
                variant="borderless"
                value={skill_obj.skill}
                placeholder={t("skills.enterSkill")}
                onChange={(e) => updateSkills(index, "skill", e.target.value)}
                className="ep-skill-input"
            />
            <Button
                type="text"
                danger
                icon={<TrashIcon />}
                onClick={() => removeSkill(index)}
            />
        </div>
    );
}
