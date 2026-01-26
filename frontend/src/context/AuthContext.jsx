import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

// context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // context/AuthContext.jsx
    useEffect(() => {
        // AuthContext.jsx ke loadUser function mein
        const loadUser = async () => {
            // 🚩 Galti yahan thi: token ko pehle localStorage se nikalna padega
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (token && storedUser) {
                try {
                    // 🚩 Ek aur galti fix: JSON.parse sirf ek baar karein
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setLoading(false);

                    // Background sync logic
                    const res = await API.get(`/user/dashboard-stats?t=${Date.now()}`);
                    if (res.data.success) {
                        const latestUser = res.data.data;
                        setUser(latestUser);
                        localStorage.setItem("user", JSON.stringify(latestUser));
                    }
                } catch (err) {
                    console.error("Auth background sync failed", err);
                    // Agar sync fail ho jaye toh loading false rehne dein taaki stored user dikhta rahe
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {/* 🚩 Gatekeeper: Jab tak token hai par user nahi aaya, tab tak app mat dikhao */}
            {(!loading) ? children : (
                <div className="h-screen flex items-center justify-center bg-white">
                    <p className="text-orange-600 font-black italic animate-pulse">SYNCING SECURE NODE...</p>
                </div>
            )}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
