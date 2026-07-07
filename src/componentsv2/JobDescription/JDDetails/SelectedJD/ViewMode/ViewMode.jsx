import React, { useState } from "react";
import { Button, Tag, Alert, Space } from "antd";
import { EditIcon, TrashIcon } from "../../../../../constants/icons";
import api from "../../../../../api";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ViewMode.scss";

export default function ViewMode({ jobInfo, setJobInfo, setEditMode, setJobs, setSelectedJob, clientId }) {
    const { t, i18n } = useTranslation();
    const [noMatchAlert] = useState(false);
    const [noMatchMessage] = useState("");
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const deleteRes = await api.delete("/job-description", {
                params: { job_id: jobInfo.job_id },
            });
            if (deleteRes.data.success) {
                try {
                    const jobsRes = await fetchJobDescription(i18n.language, clientId);
                    if (jobsRes.success && Array.isArray(jobsRes.jobs)) {
                        setJobInfo(null);
                        setSelectedJob(null);
                        setJobs(jobsRes.jobs || []);
                    } else {
                        setJobs([]);
                        setJobInfo(null);
                        setSelectedJob(null);
                    }
                } catch (err) {
                    setJobInfo(null);
                    setSelectedJob(null);
                    if (err.success) setJobs(err.jobs);
                }
            }
        } catch (err) {
            setJobInfo(null);
            setSelectedJob(null);
            setJobs([]);
        }
    };

    // const handleNavigate = async () => {
    //     let matchResp;
    //     try {
    //         if (localStorage.getItem("clientName") === "rgis") {
    //             matchResp = await api.get("/job-description/match/rgis", {
    //                 params: { job_id: jobInfo.job_id },
    //             });
    //         } else {
    //             matchResp = await api.get("/job-description/match", {
    //                 params: { job_id: jobInfo.job_id },
    //             });
    //         }
    //         if (matchResp.data.data.length === 0) {
    //             setNoMatchMessage("No candidate matched for this job");
    //             setNoMatchAlert(true);
    //             setTimeout(() => {
    //                 setNoMatchAlert(false);
    //                 setNoMatchMessage("");
    //             }, 3000);
    //         } else {
    //             if (matchResp.data.success) {
    //                 navigate(`/match/${jobInfo.job_id}`, {
    //                     state: {
    //                         matchedData: matchResp.data.data,
    //                         isRgis: localStorage.getItem("clientName") === "rgis",
    //                     },
    //                 });
    //             }
    //         }
    //     } catch (err) {
    //         setNoMatchMessage(err.response.data.message);
    //         setNoMatchAlert(true);
    //         setTimeout(() => {
    //             setNoMatchAlert(false);
    //             setNoMatchMessage("");
    //         }, 3000);
    //     }
    // };

    return (
        <div className="jd-wrapper">
            <div className="jd-card">

                <div className="jd-card-header">
                    <div className="jd-name-block">
                        <span className="jd-label">Job name</span>
                        <h2 className="jd-title">{jobInfo.title}</h2>
                    </div>
                    <div className="jd-header-actions">
                        {/* <Button onClick={handleNavigate} className="filled-btn">
                        {t("jdViewMode.match")}
                        </Button> */}
                        <Button
                            onClick={() => navigate(`/tracking/${jobInfo.job_id}`)}
                            className="filled-btn"
                        >
                            {t("jdViewMode.tracking", "Tracking")}
                        </Button>
                        <Button
                            icon={<TrashIcon />}
                            onClick={handleDelete}
                            className="filled-btn"
                        >
                            {t("jdViewMode.delete")}
                        </Button>
                        <Button
                            icon={<EditIcon />}
                            onClick={() => setEditMode(true)}
                            className="edit-jd-btn filled-btn"
                        >
                            {t("jdViewMode.edit")}
                        </Button>
                    </div>
                </div>

                <div className="jd-card-body">
                    {noMatchAlert && (
                        <Alert
                            message={noMatchMessage}
                            type="warning"
                            style={{ marginBottom: 16 }}
                            closable
                        />
                    )}

                    <div className="jd-section-title">Description</div>
                    <p className="jd-text">{jobInfo.description}</p>

                    {jobInfo.skills?.length > 0 && (
                        <>
                            <div className="jd-section-title">{t("jdViewMode.skills")}</div>
                            <Space wrap style={{ marginBottom: 16 }}>
                                {jobInfo.skills.map((s) => (
                                    <Tag key={s.skill}>{`${s.skill} (${s.years} yrs)`}</Tag>
                                ))}
                            </Space>
                        </>
                    )}

                    {jobInfo.languages?.length > 0 && (
                        <>
                            <div className="jd-section-title">{t("jdViewMode.language")}</div>
                            <Space wrap style={{ marginBottom: 16 }}>
                                {jobInfo.languages.map((l) => (
                                    <Tag key={l.language}>{`${l.language} (Level: ${l.level})`}</Tag>
                                ))}
                            </Space>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
