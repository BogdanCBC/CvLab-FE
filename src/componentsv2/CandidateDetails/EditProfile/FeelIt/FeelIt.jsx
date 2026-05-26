import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { closestCorners, DndContext } from '@dnd-kit/core';
import "./FeelIt.css"
import FeelITList from './FeelITList/FeelITList';
import {useTranslation} from "react-i18next";

export default function FeelIt(props) {
    const { t } = useTranslation();

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = parseInt(active.id);
        const newIndex = parseInt(over.id);

        const updatedClients = [...props.profileData.feel_it];
        const [moved] = updatedClients.splice(oldIndex, 1);
        updatedClients.splice(newIndex, 0, moved);

        props.updateFeelItClientPosition(oldIndex, newIndex);
    }

    return (
        <div className="feel-it">
            <div className="feel-it-header">
                <h2 sx={{fontSize: 30}}>{t("feelIT.projects")}</h2>
                <Button
                    className = "add-feel-it-client-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={() => props.addFeelItClient()}
                > <AddIcon />{t("feelIT.addFeel")}</Button>
            </div>
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <FeelITList
                    clients={props.profileData.feel_it}
                    updateFeelItClient={props.updateFeelItClient}
                    removeFeelItClient={props.removeFeelItClient}
                    addFeelItResponsibility={props.addFeelItResponsibility}
                    updateFeelItResponsibility={props.updateFeelItResponsibility}
                    removeFeelItResponsibility={props.removeFeelItResponsibility}
                />
            </DndContext>
        </div>
    )
}