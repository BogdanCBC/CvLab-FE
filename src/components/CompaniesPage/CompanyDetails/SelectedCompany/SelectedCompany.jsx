import React, { useState, useEffect } from "react";
import ViewMode from "./ViewMode/ViewMode";
import EditMode from "./EditMode/EditMode";

export default function SelectedCompany({
    clientInfo,
    setClientInfo,
    setClients,
    selectedClient,
    setSelectedClient,
}) {
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEditMode(false);
    }, [selectedClient]);

    return (
        <div>
            {!editMode && (
                <ViewMode
                    clientInfo={clientInfo}
                    setClientInfo={setClientInfo}
                    setEditMode={setEditMode}
                    setClients={setClients}
                    setSelectedClient={setSelectedClient}
                />
            )}

            {editMode && (
                <EditMode
                    clientInfo={clientInfo}
                    setEditMode={setEditMode}
                    setClients={setClients}
                    setClientInfo={setClientInfo}
                    selectedClient={selectedClient}
                />
            )}
        </div>
    );
}
