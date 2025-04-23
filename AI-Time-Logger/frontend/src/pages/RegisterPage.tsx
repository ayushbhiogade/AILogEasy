// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService'; // Import API function
import { models } from '../types/models';
// Optional: Import useAuth if you want to automatically log in after registration
// import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Optional field
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { login } = useAuth(); // Get login function if auto-login is desired

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const userData: models.UserCreate = {
      email,
      password,
      full_name: fullName || null, // Send null if empty, adjust as needed
    };

    try {
      console.log('Attempting registration with:', userData);
      const newUser = await registerUser(userData);
      console.log('Registration Success:', newUser);

      setSuccessMessage('Registration successful! Please log in.');

      // Option 1: Redirect to login page after a short delay
      setTimeout(() => {
         navigate('/login');
      }, 2000); // 2-second delay

      // Option 2: Automatically log the user in (more complex)
      // Requires fetching token immediately after registration or modifying backend
      // const loginData = await loginUser({ username: email, password: password });
      // if (loginData.access_token) {
      //   await login(loginData.access_token);
      //   navigate('/dashboard');
      // }

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || "An unexpected error occurred during registration.");
      setIsLoading(false); // Stop loading only on error
    }
    // Don't set isLoading false on success if navigating away immediately
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reg-email">Email:</label>
          <input
            type="email"
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
         <div> {/* Optional Full Name Field */}
          <label htmlFor="reg-fullname">Full Name:</label>
          <input
            type="text"
            id="reg-fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="reg-password">Password:</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8} // Example: Enforce minimum password length
            disabled={isLoading}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;