import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, Button, Tag, Row, Col, Space, AutoComplete } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import './AdvancedFilters.scss';
import { useTranslation } from 'react-i18next';
import { FilterModalIcon } from '../../../constants/icons';

export default function AdvancedFilters(props) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        skills: [],
        position: '',
        experience: '',
        languages: [],
        certifications: []
    });
    const [skillInput, setSkillInput] = useState("");
    const [yearsInput, setYearsInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");
    const [certificationInput, setCertificationInput] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!props.modalState) return;
        if (props.activeFilters) {
            setFormData({
                skills: props.activeFilters.skills || [],
                position: props.activeFilters.position || '',
                experience: props.activeFilters.experience !== undefined ? props.activeFilters.experience : '',
                languages: props.activeFilters.languages || [],
                certifications: props.activeFilters.certifications || []
            });
        } else {
            setFormData({ skills: [], position: '', experience: '', languages: [], certifications: [] });
            setSkillInput("");
            setYearsInput("");
            setLanguageInput("");
            setCertificationInput("");
        }
    }, [props.modalState, props.activeFilters]);

    useEffect(() => {
        const hasInput =
            formData.position.trim() !== '' ||
            formData.experience !== '' ||
            skillInput.trim() !== '' ||
            yearsInput !== '' ||
            languageInput.trim() !== '' ||
            certificationInput.trim() !== '' ||
            formData.skills.length > 0 ||
            formData.languages.length > 0 ||
            formData.certifications.length > 0;
        setIsValid(hasInput);
    }, [formData, skillInput, yearsInput, languageInput, certificationInput]);

    const handleAddSkill = () => {
        if (skillInput.trim() === "" || yearsInput === "") return;
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { skill: skillInput.trim(), years: parseInt(yearsInput, 10) }]
        }));
        setSkillInput("");
        setYearsInput("");
    };

    const handleDeleteSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        const filterPayload = {
            position: formData.position,
            experience: formData.experience === '' ? undefined : parseInt(formData.experience, 10),
            skills: formData.skills,
            languages: formData.languages,
            certifications: formData.certifications
        };
        props.onApplyFilters(filterPayload);
        setFormData({ skills: [], position: '', experience: '', languages: [], certifications: [] });
        setSkillInput("");
        setYearsInput("");
        setLanguageInput("");
        setCertificationInput("");
    };

    const handleAddToList = (field, value, setter) => {
        if (value.trim() === "") return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }));
        setter("");
    };

    const handleDeleteFromList = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <Modal
            open={props.modalState}
            onCancel={() => props.setModalState(false)}
            title={
                <Space>
                    <span className="af-icon"><FilterModalIcon /> </span>
                    
                    {t('advancedFilters.title')}
                </Space>
            }
            footer={
                <div className="af-footer">
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!isValid}
                        className="default-button"
                        style={{ minWidth : '218px', fontSize: '16px' }}
                    >
                        {t('candidateTable.applyFilters')}
                    </Button>
                    <Button style={{height: '44px', minWidth : '218px', fontSize: '16px', color: '#414651', fontWeight: 600}} onClick={() => props.setModalState(false)}>
                        {t('resetPassword.cancel')}
                    </Button>
                </div>
            }
            width={764}
            className="af-modal"
        >
            <Row gutter={[16, 20]} style={{ marginTop: 16 }}>
                {/* Position */}
                <Col span={12}>
                    <div className="af-field">
                        <label className="af-label">{t('advancedFilters.position')}</label>
                        <Input
                            placeholder={t('advancedFilters.positionPlaceholder')}
                            value={formData.position}
                            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        />
                    </div>
                </Col>

                {/* Experience */}
                <Col span={12}>
                    <div className="af-field">
                        <label className="af-label">{t('advancedFilters.experience')}</label>
                        <AutoComplete
                            style={{ width: '100%' }}
                            placeholder={t('advancedFilters.experienceLevel')}
                            value={formData.experience === '' ? undefined : String(formData.experience)}
                            options={[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => ({
                                value: String(n),
                                label: `${n} ${t('advancedFilters.years')}`
                            }))}
                            filterOption={(input, option) => option.value.startsWith(input)}
                            onChange={(value) => {
                                if (value === '' || value === undefined || /^\d+$/.test(value)) {
                                    setFormData(prev => ({ ...prev, experience: value ?? '' }));
                                }
                            }}
                            allowClear
                        />
                    </div>
                </Col>

                {/* Language */}
                <Col span={12}>
                    <div className="af-field">
                        <label className="af-label">{t('advancedFilters.language')}</label>
                        <Input
                            placeholder={t('advancedFilters.languagePlaceholder')}
                            value={languageInput}
                            onChange={(e) => setLanguageInput(e.target.value)}
                            onPressEnter={() => handleAddToList('languages', languageInput, setLanguageInput)}
                        />
                        {formData.languages.length > 0 && (
                            <div className="af-tags">
                                {formData.languages.map((lang, index) => (
                                    <Tag
                                        key={index}
                                        closable
                                        onClose={() => handleDeleteFromList('languages', index)}
                                    >
                                        {lang}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Certification */}
                <Col span={12}>
                    <div className="af-field">
                        <label className="af-label">{t('advancedFilters.certification')}</label>
                        <Input
                            placeholder={t('advancedFilters.certificationPlaceholder')}
                            value={certificationInput}
                            onChange={(e) => setCertificationInput(e.target.value)}
                            onPressEnter={() => handleAddToList('certifications', certificationInput, setCertificationInput)}
                        />
                        {formData.certifications.length > 0 && (
                            <div className="af-tags">
                                {formData.certifications.map((cert, index) => (
                                    <Tag
                                        key={index}
                                        closable
                                        onClose={() => handleDeleteFromList('certifications', index)}
                                    >
                                        {cert}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Skills */}
                <Col span={24}>
                    <div className="af-field">
                        <label className="af-label">{t('advancedFilters.skills')}</label>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder={t('advancedFilters.skillPlaceholder')}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onPressEnter={handleAddSkill}
                            />
                            <InputNumber
                                placeholder={t('advancedFilters.yearsPlaceholder')}
                                min={0}
                                value={yearsInput === '' ? null : yearsInput}
                                onChange={(v) => setYearsInput(v === null ? '' : v)}
                                style={{ width: 110 }}
                            />
                            <Button icon={<PlusOutlined />} onClick={handleAddSkill} />
                        </Space.Compact>
                        {formData.skills.length > 0 && (
                            <div className="af-tags">
                                {formData.skills.map((s, index) => (
                                    <Tag
                                        key={index}
                                        closable
                                        onClose={() => handleDeleteSkill(index)}
                                    >
                                        {`${s.skill} (${s.years} ${t('advancedFilters.years')})`}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}
