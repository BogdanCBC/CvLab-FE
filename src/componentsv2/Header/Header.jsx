import React, {useEffect, useState} from 'react';
import './Header.scss';
import { Breadcrumb, Button, Select, notification } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { HomeIcon, ShevronRightIcon, PlusIcon } from '../../constants/icons';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UploadCandidateModal from '../Modals/UploadCandidateModal/UploadCandidateModal';
import UploadTextModal from '../Modals/UploadTextModal/UploadTextModal';

const PATH_LABELS = {
    '/candidates': "CV's",
    '/job-description': 'Jobs',
    '/admin': 'Admin',
    '/match': 'Ai Match',
    '/metrics': 'Metrics',
    '/admin/prompts': 'Prompts',
    '/profile': 'Profile',
    '/settings': 'Settings',
};

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'UK' },
  { value: 'fr', label: 'France' },
];

const Header = (props) => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const matchedPath = Object.keys(PATH_LABELS)
      .filter(key => pathname === key || pathname.startsWith(key + '/'))
      .sort((a, b) => b.length - a.length)[0];
  const pathLabel = PATH_LABELS[matchedPath];
  const activePageTitle = pathLabel === "CV's" ? t('topbar.candidate_cv', "Candidate CVs")
                        : pathLabel === "Jobs" ? t('topbar.job_desc', "Job Descriptions")
                        : pathLabel === "Admin" ? t('topbar.admin', "Admin")
                        : pathLabel === "Ai Match" ? t('topbar.ai_match', "Ai Match")
                        : pathLabel === "Metrics" ? t('topbar.metrics', "Metrics")
                        : pathLabel === "Prompts" ? t('topbar.prompts', "Prompts")
                        : pathLabel === "Profile" ? t('profilePage.title', "Profile")
                        : pathLabel === "Settings" ? t('settingsPage.title', "Settings")
                        : pathLabel;
  const [open, setOpen] = useState(false);
  const [openTextModal, setOpenTextModal] = useState(false);
  const [success, setSuccess] = useState(0);   // number of successfully uploaded CVs
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);

  // Show Ant Design notifications when upload state changes
  useEffect(() => {
    if (success > 0) {
      notification.success({
        message: `${success} CV${success > 1 ? 's' : ''} uploaded successfully`,
        description: 'The data for all candidates is now ready for review.',
        placement: 'topRight',
      });
      setSuccess(0);
    }
  }, [success]);

  useEffect(() => {
    if (warning) {
      notification.warning({
        message: 'Upload completed with warnings',
        description: 'Some files were identified as duplicates.',
        placement: 'topRight',
      });
      setWarning(false);
    }
  }, [warning]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Upload failed',
        description: 'Some files could not be processed. Please try again.',
        placement: 'topRight',
      });
      setError(false);
    }
  }, [error]);

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  const breadcrumbItems = [
    { title: <Link to="/candidates"><HomeIcon /></Link> },
    { title: <Link to="/candidates">{t('topbar.dasboard', 'Dashboard')}</Link> },
    ...(matchedPath === '/match' ? [{ title: <Link to="/job-description">{t('topbar.jobs', 'Jobs')}</Link> }] : []),
    ...(matchedPath === '/metrics' ? [{ title: <Link to="/admin">{t('createusermodal.admin', 'Admin')}</Link> }] : []),
    ...(matchedPath === '/admin/prompts' ? [{ title: <Link to="/admin">{t('createusermodal.admin', 'Admin')}</Link> }] : []),
    { title: pathLabel },
  ];

  return (
    <>
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
            {pathname === "/candidates" && (
                <>
                    <Button
                        type="primary"
                        className="default-button small"
                        onClick={() => setOpen(true)}
                        >
                        {t('topbar.upload', 'Upload PDF')}
                    </Button>
                    <Button
                        type="primary"
                        className="default-button small"
                        onClick={() => setOpenTextModal(true)}
                        >
                        {t('topbar.pasteText', 'Paste Text')}
                    </Button>
                </>
            )}
            {pathname === "/job-description" && (
                <>
                <Button
                    type="primary"
                    className="default-button small"
                    onClick={() => props.setUploadNew(true)}
                    >
                    <PlusIcon /> {t("jdEditMode.createNew")}
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
    <UploadCandidateModal
        modalState={open}
        setModalState={setOpen}
        setSuccess={setSuccess}
        setWarning={setWarning}
        setError={setError}
        candidates={props.candidates}
        setCandidates={props.setCandidates}
    />

    <UploadTextModal
        modalState={openTextModal}
        setModalState={setOpenTextModal}
        setSuccess={setSuccess}
        setWarning={setWarning}
        setError={setError}
        candidates={props.candidates}
        setCandidates={props.setCandidates}
    />
    </>
  );
};

export default Header;
