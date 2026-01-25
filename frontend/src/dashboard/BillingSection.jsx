import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const BillingSection = ({ user }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    // 🔍 Debugging log (Ise check karein ki kya bankDetails fetch ho rahi hain)
    console.log("Invoice Debug - User:", user);

    if (!user?.isActive) return null;

    useEffect(() => {
        let interval;
        if (isDownloading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(prev => (prev >= 90 ? 90 : prev + 10));
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isDownloading]);

    const handleDownload = async () => {
        setIsDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        const element = document.getElementById('printable-invoice-content');
        const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: `Invoice_${user.userId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, logging: false, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            setProgress(100);
            setTimeout(() => { setIsDownloading(false); setProgress(0); }, 500);
        } catch (err) {
            console.error("PDF Error:", err);
            setIsDownloading(false);
        }
    };

    const BillTemplate = ({ id }) => (
        <div id={id} style={{
            backgroundColor: '#ffffff', padding: '30px', color: '#000000',
            fontFamily: 'serif', width: '794px', minHeight: '1120px',
            boxSizing: 'border-box', lineHeight: '1.4', margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '3px solid #000', paddingBottom: '10px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '12px', margin: '0', textDecoration: 'underline' }}>CASH MEMO</p>
                <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '5px 0' }}>KARAN GLOBAL</h1>
                <p style={{ fontSize: '10px', margin: '0' }}>Hansi Chowk, Karnal-132 001 (HARYANA)</p>
            </div>

            {/* User Info Section */}
            <div style={{ display: 'flex', borderBottom: '3px solid #000', fontSize: '13px' }}>
                <div style={{ flex: 1, padding: '10px', borderRight: '3px solid #000' }}>
                    <p style={{ margin: '3px 0' }}><strong>M/s:</strong> {user?.name?.toUpperCase() || "N/A"}</p>
                    <p style={{ margin: '3px 0', minHeight: '50px' }}>
                        {/* 🚩 ADDRESS FIX: Pehle direct check karein */}
                        <strong>Address:</strong> {user?.bankDetails?.address || user?.address || "STREET ADDRESS NOT FOUND"}
                    </p>
                </div>
                <div style={{ width: '200px', padding: '10px' }}>
                    <p style={{ margin: '3px 0' }}><strong>Bill No:</strong> #{user?.userId}</p>
                    <p style={{ margin: '3px 0' }}><strong>Dated:</strong> 20-01-2026</p>
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                        <th style={{ borderRight: '2px solid #000', padding: '8px', width: '50px' }}>S.N.</th>
                        <th style={{ borderRight: '2px solid #000', padding: '8px', textAlign: 'left' }}>PARTICULARS</th>
                        <th style={{ padding: '8px', textAlign: 'right', width: '120px' }}>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ height: '400px', verticalAlign: 'top' }}>
                        <td style={{ borderRight: '2px solid #000', padding: '8px', textAlign: 'center' }}>1.</td>
                        <td style={{ borderRight: '2px solid #000', padding: '8px' }}>
                            <div style={{ fontWeight: 'bold' }}>NETWORK ID ACTIVATION FEE</div>
                            <div style={{ fontSize: '11px' }}>LIFETIME ACCESS GRANTED</div>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>5000.00</td>
                    </tr>
                    <tr style={{ borderTop: '3px solid #000', borderBottom: '3px solid #000', fontWeight: 'bold' }}>
                        <td colSpan="2" style={{ borderRight: '2px solid #000', padding: '10px' }}>
                            TOTAL IN WORDS: FIVE THOUSAND ONLY
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', fontSize: '18px' }}>₹5000.00</td>
                    </tr>
                </tbody>
            </table>

            {/* Footer */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <p style={{ fontSize: '9px' }}>E. & O.E.</p>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold' }}>For KARAN GLOBAL</p>
                    <div style={{ height: '60px' }}></div>
                    <p style={{ fontSize: '11px', borderTop: '1px solid #000', minWidth: '150px', textAlign: 'center' }}>Auth. Signatory</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 mt-10 overflow-hidden">
            <div className="p-6 md:p-8 flex items-center justify-between border-b bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <FileText className="text-orange-600" size={20} />
                    <h3 className="font-black text-lg md:text-xl uppercase italic tracking-tighter">Billing</h3>
                </div>
                <button onClick={() => setShowPreview(true)} className="bg-slate-900 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 transition-all flex items-center gap-2">
                    <Eye size={14} /> Preview
                </button>
            </div>

            {showPreview && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 md:p-4">
                    <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[95vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-white">
                            <span className="font-black text-[10px] uppercase text-gray-500">Invoice Preview</span>
                            <button onClick={() => !isDownloading && setShowPreview(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        {/* 🚩 MOBILE VIEW FIX: Using overflow-auto and CSS scaling for mobile */}
                        <div className="flex-1 overflow-auto bg-slate-200 p-2 md:p-10 flex justify-start md:justify-center items-start">
                            <div className="origin-top scale-[0.45] sm:scale-[0.7] md:scale-100 shadow-2xl">
                                <BillTemplate id="printable-invoice-content" />
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`w-full py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${isDownloading ? 'bg-slate-100 text-slate-400' : 'bg-orange-600 text-white'
                                    }`}
                            >
                                {isDownloading ? `GENERATING PDF ${progress}%` : <><Download size={18} /> Download PDF</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingSection;