// src/services/apiService.ts (Updated)
import { models } from '../types/models';

const API_BASE_URL = 'http://localhost:8000';

// Helper function to get authorization headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // Default to JSON for authed requests now
    };
  }
  // Return non-authed headers (adjust Content-Type as needed per endpoint)
  return {
      'Content-Type': 'application/json',
  };
};

// Login function remains mostly the same, but ensure content-type is form-urlencoded
export const loginUser = async (credentials: models.UserLoginCredentials): Promise<models.Token> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch(`${API_BASE_URL}/api/v1/login/token`, {
    method: 'POST',
    headers: { // Explicitly set header for this specific request
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  // ... (rest of loginUser error handling remains the same) ...
  if (!response.ok) {
    let errorDetail = 'Login failed';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch (e) { /* Ignore */ }
    const error = new Error(`${errorDetail} (Status: ${response.status})`) as any;
    error.status = response.status;
    throw error;
  }
  const data: models.Token = await response.json();
  return data;
};

/**
 * Fetches the current logged-in user's data.
 * @returns The current user's data.
 * @throws Will throw an error if the request fails (e.g., token invalid/expired).
 */
export const getCurrentUser = async (): Promise<models.UserRead> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: 'GET',
    headers: getAuthHeaders(), // Use helper to get headers (includes token)
  });

  if (!response.ok) {
     // If token is invalid/expired, backend sends 401
    const error = new Error(`Failed to fetch user data (Status: ${response.status})`) as any;
    error.status = response.status;
    throw error;
  }

  const data: models.UserRead = await response.json();
  return data;
};


// src/services/apiService.ts (Add this function)

/**
 * Registers a new user.
 * @param userData - Object containing email, password, and optional full_name.
 * @returns The newly created user's data (excluding password).
 * @throws Will throw an error if registration fails (e.g., email exists, validation error).
 */
export const registerUser = async (userData: models.UserCreate): Promise<models.UserRead> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: 'POST',
      // Use standard headers (including Content-Type: application/json)
      // No Authorization header needed for registration
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send data as JSON
    });
  
    if (!response.ok) {
      let errorDetail = 'Registration failed';
      try {
        // Backend sends 400 for existing email or validation errors
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail;
      } catch (e) { /* Ignore if response wasn't JSON */ }
      const error = new Error(`${errorDetail} (Status: ${response.status})`) as any;
      error.status = response.status;
      throw error;
    }
  
    // Backend returns 201 Created with the new user data (UserRead model)
    const data: models.UserRead = await response.json();
    return data;
  };


// --- Add other API functions here later (e.g., registerUser, getTimeLogs) ---
// Ensure they use getAuthHeaders() if they require authentication.