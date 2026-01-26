import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            console.log('🔒 Admin ProtectedRoute - Verifying authentication...');

            // ✅ WAIT 200ms for storage to settle
            await new Promise(resolve => setTimeout(resolve, 200));

            try {
                const token = localStorage.getItem("token");
                const userInfoStr = localStorage.getItem("userInfo");

                console.log('Token exists:', !!token);
                console.log('UserInfo exists:', !!userInfoStr);

                if (!token || !userInfoStr) {
                    console.log('❌ Missing credentials - redirecting to login');
                    setIsAuthenticated(false);
                    setIsVerifying(false);
                    return;
                }

                // Parse user info
                const userInfo = JSON.parse(userInfoStr);
                console.log('Parsed user role:', userInfo?.role);

                // Verify admin role
                if (userInfo?.role !== 'admin') {
                    console.log('❌ Not an admin - redirecting to login');
                    setIsAuthenticated(false);
                    setIsVerifying(false);
                    return;
                }

                console.log('✅ Admin authenticated successfully');
                setIsAuthenticated(true);

            } catch (error) {
                console.error('❌ Auth verification error:', error);
                setIsAuthenticated(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyAuth();
    }, []);

    // Show loading while verifying
    if (isVerifying) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-black uppercase text-sm tracking-wider">
                        Verifying Credentials...
                    </p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        console.log('🚫 Redirecting to admin login...');
        return <Navigate to="/admin/login" replace />;
    }

    // Allow access
    return children;
};

export default ProtectedRoute;