import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

export default function LoginPage({ userType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        role: userType
      });

      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Navigate to dashboard
      if (userType === 'patient') {
        navigate('/patient/dashboard');
      } else if (userType === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleAboutClick = () => {
    alert('MediVerse - Digital Health Records Platform\n\n' +
      'Theme: Digitalization of Health Records\n\n' +
      'Features:\n' +
      '• Unified Health ID System\n' +
      '• Patient Medical Records Management\n' +
      '• Doctor Dashboard with Analytics\n' +
      '• Real-time Health Monitoring\n' +
      '• Secure Data Storage\n\n' +
      'Linking patients, doctors, and hospitals through a single, secure digital health ID.');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h1 className="logo">MediVerse</h1>
        </div>
        <button className="about-btn" onClick={handleAboutClick}>
          <svg className="about-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 11v5M12 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          About Project
        </button>
      </div>

      <div className="login-content">
        <div className="login-form-wrapper">
          <div className="login-card">
            <button className="back-btn" onClick={handleBackClick}>
              ← Back
            </button>

            <h2 className="form-title">Login as {userType === 'patient' ? 'Patient' : 'Doctor'}</h2>

            {error && <div className="login-error" style={{ color: '#d32f2f', background: '#fce4ec', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={userType === 'patient' ? 'e.g. naiteek.papriwal@gmail.com' : 'e.g. anushka.bhatnagar@apollohospitals.com'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="form-footer">
                <a href="#forgot">Forgot Password?</a>
                <span className="footer-divider">|</span>
                <span className="register-prompt">
                  New user? <span className="register-link" onClick={() => navigate(`/register/${userType}`)}>Register here</span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
