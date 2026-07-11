import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import SolveProblem from './pages/SolveProblem';
import AdminCreateProblem from './pages/AdminCreateProblem';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:id" element={<SolveProblem />} />
          <Route path="/admin/create-problem" element={<AdminCreateProblem />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
