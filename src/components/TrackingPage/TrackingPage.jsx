import React, { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Dropdown, notification, Spin, Modal, Button } from "antd";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDndContext,
    pointerWithin,
    rectIntersection,
    MeasuringStrategy,
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
import { PersonIcon, MoreDotsIcon, aiMatchHistoryIcon as AiMatchHistoryIcon } from "../../constants/icons";

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

// "1/10" → 10  (percentage 0-100)
const parseMatchScore = (scoreStr) => {
    const parts = String(scoreStr ?? '').split('/');
    if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den > 0) return Math.round((num / den) * 100);
    }
    return 0;
};

function AiMatchModalContent({ results, phase, onClose, createdAt, t }) {
    const candidates = Array.isArray(results) ? results : [];
    const [isDownloading, setIsDownloading] = useState(false);
    const wrapRef = useRef(null);

    const formatCreatedAt = (iso) => {
        const d = new Date(iso);
        const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        return `${time} ${date}`;
    };

    const modalTitle = createdAt
        ? t('trackingPage.aiMatch.modalTitleHistory', { date: formatCreatedAt(createdAt) })
        : t('trackingPage.aiMatch.modalTitle');

    const ordinal = (n) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const scoreColor = (pct) => {
        if (pct >= 70) return '#079455';
        if (pct >= 40) return '#F59E0B';
        return '#D92D20';
    };

    const fitLabel = (pct) => {
        if (pct >= 70) return t('trackingPage.aiMatch.strongFit');
        if (pct >= 40) return t('trackingPage.aiMatch.mediumFit');
        return t('trackingPage.aiMatch.lowFit');
    };

    const rankColor = (rank) => {
        if (rank === 1) return '#079455';
        if (rank === 2) return '#F59E0B';
        return '#D92D20';
    };

    const handleDownload = async () => {
        if (!wrapRef.current) return;
        setIsDownloading(true);

        const list = wrapRef.current.querySelector('.amr-list');
        const footer = wrapRef.current.querySelector('.amr-footer');
        const prevMaxHeight = list?.style.maxHeight ?? '';
        const prevOverflow = list?.style.overflowY ?? '';
        if (list) { list.style.maxHeight = 'none'; list.style.overflowY = 'visible'; }
        if (footer) footer.style.display = 'none';

        try {
            const canvas = await html2canvas(wrapRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentW = pageW - 2 * margin;
            const imgH = (canvas.height * contentW) / canvas.width;

            let heightLeft = imgH;
            let position = margin;
            pdf.addImage(imgData, 'PNG', margin, position, contentW, imgH);
            heightLeft -= pageH;

            while (heightLeft > 0) {
                position -= pageH;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, contentW, imgH);
                heightLeft -= pageH;
            }

            pdf.save(`ai-match-${phase.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`);
        } finally {
            if (list) { list.style.maxHeight = prevMaxHeight; list.style.overflowY = prevOverflow; }
            if (footer) footer.style.display = '';
            setIsDownloading(false);
        }
    };

    return (
        <div className="amr-wrap" ref={wrapRef}>
            {isDownloading && (
                <div className="amr-loading-overlay">
                    <Spin size="large" />
                    <span className="amr-loading-text">{t('trackingPage.aiMatch.generatingPdf')}</span>
                </div>
            )}
            <div className="amr-header">
                <div>
                    <h3 className="amr-title">{modalTitle}</h3>
                    <p className="amr-subtitle">{t('trackingPage.aiMatch.modalSubtitle')}</p>
                </div>
                <button className="amr-close-x" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
            <div className="amr-list">
                {candidates.map((c, i) => {
                    const rank = c.rank ?? (i + 1);
                    const name = c.candidate_name ?? `Candidate #${rank}`;
                    const isMatch = c.fit;
                    const matchScore = c.match_score ?? '';
                    const scorePct = parseMatchScore(matchScore);
                    const color = scoreColor(scorePct);
                    const summary = c.summary ?? '';

                    return (
                        <div key={i} className="amr-item">
                            <div className="amr-row">
                                <div className="amr-rank" style={{ background: rankColor(rank) }}>
                                    {rank}
                                </div>
                                <div className="amr-meta">
                                    <div className="amr-name-row">
                                        <span className="amr-name">{name}</span>
                                        <span className="amr-ordinal">{ordinal(rank)}</span>
                                        <span className={`amr-badge amr-badge--${isMatch ? 'match' : 'no'}`}>
                                            {isMatch
                                                ? `● ${t('trackingPage.aiMatch.isMatch')}`
                                                : `● ${t('trackingPage.aiMatch.notMatch')}`}
                                        </span>
                                    </div>
                                    <div className="amr-fit-row">
                                        <span className="amr-fit-label">{fitLabel(scorePct)}</span>
                                        <div className="amr-bar-track">
                                            <div className="amr-bar-fill" style={{ width: `${scorePct}%`, background: color }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {summary && <p className="amr-reason">{summary}</p>}
                        </div>
                    );
                })}
                {candidates.length === 0 && (
                    <p className="amr-empty">No results to display.</p>
                )}
            </div>
            <div className="amr-footer">
                <Button className="amr-btn-close" onClick={onClose}>
                    {t('trackingPage.aiMatch.close')}
                </Button>
                <Button className="amr-btn-download default-button small" type="primary" onClick={handleDownload}>
                    {t('trackingPage.aiMatch.download')}
                </Button>
            </div>
        </div>
    );
}

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

function KanbanColumn({ column, candidates, t, onArchive, onAddNote, onCvProfile, onAiMatch, onAiMatchHistory, onHistoryItemClick }) {
    const { setNodeRef } = useDroppable({ id: column.id });
    const { over } = useDndContext();
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);

    const isColumnActive = over?.id === column.id
        || candidates.some((c) => String(c.id) === String(over?.id));

    const showAiMatch = column.id !== 'accepted_declined' && candidates.length > 0;

    const handleHistoryClick = async () => {
        if (historyLoading) return;
        setHistoryLoading(true);
        setHistoryOpen(false);
        try {
            const items = await onAiMatchHistory(column.id);
            setHistoryItems(Array.isArray(items) ? items : []);
            setHistoryOpen(true);
        } catch {
            // error surfaced by parent
        } finally {
            setHistoryLoading(false);
        }
    };

    const formatHistoryDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        return `${t('trackingPage.aiMatch.viewAt')} ${time} ${date}`;
    };

    const historyMenuItems = historyItems.length > 0
        ? historyItems.map((item) => ({
            key: String(item.match_id),
            label: formatHistoryDate(item.created_at),
            onClick: () => onHistoryItemClick(item.match_id, item.created_at),
        }))
        : [{ key: 'empty', label: t('trackingPage.aiMatch.noHistory'), disabled: true }];

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
            {showAiMatch && (
                <div className={`ai-match-section${historyOpen ? ' ai-match-section--open' : ''}`}>
                    <button className="ai-match-btn" onClick={() => onAiMatch(column.id)}>
                        {t('trackingPage.aiMatch.buttonLabel')}
                    </button>
                    <Dropdown
                        menu={{ items: historyMenuItems }}
                        open={historyOpen}
                        onOpenChange={(v) => { if (!v) setHistoryOpen(false); }}
                        placement="topRight"
                        trigger={['click']}
                    >
                        <button className="ai-match-history-btn" onClick={handleHistoryClick}>
                            {historyLoading ? <Spin size="small" /> : <AiMatchHistoryIcon />}
                        </button>
                    </Dropdown>
                </div>
            )}
        </div>
    );
}

const kanbanCollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return rectIntersection(args);
};

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
                notification.error({ title: t("trackingPage.fetchError") });
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

    const handleAiMatchHistory = useCallback(async (columnId) => {
        const phase = COLUMN_TO_API_PHASE[columnId];
        const res = await api.get(`/job-candidates/${jobId}/matches`, { params: { phase } });
        return res.data?.data ?? res.data ?? [];
    }, [jobId]);

    const openAiMatchModal = useCallback((results, phase, createdAt = null) => {
        let modalInstance;
        const handleClose = () => modalInstance?.destroy();
        modalInstance = Modal.info({
            icon: null,
            title: null,
            content: (
                <AiMatchModalContent
                    results={results}
                    phase={phase}
                    createdAt={createdAt}
                    onClose={handleClose}
                    t={t}
                />
            ),
            footer: null,
            width: 924,
            style: { top: 34 },
            className: 'ai-match-result-modal',
            closable: false,
            mask: { closable: false },
        });
    }, [t]);

    const handleAiMatch = useCallback((columnId) => {
        const phase = COLUMN_TO_API_PHASE[columnId];
        const notifKey = `ai-match-${columnId}-${Date.now()}`;

        notification.open({
            key: notifKey,
            title: t('trackingPage.aiMatch.loadingTitle'),
            description: t('trackingPage.aiMatch.loadingDescription'),
            icon: <Spin size="small" />,
            duration: 0,
            placement: 'topRight',
        });

        api.post('/job-candidates/ai-match', { job_id: Number(jobId), phase })
            .then((res) => {
                const results = res.data?.data?.rankings ?? [];
                notification.open({
                    key: notifKey,
                    title: t('trackingPage.aiMatch.successTitle'),
                    description: t('trackingPage.aiMatch.successDescription'),
                    actions: (
                        <Button className="default-button small" size="small" type="primary" onClick={() => {
                            notification.destroy(notifKey);
                            openAiMatchModal(results, phase);
                        }}>
                            {t('trackingPage.aiMatch.viewResults')}
                        </Button>
                    ),
                    duration: 0,
                    placement: 'topRight',
                });
            })
            .catch(() => {
                notification.open({
                    key: notifKey,
                    type: 'error',
                    title: t('trackingPage.aiMatch.errorTitle'),
                    description: t('trackingPage.aiMatch.errorDescription'),
                    duration: 5,
                    placement: 'topRight',
                });
            });
    }, [jobId, t, openAiMatchModal]);

    const handleHistoryItemClick = useCallback(async (matchId, createdAt) => {
        const notifKey = `ai-match-history-view-${matchId}-${Date.now()}`;
        notification.open({
            key: notifKey,
            title: t('trackingPage.aiMatch.loadingTitle'),
            icon: <Spin size="small" />,
            duration: 0,
            placement: 'topRight',
        });
        try {
            const res = await api.get(`/job-candidates/${jobId}/matches/${matchId}`);
            const results = res.data?.data?.rankings ?? [];
            const phase = res.data?.data?.phase ?? '';
            notification.destroy(notifKey);
            openAiMatchModal(results, phase, createdAt);
        } catch {
            notification.open({
                key: notifKey,
                type: 'error',
                title: t('trackingPage.aiMatch.errorTitle'),
                duration: 5,
                placement: 'topRight',
            });
        }
    }, [jobId, t, openAiMatchModal]);

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
            notification.error({ title: t("trackingPage.phaseUpdateError") });
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
                notification.success({ title: t("trackingPage.archiveModal.archiveSuccess"), description: t("trackingPage.archiveModal.archiveSuccessDescription") });
            })
            .catch(() => {
                notification.error({ title: t("trackingPage.archiveModal.archiveError") });
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
                const [rawCard] = sourceCards.splice(cardIndex, 1);
                const card = sourceCol === 'accepted_declined' ? { ...rawCard, status: null } : rawCard;

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
                    notification.error({ title: t("trackingPage.phaseUpdateError") });
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
                collisionDetection={kanbanCollisionDetection}
                measuring={{ droppable: { strategy: MeasuringStrategy.WhileDragging } }}
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
                            onAiMatch={handleAiMatch}
                            onAiMatchHistory={handleAiMatchHistory}
                            onHistoryItemClick={handleHistoryItemClick}
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
