import React from 'react';
import { FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { Scale } from 'lucide-react';

const Disclaimer = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* 🛡️ Enterprise-Grade Disclaimer Container */}
                <div className="bg-white border border-slate-200 p-8 md:p-14 rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden group">

                    {/* Decorative Background Icon */}
                    <div className="absolute -top-10 -right-10 text-slate-100 group-hover:text-orange-50 transition-colors duration-500">
                        <Scale size={240} />
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 z-10">
                        <FaShieldAlt className="text-orange-500" />
                        Transparency Protocol
                    </div>

                    {/* Main Icon */}
                    <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-8 z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-inner">
                        <FaInfoCircle className="text-orange-600 text-4xl" />
                    </div>

                    {/* Content Header */}
                    <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 z-10 uppercase italic tracking-tighter leading-none">
                        Our Commitment to <span className="text-orange-600">Integrity</span>
                    </h4>

                    {/* Legal/Informational Text */}
                    <div className="relative z-10 space-y-4">
                        <p className="text-slate-600 text-sm md:text-base font-semibold leading-loose max-w-3xl mx-auto">
                            Engagement with the <span className="text-slate-900 font-black italic">KARAN GROUP</span> ecosystem is a performance-driven business partnership.
                            Please note that all earnings are <span className="text-orange-600 font-black underline decoration-2 underline-offset-4">100% Commission-Based</span>,
                            derived exclusively from validated service sales and successful referrals across our business verticals.
                        </p>

                        <div className="h-px w-24 bg-orange-200 mx-auto" />

                        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-2xl mx-auto italic">
                            Returns are not guaranteed and are strictly subject to individual network performance, market volatility, and operational adherence. This is a digital business node opportunity, not a fixed-salary employment or guaranteed investment scheme.
                        </p>
                    </div>

                    {/* Bottom Accreditation Tag */}
                    <div className="mt-10 pt-6 border-t border-slate-100 w-full z-10">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Official Disclaimer • Verified Business Node Management
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Disclaimer;

