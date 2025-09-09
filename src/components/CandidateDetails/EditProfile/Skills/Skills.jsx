import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SkillsList from './SkillsList/SkillsList';
import { closestCorners, DndContext } from '@dnd-kit/core';
import './Skills.css';
import { Typography } from '@mui/material';

export default function Skills(props) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id);
    const newIndex = parseInt(over.id);

    const updatedSkills = [...props.profileData.skills];
    const [moved] = updatedSkills.splice(oldIndex, 1);
    updatedSkills.splice(newIndex, 0, moved);
    
    props.updateSkillPosition(oldIndex, newIndex);
  };

  return (
    <div className="skills">
      <div className="skills-header">
        <h2>Skills</h2>
        <Button
          className="add-skill-button"
          variant="contained"
          size="small"
          sx={{ margin: 1, marginBottom: 2 }}
          onClick={props.addSkill}
        >
          <AddIcon />
          Add Skill
        </Button>
      </div>
      
      <div className="skills-columns" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", marginBottom: "8px" }}>
        <span style={{ width: 40 }} />
        <span style={{ flex: 1 }}>Skill</span>
        <span style={{ width: 130 }}>Years</span>
        <span style={{ width: 56 }} />
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SkillsList
          skills={props.profileData.skills}
          updateSkills={props.updateSkills}
          removeSkill={props.removeSkill}
        />
      </DndContext>
    </div>
  );
}
