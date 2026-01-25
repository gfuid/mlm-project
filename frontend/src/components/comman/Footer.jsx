import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0F172A] text-white pt-16 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* 1. Brand Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">K</div>
                        <span className="font-black text-xl tracking-tighter italic">KARAN ADS</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                        Empowering independent promoters through a secure, transparent, and high-performance network marketing ecosystem.
                    </p>
                    <div className="flex gap-4">
                        <Facebook size={18} className="text-slate-400 hover:text-orange-500 cursor-pointer transition" />
                        <Twitter size={18} className="text-slate-400 hover:text-orange-500 cursor-pointer transition" />
                        <Instagram size={18} className="text-slate-400 hover:text-orange-500 cursor-pointer transition" />
                    </div>
                </div>

                {/* 2. Quick Links */}
                <div>
                    <h4 className="font-bold uppercase text-[10px] tracking-widest text-orange-500 mb-6">Quick Navigation</h4>
                    <ul className="space-y-4 text-xs font-bold text-slate-300 uppercase tracking-wider list-none p-0">
                        <li><Link to="/" className="hover:text-orange-500 no-underline transition">Home</Link></li>
                        <li><Link to="/about" className="hover:text-orange-500 no-underline transition">About Network</Link></li>
                        <li><Link to="/membership" className="hover:text-orange-500 no-underline transition">Membership</Link></li>
                        <li><Link to="/services" className="hover:text-orange-500 no-underline transition">Our Services</Link></li>
                    </ul>
                </div>

                {/* 3. Support & Legal */}
                <div>
                    <h4 className="font-bold uppercase text-[10px] tracking-widest text-orange-500 mb-6">Support Center</h4>
                    <ul className="space-y-4 text-xs font-bold text-slate-300 uppercase tracking-wider list-none p-0">
                        <li><Link to="/login" className="hover:text-orange-500 no-underline transition">Member Login</Link></li>
                        <li><Link to="/register" className="hover:text-orange-500 no-underline transition">Join Network</Link></li>
                        <li><Link to="/privacy" className="hover:text-orange-500 no-underline transition">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-orange-500 no-underline transition">Terms of Node</Link></li>
                    </ul>
                </div>

                {/* 4. Contact Details */}
                <div>
                    <h4 className="font-bold uppercase text-[10px] tracking-widest text-orange-500 mb-6">Contact Us</h4>
                    <ul className="space-y-4 text-xs font-medium text-slate-400 list-none p-0">
                        <li className="flex items-start gap-3">
                            <Mail size={16} className="text-orange-500 mt-1" />
                            <span>support@karanads.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Phone size={16} className="text-orange-500 mt-1" />
                            <span>+91 83079 67782</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin size={16} className="text-orange-500 mt-1" />
                            <span>Karan Ad Agency HQ, <br />Digital Node Sector, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    © 2026 KARAN AD AGENCY. ALL RIGHTS RESERVED.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase">
                    <ShieldCheck size={14} /> 256-Bit Node Encryption Active
                </div>
            </div>
        </footer>
    );
};

export default Footer;