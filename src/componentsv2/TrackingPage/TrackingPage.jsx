import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, message, Spin, Modal, Button } from "antd";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDndContext,
    closestCorners,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import AddCandidateModal from "./AddCandidateModal";
import ArchiveReasonModal from "./ArchiveReasonModal";
import CandidateNotesModal from "./CandidateNotesModal";
import "./TrackingPage.scss";
import { PersonIcon, MoreDotsIcon } from "../../constants/icons";

const COLUMNS = [
    { id: "screening", titleKey: "trackingPage.screening" },
    { id: "hr_interview", titleKey: "trackingPage.hrInterview" },
    { id: "technical_interview", titleKey: "trackingPage.technicalInterview" },
    { id: "client_interview", titleKey: "trackingPage.clientInterview" },
    { id: "offer", titleKey: "trackingPage.offer" },
    { id: "accepted_declined", titleKey: "trackingPage.acceptedDeclined" },
];

const EMPTY_COLUMNS = {
    screening: [],
    hr_interview: [],
    technical_interview: [],
    client_interview: [],
    offer: [],
    accepted_declined: [],
};

const COLUMN_TO_API_PHASE = {
    screening: "SCREENING",
    hr_interview: "HR_INTERVIEW",
    technical_interview: "TECHNICAL_INTERVIEW",
    client_interview: "CLIENT_INTERVIEW",
    offer: "OFFER",
    accepted_declined: "ACCEPTED_DECLINED",
};

const mapCandidate = (raw) => {
    const phase = (raw.phase ?? '').toUpperCase();
    let status = null;
    if (phase === 'ACCEPTED') status = 'accepted';
    else if (phase === 'DECLINED') status = 'declined';

    return {
        id: String(raw.id ?? raw.job_candidate_id),
        candidateId: raw.candidate_id,
        name: raw.candidate_name ?? raw.name ?? `#${raw.candidate_id}`,
        role: raw.role ?? "",
        email: raw.email ?? "",
        location: raw.candidate_location ?? "",
        opportunityOwner: raw.uploader_username ?? raw.opportunityOwner ?? "",
        archived: raw.archived ?? false,
        archiveReason: raw.archive_reason ?? null,
        descriptions: raw.descriptions ?? {},
        status,
    };
};

function CandidateCard({ candidate, isDragging, t, onArchive, onAddNote, onCvProfile, columnId }) {
    const menuItems = [
        { key: "cv_profile", label: t("trackingPage.cvProfile") },
        { key: "add_note", label: t("trackingPage.addNote") },
        { key: "archive_reason", label: t("trackingPage.archiveReason") },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === "cv_profile" && onCvProfile) onCvProfile(candidate);
        if (key === "add_note" && onAddNote) onAddNote(candidate, columnId);
        if (key === "archive_reason" && onArchive) onArchive(candidate);
    };

    return (
        <div className={`tracking-card ${isDragging ? "tracking-card--dragging" : ""}`}>
            <div className="tracking-card-header">
                <div className="tracking-card-info">
                    <div className="icon-wrapper">
                        <PersonIcon />
                    </div>
                    <div className="tracking-card-details">
                        <span className="tracking-card-name">{candidate.name}</span>
                        <span className="tracking-card-location">{candidate.location}</span>
                    </div>
                </div>
                <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]} placement="bottomRight">
                    <button className="tracking-card-menu" onClick={(e) => e.stopPropagation()}>
                        <MoreDotsIcon />
                    </button>
                </Dropdown>
            </div>
            <div className="tracking-card-footer">
                <span className="tracking-card-label">{t("trackingPage.opportunityOwner")}</span>
                <span className="tracking-card-owner">{candidate.opportunityOwner}</span>
            </div>
            {candidate.status && (
                <div className={`tracking-card-status tracking-card-status--${candidate.status}`}>
                    {candidate.status === "accepted"
                        ? `•  ${t("trackingPage.accepted")}`
                        : `✖  ${t("trackingPage.declined")}`}
                </div>
            )}
        </div>
    );
}

function SortableCard({ candidate, t, onArchive, onAddNote, onCvProfile, columnId }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: candidate.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <CandidateCard candidate={candidate} t={t} onArchive={onArchive} onAddNote={onAddNote} onCvProfile={onCvProfile} columnId={columnId} />
        </div>
    );
}

function KanbanColumn({ column, candidates, t, onArchive, onAddNote, onCvProfile }) {
    const { setNodeRef } = useDroppable({ id: column.id });
    const { over } = useDndContext();

    const isColumnActive = over?.id === column.id
        || candidates.some((c) => String(c.id) === String(over?.id));

    return (
        <div ref={setNodeRef} className="tracking-column">
            <div className="tracking-column-header">
                <span className="tracking-column-title">{t(column.titleKey)}</span>
            </div>
            <SortableContext
                id={column.id}
                items={candidates.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={`tracking-column-body ${isColumnActive ? "tracking-column-body--over" : ""}`}>
                    {candidates.map((candidate) => (
                        <SortableCard key={candidate.id} candidate={candidate} t={t} onArchive={onArchive} onAddNote={onAddNote} onCvProfile={onCvProfile} columnId={column.id} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

function AcceptDeclineModal({ open, onAccepted, onDeclined, onCancel, t }) {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            closable
            width={400}
            className="accept-decline-modal"
            centered
        >
            <div className="adm-content">
                <h3 className="adm-title">{t("trackingPage.acceptDeclineModal.title")}</h3>
                <p className="adm-subtitle">{t("trackingPage.acceptDeclineModal.subtitle")}</p>
                <div className="adm-buttons">
                    <Button className="adm-btn adm-btn--accepted" onClick={onAccepted}>
                        • {t("trackingPage.accepted")}
                    </Button>
                    <Button className="adm-btn adm-btn--declined" onClick={onDeclined}>
                        ✖ {t("trackingPage.declined")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default function TrackingPage({ addCandidateOpen, setAddCandidateOpen, archivedCandidates, setArchivedCandidates, setSelectedCandidate }) {
    const { t } = useTranslation();
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [columns, setColumns] = useState(EMPTY_COLUMNS);
    const [loading, setLoading] = useState(true);
    const [activeCandidate, setActiveCandidate] = useState(null);
    const [archivingCandidate, setArchivingCandidate] = useState(null);
    const [notingCandidate, setNotingCandidate] = useState(null);
    const [notingPhase, setNotingPhase] = useState(null);
    const [pendingAcceptDecline, setPendingAcceptDecline] = useState(null);

    const fetchCandidates = useCallback(() => {
        if (!jobId) return;
        setLoading(true);
        api.get(`/job-candidates/${jobId}`)
            .then((res) => {
                const items = res.data?.data ?? [];
                const mapped = Object.fromEntries(
                    Object.keys(EMPTY_COLUMNS).map(phase => [phase, []])
                );
                for (const item of items) {
                    const phaseRaw = (item.phase ?? '').toUpperCase();
                    const colKey = (phaseRaw === 'ACCEPTED' || phaseRaw === 'DECLINED')
                        ? 'accepted_declined'
                        : phaseRaw.toLowerCase();
                    if (mapped[colKey] !== undefined) {
                        mapped[colKey].push(mapCandidate(item));
                    }
                }
                setColumns(mapped);
            })
            .catch(() => {
                message.error(t("trackingPage.fetchError"));
            })
            .finally(() => setLoading(false));
    }, [jobId, t]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const findColumnOfCard = (cardId) => {
        for (const [colId, cards] of Object.entries(columns)) {
            if (cards.some((c) => c.id === cardId)) return colId;
        }
        return null;
    };

    const isColumnId = (id) => COLUMNS.some((c) => c.id === id);

    const handleCvProfile = (candidate) => {
        if (setSelectedCandidate) setSelectedCandidate(candidate.candidateId);
        navigate("/candidates");
    };

    const handleAddNote = (candidate, phase) => {
        setNotingCandidate(candidate);
        setNotingPhase(phase);
    };

    const handleArchiveCandidate = (candidate) => {
        setArchivingCandidate(candidate);
    };

    const handleAcceptDeclineChoice = (choice) => {
        const { cardId } = pendingAcceptDecline;
        const phase = choice === 'accepted' ? 'ACCEPTED' : 'DECLINED';
        setColumns((prev) => ({
            ...prev,
            accepted_declined: prev.accepted_declined.map((c) =>
                c.id === cardId ? { ...c, status: choice } : c
            ),
        }));
        api.put(`/job-candidates/${cardId}/phase`, { phase }).catch(() => {
            message.error(t("trackingPage.phaseUpdateError"));
            fetchCandidates();
        });
        setPendingAcceptDecline(null);
    };

    const handleAcceptDeclineCancel = () => {
        const { cardId, sourceCol } = pendingAcceptDecline;
        setColumns((prev) => {
            const targetCards = [...prev.accepted_declined];
            const cardIndex = targetCards.findIndex((c) => c.id === cardId);
            if (cardIndex === -1) return prev;
            const [card] = targetCards.splice(cardIndex, 1);
            return {
                ...prev,
                accepted_declined: targetCards,
                [sourceCol]: [...prev[sourceCol], card],
            };
        });
        setPendingAcceptDecline(null);
    };

    const handleConfirmArchive = (reason) => {
        const candidate = archivingCandidate;
        const sourceCol = findColumnOfCard(candidate.id);

        setColumns((prev) => ({
            ...prev,
            [sourceCol]: (prev[sourceCol] ?? []).filter((c) => c.id !== candidate.id),
        }));
        if (setArchivedCandidates) {
            setArchivedCandidates((prev) => [
                ...prev,
                { ...candidate, archiveReason: reason },
            ]);
        }
        setArchivingCandidate(null);

        api.put(`/job-candidates/${candidate.id}/archive`, { archive_reason: reason })
            .then(() => {
                message.success(t("trackingPage.archiveModal.archiveSuccess"));
            })
            .catch(() => {
                message.error(t("trackingPage.archiveModal.archiveError"));
                if (sourceCol) {
                    setColumns((prev) => ({
                        ...prev,
                        [sourceCol]: [...(prev[sourceCol] ?? []), candidate],
                    }));
                }
                if (setArchivedCandidates) {
                    setArchivedCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
                }
            });
    };

    const handleDragStart = (event) => {
        const sourceCol = findColumnOfCard(event.active.id);
        if (sourceCol) {
            setActiveCandidate(columns[sourceCol].find((c) => c.id === event.active.id));
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveCandidate(null);

        if (!over || active.id === over.id) return;

        const sourceCol = findColumnOfCard(active.id);
        const targetCol = isColumnId(over.id) ? over.id : findColumnOfCard(over.id);

        if (!sourceCol || !targetCol) return;

        if (sourceCol === targetCol) {
            setColumns((prev) => {
                const cards = prev[sourceCol];
                const oldIndex = cards.findIndex((c) => c.id === active.id);
                const newIndex = cards.findIndex((c) => c.id === over.id);
                if (oldIndex === newIndex) return prev;
                return { ...prev, [sourceCol]: arrayMove(cards, oldIndex, newIndex) };
            });
        } else {
            setColumns((prev) => {
                const sourceCards = [...prev[sourceCol]];
                const targetCards = [...prev[targetCol]];
                const cardIndex = sourceCards.findIndex((c) => c.id === active.id);
                const [card] = sourceCards.splice(cardIndex, 1);

                const overIndex = isColumnId(over.id)
                    ? targetCards.length
                    : targetCards.findIndex((c) => c.id === over.id);

                targetCards.splice(overIndex >= 0 ? overIndex : targetCards.length, 0, card);

                return { ...prev, [sourceCol]: sourceCards, [targetCol]: targetCards };
            });

            if (targetCol === 'accepted_declined') {
                setPendingAcceptDecline({ cardId: active.id, sourceCol });
            } else {
                api.put(`/job-candidates/${active.id}/phase`, {
                    phase: COLUMN_TO_API_PHASE[targetCol],
                }).catch(() => {
                    message.error(t("trackingPage.phaseUpdateError"));
                    fetchCandidates();
                });
            }
        }
    };

    return (
        <div className="tracking-page">
            <Spin spinning={loading} size="large" classNames={{ root: "tracking-board-spin" }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="tracking-board">
                    {COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            column={col}
                            candidates={columns[col.id]}
                            t={t}
                            onArchive={handleArchiveCandidate}
                            onAddNote={handleAddNote}
                            onCvProfile={handleCvProfile}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeCandidate ? <CandidateCard candidate={activeCandidate} isDragging t={t} /> : null}
                </DragOverlay>
            </DndContext>

            <AddCandidateModal
                open={addCandidateOpen}
                jobId={jobId}
                onClose={() => setAddCandidateOpen(false)}
                onSave={() => {
                    setAddCandidateOpen(false);
                    fetchCandidates();
                }}
            />

            <ArchiveReasonModal
                open={!!archivingCandidate}
                onClose={() => setArchivingCandidate(null)}
                onArchive={handleConfirmArchive}
            />

            <CandidateNotesModal
                open={!!notingCandidate}
                onClose={() => { setNotingCandidate(null); setNotingPhase(null); }}
                candidate={notingCandidate}
                jobId={jobId}
                currentPhase={notingPhase}
            />

            <AcceptDeclineModal
                open={!!pendingAcceptDecline}
                t={t}
                onAccepted={() => handleAcceptDeclineChoice('accepted')}
                onDeclined={() => handleAcceptDeclineChoice('declined')}
                onCancel={handleAcceptDeclineCancel}
            />
            </Spin>
        </div>
    );
}
