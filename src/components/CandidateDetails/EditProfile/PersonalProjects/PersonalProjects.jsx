import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import "./PersonalProjects.css"

export default function PersonalProjects(props) {

    return(
        <div className="personal-projects">
            <div className="personal-projects-header">
                <h2 sx={{fontSize: 30}}>Personal Projects</h2>
                <Button
                    className = "add-personal-project-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={() => props.addPersonalProject()}
                > <AddIcon />Add FeelIT client</Button>
            </div>

            {props.profileData.personal_projects.map((project, index) => (
                <div key={index} className="project-item">
                    <div className="project-item-header">
                        <h3>Project {project.project_name || ""}</h3>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{margin: 1, marginBottom: 2}}
                            onClick={() => props.removePersonalProject(index)}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>

                    <TextField
                        label="project_name"
                        multiline
                        value={project.project_name || ""}
                        onChange={(e) => {
                            props.updatePersonalProject(index, "project_name", e.target.value)
                        }}
                    />

                    <div className="achievements">
                        <div className="achievements-header">
                            <h3>Achievements</h3>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ margin: 1, marginBottom: 2, color: "primary.main" }}
                                onClick={() => props.addPersonalProjectAchievement(index)}
                                startIcon={<AddIcon />}
                            >
                                Add Achievement
                            </Button>
                        </div>

                        {project.achievements && project.achievements.map((achieve, achieveIndex) => (
                            <div className="achievement-item" key={achieveIndex}>
                                <TextField 
                                    key={achieveIndex}
                                    label={`Achievement ${achieveIndex + 1}`}
                                    multiline
                                    value={achieve || ""}
                                    onChange={(e) => {
                                        props.updatePersonalProjectAchievement(index, achieveIndex, e.target.value);
                                    }}
                                    fullWidth
                                />

                                <Button 
                                    variant="outlined"
                                    size="small"
                                    sx={{margin: 1, marginBottom: 2}}
                                    onClick={() => props.removePersonalProjectAchievement(index, achieveIndex)}
                                >
                                    <DeleteIcon />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}