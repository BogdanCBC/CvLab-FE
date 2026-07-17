import React, { useState, useEffect } from "react";
import { Modal, Select, Button, notification, Spin } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api";
import "./AddCandidateModal.scss";

const PersonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            stroke="#2391D1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function AddCandidateModal({ open, onClose, onSave, jobId }) {
    const { t, i18n } = useTranslation();
    const [options, setOptions] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLoadingOptions(true);
        const lang = i18n.language?.startsWith('fr') ? 'French' : 'English';
        api.get('/candidates', { params: { skip: 0, limit: 100, language: lang } })
            .then(res => {
                const data = res.data?.items ?? res.data ?? [];
                setOptions(data.map(c => ({
                    value: c.id,
                    label: `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim(),
                })));
            })
            .catch(() => notification.error({ message: t("trackingPage.modal.loadError") }))
            .finally(() => setLoadingOptions(false));
    }, [open, i18n.language, t]);

    const handleSave = async () => {
        if (!selectedIds.length || !jobId) return;
        setSaving(true);
        try {
            await api.post('/job-candidates', {
                job_id: Number(jobId),
                candidate_ids: selectedIds,
            });
            notification.success({ message: t("trackingPage.modal.addSuccess"), description: t("trackingPage.modal.addSuccessDescription") });
            onSave();
            handleClose();
        } catch {
            notification.error({ message: t("trackingPage.modal.saveError") });
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setSelectedIds([]);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closable={false}
            width={480}
            className="add-candidate-modal"
            destroyOnHidden
        >
            <div className="acm-header">
                <div className="acm-header-left">
                    <div className="acm-icon">
                        <PersonIcon />
                    </div>
                    <span className="acm-title">{t("trackingPage.modal.title")}</span>
                </div>
                <button className="acm-close" onClick={handleClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="#A4A7AE" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <div className="acm-body">
                <label className="acm-label">
                    {t("trackingPage.modal.candidatesLabel")} <span className="acm-required">*</span>
                </label>
                <Spin spinning={loadingOptions}>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder={t("trackingPage.modal.selectPlaceholder")}
                        options={options}
                        value={selectedIds}
                        onChange={setSelectedIds}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        size="large"
                        notFoundContent={t("trackingPage.modal.noResults")}
                    />
                </Spin>
            </div>

            <div className="acm-footer">
                <Button className="acm-cancel-btn" onClick={handleClose}>
                    {t("trackingPage.modal.cancel")}
                </Button>
                <Button
                    type="primary"
                    className="acm-save-btn default-button"
                    onClick={handleSave}
                    loading={saving}
                    disabled={!selectedIds.length}
                >
                    {t("trackingPage.modal.save")}
                </Button>
            </div>
        </Modal>
    );
}
