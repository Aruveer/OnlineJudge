import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProblems } from '../api/problems';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (error) {
        toast.error('Failed to load problems');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="text-xl font-bold text-white">Solvix</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/admin/create-problem" className="text-sm font-medium text-slate-300 hover:text-white transition">
                  Create Problem
                </Link>
                <div className="h-4 w-px bg-slate-700"></div>
                <span className="text-sm text-slate-400">Hi, {user.firstName}</span>
                <button onClick={handleLogout} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">Log in</Link>
                <Link to="/register" className="text-sm font-medium px-5 py-2 bg-white hover:bg-slate-200 text-slate-900 rounded-full transition shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Problem Set</h1>
            <p className="text-slate-400">Master your coding skills with our curated list of problems.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-300 w-16">#</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-300">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-300 w-32">Difficulty</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-300">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {problems.map((problem, index) => (
                  <tr key={problem._id} className="hover:bg-slate-800/30 transition group">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <Link to={`/problems/${problem._id}`} className="text-white font-medium group-hover:text-blue-400 transition">
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {problem.tags?.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {problems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No problems found. Why not create one?
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemList;
