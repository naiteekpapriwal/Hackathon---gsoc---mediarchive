import api from './api';

export const doctorService = {
  // Get doctor statistics
  getDoctorStats: async () => {
    try {
      const response = await api.get('/doctor/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search patient by ABHA ID or name
  searchPatient: async (searchTerm) => {
    try {
      const response = await api.get(`/doctor/search-patient?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify patient access with QR token and OTP
  verifyPatientAccess: async (token, otp) => {
    try {
      const response = await api.post('/doctor/verify-access', { token, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient details and medical history
  getPatientDetails: async (patientId) => {
    try {
      const response = await api.get(`/doctor/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get list of linked patients
  getLinkedPatients: async () => {
    try {
      const response = await api.get('/doctor/linked-patients');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new medical entry for patient
  addMedicalEntry: async (patientId, data, files = null) => {
    try {
      let formData = data;
      
      // If files are included, create FormData
      if (files && files.length > 0) {
        formData = new FormData();
        
        // Append data fields
        Object.keys(data).forEach(key => {
          if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        });
        
        // Append files
        files.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await api.post(
        `/doctor/patient/${patientId}/add-entry`, 
        formData,
        files ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing medical entry
  updateMedicalEntry: async (entryId, data) => {
    try {
      const response = await api.put(`/doctor/entry/${entryId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Request access to patient records
  requestPatientAccess: async (patientId, reason = '') => {
    try {
      const response = await api.post(`/doctor/request-access/${patientId}`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient vital trends
  getPatientVitals: async (patientId, period = '6M') => {
    try {
      const response = await api.get(`/doctor/patient/${patientId}/vitals`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient medications
  getPatientMedications: async (patientId) => {
    try {
      const response = await api.get(`/doctor/patient/${patientId}/medications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add prescription
  addPrescription: async (patientId, prescriptionData) => {
    try {
      const response = await api.post(`/doctor/patient/${patientId}/prescription`, prescriptionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default doctorService;
