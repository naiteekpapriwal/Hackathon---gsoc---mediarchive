const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const MedicalRecord = require('../models/MedicalRecord');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const Vital = require('../models/Vital');
const AccessGrant = require('../models/AccessGrant');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Patient.deleteMany({}),
            Doctor.deleteMany({}),
            MedicalRecord.deleteMany({}),
            Medication.deleteMany({}),
            Appointment.deleteMany({}),
            Vital.deleteMany({}),
            AccessGrant.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing data');

        // ============================================
        // CREATE USERS
        // ============================================

        // Main patient user (Naiteek Papriwal - matches frontend)
        const patientUser = await User.create({
            name: 'Naiteek Papriwal',
            email: 'naiteek.papriwal@gmail.com',
            password: 'patient123',
            role: 'patient',
            phone: '+91 98765 43210'
        });

        // Main doctor user (Dr. Anushka Bhatnagar - matches frontend)
        const doctorUser = await User.create({
            name: 'Dr. Anushka Bhatnagar',
            email: 'anushka.bhatnagar@apollohospitals.com',
            password: 'doctor123',
            role: 'doctor',
            phone: '+91 98765 43210'
        });

        // Additional patient users (for doctor's linked patients)
        const patientUser2 = await User.create({
            name: 'Aarav Sharma',
            email: 'aarav.sharma@email.com',
            password: 'patient123',
            role: 'patient',
            phone: '+91 98765 43211'
        });

        const patientUser3 = await User.create({
            name: 'Priya Patel',
            email: 'priya.patel@email.com',
            password: 'patient123',
            role: 'patient',
            phone: '+91 98765 43212'
        });

        const patientUser4 = await User.create({
            name: 'Meera Singh',
            email: 'meera.singh@email.com',
            password: 'patient123',
            role: 'patient',
            phone: '+91 98765 43213'
        });

        const patientUser5 = await User.create({
            name: 'Arjun Verma',
            email: 'arjun.verma@email.com',
            password: 'patient123',
            role: 'patient',
            phone: '+91 98765 43214'
        });

        // Additional doctor users
        const doctorUser2 = await User.create({
            name: 'Dr. Anjali Sharma',
            email: 'anjali.sharma@apollo.com',
            password: 'doctor123',
            role: 'doctor',
            phone: '+91 98765 43215'
        });

        const doctorUser3 = await User.create({
            name: 'Dr. Vikram Singh',
            email: 'vikram.singh@max.com',
            password: 'doctor123',
            role: 'doctor',
            phone: '+91 98765 43216'
        });

        console.log('👥 Created users');

        // ============================================
        // CREATE PATIENT PROFILES
        // ============================================

        const patient1 = await Patient.create({
            user: patientUser._id,
            abhaId: '12-3456-7890-1234',
            healthId: 'HLTH001',
            aadhaar: '1234-5678-9012',
            age: 20,
            gender: 'Male',
            bloodGroup: 'O+',
            height: '175 cm',
            weight: '65 kg',
            city: 'Bangalore',
            state: 'Karnataka',
            allergies: ['Penicillin', 'Peanuts'],
            chronicConditions: ['Type 2 Diabetes', 'Hypertension']
        });

        const patient2 = await Patient.create({
            user: patientUser2._id,
            abhaId: '12-3456-7890-5678',
            healthId: 'HLTH002',
            age: 45,
            gender: 'Male',
            bloodGroup: 'O+',
            city: 'Mumbai',
            state: 'Maharashtra',
            chronicConditions: ['Hypertension']
        });

        const patient3 = await Patient.create({
            user: patientUser3._id,
            abhaId: '12-3456-7890-9012',
            healthId: 'HLTH003',
            age: 32,
            gender: 'Female',
            bloodGroup: 'A+',
            city: 'Delhi',
            state: 'Delhi',
            chronicConditions: ['Diabetes Type 2']
        });

        const patient4 = await Patient.create({
            user: patientUser4._id,
            abhaId: '12-3456-7890-3456',
            healthId: 'HLTH004',
            age: 28,
            gender: 'Female',
            bloodGroup: 'AB+',
            city: 'Chennai',
            state: 'Tamil Nadu',
            chronicConditions: ['Asthma']
        });

        const patient5 = await Patient.create({
            user: patientUser5._id,
            abhaId: '12-3456-7890-7890',
            healthId: 'HLTH005',
            age: 52,
            gender: 'Male',
            bloodGroup: 'A-',
            city: 'Pune',
            state: 'Maharashtra',
            chronicConditions: ['Arthritis']
        });

        console.log('🏥 Created patient profiles');

        // ============================================
        // CREATE DOCTOR PROFILES
        // ============================================

        const doctor1 = await Doctor.create({
            user: doctorUser._id,
            hprId: '78-9012-3456-7890',
            specialization: 'Cardiologist',
            hospital: 'Apollo Hospitals, Mumbai',
            experience: '15 years',
            linkedPatients: [patient1._id, patient2._id, patient3._id, patient4._id, patient5._id]
        });

        const doctor2 = await Doctor.create({
            user: doctorUser2._id,
            hprId: '78-9012-3456-7891',
            specialization: 'Cardiologist',
            hospital: 'Apollo Hospital, Bangalore',
            experience: '12 years',
            linkedPatients: [patient1._id]
        });

        const doctor3 = await Doctor.create({
            user: doctorUser3._id,
            hprId: '78-9012-3456-7892',
            specialization: 'General Physician',
            hospital: 'Max Healthcare, Delhi',
            experience: '8 years',
            linkedPatients: [patient1._id]
        });

        console.log('👨‍⚕️ Created doctor profiles');

        // ============================================
        // CREATE MEDICAL RECORDS (for Naiteek Papriwal)
        // ============================================

        await MedicalRecord.create([
            {
                patient: patient1._id,
                doctorName: 'Dr. Anjali Sharma',
                doctorSpecialization: 'Cardiologist',
                type: 'consultation',
                date: new Date('2023-07-22'),
                diagnosis: 'Hypertension',
                prescription: 'Amlodipine 5mg',
                status: 'completed',
                addedBy: 'doctor'
            },
            {
                patient: patient1._id,
                doctorName: 'Dr. Vikram Singh',
                doctorSpecialization: 'General Physician',
                type: 'consultation',
                date: new Date('2023-05-15'),
                diagnosis: 'Viral Fever',
                prescription: 'Paracetamol 650mg',
                status: 'completed',
                addedBy: 'doctor'
            },
            {
                patient: patient1._id,
                doctorName: 'Dr. Priya Desai',
                doctorSpecialization: 'Dermatologist',
                type: 'consultation',
                date: new Date('2023-02-02'),
                diagnosis: 'Allergic Dermatitis',
                prescription: 'Topical Steroid Cream',
                status: 'completed',
                addedBy: 'doctor'
            },
            {
                patient: patient1._id,
                doctorName: 'Dr. Rohan Mehta',
                doctorSpecialization: 'Orthopedic',
                type: 'imaging',
                date: new Date('2022-11-10'),
                diagnosis: 'Minor Ankle Sprain',
                prescription: 'Painkillers & Rest',
                status: 'completed',
                addedBy: 'doctor'
            },
            // Recent tests
            {
                patient: patient1._id,
                type: 'lab',
                date: new Date('2026-02-05'),
                diagnosis: 'Complete Blood Count (CBC)',
                lab: 'Apollo Diagnostics',
                result: 'Normal',
                status: 'completed',
                addedBy: 'patient'
            },
            {
                patient: patient1._id,
                type: 'lab',
                date: new Date('2026-02-03'),
                diagnosis: 'Lipid Profile',
                lab: 'PathLab',
                result: 'Normal',
                status: 'completed',
                addedBy: 'patient'
            },
            {
                patient: patient1._id,
                type: 'lab',
                date: new Date('2026-01-28'),
                diagnosis: 'Thyroid Function Test',
                lab: 'SRL Diagnostics',
                result: 'Normal',
                status: 'completed',
                addedBy: 'patient'
            },
            {
                patient: patient1._id,
                type: 'lab',
                date: new Date('2026-01-20'),
                diagnosis: 'Kidney Function Test',
                lab: 'Apollo Diagnostics',
                result: 'Normal',
                status: 'completed',
                addedBy: 'patient'
            }
        ]);

        console.log('📋 Created medical records');

        // ============================================
        // CREATE MEDICATIONS (for Naiteek Papriwal)
        // ============================================

        await Medication.create([
            {
                patient: patient1._id,
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                time: '8:00 AM',
                active: true,
                taken: true
            },
            {
                patient: patient1._id,
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice daily',
                time: '8:00 AM & 8:00 PM',
                active: true,
                taken: true
            },
            {
                patient: patient1._id,
                name: 'Atorvastatin',
                dosage: '20mg',
                frequency: 'Once daily',
                time: '9:00 PM',
                active: true,
                taken: false
            },
            {
                patient: patient1._id,
                name: 'Aspirin',
                dosage: '75mg',
                frequency: 'Once daily',
                time: '8:00 AM',
                active: true,
                taken: true
            }
        ]);

        console.log('💊 Created medications');

        // ============================================
        // CREATE APPOINTMENTS (for Naiteek Papriwal)
        // ============================================

        await Appointment.create([
            {
                patient: patient1._id,
                doctor: doctor2._id,
                doctorName: 'Dr. Anjali Sharma',
                specialization: 'Cardiologist',
                dateTime: new Date('2026-03-15T10:00:00'),
                endTime: new Date('2026-03-15T10:30:00'),
                duration: 30,
                location: 'Apollo Hospital, Bangalore',
                type: 'follow-up',
                status: 'upcoming'
            },
            {
                patient: patient1._id,
                doctor: doctor3._id,
                doctorName: 'Dr. Vikram Singh',
                specialization: 'General Physician',
                dateTime: new Date('2026-03-22T14:00:00'),
                endTime: new Date('2026-03-22T14:30:00'),
                duration: 30,
                location: 'City Clinic, Bangalore',
                type: 'checkup',
                status: 'upcoming'
            }
        ]);

        console.log('📅 Created appointments');

        // ============================================
        // CREATE VITALS (for Naiteek Papriwal)
        // ============================================

        await Vital.create([
            {
                patient: patient1._id,
                type: 'blood_pressure',
                value: '120/80',
                unit: 'mmHg',
                measuredAt: new Date('2026-02-08'),
                status: 'normal'
            },
            {
                patient: patient1._id,
                type: 'blood_sugar',
                value: '120',
                unit: 'mg/dL',
                measuredAt: new Date('2026-02-08'),
                status: 'normal'
            },
            {
                patient: patient1._id,
                type: 'heart_rate',
                value: '89',
                unit: 'bpm',
                measuredAt: new Date('2026-02-08'),
                status: 'normal'
            },
            // Historical vitals for trend data
            {
                patient: patient1._id,
                type: 'blood_pressure',
                value: '125/82',
                unit: 'mmHg',
                measuredAt: new Date('2026-01-15'),
                status: 'normal'
            },
            {
                patient: patient1._id,
                type: 'blood_sugar',
                value: '130',
                unit: 'mg/dL',
                measuredAt: new Date('2026-01-15'),
                status: 'elevated'
            },
            {
                patient: patient1._id,
                type: 'heart_rate',
                value: '75',
                unit: 'bpm',
                measuredAt: new Date('2026-01-15'),
                status: 'normal'
            },
            {
                patient: patient1._id,
                type: 'blood_pressure',
                value: '130/85',
                unit: 'mmHg',
                measuredAt: new Date('2025-12-20'),
                status: 'elevated'
            },
            {
                patient: patient1._id,
                type: 'blood_sugar',
                value: '140',
                unit: 'mg/dL',
                measuredAt: new Date('2025-12-20'),
                status: 'elevated'
            }
        ]);

        console.log('📊 Created vitals');

        // ============================================
        // CREATE ACCESS GRANTS (for Naiteek Papriwal)
        // ============================================

        await AccessGrant.create([
            {
                patient: patient1._id,
                doctor: doctor2._id,
                grantedAt: new Date('2026-02-01'),
                expiresAt: new Date('2026-03-01'),
                status: 'active'
            },
            {
                patient: patient1._id,
                doctor: doctor3._id,
                grantedAt: new Date('2026-01-28'),
                expiresAt: new Date('2026-03-15'),
                status: 'active'
            }
        ]);

        console.log('🔐 Created access grants');

        // ============================================
        console.log('\n✅ Database seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('─────────────────────────────────');
        console.log('Patient: naiteek.papriwal@email.com / patient123');
        console.log('Doctor:  anushka.bhatnagar@apollohospitals.com / doctor123');
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
};

seedDatabase();
