import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import './Certifications.css'

export default function Certifications(props) {


    return (
        <div className="certifications">
            <div className="certifications-header">
                <h2 sx={{fontSize: 30}}>Certifications</h2>
                <Button
                    className="add-certification-button"
                    variant="contained"
                    size="small"
                    sx={{margin: 1, marginBottom: 2}}
                    onClick={() => props.addCertification()}
                > 
                    <AddIcon />Add Certification
                </Button>
            </div>

            {props.profileData.certifications.map((certification, index) => (
                <div key={index} className="certification-item">
                    <TextField 
                        value={certification || ""}
                        placeholder='Enter certification...'
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