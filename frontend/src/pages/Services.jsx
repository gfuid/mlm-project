import React from 'react';
import {
    FaNewspaper,
    FaMusic,
    FaHotel,
    FaBullhorn,
    FaBuilding,
    FaWallet,
    FaArrowRight
} from 'react-icons/fa';

const Services = () => {
    const businessModules = [
        {
            icon: <FaBullhorn />,
            title: "Karan Ad Agency",
            tag: "Network Engine",
            desc: "The primary income source. Promote digital advertisements through your network node and earn direct commissions for every verified click and conversion."
        },
        {
            icon: <FaNewspaper />,
            title: "Karan Breaking News",
            tag: "Media Partner",
            desc: "Earn high-value commissions by facilitating advertisements and local business features on our 24/7 digital news and media network."
        },
        {
            icon: <FaMusic />,
            title: "Karan Music Haryana",
            tag: "Viral Rewards",
            desc: "Leverage our music production house. Promote new releases and earn stream-based rewards and royalties through our entertainment network."
        },
        {
            icon: <FaHotel />,
            title: "Karan Hotel Group",
            tag: "Referral Bonus",
            desc: "Unlock stay-based bonuses. Refer guests to our premium hotel partners and earn exclusive commissions for every successful booking."
        },
        {
            icon: <FaBuilding />,
            title: "Mehra Associate",
            tag: "Real Estate Deals",
            desc: "Access our high-ticket module. Facilitate property and loan deals through Mehra Associate to earn massive percentage-based closing commissions."
        },
        {
            icon: <FaWallet />,
            title: "Unified Wallet",
            tag: "Secure Node",
            desc: "All earnings from media, music, hospitality, and real estate flow into one secure dashboard. Withdraw your total income directly to your bank account anytime."
        }
    ];

    return (
        <section className="py-24 bg-white font-sans">
            {/* 💎 Header Section: The Vision */}
            <div className="container mx-auto px-6 text-center md:text-left mb-20">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                    Infinite Earning Potential
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-6">
                    Our Business <span className="text-orange-600">Ecosystem</span>
                </h2>
                <p className="text-slate-500 max-w-3xl text-sm md:text-base font-semibold leading-relaxed">
                    By becoming a Karan Group partner, you don't just join one agency—you activate a global node that earns commissions across multiple thriving industries. One registration, lifetime returns.
                </p>
            </div>

            {/* 🚀 Grid Section: The Modules */}
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businessModules.map((module, index) => (
                    <div key={index} className="group relative p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-orange-500 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                        {/* Hover Decorative Element */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-[6] transition-transform duration-700 z-0 opacity-50" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-slate-900 text-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    {module.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg border border-orange-200">
                                    {module.tag}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-4">
                                {module.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                                {module.description || module.desc}
                            </p>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-slate-50 flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all cursor-pointer">
                            Earning Structure Details <FaArrowRight size={10} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 🚩 Bottom Call-To-Action Node */}
            <div className="container mx-auto px-6 mt-20">
                <div className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600 rounded-full blur-[150px] opacity-20 -mr-20 -mt-20" />
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 relative z-10">
                        Join India's Most <span className="text-orange-500">Diversified</span> Network
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-10 text-sm font-medium relative z-10">
                        Become a Commission Partner today. Your single registration unlocks all six business verticals in our growth ecosystem.
                    </p>
                    <button className="relative z-10 bg-orange-600 hover:bg-orange-700 text-white px-12 py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-orange-600/30">
                        Activate My Partner Node
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Services;

