import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import UploadRecord from './components/UploadRecord';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login/patient" element={<LoginPage userType="patient" />} />
          <Route path="/login/doctor" element={<LoginPage userType="doctor" />} />
          <Route path="/register/patient" element={<RegisterPage userType="patient" />} />
          <Route path="/register/doctor" element={<RegisterPage userType="doctor" />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/patient/upload-record" element={<UploadRecord />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
