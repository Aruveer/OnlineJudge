import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createProblem } from '../api/problems';
import { AuthContext } from '../context/AuthContext';

const AdminCreateProblem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    constraints: '',
    difficulty: 'Easy',
    tags: '',
    timeLimit: 1.0,
    memoryLimit: 256,
  });

  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '', isSample: true }
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isSample: false }]);
  };

  const removeTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a problem');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        testCases
      };
      
      await createProblem(payload);
      toast.success('Problem created successfully!');
      navigate('/problems');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create problem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Problem</h1>
        <button onClick={() => navigate('/problems')} className="text-sm font-medium text-blue-600 hover:text-blue-500 transition">
          &larr; Back to Problems
        </button>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* Basic Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Basic Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Two Sum"
                />
              </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Problem Statement</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the problem, input format, output format..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Constraints</label>
                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 1 <= n <= 10^5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Arrays, Dynamic Programming, Math"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Time Limit (seconds)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Memory Limit (MB)</label>
                  <input
                    type="number"
                    name="memoryLimit"
                    value={formData.memoryLimit}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Test Cases */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-semibold text-emerald-400">Test Cases</h2>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="text-sm px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  + Add Test Case
                </button>
              </div>

              {testCases.map((tc, index) => (
                <div key={index} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 relative">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-slate-400">Test Case #{index + 1}</span>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        required
                        rows="3"
                        className="w-full px-3 py-2 font-mono text-sm rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                        required
                        rows="3"
                        className="w-full px-3 py-2 font-mono text-sm rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`sample-${index}`}
                      checked={tc.isSample}
                      onChange={(e) => handleTestCaseChange(index, 'isSample', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor={`sample-${index}`} className="ml-2 text-sm text-slate-300">
                      Is this a sample test case? (Visible to users)
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg transform transition hover:-translate-y-0.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Publishing Problem...' : 'Publish Problem'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default AdminCreateProblem;
