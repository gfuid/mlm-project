import React from 'react';
import { FaQuoteLeft, FaMedal, FaUsers, FaStar } from 'react-icons/fa';

const Testimonials = () => {
    const successStories = [
        {
            initial: "A",
            name: "Anjali Sharma",
            quote: "Joining the Karan Group ecosystem was a turning point. Promoting their Media and Music verticals has scaled my income beyond what I thought possible in digital marketing.",
            badge: "Platinum Media Partner",
            role: "Digital Promoter",
            accent: "orange"
        },
        {
            initial: "R",
            name: "Rahul Kumar",
            quote: "The 3x10 matrix system is incredibly transparent. Facilitating property deals via Mehra Associate alongside ad promotions has given me true financial freedom.",
            badge: "Top Real Estate Associate",
            role: "Node Partner",
            accent: "blue"
        },
        {
            initial: "P",
            name: "Priya Singh",
            quote: "I started with zero experience, but the training provided for the Hotel and Music modules was top-notch. It’s not just a platform; it’s a diversified business partnership.",
            badge: "Hospitality Lead Partner",
            role: "Certified Mentor",
            accent: "emerald"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 font-sans overflow-hidden">
            <div className="container mx-auto px-6 relative">
                {/* Decorative Background Elements */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-50" />

                <div className="text-center mb-20 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4 block">
                        Community Voices
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Real Partners. <span className="text-orange-600">Global Success.</span>
                    </h2>
                    <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-semibold">
                        Hear from the entrepreneurs and promoters who are building a future across our diverse business verticals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {successStories.map((story, index) => (
                        <div key={index} className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-900 text-orange-500 rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            {story.initial}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none">{story.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{story.role}</p>
                                        </div>
                                    </div>
                                    <FaQuoteLeft className="text-orange-100 text-3xl group-hover:text-orange-500 transition-colors" />
                                </div>

                                <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">
                                    "{story.quote}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FaMedal className="text-orange-600" />
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-800">
                                        {story.badge}
                                    </span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-orange-500 text-[8px]" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-20 relative z-10">
                    <button className="group relative inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all hover:bg-orange-600 shadow-2xl active:scale-95">
                        <FaUsers className="group-hover:scale-110 transition-transform" />
                        Become the Next Success Story
                    </button>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-6">
                        Verified Member Nodes • Transparency Protocol Enabled
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
