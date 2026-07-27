import React, { useState, useEffect } from "react";
import { notification } from "antd";
import CompaniesTable from "./CompaniesTable/CompaniesTable";
import CompanyDetails from "./CompanyDetails/CompanyDetails";
import "./CompaniesPage.scss";

import { fetchClients } from "../../utils/fetchClients";
import { useTranslation } from "react-i18next";

export default function CompaniesPage({ setSelectedCandidate, setIsLoggedIn, uploadNew, setUploadNew }) {
    const { t } = useTranslation();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        fetchClients().then((response) => {
            if (response && response.success) {
                setClients(response.clients || []);
            } else {
                setClients([]);
                notification.error({ key: "companies-fetch-error", title: response?.message || t("companiesPage.fetchError", "Failed to load companies") });
            }
        });
    }, [t]);

    return (
        <div className="companies-page">
            <CompaniesTable clients={clients} setSelectedClient={setSelectedClient} selectedClient={selectedClient} />
            <CompanyDetails
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                setClients={setClients}
                uploadNew={uploadNew}
                setUploadNew={setUploadNew}
            />
        </div>
    );
}
