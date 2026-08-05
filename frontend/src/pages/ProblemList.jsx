import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProblems } from '../api/problems';
import { toast } from 'react-hot-toast';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-[#222] border-[#333]';
    }
  };

  const allTags = ['All', ...new Set(problems.flatMap(p => p.tags || []))].sort();

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'All' || (problem.tags && problem.tags.includes(tagFilter));
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Curriculum</h1>
          <p className="text-slate-400">Master the fundamental algorithms and data structures required for technical interviews.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-[#111] rounded-lg p-1 border border-[#333] self-start md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-[#222] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              List
            </div>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'grid' 
                ? 'bg-[#222] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Grid
            </div>
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
        >
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag === 'All' ? 'All Topics' : tag}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="col-span-full py-12 text-center text-slate-400 bg-[#111] rounded-2xl border border-[#333] border-dashed">
          No problems found matching your filters.
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProblems.map((problem) => (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              key={problem._id}
            >
              <Link 
                to={`/problems/${problem._id}`} 
                className="group glass-card bg-[#111] border border-[#333] rounded-2xl p-6 hover:border-slate-500 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">
                  {problem.title}
                </h3>
                
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">
                  {problem.description?.substring(0, 120) || "Solve this algorithmic challenge to improve your coding skills."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#333]">
                  <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">
                    Solve Challenge
                  </span>
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="glass-card bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-sm"
        >
          <div className="divide-y divide-[#333]">
            {filteredProblems.map((problem) => (
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} key={problem._id}>
                <Link 
                  to={`/problems/${problem._id}`}
                  className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-slate-300 transition-colors">{problem.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xl truncate">
                        {problem.description || "Algorithmic challenge"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemList;
