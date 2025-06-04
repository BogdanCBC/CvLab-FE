import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import "./Languages.css";

export default function Languages(props) {

    const languageLevels = [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
        { label: "Proficient", value: "Proficient" },
        { label: "Native", value: "Native" }
    ];

    return (
        <div className="languages">
            <div className="languages-header">
                <h2 sx={{fontSize: 30}}>Languages</h2>
                <Button 
                    className="add-language-button"
                    variant="contained"
                    size="small"
                    sx={{margin: 1, marginBottom: 2}}
                    onClick={props.addLanguage}
                >
                    <AddIcon />Add Language
                </Button>
            </div>

            {props.profileData.languages.map((language, index) => (
                <div key={index} className="language-item">
                    <TextField 
                        label="Language"
                        multiline
                        value={language.language || ""}
                        onChange={(e) => {
                            props.updateLanguage(index, "language", e.target.value);
                        }}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Level"
                        value={language.language_level || ""}
                        onChange={(e) => {
                            props.updateLanguage(index, "language_level", e.target.value);
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