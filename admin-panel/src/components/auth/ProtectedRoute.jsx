import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            console.log('🔒 Admin ProtectedRoute - Verifying authentication...');

            // ✅ WAIT 300ms for storage to settle (increased from 200ms)
            await new Promise(resolve => setTimeout(resolve, 300));

            try {
                const token = localStorage.getItem("token");
                const userInfoStr = localStorage.getItem("userInfo");

                console.log('Token exists:', !!token);
                console.log('UserInfo exists:', !!userInfoStr);
                console.log('Token preview:', token?.substring(0, 30) + '...');

                if (!token || !userInfoStr) {
                    console.log('❌ Missing credentials - redirecting to login');
                    setIsAuthenticated(false);
                    setIsVerifying(false);
                    return;
                }

                // Parse user info
                let userInfo;
                try {
                    userInfo = JSON.parse(userInfoStr);
                } catch (parseError) {
                    console.error('❌ Failed to parse userInfo:', parseError);
                    localStorage.clear();
                    setIsAuthenticated(false);
                    setIsVerifying(false);
                    return;
                }

                console.log('Parsed user:', userInfo);
                console.log('User role:', userInfo?.role);

                // Verify admin role
                if (userInfo?.role !== 'admin') {
                    console.log('❌ Not an admin - redirecting to login');
                    localStorage.clear();
                    setIsAuthenticated(false);
                    setIsVerifying(false);
                    return;
                }

                console.log('✅ Admin authenticated successfully');
                setIsAuthenticated(true);

            } catch (error) {
                console.error('❌ Auth verification error:', error);
                localStorage.clear();
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
                    <p className="text-white font-black uppercase text-sm tracking-wider animate-pulse">
                        Verifying Master Credentials...
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