import React, { useState, useEffect } from 'react';
import {
    Box, Typography, FormControl, Select, MenuItem, Card, CardContent,
    TextField, Button, Switch, FormControlLabel, CircularProgress, Alert, Chip, Divider
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SaveIcon from '@mui/icons-material/Save';
import GenericHeader from '../GenericHeader/GenericHeader'; // Adjust path if needed
import api from '../../api'; // Adjust path if needed
import { useTranslation } from "react-i18next";

const PromptPage = ({ setIsLoggedIn }) => {
    const { t } = useTranslation();

    // Check user role (Assume it's stored in local storage from login, adjust if you use a Context)
    const userRole = localStorage.getItem('role') || 'admin';
    const isSuperadmin = userRole === 'superadmin';

    // State
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

    // Fetch data
    const fetchPrompts = async () => {
        setIsLoading(true);
        setNotification({ type: '', message: '' });
        try {
            const response = await api.get(`/prompts/${actionType}`);
            // Ensure null values from DB become empty strings for React controlled inputs
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
    };

    useEffect(() => {
        fetchPrompts();
    }, [actionType]);

    // Handle form input changes
    const handleChange = (field) => (e) => {
        setPromptData({ ...promptData, [field]: e.target.value });
    };

    // Save Client Custom Instructions
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

    // Save Core System Logic (Superadmin Only)
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
        <Box sx={{ backgroundColor: '#f9f9f9', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <GenericHeader setIsLoggedIn={setIsLoggedIn} navigateLocation='/admin' />

            <Box sx={{ mt: 3, px: 4, pb: 4, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {/* Header Row */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            {t("prompts.pageTitle", "Prompt Engineering")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("prompts.pageSubtitle", "Configure AI extraction and matching behaviors")}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={3}>
                        {isSuperadmin && (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={superAdminMode}
                                        onChange={(e) => setSuperAdminMode(e.target.checked)}
                                        color="error"
                                    />
                                }
                                label={
                                    <Typography variant="body2" fontWeight="bold" color={superAdminMode ? "error.main" : "text.secondary"}>
                                        Superadmin Mode
                                    </Typography>
                                }
                            />
                        )}

                        <FormControl size="small" sx={{ minWidth: 220, backgroundColor: 'white', borderRadius: 1 }}>
                            <Select
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                variant="outlined"
                            >
                                <MenuItem value="EXTRACT_CV">Parse CV Data</MenuItem>
                                <MenuItem value="EXTRACT_JD">Parse Job Description</MenuItem>
                                <MenuItem value="MATCH_CANDIDATES">Match Candidates</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {notification.message && (
                    <Alert severity={notification.type} sx={{ mb: 3, borderRadius: 2 }}>
                        {notification.message}
                    </Alert>
                )}

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={3} maxWidth="1200px" margin="0 auto" width="100%">

                        <Box display="flex" justifyContent="flex-end">
                            <Chip
                                label={`Active Version: v${promptData.version}`}
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 'bold', backgroundColor: 'white' }}
                            />
                        </Box>

                        {/* LAYER 1: SYSTEM BASE (Read-only for Admin) */}
                        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 2, backgroundColor: superAdminMode ? '#fff' : '#f5f5f5' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    {superAdminMode ? <LockOpenIcon color="error" /> : <LockIcon color="disabled" />}
                                    <Typography variant="h6" fontWeight="bold" color={superAdminMode ? "error.main" : "text.secondary"}>
                                        {t("prompts.baseInstructions", "Core System Rules")}
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    variant="outlined"
                                    value={promptData.base_instructions}
                                    onChange={handleChange('base_instructions')}
                                    disabled={!superAdminMode}
                                    sx={{ backgroundColor: superAdminMode ? 'white' : 'transparent' }}
                                />
                            </CardContent>
                        </Card>

                        {/* LAYER 2: CLIENT CUSTOM INSTRUCTIONS (Always Editable) */}
                        <Card sx={{ boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)', borderRadius: 2, border: '2px solid #1976d2' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" color="primary.main" mb={1}>
                                    {t("prompts.customInstructions", "Company Specific Instructions")}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {t("prompts.customHelper", "Add your business rules here. (e.g., 'Only extract technical skills, ignore soft skills. Maximum 3 work experiences.')")}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    variant="outlined"
                                    placeholder={t("prompts.customPlaceholder", "Type your specific extraction rules here...")}
                                    value={promptData.custom_instructions}
                                    onChange={handleChange('custom_instructions')}
                                    sx={{ backgroundColor: 'white' }}
                                />
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSaveCustom}
                                        disabled={isSavingCustom}
                                    >
                                        {isSavingCustom ? t("common.saving", "Saving...") : t("prompts.saveCustom", "Save Custom Rules")}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* LAYER 3: JSON SCHEMA (Read-only for Admin, dark mode style) */}
                        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 2, backgroundColor: '#1e1e1e' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    {superAdminMode ? <LockOpenIcon color="error" /> : <LockIcon sx={{ color: '#888' }} />}
                                    <Typography variant="h6" fontWeight="bold" color={superAdminMode ? "error.main" : "#fff"}>
                                        {t("prompts.jsonSchema", "Strict JSON Schema Anchor")}
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={8}
                                    variant="outlined"
                                    value={promptData.json_schema}
                                    onChange={handleChange('json_schema')}
                                    disabled={!superAdminMode}
                                    InputProps={{
                                        sx: {
                                            fontFamily: 'monospace',
                                            color: '#4caf50', // Hacker green code text
                                            fontSize: '0.9rem',
                                            '&.Mui-disabled': {
                                                color: '#4caf50',
                                                WebkitTextFillColor: '#4caf50',
                                            }
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* SUPERADMIN GLOBAL SAVE BUTTON */}
                        {superAdminMode && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveSystem}
                                    disabled={isSavingSystem}
                                >
                                    {isSavingSystem ? "Saving System..." : "OVERWRITE CORE SYSTEM LOGIC"}
                                </Button>
                            </Box>
                        )}

                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PromptPage;