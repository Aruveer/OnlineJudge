import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const cursorRef = useRef(null);
  const cursorTrailRef = useRef(null);
  const elementsRef = useRef([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aiFeatures = [
    { title: "Code Review", desc: "Get instant feedback on your code quality, best practices, and potential optimizations.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "from-blue-500 to-cyan-400", codeSnippet: "// Reviewing your code...\n\nfunction optimizeMe() {\n  // ⚠️ Consider using a Set here\n  // for O(1) lookups instead of Array.\n  return arr.includes(target);\n}" },
    { title: "Explain Code", desc: "Struggling to understand a complex algorithm? SolveIt AI breaks it down line by line.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "from-purple-500 to-pink-500", codeSnippet: "// Explanation:\n\n// 1. Initialize pointers at both ends\n// 2. While left < right, swap elements\n// 3. This reverses the array in-place\n// with O(1) space complexity." },
    { title: "Debug Code", desc: "Trace bugs instantly. The AI highlights the exact lines causing errors and provides fixes.", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", color: "from-red-500 to-orange-500", codeSnippet: "// Error Detected:\n// TypeError: Cannot read properties of null\n\n- const length = node.length;\n+ const length = node?.length || 0;\n\n// Fixed null reference exception." },
    { title: "Complexity Analysis", desc: "Get accurate Time (Big O) and Space complexity breakdowns for your algorithms.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "from-yellow-400 to-amber-500", codeSnippet: "// Complexity Report:\n\n// Time Complexity: O(N log N)\n// -> Dominated by the sorting step.\n\n// Space Complexity: O(1)\n// -> In-place sorting used." },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const percentX = (clientX - centerX) / centerX;
      const percentY = (clientY - centerY) / centerY;

      elementsRef.current.forEach((el, index) => {
        if (!el) return;
        const depth = (index + 1) * 15;
        const rotateX = percentY * -15;
        const rotateY = percentX * 15;
        const translateX = percentX * depth * -1;
        const translateY = percentY * depth * -1;
        
        el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Aurora Cursor Trail */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-white/70 rounded-full mix-blend-screen pointer-events-none z-[100] -ml-1 -mt-1 shadow-[0_0_10px_rgba(255,255,255,0.5)] hidden lg:block"></div>
      <div ref={cursorTrailRef} className="fixed top-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-full mix-blend-screen blur-[50px] pointer-events-none z-[0] -ml-36 -mt-36 transition-transform duration-700 ease-out hidden lg:block"></div>
      
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[40rem] opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent blur-3xl rounded-full"></div>
      </div>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <header 
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-5xl rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg ${isScrolled ? 'py-2 px-4' : 'py-3 px-4'}`}>
        <nav className="flex justify-between items-center transition-colors w-full">
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center font-bold text-xl text-white dark:text-black transition-transform duration-300 group-hover:scale-105">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SolveIt</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#compiler" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">Compiler</a>
            <a href="#features" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">AI Features</a>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard" className="text-sm font-medium px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full transition-transform hover:scale-105 shadow-lg">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Log in</Link>
                  <Link to="/register" className="text-sm font-medium px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full transition-transform hover:scale-105 shadow-lg">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pt-56 pb-32 text-center">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
          Master Algorithms <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-800 dark:from-slate-200 dark:to-slate-500">
            Crush Interviews
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          The ultimate platform for competitive programming. Write, run, and test your code with lightning-fast execution.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 font-bold rounded-xl transition-transform hover:scale-105 shadow-lg text-lg">
            Get Started
          </Link>
        </motion.div>

        {/* Abstract visual floating in background 1: Accepted */}
        <div ref={el => elementsRef.current[0] = el} className="absolute top-40 right-10 md:right-32 z-0 hidden lg:flex flex-col items-center justify-center text-center p-6 glass-panel rounded-2xl max-w-sm shadow-2xl opacity-50 scale-75 pointer-events-none transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 transform translate-z-12">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-1 transform translate-z-8">Accepted</h3>
          <p className="text-slate-400 text-xs mb-3 transform translate-z-4">Runtime: 12ms <span className="mx-2">•</span> Memory: 4.2MB</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden transform translate-z-4">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-full"></div>
          </div>
        </div>

        {/* Abstract visual floating in background 2: TLE */}
        <div ref={el => elementsRef.current[1] = el} className="absolute bottom-10 left-10 md:left-24 z-0 hidden lg:flex flex-col items-center justify-center text-center p-5 glass-panel rounded-2xl max-w-sm shadow-2xl opacity-50 scale-75 pointer-events-none transition-transform duration-300 ease-out" style={{ transformStyle: 'preserve-3d' }}>
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-3 transform translate-z-12">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 transform translate-z-8">Time Limit Exceeded</h3>
          <p className="text-slate-400 text-xs transform translate-z-4">Runtime: &gt;2000ms</p>
        </div>

        {/* Abstract visual floating in background 3: Braces */}
        <div ref={el => elementsRef.current[2] = el} className="absolute top-24 left-32 z-0 hidden lg:flex items-center justify-center p-8 glass-panel rounded-full shadow-2xl opacity-50 dark:opacity-30 scale-110 pointer-events-none transition-transform duration-500 ease-out">
          <span className="text-5xl font-mono font-black text-blue-600/70 dark:text-blue-400/70">{`{ }`}</span>
        </div>

        {/* Abstract visual floating in background 4: Code Tag */}
        <div ref={el => elementsRef.current[3] = el} className="absolute top-80 left-20 z-0 hidden lg:flex items-center justify-center p-6 glass-panel rounded-full shadow-2xl opacity-50 dark:opacity-30 scale-90 pointer-events-none transition-transform duration-500 ease-out">
          <span className="text-4xl font-mono font-black text-purple-600/70 dark:text-purple-400/70">{`</>`}</span>
        </div>

        {/* Abstract visual floating in background 5: WA */}
        <div ref={el => elementsRef.current[4] = el} className="absolute bottom-32 right-20 md:right-40 z-0 hidden lg:flex flex-col items-center justify-center text-center p-4 glass-panel rounded-2xl max-w-sm shadow-2xl opacity-40 scale-50 pointer-events-none transition-transform duration-300 ease-out" style={{ transformStyle: 'preserve-3d' }}>
          <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center mb-2 transform translate-z-12">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 className="text-base font-bold text-white transform translate-z-8">Wrong Answer</h3>
        </div>
      </main>

      {/* Free Compiler Section */}
      <section id="compiler" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-800/50">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Fast & Secure</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Integrated Cloud Compiler</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              No local setup required. Our platform features a built-in, secure sandboxed execution environment. 
              Whether you are viewing the problem list or in the playground, you can instantly run your code, supply custom inputs, and view outputs in milliseconds.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs font-mono text-slate-500">terminal</span>
              </div>
              <div className="font-mono text-sm text-slate-300 leading-loose text-left">
                <p className="text-blue-400">$ compiling main.cpp...</p>
                <p className="text-green-400">✓ Build finished successfully.</p>
                <p className="text-blue-400 mt-2">$ running executable...</p>
                <p>Output:</p>
                <p className="text-white font-bold">Hello, World!</p>
                <p className="mt-2 text-slate-500">Execution Time: 12ms</p>
                <p className="text-slate-500">Memory Used: 4.2 MB</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Interactive Showcase */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Supercharged by AI</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Never get stuck again. SolveIt AI acts as your personal pair-programmer, ready to help you understand and conquer any problem.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Side: Navigation List */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-3">
            {aiFeatures.map((feature, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveFeature(idx)}
                className={`text-left p-5 rounded-2xl transition-all duration-300 border ${activeFeature === idx ? `bg-slate-800/80 border-slate-600 shadow-lg scale-105` : `bg-transparent border-transparent hover:bg-slate-800/40`}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeFeature === idx ? `bg-gradient-to-br ${feature.color} text-white shadow-md` : `bg-slate-800 text-slate-400`}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${activeFeature === idx ? 'text-white' : 'text-slate-400'}`}>{feature.title}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Right Side: Active Showcase */}
          <div className="w-full lg:w-1/2">
            <div className={`relative w-full rounded-3xl glass-panel border border-slate-700/50 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500`}>
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${aiFeatures[activeFeature].color}`}></div>
              
              <div className="p-8 md:p-10">
                <h3 className="text-3xl font-bold mb-4 text-white">{aiFeatures[activeFeature].title}</h3>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">{aiFeatures[activeFeature].desc}</p>
                
                {/* Simulated Code Editor Preview */}
                <div className="w-full rounded-xl bg-[#0d1117] border border-slate-700 shadow-inner overflow-hidden text-left">
                  <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-[#161b22]">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 text-xs font-mono text-slate-500">solveit-ai-preview.js</div>
                  </div>
                  <div className="p-6 font-mono text-sm md:text-base leading-loose text-slate-300 whitespace-pre-wrap overflow-x-auto">
                    {aiFeatures[activeFeature].codeSnippet.split('\n').map((line, i) => {
                      if (line.startsWith('//')) {
                        return <div key={i} className="text-slate-500">{line}</div>;
                      } else if (line.startsWith('-')) {
                        return <div key={i} className="text-red-400 bg-red-500/10 -mx-6 px-6">{line}</div>;
                      } else if (line.startsWith('+')) {
                        return <div key={i} className="text-green-400 bg-green-500/10 -mx-6 px-6">{line}</div>;
                      } else if (line.startsWith('>')) {
                         return <div key={i} className="text-blue-400">{line}</div>;
                      } else {
                        return <div key={i}>{line}</div>;
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Marquee */}
      <section className="relative z-10 w-full overflow-hidden bg-slate-900/30 border-y border-slate-800/50 py-16 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-10 text-slate-300">A Free Compiler for Every Language</h2>
        <div className="w-full relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex space-x-24 items-center">
            {["JavaScript", "Python", "C++", "Java", "JavaScript", "Python", "C++", "Java", "JavaScript", "Python", "C++", "Java"].map((lang, idx) => (
              <span key={idx} className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400 opacity-40 hover:opacity-100 hover:from-blue-400 hover:to-purple-500 transition-all cursor-default">
                {lang}
              </span>
            ))}
            {/* Duplicate for infinite loop */}
            {["JavaScript", "Python", "C++", "Java", "JavaScript", "Python", "C++", "Java", "JavaScript", "Python", "C++", "Java"].map((lang, idx) => (
              <span key={`dup-${idx}`} className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400 opacity-40 hover:opacity-100 hover:from-blue-400 hover:to-purple-500 transition-all cursor-default ml-24">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-slate-500 text-sm transition-colors">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">S</div>
          <span className="font-bold text-slate-300">SolveIt</span>
        </div>
        <p>© 2026 SolveIt. All rights reserved. Master the craft of code.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
