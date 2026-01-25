import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

const MasterLoader = ({ message = "Establishing Master Link..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <div className="relative flex items-center justify-center">
                {/* Outer Rotating Ring */}
                <div className="absolute w-24 h-24 border-4 border-t-orange-600 border-r-transparent border-b-orange-600/20 border-l-transparent rounded-full animate-spin"></div>

                {/* Inner Static Icon */}
                <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-2xl shadow-orange-600/20">
                    <ShieldCheck size={32} className="text-orange-500 animate-pulse" />
                </div>
            </div>

            {/* Loading Message */}
            <div className="mt-10 flex flex-col items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 italic animate-bounce">
                    System Syncing
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Loader2 size={14} className="animate-spin text-slate-500" />
                    <p className="text-xs font-bold text-slate-400 uppercase italic tracking-widest">
                        {message}
                    </p>
                </div>
            </div>

            {/* Bottom Tech Detail */}
            <div className="absolute bottom-10">
                <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">
                    Karan Ad Agency • Security Protocol 2.0
                </p>
            </div>
        </div>
    );
};

export default MasterLoader;