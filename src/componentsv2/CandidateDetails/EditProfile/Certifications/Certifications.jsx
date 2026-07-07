import React from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Certifications.scss';
import { useTranslation } from "react-i18next";
import { TrashIcon } from '../../../../constants/icons';

export default function Certifications({ profileData, updateCertifications, addCertification, removeCertification }) {
    const { t } = useTranslation();

    return (
        <div className="ep-section">
            <div className="ep-section-header">
                <h2 className="ep-section-title">{t("certifications.certifications")}</h2>
                <Button type="link" icon={<PlusOutlined />} className="add-certification-button" onClick={addCertification}>
                    {t("certifications.addCert")}
                </Button>
            </div>

            <div className="ep-cert-list">
                {profileData.certifications.map((cert, index) => (
                    <div key={index} className="ep-inline-item ep-cert-row">
                        <Input
                            variant="borderless"
                            value={cert || ""}
                            placeholder={t("certifications.enterCert")}
                            onChange={(e) => updateCertifications(index, e.target.value)}
                        />
                        <Button type="text" danger icon={<TrashIcon />} onClick={() => removeCertification(index)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
