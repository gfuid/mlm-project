import React, { useRef, useState } from 'react';
import { X, ShieldCheck, QrCode, Download, Mail, Phone, MapPin, Calendar, Award, Crown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const IdCardModal = ({ isOpen, onClose, user }) => {
    const cardRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen || !user) return null;

    // 🚩 Helper to safely get nested details
    const mobile = user.mobile || "Not Provided";
    const rank = user.rank || "Promoter";
    // Address nested object se nikalna
    const address = user.bankDetails?.address || "Address Not Set";
    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const cardElement = cardRef.current;
            if (!cardElement) return;

            // Give the UI a moment to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardElement, {
                backgroundColor: "#ffffff",
                scale: 3,
                useCORS: true,
                // 🚩 This ignores the unsupported oklch functions 
                // if they are still present in other parts of the page
                ignoreElements: (element) => element.classList.contains('unsupported-style'),
                onclone: (clonedDoc) => {
                    // Manually force standard colors in the clone if needed
                    const clonedCard = clonedDoc.getElementById('id-card-content');
                    if (clonedCard) clonedCard.style.color = '#000000';
                }
            });

            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = image;
            link.download = `ID-Card-${user.userId}.png`;
            link.click();

            setIsDownloading(false);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed due to CSS incompatibility. Please try again.');
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 overflow-y-auto">
            <div className="relative max-h-full py-10">
                <button onClick={onClose} className="absolute top-2 right-0 bg-white/10 hover:bg-red-600 text-white p-2 rounded-full transition-all z-[110]">
                    <X size={20} />
                </button>

                {/* ID Card */}
                <div ref={cardRef} className="bg-white rounded-[2rem] overflow-hidden shadow-2xl w-[340px] border-4 border-slate-200">
                    <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-pink-600 h-28 p-5 flex justify-between items-start relative">
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-orange-600 w-10 h-10 flex items-center justify-center rounded-xl font-black shadow-xl">
                                <Crown size={20} />
                            </div>
                            <div>
                                <span className="text-white font-black text-base italic">KARAN ADS</span>
                                <p className="text-white/80 text-[7px] font-bold uppercase tracking-widest">Enterprise Member</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex flex-col items-center -mt-10 relative z-20">
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden mb-3">
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <ShieldCheck size={48} className="text-orange-600" />
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-slate-800 uppercase italic">{user.name}</h2>

                        <div className="flex items-center gap-1.5 mt-1 mb-4">
                            <Award size={12} className="text-orange-600" />
                            <p className="text-orange-600 font-black text-[10px] tracking-widest uppercase italic">{rank}</p>
                        </div>

                        {/* 📊 FETCHED DETAILS GRID */}
                        <div className="w-full space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 text-[10px]">
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-400 uppercase">ID No:</span>
                                <span className="font-black text-slate-800">{user.userId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-400 uppercase">Mobile:</span>
                                <span className="font-black text-slate-800">{mobile}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-400 uppercase">Join Date:</span>
                                <span className="font-black text-slate-800">{joinedDate}</span>
                            </div>
                            {/* Address fetch logic */}
                            <div className="flex justify-between gap-4 border-t border-slate-200 pt-2">
                                <span className="font-bold text-slate-400 uppercase">Address:</span>
                                <span className="font-black text-slate-800 text-right leading-tight max-w-[140px]">{address}</span>
                            </div>
                        </div>

                        <div className="w-full bg-white p-3 rounded-xl flex items-center gap-3 border border-orange-100">
                            <QrCode size={36} className="text-orange-600" />
                            <p className="text-[7px] text-slate-500 font-bold uppercase italic leading-tight">
                                This ID is digitally encrypted and verified by the Karan Ads Master Node system.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-[10px] transition-all active:scale-95 ${isDownloading ? 'bg-slate-700 text-slate-400' : 'bg-gradient-to-r from-orange-600 to-pink-600 text-white'}`}
                >
                    {isDownloading ? <><Loader2 size={16} className="animate-spin" /> Fetching...</> : <><Download size={16} /> Download Card</>}
                </button>
            </div>
        </div>
    );
};

export default IdCardModal;