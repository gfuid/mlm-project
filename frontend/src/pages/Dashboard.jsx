import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Dashboard.jsx ke top imports check karein
import {
    Trophy,
    Lock,
    CheckCircle,
    Users,
    Wallet,
    User as UserIcon,
    Download,
    Copy,
    Share2,
    Settings,
    LogOut // ✅ Ye line dhyan se check karein
} from "lucide-react";
import ReferralTree from "../dashboard/ReferralTree";
import WithdrawModal from "../dashboard/WithdrawModal";
import IdCardModal from "../dashboard/IdCardModal";
import { Link } from "react-router-dom";
// Dashboard.jsx ke top par add karein
import { useAuth } from '../context/AuthContext'; // 👈 Check karein path sahi ho
import BillingSection from "../dashboard/BillingSection"; //
import toast from 'react-hot-toast'; // 👈 Ye line top par honi chahiye
import API from '../api/axios'; // 🚩 API instance import karein

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, setUser, loading: authLoading } = useAuth();

    const [stats, setStats] = useState({ wallet: 0, totalTeam: 0, rank: "Promoter" });
    const [teamList, setTeamList] = useState([]);
    const [recursiveTree, setRecursiveTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("list");
    const [isIdCardOpen, setIsIdCardOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    // ✅ 1. WALLET CALCULATION FIX
    // Agar per active member 500 milne hain, toh hum teamList se active count nikal rahe hain

    const displayWallet = stats.wallet || 0;

    // 🛡️ SECURITY CHECK: Latest status from Database
    // Dashboard.jsx ke useEffect mein ye badlaav karein
    // Dashboard.jsx ke useEffect mein ye badlaav karein
    useEffect(() => {
        const forceSyncActivation = async () => {
            try {
                // ✅ Bypass browser cache with timestamp
                const res = await API.get(`/user/dashboard-stats?t=${Date.now()}`);
                if (res.data.success) {
                    const latestUser = res.data.data;

                    // 🔄 Sync only if data has changed to prevent infinite loops
                    if (JSON.stringify(latestUser) !== localStorage.getItem("user")) {
                        setUser(latestUser);
                        localStorage.setItem("user", JSON.stringify(latestUser));
                        console.log("🚀 Live Sync: ID is", latestUser.isActive ? "ACTIVE" : "PENDING");
                    }
                }
            } catch (err) {
                console.error("Auto-Sync Error:", err);
            }
        };

        forceSyncActivation();
        const interval = setInterval(forceSyncActivation, 5000);
        return () => clearInterval(interval);
    }, [setUser]); // Sirf setUser dependency rakhein

    // Dashboard.jsx ke andar handleCopyLink ko aise update karein
    const handleCopyLink = () => {
        if (!user?.isActive) {
            toast.error("Activate your ID to start referring!");
            return;
        }
        // window.location.origin apne aap http://localhost:5173 utha lega
        const referralUrl = `${window.location.origin}/register?ref=${user.userId}`;

        navigator.clipboard.writeText(referralUrl);
        toast.success("Referral Link Copied!");
    };


    const levelsData = [
        { lv: 1, rank: "Promoter", target: 3, income: 1500, reward: "Starter Pack" },
        { lv: 2, rank: "City Manager", target: 9, income: 3000, reward: "Manager Badge" },
        { lv: 3, rank: "Distt. Manager", target: 27, income: 9000, reward: "Distt. Manager Medal" },
        { lv: 4, rank: "State Manager", target: 81, income: 27000, reward: "State Manager Medal" },
        { lv: 5, rank: "National Head", target: 243, income: 81000, reward: "National Head Medal" },
        { lv: 6, rank: "Boss Medal", target: 729, income: 243000, reward: "📺 Smart LED TV" },
        { lv: 7, rank: "Karan Medal", target: 2187, income: 729000, reward: "🛵 Honda Activa" },
        { lv: 8, rank: "Arjun Medal", target: 6561, income: 2187000, reward: "🏍️ Royal Enfield Bullet" },
        { lv: 9, rank: "Gold Medal", target: 19684, income: 6561500, reward: "🛡️ Pension Plan (10L Fund)" },
        { lv: 10, rank: "Hero No. 1", target: 59049, income: 19684500, reward: "🏠🚘 House + Car (50L Fund)" }
    ];

    const fetchDashboardData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token || !user) return navigate("/login");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            setLoading(true);
            const treeId = user.role === 'admin' ? 'KARAN1001' : user.userId;
            // Example: fetchDashboardData ke andar
            const [statsRes, walletRes, treeRes] = await Promise.all([
                API.get("/user/dashboard-stats"), // 👈 Ab sirf itna likhna hai
                API.get("/wallet/my-wallet"),
                API.get(`/admin/tree/${treeId}`)
            ]);

            if (statsRes.data?.data) setStats(prev => ({ ...prev, ...statsRes.data.data }));
            if (walletRes.data?.success) setStats(prev => ({ ...prev, wallet: walletRes.data.balance }));

            if (treeRes.data?.success) {
                const fullData = treeRes.data.data;
                setRecursiveTree(fullData);
                const flatten = (node, list = []) => {
                    node.children?.forEach(child => {
                        list.push({ userId: child.userId, name: child.name, isActive: child.isActive });
                        flatten(child, list);
                    });
                    return list;
                };
                setTeamList(flatten(fullData));
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [navigate, user]);

    useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);


    console.log("Dashboard user status:", user?.isActive);
    console.log("Status:", user.isActive);
    // Dashboard.jsx mein line 113 ke paas jahan status log ho raha hai
    console.log("Dashboard user status:", user?.isActive);

    // 🚩 CRITICAL FIX: Jab tak user data nahi milta, screen ko render mat hone do
    if (authLoading || !user) {
        return (
            <div className="h-screen flex items-center justify-center bg-white font-black italic text-orange-600 animate-pulse">
                RESTORING SECURE SESSION...
            </div>
        );
    }

    // Ab iske niche baaki ka return statement aayega
    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans">

            <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-orange-600/20 text-xl">K</div>
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Karan <span className="text-orange-600">Ads</span></h1>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Enterprise Member Node</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">

                    <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase italic flex items-center gap-2 ${user?.isActive ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
                        }`}>
                        {/* Dashboard Header Badge Fix */}
                        <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase italic flex items-center gap-2 transition-all duration-500 ${user?.isActive ? 'bg-green-50 border-green-100 text-green-600 shadow-lg shadow-green-100' : 'bg-red-50 border-red-100 text-red-600'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${user?.isActive ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500' : 'bg-red-500'}`}></div>
                            {user?.isActive ? '✅ Account Active' : '⏳ Activation Pending'}
                        </div>
                    </div>
                    {/* 👤 User Profile Dropdown Section */}
                    <div className="group relative">
                        <button className="flex items-center gap-4 bg-white hover:bg-gray-50 p-1 pr-4 rounded-2xl border border-gray-200 transition-all shadow-sm active:scale-95">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-inner">
                                <UserIcon size={20} />
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-black uppercase italic leading-none">{user?.name}</p>
                                <p className="text-[9px] font-bold text-orange-600 mt-1 uppercase tracking-tighter">ID: {user?.userId}</p>
                            </div>
                            <Settings size={14} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
                        </button>

                        {/* --- Hover/Click Menu --- */}
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] overflow-hidden">
                            <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Overview</p>
                                <p className="text-sm font-black uppercase italic">{user?.email}</p>
                            </div>
                            <div className="p-4 space-y-1">
                                <Link to="/user/kyc" className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-all">
                                    <CheckCircle size={16} />
                                    <span className="text-[11px] font-black uppercase italic">Verify KYC Info</span>
                                </Link>
                                <button
                                    onClick={() => { localStorage.clear(); navigate("/login"); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all"
                                >
                                    <LogOut size={16} />
                                    <span className="text-[11px] font-black uppercase italic">Terminate Session</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 🚀 1. NETWORK GROWTH LINK */}
            <div className={`p-6 rounded-3xl border transition-all duration-500 mb-8 ${user?.isActive
                ? 'bg-white border-orange-100 shadow-sm'
                : 'bg-slate-50 border-slate-200 opacity-80 grayscale-[0.5]'
                }`}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                        🚀 My Referral Link
                        {!user?.isActive && <span className="text-red-500 font-black text-[8px] bg-red-50 px-2 py-0.5 rounded-full border border-red-100 uppercase animate-pulse">Activation Required</span>}
                    </h3>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Referral Link Box */}
                    <div className={`flex-1 w-full p-4 rounded-2xl border border-dashed font-mono text-xs truncate transition-colors ${user?.isActive
                        ? 'bg-gray-50 border-gray-300 text-blue-600 cursor-text'
                        : 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed select-none'
                        }`}>
                        {user?.isActive
                            ? `${window.location.origin}/register?ref=${user?.userId}`
                            : "ID ACTIVATION REQUIRED TO VIEW LINK"}
                    </div>

                    {/* Copy Button with Lock Logic */}
                    <button
                        disabled={!user?.isActive}
                        onClick={handleCopyLink} // 👈 Seedha function call karein
                        className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg transition-all active:scale-95 ${user?.isActive
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {user?.isActive ? "Copy Link" : "Link Locked"}
                    </button>
                </div>

                {/* Hint for Inactive Users */}
                {!user?.isActive && (
                    <p className="text-[9px] text-slate-500 mt-3 font-bold uppercase tracking-tighter">
                        * Pay the activation fee to unlock your unique referral tracking link.
                    </p>
                )}
            </div>

            {/* 📊 1. REFERRAL STATS */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="font-black text-gray-800 uppercase italic text-xl tracking-tighter">Referral Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                        <p className="text-[10px] font-black uppercase tracking-wider">Total Referrals</p>
                        <p className="text-xl font-black">{teamList.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                        <p className="text-[10px] font-black uppercase tracking-wider">Active Members</p>
                        <p className="text-xl font-black">{teamList.filter(m => m.isActive).length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                        <p className="text-[10px] font-black uppercase tracking-wider">Total Earnings</p>
                        <p className="text-xl font-black">₹{displayWallet}</p>
                    </div>
                </div>

                {/* 👤 2. MEMBER PROFILE */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 👤 2. MEMBER PROFILE */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-black text-[10px] uppercase text-gray-400 mb-6 tracking-widest">Member Profile</h3>
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-2xl text-white p-6 shadow-xl mb-4">
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">{user?.name}</h2>
                        <p className="text-[10px] opacity-80 font-bold">USER ID: {user?.userId}</p>
                    </div>
                    <button onClick={() => setIsIdCardOpen(true)} className="w-full py-3 border-2 border-indigo-50 text-indigo-600 font-black text-[10px] uppercase rounded-2xl hover:bg-indigo-50 transition">View ID Card</button>
                </div>

                {/* 💰 3. WALLET BALANCE (FIXED CALCULATION) */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="font-black text-[10px] uppercase text-gray-400 mb-6 tracking-widest">Wallet Balance</h3>
                        <p className="text-4xl font-black text-gray-800 tracking-tighter">₹{displayWallet}</p>
                        <p className="text-[9px] text-green-600 font-bold uppercase mt-1">
                            Based on {teamList.filter(m => m.isActive).length} Active Members
                        </p>
                    </div>

                    {/* ✅ KYC Validation Logic Hata Diya Gaya Hai */}
                    <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase italic shadow-xl shadow-orange-600/20 active:scale-95 transition-all mt-4"
                    >
                        Withdraw Money
                    </button>
                </div>


                {/* Wallet Balance Card ke niche add karein */}
                {stats.lastWithdrawStatus && (
                    <div className={`mt-4 p-5 bg-white rounded-3xl border-2 border-dashed flex justify-between items-center ${stats.lastWithdrawStatus === 'pending' ? 'border-orange-200 animate-pulse' :
                        stats.lastWithdrawStatus === 'approved' ? 'border-green-200' : 'border-red-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            {/* Status Dot Color Change */}
                            <div className={`w-2 h-2 rounded-full ${stats.lastWithdrawStatus === 'pending' ? 'bg-orange-500' :
                                stats.lastWithdrawStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>

                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">
                                    Withdrawal Request
                                </p>
                                <p className={`text-xs font-black uppercase italic ${stats.lastWithdrawStatus === 'pending' ? 'text-slate-800' :
                                    stats.lastWithdrawStatus === 'approved' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stats.lastWithdrawStatus === 'pending' && '⏳ Under Review'}
                                    {stats.lastWithdrawStatus === 'approved' && '✅ Payment Completed'}
                                    {stats.lastWithdrawStatus === 'rejected' && '❌ Request Rejected'}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className={`text-sm font-black tracking-tighter ${stats.lastWithdrawStatus === 'rejected' ? 'text-red-500 line-through opacity-50' : 'text-orange-600'
                                }`}>
                                ₹{stats.lastWithdrawAmount || 0}
                            </span>
                            {stats.lastWithdrawStatus === 'rejected' && (
                                <p className="text-[8px] font-bold text-red-400 uppercase mt-0.5">Check KYC/Bank</p>
                            )}
                        </div>
                    </div>
                )}


            </div>
            <BillingSection user={user} />


            {/* 🌳 4. NETWORK GENEALOGY */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 border-b border-gray-100">
                    <div>
                        <h3 className="font-black text-gray-800 uppercase italic text-xl tracking-tighter">Network <span className="text-orange-600">Genealogy</span></h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Spillover Mapping</p>
                    </div>
                    <div className="flex bg-gray-200 p-1 rounded-xl">
                        <button onClick={() => setViewMode("list")} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>List</button>
                        <button onClick={() => setViewMode("tree")} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition ${viewMode === 'tree' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>Tree</button>
                        <button onClick={() => setViewMode("levels")} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition ${viewMode === 'levels' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>Levels</button>
                    </div>
                </div>

                <div className="p-8">
                    {/* LIST VIEW */}
                    {viewMode === "list" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-gray-400 uppercase border-b border-gray-100">
                                    <tr><th className="pb-4">Member ID</th><th className="pb-4">Name</th><th className="pb-4 text-right">Status</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {teamList.map((m) => (
                                        <tr key={m.userId} className="group hover:bg-gray-50 transition">
                                            <td className="py-4 font-black text-xs text-gray-800">{m.userId}</td>
                                            <td className="py-4 text-xs font-bold text-gray-600 uppercase italic">{m.name}</td>
                                            <td className="py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${m.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {m.isActive ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TREE VIEW */}
                    {viewMode === "tree" && (
                        <div className="flex justify-center py-10 overflow-auto bg-[#0a1128] rounded-3xl min-h-[500px] border-4 border-gray-800">
                            {recursiveTree && <ReferralTree data={recursiveTree} />}
                        </div>
                    )}

                    {/* LEVELS VIEW (Locked/Unlocked Blur) */}
                    {viewMode === "levels" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {levelsData.map((lvl) => {
                                const isUnlocked = teamList.filter(m => m.isActive).length >= lvl.target;
                                return (
                                    <div key={lvl.lv} className={`relative p-6 rounded-[2rem] border transition-all duration-500 ${isUnlocked ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100 grayscale blur-[2px] opacity-60'}`}>
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 rounded-[2rem]">
                                                <div className="bg-white p-2 rounded-full shadow-lg"><Lock size={16} className="text-gray-400" /></div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-orange-600 font-black shadow-sm border border-orange-100">L{lvl.lv}</div>
                                            {isUnlocked ? <CheckCircle size={20} className="text-green-500" /> : <Trophy size={20} className="text-gray-300" />}
                                        </div>
                                        <h4 className="font-black text-gray-800 uppercase italic text-sm">{lvl.reward}</h4>
                                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Progress: {Math.min(teamList.filter(m => m.isActive).length, lvl.target)}/{lvl.target}</div>
                                            <div className="text-xs font-black text-green-600">₹{lvl.income.toLocaleString()}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>


            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                balance={displayWallet}
                // 🚩 YE FUNCTION PASS KARNA ZAROORI HAI
                onWithdraw={async (modalData) => {
                    try {
                        // 🚩 Data mapping as per backend requirement
                        const dataToSend = {
                            amount: Number(modalData.amount),
                            paymentDetails: modalData.upiId || "Not Provided",
                            accountHolderName: user.bankDetails?.accountHolderName || user.bankDetails?.holderName || "N/A"
                        };

                        // ✅ API instance use karein, headers ki chinta nahi
                        const res = await API.post("/wallet/withdraw", dataToSend);

                        if (res.data.success) {
                            toast.success("Request Pending!");
                            setIsWithdrawModalOpen(false);
                            fetchDashboardData(); // Refresh wallet and stats
                        }
                    } catch (err) {
                        // Backend se aaya error message dikhayein
                        toast.error(err.response?.data?.message || "Withdrawal failed");
                    }
                }}
            />

            <IdCardModal isOpen={isIdCardOpen} onClose={() => setIsIdCardOpen(false)} user={user} />
        </div>
    );
};

export default Dashboard;
