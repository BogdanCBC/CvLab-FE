import React, { useState } from "react";
import { Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import "./ArchiveReasonModal.scss";

const REASON_KEYS = [
    "noAlignment",
    "hired",
    "underqualified",
    "declinedOffer",
    "projectExpectations",
    "withdrew",
    "positionClosed",
    "compensationExpectations",
];

const REASON_TO_API = {
    noAlignment: "No alignment to Feel IT Culture",
    hired: "Hired",
    underqualified: "Underqualified",
    declinedOffer: "Declined Offer",
    projectExpectations: "Project Expectations",
    withdrew: "Withdrew",
    positionClosed: "Position closed",
    compensationExpectations: "Compensation/Benefits Expectations",
};

const ArchiveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 9.5V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V9.5M10 12.5H14M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V8C22 8.53043 21.7893 9.03914 21.4142 9.41421C21.0391 9.78929 20.5304 10 20 10H4C3.46957 10 2.96086 9.78929 2.58579 9.41421C2.21071 9.03914 2 8.53043 2 8V6Z" stroke="#079455" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function ArchiveReasonModal({ open, onClose, onArchive }) {
    const { t } = useTranslation();
    const [reason, setReason] = useState(null);

    const handleArchive = () => {
        if (!reason) return;
        onArchive(reason);
        setReason(null);
    };

    const handleClose = () => {
        setReason(null);
        onClose();
    };

    if (!open) return null;

    const options = REASON_KEYS.map(key => ({
        value: REASON_TO_API[key],
        label: t(`trackingPage.archiveModal.reasons.${key}`),
    }));

    return (
        <div className="arm-overlay" onClick={handleClose}>
            <div className="arm-container" onClick={e => e.stopPropagation()}>
                <div className="arm-header">
                    <div className="arm-icon-wrap">
                        <ArchiveIcon />
                    </div>
                    <span className="arm-title">{t("trackingPage.archiveModal.title")}</span>
                    <button className="arm-close" onClick={handleClose}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 4L4 12M4 4L12 12" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="arm-body">
                    <label className="arm-label">
                        {t("trackingPage.archiveModal.reason")} <span className="arm-required">*</span>
                    </label>
                    <Select
                        placeholder={t("trackingPage.archiveModal.selectPlaceholder")}
                        options={options}
                        value={reason}
                        onChange={setReason}
                        style={{ width: "100%" }}
                        size="large"
                    />
                </div>
                <div className="arm-footer">
                    <Button className="arm-cancel-btn" onClick={handleClose}>
                        {t("trackingPage.archiveModal.cancel")}
                    </Button>
                    <Button
                        className="arm-archive-btn"
                        disabled={!reason}
                        onClick={handleArchive}
                    >
                        {t("trackingPage.archiveModal.archive")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
