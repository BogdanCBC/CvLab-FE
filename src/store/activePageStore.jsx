import React, { createContext, useContext, useState } from 'react';

export const PAGES = {
    CV: 'cv',
    JOB_DESCRIPTION: 'job_description',
    COMPANIES: 'companies',
    ADMIN: 'admin',
};

const ActivePageContext = createContext(null);

export function ActivePageProvider({ children }) {
    const [activePage, setActivePage] = useState(PAGES.CV);

    return (
        <ActivePageContext.Provider value={{ activePage, setActivePage }}>
            {children}
        </ActivePageContext.Provider>
    );
}

export function useActivePage() {
    const ctx = useContext(ActivePageContext);
    if (!ctx) throw new Error('useActivePage must be used inside ActivePageProvider');
    return ctx;
}
