import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Select, Card, Input, Button, Switch, Spin, Alert, Tag, Flex } from 'antd';
import { LockOutlined, UnlockOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../api';
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { TextArea } = Input;

const PromptPage = ({ setIsLoggedIn }) => {
    const { t } = useTranslation();

    const userRole = localStorage.getItem('role') || 'admin';
    const isSuperadmin = userRole === 'superadmin';

    const [actionType, setActionType] = useState('EXTRACT_CV');
    const [promptData, setPromptData] = useState({
        base_instructions: '',
        custom_instructions: '',
        json_schema: '',
        version: 0
    });

    const [superAdminMode, setSuperAdminMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingCustom, setIsSavingCustom] = useState(false);
    const [isSavingSystem, setIsSavingSystem] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });

    const fetchPrompts = useCallback(async () => {
        setIsLoading(true);
        setNotification({ type: '', message: '' });
        try {
            const response = await api.get(`/prompts/${actionType}`);
            setPromptData({
                base_instructions: response.data.base_instructions || '',
                custom_instructions: response.data.custom_instructions || '',
                json_schema: response.data.json_schema || '',
                version: response.data.version || 1
            });
        } catch (error) {
            console.error("Error fetching prompts:", error);
            setNotification({ type: 'error', message: t("prompts.fetchError", "Failed to load prompt configurations.") });
        } finally {
            setIsLoading(false);
        }
    }, [actionType, t]);

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const handleChange = (field) => (e) => {
        setPromptData({ ...promptData, [field]: e.target.value });
    };

    const handleSaveCustom = async () => {
        setIsSavingCustom(true);
        setNotification({ type: '', message: '' });
        try {
            const response = await api.put(`/prompts/${actionType}`, {
                custom_instructions: promptData.custom_instructions
            });
            setPromptData(prev => ({ ...prev, version: response.data.version }));
            setNotification({ type: 'success', message: t("prompts.saveSuccess", "Custom instructions saved successfully!") });
        } catch (error) {
            setNotification({ type: 'error', message: t("prompts.saveError", "Failed to save custom instructions.") });
        } finally {
            setIsSavingCustom(false);
        }
    };

    const handleSaveSystem = async () => {
        setIsSavingSystem(true);
        setNotification({ type: '', message: '' });
        try {
            await api.put(`/prompts/system/${actionType}`, {
                base_instructions: promptData.base_instructions,
                json_schema: promptData.json_schema
            });
            setNotification({ type: 'success', message: t("prompts.systemSaveSuccess", "Core system logic updated globally!") });
        } catch (error) {
            setNotification({ type: 'error', message: t("prompts.systemSaveError", "Failed to update system logic.") });
        } finally {
            setIsSavingSystem(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginTop: 24, paddingLeft: 32, paddingRight: 32, paddingBottom: 32, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                    <div>
                        <Title level={3} style={{ margin: 0, fontWeight: 'bold', color: '#1976d2' }}>
                            {t("prompts.pageTitle", "Prompt Engineering")}
                        </Title>
                        <Text type="secondary">
                            {t("prompts.pageSubtitle", "Configure AI extraction and matching behaviors")}
                        </Text>
                    </div>

                    <Flex align="center" gap={24}>
                        {isSuperadmin && (
                            <Flex align="center" gap={8}>
                                <Switch
                                    checked={superAdminMode}
                                    onChange={(checked) => setSuperAdminMode(checked)}
                                />
                                <Text strong style={{ color: superAdminMode ? '#ff4d4f' : undefined }}>
                                    Superadmin Mode
                                </Text>
                            </Flex>
                        )}

                        <Select
                            value={actionType}
                            onChange={(value) => setActionType(value)}
                            style={{ minWidth: 220 }}
                            options={[
                                { value: 'EXTRACT_CV', label: 'Parse CV Data' },
                                { value: 'EXTRACT_JD', label: 'Parse Job Description' },
                                { value: 'MATCH_CANDIDATES', label: 'Match Candidates' },
                            ]}
                        />
                    </Flex>
                </Flex>

                {notification.message && (
                    <Alert
                        type={notification.type}
                        message={notification.message}
                        showIcon
                        closable
                        onClose={() => setNotification({ type: '', message: '' })}
                        style={{ marginBottom: 24, borderRadius: 8 }}
                    />
                )}

                {isLoading ? (
                    <Flex justify="center" align="center" style={{ flex: 1 }}>
                        <Spin size="large" />
                    </Flex>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>

                        <Flex justify="flex-end">
                            <Tag color="blue" style={{ fontWeight: 'bold', fontSize: 13, padding: '4px 12px' }}>
                                Active Version: v{promptData.version}
                            </Tag>
                        </Flex>

                        <Card
                            style={{
                                borderRadius: 8,
                                backgroundColor: superAdminMode ? '#fff' : '#f5f5f5',
                            }}
                            styles={{ body: { padding: 24 } }}
                        >
                            <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
                                {superAdminMode
                                    ? <UnlockOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                                    : <LockOutlined style={{ color: '#bfbfbf', fontSize: 18 }} />
                                }
                                <Title level={5} style={{ margin: 0, color: superAdminMode ? '#ff4d4f' : undefined }}>
                                    {t("prompts.baseInstructions", "Core System Rules")}
                                </Title>
                            </Flex>
                            <TextArea
                                autoSize={{ minRows: 4 }}
                                value={promptData.base_instructions}
                                onChange={handleChange('base_instructions')}
                                disabled={!superAdminMode}
                                style={{ backgroundColor: superAdminMode ? 'white' : 'transparent' }}
                            />
                        </Card>

                        <Card
                            style={{
                                borderRadius: 8,
                                border: '2px solid #1976d2',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                            }}
                            styles={{ body: { padding: 24 } }}
                        >
                            <Title level={5} style={{ margin: 0, marginBottom: 4, color: '#1976d2' }}>
                                {t("prompts.customInstructions", "Company Specific Instructions")}
                            </Title>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                                {t("prompts.customHelper", "Add your business rules here. (e.g., 'Only extract technical skills, ignore soft skills. Maximum 3 work experiences.')")}
                            </Text>
                            <TextArea
                                autoSize={{ minRows: 6 }}
                                placeholder={t("prompts.customPlaceholder", "Type your specific extraction rules here...")}
                                value={promptData.custom_instructions}
                                onChange={handleChange('custom_instructions')}
                                style={{ backgroundColor: 'white' }}
                            />
                            <Flex justify="flex-end" style={{ marginTop: 16 }}>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSaveCustom}
                                    loading={isSavingCustom}
                                >
                                    {isSavingCustom ? t("common.saving", "Saving...") : t("prompts.saveCustom", "Save Custom Rules")}
                                </Button>
                            </Flex>
                        </Card>

                        <Card
                            style={{
                                borderRadius: 8,
                                backgroundColor: '#1e1e1e',
                            }}
                            styles={{ body: { padding: 24 } }}
                        >
                            <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
                                {superAdminMode
                                    ? <UnlockOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                                    : <LockOutlined style={{ color: '#888', fontSize: 18 }} />
                                }
                                <Title level={5} style={{ margin: 0, color: superAdminMode ? '#ff4d4f' : '#fff' }}>
                                    {t("prompts.jsonSchema", "Strict JSON Schema Anchor")}
                                </Title>
                            </Flex>
                            <TextArea
                                autoSize={{ minRows: 8 }}
                                value={promptData.json_schema}
                                onChange={handleChange('json_schema')}
                                disabled={!superAdminMode}
                                style={{
                                    fontFamily: 'monospace',
                                    color: '#4caf50',
                                    fontSize: '0.9rem',
                                    backgroundColor: '#1e1e1e',
                                    borderColor: '#333',
                                }}
                            />
                        </Card>

                        {superAdminMode && (
                            <Flex justify="center" style={{ marginTop: 16 }}>
                                <Button
                                    type="primary"
                                    danger
                                    size="large"
                                    icon={<SaveOutlined />}
                                    onClick={handleSaveSystem}
                                    loading={isSavingSystem}
                                >
                                    {isSavingSystem ? "Saving System..." : "OVERWRITE CORE SYSTEM LOGIC"}
                                </Button>
                            </Flex>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default PromptPage;
