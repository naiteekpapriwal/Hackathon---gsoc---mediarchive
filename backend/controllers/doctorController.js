const supabase = require('../config/supabase');

// Helper to get doctor id from user id
const getDoctorId = async (userId) => {
    const { data } = await supabase.from('doctors').select('*').eq('user_id', userId).single();
    return data;
};

// Get doctor stats
exports.getStats = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { count: linkedPatientsCount } = await supabase.from('doctor_linked_patients').select('*', { count: 'exact', head: true }).eq('doctor_id', doctor.id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { count: todaysAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctor.id)
            .gte('date_time', today.toISOString())
            .lt('date_time', tomorrow.toISOString())
            .eq('status', 'upcoming');

        const { count: pendingReviews } = await supabase.from('medical_records').select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctor.id)
            .eq('status', 'pending');

        res.json({
            totalPatients: linkedPatientsCount || 0,
            todaysAppointments: todaysAppointments || 0,
            pendingReviews: pendingReviews || 0,
            experience: doctor.experience
        });
    } catch (error) {
        next(error);
    }
};

// Search patient
exports.searchPatient = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Search query is required.' });

        // Since ilike with OR is complex in JS SDK, we do two queries or an advanced RPC, but for simplicity:
        // We can do: or('abha_id.ilike.%q%, health_id.ilike.%q%') on patients
        const { data: patientsByAbha } = await supabase.from('patients').select(`
            *,
            users ( name, email, phone )
        `).or(`abha_id.ilike.%${q}%,health_id.ilike.%${q}%`);

        // Search by user name
        const { data: usersByName } = await supabase.from('users').select('id, name, email, phone').ilike('name', `%${q}%`).eq('role', 'patient');
        const userIds = usersByName?.map(u => u.id) || [];
        
        let patientsByName = [];
        if (userIds.length > 0) {
            const { data } = await supabase.from('patients').select(`*, users ( name, email, phone )`).in('user_id', userIds);
            patientsByName = data || [];
        }

        const allPatientsMap = new Map();
        [...(patientsByAbha || []), ...patientsByName].forEach(p => {
            allPatientsMap.set(p.id, p);
        });

        const formattedPatients = Array.from(allPatientsMap.values()).map(p => ({
            id: p.id,
            name: p.users?.name || 'Unknown',
            abhaId: p.abha_id,
            age: p.age,
            gender: p.gender,
            bloodGroup: p.blood_group,
            city: p.city
        }));

        res.json(formattedPatients);
    } catch (error) {
        next(error);
    }
};

// Verify patient access
exports.verifyPatientAccess = async (req, res, next) => {
    try {
        const { token, otp } = req.body;
        if (!token || !otp) return res.status(400).json({ message: 'Token and OTP are required.' });

        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: shareToken } = await supabase.from('share_tokens')
            .select('*')
            .eq('token', token)
            .eq('otp', otp)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (!shareToken) return res.status(400).json({ message: 'Invalid or expired token/OTP.' });

        await supabase.from('share_tokens').update({ used: true, used_by: doctor.id }).eq('id', shareToken.id);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + shareToken.duration);

        const { data: accessGrant } = await supabase.from('access_grants').insert({
            patient_id: shareToken.patient_id,
            doctor_id: doctor.id,
            expires_at: expiresAt.toISOString()
        }).select().single();

        // Link patient
        const { data: link } = await supabase.from('doctor_linked_patients').select('*').eq('doctor_id', doctor.id).eq('patient_id', shareToken.patient_id).maybeSingle();
        if (!link) {
            await supabase.from('doctor_linked_patients').insert({ doctor_id: doctor.id, patient_id: shareToken.patient_id });
        }

        res.json({
            message: 'Access granted successfully.',
            accessGrant: { id: accessGrant.id, expiresAt: accessGrant.expires_at }
        });
    } catch (error) {
        next(error);
    }
};

// Get patient details
exports.getPatientDetails = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: patient } = await supabase.from('patients').select(`*, users ( name, email, phone )`).eq('id', req.params.patientId).single();
        if (!patient) return res.status(404).json({ message: 'Patient not found.' });

        const { data: hasAccess } = await supabase.from('access_grants')
            .select('*')
            .eq('patient_id', patient.id)
            .eq('doctor_id', doctor.id)
            .eq('status', 'active')
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

        const { data: isLinked } = await supabase.from('doctor_linked_patients').select('*').eq('doctor_id', doctor.id).eq('patient_id', patient.id).maybeSingle();

        if (!hasAccess && !isLinked) {
            return res.status(403).json({ message: 'You do not have access to this patient\'s records.' });
        }

        const { data: records } = await supabase.from('medical_records').select('*').eq('patient_id', patient.id).order('date', { ascending: false }).limit(20);
        const { data: medications } = await supabase.from('medications').select('*').eq('patient_id', patient.id).eq('active', true);
        const { data: vitals } = await supabase.from('vitals').select('*').eq('patient_id', patient.id).order('measured_at', { ascending: false }).limit(10);

        res.json({
            patient: { ...patient, name: patient.users?.name, email: patient.users?.email, phone: patient.users?.phone },
            records,
            medications,
            vitals
        });
    } catch (error) {
        next(error);
    }
};

// Get linked patients
exports.getLinkedPatients = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: links } = await supabase.from('doctor_linked_patients').select(`
            patient_id,
            patients ( *, users ( name, email, phone ) )
        `).eq('doctor_id', doctor.id);

        const patients = links?.map(l => {
            const p = l.patients;
            return {
                id: p.id,
                name: p.users?.name || 'Unknown',
                abhaId: p.abha_id,
                age: p.age,
                gender: p.gender,
                bloodGroup: p.blood_group,
                lastVisit: p.updated_at,
                condition: p.chronic_conditions?.[0] || 'General',
                status: 'Active',
                country: 'India'
            };
        }) || [];

        res.json(patients);
    } catch (error) {
        next(error);
    }
};

// Add medical entry
exports.addMedicalEntry = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: doctorUser } = await supabase.from('users').select('*').eq('id', req.userId).single();

        const { type, date, diagnosis, prescription, notes } = req.body;
        const files = req.files ? req.files.map(f => ({
            filename: f.filename, originalName: f.originalname, path: f.path, mimetype: f.mimetype, size: f.size
        })) : [];

        const { data: record, error } = await supabase.from('medical_records').insert({
            patient_id: req.params.patientId,
            doctor_id: doctor.id,
            doctor_name: doctorUser.name,
            doctor_specialization: doctor.specialization,
            type: type || 'consultation',
            date: date || new Date().toISOString(),
            diagnosis,
            prescription,
            notes,
            files: JSON.stringify(files),
            added_by: 'doctor',
            status: 'pending'
        }).select().single();

        if (error) throw error;

        res.status(201).json({ message: 'Medical entry added. Awaiting patient approval.', record });
    } catch (error) {
        next(error);
    }
};

// Update medical entry
exports.updateMedicalEntry = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: record, error } = await supabase.from('medical_records').update(req.body)
            .eq('id', req.params.entryId)
            .eq('doctor_id', doctor.id)
            .select().single();

        if (error || !record) return res.status(404).json({ message: 'Medical entry not found.' });

        res.json({ message: 'Entry updated successfully.', record });
    } catch (error) {
        next(error);
    }
};

// Request patient access
exports.requestPatientAccess = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: patient } = await supabase.from('patients').select('*').eq('id', req.params.patientId).single();
        if (!patient) return res.status(404).json({ message: 'Patient not found.' });

        const { reason, duration } = req.body;

        const { data: existingAccess } = await supabase.from('access_grants').select('*')
            .eq('patient_id', patient.id)
            .eq('doctor_id', doctor.id)
            .eq('status', 'active')
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

        if (existingAccess) return res.json({ message: 'You already have active access to this patient.' });

        const accessDuration = parseInt(duration) || 7;
        const validDurations = [3, 5, 7, 15];
        if (!validDurations.includes(accessDuration)) return res.status(400).json({ message: 'Invalid duration. Must be 3, 5, or 15 days.' });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + accessDuration);

        const { data: accessGrant } = await supabase.from('access_grants').insert({
            patient_id: patient.id,
            doctor_id: doctor.id,
            reason,
            expires_at: expiresAt.toISOString()
        }).select().single();

        const { data: link } = await supabase.from('doctor_linked_patients').select('*').eq('doctor_id', doctor.id).eq('patient_id', patient.id).maybeSingle();
        if (!link) {
            await supabase.from('doctor_linked_patients').insert({ doctor_id: doctor.id, patient_id: patient.id });
        }

        res.status(201).json({ message: 'Access requested and granted.', accessGrant });
    } catch (error) {
        next(error);
    }
};

// Get patient vitals
exports.getPatientVitals = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { period = '6M' } = req.query;
        const now = new Date();
        let startDate = new Date();
        switch (period) {
            case '1M': startDate.setMonth(now.getMonth() - 1); break;
            case '3M': startDate.setMonth(now.getMonth() - 3); break;
            case '6M': startDate.setMonth(now.getMonth() - 6); break;
            case '1Y': startDate.setFullYear(now.getFullYear() - 1); break;
            default: startDate.setMonth(now.getMonth() - 6);
        }

        const { data: vitals } = await supabase.from('vitals')
            .select('*')
            .eq('patient_id', req.params.patientId)
            .gte('measured_at', startDate.toISOString())
            .order('measured_at', { ascending: true });

        res.json(vitals);
    } catch (error) {
        next(error);
    }
};

// Get patient medications
exports.getPatientMedications = async (req, res, next) => {
    try {
        const { data: medications } = await supabase.from('medications').select('*')
            .eq('patient_id', req.params.patientId)
            .eq('active', true);
        res.json(medications);
    } catch (error) {
        next(error);
    }
};

// Add prescription
exports.addPrescription = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: doctorUser } = await supabase.from('users').select('*').eq('id', req.userId).single();
        const { medications } = req.body;

        if (!medications || !Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ message: 'Medications array is required.' });
        }

        const medInserts = medications.map(med => ({
            patient_id: req.params.patientId,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            time: med.time,
            prescribed_by: doctor.id,
            prescribed_by_name: doctorUser.name,
            active: true
        }));

        const { data: createdMeds } = await supabase.from('medications').insert(medInserts).select();

        res.status(201).json({ message: 'Prescription added successfully.', medications: createdMeds });
    } catch (error) {
        next(error);
    }
};

// Add consultation by patient email
exports.addConsultationByEmail = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: doctorUser } = await supabase.from('users').select('*').eq('id', req.userId).single();
        const { email, date, diagnosis, prescription, notes } = req.body;
        let { type } = req.body;

        if (!email) return res.status(400).json({ message: 'Patient email is required.' });

        // Normalize type
        const allowedTypes = ['consultation', 'prescription', 'lab', 'imaging', 'surgery', 'vaccination', 'other'];
        type = type ? type.toLowerCase() : 'consultation';
        if (!allowedTypes.includes(type)) {
            type = 'consultation';
        }

        // Lookup user by email
        const { data: patientUser } = await supabase.from('users')
            .select('id')
            .eq('email', email)
            .eq('role', 'patient')
            .maybeSingle();

        if (!patientUser) {
            return res.status(404).json({ message: 'Invalid patient email id or patient not registered.' });
        }

        // Lookup patient profile
        const { data: patientProfile } = await supabase.from('patients')
            .select('id')
            .eq('user_id', patientUser.id)
            .single();

        if (!patientProfile) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const { data: record, error } = await supabase.from('medical_records').insert({
            patient_id: patientProfile.id,
            doctor_id: doctor.id,
            doctor_name: doctorUser.name,
            doctor_specialization: doctor.specialization,
            type: type || 'consultation',
            date: date || new Date().toISOString(),
            diagnosis,
            prescription,
            notes,
            files: JSON.stringify([]), // No files for inline email consultation by default
            added_by: 'doctor',
            status: 'pending' // As per existing addMedicalEntry logic
        }).select().single();

        if (error) throw error;

        // Ensure patient is linked to doctor
        const { data: link } = await supabase.from('doctor_linked_patients').select('*').eq('doctor_id', doctor.id).eq('patient_id', patientProfile.id).maybeSingle();
        if (!link) {
            await supabase.from('doctor_linked_patients').insert({ doctor_id: doctor.id, patient_id: patientProfile.id });
        }

        res.status(201).json({ message: 'Consultation added successfully.', record });
    } catch (error) {
        next(error);
    }
};

// Get doctor's consultations
exports.getConsultations = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { data: records, error } = await supabase.from('medical_records')
            .select(`
                *,
                patients (
                    users ( name )
                )
            `)
            .eq('doctor_id', doctor.id)
            .order('date', { ascending: false });

        if (error) throw error;

        // Format for frontend
        const formattedRecords = records.map(record => ({
            id: record.id,
            patientName: record.patients?.users?.name || 'Unknown Patient',
            date: record.date, // ISO string
            type: record.type,
            diagnosis: record.diagnosis,
            prescription: record.prescription
        }));

        res.json(formattedRecords);
    } catch (error) {
        next(error);
    }
};

// Update doctor profile
exports.updateProfile = async (req, res, next) => {
    try {
        const doctor = await getDoctorId(req.userId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found.' });

        const { name, phone, specialization, hospital, experience, hprId } = req.body;

        // Update Users Table
        const userUpdates = {};
        if (name !== undefined) userUpdates.name = name;
        if (phone !== undefined) userUpdates.phone = phone;

        if (Object.keys(userUpdates).length > 0) {
            await supabase.from('users').update(userUpdates).eq('id', req.userId);
        }

        // Update Doctors Table
        const docUpdates = {};
        if (specialization !== undefined) docUpdates.specialization = specialization;
        if (hospital !== undefined) docUpdates.hospital = hospital;
        if (experience !== undefined) docUpdates.experience = experience;
        if (hprId !== undefined) docUpdates.hpr_id = hprId;

        let updatedDoctor = doctor;
        if (Object.keys(docUpdates).length > 0) {
            const { data, error } = await supabase.from('doctors').update(docUpdates).eq('id', doctor.id).select().single();
            if (error) throw error;
            updatedDoctor = data;
        }

        res.json({ message: 'Profile updated successfully.', doctor: updatedDoctor });
    } catch (error) {
        next(error);
    }
};
