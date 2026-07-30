import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './PatientSearch.css';

export default function PatientSearch({ onPatientSelect }) {
  const [searchMethod, setSearchMethod] = useState('manual'); // 'manual' or 'qr'
  const [searchTerm, setSearchTerm] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [otp, setOtp] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  const mockPatients = [
    {
      id: 1,
      name: 'Aarav Sharma',
      Id: '12-3456-7890-1234',
      age: 45,
      gender: 'Male',
      lastVisit: '14 Aug 2023'
    },
    {
      id: 2,
      name: 'Priya Patel',
      Id: '12-3456-7890-5678',
      age: 32,
      gender: 'Female',
      lastVisit: '02 Jan 2024'
    },
    {
      id: 3,
      name: 'Naiteek Papriwal',
      Id: '12-3456-7890-9101',
      age: 20,
      gender: 'Male',
      lastVisit: '22 Jul 2023'
    }
  ];

  const [searchResults, setSearchResults] = useState([]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    const results = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.Id.includes(searchTerm)
    );
    setSearchResults(results);
  };

  const startQRScan = () => {
    setScanning(true);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        setQrToken(decodedText);
        html5QrcodeScanner.clear();
        setScanning(false);
        alert(`QR Code Scanned!\nToken: ${decodedText}\n\nPlease enter the OTP provided by the patient.`);
      },
      (error) => {
        // Ignore errors
      }
    );

    setScanner(html5QrcodeScanner);
  };

  const stopQRScan = () => {
    if (scanner) {
      scanner.clear();
      setScanning(false);
    }
  };

  const handleQRVerification = (e) => {
    e.preventDefault();

    if (!qrToken || !otp) {
      alert('Please scan QR code and enter OTP');
      return;
    }

    if (otp.length !== 6) {
      alert('OTP must be 6 digits');
      return;
    }

    // Simulate verification
    alert(`Access Granted!\n\nPatient: Aarav Sharma\n: 12-3456-7890-1234\nAccess Duration: 3 Days\n\nYou can now view this patient's medical records.`);

    // Simulate patient access granted
    if (onPatientSelect) {
      onPatientSelect(mockPatients[0]);
    }

    // Reset
    setQrToken('');
    setOtp('');
  };

  const handlePatientClick = (patient) => {
    const hasAccess = window.confirm(
      `Request Access to ${patient.name}'s Records?\n\n: ${patient.Id}\n\nPatient must approve your access request.`
    );

    if (hasAccess && onPatientSelect) {
      alert(`Access request sent to ${patient.name}.\n\nYou will be notified when the patient approves.`);
    }
  };

  return (
    <div className="patient-search">
      <div className="search-header">
        <h2>Search Patient</h2>
        <p className="search-subtitle">Find patients by , name, or scan QR code for instant access</p>
      </div>

      {/* Search Method Tabs */}
      <div className="search-tabs">
        <button
          className={`tab-btn ${searchMethod === 'manual' ? 'active' : ''}`}
          onClick={() => {
            setSearchMethod('manual');
            stopQRScan();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Manual Search
        </button>
        <button
          className={`tab-btn ${searchMethod === 'qr' ? 'active' : ''}`}
          onClick={() => setSearchMethod('qr')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 14h7M14 17h7M14 20h7M17 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          QR Code Scan
        </button>
      </div>

      {/* Manual Search */}
      {searchMethod === 'manual' && (
        <div className="search-content">
          <form className="search-form" onSubmit={handleManualSearch}>
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by patient name or ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </div>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results ({searchResults.length})</h3>
              <div className="patients-grid">
                {searchResults.map((patient) => (
                  <div key={patient.id} className="patient-card" onClick={() => handlePatientClick(patient)}>
                    <div className="patient-avatar">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="patient-info">
                      <h4>{patient.name}</h4>

                      <div className="patient-meta">
                        <span>{patient.gender}, {patient.age}y</span>
                        <span className="separator">•</span>
                        <span>Last Visit: {patient.lastVisit}</span>
                      </div>
                    </div>
                    <div className="patient-action">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && searchTerm && (
            <div className="no-results">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p>No patients found</p>
              <span>Try searching with a different  or name</span>
            </div>
          )}
        </div>
      )}

      {/* QR Code Scan */}
      {searchMethod === 'qr' && (
        <div className="qr-content">
          <div className="qr-section">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14h7M14 17h7M14 20h7M17 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Scan Patient QR Code
            </h3>

            {!scanning && !qrToken && (
              <div className="qr-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <p>Ready to scan QR code</p>
                <button className="start-scan-btn" onClick={startQRScan}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14h7M14 17h7M14 20h7M17 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Start Camera
                </button>
              </div>
            )}

            {scanning && (
              <div className="qr-scanner-wrapper">
                <div id="qr-reader"></div>
                <button className="stop-scan-btn" onClick={stopQRScan}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="6" height="6" fill="currentColor" />
                  </svg>
                  Stop Scanning
                </button>
              </div>
            )}

            {qrToken && (
              <div className="qr-success">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>QR Code Scanned Successfully</p>
                <code>{qrToken}</code>
              </div>
            )}
          </div>

          <div className="otp-section">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
              Enter OTP
            </h3>

            <form className="otp-form" onSubmit={handleQRVerification}>
              <div className="otp-input-wrapper">
                <input
                  type="text"
                  className="otp-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                />
              </div>

              <button
                type="submit"
                className="verify-btn"
                disabled={!qrToken || otp.length !== 6}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verify & Access Records
              </button>
            </form>

            <div className="otp-info">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p>Ask the patient for the 6-digit OTP displayed with their QR code</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
