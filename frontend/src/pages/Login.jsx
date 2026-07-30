import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await login({ email, password });
      loginUser(userData);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000] relative overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-xl text-black transition-transform duration-300 group-hover:scale-105">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">SolveIt</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-slate-200 transition-all shadow-lg hover:scale-105">
            Register
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md p-8 relative z-10 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400">Sign in to continue to SolveIt</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition duration-200"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition duration-200"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black font-bold rounded-xl shadow-lg transition-colors hover:bg-slate-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Create an account
          </Link>
        </p>
      </motion.div>
      </div>
    </div>
  );
};

export default Login;
