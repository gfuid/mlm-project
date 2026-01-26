import React, { useState } from 'react';
import { Shield, AlertTriangle, FileText, CheckCircle, XCircle, Info, Scale } from 'lucide-react';

// Reusable Section Component
const Section = ({ icon, title, color, children }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        red: 'from-red-500 to-red-600',
        orange: 'from-orange-500 to-orange-600',
        green: 'from-green-500 to-green-600',
        slate: 'from-slate-600 to-slate-700'
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-gradient-to-r ${colorClasses[color]} text-white rounded-xl`}>
                    {icon}
                </div>
                <h2 className="text-xl font-black uppercase text-gray-900">{title}</h2>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};

// Reusable Point Component
const Point = ({ children }) => (
    <div className="flex items-start gap-3">
        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
        <p className="text-sm text-gray-700 leading-relaxed">
            {children}
        </p>
    </div>
);

const TermsAndConditions = () => {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <Shield size={40} />
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tight">Terms & Conditions</h1>
                            <p className="text-sm opacity-90 font-bold uppercase tracking-widest mt-1">
                                Karan Ads Enterprise - Member Agreement
                            </p>
                        </div>
                    </div>
                    <p className="text-sm opacity-90 font-semibold">
                        Last Updated: January 27, 2026
                    </p>
                </div>

                {/* Critical Warning */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-black text-red-900 uppercase mb-2">
                                ⚠️ Mandatory Agreement
                            </h3>
                            <p className="text-sm text-red-800 font-semibold leading-relaxed">
                                By joining Karan Ads, you acknowledge that you have read, understood, and unconditionally accept all terms mentioned below. This is a legally binding contract.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Section 1: Business Model */}
                    <Section
                        icon={<FileText />}
                        title="1. Business Model & Structure"
                        color="blue"
                    >
                        <Point>
                            <strong>Referral-Based System:</strong> Karan Ads operates a multi-level marketing (MLM) structure where income is generated through team building and referrals.
                        </Point>
                        <Point>
                            <strong>3-Member Requirement:</strong> Each member must refer exactly <span className="font-black text-orange-600">3 active members</span> to complete Level 1 and earn ₹1,500. Further income depends on your team's performance.
                        </Point>
                        <Point>
                            <strong>Performance-Based Income:</strong> Your earnings are directly tied to your team's active membership count. There is <span className="font-black text-red-600">NO GUARANTEED INCOME</span>.
                        </Point>
                        <Point>
                            <strong>Team Structure:</strong> Your total team includes all members referred by you and sub-members referred by them (cascading levels).
                        </Point>
                    </Section>

                    {/* Section 2: Income Disclaimer */}
                    <Section
                        icon={<XCircle />}
                        title="2. Income & Earnings Disclaimer"
                        color="red"
                    >
                        <Point>
                            <strong>No Income Guarantee:</strong> Karan Ads makes <span className="font-black text-red-600">ZERO GUARANTEES</span> regarding income, profits, or financial success.
                        </Point>
                        <Point>
                            <strong>Performance-Dependent:</strong> All income levels shown (₹1,500 to ₹1,96,84,500) are theoretical maximums achievable only if you build the required team size (3 to 59,049 active members).
                        </Point>
                        <Point>
                            <strong>Individual Results Vary:</strong> Past performance of other members does not guarantee your success. Most members may earn little to no income.
                        </Point>
                        <Point>
                            <strong>Risk Acknowledgment:</strong> You understand that joining involves financial risk and you may not recover your membership fees.
                        </Point>
                    </Section>

                    {/* Section 3: NO REFUND POLICY */}
                    <Section
                        icon={<XCircle />}
                        title="3. No Refund Policy"
                        color="red"
                    >
                        <Point>
                            <strong>All Sales Final:</strong> All membership fees and payments made to Karan Ads are <span className="font-black text-red-600">100% NON-REFUNDABLE</span> under any circumstances.
                        </Point>
                        <Point>
                            <strong>No Exceptions:</strong> Refunds will NOT be issued for reasons including but not limited to:
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Inability to recruit team members</li>
                                <li>Failure to achieve income targets</li>
                                <li>Change of mind or personal circumstances</li>
                                <li>Dissatisfaction with the business model</li>
                                <li>Account deactivation or suspension</li>
                            </ul>
                        </Point>
                        <Point>
                            <strong>Payment Acknowledgment:</strong> By making payment, you confirm that you have carefully considered this investment and accept full financial responsibility.
                        </Point>
                    </Section>

                    {/* Section 4: Member Responsibilities */}
                    <Section
                        icon={<CheckCircle />}
                        title="4. Member Responsibilities"
                        color="orange"
                    >
                        <Point>
                            <strong>Ethical Conduct:</strong> Members must conduct business ethically and comply with all applicable laws.
                        </Point>
                        <Point>
                            <strong>Accurate Information:</strong> You are responsible for providing accurate personal and banking details. Karan Ads is not liable for errors you make.
                        </Point>
                        <Point>
                            <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your login credentials.
                        </Point>
                        <Point>
                            <strong>Prohibited Activities:</strong> Members must not engage in:
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>False income claims or misleading marketing</li>
                                <li>Spamming or unsolicited advertising</li>
                                <li>Creating multiple fake accounts</li>
                                <li>Unauthorized use of company branding</li>
                            </ul>
                        </Point>
                    </Section>

                    {/* Section 5: Withdrawal Policy */}
                    <Section
                        icon={<Info />}
                        title="5. Withdrawal & Payment Policy"
                        color="green"
                    >
                        <Point>
                            <strong>Minimum Withdrawal:</strong> Minimum withdrawal amount is ₹500. Funds are processed within 24-48 hours subject to admin approval.
                        </Point>
                        <Point>
                            <strong>Banking Errors:</strong> Karan Ads is not responsible for delays or errors caused by incorrect bank details provided by you.
                        </Point>
                        <Point>
                            <strong>Withdrawal Limits:</strong> The company reserves the right to set withdrawal limits or reject suspicious withdrawal requests.
                        </Point>
                        <Point>
                            <strong>Processing Fees:</strong> Applicable taxes, bank charges, or processing fees may be deducted from your withdrawal amount.
                        </Point>
                    </Section>

                    {/* Section 6: Termination */}
                    <Section
                        icon={<AlertTriangle />}
                        title="6. Account Suspension & Termination"
                        color="red"
                    >
                        <Point>
                            <strong>Violation Consequences:</strong> Karan Ads reserves the right to suspend or terminate your account immediately for violations of these terms.
                        </Point>
                        <Point>
                            <strong>No Compensation:</strong> Terminated members forfeit all pending commissions, withdrawals, and membership benefits. No refunds or compensation will be provided.
                        </Point>
                        <Point>
                            <strong>Final Decision:</strong> All decisions regarding account suspension or termination are final and non-appealable.
                        </Point>
                    </Section>

                    {/* Section 7: Liability Limitation */}
                    <Section
                        icon={<Scale />}
                        title="7. Limitation of Liability"
                        color="slate"
                    >
                        <Point>
                            <strong>No Guarantees:</strong> Karan Ads provides the platform "AS IS" without any warranties of any kind.
                        </Point>
                        <Point>
                            <strong>Financial Losses:</strong> The company is not liable for any financial losses, missed opportunities, or consequential damages arising from your participation.
                        </Point>
                        <Point>
                            <strong>Technical Issues:</strong> Karan Ads is not responsible for system downtime, technical errors, or data loss.
                        </Point>
                        <Point>
                            <strong>Third-Party Actions:</strong> We are not liable for actions of other members, payment processors, or external service providers.
                        </Point>
                    </Section>

                    {/* Section 8: Legal & Governing Law */}
                    <Section
                        icon={<Scale />}
                        title="8. Governing Law & Dispute Resolution"
                        color="slate"
                    >
                        <Point>
                            <strong>Jurisdiction:</strong> These terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in Rohtak, Haryana.
                        </Point>
                        <Point>
                            <strong>Dispute Resolution:</strong> Any disputes must first be resolved through written communication with Karan Ads support. Legal action should be a last resort.
                        </Point>
                        <Point>
                            <strong>Modification Rights:</strong> Karan Ads reserves the right to modify these terms at any time. Continued use after changes constitutes acceptance.
                        </Point>
                    </Section>

                    {/* Section 9: Data & Privacy */}
                    <Section
                        icon={<Shield />}
                        title="9. Data Privacy & Security"
                        color="blue"
                    >
                        <Point>
                            <strong>Data Usage:</strong> By joining, you consent to Karan Ads collecting and using your personal data for business operations.
                        </Point>
                        <Point>
                            <strong>Data Security:</strong> While we implement security measures, we cannot guarantee absolute protection against data breaches.
                        </Point>
                        <Point>
                            <strong>Third-Party Sharing:</strong> Your data may be shared with payment processors, banking partners, and government authorities as required by law.
                        </Point>
                    </Section>

                    {/* Section 10: Final Acknowledgment */}
                    <Section
                        icon={<AlertTriangle />}
                        title="10. Final Acknowledgment"
                        color="red"
                    >
                        <Point>
                            <strong>Full Understanding:</strong> By accepting these terms, you confirm that you:
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Have read and understood all terms completely</li>
                                <li>Accept the NO REFUND policy unconditionally</li>
                                <li>Understand income is not guaranteed</li>
                                <li>Accept full financial risk</li>
                                <li>Will not hold Karan Ads liable for any losses</li>
                            </ul>
                        </Point>
                        <Point>
                            <strong className="text-red-600">
                                IF YOU DO NOT AGREE TO THESE TERMS, DO NOT JOIN KARAN ADS.
                            </strong>
                        </Point>
                    </Section>
                </div>

                {/* Agreement Checkbox */}
                <div className="bg-white rounded-2xl p-8 mt-8 border-4 border-orange-200 shadow-xl">
                    <label className="flex items-start gap-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-6 h-6 mt-1 accent-orange-600 cursor-pointer"
                        />
                        <div>
                            <p className="text-lg font-black text-gray-900 mb-2">
                                I Agree to Terms & Conditions
                            </p>
                            <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                                I have read, understood, and unconditionally accept all terms and conditions mentioned above. I acknowledge that this is a legally binding agreement and I accept full responsibility for my decisions and actions.
                            </p>
                        </div>
                    </label>

                    <button
                        disabled={!agreed}
                        onClick={() => window.close()}
                        className={`w-full mt-6 py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${agreed
                                ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:from-orange-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {agreed ? '✓ Accept & Close' : '⚠️ Please Accept Terms'}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-gray-500 font-semibold">
                    <p>© 2026 Karan Ads Enterprise. All Rights Reserved.</p>
                    <p className="mt-1">For support, contact: support@karanads.com</p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;