import React, { useState } from "react";
import { Table, Button } from "antd";
import { Input } from "antd";
import { SearchIcon, FilterIcon, ArrowLeftIcon, ArrowRightIcon } from "../../../constants/icons";
import { useTranslation } from "react-i18next";
import "./JDTable.css";

export default function JDTable({ jobs, setSelectedJob, selectedJob }) {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);

    const truncate = (text, limit) =>
        text?.length > limit ? text.slice(0, limit) + "..." : text;

    const filteredJobs = jobs.filter((job) =>
        job.title?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: t("jdTable.title"),
            dataIndex: "title",
            key: "title",
        },
        {
            title: t("jdTable.shortDescription"),
            dataIndex: "description",
            key: "description",
            render: (text) => truncate(text, 130),
        },
        {
            title: t("jdTable.actions", "Actions"),
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    className="view-link"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(record.job_id);
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
        <div className="jd-table">
            <div className="jd-table-header">
                <Input
                    placeholder="Search"
                    prefix={<SearchIcon />}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(1);
                    }}
                    className="jd-search"
                />
                {/* <Button icon={<FilterIcon />} className="filters-button">
                    Filters
                </Button> */}
            </div>
            <Table
                className="jd-jobs-table"
                dataSource={filteredJobs}
                columns={columns}
                rowKey="job_id"
                onRow={(record) => ({
                    onClick: () => setSelectedJob(record.job_id),
                    className: `jd-table-row${selectedJob === record.job_id ? " active" : ""}`,
                })}
                pagination={{
                    current: page,
                    pageSize: 8,
                    total: filteredJobs.length,
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
