import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

export default function SkillItem({ id, skill, index, updateSkills, removeSkill }) {
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
        value={skill}
        placeholder="Enter skill..."
        onChange={(e) => updateSkills(index, e.target.value)}
        fullWidth
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
