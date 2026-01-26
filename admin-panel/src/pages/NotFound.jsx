import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, MoveLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="p-5 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <ShieldAlert size={60} className="text-red-500 animate-pulse" />
                    </div>
                </div>

                <h1 className="text-6xl font-black text-white mb-2 italic tracking-tighter">
                    404 <span className="text-orange-600">ERROR</span>
                </h1>

                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                    Access Denied: The requested protocol does not exist.
                </p>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin')}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-3 italic"
                >
                    <MoveLeft size={16} /> Return to Master Control
                </button>
            </div>
        </div>
    );
};

export default NotFound;