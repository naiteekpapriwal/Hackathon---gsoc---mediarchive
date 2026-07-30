import api from './api';

export const authService = {
  // Login for both patients and doctors
  login: async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password, 
        role 
      });
      
      // Store token and user info
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register patient
  registerPatient: async (userData) => {
    try {
      const response = await api.post('/auth/register/patient', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register doctor
  registerDoctor: async (userData) => {
    try {
      const response = await api.post('/auth/register/doctor', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify Aadhaar OTP
  verifyAadhaar: async (aadhaarNumber, otp) => {
    try {
      const response = await api.post('/auth/verify-aadhaar', { 
        aadhaarNumber, 
        otp 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send Aadhaar OTP
  sendAadhaarOTP: async (aadhaarNumber) => {
    try {
      const response = await api.post('/auth/send-aadhaar-otp', { aadhaarNumber });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
