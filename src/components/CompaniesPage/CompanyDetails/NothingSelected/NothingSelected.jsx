import React from "react";
import { Button, Typography, Space } from "antd";
import { InfoIcon, PlusCircleIconWhite } from "../../../../constants/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

export default function NothingSelected({ setUploadNew }) {
    const { t } = useTranslation();

    return (
        <div
            style={{
                height: "100%",
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Space orientation="vertical" align="center" size="middle">
                <InfoIcon />
                <Title level={5} style={{ margin: 0 }}>
                    {t("companiesNothingSelected.message", "No company was selected")}
                </Title>
                <Text type="secondary">{t("companiesNothingSelected.createNew", "Create a new one?")}</Text>
                <Button
                    type="primary"
                    className="default-button small"
                    icon={<PlusCircleIconWhite />}
                    onClick={() => setUploadNew(true)}
                    style={{ marginTop: 8 }}
                >
                    {t("companiesPage.createNew", "Create new companie")}
                </Button>
            </Space>
        </div>
    );
}
