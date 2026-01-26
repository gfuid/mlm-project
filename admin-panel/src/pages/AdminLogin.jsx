
import React, { useState } from "react";
import API from "../api/axios"; // 🚩 Centralized API instance
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Backend API Call
            const res = await API.post("/auth/admin-login", { email, password });

            // 2. Deep Role Verification (Sirf Admin allowed hai)
            if (res.data.success && res.data.user.role === "admin") {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userInfo", JSON.stringify(res.data.user));

                toast.success("Access Granted: Welcome Master Admin", { icon: "🚀" });

                // Admin Dashboard par bhej rahe hain
                setTimeout(() => navigate("/admin"), 100);
            } else {
                toast.error("Unauthorized: These are not Master Credentials!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Authentication Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-orange-500 font-sans">
            <div className="w-full max-w-md">
                {/* Brand Identity */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-orange-600/10 border border-orange-500/20 mb-4 shadow-2xl shadow-orange-600/10">
                        <ShieldCheck className="text-orange-500 w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
                        Master <span className="text-orange-600">Control</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 italic">Authorized Access Only</p>
                </div>

                {/* Login Form */}
                <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest italic">Admin Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:ring-2 ring-orange-600/50 font-bold text-xs"
                                    placeholder="master@system.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest italic">Master Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 pr-12 rounded-2xl text-white outline-none focus:ring-2 ring-orange-600/50 font-bold text-xs"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-orange-500 bg-transparent border-none">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 border-none ${loading ? 'bg-slate-800 text-slate-500' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20 italic'}`}
                        >
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating Node...</> : "Initialize Access"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;