import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblemById, submitCode, runCodeApi } from '../api/problems';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';

const SolveProblem = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState('// Write your solution here\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
        if (data.starterCode) {
          setCode(data.starterCode);
        }
      } catch (error) {
        toast.error('Failed to load problem details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const data = await runCodeApi(code, language, customInput);
      setOutput(data.output || 'No output');
    } catch (error) {
      // Axios error objects structure
      setOutput(error.response?.data?.message || error.response?.data?.error || error.message || 'Error communicating with server');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('Submitting code...\n');
    
    try {
      const response = await submitCode(id, code, language);
      setOutput((prev) => prev + '\n> Output:\n' + response.output);
    } catch (error) {
      if (error.response?.data?.details?.output) {
        setOutput((prev) => prev + '\n> Error Output:\n' + error.response.data.details.output);
      } else {
        setOutput((prev) => prev + '\n> Request Error: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
        <Link to="/problems" className="text-blue-400 hover:underline">Back to problems</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md h-14 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="font-semibold text-white">Solvix</span>
          </Link>
          <div className="w-px h-6 bg-slate-800"></div>
          <span className="font-medium text-slate-300">{problem.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || isRunning}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Pane: Problem Description */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-800 bg-[#0c1222] overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {problem.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-slate-800/50 text-slate-400">
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none text-slate-300">
              <div dangerouslySetInnerHTML={{ __html: problem.description }} />
            </div>
          </div>
        </div>

        {/* Right Pane: Editor & Output */}
        <div className="w-full md:w-1/2 flex flex-col h-[calc(100vh-3.5rem)]">
          
          {/* Editor Header */}
          <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Editor</span>
            </div>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-xs font-medium text-slate-300 py-1 px-2 rounded outline-none border border-slate-700 focus:border-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16 }
              }}
            />
          </div>

          {/* Custom Input Area */}
          <div className="h-32 bg-[#0d1117] border-t border-slate-700 p-4 flex flex-col">
            <span className="text-slate-400 text-xs font-semibold mb-2">CUSTOM INPUT</span>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 w-full bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
              spellCheck="false"
              placeholder="Enter custom input here..."
            ></textarea>
          </div>

          {/* Terminal / Output Console */}
          <div className="h-1/3 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
            <div className="h-10 border-b border-slate-800 flex items-center px-4 shrink-0">
              <span className="text-slate-400 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                CONSOLE OUTPUT
              </span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
                {output || 'Run your code to see the output...'}
              </pre>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SolveProblem;
