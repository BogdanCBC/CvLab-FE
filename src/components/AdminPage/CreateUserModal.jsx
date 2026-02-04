import React, { useState } from 'react';
import {
    Modal, Box, Typography, TextField, Button, MenuItem,
    Select, FormControl, InputLabel, Alert, Fade,
    InputAdornment, IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../api';

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
};

const CreateUserModal = ({ open, onClose, onUserCreated }) => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'demo' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleMouseDownPassword = () => setShowPassword(true);
    const handleMouseUpPassword = () => setShowPassword(false);

    const handleSubmit = async () => {
        setErrorMsg('');
        try {
            await api.post('/user', formData);
            setSuccess(true);
            onUserCreated();

            setTimeout(() => {
                setSuccess(false);
                onClose();
                setFormData({ username: '', password: '', role: 'hr' });
                setConfirmPassword('');
            }, 2500);
        } catch (error) {
            const detail = error.response?.data?.detail;
            setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail) || "Error creating user");
        }
    };

    // Validation Logic
    const passwordsMatch = formData.password === confirmPassword && formData.password !== '';
    const isLengthValid = formData.password.length >= 8;
    const isUsernameValid = formData.username.trim() !== '';
    const isButtonDisabled = !passwordsMatch || !isLengthValid || !isUsernameValid || success;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                {success && (
                    <Fade in={success}>
                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
                            User created successfully!
                        </Alert>
                    </Fade>
                )}

                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                <Typography variant="h6" mb={2}>Create New Account</Typography>

                <TextField
                    fullWidth label="Username" margin="normal"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        onMouseLeave={handleMouseUpPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPassword !== '' && !passwordsMatch}
                    helperText={confirmPassword !== '' && !passwordsMatch ? "Passwords do not match" : ""}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={formData.role} label="Role"
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="hr">HR</MenuItem>
                        <MenuItem value="demo">Demo</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                >
                    Create User
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateUserModal;