import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import "./WorkExperience.css"
import {useTranslation} from "react-i18next";

export default function WorkExperience(props) {
    const {t} = useTranslation();

    return (
        <div className = "work-experience">
            <div className="work-experience-header">
                <h2 sx={{fontSize: 30}}>{t("workExperience.workExp")}</h2>
                <Button
                    className = "add-work-experience-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={() => props.addWorkExperience()}
                > <AddIcon />{t("workExperience.addWorkBtn")}</Button>
            </div>

            {props.profileData.work_experience.map((work, index) => (
                <div key={index} className = "work-experience-item">
                    <div className = "work-experience-item-header">
                        <h3>{t("workExperience.workExp")} {index+1}</h3>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{margin: 1, marginBottom: 2}}
                            onClick={() => props.removeWorkExperience(index)}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>

                    <TextField 
                        label={t("workExperience.companyName")}
                        multiline
                        value={work.company_name || ""}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "company_name", e.target.value);
                        }}
                    />

                    <TextField 
                        label={t("workExperience.jobTitle")}
                        multiline
                        value={work.job_title || ""}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "job_title", e.target.value);
                        }}
                    />

                    <TextField
                        label={t("workExperience.country")}
                        multiline
                        value={work.country || ""}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "country", e.target.value);
                        }}
                    />
                    <TextField
                        label={t("workExperience.link")}
                        multiline
                        value={work.link || ""}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "link", e.target.value);
                        }}
                    />
                    <TextField
                        label={t("workExperience.startDate")}
                        type="date"
                        value={work.start_date || new Date().getFullYear()}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "start_date", e.target.value);
                        }}
                        InputLabelProps={{shrink:true}}
                    />
                    <TextField
                        label={t("workExperience.endDate")}
                        type="date"
                        value={work.end_date || new Date().getFullYear()}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "end_date", e.target.value);
                        }}
                        InputLabelProps={{shrink:true}}
                    />
                    <TextField
                        label={t("workExperience.description")}
                        multiline
                        value={work.work_description || ""}
                        onChange={(e) => {
                            props.updateWorkExperience(index, "work_description", e.target.value);
                        }}
                    />
                    <div className="responsibilities">
                        <div className="responsibilities-header">
                            <h3>{t("workExperience.responsibilities")}</h3>
                            <Button
                                variant="text" // Makes it transparent / ghost style
                                size="small"
                                sx={{ margin: 1, marginBottom: 2, color: 'primary.main' }}
                                onClick={() => props.addResponsability(index)}
                                startIcon={<AddIcon />}
                            >
                                {t("workExperience.responsibilities")}
                            </Button>
                        </div>

                        {work.responsibilities && work.responsibilities.map((resp, respIndex) => (
                            <div className="responsibility-item" key={respIndex}>
                                <TextField
                                    key={respIndex}
                                    label={`${t("workExperience.responsibility")} ${respIndex + 1}`}
                                    multiline
                                    value={resp || ""}
                                    onChange={(e) => {
                                        props.updateResponsability(index, respIndex, e.target.value);
                                    }}
                                    fullWidth
                                />

                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{margin: 1, marginBottom: 2}}
                                    onClick={() => props.removeResponsability(index, respIndex)}
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
};