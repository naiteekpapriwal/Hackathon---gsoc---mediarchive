const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const patientController = require('../controllers/patientController');

// All patient routes require authentication + patient role
router.use(auth, roleAuth('patient'));

// Profile
router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);

// Stats
router.get('/stats', patientController.getStats);

// Dashboard
router.get('/dashboard', patientController.getDashboardData);

// Medical History & Records
router.get('/medical-history', patientController.getMedicalHistory);
router.get('/appointments', patientController.getAppointments);
router.get('/medications', patientController.getMedications);
router.get('/vitals', patientController.getVitals);

// Upload Record (multipart)
router.post('/upload-record', upload.array('files', 10), patientController.uploadRecord);

// Download Record
router.get('/records/:recordId/download', patientController.downloadRecord);

// Share Token
router.post('/generate-share-token', patientController.generateShareToken);

// Access Management
router.get('/active-access', patientController.getActiveAccess);
router.post('/revoke-access/:accessId', patientController.revokeAccess);

// Approvals
router.get('/pending-approvals', patientController.getPendingApprovals);
router.post('/approve-entry/:entryId', patientController.approveEntry);

module.exports = router;
