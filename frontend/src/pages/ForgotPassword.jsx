import React, { useState } from 'react';
import API from '../api/axios';
import { MailCheck, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ✅ Ye request ab backend par jayegi aur wahan se mail trigger hoga
            const response = await API.post("/auth/forgot-password", { email: email.trim() });
            if (response.data.success) {
                toast.success("Reset link dispatched! Check your mail.");
            }
        } catch (err) {
            // Error handling jo console crash ko rokega
            const msg = err.response?.data?.message || "Verification failed";
            toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-sans">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border-t-8 border-slate-900">
                <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-gray-400 hover:text-orange-600 mb-8 transition font-black uppercase text-[10px] tracking-widest bg-transparent border-none">
                    <ArrowLeft size={14} /> Back to Login
                </button>
                <h2 className="text-3xl font-black text-slate-800 uppercase italic mb-2 leading-none">REQUEST <span className="text-orange-600">RESET LINK</span></h2>
                <form onSubmit={handleSendLink} className="space-y-6 mt-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter registered email..."
                        className="w-full p-5 bg-gray-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500 border-none"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-orange-600 transition-all uppercase italic text-[10px] flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <><MailCheck size={16} /> Send Reset Link</>}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ForgotPassword;
