import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            // ✅ If no token or user, just stop loading
            if (!token || !storedUser) {
                setLoading(false);
                return;
            }

            try {
                // ✅ Parse and set user immediately (instant UI load)
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setLoading(false);

                // ✅ Background sync to get latest data
                const res = await API.get(`/user/dashboard-stats?t=${Date.now()}`);

                if (res.data.success) {
                    const latestUser = res.data.data;
                    setUser(latestUser);
                    localStorage.setItem("user", JSON.stringify(latestUser));
                }

            } catch (err) {
                console.error("❌ Auth sync failed:", err);

                // ✅ Handle 401 (token expired/invalid)
                if (err.response?.status === 401) {
                    console.log("🚨 Token invalid - clearing session");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }

                // ✅ Always stop loading, even on error
                setLoading(false);
            }
        };

        loadUser();
    }, []); // ✅ Empty dependency array - runs once on mount

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {!loading ? children : (
                <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-slate-50">
                    <div className="text-center">
                        {/* Logo Animation */}
                        <div className="relative mb-8">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/20 animate-pulse">
                                <span className="text-4xl font-black text-white italic">K</span>
                            </div>
                            {/* Orbiting dots */}
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                                <div className="w-2 h-2 bg-orange-600 rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                            </div>
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                                <div className="w-2 h-2 bg-slate-900 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                            </div>
                        </div>

                        {/* Company Name */}
                        <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic mb-2">
                            KARAN <span className="text-orange-600">ADS</span>
                        </h1>

                        {/* Loading Text */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                                Syncing Secure Node
                            </p>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
                        </div>

                        {/* Loading Bar */}
                        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
                            <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-wider">Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                <span className="text-[9px] font-black uppercase tracking-wider">Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                <span className="text-[9px] font-black uppercase tracking-wider">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);