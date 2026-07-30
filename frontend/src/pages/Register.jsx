import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { register } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await register({ firstName, lastName, email, password });
      loginUser(userData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
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
      <div className="absolute top-[10%] right-[10%] w-[30rem] h-[30rem] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-lg p-6 relative z-10 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm">Join SolveIt today and start coding</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">First Name</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition text-sm"
                placeholder="First Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition text-sm"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              minLength="6"
              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-500 transition text-sm"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 mt-2 bg-white text-black font-bold rounded-xl shadow-lg transition-colors hover:bg-slate-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Sign In
          </Link>
        </p>
      </motion.div>
      </div>
    </div>
  );
};

export default Register;
