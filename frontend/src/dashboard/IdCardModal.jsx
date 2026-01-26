import React, { useRef, useState } from 'react';
import { X, ShieldCheck, QrCode, Download, Loader2, Crown, Award } from 'lucide-react';
import html2canvas from 'html2canvas';

const IdCardModal = ({ isOpen, onClose, user }) => {
    const cardRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen || !user) return null;

    // ✅ Extract all user details with multiple fallbacks
    const mobile = user.mobile || user.phone || user.contactNumber || "Not Provided";
    const rank = user.rank || user.level || user.membershipLevel || "Promoter";
    const email = user.email || "Not Provided";
    const address = user.bankDetails?.address || user.address || user.location || "Address Not Set";
    const joiningDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        })
        : user.joinedDate || "N/A";

    console.log('🔍 User Data:', {
        sponsorId: user.sponsorId,
        referredBy: user.referredBy,
        sponsor: user.sponsor,
        parentId: user.parentId,
        fullUser: user
    });

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            const cardElement = cardRef.current;
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // Wait for fonts and images to load
            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create canvas with explicit options
            const canvas = await html2canvas(cardElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: true,
                width: cardElement.offsetWidth,
                height: cardElement.offsetHeight,
                windowWidth: cardElement.scrollWidth,
                windowHeight: cardElement.scrollHeight,
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Failed to create image');
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Karan-Ads-ID-${user.userId || Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setIsDownloading(false);
            }, 'image/png', 1.0);

        } catch (error) {
            console.error('❌ Download Error:', error);
            alert(`Download failed: ${error.message}. Please try again or take a screenshot.`);
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="relative max-h-full py-10">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 text-white p-3 rounded-full transition-all z-[110] shadow-lg"
                    style={{ backgroundColor: '#dc2626' }}
                >
                    <X size={20} />
                </button>

                {/* ID CARD */}
                <div
                    ref={cardRef}
                    className="overflow-hidden shadow-2xl"
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        width: '360px',
                        border: '4px solid #e5e7eb',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                    }}
                >
                    {/* Header */}
                    <div
                        className="p-5 flex justify-between items-start relative"
                        style={{
                            height: '128px',
                            background: 'linear-gradient(to right, #ea580c, #f97316, #ec4899)'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div style={{
                                backgroundColor: '#ffffff',
                                color: '#ea580c',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                fontWeight: '900',
                                boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                            }}>
                                <Crown size={24} />
                            </div>
                            <div>
                                <div style={{
                                    color: '#ffffff',
                                    fontWeight: '900',
                                    fontSize: '18px',
                                    fontStyle: 'italic'
                                }}>
                                    KARAN ADS
                                </div>
                                <div style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    Enterprise Member
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="px-6 pb-6 flex flex-col items-center relative" style={{ marginTop: '-48px', zIndex: 20 }}>
                        {/* Avatar */}
                        <div style={{
                            width: '96px',
                            height: '96px',
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid #ffffff',
                            overflow: 'hidden',
                            marginBottom: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShieldCheck size={48} color="#ea580c" />
                            </div>
                        </div>

                        {/* Name */}
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '900',
                            color: '#1f2937',
                            textTransform: 'uppercase',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            marginBottom: '8px'
                        }}>
                            {user.name}
                        </h2>

                        {/* Rank Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#fff7ed',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            marginBottom: '16px'
                        }}>
                            <Award size={14} color="#ea580c" />
                            <span style={{
                                color: '#ea580c',
                                fontWeight: '900',
                                fontSize: '12px',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontStyle: 'italic'
                            }}>
                                {rank}
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div style={{
                            width: '100%',
                            backgroundColor: '#f9fafb',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            marginBottom: '16px',
                            fontSize: '12px'
                        }}>
                            <DetailRow label="ID NO:" value={user.userId} />
                            <DetailRow label="EMAIL:" value={email} isEmail />
                            <DetailRow label="MOBILE:" value={mobile} />
                            <DetailRow label="JOINED:" value={joiningDate} />
                            <DetailRow label="ADDRESS:" value={address} multiline />
                        </div>

                        {/* QR Section */}
                        <div style={{
                            width: '100%',
                            backgroundColor: '#ffffff',
                            padding: '12px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '2px solid #fed7aa'
                        }}>
                            <QrCode size={40} color="#ea580c" />
                            <p style={{
                                fontSize: '11px',
                                color: '#4b5563',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                fontStyle: 'italic',
                                lineHeight: '1.3',
                                margin: 0
                            }}>
                                This ID is digitally encrypted and verified by Karan Ads Master Node.
                            </p>
                        </div>

                        {/* Footer */}
                        <p style={{
                            textAlign: 'center',
                            color: '#9ca3af',
                            fontSize: '11px',
                            fontWeight: '700',
                            marginTop: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Karan Ads Enterprise © 2026
                        </p>
                    </div>
                </div>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{
                        width: '100%',
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        borderRadius: '16px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        backgroundColor: isDownloading ? '#4b5563' : '#ea580c',
                        color: '#ffffff',
                        border: 'none',
                        cursor: isDownloading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Generating Image...
                        </>
                    ) : (
                        <>
                            <Download size={18} />
                            Download ID Card
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Helper component for detail rows
const DetailRow = ({ label, value, isEmail, highlight, multiline }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: multiline ? '8px' : '16px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '8px',
        marginBottom: '8px',
        alignItems: multiline ? 'flex-start' : 'center'
    }}>
        <span style={{
            fontWeight: '700',
            color: '#6b7280',
            textTransform: 'uppercase',
            fontSize: '11px',
            flexShrink: 0
        }}>
            {label}
        </span>
        <span style={{
            fontWeight: '900',
            color: highlight ? '#ea580c' : '#1f2937',
            textAlign: 'right',
            fontSize: isEmail ? '10px' : '12px',
            maxWidth: multiline ? '200px' : '180px',
            wordBreak: isEmail || multiline ? 'break-all' : 'normal',
            lineHeight: multiline ? '1.3' : 'normal'
        }}>
            {value}
        </span>
    </div>
);

export default IdCardModal;