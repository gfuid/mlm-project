import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/stats/StatCard';
import {
    Users, IndianRupee, Layers, RefreshCcw,
    Wallet, TrendingUp, Calendar, ChevronDown,
    Activity, PieChart
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import MasterLoader from '../components/common/MasterLoader';
const Dashboard = () => {
    // ✅ refreshAdminData ab bina argument ke call hoga kyunki context ise handle kar raha hai
    const { stats, loading, refreshAdminData, lastUpdated } = useAdmin();
    const [timeRange, setTimeRange] = useState('weekly');


    // 1. Fetch data on mount or manual refresh
    useEffect(() => {
        refreshAdminData();
    }, [refreshAdminData]);

    // 2. 🚩 DYNAMIC TURNOVER CALCULATION (₹5000 per Active Node)
    // Business volume = Active IDs * 5000
    const calculatedBusinessVolume = (stats.activeIds || 0) * 5000;

    // 3. Dynamic Chart Data Mapping
    const chartData = stats.chartData?.length > 0
        ? stats.chartData.map(item => {
            const date = new Date(item._id);
            const label = timeRange === 'yearly'
                ? date.toLocaleString('en-US', { month: 'short' })
                : date.toLocaleString('en-US', { day: 'numeric', month: 'short' });

            return {
                name: label,
                // Chart mein bhi ₹5000 factor dikhane ke liye calculation
                revenue: item.revenue || (item.count * 5000)
            };
        })
        : [];
    if (loading) return <MasterLoader message="Fetching Network Analytics..." />;
    return (
        <div className="flex bg-slate-950 min-h-screen text-white font-sans selection:bg-orange-600/30">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                            Master <span className="text-orange-600">Analytics</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                            Enterprise Performance Monitoring
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        {/* Time Range Selector */}
                        <div className="relative flex-1 lg:flex-none">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-[11px] font-black uppercase pl-12 pr-10 py-4 rounded-2xl appearance-none outline-none focus:ring-2 ring-orange-600/50 transition-all cursor-pointer italic"
                            >
                                <option value="weekly">Last 7 Days</option>
                                <option value="monthly">Last 30 Days</option>
                                <option value="yearly">Last 12 Months</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                        </div>

                        {/* Sync Info */}
                        <div className="flex items-center gap-3 bg-slate-900/50 p-2 pl-4 rounded-2xl border border-slate-800">
                            <div className="text-right">
                                <p className="text-[8px] font-bold text-slate-500 uppercase">Last Sync</p>
                                <p className="text-[10px] font-black text-orange-500 tracking-tighter uppercase">{lastUpdated || "Syncing..."}</p>
                            </div>
                            <button
                                onClick={refreshAdminData}
                                disabled={loading}
                                className={`p-3 rounded-xl bg-orange-600 hover:bg-orange-500 transition-all shadow-lg ${loading ? 'animate-spin opacity-50' : 'active:scale-90'}`}
                            >
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- Core Stats Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Members"
                        value={stats.totalMembers || 0}
                        icon={<Users size={20} />}
                        color="blue"
                        desc="Verified Population"
                    />

                    <StatCard
                        title="Business Volume"
                        value={calculatedBusinessVolume} // ✅ Calculated based on Active IDs
                        icon={<IndianRupee size={20} />}
                        color="orange"
                        isCurrency={true}
                        desc="Active ID Turnover"
                    />

                    {/* ✅ Network Health Section */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[10px] font-black uppercase text-slate-500 italic tracking-widest">Network Health</p>
                            <Activity size={16} className="text-orange-500" />
                        </div>
                        <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-slate-800">
                            <div className="text-center">
                                <p className="text-green-500 font-black text-xl leading-none italic">{stats.activeIds || 0}</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase mt-2">Active IDs</p>
                            </div>
                            <div className="w-[1px] h-10 bg-slate-800"></div>
                            <div className="text-center">
                                <p className="text-red-500 font-black text-xl leading-none italic">{stats.inactiveIds || 0}</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase mt-2">Inactive</p>
                            </div>
                        </div>
                    </div>

                    <StatCard
                        title="Today Joinings"
                        value={stats.todayJoinings || 0}
                        icon={<Layers size={20} />}
                        color="green"
                        desc="Fresh Registrations Today"
                    />
                </div>

                {/* --- Chart Trajectory --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 min-h-[480px] relative overflow-hidden group shadow-2xl">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Growth <span className="text-orange-600">Trajectory</span></h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase italic mt-1 tracking-widest">Revenue Impact: ₹5000 per Active Unit</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-orange-600/10 border border-orange-500/20 rounded-full">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-orange-500 uppercase italic tracking-tighter">Live System Feed</span>
                            </div>
                        </div>

                        <div className="h-[320px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} dy={15} />
                                        <YAxis hide={true} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '15px' }}
                                            itemStyle={{ color: '#f97316', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#ea580c" fill="url(#revenueGradient)" strokeWidth={4} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <PieChart className="text-slate-800 animate-spin-slow" size={48} />
                                    <p className="text-slate-600 font-black italic uppercase text-[10px] tracking-[0.4em]">Establishing Master Link...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;