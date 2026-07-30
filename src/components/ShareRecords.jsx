import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import './ShareRecords.css';

export default function ShareRecords() {
  const [shareToken, setShareToken] = useState('');
  const [otp, setOtp] = useState('');
  const [expiryTime, setExpiryTime] = useState(null);
  const [duration, setDuration] = useState(3);
  const [activeAccess, setActiveAccess] = useState([
    {
      id: 1,
      doctorName: 'Dr. Anjali Sharma',
      specialization: 'Cardiologist',
      hospital: 'Apollo Hospital, Mumbai',
      grantedAt: '2024-02-01',
      expiresAt: '2024-02-04'
    },
    {
      id: 2,
      doctorName: 'Dr. Vikram Singh',
      specialization: 'General Physician',
      hospital: 'Max Healthcare, Delhi',
      grantedAt: '2024-01-28',
      expiresAt: '2024-02-11'
    }
  ]);

  const generateShareToken = () => {
    // Generate random token and OTP
    const token = 'MED-' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);
    
    setShareToken(token);
    setOtp(generatedOtp);
    setExpiryTime(expiryDate);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  const revokeAccess = (accessId) => {
    if (window.confirm('Are you sure you want to revoke access for this doctor?')) {
      setActiveAccess(activeAccess.filter(access => access.id !== accessId));
      alert('Access revoked successfully');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="share-records">
      <div className="share-header">
        <h2>Share Medical Records</h2>
        <p className="share-subtitle">Generate a secure QR code and OTP to share your medical records with doctors</p>
      </div>

      <div className="share-content">
        {/* Generate Token Section */}
        <div className="generate-section">
          <div className="generate-card">
            <h3>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Generate Access Code
            </h3>

            <div className="form-group">
              <label>Access Duration</label>
              <select 
                className="duration-select" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>7 Days</option>
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>

            <button className="generate-btn" onClick={generateShareToken}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {shareToken ? 'Regenerate Token' : 'Generate Token'}
            </button>
          </div>

          {/* QR Code Display */}
          {shareToken && (
            <div className="qr-display-card">
              <h3>
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14h7M14 17h7M14 20h7M17 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Scan QR Code
              </h3>

              <div className="qr-code-wrapper">
                <div className="qr-code-container">
                  <QRCode value={shareToken} size={180} />
                </div>
              </div>

              <div className="token-details">
                <div className="token-item">
                  <div className="token-label">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 6h6M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Access Token
                  </div>
                  <div className="token-value-row">
                    <code className="token-value">{shareToken}</code>
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(shareToken, 'Token')}
                      title="Copy Token"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="token-item">
                  <div className="token-label">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                    OTP Code
                  </div>
                  <div className="token-value-row">
                    <code className="token-value otp-code">{otp}</code>
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(otp, 'OTP')}
                      title="Copy OTP"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="expiry-info">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Expires on: {expiryTime?.toLocaleString('en-IN', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Access List */}
        <div className="active-access-section">
          <h3>
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Active Doctor Access
          </h3>

          {activeAccess.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>No active doctor access</p>
              <span>Generate a QR code to grant access to doctors</span>
            </div>
          ) : (
            <div className="access-table-wrapper">
              <table className="access-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Hospital</th>
                    <th>Granted On</th>
                    <th>Expires On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAccess.map((access) => (
                    <tr key={access.id}>
                      <td>
                        <div className="doctor-info">
                          <strong>{access.doctorName}</strong>
                          <span className="specialization">{access.specialization}</span>
                        </div>
                      </td>
                      <td>{access.hospital}</td>
                      <td>{formatDate(access.grantedAt)}</td>
                      <td>{formatDate(access.expiresAt)}</td>
                      <td>
                        <button 
                          className="revoke-btn" 
                          onClick={() => revokeAccess(access.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
