import React from 'react';
import { Input } from 'antd';

const PasswordField = ({ label, value, onChange, error, helperText }) => {
    return (
        <div style={{ marginBottom: 16 }}>
            {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
            <Input.Password
                value={value}
                onChange={onChange}
                status={error ? 'error' : ''}
            />
            {helperText && (
                <span style={{ color: '#ff4d4f', fontSize: 12 }}>{helperText}</span>
            )}
        </div>
    );
};

export default PasswordField;
