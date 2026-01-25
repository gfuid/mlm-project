import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check karein ki token aur userInfo maujood hai
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Agar token nahi hai ya role 'admin' nahi hai, toh login par bhej dein
    if (!token || userInfo?.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;