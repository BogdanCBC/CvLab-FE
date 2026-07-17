import React, { useState } from "react";
import { Table, Input, notification } from "antd";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, ArrowRightIcon, ArchiveTrashIcon, ArchiveEditIcon } from "../../constants/icons";
import ArchiveReasonModal from "./ArchiveReasonModal";
import "./ArchivePage.scss";

const PersonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#2391D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9DA4AE" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 14L11.1 11.1" stroke="#9DA4AE" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function ArchivePage({ archivedCandidates, setArchivedCandidates }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const filtered = (archivedCandidates || []).filter(c =>
        (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.role || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.archiveReason || "").toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        setArchivedCandidates(prev => prev.filter(c => c.id !== id));
        notification.success({ message: t("trackingPage.archivePage.deleteSuccess"), description: t("trackingPage.archivePage.deleteSuccessDescription") });
    };

    const handleUpdateReason = (reason) => {
        setArchivedCandidates(prev =>
            prev.map(c => c.id === editingCandidate.id ? { ...c, archiveReason: reason } : c)
        );
        setEditingCandidate(null);
        notification.success({ message: t("trackingPage.archivePage.editSuccess"), description: t("trackingPage.archivePage.editSuccessDescription") });
    };

    const columns = [
        {
            title: t("trackingPage.archivePage.name"),
            dataIndex: "name",
            key: "name",
            render: (name) => (
                <div className="ap-name-cell">
                    <div className="ap-avatar"><PersonIcon /></div>
                    <span className="ap-name-text">{name}</span>
                </div>
            ),
        },
        {
            title: t("trackingPage.archivePage.role"),
            dataIndex: "role",
            key: "role",
            render: (role) => <span className="ap-cell-text">{role || "—"}</span>,
        },
        {
            title: t("trackingPage.archivePage.email"),
            dataIndex: "email",
            key: "email",
            render: (email) => <span className="ap-cell-text">{email || "—"}</span>,
        },
        {
            title: t("trackingPage.archivePage.reason"),
            dataIndex: "archiveReason",
            key: "archiveReason",
            render: (reason) => <span className="ap-reason-tag">{reason}</span>,
        },
        {
            title: "",
            key: "actions",
            width: 80,
            render: (_, record) => (
                <div className="ap-actions">
                    <button
                        className="ap-action-btn ap-action-btn--delete"
                        onClick={() => handleDelete(record.id)}
                        title={t("trackingPage.archivePage.delete")}
                    >
                        <ArchiveTrashIcon />
                    </button>
                    <button
                        className="ap-action-btn ap-action-btn--edit"
                        onClick={() => setEditingCandidate(record)}
                        title={t("trackingPage.archivePage.editReason")}
                    >
                        <ArchiveEditIcon />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="archive-page">
            <div className="archive-page-toolbar">
                <Input
                    prefix={<SearchIcon />}
                    placeholder={t("trackingPage.archivePage.searchPlaceholder")}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="ap-search"
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    prevIcon: (
                        <span><ArrowLeftIcon /> {t("trackingPage.archivePage.previous")}</span>
                    ),
                    nextIcon: (
                        <span>{t("trackingPage.archivePage.next")} <ArrowRightIcon /></span>
                    ),
                }}
                locale={{ emptyText: t("trackingPage.archivePage.empty") }}
                className="ap-table"
            />
            <ArchiveReasonModal
                open={!!editingCandidate}
                onClose={() => setEditingCandidate(null)}
                onArchive={handleUpdateReason}
            />
        </div>
    );
}
