import React from 'react';
import { ShieldCheck, Zap, Globe, Users, Trophy, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
            <main className="flex-grow">
                {/* Hero Section: The Karan Group Identity */}
                <section className="relative py-24 bg-slate-900 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-20 -mr-20 -mt-20" />
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">
                            The Karan Group Legacy
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mt-8 leading-none">
                            Building a <span className="text-orange-500">Diversified</span> <br /> Future Together.
                        </h1>
                        <p className="text-slate-400 max-w-3xl mx-auto mt-8 text-lg font-medium leading-relaxed">
                            Karan Group is a premier multi-industry conglomerate with a footprint in Digital Media, Music Production, Hospitality, and Real Estate. We empower our community members to earn across all our business verticals through a single unified platform.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision: Focused on Community Wealth */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                                        <Target size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Our Mission</h2>
                                </div>
                                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                    To create a sustainable earning ecosystem where technology meets traditional business. We aim to provide every community member with the tools to generate professional commissions from our established media and property networks.
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                        <Globe size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Our Vision</h2>
                                </div>
                                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                    To become India's most trusted decentralized business house, fostering financial independence for 1 million+ partners through our 3x10 automated matrix and multi-vertical business growth.
                                </p>
                            </div>
                        </div>

                        {/* Visual Conglomerate Grid */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <div className="space-y-4">
                                <div className="h-48 bg-orange-500 rounded-[2rem] flex items-center justify-center text-white font-black italic p-6 text-center leading-tight">MEDIA & NEWS</div>
                                <div className="h-64 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black italic p-6 text-center leading-tight">REAL ESTATE & LOANS</div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="h-64 bg-slate-800 rounded-[2rem] flex items-center justify-center text-white font-black italic p-6 text-center leading-tight">HOSPITALITY & HOTELS</div>
                                <div className="h-48 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white font-black italic p-6 text-center leading-tight">MUSIC & ENTERTAINMENT</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Why Partner With Us?</h2>
                            <p className="text-slate-400 uppercase text-[10px] font-bold tracking-[0.4em] mt-2">The Karan Group Advantage</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: <ShieldCheck className="text-orange-500" />, title: "Trust & Transparency", desc: "Every transaction and commission is logged and verified on our automated secure node system." },
                                { icon: <Zap className="text-blue-500" />, title: "Rapid Scalability", desc: "Our 3x10 matrix ensures that your network grows exponentially with spillover support." },
                                { icon: <Trophy className="text-yellow-500" />, title: "Proven Success", desc: "Over ₹50L+ in commissions distributed across our growing family of digital promoters." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 hover:shadow-xl transition-all group">
                                    <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h3 className="text-xl font-black uppercase italic mb-4">{item.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Growth Stats Section */}
                <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                        <div>
                            <div className="text-5xl font-black text-orange-500 tracking-tighter mb-2">10K+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Node Partners</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-orange-500 tracking-tighter mb-2">04+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Verticals</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-orange-500 tracking-tighter mb-2">₹50L+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commission Disbursed</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-orange-500 tracking-tighter mb-2">24/7</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert Node Support</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;
