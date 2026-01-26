import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ GUARANTEED STORAGE FUNCTION
    const guaranteedStorage = async (key, value) => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(key, value);

                // Immediate verification
                const stored = localStorage.getItem(key);
                if (stored === value) {
                    console.log(`✅ ${key} stored and verified`);
                    resolve(true);
                } else {
                    console.error(`❌ ${key} verification failed`);
                    reject(new Error(`Failed to store ${key}`));
                }
            } catch (error) {
                console.error(`❌ Storage error for ${key}:`, error);
                reject(error);
            }
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('🔄 Admin login attempt...');

            // 1. Backend API Call
            const res = await API.post("/auth/admin-login", { email, password });

            console.log('✅ Login response:', res.data);

            // 2. Verify response structure
            if (!res.data.success) {
                throw new Error(res.data.message || 'Login failed');
            }

            if (!res.data.token) {
                throw new Error('No token received from server');
            }

            if (!res.data.user) {
                throw new Error('No user data received from server');
            }

            // 3. Deep Role Verification
            if (res.data.user.role !== "admin") {
                throw new Error('Unauthorized: These are not Master Credentials!');
            }

            const { token, user } = res.data;

            console.log('📦 Storing credentials...');
            console.log('Token length:', token.length);
            console.log('User data:', user);

            // 4. ✅ GUARANTEED STORAGE WITH VERIFICATION
            await guaranteedStorage("token", token);
            await guaranteedStorage("userInfo", JSON.stringify(user));

            console.log('✅ All credentials stored successfully');

            // 5. Triple verification
            const verifyToken = localStorage.getItem("token");
            const verifyUser = localStorage.getItem("userInfo");

            if (!verifyToken || !verifyUser) {
                throw new Error('Storage verification failed - credentials not found');
            }

            // Parse and verify user data
            const parsedUser = JSON.parse(verifyUser);
            if (parsedUser.role !== 'admin') {
                throw new Error('Storage verification failed - invalid role');
            }

            console.log('✅ Storage triple-verified successfully');
            console.log('Final check - Token:', verifyToken.substring(0, 20) + '...');
            console.log('Final check - User:', parsedUser.email || parsedUser.name);

            // 6. Show success toast
            toast.success("Access Granted: Welcome Master Admin", {
                icon: "🚀",
                duration: 2000
            });

            // 7. ✅ DELAYED NAVIGATION with extra safety (500ms instead of 100ms)
            console.log('⏳ Waiting 500ms before navigation...');

            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('🚀 Navigating to admin dashboard now...');
            navigate("/admin", { replace: true });

        } catch (err) {
            console.error('❌ Admin login error:', err);

            // Show error to user
            const errorMessage = err.response?.data?.message || err.message || "Authentication Failed";
            toast.error(errorMessage, { duration: 3000 });

            // Clear any partial data on error
            console.log('🧹 Cleaning up after error...');
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");

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
                                    value={email}
                                    className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:ring-2 ring-orange-600/50 font-bold text-xs"
                                    placeholder="master@system.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
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
                                    value={password}
                                    className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 pr-12 rounded-2xl text-white outline-none focus:ring-2 ring-orange-600/50 font-bold text-xs"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-orange-500 bg-transparent border-none disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 border-none ${loading
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20 italic active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Authenticating Node...
                                </>
                            ) : (
                                "Initialize Access"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;