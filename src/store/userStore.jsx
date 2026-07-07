import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        username: '',
        email: '',
        role: '',
        avatarUrl: null,
    });

    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/user/me');
            const data = response.data;
            setUser({
                username: data.username || '',
                email: data.email || '',
                role: data.role || '',
                avatarUrl: data.profile_image_url || null,
            });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used inside UserProvider');
    return ctx;
}
