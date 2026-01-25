import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; // Hamara naya axios instance
import { User, Phone, Mail, Lock, UserPlus } from "lucide-react"; // Icons ke liye

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. URL se Sponsor ID uthana (?ref=KARAN1001)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        sponsorId: "KARAN1001" // Default Admin
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            // Humne backend mein session-based atomic counter set kiya hai
            const res = await API.post("/auth/register", formData);
            if (res.data.success) {
                alert(`Registration Successful! Your User ID is: ${res.data.userId}`);
                navigate("/login");
            }
        } catch (err) {
            // Duplicate mobile/email error handling jo humne fix kiya tha
            setError(err.response?.data?.message || "Registration Failed. Try a new Email/Mobile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center py-10">
            {/* Logo Section */}
            <div className="flex items-center mb-8">
                <div className="bg-orange-600 text-white p-2 rounded-lg font-bold text-2xl">K</div>
                <h1 className="ml-3 text-2xl font-black text-slate-800 uppercase tracking-tighter">
                    Karan <span className="text-orange-600">Ads</span>
                </h1>
            </div>

            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Free Network Registration</h2>
                    <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
                </div>

                {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Sponsor ID - Read Only */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Network Sponsor ID</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-orange-600" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none font-bold text-orange-600 focus:ring-2 focus:ring-orange-500"
                                value={formData.sponsorId}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Identity Name</label>
                        <div className="relative">
                            <UserPlus className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter Full Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Mobile Input */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mobile Connection</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Mobile Number"
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="email" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Email ID"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Create Access Key</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="password" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <p className="text-[10px] text-green-600 flex items-center">
                        <span className="mr-1">🛡️</span> Secure 256-Bit Node Encryption
                    </p>

                    <button
                        disabled={loading}
                        className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-black transition-all shadow-lg flex justify-center items-center"
                    >
                        {loading ? "Initializing Node..." : "Complete Free Registration"}
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-slate-500">
                    Already have an account? <Link to="/login" className="text-orange-600 font-bold uppercase">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;