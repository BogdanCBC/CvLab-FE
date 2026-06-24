import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import { SearchIcon, ArrowLeftIcon, ArrowRightIcon } from "../../../constants/icons";
import { useTranslation } from "react-i18next";
import "./CompaniesTable.css";

export default function CompaniesTable({ clients, setSelectedClient, selectedClient }) {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);

    const truncate = (text, limit) =>
        text?.length > limit ? text.slice(0, limit) + "..." : text;

    const filteredClients = clients.filter((client) =>
        client.client_name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: t("companiesTable.name", "Companie"),
            dataIndex: "client_name",
            key: "client_name",
        },
        {
            title: t("companiesTable.description", "Description"),
            dataIndex: "client_description",
            key: "client_description",
            render: (text) => truncate(text, 130),
        },
        {
            title: t("companiesTable.actions", "Actions"),
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    className="view-link"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(record.client_id);
                    }}
                >
                    View
                </Button>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        setPage(pagination.current);
    };

    return (
        <div className="companies-table">
            <div className="companies-table-header">
                <Input
                    placeholder="Search"
                    prefix={<SearchIcon />}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(1);
                    }}
                    className="companies-search"
                />
            </div>
            <Table
                className="companies-list-table"
                dataSource={filteredClients}
                columns={columns}
                rowKey="client_id"
                onRow={(record) => ({
                    onClick: () => setSelectedClient(record.client_id),
                    className: `companies-table-row${selectedClient === record.client_id ? " active" : ""}`,
                })}
                pagination={{
                    current: page,
                    pageSize: 8,
                    total: filteredClients.length,
                    showSizeChanger: false,
                    prevIcon: (
                        <span>
                            <ArrowLeftIcon /> Previous
                        </span>
                    ),
                    nextIcon: (
                        <span>
                            Next <ArrowRightIcon />
                        </span>
                    ),
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}
