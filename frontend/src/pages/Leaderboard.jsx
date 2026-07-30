import { useState, useEffect } from 'react';
import { getLeaderboard } from '../api/problems';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="font-bold text-slate-500 dark:text-slate-400 w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-12 px-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Global Leaderboard
        </h1>
        <p className="text-slate-400">
          Ranked by unique problems solved.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-[#111] rounded-xl shadow-sm border border-[#333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0a0a0a] border-b border-[#333]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-400">Rank</th>
                  <th className="px-6 py-4 font-semibold text-slate-400">User</th>
                  <th className="px-6 py-4 font-semibold text-slate-400 text-center">Problems Solved</th>
                  <th className="px-6 py-4 font-semibold text-slate-400 text-right">Last Accepted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No accepted submissions yet. Be the first!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((user, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={user._id} 
                      className="hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#222]">
                          {getRankIcon(index)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <span className="font-medium text-white text-lg">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-lg">
                          {user.problemsSolved}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-400">
                        {new Date(user.lastAcceptedSubmission).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;