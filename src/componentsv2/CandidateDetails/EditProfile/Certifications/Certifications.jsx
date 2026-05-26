import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import './Certifications.css'
import {useTranslation} from "react-i18next";

export default function Certifications(props) {
    const {t} = useTranslation();

    return (
        <div className="certifications">
            <div className="certifications-header">
                <h2 sx={{fontSize: 30}}>{t("certifications.certifications")}</h2>
                <Button
                    className="add-certification-button"
                    variant="contained"
                    size="small"
                    sx={{margin: 1, marginBottom: 2}}
                    onClick={() => props.addCertification()}
                > 
                    <AddIcon />{t("certifications.addCert")}
                </Button>
            </div>

            {props.profileData.certifications.map((certification, index) => (
                <div key={index} className="certification-item">
                    <TextField 
                        value={certification || ""}
                        placeholder={t("certifications.enterCert")}
                        onChange={(e) => {
                            props.updateCertifications(index, e.target.value);
                        }}
                        fullWidth
                    />

                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ marginLeft: 1 }}
                        onClick={() => props.removeCertification(index)}
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            ))}
        </div>
    );
}