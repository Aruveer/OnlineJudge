import { useState, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { runCodeApi } from '../api/problems';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const languageTemplates = {
  javascript: `// Write your JavaScript code here\nconsole.log("Hello, World!");\n`,
  python: `# Write your Python code here\nprint("Hello, World!")\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
};

const Playground = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [language, setLanguage] = useState('javascript');
  const [codeMap, setCodeMap] = useState(languageTemplates);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const code = codeMap[language];

  const handleCodeChange = (newCode) => {
    setCodeMap((prev) => ({ ...prev, [language]: newCode }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const data = await runCodeApi(code, language, customInput);
      setOutput(data.output || 'No output');
    } catch (error) {
      setOutput(error.response?.data?.message || error.response?.data?.error || error.message || 'Error communicating with server');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Compiler Playground</h1>
        
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="bg-[#111] border border-[#333] text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          
          <button 
            onClick={handleRun} 
            disabled={isRunning}
            className={`px-4 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm
              ${isRunning 
                ? 'bg-[#333] text-slate-500 cursor-not-allowed' 
                : 'bg-white hover:bg-slate-200 text-black hover:shadow-md'
              }`}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Running...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 border border-[#333] rounded-xl overflow-hidden bg-[#111] shadow-sm flex flex-col relative"
        >
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              theme={isDarkMode ? 'vs-dark' : 'light'}
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                roundedSelection: true,
              }}
            />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-96 flex flex-col gap-4"
        >
          <div className="h-1/2 flex flex-col bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 border-b border-[#333] bg-[#0a0a0a]">
              <h3 className="font-semibold text-sm text-slate-300">Standard Input</h3>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom input here..."
              className="flex-1 p-4 bg-transparent resize-none outline-none text-sm font-mono text-white"
            />
          </div>
          
          <div className="h-1/2 flex flex-col bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 border-b border-[#333] bg-[#0a0a0a]">
              <h3 className="font-semibold text-sm text-slate-300">Execution Output</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className={`font-mono text-sm whitespace-pre-wrap ${output.includes('Error') || output.includes('Exception') ? 'text-red-400' : 'text-slate-300'}`}>
                {output || <span className="text-[#555] italic">Run your code to see the output</span>}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Playground;
