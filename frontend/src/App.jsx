import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import SolveProblem from './pages/SolveProblem';
import AdminCreateProblem from './pages/AdminCreateProblem';
import Dashboard from './pages/Dashboard';
import Playground from './pages/Playground';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import SidebarLayout from './layouts/SidebarLayout';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes wrapped in SidebarLayout */}
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/problems" element={<ProblemList />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/create-problem" element={<AdminCreateProblem />} />
            </Route>

            {/* Standalone full-screen routes */}
            <Route path="/problems/:id" element={<SolveProblem />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
