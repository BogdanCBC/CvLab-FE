import React, {useEffect, useState} from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const GenericHeader = ({ setIsLoggedIn, navigateLocation }) => {
    const [logo, setLogo] = useState(require('../../images/logov2.png'));
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('username');

        if (storedUser === 'rgis') {
            setLogo(require('../../images/rgis.png'));
        } else {
            setLogo(require('../../images/logov2.png'));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 40px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gridColumn: '1 / -1'
        }}>
            <img src={logo} alt='logo' style={{ maxHeight: '100px' }} />
            <Box display="flex" gap={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(navigateLocation)}
                    variant="outlined"
                >
                    Back
                </Button>
                <Button
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    variant="outlined"
                    color="error"
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
};

export default GenericHeader;