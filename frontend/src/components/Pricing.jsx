import React from 'react';
import { Link } from 'react-router-dom';
// 🚩 FaGlobal ko hata kar FaGlobe aur FaChartLine add kiya hai
import { FaCheckCircle, FaShieldAlt, FaGlobe, FaChartLine, FaRocket } from 'react-icons/fa';

const Pricing = () => {
    const nodeFeatures = [
        { title: "Multi-Industry Commission Rights", desc: "Earn from Media, Real Estate, Music, and Hotels." },
        { title: "Automated 3x10 Matrix Engine", desc: "Benefit from system-wide spillover and rapid growth." },
        { title: "1-Year Premium Ad Package", desc: "Promote your own brand with our 1+1 Ad Free bonus." },
        { title: "Verified Partner ID & Dashboard", desc: "Real-time tracking of team, wallet, and analytics." }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[120px] opacity-40 -mr-20 -mt-20" />

            <div className="container mx-auto px-6 text-center mb-16 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4 block">
                    Institutional Partnership
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                    Activate Your <span className="text-orange-600">Enterprise Node</span>
                </h2>
                <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed">
                    Secure your position in India's most diversified digital ecosystem. One activation, a lifetime of multi-vertical returns.
                </p>
            </div>

            <div className="container mx-auto px-6 flex justify-center relative z-10">
                <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden max-w-xl w-full border border-slate-100 group">

                    <div className="bg-slate-900 p-12 text-center text-white relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-50" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-6 relative z-10">Partner Activation Fee</h3>
                        <div className="flex justify-center items-baseline relative z-10">
                            <span className="text-7xl font-black tracking-tighter italic">₹5000</span>
                            <span className="ml-3 text-slate-400 text-sm font-black uppercase tracking-widest italic">/ Lifetime Access</span>
                        </div>
                    </div>

                    <div className="p-10 md:p-14">
                        <div className="space-y-8 mb-12">
                            {nodeFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start group">
                                    <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center mr-5 group-hover:bg-orange-600 transition-colors">
                                        <FaCheckCircle className="text-orange-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-black text-slate-900 uppercase italic text-sm tracking-tight">{feature.title}</h4>
                                        <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/register"
                            className="relative block w-full py-6 bg-orange-600 text-white text-center rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-xl shadow-orange-600/30 hover:bg-orange-700 transition-all active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                SECURE MY NODE NOW <FaRocket />
                            </span>
                        </Link>

                        <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <FaShieldAlt className="text-orange-600" />
                            Secure End-to-End Encryption Enabled
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
