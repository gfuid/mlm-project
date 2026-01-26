import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", formData);

            if (res.data.success) {
                // ✅ CORRECT: Token is at TOP LEVEL, not inside user
                const token = res.data.token;  // 👈 YAHAN SE TOKEN LO
                const user = res.data.user;    // 👈 User object alag hai

                console.log('🔑 Token received:', token);
                console.log('👤 User data:', user);

                // 1. Save to localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                // 2. Update global state
                setUser(user);

                toast.success(`Welcome back, ${user.name}!`);

                // 3. Navigate based on role
                setTimeout(() => {
                    const target = user.role === 'admin' ? "/admin" : "/dashboard";
                    navigate(target, { replace: true });
                }, 500);
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            const errorMsg = err.response?.data?.message || "Invalid Credentials!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-sans">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border-t-8 border-orange-600">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
                        Karan <span className="text-orange-600">Ads</span>
                    </h2>
                    <div className="mt-2 flex items-center justify-center gap-2">
                        <div className="h-[1px] w-8 bg-gray-200"></div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Secure Node Access</p>
                        <div className="h-[1px] w-8 bg-gray-200"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2 italic">Network Identity (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xs transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2 italic">Access Key</label>
                            <Link to="/forgot-password" className="font-black uppercase text-orange-600 hover:text-orange-700 tracking-tighter text-[10px] no-underline">
                                Recovery?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xs transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-orange-500 transition border-none bg-transparent p-0"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-black py-5 px-4 rounded-[2rem] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Verifying...
                            </>
                        ) : 'Establish Connection'}
                    </button>
                </form>

                <p className="text-center mt-10 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    Unauthorized Entry? <Link to="/register" className="text-orange-600 font-black no-underline hover:border-b-2 border-orange-600 pb-1">Join Node</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;