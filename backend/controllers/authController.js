const supabase = require('../config/supabase');
const crypto = require('crypto');
const { hashPassword, comparePassword, generateAuthToken, generateRefreshToken } = require('../utils/authUtils');

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required.' });
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('role', role)
            .single();

        if (userError || !user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = generateAuthToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

        // Get profile data based on role
        let profile = null;
        if (role === 'patient') {
            const { data } = await supabase.from('patients').select('*').eq('user_id', user.id).single();
            profile = data;
        } else if (role === 'doctor') {
            const { data } = await supabase.from('doctors').select('*').eq('user_id', user.id).single();
            profile = data;
        }

        res.json({
            token,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profile
            }
        });
    } catch (error) {
        next(error);
    }
};

// Register Patient
exports.registerPatient = async (req, res, next) => {
    try {
        const { name, email, password, phone, Id, aadhaar, age, gender, bloodGroup, height, weight, city, state } = req.body;

        // Check if user exists
        const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const hashedPassword = await hashPassword(password);

        // Create user
        const { data: user, error: userError } = await supabase.from('users').insert({
            name,
            email,
            password_hash: hashedPassword,
            role: 'patient',
            phone
        }).select().single();

        if (userError) throw userError;

        // Generate health ID
        const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true });
        const healthId = 'HLTH' + String((count || 0) + 1).padStart(3, '0');

        // Create patient profile
        const { data: patient, error: patientError } = await supabase.from('patients').insert({
            user_id: user.id,
            _id: Id,
            health_id: healthId,
            aadhaar,
            age,
            gender,
            blood_group: bloodGroup,
            height,
            weight,
            city,
            state
        }).select().single();

        if (patientError) throw patientError;

        const token = generateAuthToken(user.id, user.role);

        res.status(201).json({
            message: 'Patient registered successfully.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: patient
            }
        });
    } catch (error) {
        next(error);
    }
};

// Register Doctor
exports.registerDoctor = async (req, res, next) => {
    try {
        const { name, email, password, phone, hprId, specialization, hospital, experience, qualifications } = req.body;

        const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const hashedPassword = await hashPassword(password);

        const { data: user, error: userError } = await supabase.from('users').insert({
            name,
            email,
            password_hash: hashedPassword,
            role: 'doctor',
            phone
        }).select().single();

        if (userError) throw userError;

        const { data: doctor, error: doctorError } = await supabase.from('doctors').insert({
            user_id: user.id,
            hpr_id: hprId,
            specialization,
            hospital,
            experience,
            qualifications
        }).select().single();

        if (doctorError) throw doctorError;

        const token = generateAuthToken(user.id, user.role);

        res.status(201).json({
            message: 'Doctor registered successfully.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: doctor
            }
        });
    } catch (error) {
        next(error);
    }
};

// Refresh Token
exports.refreshToken = async (req, res, next) => {
    try {
        const token = generateAuthToken(req.user.id, req.user.role);
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

// Change Password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }

        const { data: user } = await supabase.from('users').select('*').eq('id', req.userId).single();
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await comparePassword(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        const hashedPassword = await hashPassword(newPassword);
        await supabase.from('users').update({ password_hash: hashedPassword }).eq('id', user.id);

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        next(error);
    }
};

// Forgot Password (mock - just generates token)
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const { data: user } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (!user) {
            return res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

        await supabase.from('users').update({
            reset_password_token: hashedToken,
            reset_password_expires: expires
        }).eq('id', user.id);

        res.json({
            message: 'If an account exists with this email, a reset link has been sent.',
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    } catch (error) {
        next(error);
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const { data: user } = await supabase.from('users')
            .select('*')
            .eq('reset_password_token', hashedToken)
            .gte('reset_password_expires', new Date().toISOString())
            .maybeSingle();

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        const hashedPassword = await hashPassword(newPassword);
        
        await supabase.from('users').update({
            password_hash: hashedPassword,
            reset_password_token: null,
            reset_password_expires: null
        }).eq('id', user.id);

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        next(error);
    }
};

// Send Aadhaar OTP (mock)
exports.sendAadhaarOTP = async (req, res, next) => {
    try {
        const { aadhaarNumber } = req.body;
        if (!aadhaarNumber) return res.status(400).json({ message: 'Aadhaar number is required.' });

        res.json({
            message: 'OTP sent to registered mobile number.',
            ...(process.env.NODE_ENV === 'development' && { otp: '123456' })
        });
    } catch (error) {
        next(error);
    }
};

// Verify Aadhaar (mock)
exports.verifyAadhaar = async (req, res, next) => {
    try {
        const { aadhaarNumber, otp } = req.body;
        if (!aadhaarNumber || !otp) return res.status(400).json({ message: 'Aadhaar number and OTP are required.' });

        if (otp.length === 6) {
            res.json({
                verified: true,
                message: 'Aadhaar verified successfully.',
                Id: `${aadhaarNumber.substring(0, 2)}-${Date.now().toString().substring(5)}-${Math.floor(1000 + Math.random() * 9000)}`
            });
        } else {
            res.status(400).json({ verified: false, message: 'Invalid OTP.' });
        }
    } catch (error) {
        next(error);
    }
};
