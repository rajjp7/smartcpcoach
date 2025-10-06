import React, { useEffect, useState, useCallback } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import {
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Sector,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, CheckCircle, Award, Target, ThumbsUp, ThumbsDown, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// --- Animated Number Component (No Changes) ---
function AnimatedNumber({ value }) {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 1.5,
                ease: "easeOut",
                onUpdate(latest) {
                    if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString();
                }
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    return <span ref={ref}>{value}</span>;
}

// --- Sidebar (No Changes) ---
const Sidebar = () => {
    const location = useLocation();
    const activePath = location.pathname;

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
        { href: '/stats', label: 'Stats', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8a6 6 0 0 0-8.4-8.4"></path><path d="M13 13a4 4 0 1 0 5.7-5.7"></path></svg> }
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex-col hidden md:flex">
            <div className="px-6 py-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400/80 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-slate-950 font-bold">CP</span>
                    </div>
                    <div>
                        <Link to="/" className="inline-flex items-baseline gap-2">
                            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xl font-bold tracking-tight">Smart <span className="text-cyan-300">CP</span> Coach</h1>
                        </Link>
                    </div>
                </div>
            </div>
            <nav className="flex-grow px-4 py-6">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activePath === item.href
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

const StatHighlightCard = ({ icon, label, value, unit }) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-xl flex items-center gap-4 transition-all duration-300 hover:border-cyan-400/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10">
        <div className="p-3 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-white text-3xl font-bold">
                <AnimatedNumber value={value} /> {unit && <span className="text-xl text-slate-300 ml-1">{unit}</span>}
            </p>
        </div>
    </div>
);

const ChartCard = ({ title, children, className = "", headerContent = null }) => (
    <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-xl shadow-lg shadow-black/20 ${className}`}>
        <div className="flex justify-between items-start mb-4">
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg font-bold text-white">{title}</h3>
            {headerContent}
        </div>
        <div className="h-80 w-full">{children}</div>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700 shadow-xl">
                <p className="text-slate-300 text-sm font-medium">{label}</p>
                <p className="font-bold" style={{ color: payload[0].color || payload[0].stroke || payload[0].payload.fill }}>
                    {`${payload[0].name}: ${payload[0].value.toLocaleString()}`}
                </p>
            </div>
        );
    }
    return null;
};

const TopicPerformanceCard = ({ title, topics, icon, gradientClasses }) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-xl shadow-lg shadow-black/20 h-full">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg font-bold text-white">{title}</h3>
        </div>
        <ul className="space-y-4">
            {topics.slice(0, 5).map(t => (
                <li key={t.topic}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{t.topic}</span>
                        <span className="font-semibold text-white">{t.accuracy}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                         <motion.div
                            className={`h-2 rounded-full ${gradientClasses}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${t.accuracy}%` }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                         />
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#fff" fontSize={24} fontWeight="bold">
        {value.toLocaleString()}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill} fontSize={14}>
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
    </g>
  );
};

const FilterableProgressChart = ({ progressData }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        if (progressData.length > 0) {
            const years = [...new Set(progressData.map(d => new Date(d.name).getFullYear()))].sort((a, b) => b - a);
            setAvailableYears(years);
            if (years.length > 0) setSelectedYear(years[0]);
        }
    }, [progressData]);
    
    useEffect(() => {
        if (selectedYear !== 'all') {
            const monthsInYear = [...new Set(progressData
                .filter(d => new Date(d.name).getFullYear() === parseInt(selectedYear))
                .map(d => new Date(d.name).getMonth())
            )].sort((a,b) => a-b);
            setAvailableMonths(monthsInYear);
        } else {
            setAvailableMonths([]);
        }
        setSelectedMonth('all');
    }, [selectedYear, progressData]);

    useEffect(() => {
        if (progressData.length === 0) return;
        let data = progressData.map(d => ({ ...d, date: new Date(d.name) }));

        if (selectedYear === 'all') {
            const yearlyData = data.reduce((acc, curr) => {
                const year = curr.date.getFullYear();
                acc[year] = (acc[year] || 0) + curr.solved;
                return acc;
            }, {});
            setFilteredData(Object.entries(yearlyData).map(([year, solved]) => ({ name: year, solved })));
        } else if (selectedMonth === 'all') {
            const monthlyData = data.filter(d => d.date.getFullYear() === parseInt(selectedYear))
                .reduce((acc, curr) => {
                    const month = curr.date.getMonth();
                    acc[month] = (acc[month] || 0) + curr.solved;
                    return acc;
                }, {});
            setFilteredData(Object.entries(monthlyData).map(([month, solved]) => ({ name: monthNames[month], solved })));
        } else {
            const dailyData = data.filter(d => 
                d.date.getFullYear() === parseInt(selectedYear) && d.date.getMonth() === parseInt(selectedMonth)
            );
            setFilteredData(dailyData.map(d => ({ name: d.date.getDate(), solved: d.solved })));
        }
    }, [selectedYear, selectedMonth, progressData]);

    const FilterControls = (
        <div className="flex items-center gap-2">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-slate-800 text-white text-xs border border-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="all">All Months</option>
                {availableMonths.map(month => <option key={month} value={month}>{monthNames[month]}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-slate-800 text-white text-xs border border-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="all">All Years</option>
                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
        </div>
    );

    return (
        <ChartCard title="Problems Solved" headerContent={FilterControls}>
            <ResponsiveContainer>
                <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} fontSize={12} />
                    <YAxis tick={{ fill: '#94a3b8' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="solved" name="Solved" stroke="#60a5fa" fill="url(#colorProgress)" strokeWidth={2} style={{ filter: 'url(#glow)' }} dot={{ r: 3, fill: '#60a5fa', stroke: '#0f172a' }} activeDot={{ r: 6 }}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

const RecentContests = ({ ratingData }) => {
    const [contestHistory, setContestHistory] = useState([]);

    useEffect(() => {
        if (ratingData && ratingData.length > 0) {
            const history = ratingData.map((contest, index) => {
                const prevRating = index > 0 ? ratingData[index - 1].rating : 1500; // Assume a starting rating for the first contest
                const change = contest.rating - prevRating;
                return {
                    name: contest.name,
                    rating: contest.rating,
                    change: index === 0 && contest.rating === 1500 ? 0 : change,
                };
            }).reverse().slice(0, 6); 

            setContestHistory(history);
        }
    }, [ratingData]);
    
    const RatingChange = ({ change }) => {
        if (change > 0) {
            return <span className="flex items-center justify-end text-emerald-400"><ArrowUp size={14} className="mr-1" /> +{change}</span>;
        }
        if (change < 0) {
            return <span className="flex items-center justify-end text-red-400"><ArrowDown size={14} className="mr-1" /> {change}</span>;
        }
        return <span className="flex items-center justify-end text-slate-400"><Minus size={14} className="mr-1" /> {change}</span>;
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-xl shadow-lg shadow-black/20 h-full">
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg font-bold text-white mb-4">Recent Contest Results</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase border-b border-slate-800">
                        <tr>
                            <th scope="col" className="py-3 pr-3">Contest</th>
                            <th scope="col" className="py-3 px-3 text-center">Rating</th>
                            <th scope="col" className="py-3 pl-3 text-right">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contestHistory.map((contest, index) => (
                            <tr key={index} className="border-b border-slate-800/50">
                                <td className="py-3 pr-3 font-medium text-white">{contest.name}</td>
                                <td className="py-3 px-3 text-slate-300 text-center">{contest.rating}</td>
                                <td className="py-3 pl-3 font-semibold text-right">
                                    <RatingChange change={contest.change} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatsPage = () => {
    const [summaryStats, setSummaryStats] = useState(null);
    const [verdictData, setVerdictData] = useState([]);
    const [ratingData, setRatingData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [weakTopics, setWeakTopics] = useState([]);
    const [strongTopics, setStrongTopics] = useState([]);
    const [ratingGraph, setRatingGraph] = useState([]);
    const [pieChartIndex, setPieChartIndex] = useState(0);

    const onPieEnter = useCallback((_, index) => setPieChartIndex(index), []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/stats", { credentials: 'include' });
                const data = await res.json();
                setSummaryStats({ totalSolved: data.totalSolved, bestRating: data.bestRating, accuracy: data.accuracy, streak: data.streak });
                const verdictArr = Object.entries(data.verdicts).map(([key, value]) => ({ name: key, value, fill: key === 'OK' ? '#2dd4bf' : key.includes('WRONG') ? '#f87171' : key.includes('TIME') ? '#facc15' : '#94a3b8' }));
                setVerdictData(verdictArr);
                const ratingArr = Object.entries(data.ratingSolved).map(([rating, solved]) => ({ rating: Number(rating), solved })).sort((a, b) => a.rating - b.rating);
                setRatingData(ratingArr);
                setProgressData(data.progress.map(d => ({ name: d.date, solved: d.solved })));
                setWeakTopics(data.weakTopics);
                setStrongTopics(data.strongTopics);

                setRatingGraph(data.ratingGraph.map(r => ({ name: r.contestName, rating: r.rating })));
                
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    if (!summaryStats) return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-cyan-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">Loading Statistics...</p>
        </div>
      </div>
    );

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

    return (
        <div className="min-h-screen text-white bg-slate-950 font-sans">
            <Sidebar />
            <main className="md:pl-64">
                <div className="p-6 md:p-12">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.h1 variants={itemVariants} style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-4xl md:text-5xl font-bold mb-2">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400">Statistics</span></motion.h1>
                        <motion.p variants={itemVariants} className="text-slate-400 max-w-2xl">An interactive overview of your competitive programming journey, progress, and performance.</motion.p>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8" initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.div variants={itemVariants}><StatHighlightCard icon={<CheckCircle className="text-teal-400" />} label="Total Solved" value={summaryStats.totalSolved} /></motion.div>
                        <motion.div variants={itemVariants}><StatHighlightCard icon={<Award className="text-amber-400" />} label="Best Rating" value={summaryStats.bestRating} /></motion.div>
                        <motion.div variants={itemVariants}><StatHighlightCard icon={<Target className="text-cyan-400" />} label="Accuracy" value={summaryStats.accuracy} unit="%" /></motion.div>
                        <motion.div variants={itemVariants}><StatHighlightCard icon={<TrendingUp className="text-indigo-400" />} label="Streak" value={summaryStats.streak} unit="days" /></motion.div>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8" initial="hidden" animate="visible" variants={containerVariants}>
                        
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8 flex flex-col">
                           <ChartCard title="Verdict Distribution">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie activeIndex={pieChartIndex} activeShape={renderActiveShape} data={verdictData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} dataKey="value" onMouseEnter={onPieEnter} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Solved by Rating">
                                <ResponsiveContainer>
                                    <BarChart data={ratingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorRatingBar" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0.4} /></linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="rating" tick={{ fill: '#94a3b8' }} fontSize={12} />
                                        <YAxis tick={{ fill: '#94a3b8' }} fontSize={12} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45, 212, 191, 0.1)' }} />
                                        <Bar dataKey="solved" name="Solved" fill="url(#colorRatingBar)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            
                            <RecentContests ratingData={ratingGraph} />

                        </motion.div>

                        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">
                            <ChartCard title="Rating Progress">
                                <ResponsiveContainer>
                                    <AreaChart data={ratingGraph} margin={{ top: 5, right: 30, left: 0, bottom: 40 }}>
                                        <defs>
                                            <linearGradient id="colorRatingGraph" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} fontSize={10} interval="preserveStartEnd" angle={-45} textAnchor="end" />
                                        <YAxis tick={{ fill: '#94a3b8' }} domain={['dataMin - 100', 'dataMax + 100']} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="rating" name="Rating" stroke="#facc15" fill="url(#colorRatingGraph)" strokeWidth={2} style={{ filter: 'url(#glow)' }} dot={{ r: 3, fill: '#facc15', stroke: '#0f172a' }} activeDot={{ r: 6 }}/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            
                            <FilterableProgressChart progressData={progressData} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <TopicPerformanceCard title="Strong Topics" topics={strongTopics} icon={<ThumbsUp className="text-teal-400" />} gradientClasses="bg-gradient-to-r from-teal-400 to-cyan-500" />
                                <TopicPerformanceCard title="Weak Topics" topics={weakTopics} icon={<ThumbsDown className="text-amber-500" />} gradientClasses="bg-gradient-to-r from-amber-500 to-red-500" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default StatsPage;

