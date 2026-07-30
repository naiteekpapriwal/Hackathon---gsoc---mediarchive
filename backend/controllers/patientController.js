const supabase = require('../config/supabase');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Helper to get patient id from user id
const getPatientId = async (userId) => {
    const { data } = await supabase.from('patients').select('*').eq('user_id', userId).single();
    return data;
};

// Get patient profile
exports.getProfile = async (req, res, next) => {
    try {
        const { data: patient } = await supabase.from('patients').select(`*, users ( name, email, phone )`).eq('user_id', req.userId).single();
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        res.json({
            ...patient,
            name: patient.users?.name,
            email: patient.users?.email,
            phone: patient.users?.phone
        });
    } catch (error) {
        next(error);
    }
};

// Update patient profile
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = ['age', 'gender', 'blood_group', 'height', 'weight', 'city', 'state', 'allergies', 'chronic_conditions', 'emergency_contact'];
        const updates = {};
        
        // Maps camelCase to snake_case for DB if needed, but assuming req.body has snake_case or we map it manually
        // We will just map the allowed ones directly
        if (req.body.age !== undefined) updates.age = req.body.age;
        if (req.body.gender !== undefined) updates.gender = req.body.gender;
        if (req.body.bloodGroup !== undefined) updates.blood_group = req.body.bloodGroup;
        if (req.body.height !== undefined) updates.height = req.body.height;
        if (req.body.weight !== undefined) updates.weight = req.body.weight;
        if (req.body.city !== undefined) updates.city = req.body.city;
        if (req.body.state !== undefined) updates.state = req.body.state;
        if (req.body.allergies !== undefined) updates.allergies = req.body.allergies;
        if (req.body.chronicConditions !== undefined) updates.chronic_conditions = req.body.chronicConditions;
        if (req.body.emergencyContact !== undefined) updates.emergency_contact = req.body.emergencyContact;

        const { data: patient, error } = await supabase.from('patients')
            .update(updates)
            .eq('user_id', req.userId)
            .select(`*, users ( name, email, phone )`).single();

        if (error || !patient) return res.status(404).json({ message: 'Patient profile not found.' });

        res.json({ message: 'Profile updated successfully.', patient });
    } catch (error) {
        next(error);
    }
};

// Get patient stats
exports.getStats = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: nextAppointment } = await supabase.from('appointments').select('*')
            .eq('patient_id', patient.id)
            .eq('status', 'upcoming')
            .gte('date_time', new Date().toISOString())
            .order('date_time', { ascending: true })
            .limit(1).maybeSingle();

        const { data: medications } = await supabase.from('medications').select('*').eq('patient_id', patient.id).eq('active', true);

        const { data: latestBP } = await supabase.from('vitals').select('*').eq('patient_id', patient.id).eq('type', 'blood_pressure').order('measured_at', { ascending: false }).limit(1).maybeSingle();
        const { data: latestSugar } = await supabase.from('vitals').select('*').eq('patient_id', patient.id).eq('type', 'blood_sugar').order('measured_at', { ascending: false }).limit(1).maybeSingle();
        const { data: latestHR } = await supabase.from('vitals').select('*').eq('patient_id', patient.id).eq('type', 'heart_rate').order('measured_at', { ascending: false }).limit(1).maybeSingle();

        // Count unique doctors
        const { data: grants } = await supabase.from('access_grants').select('doctor_id').eq('patient_id', patient.id).eq('status', 'active');
        const uniqueDoctors = new Set(grants?.map(g => g.doctor_id) || []);

        const { count: totalRecords } = await supabase.from('medical_records').select('*', { count: 'exact', head: true }).eq('patient_id', patient.id);

        res.json({
            nextAppointment,
            medicationsDue: medications?.filter(m => !m.taken).length || 0,
            medications: medications || [],
            vitals: { bloodPressure: latestBP, bloodSugar: latestSugar, heartRate: latestHR },
            careTeamCount: uniqueDoctors.size,
            totalRecords: totalRecords || 0
        });
    } catch (error) {
        next(error);
    }
};

// Get medical history
exports.getMedicalHistory = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { page = 1, limit = 10, type } = req.query;
        let query = supabase.from('medical_records').select(`
            *,
            doctors ( specialization, hospital )
        `, { count: 'exact' }).eq('patient_id', patient.id);

        if (type) query = query.eq('type', type);

        const offset = (page - 1) * limit;
        const { data: records, count: total } = await query
            .order('date', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        res.json({
            records: records || [],
            pagination: { page: parseInt(page), limit: parseInt(limit), total: total || 0, pages: Math.ceil((total || 0) / limit) }
        });
    } catch (error) {
        next(error);
    }
};

// Upload medical record
exports.uploadRecord = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { recordType, date, doctorName, hospitalName, diagnosis, notes } = req.body;
        const files = req.files ? req.files.map(f => ({
            filename: f.filename, originalName: f.originalname, path: f.path, mimetype: f.mimetype, size: f.size
        })) : [];

        const { data: record, error } = await supabase.from('medical_records').insert({
            patient_id: patient.id,
            type: recordType || 'other',
            date: date || new Date().toISOString(),
            doctor_name: doctorName,
            hospital_name: hospitalName,
            diagnosis,
            notes,
            files: JSON.stringify(files),
            added_by: 'patient',
            status: 'completed'
        }).select().single();

        if (error) throw error;
        res.status(201).json({ message: 'Record uploaded successfully.', record });
    } catch (error) {
        next(error);
    }
};

// Download record file
exports.downloadRecord = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: record } = await supabase.from('medical_records').select('*').eq('id', req.params.recordId).eq('patient_id', patient.id).single();
        if (!record) return res.status(404).json({ message: 'Record not found.' });

        const files = typeof record.files === 'string' ? JSON.parse(record.files) : record.files;
        if (!files || files.length === 0) return res.status(404).json({ message: 'No files attached to this record.' });

        const file = files[0];
        const filePath = path.resolve(file.path);

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server.' });

        res.download(filePath, file.originalName);
    } catch (error) {
        next(error);
    }
};

// Generate share token
exports.generateShareToken = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { duration = 3 } = req.body;

        const token = 'MED-' + crypto.randomBytes(8).toString('hex').toUpperCase();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(duration));

        const { data: shareToken } = await supabase.from('share_tokens').insert({
            patient_id: patient.id,
            token,
            otp,
            duration: parseInt(duration),
            expires_at: expiresAt.toISOString()
        }).select().single();

        res.status(201).json({ token: shareToken.token, otp: shareToken.otp, expiresAt: shareToken.expires_at, duration: shareToken.duration });
    } catch (error) {
        next(error);
    }
};

// Get active access list
exports.getActiveAccess = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        // Update expired grants
        await supabase.from('access_grants').update({ status: 'expired' })
            .eq('patient_id', patient.id)
            .eq('status', 'active')
            .lt('expires_at', new Date().toISOString());

        const { data: accessGrants } = await supabase.from('access_grants').select(`
            *,
            doctors ( specialization, hospital, users ( name, email, phone ) )
        `).eq('patient_id', patient.id).eq('status', 'active');

        const formattedGrants = (accessGrants || []).map(grant => ({
            id: grant.id,
            doctorName: grant.doctors?.users?.name || 'Unknown Doctor',
            specialization: grant.doctors?.specialization || '',
            hospital: grant.doctors?.hospital || '',
            grantedAt: grant.granted_at,
            expiresAt: grant.expires_at
        }));

        res.json(formattedGrants);
    } catch (error) {
        next(error);
    }
};

// Revoke access
exports.revokeAccess = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: grant, error } = await supabase.from('access_grants').update({ status: 'revoked' })
            .eq('id', req.params.accessId)
            .eq('patient_id', patient.id)
            .eq('status', 'active')
            .select().single();

        if (error || !grant) return res.status(404).json({ message: 'Access grant not found.' });

        res.json({ message: 'Access revoked successfully.' });
    } catch (error) {
        next(error);
    }
};

// Get pending approvals
exports.getPendingApprovals = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: pendingRecords } = await supabase.from('medical_records').select(`
            *,
            doctors ( specialization, hospital )
        `).eq('patient_id', patient.id).eq('status', 'pending').eq('added_by', 'doctor');

        res.json(pendingRecords || []);
    } catch (error) {
        next(error);
    }
};

// Approve medical entry
exports.approveEntry = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: record, error } = await supabase.from('medical_records').update({ status: 'approved' })
            .eq('id', req.params.entryId)
            .eq('patient_id', patient.id)
            .eq('status', 'pending')
            .select().single();

        if (error || !record) return res.status(404).json({ message: 'Pending entry not found.' });

        res.json({ message: 'Entry approved successfully.', record });
    } catch (error) {
        next(error);
    }
};

// --- Dashboard Data Endpoints ---

// Get Dashboard Data (Aggregated)
exports.getDashboardData = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        // Next Appointment
        const { data: appointments } = await supabase.from('appointments')
            .select(`*, doctors ( users ( name ), specialization )`)
            .eq('patient_id', patient.id)
            .in('status', ['upcoming', 'rescheduled'])
            .order('date_time', { ascending: true })
            .limit(1);
        
        // Active Medications Count
        const { data: medications } = await supabase.from('medications')
            .select('*')
            .eq('patient_id', patient.id)
            .eq('active', true);
        
        // Latest Vitals
        const { data: latestBP } = await supabase.from('vitals')
            .select('*').eq('patient_id', patient.id).eq('type', 'blood_pressure')
            .order('measured_at', { ascending: false }).limit(1);
        
        const { data: latestSugar } = await supabase.from('vitals')
            .select('*').eq('patient_id', patient.id).eq('type', 'blood_sugar')
            .order('measured_at', { ascending: false }).limit(1);
        
        const { data: latestHR } = await supabase.from('vitals')
            .select('*').eq('patient_id', patient.id).eq('type', 'heart_rate')
            .order('measured_at', { ascending: false }).limit(1);
        
        // Care Team Count
        const { data: careTeam } = await supabase.from('doctor_linked_patients')
            .select('*')
            .eq('patient_id', patient.id)
            .eq('status', 'active');

        res.json({
            nextAppointment: appointments?.[0] || null,
            medicationsDue: medications?.length || 0,
            activeMedications: medications || [],
            latestVitals: {
                bloodPressure: latestBP?.[0] || null,
                bloodSugar: latestSugar?.[0] || null,
                heartRate: latestHR?.[0] || null
            },
            careTeamCount: careTeam?.length || 0
        });
    } catch (error) {
        next(error);
    }
};

// Get all appointments
exports.getAppointments = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: appointments } = await supabase.from('appointments')
            .select(`*, doctors ( users ( name ), specialization, hospital )`)
            .eq('patient_id', patient.id)
            .order('date_time', { ascending: true });

        res.json(appointments || []);
    } catch (error) {
        next(error);
    }
};

// Get all medications
exports.getMedications = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: medications } = await supabase.from('medications')
            .select('*')
            .eq('patient_id', patient.id)
            .order('start_date', { ascending: false });

        res.json(medications || []);
    } catch (error) {
        next(error);
    }
};

// Get all vitals
exports.getVitals = async (req, res, next) => {
    try {
        const patient = await getPatientId(req.userId);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found.' });

        const { data: vitals } = await supabase.from('vitals')
            .select('*')
            .eq('patient_id', patient.id)
            .order('measured_at', { ascending: false });

        res.json(vitals || []);
    } catch (error) {
        next(error);
    }
};
