import React from 'react';
import './Header.scss';
import { Breadcrumb, Button, Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { HomeIcon, ShevronRightIcon, PlusIcon } from '../../constants/icons';
import { useActivePage, PAGES } from '../../store/activePageStore';
import { useTranslation } from 'react-i18next';

const PAGE_LABELS = {
    [PAGES.CV]: "CV's",
    [PAGES.JOB_DESCRIPTION]: 'Jobs',
    [PAGES.ADMIN]: 'Admin',
};

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'UK' },
  { value: 'fr', label: 'France' },
];

const Header = () => {
  const { activePage } = useActivePage();
  const { t, i18n } = useTranslation();
  const activePageTitle = PAGE_LABELS[activePage] === "CV's" ? t('topbar.candidate_cv', "Candidate CVs") 
                        : PAGE_LABELS[activePage] === "Jobs" ? t('topbar.job_desc', "Job Descriptions") 
                        : PAGE_LABELS[activePage] === "Admin" ? t('topbar.admin', "Admin") : PAGE_LABELS[activePage];

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  const breadcrumbItems = [
    { title: <HomeIcon /> },
    { title: t('topbar.dasboard', 'Dashboard') },
    { title: PAGE_LABELS[activePage] },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="breadcrumbs-container">
          <Breadcrumb
           separator={<ShevronRightIcon />}
           items={breadcrumbItems} />
        </div>
        <div className="header-content">
            <div className="left">
                <span className="header-title">{activePageTitle}</span>
            </div>
            <div className="right">
            {activePage === PAGES.CV && (
                <>
                    <Button
                        type="primary"
                        className="default-button small"
                        >
                        {t('topbar.upload', 'Upload PDF')}
                    </Button>
                    <Button
                        type="primary"
                        className="default-button small"
                        >
                        {t('topbar.pasteText', 'Paste Text')}
                    </Button>
                </>
            )}
            {activePage === PAGES.JOB_DESCRIPTION && (
                <>
                <Button
                    type="primary"
                    className="default-button small"
                    >
                    <PlusIcon /> {t("jdTopBar.uploadNew")}
                </Button>
                </>
            )}
            <Select
                value={i18n.language?.startsWith('fr') ? 'fr' : 'en'}
                onChange={handleLanguageChange}
                options={LANGUAGE_OPTIONS}
                prefix={<GlobalOutlined />}
                style={{ width: 110 }}
            />
            </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
