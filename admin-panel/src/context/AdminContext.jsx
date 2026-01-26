import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        businessVolume: 0,
        todayJoinings: 0,
        activeIds: 0,
        inactiveIds: 0,
        pendingWithdrawalsCount: 0,
        pendingWithdrawals: [],
        chartData: []
    });

    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // 🔄 Data sync function
    const refreshAdminData = useCallback(async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching admin data...');

            // Check if user is authenticated
            const token = localStorage.getItem("token");
            const userInfoStr = localStorage.getItem("userInfo");

            if (!token || !userInfoStr) {
                console.log('❌ No auth credentials found');
                return;
            }

            const userInfo = JSON.parse(userInfoStr);
            if (userInfo?.role !== 'admin') {
                console.log('❌ User is not admin');
                return;
            }

            // Fetch full stats
            const res = await API.get("/admin/full-stats");
            console.log('✅ Admin data response:', res.data);

            if (res.data?.success) {
                const d = res.data.data;
                setStats({
                    totalMembers: d.totalMembers || 0,
                    businessVolume: d.businessVolume || 0,
                    todayJoinings: d.todayJoinings || 0,
                    activeIds: d.activeIds || 0,
                    inactiveIds: d.inactiveIds || 0,
                    chartData: d.chartData || [],
                    pendingWithdrawals: d.pendingWithdrawals || [],
                    pendingWithdrawalsCount: d.pendingWithdrawalsCount || 0,
                    pendingPayouts: d.pendingPayouts || 0
                });
                setLastUpdated(new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }));
                console.log('✅ Stats updated successfully');
            }
        } catch (err) {
            console.error('❌ Admin data fetch error:', err);

            // Handle 401/403 errors (unauthorized)
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log('🚫 Unauthorized - clearing credentials');
                localStorage.clear();
                toast.error('Session expired. Please login again.');
                window.location.href = '/admin/login';
            } else {
                toast.error('Failed to fetch admin data');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-fetch when admin logs in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userInfoStr = localStorage.getItem("userInfo");

        if (token && userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                if (userInfo?.role === 'admin') {
                    console.log('🔐 Admin authenticated, fetching data...');
                    // Wait a bit for everything to settle
                    setTimeout(() => {
                        refreshAdminData();
                    }, 500);
                }
            } catch (error) {
                console.error('Error parsing userInfo:', error);
            }
        }
    }, [refreshAdminData]);

    // 🐛 Debug mode - Expose state to window for testing
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            window.__ADMIN_DEBUG__ = { stats, loading, lastUpdated };
            window.__ADMIN_REFRESH__ = refreshAdminData;
            console.log('🐛 Admin debug mode enabled. Use window.__ADMIN_DEBUG__ and window.__ADMIN_REFRESH__()');
        }
    }, [stats, loading, lastUpdated, refreshAdminData]);

    const value = { stats, loading, lastUpdated, refreshAdminData };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook for easy access
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};