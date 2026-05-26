import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import './GeneralInfo.css';
import {useTranslation} from "react-i18next";

export default function GenerlInfo(props) {
    const {t} = useTranslation();

    return (
        <div className="general-info">
            <h2><PersonIcon sx={{fontSize: 30}}/>{t("generalInfo.general")}</h2>
            <TextField
                label={t("generalInfo.firstName")}
                multiline
                value={props.profileData.general_info.first_name || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("first_name", e.target.value);
                }}
            />
            <TextField
                label={t("generalInfo.lastName")}
                multiline
                value={props.profileData.general_info.last_name || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("last_name", e.target.value);
                }}
            />
            <TextField
                label={t("generalInfo.experience")}
                multiline
                value={props.profileData.general_info.experience || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("experience", e.target.value);
                }}
            />
            <TextField
                label={t("generalInfo.position")}
                multiline
                value={props.profileData.general_info.position || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("position", e.target.value);
                }}
            />
            <TextField
                label={t("generalInfo.email")}
                multiline
                value={props.profileData.general_info.email || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("email", e.target.value);
                }}
            />
            <TextField
                label={t("generalInfo.phone")}
                multiline
                value={props.profileData.general_info.phone || ""}
                onChange={(e) => {
                    props.updateGeneralInfo("phone", e.target.value);
                }}
            />
            <TextField 
                label={t("generalInfo.description")}
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