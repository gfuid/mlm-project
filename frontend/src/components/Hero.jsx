import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="bg-white py-16 md:py-24 overflow-hidden relative">
            {/* Subtle Grid Background for that "Tech/Enterprise" feel */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

            <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center relative z-10">
                {/* Text Content */}
                <div className="md:w-1/2 flex flex-col items-start text-left mt-12 md:mt-0">
                    <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic shadow-xl">
                        <FaShieldAlt className="text-orange-500" />
                        Official Earning Node 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] uppercase italic tracking-tighter">
                        One Platform.<br />
                        <span className="text-orange-600">Six Industries.</span><br />
                        Infinite Growth.
                    </h1>

                    <p className="mt-8 text-lg text-slate-500 max-w-lg leading-relaxed font-semibold">
                        Karan Group is a diversified conglomerate. Activate your node today to earn across our Media, Music, Hospitality, Real Estate, and Financial networks.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/register"
                            className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-2xl shadow-orange-600/30 hover:bg-orange-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Activate Partner Node <FaArrowRight />
                        </Link>
                        <Link
                            to="/membership"
                            className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase italic tracking-widest text-xs border-2 border-slate-200 hover:border-slate-900 transition-all flex items-center justify-center"
                        >
                            Explore Ecosystem
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black">
                                    NODE_{i}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Join 10,000+ Active Partners
                        </p>
                    </div>
                </div>

                {/* Image Content (Visualizing the Conglomerate) */}
                <div className="md:w-1/2 flex justify-center md:justify-end relative">
                    <div className="relative z-10 p-4 bg-white rounded-[3rem] shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-700">
                        <img
                            src="https://placehold.co/600x500/0f172a/f97316?text=KARAN+GROUP+ECOSYSTEM+2026"
                            alt="Ecosystem Preview"
                            className="rounded-[2rem] shadow-inner"
                        />
                    </div>

                    {/* The Fixed Blob: Now using a more subtle corporate color */}
                    <div className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>

                    {/* Floating Stats Tag */}
                    <div className="absolute bottom-10 left-0 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 z-20 animate-bounce transition-all">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payouts</p>
                        <p className="text-2xl font-black text-orange-600 tracking-tighter">₹50L+</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

