import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { User as UserIcon, Landmark, Save, ShieldCheck, Loader2, MapPin, Edit3, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const KycForm = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true); // ✅ NEW: Initial data load
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        holderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
        address: ""
    });

    // 🔄 Data fetch with proper token handling
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // ✅ CRITICAL: Verify token exists before API call
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('❌ No token found - user not authenticated');
                    toast.error('Please login to access KYC form');
                    setInitialLoading(false);
                    return;
                }

                console.log('🔍 Fetching user profile for KYC...');
                console.log('Token exists:', !!token);

                const res = await API.get("/user/me");

                console.log('✅ Profile fetch response:', res.data);

                if (res.data.success) {
                    const u = res.data.data;

                    setFormData({
                        name: u.name || "",
                        mobile: u.mobile || "",
                        holderName: u.bankDetails?.holderName || "",
                        bankName: u.bankDetails?.bankName || "",
                        accountNumber: u.bankDetails?.accountNumber || "",
                        ifscCode: u.bankDetails?.ifscCode || "",
                        upiId: u.bankDetails?.upiId || "",
                        address: u.bankDetails?.address || ""
                    });

                    console.log('✅ Form data populated:', {
                        name: u.name,
                        mobile: u.mobile,
                        hasBankDetails: !!u.bankDetails
                    });
                }
            } catch (err) {
                console.error("❌ Failed to load KYC profile:", err);

                // Handle specific error cases
                if (err.response?.status === 401) {
                    toast.error('Session expired - please login again');
                    // Optional: redirect to login
                    // window.location.href = '/login';
                } else {
                    toast.error('Failed to load profile data');
                }
            } finally {
                setInitialLoading(false);
            }
        };

        // ✅ CRITICAL: Small delay to ensure token is available
        const timer = setTimeout(() => {
            fetchUserProfile();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateKyc = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.holderName || !formData.bankName || !formData.accountNumber || !formData.ifscCode || !formData.address) {
            return toast.error("Please fill all mandatory fields!");
        }

        setLoading(true);

        try {
            console.log('📤 Submitting KYC update...');

            const res = await API.put("/user/update-kyc", {
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode.toUpperCase(),
                accountHolderName: formData.holderName,
                upiId: formData.upiId,
                address: formData.address
            });

            console.log('✅ KYC update response:', res.data);

            if (res.data.success) {
                toast.success("KYC Protocol Updated!", { duration: 2000 });

                // Update user context
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                setIsEditing(false);

                console.log('✅ User data updated in context and localStorage');
            }
        } catch (err) {
            console.error('❌ KYC update failed:', err);
            toast.error(err.response?.data?.message || "Update Failed");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Show loading state while fetching initial data
    if (initialLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest italic">
                        Loading Node Identity Data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header with Edit Toggle */}
            <div className="flex justify-between items-end mb-10">
                <div className="text-left">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                        KYC & <span className="text-orange-600">Address Info</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Verified Node Identity Management
                    </p>
                </div>

                {/* ✏️ Pencil/Toggle Button */}
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg ${isEditing
                            ? 'bg-red-500 text-white shadow-red-200'
                            : 'bg-slate-900 text-white shadow-slate-200 hover:bg-orange-600'
                        }`}
                >
                    {isEditing ? (
                        <>
                            <XCircle size={14} /> Cancel Edit
                        </>
                    ) : (
                        <>
                            <Edit3 size={14} /> Edit Details
                        </>
                    )}
                </button>
            </div>

            <form onSubmit={handleUpdateKyc} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Personal Profile Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <UserIcon size={20} />
                        </div>
                        <h3 className="font-black uppercase text-sm italic tracking-tighter">
                            User Identity
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                Full Name
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                readOnly
                                className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold text-gray-400 cursor-not-allowed border-none mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                Registered Mobile
                            </label>
                            <input
                                name="mobile"
                                value={formData.mobile}
                                readOnly
                                className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold text-gray-400 cursor-not-allowed border-none mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2 italic">
                                Residential Address (For Billing)
                            </label>
                            <div className="relative mt-1">
                                <MapPin
                                    className={`absolute left-4 top-4 transition-colors ${isEditing ? 'text-orange-600' : 'text-gray-300'
                                        }`}
                                    size={16}
                                />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className={`w-full p-4 pl-12 rounded-2xl text-xs font-bold transition-all min-h-[100px] border-2 ${isEditing
                                            ? 'bg-white border-orange-100 ring-4 ring-orange-50/50'
                                            : 'bg-gray-50 border-transparent cursor-not-allowed'
                                        }`}
                                    placeholder="Enter full address..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banking Info Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                            <Landmark size={20} />
                        </div>
                        <h3 className="font-black uppercase text-sm italic tracking-tighter">
                            Banking Node
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                    Holder Name
                                </label>
                                <input
                                    name="holderName"
                                    value={formData.holderName}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className={`w-full p-4 rounded-2xl text-xs font-bold border-2 transition-all ${isEditing
                                            ? 'bg-white border-orange-100 ring-4 ring-orange-50/50'
                                            : 'bg-gray-50 border-transparent cursor-not-allowed'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                    Bank Name
                                </label>
                                <input
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className={`w-full p-4 rounded-2xl text-xs font-bold border-2 transition-all ${isEditing
                                            ? 'bg-white border-orange-100 ring-4 ring-orange-50/50'
                                            : 'bg-gray-50 border-transparent cursor-not-allowed'
                                        }`}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                    IFSC Code
                                </label>
                                <input
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className={`w-full p-4 rounded-2xl text-xs font-bold uppercase border-2 transition-all ${isEditing
                                            ? 'bg-white border-orange-100 ring-4 ring-orange-50/50'
                                            : 'bg-gray-50 border-transparent cursor-not-allowed'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                    A/C Number
                                </label>
                                <input
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className={`w-full p-4 rounded-2xl text-xs font-bold border-2 transition-all ${isEditing
                                            ? 'bg-white border-orange-100 ring-4 ring-orange-50/50'
                                            : 'bg-gray-50 border-transparent cursor-not-allowed'
                                        }`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                                UPI ID (Optional)
                            </label>
                            <input
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                className={`w-full p-4 rounded-2xl text-xs font-bold border-2 transition-all ${isEditing
                                        ? 'bg-white border-orange-100 ring-4 ring-orange-50/50'
                                        : 'bg-gray-50 border-transparent cursor-not-allowed'
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button - Sirf Edit mode mein dikhega */}
                {isEditing && (
                    <div className="md:col-span-2 flex justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white px-16 py-5 rounded-[2rem] font-black uppercase italic tracking-widest text-xs flex items-center gap-3 hover:bg-orange-600 transition-all shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Syncing..." : "Commit Changes to Database"}
                        </button>
                    </div>
                )}
            </form>

            {!isEditing && (
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-center gap-4">
                    <ShieldCheck className="text-orange-600" size={24} />
                    <p className="text-[10px] font-black text-orange-700 uppercase tracking-wider text-left leading-relaxed">
                        Data Secure: Details are currently in read-only mode. Click "Edit Details" to update your node information.
                    </p>
                </div>
            )}
        </div>
    );
};

export default KycForm;