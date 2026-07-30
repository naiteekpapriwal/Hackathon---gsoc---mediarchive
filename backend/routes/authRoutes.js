const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Public routes
router.post('/login', authController.login);
router.post('/register/patient', authController.registerPatient);
router.post('/register/doctor', authController.registerDoctor);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/send-aadhaar-otp', authController.sendAadhaarOTP);
router.post('/verify-aadhaar', authController.verifyAadhaar);

// Protected routes
router.post('/refresh-token', auth, authController.refreshToken);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;
