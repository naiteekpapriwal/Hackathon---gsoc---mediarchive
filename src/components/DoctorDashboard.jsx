import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './DoctorDashboard.css';
import QRScanner from './QRScanner';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [apiSearchTerm, setApiSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingPatientId, setAddingPatientId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState({});
  const [api, setApi] = useState(null);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    email: '',
    type: 'Consultation',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    prescription: '',
    notes: ''
  });
  const [submittingConsultation, setSubmittingConsultation] = useState(false);
  const [showDoctorCard, setShowDoctorCard] = useState(false);

  useEffect(() => {
    import('../services/api').then(module => setApi(() => module.default));
  }, []);

  const fetchConsultations = async () => {
    if (!api) return;
    try {
      const res = await api.get('/doctor/consultations');
      setRecentConsultations(res.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  useEffect(() => {
    if (api && activeTab === 'consultations') {
      fetchConsultations();
    }
  }, [api, activeTab]);

  const handleApiSearch = async () => {
    if (!api || !apiSearchTerm.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.get(`/doctor/search-patient?q=${apiSearchTerm}`);
      setPatientSearchResults(res.data);
    } catch (err) {
      alert('Error searching patients');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPatient = async (patientId) => {
    if (!api) return;
    const duration = selectedDuration[patientId] || 3;
    setAddingPatientId(patientId);
    try {
      await api.post(`/doctor/request-access/${patientId}`, { reason: 'Consultation', duration });
      alert('Patient access granted successfully for ' + duration + ' days!');
      // refresh linked patients if needed or just switch tab
      setActiveTab('patients');
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting access');
    } finally {
      setAddingPatientId(null);
    }
  };

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load user data from backend (stored at login)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = storedUser.profile || {};

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: storedUser.name || '',
    phone: storedUser.phone || '',
    specialization: profile.specialization || '',
    hospital: profile.hospital || '',
    experience: profile.experience || '',
    hprId: profile.hprId || ''
  });
  const [submittingProfile, setSubmittingProfile] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('authToken')) {
      navigate('/login/doctor');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!api) return;
    setSubmittingProfile(true);
    try {
      const res = await api.put('/doctor/profile', profileForm);
      const updatedUser = {
        ...storedUser,
        name: profileForm.name,
        phone: profileForm.phone,
        profile: {
          ...storedUser.profile,
          specialization: profileForm.specialization,
          hospital: profileForm.hospital,
          experience: profileForm.experience,
          hprId: profileForm.hprId
        }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
      setShowEditProfileModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSubmittingProfile(false);
    }
  };

  // Doctor Information - loaded from backend via login
  const doctorInfo = {
    name: storedUser.name || 'Dr. Anushka Bhatnagar',
    specialization: profile.specialization || 'Cardiologist',
    hospital: profile.hospital || 'Apollo Hospitals, Mumbai',
    Id: profile.hprId || '78-9012-3456-7890',
    phone: storedUser.phone || '+91 98765 43210',
    email: storedUser.email || 'anushka.bhatnagar@apollohospitals.com',
    experience: profile.experience || '15 years',
    patients: 348,
    consultationsToday: 12
  };

  // Linked Patients
  const linkedPatients = [
    {
      id: 1,
      name: 'Aarav Sharma',
      Id: '12-3456-7890-1234',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      lastVisit: '08-02-2026',
      nextAppointment: '15-02-2026',
      condition: 'Hypertension',
      status: 'Active',
      country: 'India'
    },
    {
      id: 2,
      name: 'Priya Patel',
      Id: '12-3456-7890-5678',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      lastVisit: '05-02-2026',
      nextAppointment: '12-02-2026',
      condition: 'Diabetes Type 2',
      status: 'Active',
      country: 'India'
    },
    {
      id: 3,
      name: 'Naiteek Papriwal',
      Id: '12-3456-7890-9012',
      age: 20,
      gender: 'Male',
      bloodGroup: 'B+',
      lastVisit: '28-01-2026',
      nextAppointment: '20-02-2026',
      condition: 'Coronary Artery Disease',
      status: 'Active',
      country: 'India'
    },
    {
      id: 4,
      name: 'Meera Singh',
      Id: '12-3456-7890-3456',
      age: 28,
      gender: 'Female',
      bloodGroup: 'AB+',
      lastVisit: '07-02-2026',
      nextAppointment: '14-02-2026',
      condition: 'Asthma',
      status: 'Active',
      country: 'India'
    },
    {
      id: 5,
      name: 'Arjun Verma',
      Id: '12-3456-7890-7890',
      age: 52,
      gender: 'Male',
      bloodGroup: 'A-',
      lastVisit: '01-02-2026',
      nextAppointment: '22-02-2026',
      condition: 'Arthritis',
      status: 'Active',
      country: 'India'
    }
  ];

  // Recent Consultations (fetched from API)
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Doctor Settings State
  const [acceptingPatients, setAcceptingPatients] = useState(true);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'patient', text: 'Doctor, my blood pressure reading this morning was 130/85. Is that okay?', time: '08:45 AM' },
    { id: 2, sender: 'doctor', text: 'Yes, that is within the acceptable range for now. Keep monitoring it.', time: '09:10 AM' }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'doctor',
      text: newChatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewChatMessage('');
    
    // Simulate patient reply after 1.5 seconds
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'patient',
        text: 'Thank you doctor, I will update you tomorrow.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const startSimulatedScan = () => {
    setShowQrScanner(true);
    setIsScanning(true);
  };

  const handleQRScanSuccess = (decodedText) => {
    // If you scanned a real ID from the QR code, you would search for it here.
    // For demo purposes, we will simply say it was successful and select the first patient
    setIsScanning(false);
    
    // Show success for a brief moment before closing
    setTimeout(() => {
      setShowQrScanner(false);
      // You can match the decodedText to a patient here, 
      // e.g., const foundPatient = linkedPatients.find(p => p.Id === decodedText);
      handleSelectPatient(linkedPatients[0]); 
    }, 1500);
  };
  // Dashboard Stats
  const stats = [
    {
      icon: 'bi-people-fill',
      label: 'My Patients',
      value: '156',
      color: '#2A6F28',
      change: '+12%'
    },
    {
      icon: 'bi-calendar-check-fill',
      label: 'Today\'s Appointments',
      value: '8',
      color: '#2A6F28',
      change: '+3'
    },
    {
      icon: 'bi-clipboard-pulse',
      label: 'Pending Reviews',
      value: '12',
      color: '#2A6F28',
      change: '-2'
    },
    {
      icon: 'bi-award-fill',
      label: 'Years Experience',
      value: '15',
      color: '#2A6F28',
      change: ''
    }
  ];

  // Recent Activity (for future use)
  /*
  const recentActivity = [
    {
      action: 'New Patient Added',
      detail: 'Meera Singh linked to your profile',
      time: '2 hours ago',
      icon: 'bi-person-plus-fill'
    },
    {
      action: 'Consultation Completed',
      detail: 'Follow-up with Aarav Sharma',
      time: '5 hours ago',
      icon: 'bi-check-circle-fill'
    },
    {
      action: 'Lab Results Received',
      detail: 'Lipid panel for Priya Patel',
      time: '1 day ago',
      icon: 'bi-file-earmark-medical-fill'
    }
  ];
  */

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!api) return;
    setSubmittingConsultation(true);
    try {
      await api.post('/doctor/consultation-by-email', consultationForm);
      alert('Consultation added successfully!');
      setShowConsultationModal(false);
      setConsultationForm({
        email: '',
        type: 'Consultation',
        date: new Date().toISOString().split('T')[0],
        diagnosis: '',
        prescription: '',
        notes: ''
      });
      fetchConsultations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding consultation');
    } finally {
      setSubmittingConsultation(false);
    }
  };

  const handlePatientSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('patient-details');
  };

  const filteredPatients = linkedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.Id.includes(searchTerm)
  );

  return (
    <div className="modern-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <i className="bi bi-heart-pulse-fill"></i>
          <h2>MediVerse</h2>
        </div>

        <div className="sidebar-profile" onClick={() => setShowDoctorCard(true)} style={{ cursor: 'pointer' }}>
          <div className="profile-avatar">
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="profile-details">
            <h3>{doctorInfo.name}</h3>
            <p>CARD</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <i className="bi bi-people-fill"></i>
            <span>Patients</span>
            <span className="badge">{linkedPatients.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <i className="bi bi-clipboard-pulse"></i>
            <span>Consultations</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <i className="bi bi-search"></i>
            <span>Patient Search</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-circle"></i>
            <span>Profile</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear-fill"></i>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <div className="page-header">
            <h1 className="page-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'patients' && 'My Patients'}
              {activeTab === 'consultations' && 'Consultations'}
              {activeTab === 'search' && 'Patient Search'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'patient-details' && 'Patient Details'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="topbar-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="topbar-actions" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={startSimulatedScan} title="Scan Patient QR">
              <i className="bi bi-qr-code-scan"></i>
            </button>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <i className="bi bi-bell-fill"></i>
              <span className="badge">3</span>
            </button>
            <button className="icon-btn" onClick={() => setShowChat(!showChat)}>
              <i className="bi bi-chat-dots-fill"></i>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute', top: '100%', right: '50px', width: '300px',
                backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 1000, marginTop: '10px', overflow: 'hidden'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', background: '#f8fafc' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1B4D1A' }}>Notifications</h4>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f1f1', background: '#e8f4e9' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>New Appointment Request</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>Aarav Sharma requested an appointment for 8/5/2026</p>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f1f1' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Lab Results Available</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>Blood test results for Priya Patel are ready to review</p>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f1f1' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Message from Dr. Gupta</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>Referred a new cardiac patient to your clinic</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="dashboard-main-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="stats-grid-modern">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card-modern">
                    <div className="stat-header-modern">
                      <div className="stat-icon-modern" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        <i className={stat.icon}></i>
                      </div>
                      <i className="bi bi-heart-fill stat-heart"></i>
                    </div>
                    <div className="stat-body-modern">
                      <h3 className="stat-value-modern">{stat.value}</h3>
                      <p className="stat-label-modern">{stat.label}</p>
                      <span className="stat-change">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Grid */}
              <div className="dashboard-grid-new">
                {/* Latest Patients Data Table */}
                <div className="dashboard-card-full">
                  <div className="card-header">
                    <h3><i className="bi bi-table"></i> Latest Patients Data</h3>
                    <button className="text-btn" onClick={() => setActiveTab('patients')}>
                      View All <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                  <div className="modern-table-wrapper">
                    <table className="patients-data-table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Date</th>
                          <th>Patient Name</th>
                          <th>Age</th>
                          <th>Country</th>
                          <th>Gender</th>
                          <th>Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linkedPatients.slice(0, 5).map((patient, index) => (
                          <tr key={patient.id}>
                            <td>{index + 1}</td>
                            <td>{patient.lastVisit}</td>
                            <td>
                              <div className="patient-name-cell">
                                <div className="patient-avatar-small">
                                  <i className="bi bi-person-fill"></i>
                                </div>
                                <span>{patient.name}</span>
                              </div>
                            </td>
                            <td>{patient.age}</td>
                            <td>{patient.country}</td>
                            <td>
                              <span className={`gender-badge ${patient.gender.toLowerCase()}`}>
                                {patient.gender}
                              </span>
                            </td>
                            <td>
                              <button className="report-btn" onClick={() => alert(`Viewing report for ${patient.name}`)}>
                                <i className="bi bi-file-earmark-text"></i>
                                <i className="bi bi-download"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-people-fill"></i> Linked Patients</h3>
                <div className="search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search by name or ..."
                    value={searchTerm}
                    onChange={handlePatientSearch}
                  />
                </div>
              </div>
              <div className="patients-grid">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="patient-card-grid">
                    <div className="patient-card-header">
                      <div className="patient-avatar">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <div className="patient-info">
                        <h4>{patient.name}</h4>
                        <p className="patient-meta">{patient.gender}, {patient.age} yrs • {patient.bloodGroup}</p>
                      </div>
                    </div>
                    <div className="patient-card-body">

                      <div className="info-row">
                        <span className="info-label">Last Visit:</span>
                        <span className="info-value">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Condition:</span>
                        <span className="tag-blue">{patient.condition}</span>
                      </div>
                    </div>
                    <button className="view-patient-btn" onClick={() => handleSelectPatient(patient)}>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultations Tab */}
          {activeTab === 'consultations' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-clipboard-pulse"></i> All Consultations</h3>
                <button className="primary-btn" onClick={() => setShowConsultationModal(true)}>
                  <i className="bi bi-plus-circle-fill"></i>
                  New Consultation
                </button>
              </div>
              <div className="records-table">
                {recentConsultations.length === 0 ? (
                   <p style={{textAlign: 'center', padding: '20px', color: '#666'}}>No consultations logged yet.</p>
                ) : (
                  recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="record-row">
                      <div className="record-icon">
                        <i className="bi bi-clipboard-pulse"></i>
                      </div>
                      <div className="record-info">
                        <p className="record-title">{consultation.patientName}</p>
                        <p className="record-meta">{consultation.type} • {new Date(consultation.date).toLocaleDateString()}</p>
                        <p className="record-prescription">
                          <strong>Diagnosis:</strong> {consultation.diagnosis}<br />
                          <strong>Prescription:</strong> {consultation.prescription}
                        </p>
                      </div>
                      <div className="record-actions">
                        <button className="record-action-btn" onClick={() => alert('View consultation details')}>
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button className="record-action-btn" onClick={() => alert('Download report')}>
                          <i className="bi bi-download"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Patient Search Tab */}
          {activeTab === 'search' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-search"></i> Patient Search</h3>
              </div>
              <div className="search-section" style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                <div className="search-box-large">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Enter patient name, ..."
                    className="search-input-large"
                    value={apiSearchTerm}
                    onChange={(e) => setApiSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApiSearch()}
                  />
                  <button className="search-btn" onClick={handleApiSearch} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
              
              <div className="search-results">
                {patientSearchResults.length > 0 ? (
                  <div className="patients-grid">
                    {patientSearchResults.map((patient) => (
                      <div key={patient.id} className="patient-card-grid">
                        <div className="patient-card-header">
                          <div className="patient-avatar">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div className="patient-info">
                            <h4>{patient.name}</h4>
                            <p className="patient-meta">{patient.gender}, {patient.age} yrs • {patient.bloodGroup}</p>
                          </div>
                        </div>
                        <div className="patient-card-body">

                          <div className="info-row" style={{ marginTop: '15px', alignItems: 'center' }}>
                            <span className="info-label">Access Duration:</span>
                            <select 
                              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                              value={selectedDuration[patient.id] || 3}
                              onChange={(e) => setSelectedDuration({...selectedDuration, [patient.id]: parseInt(e.target.value)})}
                            >
                              <option value={3}>3 Days</option>
                              <option value={5}>5 Days</option>
                              <option value={15}>15 Days</option>
                            </select>
                          </div>
                        </div>
                        <button 
                          className="view-patient-btn" 
                          style={{ backgroundColor: '#2A6F28', color: 'white', marginTop: '10px' }}
                          onClick={() => handleAddPatient(patient.id)}
                          disabled={addingPatientId === patient.id}
                        >
                          {addingPatientId === patient.id ? 'Adding...' : 'Add Patient'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="coming-soon">
                    <i className="bi bi-search" style={{ fontSize: '80px', color: '#CDEDB3' }}></i>
                    <h3>Patient Search</h3>
                    <p>Search for patients by  or name to add them to your list.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div className="profile-header-info">
                  <h2>{doctorInfo.name}</h2>
                  <p className="profile-subtitle">{doctorInfo.specialization}</p>
                  <div className="profile-badges">
                    <span className="badge-success"><i className="bi bi-patch-check-fill"></i> Verified</span>
                    <span className="badge-info"><i className="bi bi-hospital-fill"></i> {doctorInfo.hospital}</span>
                  </div>
                </div>
                <button className="edit-profile-btn" onClick={() => setShowEditProfileModal(true)}>
                  <i className="bi bi-pencil-fill"></i>
                  Edit Profile
                </button>
              </div>

              <div className="profile-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3><i className="bi bi-person-vcard"></i> Professional Information</h3>
                  </div>
                  <div className="info-grid">

                    <div className="info-item">
                      <span className="info-label">Specialization</span>
                      <span className="info-value">{doctorInfo.specialization}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Hospital</span>
                      <span className="info-value">{doctorInfo.hospital}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Experience</span>
                      <span className="info-value">{doctorInfo.experience}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{doctorInfo.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{doctorInfo.email}</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3><i className="bi bi-graph-up-arrow"></i> Statistics</h3>
                  </div>
                  <div className="stats-list">
                    <div className="stat-item">
                      <i className="bi bi-people-fill"></i>
                      <div>
                        <p className="stat-value">{doctorInfo.patients}</p>
                        <p className="stat-label">Total Patients</p>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-clipboard-check-fill"></i>
                      <div>
                        <p className="stat-value">1,234</p>
                        <p className="stat-label">Consultations</p>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-star-fill"></i>
                      <div>
                        <p className="stat-value">4.8</p>
                        <p className="stat-label">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patient Details Tab */}
          {activeTab === 'patient-details' && selectedPatient && (
            <div className="dashboard-card">
              <div className="card-header">
                <button className="back-btn" onClick={() => setActiveTab('patients')}>
                  <i className="bi bi-arrow-left"></i>
                  Back to Patients
                </button>
              </div>
              <div className="patient-details-view">
                <div className="patient-details-header">
                  <div className="patient-avatar-large">
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div>
                    <h2>{selectedPatient.name}</h2>
                    <p className="patient-meta">{selectedPatient.gender}, {selectedPatient.age} years • Blood Group: {selectedPatient.bloodGroup}</p>

                  </div>
                </div>
                <div className="coming-soon" style={{ marginTop: '40px' }}>
                  <i className="bi bi-file-medical" style={{ fontSize: '80px', color: '#CDEDB3' }}></i>
                  <h3>Patient Medical Records</h3>
                  <p>View complete medical history, prescriptions, lab reports, and vitals for {selectedPatient.name}.</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="dashboard-main-content">
              <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                
                {/* Clinic Profile */}
                <div className="dashboard-card" style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div className="card-header" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#1B4D1A', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="bi bi-hospital"></i> Clinic Profile</h3>
                  </div>
                  <div className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: 600 }}>Hospital/Clinic Name</label>
                      <input type="text" defaultValue={doctorInfo.hospital} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: 600 }}>Specialization</label>
                      <input type="text" defaultValue={doctorInfo.specialization} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: 600 }}>Contact Email</label>
                      <input type="email" defaultValue={doctorInfo.email} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
                    </div>
                    <button className="btn-primary" onClick={() => alert('Profile Updated!')} style={{ marginTop: '8px', padding: '12px', background: '#1B4D1A', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                  </div>
                </div>

                {/* Schedule & Availability */}
                <div className="dashboard-card" style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div className="card-header" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#1B4D1A', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="bi bi-calendar-week"></i> Schedule & Availability</h3>
                  </div>
                  <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Accepting New Patients</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Allow new patients to request consults</p>
                      </div>
                      <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input type="checkbox" checked={acceptingPatients} onChange={() => setAcceptingPatients(!acceptingPatients)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: acceptingPatients ? '#1B4D1A' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                          <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: acceptingPatients ? 'translateX(20px)' : 'translateX(0)' }}></span>
                        </span>
                      </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Auto-Approve Appointments</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Automatically accept requests within hours</p>
                      </div>
                      <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input type="checkbox" checked={autoScheduling} onChange={() => setAutoScheduling(!autoScheduling)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: autoScheduling ? '#1B4D1A' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                          <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: autoScheduling ? 'translateX(20px)' : 'translateX(0)' }}></span>
                        </span>
                      </label>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Working Hours</h4>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input type="time" defaultValue="09:00" style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                        <span>to</span>
                        <input type="time" defaultValue="17:00" style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications & Security */}
                <div className="dashboard-card" style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  
                  {/* Notifications */}
                  <div>
                    <h3 style={{ margin: '0 0 20px', color: '#1B4D1A', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}><i className="bi bi-bell"></i> Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Email Alerts</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Get notified of new lab reports</p>
                        </div>
                        <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                          <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} style={{ opacity: 0, width: 0, height: 0 }} />
                          <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: emailNotifs ? '#1B4D1A' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                            <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: emailNotifs ? 'translateX(20px)' : 'translateX(0)' }}></span>
                          </span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>SMS Alerts</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Get notified for emergency consults</p>
                        </div>
                        <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                          <input type="checkbox" checked={smsNotifs} onChange={() => setSmsNotifs(!smsNotifs)} style={{ opacity: 0, width: 0, height: 0 }} />
                          <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: smsNotifs ? '#1B4D1A' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                            <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: smsNotifs ? 'translateX(20px)' : 'translateX(0)' }}></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h3 style={{ margin: '0 0 20px', color: '#1B4D1A', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}><i className="bi bi-shield-lock"></i> Security</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Two-Factor Authentication</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Mandatory for accessing health records</p>
                        </div>
                        <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                          <input type="checkbox" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} style={{ opacity: 0, width: 0, height: 0 }} />
                          <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: twoFactorEnabled ? '#1B4D1A' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                            <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: twoFactorEnabled ? 'translateX(20px)' : 'translateX(0)' }}></span>
                          </span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Manage API Access</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Integrate with hospital EHR systems</p>
                        </div>
                        <button onClick={() => alert("API Keys manager opened.")} style={{ padding: '6px 14px', border: '1px solid #1B4D1A', color: '#1B4D1A', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Manage</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showConsultationModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
            width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1B4D1A' }}>New Consultation</h3>
              <button onClick={() => setShowConsultationModal(false)} style={{
                background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666'
              }}>&times;</button>
            </div>
            
            <form onSubmit={handleConsultationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Patient Email ID *</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. patient@example.com"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={consultationForm.email}
                  onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Type</label>
                  <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    value={consultationForm.type}
                    onChange={(e) => setConsultationForm({...consultationForm, type: e.target.value})}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Date</label>
                  <input 
                    type="date" 
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    value={consultationForm.date}
                    onChange={(e) => setConsultationForm({...consultationForm, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Diagnosis *</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g. Mild hypertension"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={consultationForm.diagnosis}
                  onChange={(e) => setConsultationForm({...consultationForm, diagnosis: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Prescription</label>
                <textarea 
                  rows="3"
                  placeholder="Medications and dosages..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={consultationForm.prescription}
                  onChange={(e) => setConsultationForm({...consultationForm, prescription: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Additional Notes</label>
                <textarea 
                  rows="3"
                  placeholder="Dietary advice, next steps..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={consultationForm.notes}
                  onChange={(e) => setConsultationForm({...consultationForm, notes: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowConsultationModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingConsultation}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#2A6F28', color: 'white', cursor: submittingConsultation ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {submittingConsultation ? 'Saving...' : 'Save Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditProfileModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
            width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1B4D1A' }}>Edit Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} style={{
                background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666'
              }}>&times;</button>
            </div>
            
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
                <input 
                  type="text" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Specialization</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={profileForm.specialization}
                  onChange={(e) => setProfileForm({...profileForm, specialization: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Hospital</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={profileForm.hospital}
                  onChange={(e) => setProfileForm({...profileForm, hospital: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Experience</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={profileForm.experience}
                  onChange={(e) => setProfileForm({...profileForm, experience: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>HPR ID ()</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={profileForm.hprId}
                  onChange={(e) => setProfileForm({...profileForm, hprId: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditProfileModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingProfile}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#2A6F28', color: 'white', cursor: submittingProfile ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {submittingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDoctorCard && (
        <div className="modal-overlay" onClick={() => setShowDoctorCard(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          backdropFilter: 'blur(6px)'
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '400px', borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            fontFamily: "'Inter', sans-serif"
          }}>
            {/* Card Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1B4D1A 0%, #2A6F28 50%, #3A8F38 100%)',
              padding: '32px 28px 24px', color: 'white', position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative circles */}
              <div style={{
                position: 'absolute', top: '-30px', right: '-30px',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)'
              }}></div>
              <div style={{
                position: 'absolute', bottom: '-20px', left: '-20px',
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)'
              }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bi bi-heart-pulse-fill" style={{ fontSize: '20px' }}></i>
                  <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>MediArchive</span>
                </div>
                <button onClick={() => setShowDoctorCard(false)} style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                  width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', backdropFilter: 'blur(4px)'
                }}>&times;</button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                  border: '3px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)'
                }}>
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>{doctorInfo.name}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.85, fontWeight: 500 }}>{doctorInfo.specialization}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.2)', padding: '2px 10px',
                      borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}>
                      <i className="bi bi-patch-check-fill" style={{ marginRight: '4px' }}></i>VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div style={{
              background: '#ffffff', padding: '24px 28px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

                <div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</p>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600, color: '#1B4D1A' }}>{doctorInfo.experience}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Hospital</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 500, color: '#333' }}>{doctorInfo.hospital}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 500, color: '#333' }}>{doctorInfo.phone}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '20px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</p>
                <p style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 500, color: '#333' }}>{doctorInfo.email}</p>
              </div>

              {/* QR Code */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: '#f8faf8', borderRadius: '16px', padding: '20px', marginTop: '4px',
                border: '1px solid #e8f0e8'
              }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <i className="bi bi-qr-code" style={{ marginRight: '6px' }}></i>Scan to View Doctor Info
                </p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(JSON.stringify({
                    type: 'mediarchive_doctor',
                    name: doctorInfo.name,
                    specialization: doctorInfo.specialization,
                    hospital: doctorInfo.hospital,
                    hprId: doctorInfo.Id,
                    phone: doctorInfo.phone,
                    email: doctorInfo.email,
                    experience: doctorInfo.experience
                  }))}`}
                  alt="Doctor QR Code"
                  style={{ width: '160px', height: '160px', borderRadius: '8px' }}
                />
                <p style={{ margin: '12px 0 0', fontSize: '11px', color: '#888', textAlign: 'center' }}>
                  Patients can scan this QR code to verify your credentials
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div style={{
              background: '#f0f5f0', padding: '14px 28px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
              borderTop: '1px solid #e0e8e0'
            }}>
              <i className="bi bi-shield-fill-check" style={{ color: '#2A6F28', fontSize: '13px' }}></i>
              <span style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>Verified Healthcare Professional · MediArchive Network</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Interface */}
      {showChat && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '350px',
          height: '500px', backgroundColor: '#fff', borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'flex',
          flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
          border: '1px solid #e0e0e0', fontFamily: "'Inter', sans-serif"
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1B4D1A 0%, #2E7D32 100%)',
            padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Aarav Sharma</h4>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Online <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', marginLeft: '4px' }}></span></p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
              &times;
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: msg.sender === 'doctor' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  backgroundColor: msg.sender === 'doctor' ? '#1B4D1A' : '#fff',
                  color: msg.sender === 'doctor' ? '#fff' : '#333',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '14px', lineHeight: 1.4,
                  borderBottomRightRadius: msg.sender === 'doctor' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.sender === 'patient' ? '2px' : '12px',
                  border: msg.sender === 'patient' ? '1px solid #e2e8f0' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} style={{ padding: '14px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              placeholder="Type a reply..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
            <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#1B4D1A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      )}

      {/* QR Scanner Modal Overlay */}
      {showQrScanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', padding: '30px', borderRadius: '16px', width: '400px',
            textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#1B4D1A' }}>Scan Patient QR</h3>
            
            <div style={{
              width: '100%', minHeight: '250px', margin: '0 auto 20px',
              position: 'relative', overflow: 'hidden', backgroundColor: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isScanning ? (
                <QRScanner onScanSuccess={handleQRScanSuccess} />
              ) : (
                <div style={{ color: '#2ecc71', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <i className="bi bi-check-circle-fill" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Scan Successful!</p>
                </div>
              )}
            </div>

            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              {isScanning ? "Please grant camera access to scan patient QR code..." : "Redirecting to patient profile..."}
            </p>
            
            <button 
              onClick={() => { setShowQrScanner(false); setIsScanning(false); }}
              style={{
                padding: '10px 24px', background: '#f1f5f9', border: 'none',
                borderRadius: '8px', color: '#475569', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
