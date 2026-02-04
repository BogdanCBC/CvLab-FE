import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Alert, Fade } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import api from '../../api';
import PasswordField from './PasswordField';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ResetPasswordModal = ({ open, onClose, targetUser }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');


    const handleReset = async () => {
        setErrorMsg('');
        try {
            await api.patch('/user/password', {
                username: targetUser.username,
                new_password: newPassword
            });

            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');

            // Auto-close modal after success feedback
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2500);

        } catch (error) {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
            setErrorMsg(message || "Error updating password");
        }
    };

    const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
    const isLengthValid = newPassword.length >= 8;
    const isButtonDisabled = !passwordsMatch || !isLengthValid || success;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                {/* Feedback Alerts */}
                {success && (
                    <Fade in={success}>
                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
                            Password updated successfully!
                        </Alert>
                    </Fade>
                )}

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                )}

                <Typography variant="h6" mb={1}>Reset Password</Typography>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Changing password for user: <strong>{targetUser?.username}</strong>
                </Typography>

                {/* Primary Password Input */}
                <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {/* Confirmation Password Input with Error Feedback */}
                <PasswordField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPassword !== '' && !passwordsMatch}
                    helperText={confirmPassword !== '' && !passwordsMatch ? "Passwords do not match" : ""}
                />

                <Box display="flex" gap={2} mt={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        disabled={success}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                        disabled={isButtonDisabled}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ResetPasswordModal;