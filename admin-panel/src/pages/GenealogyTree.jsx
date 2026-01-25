
import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // 🚩 Centralized API instance
import Sidebar from '../components/common/Sidebar';
import { Network, User, ChevronDown, ChevronRight, Search, Loader2 } from 'lucide-react';

const GenealogyTree = () => {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState("KARAN1001"); // Default root

    const fetchTree = async (userId) => {
        if (!userId) return;
        try {
            setLoading(true);
            // ✅ API instance baseURL aur Headers automatically handle karega
            const res = await API.get(`/admin/tree/${userId}`);

            if (res.data.success) {
                setTreeData(res.data.data);
            }
        } catch (err) {
            console.error("Tree Fetch Error:", err);
            setTreeData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTree(searchId);
    }, []);

    // Recursive Component to render branches
    const TreeNode = ({ node }) => {
        const [isOpen, setIsOpen] = useState(true);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className="ml-8 mt-4 border-l-2 border-slate-800 pl-6 relative">
                {/* Connector Line */}
                <div className="absolute -left-[2px] top-4 w-6 h-0.5 bg-slate-800"></div>

                <div
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${node.role === 'admin'
                            ? 'bg-orange-600/10 border-orange-500/50'
                            : 'bg-slate-900 border-slate-800 hover:border-orange-500/30'
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className={`p-2 rounded-lg ${node.role === 'admin' ? 'bg-orange-600 shadow-lg shadow-orange-600/20' : 'bg-slate-800 text-slate-400'}`}>
                        <User size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-[11px] font-black uppercase text-white tracking-tight leading-none">{node.name}</p>
                        <p className="text-[9px] font-bold text-orange-500 font-mono italic mt-1">{node.userId}</p>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        {/* Status Indicator */}
                        <div className={`w-1.5 h-1.5 rounded-full ${node.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>

                        {hasChildren && (
                            <div className="text-slate-600">
                                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recursion Logic */}
                {isOpen && hasChildren && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        {node.children.map((child) => (
                            <TreeNode key={child.userId || child._id} node={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 p-6 md:p-10 overflow-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                            Network <span className="text-orange-600">Mapping</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                            Visualizing Multi-Level Spillover Structure
                        </p>
                    </div>

                    {/* Search Component */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Target User ID..."
                                className="w-full md:w-56 bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-orange-600/50 transition-all uppercase tracking-widest"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => fetchTree(searchId)}
                            className="bg-orange-600 hover:bg-orange-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all shadow-xl shadow-orange-600/20 active:scale-95 italic"
                        >
                            Generate Map
                        </button>
                    </div>
                </div>

                {/* Tree Visualization Container */}
                <div className="bg-slate-900/30 p-4 md:p-10 rounded-[3rem] border border-slate-800/50 min-h-[600px] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Network size={280} />
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[500px]">
                            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] italic animate-pulse">
                                Reconstructing Neural Network...
                            </p>
                        </div>
                    ) : treeData ? (
                        <div className="max-w-4xl mx-auto">
                            <TreeNode node={treeData} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                            <div className="p-6 bg-slate-800/50 rounded-full">
                                <Search size={40} className="text-slate-600" />
                            </div>
                            <p className="text-slate-600 font-black uppercase italic tracking-[0.2em] text-sm">
                                No Node Records Detected for this ID
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenealogyTree;