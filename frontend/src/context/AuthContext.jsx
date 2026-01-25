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
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (token && storedUser) {
                // 🚩 1. Pehle local storage se turant user set karo
                setUser(JSON.parse(storedUser));
                setLoading(false); // 🚩 2. Dashboard render hone do

                try {
                    // 🚩 3. Background sync with TIMESTAMP to avoid cache (304 error)
                    const res = await API.get(`/user/dashboard-stats?t=${Date.now()}`);
                    if (res.data.success) {
                        const latestUser = res.data.data;
                        setUser(latestUser);
                        localStorage.setItem("user", JSON.stringify(latestUser));
                        console.log("🚀 Sync Success: ID is Active");
                    }
                } catch (err) {
                    console.error("Auth background sync failed");
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
