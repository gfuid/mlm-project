import React, { useState, useEffect } from 'react';
import API from '../api/axios'; //
import { useAuth } from '../context/AuthContext'; //
import { User, ChevronDown, UserPlus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ReferralTree = () => {
    const { user } = useAuth(); //
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTree = async (userId) => {
        try {
            // Humne backend mein getTreeData logic banaya tha
            const res = await API.get(`/user/tree/${userId}`);
            if (res.data.success) {
                setTreeData(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to load network tree");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchTree(user.userId);
    }, [user]);

    if (loading) return <div className="p-10 text-center uppercase font-bold text-slate-400">Loading Node Network...</div>;

    // Recursive component ek node dikhane ke liye
    const TreeNode = ({ member }) => (
        <div className="flex flex-col items-center">
            <div className={`p-4 rounded-2xl border-2 transition-all w-40 text-center shadow-sm 
                ${member.isActive ? 'border-green-500 bg-green-50' : 'border-orange-200 bg-white'}`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 
                    ${member.isActive ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    {member.isActive ? <ShieldCheck size={20} /> : <User size={20} />}
                </div>
                <h4 className="text-[11px] font-black uppercase text-slate-800 truncate">{member.name}</h4>
                <p className="text-[9px] font-bold text-slate-500">{member.userId}</p>
                <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-bold 
                    ${member.isActive ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {member.isActive ? 'Active' : 'Pending'}
                </span>
            </div>

            {/* Downline Connectors */}
            {member.children && member.children.length > 0 && (
                <>
                    <div className="h-8 w-0.5 bg-slate-200"></div>
                    <div className="flex gap-4">
                        {member.children.map((child) => (
                            <TreeNode key={child.userId} member={child} />
                        ))}
                        {/* Matrix logic: Agar 3 se kam bacche hain toh Join slot dikhayein */}
                        {member.children.length < 3 && (
                            <div className="flex flex-col items-center opacity-40">
                                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 w-40 flex flex-col items-center justify-center">
                                    <UserPlus className="text-slate-400 mb-1" size={16} />
                                    <p className="text-[8px] font-bold uppercase">Open Slot</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-[#FDF8F1] min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Network <span className="text-orange-600">Genealogy</span></h1>
                <p className="text-xs text-slate-500 font-bold uppercase">Live Spillover Mapping</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl overflow-x-auto border border-orange-100">
                <div className="min-w-[800px] flex justify-center">
                    {treeData && <TreeNode member={treeData} />}
                </div>
            </div>
        </div>
    );
};

export default ReferralTree;