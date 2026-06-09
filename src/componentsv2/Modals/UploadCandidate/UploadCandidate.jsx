import React, { useState } from 'react';
import { Button, Progress, Input } from 'antd';
import {
  DeleteOutlined,
  CheckCircleFilled,
  SyncOutlined,
  WarningFilled,
  CloseCircleFilled,
  PlusOutlined,
  FilePdfFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './UploadCandidate.css';

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function UploadCandidate({ fileData, onDescriptionChange, onRemove, onKeepDuplicate, onDeleteDuplicate }) {
  const { id, fileName, file, additionalInfo, progress, status } = fileData;
  const { t } = useTranslation();
  const [showDesc, setShowDesc] = useState(false);

  const isLoading   = status === 'loading';
  const isDone      = ['done', 'success', 'kept'].includes(status);
  const isError     = status === 'error';
  const isDuplicate = status === 'duplicate';
  const isPending   = status === 'pending';

  const strokeColor = isDone
    ? '#52c41a'
    : isError
    ? '#ff4d4f'
    : isDuplicate
    ? '#faad14'
    : '#1677ff';

  const renderStatusMeta = () => {
    if (!progress) return null;
    let icon = null;
    if (isLoading)   icon = <SyncOutlined spin style={{ color: '#1677ff', fontSize: 12 }} />;
    if (isDone)      icon = <CheckCircleFilled style={{ color: '#52c41a', fontSize: 12 }} />;
    if (isError)     icon = <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 12 }} />;
    if (isDuplicate) icon = <WarningFilled style={{ color: '#faad14', fontSize: 12 }} />;
    return (
      <span className="uc-meta-status">
        {icon}
        <span style={{ fontSize: 12, color: strokeColor }}>{progress}%</span>
      </span>
    );
  };

  // Show "Add additional info" button for pending (before upload) and done (after)
  const showAddInfoBtn = isPending || isDone;

  return (
    <div className="uc-item">
      <div className="uc-row">
        {/* PDF thumbnail */}
        <div className="uc-pdf-thumb">
          <FilePdfFilled />
          <span>PDF</span>
        </div>

        {/* File info */}
        <div className="uc-body">
          <span className="uc-name">{fileName}</span>
          <div className="uc-meta">
            {file && <span className="uc-size">{formatFileSize(file.size)}</span>}
            {renderStatusMeta()}
          </div>
          {(isLoading || isDone) && progress > 0 && (
            <Progress
              percent={progress}
              showInfo={false}
              size="small"
              strokeColor={strokeColor}
              trailColor="#f5f5f5"
              style={{ margin: '4px 0 0 0' }}
            />
          )}
        </div>
        {/* Expandable description input */}
      {showDesc && (
        <div className="uc-desc">
          <Input
            placeholder={t('uploadCandidate.addDescription') || 'Additional info...'}
            defaultValue={additionalInfo}
            size="small"
            onBlur={(e) => onDescriptionChange(id, e.target.value)}
            autoFocus
          />
        </div>
      )}

        {/* Right actions */}
        <div className="uc-actions">
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onRemove(id)}
          />
          {showAddInfoBtn && !showDesc && (
            <button
              type="button"
              className="uc-add-info"
              onClick={() => setShowDesc((v) => !v)}
            >
              <PlusOutlined />
              {t('uploadCandidate.addDescription') || 'Add additional info'}
            </button>
          )}
        </div>
      </div>

      

      {/* Duplicate resolution buttons */}
      {isDuplicate && (
        <div className="uc-dup-actions">
          <Button
            size="small"
            type="primary"
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => onKeepDuplicate(id)}
          >
            {t('uploadCandidate.keepDuplicates')}
          </Button>
          <Button size="small" danger onClick={() => onDeleteDuplicate(id)}>
            {t('uploadCandidate.deleteDuplicates')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploadCandidate;
