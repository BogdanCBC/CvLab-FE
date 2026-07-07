import React, {useEffect, useState} from 'react';
import './Header.scss';
import { Breadcrumb, Button, Select, notification } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { HomeIcon, ShevronRightIcon, PlusIcon } from '../../constants/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UploadCandidateModal from '../Modals/UploadCandidateModal/UploadCandidateModal';
import UploadTextModal from '../Modals/UploadTextModal/UploadTextModal';

const PATH_LABELS = {
    '/candidates': "CV's",
    '/job-description': 'Jobs',
    '/companies': 'Companies',
    '/admin': 'Admin',
    '/match': 'Ai Match',
    '/tracking': 'Tracking candidates',
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
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArchivePage = /^\/tracking\/[^/]+\/archive$/.test(pathname);
  const isTrackingPage = pathname.startsWith('/tracking/') && !isArchivePage;
  const jobId = pathname.startsWith('/tracking/') ? pathname.split('/')[2] : null;

  const matchedPath = Object.keys(PATH_LABELS)
      .filter(key => pathname === key || pathname.startsWith(key + '/'))
      .sort((a, b) => b.length - a.length)[0];
  const pathLabel = PATH_LABELS[matchedPath];
  const activePageTitle = isArchivePage ? t('trackingPage.archivePage.title', 'Archive')
                        : pathLabel === "CV's" ? t('topbar.candidate_cv', "Candidate CVs")
                        : pathLabel === "Jobs" ? t('topbar.job_desc', "Job Descriptions")
                        : pathLabel === "Admin" ? t('topbar.admin', "Admin")
                        : pathLabel === "Ai Match" ? t('topbar.ai_match', "Ai Match")
                        : pathLabel === "Metrics" ? t('topbar.metrics', "Metrics")
                        : pathLabel === "Prompts" ? t('topbar.prompts', "Prompts")
                        : pathLabel === "Profile" ? t('profilePage.title', "Profile")
                        : pathLabel === "Settings" ? t('settingsPage.title', "Settings")
                        : pathLabel === "Companies" ? t('topbar.companies', "Companies")
                        : pathLabel === "Tracking candidates" ? t('trackingPage.title', "Tracking candidates")
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
    ...(isTrackingPage || isArchivePage ? [{ title: <Link to="/job-description">{t('topbar.jobs', 'Jobs')}</Link> }] : []),
    ...(matchedPath === '/metrics' ? [{ title: <Link to="/admin">{t('createusermodal.admin', 'Admin')}</Link> }] : []),
    ...(matchedPath === '/admin/prompts' ? [{ title: <Link to="/admin">{t('createusermodal.admin', 'Admin')}</Link> }] : []),
    ...(isArchivePage
      ? [
          { title: <Link to={`/tracking/${jobId}`}>{t('trackingPage.title', 'Tracking candidates')}</Link> },
          { title: t('trackingPage.archivePage.title', 'Archive') },
        ]
      : [{ title: pathLabel }]
    ),
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
            {pathname === "/companies" && (
                <Button
                    type="primary"
                    className="default-button small"
                    onClick={() => props.setUploadNew(true)}
                >
                    <PlusIcon /> {t("companiesPage.createNew", "Create new companie")}
                </Button>
            )}
            {isTrackingPage && (
                <>
                    <Button
                        className="archive-header-btn"
                        icon={
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.6667 7.5V15.8333C16.6667 16.2754 16.4911 16.6993 16.1785 17.0118C15.866 17.3244 15.4421 17.5 15 17.5H5.00001C4.55798 17.5 4.13406 17.3244 3.82149 17.0118C3.50893 16.6993 3.33334 16.2754 3.33334 15.8333V7.5M8.33334 10H11.6667M1.66667 4.16667C1.66667 3.72464 1.84227 3.30072 2.15483 2.98816C2.46739 2.6756 2.89131 2.5 3.33334 2.5H16.6667C17.1087 2.5 17.5326 2.6756 17.8452 2.98816C18.1577 3.30072 18.3333 3.72464 18.3333 4.16667V5.83333C18.3333 6.27536 18.1577 6.69928 17.8452 7.01184C17.5326 7.3244 17.1087 7.5 16.6667 7.5H3.33334C2.89131 7.5 2.46739 7.3244 2.15483 7.01184C1.84227 6.69928 1.66667 6.27536 1.66667 5.83333V4.16667Z" stroke="#079455" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        }
                        onClick={() => navigate(`/tracking/${jobId}/archive`)}
                    >
                        {t("trackingPage.archive")}
                    </Button>
                    <Button
                        type="primary"
                        className="default-button small"
                        onClick={() => props.setAddCandidateOpen(true)}
                    >
                        {t("trackingPage.addCandidate")}
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
