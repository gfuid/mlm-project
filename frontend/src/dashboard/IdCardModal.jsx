import React from 'react';
import { X, ShieldCheck, QrCode, Download } from 'lucide-react';

const IdCardModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="relative animate-in slide-in-from-bottom duration-500">
                <button onClick={onClose} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold uppercase text-xs">
                    Close <X size={20} />
                </button>

                {/* ID Card Design */}
                <div className="w-[350px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white">
                    <div className="bg-orange-600 h-24 p-6 flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-orange-600 w-8 h-8 flex items-center justify-center rounded-lg font-black italic">K</div>
                            <span className="text-white font-black text-xs tracking-tighter italic">KARAN ADS</span>
                        </div>
                        <span className="bg-white/20 text-[8px] text-white px-2 py-1 rounded-full font-bold uppercase">Official Member</span>
                    </div>

                    <div className="px-8 pb-10 flex flex-col items-center -mt-10">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden mb-4">
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                <ShieldCheck size={48} />
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{user.name}</h2>
                        <p className="text-orange-600 font-black text-[10px] tracking-widest uppercase mb-6">{user.rank}</p>

                        <div className="w-full space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                            <div className="flex justify-between">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Member ID</span>
                                <span className="text-[9px] font-black text-slate-800">{user.userId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Joined On</span>
                                <span className="text-[9px] font-black text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <QrCode size={40} className="text-slate-300" />
                            <div className="h-10 w-px bg-slate-200"></div>
                            <p className="text-[8px] text-slate-400 font-medium uppercase leading-tight">
                                This is a digitally verified <br /> identity of Karan Ad Agency.
                            </p>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-6 bg-white text-slate-900 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl flex justify-center items-center gap-2 hover:bg-orange-600 hover:text-white transition-all">
                    <Download size={14} /> Download ID Card
                </button>
            </div>
        </div>
    );
};

export default IdCardModal;