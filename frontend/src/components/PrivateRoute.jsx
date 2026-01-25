import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; //

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth(); //

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-slate-400">Verifying Node...</div>;
    }

    // Agar user login nahi hai, toh use login page par bhej do
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;