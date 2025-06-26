import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SkillItem from '../SkillItem/SkillItem';
import './SkillsList.css';

export default function SkillsList({ skills, updateSkills, removeSkill }) {
  return (
    <div>
      <SortableContext
        items={skills.map((_, index) => index.toString())}
        strategy={verticalListSortingStrategy}
      >
        {skills.map((skill, index) => (
          <SkillItem
            key={index}
            id={index.toString()}
            skill={skill}
            index={index}
            updateSkills={updateSkills}
            removeSkill={removeSkill}
          />
        ))}
      </SortableContext>
    </div>
  );
}
