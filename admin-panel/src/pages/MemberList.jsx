import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Sidebar from '../components/common/Sidebar';
import API from '../api/axios';
import {
    Search, ShieldCheck, Eye, X, CheckCircle2, Loader2, MapPin, User,
    ChevronLeft, ChevronRight, Users, Award, Wallet, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const MemberList = () => {
    const { refreshAdminData } = useAdmin();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const [selectedUser, setSelectedUser] = useState(null);
    const [isKycModalOpen, setIsKycModalOpen] = useState(false);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const res = await API.get(`/admin/users?page=${page}&limit=20`);
            if (res.data.success) {
                setUsers(res.data.data || []);
                setTotalPages(res.data.pages || 1);
                setTotalUsers(res.data.total || 0);
                setCurrentPage(res.data.page || page);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    const finalFilteredMembers = (users || []).filter((user) => {
        const name = user?.name?.toLowerCase() || "";
        const email = user?.email?.toLowerCase() || "";
        const userId = user?.userId?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        return name.includes(search) || email.includes(search) || userId.includes(search);
    });

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleVerifyKyc = async (userId) => {
        const userToVerify = users.find(u => u.userId === userId);
        const bank = userToVerify?.bankDetails;
        if (!bank || !bank.bankName || !bank.accountNumber || !bank.ifscCode) {
            return toast.error("Complete KYC Required!");
        }
        try {
            setActionLoading(userId);
            const res = await API.patch(`/admin/verify-kyc/${userId}`);
            if (res.data.success) {
                toast.success("KYC Verified!");
                setUsers(prev => prev.map(u => u.userId === userId ? { ...u, bankDetails: { ...u.bankDetails, isVerified: true } } : u));
                setIsKycModalOpen(false);
            }
        } catch (err) {
            toast.error("Verification Failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusUpdate = async (userId, newStatus) => {
        if (!window.confirm(`${newStatus ? 'Activate' : 'Suspend'} ${userId}?`)) return;
        try {
            setActionLoading(userId);
            const res = await API.patch(`/admin/toggle-status/${userId}`, { isActive: newStatus });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchUsers(currentPage); // Refresh to get updated team counts
                refreshAdminData(); // Update dashboard stats
            }
        } catch (err) {
            toast.error("Action Failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Member <span className="text-orange-600">Database</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                            Total: {totalUsers} | Page {currentPage}/{totalPages}
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-orange-600/50 uppercase"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase italic">
                                <tr>
                                    <th className="p-6">User Identity</th>
                                    <th className="p-6">MLM Stats</th>
                                    <th className="p-6">Bank KYC</th>
                                    <th className="p-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-20 text-center animate-pulse text-orange-500 font-black italic">SCANNING...</td></tr>
                                ) : finalFilteredMembers.length > 0 ? (
                                    finalFilteredMembers.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-800/30 transition-all group">
                                            {/* User Identity */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-orange-500 font-black border border-slate-700 uppercase shadow-inner">
                                                        {user?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white uppercase text-xs">{user?.name || "N/A"}</p>
                                                        <p className="text-[10px] text-orange-500 font-mono font-bold mt-1">{user?.userId}</p>
                                                        {user?.sponsorId && (
                                                            <p className="text-[9px] text-slate-500 font-bold mt-1">
                                                                Ref: {user.sponsorId}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* MLM Stats */}
                                            <td className="p-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Users size={12} className="text-blue-500" />
                                                        <span className="text-[10px] text-slate-400">Team:</span>
                                                        <span className="text-xs font-black text-white">{user.totalTeam || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Award size={12} className="text-orange-500" />
                                                        <span className="text-[10px] text-slate-400">Direct:</span>
                                                        <span className="text-xs font-black text-white">
                                                            {user.directReferrals?.length || 0}
                                                            <span className="text-[9px] text-green-500 ml-1">
                                                                ({user.activeDirectCount || 0} active)
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp size={12} className="text-purple-500" />
                                                        <span className="text-[10px] text-slate-400">Rank:</span>
                                                        <span className="text-xs font-black text-purple-400">{user.rank || 'Promoter'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Wallet size={12} className="text-green-500" />
                                                        <span className="text-[10px] text-slate-400">Earned:</span>
                                                        <span className="text-xs font-black text-green-400">₹{user.totalEarnings || 0}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Bank KYC */}
                                            <td className="p-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${user.bankDetails?.isVerified ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                                                        <span className="text-[9px] font-black uppercase text-slate-400">
                                                            {user.bankDetails?.isVerified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setIsKycModalOpen(true); }}
                                                        className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase hover:text-orange-400"
                                                    >
                                                        <Eye size={12} /> Inspect
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-6 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleStatusUpdate(user.userId, true)}
                                                        disabled={user.isActive || actionLoading === user.userId}
                                                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase ${user.isActive ? 'opacity-30 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-lg'}`}
                                                    >
                                                        {actionLoading === user.userId ? <Loader2 size={12} className="animate-spin" /> : 'Activate'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(user.userId, false)}
                                                        disabled={!user.isActive || actionLoading === user.userId}
                                                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase ${!user.isActive ? 'opacity-30 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 shadow-lg'}`}
                                                    >
                                                        Suspend
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="p-20 text-center text-slate-600 font-bold uppercase">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-10 flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Showing {finalFilteredMembers.length} of {totalUsers}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-orange-600 disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl font-black text-xs">
                            <span className="text-orange-600">{currentPage}</span> / <span className="text-slate-500">{totalPages}</span>
                        </div>
                        <button
                            disabled={currentPage === totalPages || loading}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-orange-600 disabled:opacity-20 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* KYC Modal - Same as before */}
            {isKycModalOpen && selectedUser && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
                            <h3 className="font-black italic uppercase text-2xl text-white tracking-tighter">
                                Bank <span className="text-orange-600">Protocol</span>
                            </h3>
                            <button onClick={() => setIsKycModalOpen(false)} className="text-slate-500 hover:text-white p-2 bg-slate-800 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="flex items-center gap-4 bg-black/40 p-5 rounded-3xl border border-slate-800 shadow-inner">
                                <div className="p-3 bg-orange-600/20 rounded-2xl text-orange-600"><User size={20} /></div>
                                <div className="border-l border-slate-800 pl-4">
                                    <span className="text-[10px] font-black text-slate-600 uppercase">A/C Holder</span>
                                    <p className="text-lg font-black text-white uppercase tracking-tighter mt-1">
                                        {selectedUser.bankDetails?.holderName || selectedUser.bankDetails?.accountHolderName || "NOT PROVIDED"}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-800">
                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                    <MapPin size={14} className="text-orange-600" />
                                    <span className="text-[9px] font-black uppercase">Address</span>
                                </div>
                                <p className="text-xs font-bold text-slate-300 uppercase">
                                    {selectedUser.bankDetails?.address || "NOT PROVIDED"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/20 p-4 rounded-2xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-600 uppercase">Bank</p>
                                    <p className="text-xs font-bold text-white mt-1 uppercase truncate">
                                        {selectedUser.bankDetails?.bankName || "---"}
                                    </p>
                                </div>
                                <div className="bg-slate-800/20 p-4 rounded-2xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-600 uppercase">IFSC</p>
                                    <p className="text-xs font-black text-orange-500 mt-1 uppercase font-mono">
                                        {selectedUser.bankDetails?.ifscCode || "---"}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-black/30 p-5 rounded-2xl border border-slate-800 text-center">
                                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Account Number</p>
                                <p className="text-2xl font-black text-white tracking-[0.2em] font-mono">
                                    {selectedUser.bankDetails?.accountNumber || "XXXXXXXXXXXX"}
                                </p>
                            </div>

                            {!selectedUser.bankDetails?.isVerified ? (
                                <button
                                    onClick={() => handleVerifyKyc(selectedUser.userId)}
                                    disabled={actionLoading === selectedUser.userId}
                                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-3xl uppercase text-xs shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {actionLoading === selectedUser.userId ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <><ShieldCheck size={20} /> AUTHORIZE CREDENTIALS</>
                                    )}
                                </button>
                            ) : (
                                <div className="w-full bg-green-600/10 border border-green-600/30 text-green-500 font-black py-6 rounded-3xl text-center text-xs uppercase flex items-center justify-center gap-3">
                                    <CheckCircle2 size={20} /> IDENTITY VERIFIED
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberList;