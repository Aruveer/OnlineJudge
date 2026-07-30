import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { getStats, getAllUsers } from '../api/auth';
import { getProblems, deleteProblem } from '../api/problems';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for graphs
const activityData = [
  { name: 'Mon', solved: 2 },
  { name: 'Tue', solved: 4 },
  { name: 'Wed', solved: 1 },
  { name: 'Thu', solved: 5 },
  { name: 'Fri', solved: 8 },
  { name: 'Sat', solved: 3 },
  { name: 'Sun', solved: 6 },
];

const difficultyData = [
  { name: 'Easy', value: 12, color: '#10b981' }, // emerald-500
  { name: 'Medium', value: 8, color: '#f59e0b' }, // amber-500
  { name: 'Hard', value: 3, color: '#ef4444' }, // red-500
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalProblems: 0, totalUsers: null });
  const [problems, setProblems] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          getProblems(),
          getStats().catch(() => ({ totalProblems: 0 }))
        ];

        if (user?.role === 'admin') {
          promises.push(getAllUsers());
        }

        const results = await Promise.all(promises);
        const problemsData = results[0];
        const statsData = results[1];
        
        setProblems(problemsData);
        if (user?.role === 'admin') {
          setUsersList(results[2]);
        }
        
        if (statsData.totalProblems) {
          setStats(statsData);
        } else {
          setStats(prev => ({ ...prev, totalProblems: problemsData.length }));
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDeleteProblem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      setIsDeleting(true);
      await deleteProblem(id);
      setProblems(problems.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, totalProblems: prev.totalProblems - 1 }));
    } catch (error) {
      console.error('Failed to delete problem', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700">
          <p className="font-semibold mb-1">{label}</p>
          <p>{`Solved: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your workspace and platform activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card bg-[#111] p-6 shadow-sm border border-[#333] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-300">Total Problems</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProblems}</p>
        </motion.div>

        {user?.role !== 'admin' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card bg-[#111] p-6 shadow-sm border border-[#333] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-300">Your Progress</h3>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.solvedProblems ?? 0}<span className="text-lg text-slate-400 font-normal ml-1">/ {stats.totalProblems}</span></p>
          </motion.div>
        )}

        {user?.role === 'admin' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card bg-[#111] p-6 shadow-sm border border-[#333] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-300">Total Users</h3>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalUsers || '-'}</p>
          </motion.div>
        )}
      </div>

      {/* Conditional Rendering for Admin vs Normal User */}
      {user?.role === 'admin' ? (
        <div className="space-y-8">
          {/* Manage Problems Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card bg-[#111] border border-[#333] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">Manage Problems</h3>
              <Link to="/admin/create-problem" className="bg-white hover:bg-slate-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Add New Problem
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-[#0a0a0a] text-xs uppercase font-semibold text-slate-500 border-b border-[#333]">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {problems.map((problem) => (
                    <tr key={problem._id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{problem.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteProblem(problem._id)}
                          disabled={isDeleting}
                          className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors p-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {problems.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No problems found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Manage Users Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card bg-[#111] border border-[#333] rounded-2xl shadow-sm overflow-hidden mb-10">
            <div className="p-6 border-b border-[#333]">
              <h3 className="font-bold text-lg text-white">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-[#0a0a0a] text-xs uppercase font-semibold text-slate-500 border-b border-[#333]">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{u.firstName} {u.lastName}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-[#222] text-slate-300'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Analytics Graphs for Normal Users */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 glass-card bg-[#111] p-6 shadow-sm border border-[#333] rounded-2xl">
            <h3 className="font-bold text-white mb-6">Activity (Past 7 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#222', opacity: 0.4 }} contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                  <Bar dataKey="solved" fill="#fff" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card bg-[#111] p-6 shadow-sm border border-[#333] rounded-2xl flex flex-col">
            <h3 className="font-bold text-white mb-2">Solved by Difficulty</h3>
            <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">23</span>
                <span className="text-xs text-slate-500">Solved</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {difficultyData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  {item.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
