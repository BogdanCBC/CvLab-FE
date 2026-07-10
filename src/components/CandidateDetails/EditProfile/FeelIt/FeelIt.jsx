import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { closestCorners, DndContext } from '@dnd-kit/core';
import FeelITList from './FeelITList/FeelITList';
import './FeelIt.scss';
import { useTranslation } from "react-i18next";

export default function FeelIt(props) {
    const { t } = useTranslation();

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        props.updateFeelItClientPosition(parseInt(active.id), parseInt(over.id));
    };

    return (
        <div className="ep-section">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("feelIT.projects")}</h2>
                <Button className="ep-add-feel-it-client-button" type="link" icon={<PlusOutlined />} onClick={props.addFeelItClient}>
                    {t("feelIT.addFeel")}
                </Button>
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
    );
}
