import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordField = ({ label, value, onChange, error, helperText, margin = "normal" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDown = () => setShowPassword(true);
    const handleMouseUp = () => setShowPassword(false);

    return (
        <TextField
            fullWidth
            label={label}
            type={showPassword ? 'text' : 'password'}
            margin={margin}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }
            }}
        />
    );
};

export default PasswordField;