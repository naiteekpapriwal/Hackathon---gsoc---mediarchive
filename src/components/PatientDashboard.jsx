import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showPatientCard, setShowPatientCard] = useState(false);

  // Load user data from backend (stored at login)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = storedUser.profile || {};

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('authToken')) {
      navigate('/login/patient');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const [patientInfo, setPatientInfo] = useState({
    name: storedUser.name || 'Naiteek Papriwal',
    healthId: profile.healthId || 'HLTH001',
    Id: profile.Id || '12-3456-7890-1234',
    aadhaar: profile.aadhaar || '1234-5678-9012',
    age: profile.age || 20,
    ageDisplay: (profile.age || 20) + ' years',
    gender: profile.gender || 'Male',
    bloodGroup: profile.bloodGroup || 'O+',
    height: profile.height || '175 cm',
    weight: profile.weight || '65 kg',
    email: storedUser.email || 'naiteek.papriwal@gmail.com',
    phone: profile.phone || '+91 8818944036',
    address: profile.address || '123 Tech Park, Whitefield',
    city: profile.city || 'Bangalore',
    state: profile.state || 'Karnataka',
    emergencyContact: profile.emergencyContact || '9876543210',
    bloodType: profile.bloodGroup || 'O+'
  });

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = () => {
    window.alert('Your profile information has been successfully updated!');
  };

  // eslint-disable-next-line no-unused-vars
  const [api, setApi] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [dashboardData, setDashboardData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [medicalRecords, setMedicalRecords] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [appointments, setAppointments] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [medications, setMedications] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [vitals, setVitals] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  
  const [allergies, setAllergies] = useState(['Penicillin', 'Peanuts']);
  const [chronicConditions, setChronicConditions] = useState(['Type 2 Diabetes', 'Hypertension']);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'doctor', text: 'Hello! How are you feeling today?', time: '09:00 AM' },
    { id: 2, sender: 'patient', text: 'Much better, doctor. The new medication is helping.', time: '09:30 AM' },
    { id: 3, sender: 'doctor', text: 'Great to hear! Make sure to stay hydrated.', time: '09:35 AM' }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // Modal State for custom dialogs
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: {} });

  const openModal = (type) => {
    setModalState({ isOpen: true, type, data: {} });
  };
  
  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: {} });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalState(prev => ({ ...prev, data: { ...prev.data, [name]: value } }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const { type, data } = modalState;
    
    if (type === 'allergy' && data.name) {
      setAllergies([...allergies, data.name.trim()]);
    } else if (type === 'condition' && data.name) {
      setChronicConditions([...chronicConditions, data.name.trim()]);
    } else if (type === 'appointment' && data.doctorName && data.date) {
      const newAppt = {
        id: Date.now().toString(),
        date_time: `${data.date}T10:00:00Z`,
        location: "MediVerse Virtual Clinic",
        doctors: {
          users: { name: data.doctorName },
          specialization: "General Physician",
          hospital: "MediVerse Hospital"
        }
      };
      setAppointments([...appointments, newAppt]);
    } else if (type === 'medication' && data.medName) {
      const newMed = {
        id: Date.now().toString(),
        name: data.medName,
        dosage: data.dosage || "1 tablet",
        frequency: "Daily",
        time: "09:00 AM",
        taken: false
      };
      setMedications([...medications, newMed]);
    }
    
    closeModal();
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'patient',
      text: newChatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewChatMessage('');
    
    // Simulate doctor reply after 1.5 seconds
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'doctor',
        text: 'I have noted that down in your file. Let me know if you need anything else.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // The prompt functions are now handled by the custom modal submit handler

  useEffect(() => {
    import('../services/api').then(module => {
      setApi(() => module.default);
      
      const fetchData = async () => {
        try {
          const apiInstance = module.default;
          const [dashRes, recordsRes, apptsRes, medsRes, vitalsRes] = await Promise.all([
            apiInstance.get('/patient/dashboard'),
            apiInstance.get('/patient/medical-history'),
            apiInstance.get('/patient/appointments'),
            apiInstance.get('/patient/medications'),
            apiInstance.get('/patient/vitals')
          ]);
          setDashboardData(dashRes.data);
          setMedicalRecords(recordsRes.data.records || []);
          setAppointments(apptsRes.data || []);
          setMedications(medsRes.data || []);
          setVitals(vitalsRes.data || []);
        } catch (err) {
          console.error("Failed to fetch dashboard data", err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    });
  }, []);

  const healthVitals = [
    {
      id: 1,
      name: 'Next Appointment',
      value: dashboardData?.nextAppointment ? new Date(dashboardData.nextAppointment.date_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None',
      subtitle: dashboardData?.nextAppointment ? `Dr. ${dashboardData.nextAppointment.doctors?.users?.name || 'Unknown'}` : '',
      detail: dashboardData?.nextAppointment ? `${new Date(dashboardData.nextAppointment.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · ${dashboardData.nextAppointment.doctors?.specialization || ''}` : '',
      status: 'upcoming',
      icon: 'bi-calendar-check-fill',
      color: '#2A6F28',
      actionLabel: 'Reschedule'
    },
    {
      id: 2,
      name: 'Medications Due',
      value: dashboardData?.medicationsDue || '0',
      subtitle: 'Today',
      detail: dashboardData?.activeMedications ? dashboardData.activeMedications.slice(0,3).map(m=>m.name).join(', ') : '',
      status: 'pending',
      icon: 'bi-capsule-pill',
      color: '#2A6F28',
      actionLabel: 'View All'
    },
    {
      id: 3,
      name: 'Blood Pressure',
      value: dashboardData?.latestVitals?.bloodPressure ? dashboardData.latestVitals.bloodPressure.value : '--/--',
      subtitle: 'Last Reading',
      detail: dashboardData?.latestVitals?.bloodPressure ? `${new Date(dashboardData.latestVitals.bloodPressure.measured_at).toLocaleDateString()} · ${dashboardData.latestVitals.bloodPressure.status}` : 'No readings yet',
      status: 'normal',
      icon: 'bi-activity',
      color: '#2A6F28',
      actionLabel: 'Track'
    },
    {
      id: 4,
      name: 'Blood Sugar',
      value: dashboardData?.latestVitals?.bloodSugar ? dashboardData.latestVitals.bloodSugar.value : '--',
      subtitle: dashboardData?.latestVitals?.bloodSugar ? dashboardData.latestVitals.bloodSugar.unit : 'mg/dL',
      detail: dashboardData?.latestVitals?.bloodSugar ? `${new Date(dashboardData.latestVitals.bloodSugar.measured_at).toLocaleDateString()} · ${dashboardData.latestVitals.bloodSugar.status}` : 'No readings yet',
      status: 'normal',
      icon: 'bi-droplet-fill',
      color: '#2A6F28',
      actionLabel: 'Track'
    },
    {
      id: 5,
      name: 'Heart Rate',
      value: dashboardData?.latestVitals?.heartRate ? dashboardData.latestVitals.heartRate.value : '--',
      subtitle: 'bpm',
      detail: dashboardData?.latestVitals?.heartRate ? `${new Date(dashboardData.latestVitals.heartRate.measured_at).toLocaleDateString()} · ${dashboardData.latestVitals.heartRate.status}` : 'No readings yet',
      status: 'normal',
      icon: 'bi-heart-pulse-fill',
      color: '#2A6F28',
      actionLabel: 'Track'
    },
    {
      id: 6,
      name: 'Care Team',
      value: dashboardData?.careTeamCount || '0',
      subtitle: 'Specialists',
      detail: 'Linked Doctors',
      status: 'active',
      icon: 'bi-people-fill',
      color: '#2A6F28',
      actionLabel: 'View Team'
    }
  ];


  // Filter records based on search term
  const filteredRecords = medicalRecords.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (new Date(record.date).toLocaleDateString()).toLowerCase().includes(searchLower) ||
      (record.doctor_name || record.doctors?.users?.name || '').toLowerCase().includes(searchLower) ||
      (record.doctors?.specialization || '').toLowerCase().includes(searchLower) ||
      (record.diagnosis || '').toLowerCase().includes(searchLower) ||
      (record.prescription || '').toLowerCase().includes(searchLower)
    );
  });

  const handleActionClick = (action, record) => {
    if (action === 'N/A') return;
    alert(`${action} - ${record.doctor_name || record.doctors?.users?.name || 'Unknown'} (${record.date})\nDiagnosis: ${record.diagnosis}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="modern-patient-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <i className="bi bi-heart-pulse-fill"></i>
          <h2>MediVerse</h2>
        </div>

        <div className="sidebar-profile" onClick={() => setShowPatientCard(true)} style={{ cursor: 'pointer' }}>
          <div className="profile-avatar">
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="profile-details">
            <h3>{patientInfo.name}</h3>
            <p>Patient ID: {patientInfo.healthId}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <i className="bi bi-heart-pulse"></i>
            <span>Health Vitals</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <i className="bi bi-file-medical-fill"></i>
            <span>Medical Records</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="bi bi-calendar-check"></i>
            <span>Appointments</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            <i className="bi bi-prescription2"></i>
            <span>Medications</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="bi bi-bell"></i>
            <span>Notifications</span>
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
        {/* Topbar */}
        <div className="dashboard-topbar">
          <div>
            <p className="greeting">Good Morning,</p>
            <h1>{patientInfo.name}</h1>
            <p className="topbar-subtitle">How are you feeling today?</p>
          </div>
          <div className="topbar-actions" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <i className="bi bi-bell-fill"></i>
              <span className="badge">2</span>
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
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#184F76' }}>Notifications</h4>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f1f1', background: '#eaf4fc' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Upcoming Appointment</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>Reminder: Consultation with Dr. Smith tomorrow at 10:00 AM</p>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f1f1' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Lab Results Available</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>Your recent blood test results are ready to review</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-main-content">
            {/* Health Alerts - Priority Section */}
            <div className="health-alerts-priority">
              <div className="alert-header">
                <h2><i className="bi bi-exclamation-triangle-fill"></i> Health Alerts</h2>
                <span className="alert-badge">Critical Information</span>
              </div>
              <div className="alerts-grid-priority">
                <div className="alert-card-priority allergies-card">
                  <div className="alert-icon-box">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div className="alert-content">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Allergies
                      <button onClick={() => openModal('allergy')} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: 0, fontSize: '16px' }} title="Add Allergy">
                        <i className="bi bi-plus-circle-fill"></i>
                      </button>
                    </h3>
                    <div className="alert-tags">
                      {allergies.map((allergy, index) => (
                        <span key={index} className="alert-tag allergy-tag">
                          <i className="bi bi-x-circle-fill"></i> {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="alert-card-priority conditions-card">
                  <div className="alert-icon-box">
                    <i className="bi bi-heart-pulse-fill"></i>
                  </div>
                  <div className="alert-content">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Chronic Conditions
                      <button onClick={() => openModal('condition')} style={{ background: 'none', border: 'none', color: '#f39c12', cursor: 'pointer', padding: 0, fontSize: '16px' }} title="Add Condition">
                        <i className="bi bi-plus-circle-fill"></i>
                      </button>
                    </h3>
                    <div className="alert-tags">
                      {chronicConditions.map((condition, index) => (
                        <span key={index} className="alert-tag condition-tag">
                          <i className="bi bi-activity"></i> {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Stats */}
            <div className="personal-stats">
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-calendar3"></i></div>
                <p className="stat-label">Age</p>
                <h3 className="stat-value">{patientInfo.age} years</h3>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-arrows-expand"></i></div>
                <p className="stat-label">Height</p>
                <h3 className="stat-value">{patientInfo.height}</h3>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-speedometer2"></i></div>
                <p className="stat-label">Weight</p>
                <h3 className="stat-value">{patientInfo.weight}</h3>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-droplet-fill"></i></div>
                <p className="stat-label">Blood Type</p>
                <h3 className="stat-value">{patientInfo.bloodGroup}</h3>
              </div>
            </div>

            {/* Recent Tests */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-clipboard-pulse"></i> Recent Tests</h3>
                <button className="text-btn">
                  View All <i className="bi bi-arrow-right"></i>
                </button>
              </div>
              <div className="tests-list">
                {medicalRecords.slice(0, 4).map((test) => (
                  <div key={test.id} className="test-item">
                    <div className="test-icon-box">
                      <i className={test.icon}></i>
                    </div>
                    <div className="test-details">
                      <h4 className="test-title">{test.type || 'Medical Record'}</h4>
                      <p className="test-meta">
                        {new Date(test.date).toLocaleDateString()} • {test.hospital_name || test.doctors?.hospital || 'Clinic'}
                      </p>
                    </div>
                    <div className="test-result">
                      <span className="result-badge">{test.status || 'completed'}</span>
                    </div>
                    <div className="test-actions">
                      <button className="icon-btn-small" title="View Report">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="icon-btn-small" title="Download">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medication Management */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-capsule"></i> Medication Management</h3>
                <button className="text-btn">
                  View All <i className="bi bi-arrow-right"></i>
                </button>
              </div>
              <div className="medications-list">
                {medications.map((med) => (
                  <div key={med.id} className="medication-item">
                    <div className={`med-checkbox ${med.taken ? 'checked' : ''}`}>
                      {med.taken && <i className="bi bi-check-lg"></i>}
                    </div>
                    <div className="med-info">
                      <h4>{med.name}</h4>
                      <p>{med.dosage || ''} • {med.frequency || ''}</p>
                    </div>
                    <span className="med-time">{med.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Vitals Tab */}
        {activeTab === 'health' && (
          <div className="dashboard-main-content">
            <div className="health-metrics-grid">
              {healthVitals.map((vital) => (
                <div key={vital.id} className="metric-card">
                  <div className="metric-icon-box">
                    <i className={vital.icon}></i>
                  </div>
                  <div className="metric-content">
                    <p className="metric-label">{vital.name}</p>
                    <h2 className="metric-value">{vital.value}</h2>
                    <p className="metric-subtitle">{vital.subtitle}</p>
                    <p className="metric-detail">{vital.detail}</p>
                  </div>
                  <button className="metric-action-btn">
                    {vital.actionLabel} <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Health Alerts */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-exclamation-triangle"></i> Health Alerts</h3>
              </div>
              <div className="alerts-grid">
                <div className="alert-box allergies">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    Allergies
                    <button onClick={() => openModal('allergy')} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: 0, fontSize: '14px' }}>
                      <i className="bi bi-plus-circle-fill"></i>
                    </button>
                  </h4>
                  <div className="tags">
                    {allergies.map((allergy, index) => (
                      <span key={index} className="tag allergy-tag">{allergy}</span>
                    ))}
                  </div>
                </div>
                <div className="alert-box conditions">
                  <h4>Chronic Conditions</h4>
                  <div className="tags">
                    {chronicConditions.map((condition, index) => (
                      <span key={index} className="tag condition-tag">{condition}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div className="dashboard-main-content">
            <div className="records-header-section">
              <div className="records-title">
                <h2><i className="bi bi-file-medical-fill"></i> Medical Records</h2>
                <p className="records-subtitle">Complete history of your medical consultations and treatments</p>
              </div>
              <div className="records-actions">
                <input
                  type="text"
                  className="search-input-modern"
                  placeholder="Search by doctor, diagnosis, date..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn-primary" onClick={() => navigate('/patient/upload-record')}>
                  <i className="bi bi-plus-circle"></i> Add Record
                </button>
              </div>
            </div>

            <div className="records-grid-modern">
              {filteredRecords.map((record) => (
                <div key={record.id} className="record-card-modern">
                  <div className="record-card-header">
                    <div className="record-date-badge">
                      <i className="bi bi-calendar-event"></i>
                      <span>{record.date}</span>
                    </div>
                    <div className="record-status-badge active">Active</div>
                  </div>

                  <div className="record-doctor-section">
                    <div className="doctor-avatar">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div className="doctor-details">
                      <h3>{record.doctor}</h3>
                      <p className="specialization-badge">
                        <i className="bi bi-stethoscope"></i> {record.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="record-details-section">
                    <div className="record-detail-item">
                      <span className="detail-label">
                        <i className="bi bi-clipboard2-pulse"></i> Diagnosis
                      </span>
                      <p className="detail-value">{record.diagnosis}</p>
                    </div>
                    <div className="record-detail-item">
                      <span className="detail-label">
                        <i className="bi bi-capsule"></i> Prescription
                      </span>
                      <p className="detail-value">{record.prescription}</p>
                    </div>
                  </div>

                  <div className="record-card-footer">
                    {record.action === 'N/A' ? (
                      <button className="record-action-btn disabled" disabled>
                        <i className="bi bi-file-earmark-x"></i> No Documents
                      </button>
                    ) : (
                      <button
                        className="record-action-btn"
                        onClick={() => handleActionClick(record.action, record)}
                      >
                        <i className="bi bi-file-earmark-text"></i> {record.action}
                      </button>
                    )}
                    <button className="record-action-btn secondary">
                      <i className="bi bi-share"></i> Share
                    </button>
                    <button className="record-action-btn secondary">
                      <i className="bi bi-download"></i> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="dashboard-main-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-calendar-check"></i> My Appointments</h3>
                <button className="btn-primary" onClick={() => openModal('appointment')}>Schedule New</button>
              </div>
              <div className="appointments-grid">
                {appointments.length === 0 ? (
                  <p style={{padding: '20px', color: '#666'}}>No upcoming appointments found.</p>
                ) : appointments.map((appt) => {
                  const d = new Date(appt.date_time);
                  return (
                  <div key={appt.id} className={`appointment-card ${appt.status}`}>
                    <div className="appointment-date">
                      <span className="date-day">{d.getDate()}</span>
                      <span className="date-month">{d.toLocaleString('en-US', { month: 'short' })}</span>
                    </div>
                    <div className="appointment-details">
                      <h4>Dr. {appt.doctors?.users?.name || 'Unknown'}</h4>
                      <p className="specialization">{appt.doctors?.specialization || 'General'}</p>
                      <p className="appointment-time"><i className="bi bi-clock"></i> {d.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="appointment-location"><i className="bi bi-geo-alt"></i> {appt.location || appt.doctors?.hospital || 'Clinic'}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn-outline">Reschedule</button>
                      <button className="btn-danger">Cancel</button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="dashboard-main-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-capsule"></i> My Medications</h3>
                <button className="btn-primary" onClick={() => openModal('medication')}>Add Medication</button>
              </div>
              <div className="medications-list-full">
                {medications.map((med) => (
                  <div key={med.id} className="medication-card-full">
                    <div className={`med-checkbox-large ${med.taken ? 'checked' : ''}`}>
                      {med.taken && <i className="bi bi-check-lg"></i>}
                    </div>
                    <div className="med-info-full">
                      <h4>{med.name}</h4>
                      <p className="dosage">{med.dosage}</p>
                      <p className="frequency"><i className="bi bi-clock"></i> {med.frequency}</p>
                      <p className="time"><i className="bi bi-alarm"></i> {med.time}</p>
                    </div>
                    <div className="med-actions">
                      <button className="icon-btn"><i className="bi bi-pencil"></i></button>
                      <button className="icon-btn"><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="dashboard-main-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-bell"></i> Notifications</h3>

              </div>
              <div className="notifications-list">
                <div className="notification-item unread">
                  <div className="notification-icon"><i className="bi bi-calendar-check"></i></div>
                  <div className="notification-content">
                    <h4>Appointment Reminder</h4>
                    <p>Your appointment with Dr. Anjali Sharma is scheduled for tomorrow at 10:00 AM</p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-icon"><i className="bi bi-capsule"></i></div>
                  <div className="notification-content">
                    <h4>Medication Reminder</h4>
                    <p>Time to take Atorvastatin 20mg</p>
                    <span className="notification-time">5 hours ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon"><i className="bi bi-file-medical"></i></div>
                  <div className="notification-content">
                    <h4>Lab Results Available</h4>
                    <p>Your blood test results from 10 Mar 2024 are now available</p>
                    <span className="notification-time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard-main-content">
            <div className="settings-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="bi bi-person"></i> Personal Information</h3>
                </div>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={patientInfo.name} onChange={handlePatientInfoChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={patientInfo.email} onChange={handlePatientInfoChange} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={patientInfo.phone} onChange={handlePatientInfoChange} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={patientInfo.city} onChange={handlePatientInfoChange} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={patientInfo.state} onChange={handlePatientInfoChange} />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleUpdateInfo}>Update Information</button>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="bi bi-shield-lock"></i> Privacy & Security</h3>
                </div>
                <div className="settings-list">
                  <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px' }}>Two-Factor Authentication (2FA)</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Add an extra layer of security</p>
                    </div>
                    <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: twoFactorEnabled ? '#184F76' : '#ccc', transition: '.4s', borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                          transform: twoFactorEnabled ? 'translateX(20px)' : 'translateX(0)'
                        }}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div className="setting-item" style={{ marginTop: '16px' }}>
                    <h4 style={{ margin: '0 0 10px' }}>Data Access Management</h4>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>Dr. Sarah Smith (Apollo Hospital)</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Last accessed: Today, 10:00 AM</p>
                      </div>
                      <button onClick={() => alert("Access revoked for Dr. Sarah Smith.")} style={{ padding: '6px 12px', border: '1px solid #e74c3c', color: '#e74c3c', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Revoke Access</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
                <div className="card-header">
                  <h3><i className="bi bi-bell"></i> Notification Preferences</h3>
                </div>
                <div className="settings-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px' }}>Email Notifications</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Receive lab results and reports</p>
                    </div>
                    <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: emailNotifs ? '#184F76' : '#ccc', transition: '.4s', borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                          transform: emailNotifs ? 'translateX(20px)' : 'translateX(0)'
                        }}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px' }}>SMS Reminders</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Get appointment reminders</p>
                    </div>
                    <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" checked={smsNotifs} onChange={() => setSmsNotifs(!smsNotifs)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: smsNotifs ? '#184F76' : '#ccc', transition: '.4s', borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                          transform: smsNotifs ? 'translateX(20px)' : 'translateX(0)'
                        }}></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="bi bi-file-earmark-arrow-down"></i> Data Export</h3>
                </div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>Download a complete PDF copy of all your medical history, prescriptions, and lab reports.</p>
                  <button onClick={() => alert("Generating Medical History PDF... Download will start shortly.")} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <i className="bi bi-download"></i> Download Medical Records
                  </button>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="bi bi-telephone-plus"></i> Emergency Contacts (ICE)</h3>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ background: '#fff', border: '1px solid #eee', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>Rahul Sharma (Brother)</p>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>+91 98765 12345</p>
                  </div>
                  <button onClick={() => alert("Add emergency contact modal opened")} className="btn-outline" style={{ width: '100%' }}>+ Add New Contact</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {showPatientCard && (
        <div className="modal-overlay" onClick={() => setShowPatientCard(false)} style={{
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
              background: 'linear-gradient(135deg, #184F76 0%, #2980B9 50%, #3498DB 100%)',
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
                  <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>MediVerse</span>
                </div>
                <button onClick={() => setShowPatientCard(false)} style={{
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
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>{patientInfo.name}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.85, fontWeight: 500 }}>Patient ID: {patientInfo.healthId}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.2)', padding: '2px 10px',
                      borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}>
                      <i className="bi bi-patch-check-fill" style={{ marginRight: '4px' }}></i>VERIFIED PATIENT
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
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Blood Group</p>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600, color: '#e74c3c' }}>
                    <i className="bi bi-droplet-fill" style={{ marginRight: '4px' }}></i>
                    {patientInfo.bloodGroup}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Age / Gender</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 500, color: '#333' }}>{patientInfo.ageDisplay} / {patientInfo.gender}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 500, color: '#333' }}>{patientInfo.phone}</p>
                </div>
              </div>

              {/* QR Code */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: '#f8fafb', borderRadius: '16px', padding: '20px', marginTop: '4px',
                border: '1px solid #e8f0f5'
              }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <i className="bi bi-qr-code" style={{ marginRight: '6px' }}></i>Scan to Access Records
                </p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(JSON.stringify({
                    type: 'mediarchive_patient',
                    name: patientInfo.name,
                    healthId: patientInfo.healthId,
                    Id: patientInfo.Id,
                    bloodGroup: patientInfo.bloodGroup,
                    gender: patientInfo.gender,
                    age: patientInfo.age,
                    phone: patientInfo.phone
                  }))}`}
                  alt="Patient QR Code"
                  style={{ width: '160px', height: '160px', borderRadius: '8px' }}
                />
                <p style={{ margin: '12px 0 0', fontSize: '11px', color: '#888', textAlign: 'center' }}>
                  Doctors can scan this QR code to securely access your medical history
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div style={{
              background: '#f0f5f9', padding: '14px 28px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
              borderTop: '1px solid #e0e8ed'
            }}>
              <i className="bi bi-shield-fill-check" style={{ color: '#2980B9', fontSize: '13px' }}></i>
              <span style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>Secure Health ID · MediVerse Network</span>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Data Entry Modal */}
      {modalState.isOpen && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 3000,
          backdropFilter: 'blur(4px)'
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'white', width: '400px', borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1B4D1A' }}>
                {modalState.type === 'allergy' && 'Add New Allergy'}
                {modalState.type === 'condition' && 'Add Chronic Condition'}
                {modalState.type === 'appointment' && 'Schedule Appointment'}
                {modalState.type === 'medication' && 'Add Medication'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            
            <form onSubmit={handleModalSubmit} style={{ padding: '24px' }}>
              {(modalState.type === 'allergy' || modalState.type === 'condition') && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#444' }}>
                    {modalState.type === 'allergy' ? 'Allergy Name' : 'Condition Name'}
                  </label>
                  <input 
                    autoFocus
                    type="text" 
                    name="name" 
                    required
                    value={modalState.data.name || ''} 
                    onChange={handleModalChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                    placeholder={modalState.type === 'allergy' ? 'e.g. Penicillin' : 'e.g. Asthma'}
                  />
                </div>
              )}

              {modalState.type === 'appointment' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#444' }}>Doctor's Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      name="doctorName" 
                      required
                      value={modalState.data.doctorName || ''} 
                      onChange={handleModalChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                      placeholder="e.g. Dr. Smith"
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#444' }}>Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      required
                      value={modalState.data.date || ''} 
                      onChange={handleModalChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                    />
                  </div>
                </>
              )}

              {modalState.type === 'medication' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#444' }}>Medication Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      name="medName" 
                      required
                      value={modalState.data.medName || ''} 
                      onChange={handleModalChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                      placeholder="e.g. Paracetamol"
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#444' }}>Dosage</label>
                    <input 
                      type="text" 
                      name="dosage" 
                      value={modalState.data.dosage || ''} 
                      onChange={handleModalChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                      placeholder="e.g. 500mg or 1 tablet"
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 500 }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#184F76', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                  Save
                </button>
              </div>
            </form>
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
            background: 'linear-gradient(135deg, #184F76 0%, #2980B9 100%)',
            padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Dr. Sarah Smith</h4>
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
                alignItems: msg.sender === 'patient' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  backgroundColor: msg.sender === 'patient' ? '#184F76' : '#fff',
                  color: msg.sender === 'patient' ? '#fff' : '#333',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '14px', lineHeight: 1.4,
                  borderBottomRightRadius: msg.sender === 'patient' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.sender === 'doctor' ? '2px' : '12px',
                  border: msg.sender === 'doctor' ? '1px solid #e2e8f0' : 'none'
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
              placeholder="Type a message..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
            <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#184F76', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
