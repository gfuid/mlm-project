import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import API from '../api/axios'; // 🚩 Centralized API instance
import { IndianRupee, Clock, CheckCircle2, XCircle, Landmark, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const WithdrawalRequests = () => {
    // 1. ✅ stats se pendingWithdrawals list extract karein
    const { stats, refreshAdminData, loading } = useAdmin();
    const pendingRequests = stats.pendingWithdrawals || [];

    useEffect(() => {
        refreshAdminData();
    }, [refreshAdminData]);

    const handleStatusUpdate = async (withdrawalId, status) => {
        const confirmMsg = status === 'approved' ? "Mark this as Paid?" : "Reject this request?";
        if (!window.confirm(confirmMsg)) return;

        try {
            // ✅ API instance baseURL aur Headers automatically handle karega
            const res = await API.post("/admin/update-withdrawal", {
                withdrawalId: withdrawalId,
                status: status,
                remark: `Processed by Admin on ${new Date().toLocaleDateString()}`
            });

            if (res.data.success) {
                toast.success(`Transaction ${status.toUpperCase()}!`);
                refreshAdminData(); // ✅ Sidebar badge aur list turant update hogi
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Status update failed");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-600/30">
            {/* Header with Liability Stats */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                        Withdrawal <span className="text-orange-600">Requests</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 italic">
                        Authorized Payout Control Interface
                    </p>
                </div>
                <div className="bg-slate-900/50 p-5 rounded-[2rem] border border-slate-800 shadow-2xl flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Liability</p>
                        <p className="text-3xl font-black text-orange-500 italic tracking-tighter">
                            ₹{stats.pendingPayouts?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Queue</p>
                        <p className="text-2xl font-black text-white italic">{pendingRequests.length}</p>
                    </div>
                </div>
            </header>

            {/* Requests Feed */}
            <div className="grid gap-6">
                {loading && pendingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] italic">Scanning Blockchain Ledger...</p>
                    </div>
                ) : pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                        <div key={req._id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] flex flex-col xl:flex-row justify-between items-center gap-8 hover:border-orange-500/30 transition-all shadow-xl group">

                            {/* 👤 User Profile Node */}
                            <div className="flex gap-5 items-center flex-1 w-full">
                                <div className="w-16 h-16 bg-orange-600/10 rounded-[1.5rem] flex items-center justify-center border border-orange-600/20 shadow-inner">
                                    <IndianRupee className="text-orange-500" size={28} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black uppercase italic text-base text-white tracking-tight">{req.userId?.name || "Unknown User"}</h3>
                                    <p className="text-[10px] text-orange-600 font-bold tracking-widest uppercase mt-0.5 italic">ID: {req.userId?.userId || "N/A"}</p>
                                    <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-blue-600/10 rounded-full w-fit border border-blue-600/20">
                                        <Phone size={10} className="text-blue-500" />
                                        <span className="text-[10px] font-black text-blue-500">{req.userId?.mobile || "No Mobile"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 🏦 Secure Bank Credentials (Directly from KYC Data) */}
                            <div className="flex-1 w-full bg-black/40 p-6 rounded-[2rem] border border-slate-800/80 shadow-inner group-hover:bg-black/60 transition-all">
                                <div className="flex items-center gap-2 mb-4 text-slate-500">
                                    <Landmark size={14} className="text-orange-500" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Bank Node</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                    <div className="text-left">
                                        <p className="text-[11px] font-black text-white uppercase italic truncate">{req.userId?.bankDetails?.bankName || "N/A"}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">IFSC: {req.userId?.bankDetails?.ifscCode || "N/A"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-orange-500 tracking-widest font-mono italic">{req.userId?.bankDetails?.accountNumber || "N/A"}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">UPI: {req.userId?.bankDetails?.upiId || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between">
                                    <p className="text-[9px] font-black text-slate-600 uppercase">A/C Holder:</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase italic">{req.userId?.bankDetails?.accountHolderName || "N/A"}</p>
                                </div>
                            </div>

                            {/* 💰 Amount & Final Authorization */}
                            <div className="flex items-center gap-8 w-full xl:w-auto justify-between xl:justify-end">
                                <div className="text-right">
                                    <p className="text-3xl font-black italic tracking-tighter text-white">₹{req.amount?.toLocaleString()}</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Net Payable Amount</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate(req._id, 'approved')}
                                        className="p-5 bg-green-600/10 text-green-500 rounded-2xl border border-green-600/20 hover:bg-green-600 hover:text-white transition-all shadow-xl shadow-green-600/5 group active:scale-90"
                                    >
                                        <CheckCircle2 size={24} />
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                        className="p-5 bg-red-600/10 text-red-600 rounded-2xl border border-red-600/20 hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-600/5 group active:scale-90"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-80 border-2 border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center justify-center bg-slate-900/10">
                        <div className="p-6 bg-slate-900 rounded-full mb-4">
                            <Clock size={48} className="text-slate-800" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-600 italic">No Pending Requests in Sector</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WithdrawalRequests;