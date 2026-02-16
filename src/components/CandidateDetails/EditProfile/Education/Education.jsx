import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Education.css"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useTranslation} from "react-i18next";

export default function Education(props) {
    const {t} = useTranslation();

    return (
        <div className="education">
            <div className="education-header">
            <h2 sx={{fontSize: 30}}>{t("education.education")}</h2>
                <Button
                    className = "add-education-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={() => props.addEducation()}
                > <AddIcon />{t("education.addEducation")}</Button>
            </div>
            
            {props.profileData.education.map((edu, index) => (
                <div key={index} className='education-item'>
                    <div className="education-item-header">
                        <h3>{t("education.education")} {index + 1}</h3>
                        <Button
                            variant='contained'
                            size='small'
                            sx = {{margin: 1, marginBottom: 2}}
                            onClick={() => props.removeEducation(index)}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>

                    <TextField
                        label={t("education.instituteName")}
                        multiline
                        value={edu.institute_name || ""}
                        onChange={(e) => {
                            props.updateEducation(index, "institute_name", e.target.value);
                        }}
                    />
                    <TextField
                        label={t("education.degree")}
                        multiline
                        value={edu.degree || ""}
                        onChange={(e) => {
                            props.updateEducation(index, "degree", e.target.value);
                        }}
                    />
                    <TextField
                        label={t("education.startYear")}
                        type="number"
                        value={edu.start_year || new Date().getFullYear()}
                        onChange={(e) => {
                            props.updateEducation(index, "start_year", e.target.value);
                        }}
                    />
                    <TextField
                        label={t("education.endYear")}
                        type="number"
                        value={edu.end_year || ""}
                        onChange={(e) => {
                            props.updateEducation(index, "end_year", e.target.value);
                        }}
                    />
                </div>
          ))}    
        </div>
    );
}