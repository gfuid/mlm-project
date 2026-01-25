import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaCrown, FaGift, FaRocket, FaShieldAlt, FaCoins } from 'react-icons/fa';

const Membership = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <main className="flex-grow">
                {/* 🚀 Hero Section: The Investment Gate */}
                <section className="relative py-24 bg-slate-900 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10" />

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">
                            Official Global Partnership
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mt-8 leading-none">
                            Activate Your <span className="text-orange-500">Business Node</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-base md:text-lg font-medium">
                            Join the Karan Group ecosystem. A single activation unlocks lifetime commissions across Media, Real Estate, Music, and Hospitality.
                        </p>

                        <div className="mt-12 inline-flex flex-col items-center">
                            <div className="bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-2xl md:text-4xl shadow-[0_0_50px_rgba(234,88,12,0.3)] animate-pulse border-4 border-orange-500/50">
                                JOINING: ₹5,000/-
                            </div>
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-4">One-Time Activation • Lifetime Earning</p>
                        </div>
                    </div>
                </section>

                {/* 💎 Value Proposition Section */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Premium Partner Benefits</h2>
                            <div className="w-24 h-2 bg-orange-600 mx-auto mt-4 rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                { icon: <FaShieldAlt />, title: "Authorized Partner ID", desc: "Receive a verified digital identity card as an official promoter for Karan Group businesses." },
                                { icon: <FaRocket />, title: "1-Year Ad Package", desc: "Get a '1+1 Free' advertising slot on our News and Digital platforms to boost your own ventures." },
                                { icon: <FaCoins />, title: "Multi-Vertical Income", desc: "Earn from Real Estate referrals, Music streams, and Hotel bookings—all via your automated wallet." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group text-center">
                                    <div className="text-4xl text-orange-600 mb-6 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h3 className="font-black text-xl text-slate-900 uppercase italic mb-4 tracking-tight">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📊 Matrix Compensation Table */}
                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">The 3x10 Matrix Engine</h2>
                            <p className="text-orange-600 font-bold uppercase text-xs tracking-widest mt-2 underline">Automated Spillover & Growth Rewards</p>
                        </div>

                        <div className="overflow-x-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] border border-slate-100">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="p-6 font-black uppercase text-[10px] tracking-widest">Level</th>
                                        <th className="p-6 font-black uppercase text-[10px] tracking-widest">Rank</th>
                                        <th className="p-6 font-black uppercase text-[10px] tracking-widest">Team Size</th>
                                        <th className="p-6 font-black uppercase text-[10px] tracking-widest">Net Income (₹)</th>
                                        <th className="p-6 font-black uppercase text-[10px] tracking-widest">Lifestyle Reward</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700 bg-white">
                                    {[
                                        { lvl: 1, rank: "Promoter", team: 3, income: "1,500", reward: "Standard ID" },
                                        { lvl: 2, rank: "City Manager", team: 9, income: "3,000", reward: "Digital Badge" },
                                        { lvl: 3, rank: "Distt. Manager", team: 27, income: "9,000", reward: "Official Kit" },
                                        { lvl: 4, rank: "State Manager", team: 81, income: "27,000", reward: "Business Medal" },
                                        { lvl: 5, rank: "National Head", team: 243, income: "81,000", reward: "Corporate Medal" },
                                        { lvl: 6, rank: "Boss Medal", team: 729, income: "2,43,000", reward: "📺 Smart LED TV" },
                                        { lvl: 7, rank: "Karan Medal", team: "2,187", income: "7,29,000", reward: "🛵 Honda Activa" },
                                        { lvl: 8, rank: "Arjun Medal", team: "6,561", income: "21,87,000", reward: "🏍️ Royal Enfield Bullet" },
                                        { lvl: 9, rank: "Gold Medal", team: "19,684", income: "65,61,500", reward: "🛡️ Pension Plan (10L Fund)" },
                                        { lvl: 10, rank: "Hero No. 1", team: "59,049", income: "1,96,84,500", reward: "🏠🚘 House + Car (50L Fund)" },
                                    ].map((row, index) => (
                                        <tr key={index} className="border-b border-slate-50 hover:bg-orange-50/30 transition-colors">
                                            <td className="p-6 font-black text-slate-400">#{row.lvl}</td>
                                            <td className="p-6 font-black text-orange-600 uppercase italic text-xs">{row.rank}</td>
                                            <td className="p-6 font-bold text-slate-600">{row.team}</td>
                                            <td className="p-6 font-black text-slate-900">₹{row.income}</td>
                                            <td className="p-6 font-black text-indigo-600 text-[10px] uppercase italic">{row.reward}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-20 text-center">
                            <Link to="/register" className="group relative inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all hover:bg-orange-600 shadow-2xl active:scale-95">
                                Start Your Partnership Node
                                <FaRocket className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Membership;

