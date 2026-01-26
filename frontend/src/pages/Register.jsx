import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
// Eye aur EyeOff icons add kiye hain
import { User, Phone, Mail, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        sponsorId: "KARAN1001"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // 👁️ Password visibility toggle karne ke liye state
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get("ref");
        if (ref) setFormData(prev => ({ ...prev, sponsorId: ref }));
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/register", formData);
            if (res.data.success) {
                alert(`Registration Successful! Your User ID is: ${res.data.userId}`);
                navigate("/login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed. Try a new Email/Mobile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center py-10 selection:bg-orange-200">
            {/* Logo Section */}
            <div className="flex items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-orange-600 text-white p-2 rounded-lg font-bold text-2xl shadow-lg shadow-orange-600/20 italic">K</div>
                <h1 className="ml-3 text-2xl font-black text-slate-800 uppercase tracking-tighter italic">
                    Karan <span className="text-orange-600">Ads</span>
                </h1>
            </div>

            <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

                <div className="text-center mb-8">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest italic">Free Network Registration</h2>
                    <div className="h-1 w-16 bg-orange-500 mx-auto mt-2 rounded-full"></div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-2 animate-bounce">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Sponsor ID */}
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest italic">Network Sponsor ID</label>
                        <div className="relative mt-1">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" size={18} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent font-black text-orange-600 outline-none transition-all group-focus-within:bg-white"
                                value={formData.sponsorId}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest italic">Full Identity Name</label>
                        <div className="relative mt-1">
                            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                            <input
                                type="text" required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none transition-all font-bold text-slate-800"
                                placeholder="Enter Full Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Mobile & Email Row (Responsive) */}
                    <div className="grid grid-cols-1 gap-5">
                        {/* Mobile */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest italic">Mobile Connection</label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                                <input
                                    type="tel" required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none transition-all font-bold text-slate-800"
                                    placeholder="Mobile Number"
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest italic">Email Address</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                                <input
                                    type="email" required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none transition-all font-bold text-slate-800 font-mono"
                                    placeholder="Email ID"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Input with Eye 👁️ */}
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest italic">Create Access Key</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none transition-all font-bold text-slate-800"
                                placeholder="Password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <p className="text-[9px] text-green-600 font-black uppercase flex items-center justify-center gap-2 bg-green-50 py-2 rounded-xl border border-green-100 italic">
                        <span>🛡️</span> Secure 256-Bit Node Encryption
                    </p>

                    <button
                        disabled={loading}
                        className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70 italic"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : "Complete Free Registration"}
                    </button>
                </form>

                <p className="text-center mt-8 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Already have an account? <Link to="/login" className="text-orange-600 font-black border-b-2 border-orange-600 ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;