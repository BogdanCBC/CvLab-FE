import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import "./PersonalProjects.css"
import {useTranslation} from "react-i18next";

export default function PersonalProjects(props) {
    const {t} = useTranslation();

    return(
        <div className="personal-projects">
            <div className="personal-projects-header">
                <h2 sx={{fontSize: 30}}>{t("personalProjects.personalProj")}</h2>
                <Button
                    className = "add-personal-project-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={() => props.addPersonalProject()}
                > <AddIcon />{t("personalProjects.addPersonalProj")}</Button>
            </div>

            {props.profileData.personal_projects.map((project, index) => (
                <div key={index} className="project-item">
                    <div className="project-item-header">
                        <h3>{t("personalProjects.project")} {project.project_name || ""}</h3>
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
                        label={t("personalProjects.projectName")}
                        multiline
                        value={project.project_name || ""}
                        onChange={(e) => {
                            props.updatePersonalProject(index, "project_name", e.target.value)
                        }}
                    />

                    <div className="achievements">
                        <div className="achievements-header">
                            <h3>{t("personalProjects.achievements")}</h3>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ margin: 1, marginBottom: 2, color: "primary.main" }}
                                onClick={() => props.addPersonalProjectAchievement(index)}
                                startIcon={<AddIcon />}
                            >
                                {t("personalProjects.addAchievements")}
                            </Button>
                        </div>

                        {project.achievements && project.achievements.map((achieve, achieveIndex) => (
                            <div className="achievement-item" key={achieveIndex}>
                                <TextField 
                                    key={achieveIndex}
                                    label={`${t("personalProjects.achievement")} ${achieveIndex + 1}`}
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