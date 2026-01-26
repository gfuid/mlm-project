import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from '../api/axios'; // 🚩 Centralized API instance
import { toast } from 'react-hot-toast';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // 📊 Sabhi zaroori stats ka initial state
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

    // 🔄 Data sync karne ka main function
    const refreshAdminData = useCallback(async () => {
        try {
            setLoading(true);
            // Backend se full stats fetch karein
            const res = await API.get("/admin/full-stats");

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
                    // 🚩 Ye count Sidebar ke notification badge ke liye hai
                    pendingWithdrawalsCount: d.pendingWithdrawalsCount || 0
                });
                setLastUpdated(new Date().toLocaleTimeString());
            }
        } catch (err) {

            // Agar token expire ho jaye toh admin ko logout karwa sakte hain
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔐 Auto-fetch jab admin login ho
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) refreshAdminData();
    }, [refreshAdminData]);

    const value = { stats, loading, lastUpdated, refreshAdminData };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook for easy access
export const useAdmin = () => useContext(AdminContext);