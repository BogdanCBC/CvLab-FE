import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Education.css"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Education(props) {
    
    return (
        <div className="education">
            <div className="education-header">
            <h2 sx={{fontSize: 30}}>Education</h2>
                <Button
                    className = "add-education-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={props.addEducation}
                > <AddIcon />Add Education</Button>
            </div>
            
            {props.profileData.education.map((edu, index) => (
                <div key={index} className='education-item'>
                    <div className="education-item-header">
                        <h3>Education {index + 1}</h3>
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
                        label="Institute Name"
                        multiline
                        value={edu.institute_name || ""}
                        onChange={(e) => {
                            props.updateEducation(index, "institute_name", e.target.value);
                        }}
                    />
                    <TextField
                        label="Degree"
                        multiline
                        value={edu.degree || ""}
                        onChange={(e) => {
                            props.updateEducation(index, "degree", e.target.value);
                        }}
                    />
                    <TextField
                        label="Start Year"
                        type="number"
                        value={edu.start_year || new Date().getFullYear()}
                        onChange={(e) => {
                            props.updateEducation(index, "start_year", e.target.value);
                        }}
                    />
                    <TextField
                        label="End Year"
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