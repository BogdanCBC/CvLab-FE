import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import './GeneralInfo.css';

export default function GenerlInfo(props) {
    
    return (
        <div className="general-info">
            <h2><PersonIcon sx={{fontSize: 30}}/>General Info</h2>
            <TextField
                label="First Name"
                multiline
                value={props.profileData.general_info.first_name || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("first_name", e.target.value);
                }}
            />
            <TextField
                label="Last Name"
                multiline
                value={props.profileData.general_info.last_name || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("last_name", e.target.value);
                }}
            />
            <TextField
                label="Experience"
                multiline
                value={props.profileData.general_info.experience || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("experience", e.target.value);
                }}
            />
            <TextField
                label="Position"
                multiline
                value={props.profileData.general_info.position || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("position", e.target.value);
                }}
            />
            <TextField 
                label="Description"
                multiline
                maxRows={6}
                value={props.profileData.general_info.description || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("description", e.target.value);
                }}
            />
        </div>
    );
}