import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== "undefined") {
            setUser(JSON.parse(savedUser));
        } else {
            setUser(null);
        }
        setIsMenuOpen(false); // Page change hone par menu close kar dein
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    // Helper to check active link
    const isActive = (path) => location.pathname === path ? "text-orange-600 font-bold" : "text-gray-600";

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-orange-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* 1. Logo Section */}
                <Link to="/" className="flex items-center gap-2 no-underline group">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">K</div>
                    <div className="flex flex-col text-gray-900 font-black tracking-tight">
                        <span className="leading-none">KARAN</span>
                        <span className="text-[10px] text-orange-500 uppercase tracking-widest">Ad Agency</span>
                    </div>
                </Link>

                {/* 2. Desktop Navigation (Public Links) */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`${isActive('/')} no-underline hover:text-orange-500 transition-colors text-sm font-semibold uppercase tracking-wide`}>Home</Link>
                    <Link to="/about" className={`${isActive('/about')} no-underline hover:text-orange-500 transition-colors text-sm font-semibold uppercase tracking-wide`}>About</Link>
                    <Link to="/services" className={`${isActive('/services')} no-underline hover:text-orange-500 transition-colors text-sm font-semibold uppercase tracking-wide`}>Services</Link>
                    <Link to="/membership" className={`${isActive('/membership')} no-underline hover:text-orange-500 transition-colors text-sm font-semibold uppercase tracking-wide`}>Membership</Link>
                </nav>

                {/* 3. Action Buttons / User Profile */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full no-underline font-bold text-xs hover:bg-orange-100 transition-all border border-orange-200"
                            >
                                <LayoutDashboard size={14} />
                                DASHBOARD
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="hidden sm:block text-gray-700 no-underline font-bold text-sm hover:text-orange-600 transition-colors px-4">Login</Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-orange-500 text-white rounded-full no-underline font-bold text-sm shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all"
                            >
                                JOIN US
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* 4. Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-orange-50 p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    <Link to="/" className="text-gray-700 no-underline font-bold py-2 border-b border-gray-50">Home</Link>
                    <Link to="/about" className="text-gray-700 no-underline font-bold py-2 border-b border-gray-50">About</Link>
                    <Link to="/services" className="text-gray-700 no-underline font-bold py-2 border-b border-gray-50">Services</Link>
                    <Link to="/membership" className="text-gray-700 no-underline font-bold py-2 border-b border-gray-50">Membership</Link>
                    {user && <Link to="/dashboard" className="text-orange-600 no-underline font-bold py-2">My Dashboard</Link>}
                </div>
            )}
        </header>
    );
};

export default Header;
