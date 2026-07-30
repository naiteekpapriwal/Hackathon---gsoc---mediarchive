const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const doctorController = require('../controllers/doctorController');

// All doctor routes require authentication + doctor role
router.use(auth, roleAuth('doctor'));

// Stats
router.get('/stats', doctorController.getStats);

// Patient Search
router.get('/search-patient', doctorController.searchPatient);

// Access Verification
router.post('/verify-access', doctorController.verifyPatientAccess);

// Patient Details
router.get('/patient/:patientId', doctorController.getPatientDetails);

// Linked Patients
router.get('/linked-patients', doctorController.getLinkedPatients);

// Medical Entries
router.post('/patient/:patientId/add-entry', upload.array('attachments', 10), doctorController.addMedicalEntry);
router.put('/entry/:entryId', doctorController.updateMedicalEntry);

// Access Requests
router.post('/request-access/:patientId', doctorController.requestPatientAccess);

// Patient Vitals
router.get('/patient/:patientId/vitals', doctorController.getPatientVitals);

// Patient Medications
router.get('/patient/:patientId/medications', doctorController.getPatientMedications);

// Prescriptions
router.post('/patient/:patientId/prescription', doctorController.addPrescription);

// Add Consultation By Email
router.post('/consultation-by-email', doctorController.addConsultationByEmail);

// Get Consultations
router.get('/consultations', doctorController.getConsultations);

// Update Profile
router.put('/profile', doctorController.updateProfile);

module.exports = router;
