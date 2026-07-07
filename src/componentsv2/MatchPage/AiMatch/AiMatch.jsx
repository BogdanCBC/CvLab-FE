import { Typography, Rate, Space } from "antd";
import { UserDeleteOutlined } from "@ant-design/icons";
import "./AiMatch.css";
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const { Title, Text } = Typography;

export default function AiMatch({ aiMatchedCandidates, jobTitle, setSelectedCandidate }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const list = Array.isArray(aiMatchedCandidates) ? aiMatchedCandidates : [];
    const isEmpty = list.length === 0;

    const parseStars = (s) => {
        if (typeof s !== "string") return 0;
        const n = parseInt(s.split('/')[0], 10);
        return Number.isNaN(n) ? 0 : n;
    };

    const handleSelect = (key) => {
        setSelectedCandidate(key);
        navigate("/candidates");
    };

    return (
        <div className={["ai-match-box", isEmpty && "empty"].filter(Boolean).join(" ")}>
            {isEmpty ? (
                <div className="empty-content">
                    <UserDeleteOutlined className="empty-icon" />
                    <Text style={{ textAlign: 'center', display: 'block' }}>
                        {t("aiMatch.noMatch")} <strong>{jobTitle}</strong>.
                        {t("aiMatch.toPerform")}
                    </Text>
                    <Text style={{ textAlign: 'center', display: 'block', marginTop: 8 }}>
                        {t("aiMatch.docxTip")}
                    </Text>
                </div>
            ) : (
                <>
                    <Title level={3} style={{ textAlign: 'center' }}>
                        {t("aiMatch.aiResults")}
                    </Title>
                    <Title level={4} style={{ textAlign: 'center', color: '#2391D1' }}>
                        {t("aiMatch.job")} {jobTitle}
                    </Title>

                    <div className="matched-results-wrapper">
                        <Space direction="vertical" size={16} style={{ width: '100%', boxSizing: 'border-box' }}>
                            {list.map((c) => (
                                <div
                                    key={c.candidate_id}
                                    className="ai-candidate-card"
                                    onClick={() => handleSelect(c.candidate_id)}
                                >
                                    <Title level={5} style={{ fontWeight: 'bold', marginBottom: 8 }}>
                                        {c.candidate_name}
                                    </Title>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <Rate value={parseStars(c.match_stars)} disabled count={10} style={{ fontSize: 14 }} />
                                        <Text type="secondary">
                                            {c.match_stars}
                                        </Text>
                                    </div>
                                    <Text className="ai-description-text">
                                        {c.description}
                                    </Text>
                                </div>
                            ))}
                        </Space>
                    </div>
                </>
            )}
        </div>
    );
}
