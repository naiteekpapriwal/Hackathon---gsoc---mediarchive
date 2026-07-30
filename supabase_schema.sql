-- Supabase Schema for MediVerse

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor')),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    _id VARCHAR(100) UNIQUE,
    health_id VARCHAR(100) UNIQUE,
    aadhaar VARCHAR(100),
    age INTEGER,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(10) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    height VARCHAR(50),
    weight VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    allergies TEXT[],
    chronic_conditions TEXT[],
    emergency_contact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    hpr_id VARCHAR(100) UNIQUE,
    specialization VARCHAR(255),
    hospital VARCHAR(255),
    experience VARCHAR(100),
    qualifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Linked Patients (Many-to-Many)
CREATE TABLE doctor_linked_patients (
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (doctor_id, patient_id)
);

-- 4. Access Grants
CREATE TABLE access_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_access_grants_patient_doctor ON access_grants(patient_id, doctor_id);

-- 5. Medical Records
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(255),
    doctor_specialization VARCHAR(255),
    type VARCHAR(50) DEFAULT 'consultation' CHECK (type IN ('consultation', 'prescription', 'lab', 'imaging', 'surgery', 'vaccination', 'other')),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    hospital_name VARCHAR(255),
    lab VARCHAR(255),
    result TEXT,
    files JSONB DEFAULT '[]'::JSONB,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'approved', 'completed')),
    added_by VARCHAR(50) DEFAULT 'patient' CHECK (added_by IN ('patient', 'doctor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Medications
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    time VARCHAR(100),
    prescribed_by UUID REFERENCES doctors(id) ON DELETE SET NULL,
    prescribed_by_name VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    taken BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    type VARCHAR(50) DEFAULT 'consultation' CHECK (type IN ('checkup', 'follow-up', 'consultation', 'emergency')),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Vitals
CREATE TABLE vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('blood_pressure', 'blood_sugar', 'heart_rate', 'temperature', 'oxygen_saturation', 'weight')),
    value VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'normal' CHECK (status IN ('normal', 'elevated', 'low', 'critical')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Share Tokens
CREATE TABLE share_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    otp VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL, -- days
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES doctors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for 'updated_at'
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_access_grants_updated_at BEFORE UPDATE ON access_grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vitals_updated_at BEFORE UPDATE ON vitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_share_tokens_updated_at BEFORE UPDATE ON share_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
