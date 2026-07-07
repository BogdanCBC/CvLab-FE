import React, { useState } from "react";
import { Modal, Button, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../../../api";
import { fetchClients } from "../../../../utils/fetchClients";

const { TextArea } = Input;

const CompanyIconBlue = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.3334 5.83333C13.3334 5.05836 13.3334 4.67087 13.2482 4.35295C13.017 3.49022 12.3431 2.81635 11.4804 2.58519C11.1625 2.5 10.775 2.5 10 2.5C9.22504 2.5 8.83756 2.5 8.51964 2.58519C7.65691 2.81635 6.98304 3.49022 6.75187 4.35295C6.66669 4.67087 6.66669 5.05836 6.66669 5.83333M10.6667 14.5833H14.75C14.9834 14.5833 15.1001 14.5833 15.1892 14.5379C15.2676 14.498 15.3313 14.4342 15.3713 14.3558C15.4167 14.2667 15.4167 14.15 15.4167 13.9167V11.9167C15.4167 11.6833 15.4167 11.5666 15.3713 11.4775C15.3313 11.3991 15.2676 11.3354 15.1892 11.2954C15.1001 11.25 14.9834 11.25 14.75 11.25H10.6667C10.4333 11.25 10.3167 11.25 10.2275 11.2954C10.1491 11.3354 10.0854 11.3991 10.0454 11.4775C10 11.5666 10 11.6833 10 11.9167V13.9167C10 14.15 10 14.2667 10.0454 14.3558C10.0854 14.4342 10.1491 14.498 10.2275 14.5379C10.3167 14.5833 10.4333 14.5833 10.6667 14.5833ZM5.66669 17.5H14.3334C15.7335 17.5 16.4335 17.5 16.9683 17.2275C17.4387 16.9878 17.8212 16.6054 18.0609 16.135C18.3334 15.6002 18.3334 14.9001 18.3334 13.5V9.83333C18.3334 8.4332 18.3334 7.73314 18.0609 7.19836C17.8212 6.72795 17.4387 6.3455 16.9683 6.10582C16.4335 5.83333 15.7335 5.83333 14.3334 5.83333H5.66669C4.26656 5.83333 3.56649 5.83333 3.03171 6.10582C2.56131 6.3455 2.17885 6.72795 1.93917 7.19836C1.66669 7.73314 1.66669 8.4332 1.66669 9.83333V13.5C1.66669 14.9001 1.66669 15.6002 1.93917 16.135C2.17885 16.6054 2.56131 16.9878 3.03171 17.2275C3.56649 17.5 4.26656 17.5 5.66669 17.5Z" stroke="#0BA5EC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function CreateCompanyModal({ open, setClients, setUploadNew }) {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ client_name: "", client_description: "" });

    const handleSubmit = async () => {
        setUploading(true);
        try {
            const response = await api.post("/clients", formData);
            if (response.data) {
                message.success(t("companiesPage.createdSuccess", "Company created successfully"));
                setFormData({ client_name: "", client_description: "" });
                fetchClients().then((res) => {
                    if (res.success) setClients(res.clients || []);
                });
            }
            setUploading(false);
            setTimeout(() => setUploadNew(false), 500);
        } catch (err) {
            message.error(err?.response?.data?.message || "Error");
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFormData({ client_name: "", client_description: "" });
        setUploadNew(false);
    };

    const isSubmitDisabled = !formData.client_name.trim() || !formData.client_description.trim() || uploading;

    const modalTitle = (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
                background: "#EFF8FF",
                border: "1px solid #B2DDFF",
                borderRadius: 10,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}>
                <CompanyIconBlue />
            </div>
            <span style={{ fontWeight: 600, fontSize: 16, color: "#101828" }}>
                {t("companiesPage.addNewCompany", "Add new companie")}
            </span>
        </div>
    );

    const modalFooter = (
        <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <Button onClick={handleClose} disabled={uploading} style={{ flex: 1, height: 40 }}>
                {t("jdEditMode.cancel", "Cancel")}
            </Button>
            <Button
                className="default-button"
                type="primary"
                onClick={handleSubmit}
                loading={uploading}
                disabled={isSubmitDisabled}
                style={{ flex: 1, height: 40 }}
            >
                {t("companiesPage.addCompany", "Add companie")}
            </Button>
        </div>
    );

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={modalTitle}
            footer={modalFooter}
            width={764}
            closable={!uploading}
            mask={{ closable: !uploading }}
            destroyOnHidden
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 0 8px" }}>
                <div>
                    <label style={{ fontWeight: 500, fontSize: 13, display: "block", marginBottom: 6, color: "#344054" }}>
                        {t("companiesPage.companyName", "Company Name")} <span style={{ color: "#2391D1" }}>*</span>
                    </label>
                    <Input
                        style={{ height: 44 }}
                        placeholder={t("companiesPage.companyNamePlaceholder", "ex: NovaByte")}
                        value={formData.client_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, client_name: e.target.value }))}
                        disabled={uploading}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 500, fontSize: 13, display: "block", marginBottom: 6, color: "#344054" }}>
                        {t("companiesPage.companyDescription", "Company Description")} <span style={{ color: "#2391D1" }}>*</span>
                    </label>
                    <TextArea
                        placeholder={t("companiesPage.companyDescPlaceholder", "Enter a description...")}
                        rows={8}
                        value={formData.client_description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, client_description: e.target.value }))}
                        disabled={uploading}
                    />
                </div>
            </div>
        </Modal>
    );
}
