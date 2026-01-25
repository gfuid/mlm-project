import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext'; // Badge count ke liye
import {
    LayoutDashboard, Users, IndianRupee,
    Network, UserPlus, LogOut, ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
    const { stats } = useAdmin(); // Context se stats uthayein
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
        { name: 'Member List', icon: <Users size={18} />, path: '/admin/members' },
        {
            name: 'Withdrawals',
            icon: <IndianRupee size={18} />,
            path: '/admin/withdrawals',
            badge: stats.pendingWithdrawalsCount // Live badge count
        },
        { name: 'Network Tree', icon: <Network size={18} />, path: '/admin/tree/KARAN1001' },
        { name: 'Add Member', icon: <UserPlus size={18} />, path: '/admin/add-member' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token'); // Security cleanup
        localStorage.removeItem('userInfo');
        navigate('/admin/login');
    };

    return (
        <aside className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col h-screen sticky top-0">
            {/* Branding */}
            <div className="p-8 flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/20">
                    <ShieldCheck className="text-white" size={24} />
                </div>
                <span className="font-black uppercase italic tracking-tighter text-white text-xl">
                    Karan <span className="text-orange-600">Ads</span>
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${location.pathname === item.path
                                ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 italic'
                                : 'text-slate-500 hover:bg-slate-900 hover:text-white font-bold'
                            }`}
                    >
                        <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
                            {item.icon}
                            <span>{item.name}</span>
                        </div>

                        {/* 🚩 Dynamic Badge for Withdrawals */}
                        {item.badge > 0 && (
                            <span className="bg-red-600 text-[10px] font-black px-2 py-0.5 rounded-full text-white animate-pulse">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-6 border-t border-slate-900">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-all border-none"
                >
                    <LogOut size={18} />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;