import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblemById, submitCode, runCodeApi, getUserSubmissions } from '../api/problems';
import { askAiChat, getAiHint, getAiReview } from '../api/ai';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

const languageTemplates = {
  javascript: `const fs = require('fs');\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8');\n    // Write your code here\n    \n}\n\nmain();`,
  python: `import sys\n\ndef main():\n    # Read all input from standard input\n    input_data = sys.stdin.read()\n    # Write your code here\n    \nif __name__ == '__main__':\n    main()`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}`,
  java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}`
};

const SolveProblem = () => {
  const { id } = useParams();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [codeMap, setCodeMap] = useState(languageTemplates);
  const [language, setLanguage] = useState('cpp');

  const code = codeMap[language];
  const setCode = (newCode) => {
    setCodeMap(prev => ({ ...prev, [language]: newCode }));
  };

  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // AI State
  const [activeTab, setActiveTab] = useState('description');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [failedContext, setFailedContext] = useState(null);
  const [hintGenerated, setHintGenerated] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [acceptedContext, setAcceptedContext] = useState(null);
  const [reviewGenerated, setReviewGenerated] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
        if (data.starterCode && data.starterCode !== '// Write your solution here\n' && data.starterCode !== '// Read input from stdin\n// Output the result to stdout\n') {
          setCodeMap(prev => ({ ...prev, javascript: data.starterCode }));
        }
      } catch (error) {
        toast.error('Failed to load problem details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeTab, id]);

  const fetchSubmissions = async () => {
    setIsSubmissionsLoading(true);
    try {
      const data = await getUserSubmissions(id);
      setSubmissions(data);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    setFailedContext(null);
    setHintGenerated(false);
    setHintCount(0);
    
    try {
      let inputToUse = customInput;
      let isDefaultTestcase = false;
      let expectedOutput = null;

      if (!showCustomInput && problem?.testCases?.length > 0) {
        inputToUse = problem.testCases[0].input;
        expectedOutput = problem.testCases[0].expectedOutput;
        isDefaultTestcase = true;
      }

      const data = await runCodeApi(code, language, inputToUse);
      
      let outStr = data.output || 'No output';
      
      if (isDefaultTestcase) {
         const outTrim = outStr.trim();
         const expTrim = expectedOutput.trim();
         if (outTrim === expTrim) {
             setOutput(`[Default Sample Testcase]\nInput:\n${inputToUse}\n\nYour Output:\n${outStr}\n\nResult: PASS ✅`);
         } else {
             setOutput(`[Default Sample Testcase]\nInput:\n${inputToUse}\n\nYour Output:\n${outStr}\n\nExpected:\n${expectedOutput}\n\nResult: FAIL ❌`);
             setFailedContext({ problemTitle: problem?.title, problemStatement: problem?.description, code, language, errorMessage: 'Failed Sample Testcase', testcaseResult: outStr });
         }
      } else {
         setOutput(outStr);
      }
    } catch (error) {
      const errOut = error.response?.data?.message || error.response?.data?.error || error.message || 'Error communicating with server';
      setOutput(errOut);
      setFailedContext({ problemTitle: problem?.title, problemStatement: problem?.description, code, language, errorMessage: errOut, testcaseResult: 'Failed execution or compilation' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('Submitting code...\n');
    setFailedContext(null);
    setHintGenerated(false);
    setHintCount(0);
    setAcceptedContext(null);
    setReviewGenerated(false);
    setReviewRating(null);
    
    try {
      const res = await submitCode(id, code, language);
      setOutput((prev) => prev + '\n> Output:\n' + res.output);
      
      if (res.verdict === 'Accepted') {
        toast.success('Code Accepted!');
        setAcceptedContext({ problemTitle: problem?.title, problemStatement: problem?.description, code, language });
      } else {
        toast.error(`Submission Failed: ${res.verdict}`);
        setFailedContext({ problemTitle: problem?.title, problemStatement: problem?.description, code, language, errorMessage: res.verdict, testcaseResult: res.output });
      }
      
      // Refresh submissions if the tab is open
      if (activeTab === 'submissions') {
        fetchSubmissions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit code');
      const errOut = error.response?.data?.details?.output || error.response?.data?.message || error.message;
      setOutput((prev) => prev + '\n> Request Error: ' + errOut);
      setFailedContext({ problemTitle: problem?.title, problemStatement: problem?.description, code, language, errorMessage: errOut, testcaseResult: 'Failed execution' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    const newHistory = [...chatHistory, { role: 'user', content: userMsg }];
    setChatHistory(newHistory);
    setIsChatLoading(true);
    try {
      const res = await askAiChat({ problemTitle: problem.title, problemStatement: problem.description, message: userMsg, history: chatHistory });
      setChatHistory([...newHistory, { role: 'assistant', content: res.reply }]);
    } catch (error) {
      toast.error('AI Chat Error');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    setActiveTab('ai');
    
    const nextHintNum = hintCount + 1;
    setHintCount(nextHintNum);
    
    const userMsg = { role: 'user', content: 'Can I get a hint please?' };
    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await getAiHint({ ...failedContext, history: [...chatHistory, userMsg], hintNumber: nextHintNum });
      setChatHistory(prev => [...prev, { role: 'assistant', content: res.hint }]);
      setHintGenerated(true);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'AI Hint Error: ' + (error.response?.data?.message || error.message) }]);
    } finally {
      setIsHintLoading(false);
      setIsChatLoading(false);
    }
  };

  const handleGetReview = async () => {
    setIsReviewLoading(true);
    setActiveTab('ai');
    
    const userMsg = { role: 'user', content: 'Please review my accepted code.' };
    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await getAiReview(acceptedContext);
      if (res && res.review) {
        let reviewText = res.review;
        let rating = null;

        const ratingMatch = reviewText.match(/^(?:(?:OVERALL_)?RATING:\s*)?(EFFICIENT|CAN_IMPROVE|CAN IMPROVE|POTENTIAL_BOTTLENECK|POTENTIAL BOTTLENECK)[:-]?\s*/im);
        if (ratingMatch) {
          const rawRating = ratingMatch[1].toUpperCase().replace(' ', '_');
          if (rawRating === 'EFFICIENT') rating = 'green';
          else if (rawRating === 'CAN_IMPROVE') rating = 'yellow';
          else if (rawRating === 'POTENTIAL_BOTTLENECK') rating = 'red';
          
          reviewText = reviewText.replace(ratingMatch[0], '').trim();
        }

        setReviewRating(rating);
        setChatHistory(prev => [...prev, { role: 'assistant', content: reviewText }]);
        setReviewGenerated(true);
      } else {
        toast.error('Code Review was empty');
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'AI Review Error: ' + (error.response?.data?.message || error.message) }]);
    } finally {
      setIsReviewLoading(false);
      setIsChatLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500 dark:text-slate-300 transition-colors">
        <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
        <Link to="/problems" className="text-blue-500 hover:underline">Back to problems</Link>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-slate-200 flex flex-col overflow-hidden font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="border-b border-[#333] bg-[#0a0a0a]/80 backdrop-blur-md h-14 flex items-center justify-between px-4 shrink-0 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors group cursor-pointer">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back</span>
          </Link>
          <div className="w-px h-6 bg-[#333]"></div>
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
      <main className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden p-4 gap-4 bg-[#0a0a0a]">
        
        {/* Left Pane: Problem Description & AI */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col min-h-0 h-full border border-[#333] bg-[#111] rounded-xl overflow-hidden shadow-sm"
        >
          <div className="flex border-b border-slate-200 dark:border-slate-800 shrink-0">
             <button onClick={() => setActiveTab('description')} className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Description</button>
             <button onClick={() => setActiveTab('submissions')} className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'submissions' ? 'border-b-2 border-blue-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Submissions</button>
             <button onClick={() => setActiveTab('ai')} className={`flex-1 py-3 text-sm font-semibold transition flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'border-b-2 border-emerald-500 text-white' : 'text-emerald-500/70 hover:text-emerald-400'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Assistant
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {activeTab === 'description' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{problem.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {problem.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(problem.description) }} />
                </div>

                {/* Examples */}
                {problem.testCases && problem.testCases.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Examples</h3>
                    {problem.testCases.slice(0, 2).map((tc, index) => (
                      <div key={index} className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Example {index + 1}:</p>
                        <div className="space-y-3 text-sm font-mono mt-3">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">Input:</span>
                            <div className="bg-white dark:bg-[#111] p-3 rounded-md border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                              {tc.input}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">Output:</span>
                            <div className="bg-white dark:bg-[#111] p-3 rounded-md border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                              {tc.expectedOutput}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Constraints</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <li>Time Limit: {problem.timeLimit} seconds</li>
                    <li>Memory Limit: {problem.memoryLimit} MB</li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Past Submissions</h2>
                {isSubmissionsLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No submissions yet for this problem.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold ${sub.verdict === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {sub.verdict}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-4">
                            <span>{new Date(sub.createdAt).toLocaleString()}</span>
                            <span>Language: {sub.language}</span>
                          </div>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 font-medium">
                          {sub.passedCount} / {sub.totalTestCases}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className={`flex flex-col h-full transition-all duration-500 rounded-b-lg ${
                reviewRating === 'green' ? 'bg-emerald-900/40 shadow-[inset_0_0_100px_rgba(16,185,129,0.15)]' : 
                reviewRating === 'yellow' ? 'bg-yellow-900/40 shadow-[inset_0_0_100px_rgba(234,179,8,0.15)]' : 
                reviewRating === 'red' ? 'bg-red-900/40 shadow-[inset_0_0_100px_rgba(239,68,68,0.15)]' : 
                ''
              }`}>
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-10">
                      Ask me for conceptual help, algorithm explanations, or to clarify the problem statement!
                    </div>
                  )}
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-900/30 ml-auto max-w-[80%] text-blue-100' : 'bg-slate-800/50 mr-auto max-w-[90%] text-slate-300'}`}>
                      <div className="text-xs font-bold mb-1 opacity-50">{msg.role === 'user' ? 'You' : 'SolveIt AI'}</div>
                      <div className="text-sm">
                        {msg.role === 'user' ? (
                          <div className="whitespace-pre-wrap">{String(msg.content || '')}</div>
                        ) : (
                          <div 
                            className="prose dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-700/50"
                            dangerouslySetInnerHTML={{ __html: marked(String(msg.content || '')) }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="bg-slate-800/50 mr-auto p-3 rounded-lg text-slate-400 text-sm animate-pulse">Thinking...</div>
                  )}
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2 shrink-0">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask AI Assistant..." className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded text-white text-sm font-medium transition">Send</button>
                </form>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Pane: Editor & Output */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col h-full min-h-0 border border-[#333] bg-[#0a0a0a] rounded-xl overflow-hidden shadow-sm"
        >
          
          {/* Editor Header */}
          <div className="h-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Editor</span>
            </div>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="bg-slate-800 text-xs font-medium text-slate-300 py-1 px-2 rounded outline-none border border-slate-700 focus:border-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Editor Area */}
          <div className="flex-1 min-h-0 relative">
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

          {/* Custom Input Toggle */}
          <div className="bg-[#0d1117] border-t border-slate-700 p-3 flex items-center shrink-0">
             <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 transition">
                <input 
                   type="checkbox" 
                   checked={showCustomInput} 
                   onChange={(e) => setShowCustomInput(e.target.checked)}
                   className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs font-bold uppercase tracking-wider">Custom Testcase</span>
             </label>
          </div>

          {/* Custom Input Area (Conditional) */}
          {showCustomInput && (
            <div className="h-32 bg-[#0d1117] border-t border-slate-800 p-4 flex flex-col shrink-0">
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 w-full bg-slate-900/50 rounded border border-slate-700 text-slate-300 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 p-2 custom-scrollbar"
                spellCheck="false"
                placeholder="Enter custom input here..."
              ></textarea>
            </div>
          )}

          {/* Terminal / Output Console */}
          <div className="h-2/5 border-t border-slate-700 flex flex-col shrink-0 transition-colors duration-500 bg-[#1e1e1e]">
            <div className="bg-[#2d2d2d] flex items-center px-2 justify-between shrink-0 border-b border-slate-800">
              <div className="flex h-10">
                <div className="px-4 py-2 border-b-2 border-blue-500 text-slate-200 text-sm font-semibold flex items-center gap-2 bg-[#1e1e1e]">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Result
                </div>
              </div>
              <div className="flex gap-2">
                {failedContext && (
                  <button onClick={handleGetHint} disabled={isHintLoading} className="text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1">
                    {isHintLoading ? 'Analyzing...' : '💡 AI Hint'}
                  </button>
                )}
                {acceptedContext && !reviewGenerated && (
                  <button onClick={handleGetReview} disabled={isReviewLoading} className="text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1">
                    {isReviewLoading ? 'Analyzing...' : '✨ Code Review'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#1e1e1e]">
              <div className="flex flex-col gap-4">
                {!output ? (
                  <div className="text-slate-500 text-sm">You must run your code first.</div>
                ) : (
                  <div className="rounded-lg p-4 border bg-[#0d1117] border-slate-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] text-slate-300">
                    <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default SolveProblem;
