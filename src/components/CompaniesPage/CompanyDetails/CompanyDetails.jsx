import React, { useState, useEffect } from "react";
import { notification } from "antd";
import "./CompanyDetails.scss";
import api from "../../../api";
import CreateCompanyModal from "./CreateCompanyModal/CreateCompanyModal";
import SelectedCompany from "./SelectedCompany/SelectedCompany";
import NothingSelected from "./NothingSelected/NothingSelected";
import { useTranslation } from "react-i18next";

export default function CompanyDetails({ selectedClient, setSelectedClient, setClients, uploadNew, setUploadNew }) {
    const { t } = useTranslation();
    const [clientInfo, setClientInfo] = useState(null);

    useEffect(() => {
        const fetchSelectedClient = async () => {
            try {
                if (selectedClient) {
                    const response = await api.get(`/clients/${selectedClient}`);
                    const data = response.data;
                    if (data) {
                        setClientInfo(Array.isArray(data) ? data[0] : (data.data ? data.data : data));
                    } else {
                        setClientInfo(null);
                        notification.warning({ message: t("companiesPage.fetchDetailEmpty", "No data found for this company") });
                    }
                }
            } catch (err) {
                setClientInfo(null);
                notification.error({ message: err?.response?.data?.message || t("companiesPage.fetchDetailError", "Failed to load company details") });
            }
        };
        fetchSelectedClient();
    }, [selectedClient, t]);

    return (
        <div className="company-details">
            {!clientInfo && <NothingSelected setUploadNew={setUploadNew} />}

            {clientInfo && (
                <SelectedCompany
                    clientInfo={clientInfo}
                    setClientInfo={setClientInfo}
                    setClients={setClients}
                    selectedClient={selectedClient}
                    setSelectedClient={setSelectedClient}
                />
            )}

            <CreateCompanyModal open={uploadNew} setClients={setClients} setUploadNew={setUploadNew} />
        </div>
    );
}
