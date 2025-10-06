import React, {useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Clock, List, Star, ExternalLink, LogOut, TrendingUp, BrainCircuit, Inbox, LayoutDashboard, BarChart3 } from 'lucide-react';
import axios from '../api'; 
import { format } from 'date-fns';

// --- (Helper components like StatCard, SubmissionItem, etc. have no changes) ---

const StatCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-xl flex items-center space-x-4 animate-pulse">
        <div className="p-3 rounded-full bg-slate-800 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-6 bg-slate-700 rounded w-1/2"></div>
        </div>
    </div>
);

const StatCard = ({ icon, label, value, color }) => (
    <motion.div
        className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-5 rounded-xl flex items-center space-x-4"
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)' }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className={`p-3 rounded-full bg-slate-800 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

const SubmissionItem = ({ sub }) => {
    const verdictMap = {
        OK: { icon: <CheckCircle className="h-5 w-5 text-teal-400" />, color: 'text-teal-400' },
        WRONG_ANSWER: { icon: <XCircle className="h-5 w-5 text-red-400" />, color: 'text-red-400' },
        TIME_LIMIT_EXCEEDED: { icon: <Clock className="h-5 w-5 text-amber-400" />, color: 'text-amber-400' },
        DEFAULT: { icon: <AlertTriangle className="h-5 w-5 text-slate-400" />, color: 'text-slate-400' }
    };
    const verdictInfo = verdictMap[sub.verdict] || verdictMap.DEFAULT;

    return (
        <motion.li
            className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-800/60 transition-colors duration-200"
            layout
        >
            <div className="flex-1 min-w-0">
                <p className="text-slate-200 font-medium truncate">{sub.problem.name}</p>
                <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <span>{sub.programmingLanguage}</span>
                    <span>&bull;</span>
                    <span>{format(new Date(sub.creationTimeSeconds * 1000), 'PP')}</span>
                </div>
            </div>
            <div className={`flex items-center space-x-2 text-sm font-semibold shrink-0 ml-4 ${verdictInfo.color}`}>
                {verdictInfo.icon}
                <span>{sub.verdict.replace(/_/g, ' ')}</span>
            </div>
        </motion.li>
    );
};

const SuggestionItem = ({ prob }) => (
    <motion.li
        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300"
        whileHover={{ y: -5 }}
        layout
    >
        <a href={`https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-cyan-400 hover:text-cyan-300 font-medium">
            <span className="truncate pr-2">{prob.name}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
        </a>
        <div className="text-sm text-slate-400 mt-2 flex items-center flex-wrap gap-x-4 gap-y-2">
            <span>Rating: <span className="font-semibold text-slate-300">{prob.rating}</span></span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
            {prob.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
    </motion.li>
);

const TagBadge = ({ tag }) => (
    <span className="text-xs font-medium text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full">
        {tag}
    </span>
);

const EmptyState = ({ icon, title, message }) => (
    <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-800 text-slate-500">
            {icon}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{message}</p>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full py-12">
        <motion.div
            className="w-12 h-12 border-4 border-t-cyan-400 border-slate-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    </div>
);

const MotivationCard = () => (
    <div className="mt-auto pt-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 p-5 rounded-xl border border-slate-700/50 text-center">
            <div className="flex justify-center mb-3">
                <div className="p-3 bg-slate-800 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-cyan-400" />
                </div>
            </div>
            <h3 className="font-bold text-lg text-white">Stay Sharp</h3>
            <p className="text-sm text-slate-400 mt-1">Consistent practice on targeted problems is the key to mastery.</p>
        </div>
    </div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const StatsGrid = ({ stats, isLoading }) => (
    <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        {isLoading ? (
            <>
                <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </>
        ) : (
            stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <StatCard {...stat} />
                </motion.div>
            ))
        )}
    </motion.div>
);

const SubmissionsPanel = ({ title, description, submissions, isLoading }) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-xl">
        <h2 className="text-2xl font-bold font-space-grotesk mb-2">{title}</h2>
        {description && <p className="text-slate-400 mb-4 text-sm">{description}</p>}
        <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? <LoadingSpinner /> : submissions.length > 0 ? (
                <motion.ul className="space-y-1" variants={containerVariants} initial="hidden" animate="visible">
                    {submissions.map((sub, idx) => (
                        <motion.div key={idx} variants={itemVariants}>
                            <SubmissionItem sub={sub} />
                        </motion.div>
                    ))}
                </motion.ul>
            ) : (
                <EmptyState icon={<Inbox />} title="No Submissions" message="You haven't made any submissions yet." />
            )}
        </div>
    </div>
);

// --- SCROLLBAR CHANGE: Modified SuggestionsPanel ---
const SuggestionsPanel = ({ suggestions, isLoading }) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-xl flex flex-col">
        <h2 className="text-2xl font-bold font-space-grotesk mb-4 shrink-0">Problem Suggestions</h2>
        {/* Added a max-height to this div to make the list scrollable */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[42rem]">
             {isLoading ? <LoadingSpinner /> : suggestions.length > 0 ? (
                 <motion.ul className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                    <AnimatePresence>
                        {suggestions.map((prob, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <SuggestionItem prob={prob} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            ) : (
                <EmptyState icon={<Star/>} title="All Caught Up!" message="No new suggestions for you right now."/>
            )}
        </div>
        {!isLoading && <div className="shrink-0"><MotivationCard /></div>}
    </div>
);

// --- LOGOUT CHANGE: Removed logout button from Sidebar ---
const Sidebar = ({ activePath }) => {
    const navItems = [
        { href: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { href: '/stats', label: 'Stats', icon: <BarChart3 size={20} /> }
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex-col hidden md:flex">
            <div className="px-6 py-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400/80 flex items-center justify-center shadow-md">
                        <span className="font-space-grotesk text-slate-950 font-bold">CP</span>
                    </div>
                    <div>
                        <a href="/" className="inline-flex items-baseline gap-2">
                            <h1 className="text-xl font-space-grotesk font-bold tracking-tight">Smart <span className="text-cyan-300">CP</span> Coach</h1>
                        </a>
                    </div>
                </div>
            </div>
            
            <nav className="flex-grow px-4 py-6">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <a 
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activePath === item.href
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [failedSubmissions, setFailedSubmissions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentPath = '/';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const profileRes = await axios.get('/user/profile');
                setUser(profileRes.data);
                const submissionRes = await axios.get('/user/submissions');
                setSubmissions(submissionRes.data.result);
                const failedRes = await axios.get('/user/new-failed-submissions');
                setFailedSubmissions(failedRes.data);
                const suggestionRes = await axios.get('/user/suggestions');
                setSuggestions(suggestionRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => { alert("Logout button clicked!"); };
    
    const statsData = [
        { icon: <List className="h-6 w-6" />, label: "Total Submissions", value: submissions.length, color: "text-cyan-400" },
        { icon: <XCircle className="h-6 w-6" />, label: "New Failed", value: failedSubmissions.length, color: "text-red-400" },
        { icon: <CheckCircle className="h-6 w-6" />, label: "Problems Solved", value: submissions.filter(s => s.verdict === 'OK').length, color: "text-teal-400" },
        { icon: <TrendingUp className="h-6 w-6" />, label: "Suggestions", value: suggestions.length, color: "text-cyan-400" }
    ];

    const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Space+Grotesk:wght@700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #020617; }
        .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .aurora-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2;
        }
        .aurora-bg-for-main-content {
             background: 
                radial-gradient(ellipse at 20% 80%, rgba(20, 184, 166, 0.15), transparent 70%),
                radial-gradient(ellipse at 80% 30%, rgba(34, 211, 238, 0.15), transparent 70%);
            animation: pulse-aurora 20s infinite ease-in-out;
        }
        @keyframes pulse-aurora {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
    `;

    return (
        <>
            <style>{customStyles}</style>
            <div className="min-h-screen text-white bg-slate-950">
                <Sidebar activePath={currentPath} />

                <main className="md:pl-64">
                    <div className="aurora-bg aurora-bg-for-main-content" />
                    
                    {/* --- LOGOUT CHANGE: A new minimal header for the logout button --- */}
                    <header className="flex justify-end items-center h-20 px-6 md:px-12">
                         <motion.button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="hidden sm:inline">Logout</span>
                        </motion.button>
                    </header>

                    {/* Content container with adjusted padding */}
                    <div className="px-6 md:px-12 pb-12">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <h1 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-2">Welcome back, {user?.handle || '...'}!</h1>
                            <p className="text-slate-400">Your personalized practice dashboard is ready.</p>
                        </motion.div>

                        <StatsGrid stats={statsData} isLoading={isLoading} />

                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                            <motion.div
                                className="xl:col-span-3 space-y-8"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <SubmissionsPanel title="Recent Submissions" submissions={submissions} isLoading={isLoading} />
                                <SubmissionsPanel title="New Failed Submissions" description="Your most recent failed attempts to retry." submissions={failedSubmissions} isLoading={isLoading} />
                            </motion.div>

                            <motion.div
                                className="xl:col-span-2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <SuggestionsPanel suggestions={suggestions} isLoading={isLoading} />
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;