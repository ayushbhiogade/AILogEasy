// src/App.tsx (Updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

// Placeholder for the main dashboard/protected area
function DashboardPage() {
  const { user, logout } = useAuth(); // Get user and logout from context
  const navigate = useNavigate(); // Get navigate hook

  const handleLogout = () => {
    logout(); // Clear auth state
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {/* Display user info if available */}
      {user ? (
        <p>Welcome, {user.full_name || user.email}! You are logged in.</p>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={handleLogout}>Logout</button> {/* Use handleLogout */}
    </div>
  );
}


// Placeholder for a simple home page or redirect logic later
function HomePage() {
  // Could add logic here to redirect to /dashboard if logged in
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Home</h2>
      <p>This is the public home page.</p>
      <nav>
        {isAuthenticated ? (
          <Link to="/dashboard">Go to Dashboard</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> {/* <-- Add Register Route */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<DashboardPage />} />
            </Route>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Need to import useAuth for components using it


export default App;