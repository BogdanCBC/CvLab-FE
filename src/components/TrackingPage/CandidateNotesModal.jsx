import React, { useState, useEffect } from "react";
import { Modal, Input, Button, notification, Spin } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api";
import "./CandidateNotesModal.scss";

const { TextArea } = Input;

const STAGE_KEYS = [
    { id: "screening",            titleKey: "trackingPage.screening",           apiPhase: "SCREENING" },
    { id: "hr_interview",         titleKey: "trackingPage.hrInterview",         apiPhase: "HR_INTERVIEW" },
    { id: "technical_interview",  titleKey: "trackingPage.technicalInterview",  apiPhase: "TECHNICAL_INTERVIEW" },
    { id: "client_interview",     titleKey: "trackingPage.clientInterview",     apiPhase: "CLIENT_INTERVIEW" },
    { id: "offer",                titleKey: "trackingPage.offer",               apiPhase: "OFFER" },
    { id: "accepted_declined",    titleKey: "trackingPage.acceptedDeclined",    apiPhase: "ACCEPTED_DECLINED" },
];

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

export default function CandidateNotesModal({ open, onClose, candidate, jobId, currentPhase }) {
    const { t } = useTranslation();
    const [notesMap, setNotesMap] = useState({});
    const [currentNote, setCurrentNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const currentPhaseIndex = STAGE_KEYS.findIndex(s => s.id === currentPhase);
    const visibleStages = STAGE_KEYS.slice(0, currentPhaseIndex + 1);

    useEffect(() => {
        if (!open || !jobId || !candidate?.id) return;
        setLoading(true);
        setCurrentNote("");
        api.get(`/jobs/${jobId}/candidates/${candidate.id}/notes`)
            .then(res => {
                const notes = res.data?.data?.notes ?? [];
                const map = {};
                for (const note of notes) {
                    const phase = (note.phase ?? '').toLowerCase();
                    if (!map[phase]) map[phase] = [];
                    map[phase].push(note);
                }
                setNotesMap(map);
            })
            .catch(() => notification.error({ title: t("trackingPage.notesModal.loadError") }))
            .finally(() => setLoading(false));
    }, [open, jobId, candidate, currentPhase, t]);

    const handleSave = async () => {
        if (!currentNote.trim()) return;
        setSaving(true);
        try {
            await api.post(`/jobs/${jobId}/candidates/${candidate.id}/notes`, {
                content: currentNote,
            });
            notification.success({ title: t("trackingPage.notesModal.saveSuccess"), description: t("trackingPage.notesModal.saveSuccessDescription") });
            handleClose();
        } catch {
            notification.error({ title: t("trackingPage.notesModal.saveError") });
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setCurrentNote("");
        setNotesMap({});
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closable={false}
            width={764}
            className="candidate-notes-modal"
            destroyOnHidden
        >
            <div className="cnm-header">
                <div className="cnm-header-left">
                    <div className="cnm-icon">
                        <PersonIcon />
                    </div>
                    <span className="cnm-name">{candidate?.name}</span>
                </div>
                <button className="cnm-close" onClick={handleClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="#A4A7AE" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <Spin spinning={loading}>
                <div className="cnm-body">
                    {visibleStages.map((stage, index) => {
                        const isCurrentStage = index === currentPhaseIndex;
                        const phaseNotes = notesMap[stage.id] ?? [];

                        return (
                            <div key={stage.id} className="cnm-stage">
                                <label className="cnm-stage-label">{t(stage.titleKey)}</label>

                                {phaseNotes.map(note => (
                                    <div key={note.note_id} className="cnm-note-entry">
                                        <span className="cnm-note-author">
                                            {t("trackingPage.notesModal.noteBy")} {note.author_username}
                                        </span>
                                        <TextArea
                                            className="cnm-textarea cnm-textarea--readonly"
                                            rows={3}
                                            value={note.content}
                                            readOnly
                                        />
                                    </div>
                                ))}

                                {isCurrentStage && (
                                    <TextArea
                                        className="cnm-textarea"
                                        rows={4}
                                        placeholder={t("trackingPage.notesModal.placeholder")}
                                        value={currentNote}
                                        onChange={e => setCurrentNote(e.target.value)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Spin>

            <div className="cnm-footer">
                <Button className="cnm-cancel-btn" onClick={handleClose}>
                    {t("trackingPage.notesModal.cancel")}
                </Button>
                <Button
                    type="primary"
                    className="cnm-save-btn default-button"
                    onClick={handleSave}
                    loading={saving}
                    disabled={!currentNote.trim()}
                >
                    {t("trackingPage.notesModal.save")}
                </Button>
            </div>
        </Modal>
    );
}
