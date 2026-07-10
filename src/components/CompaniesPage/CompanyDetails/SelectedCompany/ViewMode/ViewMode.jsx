import React from "react";
import { Button, message } from "antd";
import { EditIcon, TrashIcon } from "../../../../../constants/icons";
import api from "../../../../../api";
import { fetchClients } from "../../../../../utils/fetchClients";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../../JobDescription/JDDetails/SelectedJD/ViewMode/ViewMode.scss";

export default function ViewMode({ clientInfo, setClientInfo, setEditMode, setClients, setSelectedClient }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const deleteRes = await api.delete("/clients", {
                params: { client_id: clientInfo.client_id },
            });
            if (deleteRes.data) {
                message.success(t("companiesPage.deleteSuccess", "Company deleted successfully"));
                try {
                    const clientsRes = await fetchClients();
                    if (clientsRes.success && Array.isArray(clientsRes.clients)) {
                        setClientInfo(null);
                        setSelectedClient(null);
                        setClients(clientsRes.clients || []);
                    } else {
                        setClients([]);
                        setClientInfo(null);
                        setSelectedClient(null);
                    }
                } catch (err) {
                    setClientInfo(null);
                    setSelectedClient(null);
                }
            }
        } catch (err) {
            message.error(err?.response?.data?.message || t("companiesPage.deleteError", "Failed to delete company"));
            setClientInfo(null);
            setSelectedClient(null);
        }
    };

    const handleSeeAllJobs = () => {
        navigate("/job-description", {
            state: { clientId: clientInfo.client_id, clientName: clientInfo.client_name },
        });
    };

    return (
        <div className="jd-wrapper">
            <div className="jd-card">
                <div className="jd-card-header">
                    <div className="jd-name-block">
                        <span className="jd-label">{t("companiesPage.companyLabel", "Companie")}</span>
                        <h2 className="jd-title">{clientInfo.client_name}</h2>
                    </div>
                    <div className="jd-header-actions">
                        <Button
                            icon={<TrashIcon />}
                            onClick={handleDelete}
                            className="filled-btn"
                        >
                            {t("jdViewMode.delete")}
                        </Button>
                        <Button
                            icon={<EditIcon />}
                            onClick={() => setEditMode(true)}
                            className="edit-jd-btn filled-btn"
                        >
                            {t("jdViewMode.edit")}
                        </Button>
                        <Button
                            onClick={handleSeeAllJobs}
                            className="default-button small"
                            type="primary"
                        >
                            {t("companiesPage.seeAllJobs", "See all jobs")}
                        </Button>
                    </div>
                </div>

                <div className="jd-card-body">
                    <div className="jd-section-title">{t("companiesPage.descriptionLabel", "Description")}</div>
                    <p className="jd-text">{clientInfo.client_description}</p>
                </div>
            </div>
        </div>
    );
}
