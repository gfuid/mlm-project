import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center p-6 text-center">
            {/* 🚩 Error Icon Section */}
            <div className="relative mb-8">
                <div className="bg-orange-100 p-10 rounded-full animate-pulse">
                    <AlertTriangle size={80} className="text-orange-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-black px-4 py-2 rounded-xl text-2xl shadow-lg">
                    404
                </div>
            </div>

            {/* 📝 Text Content */}
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                Node <span className="text-orange-600">Not Found</span>
            </h1>
            <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                Oops! The network path you are looking for doesn't exist or has been moved to a different coordinate.
            </p>

            {/* 🔗 Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl active:scale-95 no-underline"
                >
                    <Home size={18} /> Back to Home
                </Link>

                <button
                    onClick={() => window.history.back()}
                    className="flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                    <ArrowLeft size={18} /> Go Back
                </button>
            </div>

            {/* 🛡️ Footer Branding */}
            <div className="mt-20 flex items-center gap-2 opacity-30 select-none">
                <div className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded font-bold text-xs">K</div>
                <span className="font-black text-xs tracking-tighter italic text-slate-900">KARAN ADS NODE SECURE</span>
            </div>
        </div>
    );
};

export default NotFound;