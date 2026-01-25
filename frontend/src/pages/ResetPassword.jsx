import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import API from '../api/axios'; //
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams(); // URL se token lene ke liye (/:token)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true);
        try {
            // Backend endpoint jo hum abhi banayenge
            const res = await API.post(`/auth/reset-password/${token}`, {
                password: formData.password
            });

            if (res.data.success) {
                toast.success("Password Reset Successful! Please Login.");
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Link expired or invalid!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border-b-8 border-orange-600">
                <div className="text-center mb-8">
                    <div className="bg-orange-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl mx-auto font-bold text-2xl mb-4 shadow-lg">K</div>
                    <h2 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter">Set New Password</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Secure Node Recovery</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <div>
                        <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 ml-2 italic">New Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Min. 8 characters"
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xs"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-orange-600 bg-transparent border-none"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 ml-2 italic">Confirm Access Key</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-4 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="Re-type password"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xs"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border-none"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Update Access Key'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;