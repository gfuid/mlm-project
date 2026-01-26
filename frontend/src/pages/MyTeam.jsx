import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Users, Network, List, Loader2, Search, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTeam = () => {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('list');
    const [teamList, setTeamList] = useState([]);
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            setLoading(true);

            // ✅ CRITICAL FIX: Use /user/tree instead of /admin/tree
            const treeId = user?.userId;

            if (!treeId) {
                console.error('❌ No userId found');
                toast.error('User ID not available');
                return;
            }

            console.log('🔍 Fetching tree for user:', treeId);

            // ✅ Use user endpoint - accessible to all logged-in users
            const res = await API.get(`/user/tree/${treeId}`);

            console.log('✅ Tree response:', res.data);

            if (res.data?.success) {
                const fullTree = res.data.data;
                setTreeData(fullTree);

                // Flatten tree into list
                const flatList = flattenTree(fullTree);
                setTeamList(flatList);

                console.log('✅ Team data loaded:', {
                    totalMembers: flatList.length,
                    activeMembers: flatList.filter(m => m.isActive).length,
                    tree: fullTree
                });
            }
        } catch (error) {
            console.error('❌ Failed to load team:', error);

            if (error.response?.status === 403) {
                toast.error('Access denied - please check your permissions');
            } else if (error.response?.status === 404) {
                toast.error('No team members found');
            } else {
                toast.error('Failed to load team data');
            }
        } finally {
            setLoading(false);
        }
    };

    // Recursive function to flatten tree
    const flattenTree = (node, list = []) => {
        if (!node) return list;

        // Agar children hain toh unhe process karein
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                list.push({
                    userId: child.userId,
                    name: child.name,
                    isActive: child.isActive,
                    role: child.role
                });
                // Recursive call for nested children
                flattenTree(child, list);
            });
        }
        return list;
    };

    // Filter team list based on search
    const filteredTeam = teamList.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tree Node Component
    const TreeNode = ({ node, level = 0 }) => {
        const [isExpanded, setIsExpanded] = useState(level < 2);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className="relative">
                {/* Node Card */}
                <div
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all mb-3 ${node.role === 'admin'
                        ? 'bg-orange-50 border-orange-200'
                        : node.isActive
                            ? 'bg-white border-gray-200 hover:border-orange-200'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                    style={{ marginLeft: `${level * 40}px` }}
                >
                    {/* Expand/Collapse Button */}
                    {hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                            {isExpanded ? (
                                <ChevronDown size={16} className="text-gray-400" />
                            ) : (
                                <ChevronRight size={16} className="text-gray-400" />
                            )}
                        </button>
                    )}

                    {/* User Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${node.role === 'admin'
                        ? 'bg-orange-600 text-white'
                        : node.isActive
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                        {node.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <p className="text-sm font-black uppercase text-gray-800">
                            {node.name}
                        </p>
                        <p className="text-xs font-bold text-orange-600 uppercase">
                            {node.userId}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase ${node.isActive
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                        }`}>
                        {node.isActive ? '✓ Active' : '⏳ Pending'}
                    </div>

                    {/* Children Count */}
                    {hasChildren && (
                        <div className="text-xs font-bold text-gray-400">
                            {node.children.length} member{node.children.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Render Children */}
                {isExpanded && hasChildren && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        {node.children.map((child, index) => (
                            <TreeNode
                                key={child.userId || index}
                                node={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Loading Team Data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-800">
                            My <span className="text-orange-600">Team</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                            Network Genealogy & Member List
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                            <p className="text-xs font-bold text-gray-400 uppercase">Active</p>
                            <p className="text-2xl font-black text-green-600">
                                {teamList.filter(m => m.isActive).length}
                            </p>
                        </div>
                        <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
                            <p className="text-xs font-bold text-gray-400 uppercase">Total</p>
                            <p className="text-2xl font-black text-orange-600">
                                {teamList.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search & View Toggle */}
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-6 py-2 text-xs font-black uppercase rounded-lg transition ${viewMode === 'list'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-500'
                                }`}
                        >
                            <List size={16} />
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`flex items-center gap-2 px-6 py-2 text-xs font-black uppercase rounded-lg transition ${viewMode === 'tree'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-500'
                                }`}
                        >
                            <Network size={16} />
                            Tree View
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                {viewMode === 'list' ? (
                    // LIST VIEW
                    <div className="overflow-x-auto">
                        {filteredTeam.length > 0 ? (
                            <table className="w-full">
                                <thead className="border-b border-gray-100">
                                    <tr className="text-left">
                                        <th className="pb-4 text-xs font-black text-gray-400 uppercase">
                                            Member ID
                                        </th>
                                        <th className="pb-4 text-xs font-black text-gray-400 uppercase">
                                            Name
                                        </th>
                                        <th className="pb-4 text-xs font-black text-gray-400 uppercase text-right">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredTeam.map((member) => (
                                        <tr
                                            key={member.userId}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="py-4 text-sm font-black text-gray-800">
                                                {member.userId}
                                            </td>
                                            <td className="py-4 text-sm font-bold text-gray-600 uppercase">
                                                {member.name}
                                            </td>
                                            <td className="py-4 text-right">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${member.isActive
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    {member.isActive ? '✓ Active' : '⏳ Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-20">
                                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                    {searchTerm ? 'No members found' : 'No team members yet'}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    // TREE VIEW
                    <div className="overflow-auto max-h-[800px]">
                        {treeData ? (
                            <TreeNode node={treeData} />
                        ) : (
                            <div className="text-center py-20">
                                <Network size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                    Unable to load tree structure
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTeam;