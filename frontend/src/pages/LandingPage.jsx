import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden relative font-sans">
      
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[40rem] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full"></div>
      </div>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl">
            S
          </div>
          <span className="text-2xl font-bold tracking-tight">Solvix</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-medium bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Solvix 1.0 is live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Master algorithms with <br className="hidden md:block" />
          <span className="text-gradient">precision & speed.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          The ultimate online judge platform designed for competitive programmers and developers looking to sharpen their coding skills.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/register" className="w-full sm:w-auto px-10 py-4 text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transform hover:-translate-y-1">
            Get Started
          </Link>
        </div>

        {/* Dashboard Preview / Abstract visual */}
        <div className="mt-24 w-full max-w-5xl rounded-2xl glass-panel p-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video relative flex items-center justify-center">
            {/* Abstract code representation */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-20"></div>
            
            <div className="z-10 flex flex-col items-center justify-center text-center p-8 glass-panel rounded-2xl max-w-lg shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Accepted</h3>
              <p className="text-slate-400 mb-4">Runtime: 12ms <span className="mx-2">•</span> Memory: 4.2MB</p>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-6 py-24 border-t border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Lightning Fast Evaluation",
              desc: "Get instant feedback on your code submissions with our high-performance execution engine.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            },
            {
              title: "Multiple Languages",
              desc: "Solve problems in C++, Java, Python, JavaScript, and more. Use the tools you know best.",
              icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            },
            {
              title: "Detailed Analytics",
              desc: "Track your progress, view detailed test case results, and optimize your algorithms.",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl hover:bg-slate-800/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 Solvix. Master the craft of code.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
