import React, {useState} from "react"
import { useNavigate } from 'react-router-dom';
import { Typography, Tag, Space, Checkbox, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import "./RawMatch.css"
import api from "../../../api";
import { downloadFileFromBlob, getFileNameFromDisposition } from "../../../helperFunctions";
import {useTranslation} from "react-i18next";

const { Title, Text } = Typography;

export default function RawMatch({ jobId, jobTitle, setSelectedCandidate, matchCandidates, setAiMatchedCandidates }) {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const systemLanguage = i18n.language?.startsWith('fr') ? 'French' : 'English';

    const handleAIMatch = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("job_id", String(jobId));
        selectedIds.forEach(id => params.append("candidate_id", String(id)));
        params.append("response_language", systemLanguage);

        try{
            const response = await api.get("/job-description/ai-match", { params });
            if(response.data.success){
                setAiMatchedCandidates(response.data.data)
            }
            setLoading(false);
        } catch (err){
            setLoading(false)
        }
    };

    const handleDocxDownload = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("job_id", String(jobId));
        selectedIds.forEach(id => params.append("candidate_id", String(id)));
        params.append("response_language", systemLanguage);

        try {
            const response = await api.get("/job-description/generate-docx", {
                params,
                responseType: "blob"
            });
            const disposition = response.headers['content-disposition'];
            const fileName = getFileNameFromDisposition(disposition);

            downloadFileFromBlob(response.data, fileName);
            setLoading(false);
        } catch (err){
            setLoading(false);
        }
    }

    const toggleCheckbox = (id) => (event) => {
        event.stopPropagation();
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSelect = (key) => {
        setSelectedCandidate(key);
        navigate("/candidates");
    };

    const tooltipContent = (
        <>
            <Text strong style={{ display: 'block', marginBottom: 4, textAlign: 'justify' }}>
                {t("rawMatch.matchTooltip")}
            </Text>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: 'justify' }}>
                <li style={{ marginBottom: '0.2rem' }}>{t("rawMatch.left")}</li>
                <li style={{ marginBottom: '0.2rem' }}>{t("rawMatch.select")}</li>
                <li style={{ marginBottom: '0.2rem' }}>{t("rawMatch.download")}</li>
            </ul>
        </>
    );

    return (
        <div className="raw-match-box">
            <Title level={3} style={{ textAlign: 'center' }}>
                {t("rawMatch.title")}
            </Title>

            <Title level={4} style={{ textAlign: 'center', color: '#2391D1' }}>
                {t("rawMatch.job")} {jobTitle}
            </Title>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: '2vh', marginTop: '2vh' }}>
                <Button
                    type="primary"
                    loading={loading}
                    className="default-button small"
                    onClick={handleAIMatch}
                >
                    {t("rawMatch.aiBtn")}
                </Button>

                <Button
                    loading={loading}
                    className="filled-btn"
                    onClick={handleDocxDownload}
                >
                    {t("rawMatch.downloadBtn")}
                </Button>

                <Tooltip title={tooltipContent}>
                    <Button type="text" icon={<InfoCircleOutlined />} />
                </Tooltip>
            </div>

            <div className="candidates-list-wrapper">
                <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                    {matchCandidates.map((c) => (
                        <div
                            key={c.id}
                            className="candidate-paper"
                            onClick={() => handleSelect(c.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Checkbox
                                    checked={selectedIds.has(c.id)}
                                    onChange={toggleCheckbox(c.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <Title level={5} style={{ margin: 0 }}>
                                    {c.first_name} {c.last_name}
                                </Title>
                            </div>

                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                {c.position}
                            </Text>

                            {c.skills && c.skills.length > 0 && (
                                <>
                                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                        {t("rawMatch.matchedSkills")} {c.matched_count}
                                    </Text>
                                    <Space wrap size={4}>
                                        {c.skills.map((s, index) => (
                                            <Tag
                                                key={`${s.skill}-${index}`}
                                                color="blue"
                                            >
                                                {`${s.skill} (${s.years} ${t("rawMatch.yrs")})`}
                                            </Tag>
                                        ))}
                                    </Space>
                                </>
                            )}
                        </div>
                    ))}
                </Space>
            </div>
        </div>
    );
}
