import React from "react";
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { TrashIcon, DragIcon } from '../../../../../constants/icons';

export default function FeelITItem({
    client, index,
    updateFeelItClient, removeFeelItClient,
    addFeelItResponsibility, updateFeelItResponsibility, removeFeelItResponsibility,
}) {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index.toString() });

    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="ep-item-card">
            <div className="ep-item-header">
                <div className="ep-item-title-row">
                    <span className="ep-drag-handle ep-drag-handle--inline" {...attributes} {...listeners}>
                        <DragIcon />
                    </span>
                    <span className="ep-item-title">{t("feelIT.client", "Client")} {index + 1}</span>
                </div>
                <Button className="ep-delete-feel-it-client-button" type="link" danger icon={<TrashIcon />} onClick={() => removeFeelItClient(index)}>
                    {t("education.delete", "Delete")}
                </Button>
            </div>

            <div className="ep-field">
                <label className="ep-label">{t("feelIT.clientName")} <span className="ep-required">*</span></label>
                <Input value={client.client_name || ""} onChange={(e) => updateFeelItClient(index, "client_name", e.target.value)} />
            </div>

            <div className="ep-field">
                <label className="ep-label">{t("feelIT.clientDescription")} <span className="ep-required">*</span></label>
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} value={client.client_description || ""} onChange={(e) => updateFeelItClient(index, "client_description", e.target.value)} />
            </div>

            <div className="ep-field">
                <label className="ep-label">{t("feelIT.link")} <span className="ep-required">*</span></label>
                <Input value={client.link || ""} onChange={(e) => updateFeelItClient(index, "link", e.target.value)} />
            </div>

            <div className="ep-sub-section">
                <div className="ep-sub-header">
                    <span className="ep-sub-title">{t("feelIT.resp")}</span>
                    <Button className="ep-add-feel-it-responsibility-button" type="link" icon={<PlusOutlined />} onClick={() => addFeelItResponsibility(index)}>
                        {t("feelIT.addResp")}
                    </Button>
                </div>
                {client.responsibilities?.map((resp, respIndex) => (
                    <div key={respIndex} className="ep-inline-item">
                        <Input
                            value={resp || ""}
                            onChange={(e) => updateFeelItResponsibility(index, respIndex, e.target.value)}
                        />
                        <Button type="text" danger icon={<TrashIcon />} onClick={() => removeFeelItResponsibility(index, respIndex)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
