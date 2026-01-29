import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Sidebar from '../components/common/Sidebar';
import { Network, User, Search, Loader2, AlertCircle, Users, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const GenealogyTree = () => {
    const [rootUser, setRootUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState("KARAN1001");
    const [error, setError] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [teamStats, setTeamStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        directReferrals: 0
    });

    // Calculate team statistics
    const calculateStats = (node) => {
        let total = 0;
        let active = 0;
        let pending = 0;

        const traverse = (n) => {
            if (!n) return;

            // Count this node (excluding root for total count)
            total++;
            if (n.isActive) {
                active++;
            } else {
                pending++;
            }

            // Traverse children
            if (n.children) {
                n.children.forEach(child => traverse(child));
            }
        };

        // Count children only (exclude root)
        if (node.children) {
            node.children.forEach(child => traverse(child));
        }

        return {
            totalMembers: total,
            activeMembers: active,
            pendingMembers: pending,
            directReferrals: node.children?.length || 0
        };
    };

    // Fetch root user
    const fetchRootUser = async (userId) => {
        if (!userId || !userId.trim()) {
            toast.error('Please enter a valid User ID');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setExpandedNodes(new Set());

            const res = await API.get(`/admin/tree/${userId.trim()}`);

            if (res.data.success && res.data.data) {
                setRootUser(res.data.data);

                // Calculate statistics
                const stats = calculateStats(res.data.data);
                setTeamStats(stats);

                // Auto-expand root
                setExpandedNodes(new Set([res.data.data.userId]));
                toast.success(`Loaded: ${userId}`);
            } else {
                setRootUser(null);
                setError('User not found');
                toast.error('User not found');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load user';
            setError(errorMessage);
            setRootUser(null);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRootUser(searchId);
    }, []);

    // Toggle node expansion with lazy loading
    const toggleNode = async (node) => {
        const nodeId = node.userId;
        const newExpanded = new Set(expandedNodes);

        if (expandedNodes.has(nodeId)) {
            // Collapse
            newExpanded.delete(nodeId);
            setExpandedNodes(newExpanded);
        } else {
            // Expand - load children if not loaded
            if (!node.childrenLoaded && node.children && node.children.length > 0) {
                try {
                    const res = await API.get(`/admin/tree/${nodeId}`);
                    if (res.data.success && res.data.data) {
                        // Update node with loaded children
                        updateNodeInTree(rootUser, nodeId, res.data.data);
                    }
                } catch (err) {
                    toast.error('Failed to load children');
                    return;
                }
            }
            newExpanded.add(nodeId);
            setExpandedNodes(newExpanded);
        }
    };

    // Helper to update node in tree
    const updateNodeInTree = (tree, targetId, newData) => {
        if (tree.userId === targetId) {
            tree.children = newData.children;
            tree.childrenLoaded = true;
            setRootUser({ ...rootUser });
            return true;
        }
        if (tree.children) {
            for (let child of tree.children) {
                if (updateNodeInTree(child, targetId, newData)) {
                    return true;
                }
            }
        }
        return false;
    };

    // Visual Tree Node Component
    const TreeNode = ({ node, isRoot = false, isLast = false, parentLine = '' }) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.userId);
        const childCount = node.children?.length || 0;

        return (
            <div className="relative">
                {/* Node Card */}
                <div className="flex items-start">
                    {/* Connecting Lines */}
                    {!isRoot && (
                        <div className="relative flex items-center" style={{ width: '60px', height: '60px' }}>
                            {/* Horizontal line to card */}
                            <div className="absolute left-0 top-[29px] w-[60px] h-[2px] bg-gradient-to-r from-slate-700 to-transparent"></div>
                            {/* Vertical line from parent */}
                            {!isLast && (
                                <div className="absolute left-0 top-0 w-[2px] h-full bg-slate-700"></div>
                            )}
                        </div>
                    )}

                    {/* User Card */}
                    <div
                        className={`relative group ${hasChildren ? 'cursor-pointer' : ''}`}
                        onClick={() => hasChildren && toggleNode(node)}
                    >
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all min-w-[280px] ${node.role === 'admin'
                                ? 'bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400 shadow-xl shadow-orange-600/30'
                                : node.isActive
                                    ? 'bg-slate-900 border-slate-700 hover:border-orange-500/50 shadow-lg'
                                    : 'bg-slate-900/50 border-slate-800 opacity-70'
                            }`}>
                            {/* Avatar */}
                            <div className={`p-3 rounded-xl ${node.role === 'admin'
                                    ? 'bg-white/20'
                                    : node.isActive
                                        ? 'bg-blue-600'
                                        : 'bg-slate-700'
                                }`}>
                                {node.role === 'admin' ? (
                                    <Crown size={20} className="text-white" />
                                ) : (
                                    <User size={20} className="text-white" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-black uppercase text-white">
                                        {node.name}
                                    </p>
                                    {node.role === 'admin' && (
                                        <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-black uppercase">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] font-mono font-bold text-orange-500">
                                    {node.userId}
                                </p>
                            </div>

                            {/* Status & Count */}
                            <div className="flex flex-col items-end gap-2">
                                <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${node.isActive
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {node.isActive ? '● Active' : '○ Pending'}
                                </div>
                                {hasChildren && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-full">
                                        <Users size={10} className="text-slate-400" />
                                        <span className="text-[9px] font-black text-slate-300">
                                            {childCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expand Indicator */}
                        {hasChildren && (
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-white text-xs font-black">
                                    {isExpanded ? '−' : '+'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Children Container */}
                {hasChildren && isExpanded && (
                    <div className="ml-[60px] mt-4 relative">
                        {/* Vertical line down to children */}
                        <div className="absolute left-0 top-0 w-[2px] h-[30px] bg-slate-700"></div>

                        <div className="ml-0 space-y-4">
                            {node.children.map((child, index) => (
                                <div key={child.userId || child._id} className="relative">
                                    <TreeNode
                                        node={child}
                                        isLast={index === node.children.length - 1}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 p-6 md:p-10 overflow-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                            Network <span className="text-orange-600">Tree</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                            Hierarchical Genealogy Structure
                        </p>
                    </div>

                    {/* Search */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search User ID..."
                                className="w-full md:w-56 bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-orange-600/50 transition-all uppercase tracking-widest"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && fetchRootUser(searchId)}
                                disabled={loading}
                            />
                        </div>
                        <button
                            onClick={() => fetchRootUser(searchId)}
                            disabled={loading}
                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all shadow-xl italic ${loading
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20 active:scale-95'
                                }`}
                        >
                            {loading ? 'Loading...' : 'Load Tree'}
                        </button>
                    </div>
                </div>

                {/* Main Container */}
                <div className="bg-slate-900/30 p-6 md:p-10 rounded-[3rem] border border-slate-800/50 min-h-[600px] relative overflow-x-auto">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Network size={280} />
                    </div>

                    <div className="relative z-10">
                        {loading ? (
                            // Loading State
                            <div className="flex flex-col items-center justify-center h-[500px]">
                                <Loader2 className="w-16 h-16 text-orange-600 animate-spin mb-6" />
                                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] italic animate-pulse">
                                    Loading Tree...
                                </p>
                            </div>
                        ) : error ? (
                            // Error State
                            <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
                                <div className="p-6 bg-red-500/10 rounded-full border-2 border-red-500/20">
                                    <AlertCircle size={48} className="text-red-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-red-400 font-black uppercase italic tracking-wider text-lg mb-2">
                                        {error}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        Try searching for a different user
                                    </p>
                                </div>
                            </div>
                        ) : rootUser ? (
                            // Tree Display
                            <div className="max-w-full">
                                {/* Stats Overview Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {/* Total Members */}
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users size={16} className="text-blue-500" />
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Total Team</p>
                                        </div>
                                        <p className="text-2xl font-black text-white">{teamStats.totalMembers}</p>
                                    </div>

                                    {/* Active Members */}
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Active</p>
                                        </div>
                                        <p className="text-2xl font-black text-green-500">{teamStats.activeMembers}</p>
                                    </div>

                                    {/* Pending Members */}
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Pending</p>
                                        </div>
                                        <p className="text-2xl font-black text-red-500">{teamStats.pendingMembers}</p>
                                    </div>

                                    {/* Direct Referrals */}
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Network size={16} className="text-orange-500" />
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Direct</p>
                                        </div>
                                        <p className="text-2xl font-black text-orange-500">{teamStats.directReferrals}</p>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="mb-8 p-5 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-4 max-w-2xl">
                                    <div className="p-3 bg-orange-600/20 rounded-xl">
                                        <Network size={24} className="text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            Network Root
                                        </p>
                                        <p className="text-sm font-black text-white">
                                            {rootUser.name} <span className="text-orange-500">({rootUser.userId})</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                                        <p className={`text-sm font-black ${rootUser.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                            {rootUser.isActive ? 'Active' : 'Pending'}
                                        </p>
                                    </div>
                                </div>

                                {/* Tree Structure */}
                                <div className="pl-6">
                                    <TreeNode node={rootUser} isRoot={true} />
                                </div>
                            </div>
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
                                <div className="p-8 bg-slate-800/50 rounded-full">
                                    <Search size={48} className="text-slate-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-600 font-black uppercase italic tracking-wider text-lg mb-2">
                                        Search Network
                                    </p>
                                    <p className="text-slate-500 text-xs max-w-sm">
                                        Enter a User ID and click "Load Tree" to explore the network
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-600/20 rounded-lg">
                                <Crown size={16} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase">Legend</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    • Orange cards = Admin users<br />
                                    • Blue avatar = Active members<br />
                                    • Gray avatar = Pending activation
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-600/20 rounded-lg">
                                <Users size={16} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase">Navigation</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    • Click + button to expand children<br />
                                    • Click − button to collapse branch<br />
                                    • Number shows direct referral count
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenealogyTree;