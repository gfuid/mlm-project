import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Users, Wallet, User as UserIcon, Settings, LogOut,
    CheckCircle, Trophy, ArrowRight, TrendingUp, Zap,
    Activity, Target, Award, Crown, Star
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import BillingSection from "../dashboard/BillingSection";
import WithdrawModal from "../dashboard/WithdrawModal";
import IdCardModal from "../dashboard/IdCardModal";
import toast from 'react-hot-toast';
import API from '../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, setUser, loading: authLoading } = useAuth();

    const [stats, setStats] = useState({
        wallet: 0,
        totalTeam: 0,
        activeTeam: 0,
        rank: "Promoter"
    });
    const [loading, setLoading] = useState(true);
    const [isIdCardOpen, setIsIdCardOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    // Auto-sync activation status
    useEffect(() => {
        const forceSyncActivation = async () => {
            try {
                const res = await API.get(`/user/dashboard-stats?t=${Date.now()}`);
                if (res.data.success) {
                    const latestUser = res.data.data;
                    if (JSON.stringify(latestUser) !== localStorage.getItem("user")) {
                        setUser(latestUser);
                        localStorage.setItem("user", JSON.stringify(latestUser));
                    }
                }
            } catch (err) {
                console.error("Auto-Sync Error:", err);
            }
        };

        forceSyncActivation();
        const interval = setInterval(forceSyncActivation, 5000);
        return () => clearInterval(interval);
    }, [setUser]);

    // ✅ FIXED: Fetch dashboard data with tree API fallback
    const fetchDashboardData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token || !user) return navigate("/login");

        try {
            setLoading(true);

            // 🚩 Fetch all data in parallel
            const responses = await Promise.allSettled([
                API.get("/user/dashboard-stats"),
                API.get("/wallet/my-wallet"),
                API.get(`/user/tree/${user.userId}`) // ✅ Get team directly from tree
            ]);

            console.log('📊 All API Responses:', responses);

            // Extract responses
            const statsRes = responses[0].status === 'fulfilled' ? responses[0].value : null;
            const walletRes = responses[1].status === 'fulfilled' ? responses[1].value : null;
            const treeRes = responses[2].status === 'fulfilled' ? responses[2].value : null;

            console.log('Stats API:', statsRes?.data);
            console.log('Wallet API:', walletRes?.data);
            console.log('Tree API:', treeRes?.data);

            // ✅ Calculate team from TREE (most reliable)
            let totalTeam = 0;
            let activeTeam = 0;

            if (treeRes?.data?.success && treeRes?.data?.data) {
                const flattenTree = (node, list = []) => {
                    if (node.children && node.children.length > 0) {
                        node.children.forEach(child => {
                            list.push({
                                userId: child.userId,
                                name: child.name,
                                isActive: child.isActive
                            });
                            flattenTree(child, list);
                        });
                    }
                    return list;
                };

                const teamList = flattenTree(treeRes.data.data);
                totalTeam = teamList.length;
                activeTeam = teamList.filter(m => m.isActive).length;

                console.log('✅ Team Count from Tree:', {
                    totalTeam,
                    activeTeam,
                    teamList
                });
            } else {
                console.warn('⚠️ Tree API failed, trying stats API...');

                // Fallback to stats API
                const data = statsRes?.data?.data;
                if (data) {
                    totalTeam = data.totalTeam || data.totalMembers || data.teamCount || 0;
                    activeTeam = data.activeTeam || data.activeMembers || 0;
                }
            }

            // ✅ Get rank
            const rank = statsRes?.data?.data?.rank
                || statsRes?.data?.data?.level
                || user?.rank
                || "Promoter";

            // ✅ Get wallet balance
            let wallet = 0;
            if (walletRes?.data?.success) {
                wallet = walletRes.data.balance || walletRes.data.data?.balance || 0;
            } else if (statsRes?.data?.data?.wallet) {
                wallet = statsRes.data.data.wallet;
            }

            // ✅ Update state
            setStats({
                totalTeam,
                activeTeam,
                rank,
                wallet
            });

            console.log('✅ Final Stats:', { totalTeam, activeTeam, rank, wallet });

        } catch (err) {
            console.error('❌ Dashboard data fetch error:', err);
            console.error('❌ Error details:', err.response?.data);

            if (err.response?.status !== 403) {
                toast.error('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleCopyLink = () => {
        if (!user?.isActive) {
            toast.error("Activate your ID to start referring!");
            return;
        }
        const referralUrl = `${window.location.origin}/register?ref=${user.userId}`;
        navigator.clipboard.writeText(referralUrl);
        toast.success("Referral Link Copied!");
    };

    if (authLoading || !user) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                        <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 animate-pulse" size={32} />
                    </div>
                    <p className="font-black text-white mt-6 text-xl uppercase tracking-wider animate-pulse">
                        Loading Dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 font-sans">
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Premium Header */}
                <header className="bg-white/80 backdrop-blur-xl border border-white/20 px-8 py-6 flex justify-between items-center sticky top-4 z-50 shadow-2xl shadow-slate-900/5 rounded-3xl mb-8 animate-in slide-in-from-top duration-700">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black shadow-2xl shadow-orange-500/50">
                                <Crown size={28} className="animate-bounce" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight leading-none bg-gradient-to-r from-slate-900 via-orange-600 to-slate-900 bg-clip-text text-transparent">
                                Karan Ads
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                <Star size={10} className="text-orange-500" />
                                Premium Member Dashboard
                                <Star size={10} className="text-orange-500" />
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status Badge */}
                        <div className={`relative px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase flex items-center gap-3 transition-all duration-500 ${user?.isActive
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400/50 text-white shadow-2xl shadow-green-500/30'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 border-red-400/50 text-white shadow-2xl shadow-red-500/30'
                            }`}>
                            <div className={`w-3 h-3 rounded-full ${user?.isActive ? 'bg-white animate-pulse' : 'bg-white'} shadow-lg`}></div>
                            {user?.isActive ? (
                                <>
                                    <Zap size={16} className="animate-pulse" />
                                    Account Active
                                </>
                            ) : (
                                '⏳ Activation Pending'
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="group relative">
                            <button className="flex items-center gap-4 bg-white/80 hover:bg-white p-2 pr-5 rounded-2xl border-2 border-slate-200 hover:border-orange-300 transition-all shadow-lg hover:shadow-2xl hover:shadow-orange-500/20">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
                                    <UserIcon size={22} />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-black uppercase">{user?.name}</p>
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">ID: {user?.userId}</p>
                                </div>
                                <Settings size={16} className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                            </button>

                            <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] overflow-hidden animate-in slide-in-from-top-2">
                                <div className="p-8 bg-gradient-to-br from-slate-50 to-orange-50 border-b-2 border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account Overview</p>
                                    <p className="text-lg font-black uppercase">{user?.email}</p>
                                </div>
                                <div className="p-5 space-y-2">
                                    <Link to="/update-kyc" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 text-slate-700 hover:text-white transition-all group/item shadow-sm hover:shadow-lg">
                                        <CheckCircle size={18} className="group-hover/item:scale-110 transition-transform" />
                                        <span className="text-xs font-black uppercase">Verify KYC Info</span>
                                    </Link>
                                    <button
                                        onClick={() => { localStorage.clear(); navigate("/login"); }}
                                        className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 text-slate-700 hover:text-white transition-all group/item shadow-sm hover:shadow-lg"
                                    >
                                        <LogOut size={18} className="group-hover/item:scale-110 transition-transform" />
                                        <span className="text-xs font-black uppercase">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Premium Referral Link Section */}
                <div className={`relative p-8 rounded-3xl border-2 transition-all mb-8 overflow-hidden animate-in slide-in-from-bottom duration-700 ${user?.isActive
                    ? 'bg-gradient-to-br from-white via-orange-50 to-white border-orange-200 shadow-2xl shadow-orange-500/10'
                    : 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-300 opacity-70'
                    }`}>
                    {/* Animated Border Glow */}
                    {user?.isActive && (
                        <div className="absolute inset-0 rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 opacity-20 blur-xl animate-pulse"></div>
                        </div>
                    )}

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-xl shadow-orange-500/30">
                                <Target className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl uppercase tracking-tight">Your Referral Link</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Share & Earn Rewards</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className={`flex-1 w-full p-5 rounded-2xl border-2 font-mono text-sm truncate transition-all ${user?.isActive
                                ? 'bg-white border-orange-200 text-orange-600 shadow-inner'
                                : 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed'
                                }`}>
                                {user?.isActive
                                    ? `${window.location.origin}/register?ref=${user.userId}`
                                    : "🔒 ACTIVATE YOUR ID TO UNLOCK"}
                            </div>
                            <button
                                disabled={!user?.isActive}
                                onClick={handleCopyLink}
                                className={`px-10 py-5 rounded-2xl font-black text-sm uppercase transition-all shadow-xl relative overflow-hidden group ${user?.isActive
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 hover:scale-105 active:scale-95'
                                    : 'bg-slate-400 text-slate-600 cursor-not-allowed'
                                    }`}
                            >
                                {user?.isActive && (
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                )}
                                <span className="relative flex items-center gap-2">
                                    {user?.isActive ? (
                                        <>
                                            <Activity size={18} className="animate-pulse" />
                                            Copy Link
                                        </>
                                    ) : (
                                        '🔒 Locked'
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ultra-Premium Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Team Card */}
                    <Link
                        to="/my-team"
                        className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white hover:scale-105 transition-all duration-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 overflow-hidden animate-in slide-in-from-left duration-700"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl">
                                    <Users size={36} className="opacity-90" />
                                </div>
                                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-90 mb-2 flex items-center gap-2">
                                <Star size={14} /> My Team Network
                            </p>
                            <p className="text-5xl font-black mb-3 tracking-tight">{stats.totalTeam}</p>
                            <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                {stats.activeTeam} Active Members
                            </div>
                        </div>
                    </Link>

                    {/* Levels Card */}
                    <Link
                        to="/levels"
                        className="group relative bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-3xl p-8 text-white hover:scale-105 transition-all duration-500 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 overflow-hidden animate-in slide-in-from-bottom duration-700"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl">
                                    <Trophy size={36} className="opacity-90 animate-bounce" style={{ animationDuration: '3s' }} />
                                </div>
                                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-90 mb-2 flex items-center gap-2">
                                <Award size={14} /> Achievement Rank
                            </p>
                            <p className="text-5xl font-black mb-3 tracking-tight">{stats.rank}</p>
                            <p className="text-sm font-bold opacity-90">
                                View All Rewards →
                            </p>
                        </div>
                    </Link>

                    {/* Wallet Card */}
                    <div className="group relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 overflow-hidden animate-in slide-in-from-right duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl">
                                    <Wallet size={36} className="opacity-90" />
                                </div>
                                <TrendingUp size={24} className="opacity-90 animate-pulse" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-90 mb-2 flex items-center gap-2">
                                <Zap size={14} className="animate-pulse" /> Wallet Balance
                            </p>
                            <p className="text-5xl font-black mb-4 tracking-tight">₹{stats.wallet.toLocaleString()}</p>
                            <button
                                onClick={() => setIsWithdrawModalOpen(true)}
                                className="w-full px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-2xl text-sm font-black uppercase transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                            >
                                💸 Withdraw Money
                            </button>
                        </div>
                    </div>
                </div>

                {/* Member Profile & Billing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700">
                    {/* Member Profile */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-slate-100 hover:shadow-3xl transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-xl">
                                <Crown className="text-white" size={24} />
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tight">Member Profile</h3>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl text-white p-8 mb-6 shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-black uppercase tracking-tight relative">{user?.name}</h2>
                            <p className="text-sm opacity-90 font-bold mt-2 relative">USER ID: {user?.userId}</p>
                        </div>
                        <button
                            onClick={() => setIsIdCardOpen(true)}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-sm uppercase rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                        >
                            🎫 View Digital ID Card
                        </button>
                    </div>

                    {/* Billing Section */}
                    <BillingSection user={user} />
                </div>
            </div>

            {/* Modals */}
            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                balance={stats.wallet}
                onWithdraw={async (modalData) => {
                    try {
                        const dataToSend = {
                            amount: Number(modalData.amount),
                            paymentDetails: modalData.upiId || "Not Provided",
                            accountHolderName: user.bankDetails?.accountHolderName || user.bankDetails?.holderName || "N/A"
                        };

                        const res = await API.post("/wallet/withdraw", dataToSend);

                        if (res.data.success) {
                            toast.success("Request Pending!");
                            setIsWithdrawModalOpen(false);
                            fetchDashboardData();
                        }
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Withdrawal failed");
                    }
                }}
            />

            <IdCardModal
                isOpen={isIdCardOpen}
                onClose={() => setIsIdCardOpen(false)}
                user={user}
            />

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;