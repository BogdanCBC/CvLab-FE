import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import { SaveIcon, ArrowLeftIcon } from "../../../../../constants/icons";
import api from "../../../../../api";
import { fetchClients } from "../../../../../utils/fetchClients";
import { useTranslation } from "react-i18next";
import "../../../../JobDescription/JDDetails/SelectedJD/ViewMode/ViewMode.scss";
import "../../../../JobDescription/JDDetails/SelectedJD/EditMode/EditMode.scss";

const { TextArea } = Input;

export default function EditMode({ clientInfo, setEditMode, setClients, setClientInfo, selectedClient }) {
    const { t } = useTranslation();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        client_name: clientInfo.client_name || "",
        client_description: clientInfo.client_description || "",
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                client_id: clientInfo.client_id,
                client_name: formData.client_name,
                client_description: formData.client_description,
            };
            const response = await api.put("/clients", payload);
            if (response.data) {
                notification.success({ message: t("companiesPage.editSuccess", "Company updated successfully"), description: t("companiesPage.editSuccessDescription", "Your changes have been saved.") });
                const clientsRes = await fetchClients();
                if (clientsRes.success) {
                    setClients(clientsRes.clients || []);
                    const updated = clientsRes.clients.find((c) => c.client_id === clientInfo.client_id);
                    if (updated) setClientInfo(updated);
                }
                setEditMode(false);
            }
            setSaving(false);
        } catch (err) {
            notification.error({ message: err?.response?.data?.message || "Error" });
            setSaving(false);
        }
    };

    const isSaveDisabled = !formData.client_name.trim() || !formData.client_description.trim() || saving;

    return (
        <div className="jd-wrapper">
            <div className="jd-card">
                <div className="jd-card-header">
                    <div className="jd-edit-left">
                        <Button
                            icon={<ArrowLeftIcon />}
                            onClick={() => setEditMode(false)}
                            type="text"
                        />
                        <div className="jd-name-block">
                            <span className="jd-label">{t("companiesPage.editCompany", "Edit Company")}</span>
                            <h2 className="jd-title">{clientInfo.client_name}</h2>
                        </div>
                    </div>
                    <div className="jd-header-actions">
                        <Button
                            icon={<SaveIcon />}
                            onClick={handleSave}
                            loading={saving}
                            disabled={isSaveDisabled}
                            className="edit-jd-btn filled-btn"
                        >
                            {t("editProfile.saveBtn", "Save")}
                        </Button>
                    </div>
                </div>

                <div className="jd-edit-mode">
                    <div className="edit-field">
                        <label className="edit-label">
                            {t("companiesPage.companyName", "Company Name")} <span className="jd-required">*</span>
                        </label>
                        <Input
                            value={formData.client_name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, client_name: e.target.value }))}
                            disabled={saving}
                        />
                    </div>

                    <div className="edit-field">
                        <label className="edit-label">
                            {t("companiesPage.companyDescription", "Company Description")} <span className="jd-required">*</span>
                        </label>
                        <TextArea
                            rows={10}
                            value={formData.client_description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, client_description: e.target.value }))}
                            disabled={saving}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
