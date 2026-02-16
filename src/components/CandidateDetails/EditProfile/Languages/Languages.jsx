import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import "./Languages.css";
import {useTranslation} from "react-i18next";

export default function Languages(props) {
    const {t} = useTranslation();

    const languageLevels = [
        { label: "Beginner", value: t("languages.beginner") },
        { label: "Intermediate", value: t("languages.intermediate") },
        { label: "Advanced", value: t("languages.advanced") },
        { label: "Proficient", value: t("languages.proficient") },
        { label: "Native", value: t("languages.native") },
    ];

    return (
        <div className="languages">
            <div className="languages-header">
                <h2 sx={{fontSize: 30}}>{t("languages.languages")}</h2>
                <Button 
                    className="add-language-button"
                    variant="contained"
                    size="small"
                    sx={{margin: 1, marginBottom: 2}}
                    onClick={() => props.addLanguage()}
                >
                    <AddIcon />{t("languages.addLang")}
                </Button>
            </div>

            {props.profileData.languages.map((language, index) => (
                <div key={index} className="language-item">
                    <TextField 
                        label={t("languages.language")}
                        multiline
                        value={language.language || ""}
                        onChange={(e) => {
                            props.updateLanguage(index, "language", e.target.value);
                        }}
                        fullWidth
                    />

                    <TextField
                        select
                        label={t("languages.level")}
                        value={language.level || ""}
                        onChange={(e) => {
                            props.updateLanguage(index, "level", e.target.value);
                        }}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >
                        {languageLevels.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => props.removeLanguage(index)}
                        sx={{ minWidth: 40 }}
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            ))}
        </div>
    )
}