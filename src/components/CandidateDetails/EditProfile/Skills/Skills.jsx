import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import "./Skills.css";

export default function Skills(props) {

    return (
        <div className="skills">
            <div className="skills-header">
                <h2 sx={{fontSize: 30}}>Skills</h2>
                <Button
                    className="add-skill-button"
                    variant="contained"
                    size="small"
                    sx={{margin: 1, marginBottom: 2}}
                    onClick={props.addSkill}
                > 
                    <AddIcon />Add Skill
                </Button>
            </div>

            {props.profileData.skills.map((skill, index) => (
                <div key={index} className="skill-item">
                    <TextField 
                        value={skill || ""}
                        placeholder='Enter skill...'
                        onChange={(e) => {
                            props.updateSkills(index, e.target.value);
                        }}
                        fullWidth
                    />

                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ marginLeft: 1 }}
                        onClick={() => props.removeSkill(index)}
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            ))}
        </div>
    );
}