import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useTranslation} from "react-i18next";

export default function SkillItem({ id, skill_obj, index, updateSkills, removeSkill }) {
  const {t} = useTranslation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px"
  };

  console.log(skill_obj)

  return (
    <div ref={setNodeRef} style={style}>
      
      <IconButton
        size="small"
        sx={{ cursor: "grab" }}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon />
      </IconButton>
      
      <TextField
        value={skill_obj.skill}
        placeholder={t("skills.enterSkill")}
        onChange={(e) => updateSkills(index, "skill", e.target.value)}
        fullWidth
      />
      <TextField
        type="number"
        value={skill_obj.years}
        placeholder="Enter number of years"
        onChange={(e) => updateSkills(index, "years", Number(e.target.value))}
        inputProps={{ min: 0 }}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => removeSkill(index)}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
}
