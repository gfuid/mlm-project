import React, { useState } from 'react';
import { X, Wallet, ArrowUpRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const WithdrawModal = ({ isOpen, onClose, balance, fetchUser }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (amount < 500) return toast.error("Minimum withdrawal is ₹500");
        if (amount > balance) return toast.error("Insufficient wallet balance");

        setLoading(true);
        try {
            const res = await API.post('/wallet/withdraw', { amount });
            if (res.data.success) {
                toast.success("Withdrawal request sent successfully!");
                fetchUser(); // Balance update karne ke liye
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Wallet size={24} />
                        <h3 className="font-black uppercase tracking-widest text-sm">Withdraw Funds</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X /></button>
                </div>

                <form onSubmit={handleWithdraw} className="p-8 space-y-6">
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-orange-600 uppercase">Available Balance</span>
                        <span className="text-xl font-black text-slate-800">₹{balance}</span>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Enter Amount (INR)</label>
                        <input
                            type="number" required
                            className="w-full mt-1 px-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-bold text-lg"
                            placeholder="Min. 500"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                        ⚠️ Note: Funds will be transferred to your registered bank account within 24-48 hours after admin approval.
                    </p>

                    <button
                        disabled={loading}
                        className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg flex justify-center items-center gap-2"
                    >
                        {loading ? "Processing..." : "Confirm Withdrawal"}
                        <ArrowUpRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WithdrawModal;