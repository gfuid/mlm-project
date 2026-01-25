// frontend/src/pages/MyTeam.jsx

import React, { useEffect, useState } from "react";
import API from "../api/axios"; // 🚩 Centralized API instance
import { Users, UserCheck, UserMinus, ShieldCheck, Search } from "lucide-react";

const MyTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // ✅ Localhost hataya, API instance baseURL automatically handle karega
        API.get("/user/my-team")
            .then((res) => {
                if (res.data.success) {
                    setTeam(res.data.data);
                }
            })
            .catch((err) => console.error("Team Fetch Error:", err))
            .finally(() => setLoading(false));
    }, []);

    // Filter logic for search
    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.userId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">
                        My Direct <span className="text-orange-600">Network</span>
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                        Monitor your first-level team performance
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search Member ID or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Stats Summary Area */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Users size={20} /></div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase italic">Direct Team</p>
                        <p className="text-xl font-black text-slate-800 tracking-tighter">{team.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><UserCheck size={20} /></div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase italic">Active Nodes</p>
                        <p className="text-xl font-black text-slate-800 tracking-tighter">{team.filter(m => m.isActive).length}</p>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 italic">Member Name</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 italic">Identity Contact</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 italic">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 italic">Network Rank</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="p-10 text-center text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest italic">Scanning Network...</td></tr>
                            ) : filteredTeam.length > 0 ? (
                                filteredTeam.map((member) => (
                                    <tr key={member._id} className="group hover:bg-gray-50 transition-all duration-300">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black italic">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="text-sm font-black text-slate-800 uppercase italic">{member.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-xs font-bold text-slate-600">{member.mobile}</p>
                                            <p className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">ID: {member.userId || 'N/A'}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${member.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${member.isActive ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
                                                <span className="text-[9px] font-black uppercase italic">{member.isActive ? "Active" : "Inactive"}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-lg italic">
                                                {member.rank || "Promoter"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <UserMinus size={40} className="text-gray-200" />
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No active nodes found in this sector.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Note */}
            <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl flex items-center gap-4">
                <ShieldCheck className="text-orange-600" size={24} />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-left">
                    Direct team members are nodes directly connected via your unique referral identity link.
                </p>
            </div>
        </div>
    );
};

export default MyTeam;