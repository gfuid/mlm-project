import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color = "orange", desc, isCurrency = false }) => {

    // Dynamic Color Mapping for Border and Glow
    const colorClasses = {
        orange: "border-orange-500/20 shadow-orange-600/5 hover:border-orange-500/50",
        blue: "border-blue-500/20 shadow-blue-600/5 hover:border-blue-500/50",
        green: "border-green-500/20 shadow-green-600/5 hover:border-green-500/50",
        red: "border-red-500/20 shadow-red-600/5 hover:border-red-500/50"
    };

    const iconColors = {
        orange: "text-orange-500 bg-orange-500/10",
        blue: "text-blue-500 bg-blue-500/10",
        green: "text-green-500 bg-green-500/10",
        red: "text-red-500 bg-red-500/10"
    };

    return (
        <div className={`bg-slate-900/40 backdrop-blur-md border ${colorClasses[color]} rounded-[2.5rem] p-6 transition-all duration-500 group shadow-xl hover:-translate-y-2`}>

            {/* 🟦 HEADER SECTION */}
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${iconColors[color]} transition-transform group-hover:scale-110 duration-500`}>
                    {icon}
                </div>
                <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                    <ArrowUpRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
            </div>

            {/* 📝 BODY SECTION */}
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                    {title}
                </p>
                <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic flex items-baseline gap-1">
                    {isCurrency && <span className="text-sm font-bold text-orange-600">₹</span>}
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h2>
            </div>

            {/* 🏁 FOOTER SECTION */}
            <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center gap-2">
                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    <span>Live</span>
                </div>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic truncate">
                    {desc || "System Verified Data"}
                </p>
            </div>
        </div>
    );
};

export default StatCard;