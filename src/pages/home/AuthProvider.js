import React, { createContext, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tokenExpirationTime, setTokenExpirationTime] = useState(null);
    const history = useHistory();

    // Giriş yaparken session süresi başlat
    const login = (userData, tokenExpiry) => {
        setUser(userData);
        setTokenExpirationTime(Date.now() + tokenExpiry * 1000); // Expiry süresini milisaniyeye çevir
        localStorage.setItem('tokenExpiry', Date.now() + tokenExpiry * 1000);
    };

    // Çıkış yap fonksiyonu
    const logout = () => {
        setUser(null);
        setTokenExpirationTime(null);
        localStorage.removeItem('tokenExpiry');
        history.push('/login');
    };

    // Oturum süresi dolduğunda otomatik olarak çıkış yap
    useEffect(() => {
        const remainingTime = tokenExpirationTime - Date.now();

        if (remainingTime > 0) {
            const timer = setTimeout(logout, remainingTime);
            return () => clearTimeout(timer); // Bileşen unmounted olduğunda temizle
        } else if (tokenExpirationTime) {
            logout();
        }
    }, [tokenExpirationTime]);

    // Tarayıcı yenilendiğinde oturum süresini kontrol et
    useEffect(() => {
        const storedExpiry = localStorage.getItem('tokenExpiry');
        if (storedExpiry && Date.now() < storedExpiry) {
            setTokenExpirationTime(storedExpiry);
        } else {
            logout();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);