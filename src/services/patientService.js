import api from './api';

export const patientService = {
  // Get patient profile
  getPatientProfile: async () => {
    try {
      const response = await api.get('/patient/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update patient profile
  updatePatientProfile: async (data) => {
    try {
      const response = await api.put('/patient/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medical history with pagination and filters
  getMedicalHistory: async (params = {}) => {
    try {
      const { page = 1, limit = 10, type } = params;
      const response = await api.get('/patient/medical-history', {
        params: { page, limit, type }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload medical record with files
  uploadRecord: async (formData) => {
    try {
      const response = await api.post('/patient/upload-record', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download specific medical record
  downloadRecord: async (recordId) => {
    try {
      const response = await api.get(`/patient/records/${recordId}/download`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical-record-${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Generate share token for QR code
  generateShareToken: async (duration) => {
    try {
      const response = await api.post('/patient/generate-share-token', { duration });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active doctor access list
  getActiveAccess: async () => {
    try {
      const response = await api.get('/patient/active-access');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Revoke doctor access
  revokeAccess: async (accessId) => {
    try {
      const response = await api.post(`/patient/revoke-access/${accessId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient statistics
  getPatientStats: async () => {
    try {
      const response = await api.get('/patient/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve medical entry added by doctor
  approveMedicalEntry: async (entryId) => {
    try {
      const response = await api.post(`/patient/approve-entry/${entryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending approvals
  getPendingApprovals: async () => {
    try {
      const response = await api.get('/patient/pending-approvals');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default patientService;
