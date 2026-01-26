import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Trophy, Lock, CheckCircle, Award, TrendingUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Levels = () => {
    const { user } = useAuth();
    const [teamList, setTeamList] = useState([]);
    const [loading, setLoading] = useState(true);

    const levelsData = [
        { lv: 1, rank: "Promoter", target: 3, income: 1500, reward: "Starter Pack" },
        { lv: 2, rank: "City Manager", target: 9, income: 3000, reward: "Manager Badge" },
        { lv: 3, rank: "Distt. Manager", target: 27, income: 9000, reward: "Distt. Manager Medal" },
        { lv: 4, rank: "State Manager", target: 81, income: 27000, reward: "State Manager Medal" },
        { lv: 5, rank: "National Head", target: 243, income: 81000, reward: "National Head Medal" },
        { lv: 6, rank: "Boss Medal", target: 729, income: 243000, reward: "📺 Smart LED TV" },
        { lv: 7, rank: "Karan Medal", target: 2187, income: 729000, reward: "🛵 Honda Activa" },
        { lv: 8, rank: "Arjun Medal", target: 6561, income: 2187000, reward: "🏍️ Royal Enfield Bullet" },
        { lv: 9, rank: "Gold Medal", target: 19684, income: 6561500, reward: "🛡️ Pension Plan (10L Fund)" },
        { lv: 10, rank: "Hero No. 1", target: 59049, income: 19684500, reward: "🏠🚘 House + Car (50L Fund)" }
    ];

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            const treeId = user?.userId;
            const res = await API.get(`/user/tree/${treeId}`);

            if (res.data?.success) {
                const fullTree = res.data.data;
                const flatList = flattenTree(fullTree);
                setTeamList(flatList);
            }
        } catch (error) {
            console.error('❌ Failed to load team:', error);
            if (error.response?.status !== 403) {
                toast.error('Failed to load team data');
            }
        } finally {
            setLoading(false);
        }
    };

    const flattenTree = (node, list = []) => {
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                list.push({
                    userId: child.userId,
                    name: child.name,
                    isActive: child.isActive
                });
                flattenTree(child, list);
            });
        }
        return list;
    };

    const activeMembers = teamList.filter(m => m.isActive).length;
    const currentLevel = levelsData.findIndex(lvl => activeMembers < lvl.target);
    const actualLevel = currentLevel === -1 ? levelsData.length : currentLevel;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Loading Levels...
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
                            Achievement <span className="text-orange-600">Levels</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                            Unlock Rewards & Income Levels
                        </p>
                    </div>

                    {/* Current Progress */}
                    <div className="bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Current Level</p>
                        <div className="flex items-center gap-2">
                            <Award className="text-orange-600" size={20} />
                            <p className="text-2xl font-black text-orange-600">
                                Level {actualLevel}
                            </p>
                        </div>
                        <p className="text-xs font-bold text-gray-600 mt-1">
                            {activeMembers} Active Members
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-3xl p-6 mb-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp size={24} />
                    <h2 className="text-xl font-black uppercase italic">Your Journey</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs opacity-80 font-bold uppercase">Completed</p>
                        <p className="text-2xl font-black">{actualLevel - 1}</p>
                    </div>
                    <div>
                        <p className="text-xs opacity-80 font-bold uppercase">Current</p>
                        <p className="text-2xl font-black">Level {actualLevel}</p>
                    </div>
                    <div>
                        <p className="text-xs opacity-80 font-bold uppercase">Remaining</p>
                        <p className="text-2xl font-black">{levelsData.length - actualLevel}</p>
                    </div>
                </div>
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelsData.map((lvl) => {
                    const isUnlocked = activeMembers >= lvl.target;
                    const progress = Math.min((activeMembers / lvl.target) * 100, 100);

                    return (
                        <div
                            key={lvl.lv}
                            className={`relative bg-white rounded-3xl p-6 border transition-all duration-500 ${isUnlocked
                                    ? 'border-orange-200 shadow-lg shadow-orange-100'
                                    : 'border-gray-200 opacity-60'
                                }`}
                        >
                            {/* Lock Overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl">
                                    <div className="bg-white p-4 rounded-full shadow-xl border-2 border-gray-200">
                                        <Lock size={24} className="text-gray-400" />
                                    </div>
                                </div>
                            )}

                            {/* Level Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isUnlocked
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {lvl.lv}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Level {lvl.lv}</p>
                                        <p className="text-sm font-black text-gray-800 uppercase">{lvl.rank}</p>
                                    </div>
                                </div>
                                {isUnlocked ? (
                                    <CheckCircle size={24} className="text-green-500" />
                                ) : (
                                    <Trophy size={24} className="text-gray-300" />
                                )}
                            </div>

                            {/* Reward */}
                            <div className="bg-orange-50 rounded-2xl p-4 mb-4">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Reward</p>
                                <p className="text-sm font-black text-gray-800">{lvl.reward}</p>
                            </div>

                            {/* Income */}
                            <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase">Income</p>
                                <p className="text-lg font-black text-green-600">
                                    ₹{lvl.income.toLocaleString()}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400 uppercase">Progress</span>
                                    <span className="text-gray-800">
                                        {Math.min(activeMembers, lvl.target)}/{lvl.target}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-green-500' : 'bg-orange-500'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {!isUnlocked && (
                                    <p className="text-xs font-bold text-gray-500">
                                        {lvl.target - activeMembers} more members needed
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Levels;