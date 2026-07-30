# MediVerse - Digital Health Records Platform

<div align="center">
  
  ### One Digital Health Record for Every Indian, Accessible Everywhere
  
  *India's unified health data system linking patients, doctors, labs and hospitals through a single, secure health ID — built on UHI (Unified Healthcare Interface) principles.*

  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

</div>

---

## ✨ Features

### 🔐 Authentication System
- **Dual Role Login**: Separate authentication flows for patients and doctors
- **JWT-Based Sessions**: Secure token-based access with role verification
- **Password Hashing**: Industry-standard bcrypt encryption
- **Registration & Login**: Full signup/signin for both user types

### 👤 Patient Portal
- **Health Metrics Dashboard**: 
  - Next appointment tracking with doctor details
  - Medications due today with reminders
  - Blood pressure, blood sugar, heart rate monitoring
  - Care team overview (specialists)
- **Medical QR Code**: Unique scannable QR identity for seamless doctor visits
- **Medical Records**: Complete history with search functionality
- **Recent Tests**: List view with download/view options (CBC, Lipid Profile, HbA1c, etc.)
- **Health Alerts**: Critical allergies and chronic conditions prominently displayed
- **Medications Management**: Active prescriptions with dosage and frequency
- **Record Upload**: Upload medical documents (PDF, images) directly to the timeline
- **Record Sharing**: Share medical records securely via token-based access links
- **Profile Management**: Personal stats (age, height, weight, blood type)

### 👨‍⚕️ Doctor Dashboard
- **Practice Overview**:
  - Active patients count
  - Today's appointments
  - Pending reviews
  - Years of experience tracker
- **Patient Search**: Quick patient lookup by name, health ID, or email
- **QR Code Scanner**: Scan patient QR codes for instant timeline access
- **Medical History Timeline**: Chronological patient medical records
- **Digital Prescriptions**: Issue prescriptions directly to patient accounts
- **Patient Management**: Tabular view with filtering and sorting
- **Vital Signs Monitoring**: Real-time patient statistics and charting
- **Notifications**: Stay updated with patient alerts

### 🎨 Design & UX
- **Modern Healthcare Aesthetic**: Venice Blue palette (`#16587B`, `#84B3CE`, `#F5EEDD`)
- **Premium Typography**: Outfit + Inter font pairing from Google Fonts
- **Immersive Hero Section**: Full-bleed background imagery with mesmerizing gradient fade
- **Smooth Animations**: Scroll-triggered entrance animations with staggered delays
- **Responsive Layout**: Mobile, tablet, and desktop optimized
- **Accessibility**: Semantic HTML, keyboard navigation, and focus indicators
- **Glassmorphism Elements**: Backdrop blur and translucent surfaces
- **Micro-interactions**: Hover effects, card lifts, and smooth transitions

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** — UI component library
- **React Router DOM 6.8** — Client-side routing with protected routes
- **CSS3** — Custom design system with CSS Variables
- **Bootstrap Icons** — Comprehensive icon library
- **Chart.js + react-chartjs-2** — Health metric visualizations
- **react-qr-code** — Patient QR code generation
- **html5-qrcode** — Doctor-side QR code scanning
- **react-hot-toast** — Toast notification system
- **Axios** — HTTP client for API communication
- **date-fns** — Date formatting and manipulation

### Backend
- **Node.js + Express 4.18** — REST API server
- **Supabase (PostgreSQL)** — Cloud-hosted relational database
- **JSON Web Tokens (JWT)** — Stateless authentication
- **bcryptjs** — Password hashing
- **Multer** — File upload handling (medical documents)
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment variable management
- **Nodemon** — Development hot-reloading

### Database
- **Supabase (PostgreSQL)** — 9 normalized tables with UUID primary keys
- **Tables**: `users`, `patients`, `doctors`, `doctor_linked_patients`, `access_grants`, `medical_records`, `medications`, `appointments`, `vitals`, `share_tokens`
- **Auto-updated timestamps** via PostgreSQL triggers

### Development Tools
- **Create React App** — Frontend build tooling
- **ESLint** — Code linting
- **Webpack** — Module bundling
- **Git + GitHub** — Version control

---

## 📁 Project Structure

```
mediverse/
├── public/
│   ├── favicon.svg                # Heartbeat pulse icon
│   ├── image.png                  # Hero background image
│   ├── index.html                 # HTML template
│   ├── manifest.json              # PWA manifest
│   ├── logo192.png                # PWA icon 192x192
│   └── logo512.png                # PWA icon 512x512
├── src/
│   ├── assets/                    # Bundled image assets
│   │   └── image.png              # Hero background (Webpack-resolved)
│   ├── components/
│   │   ├── HomePage.jsx           # Landing page (Hero section only)
│   │   ├── HomePage.css           # Landing page styles + design system
│   │   ├── AboutUHI.jsx           # About UHI page (Vision, Services, FAQ)
│   │   ├── LoginPage.jsx          # Dual-role login component
│   │   ├── LoginPage.css          # Login styles
│   │   ├── RegisterPage.jsx       # Dual-role registration
│   │   ├── RegisterPage.css       # Registration styles
│   │   ├── PatientDashboard.jsx   # Patient portal
│   │   ├── PatientDashboard.css   # Patient styles
│   │   ├── DoctorDashboard.jsx    # Doctor portal
│   │   ├── DoctorDashboard.css    # Doctor styles
│   │   ├── PatientSearch.jsx      # Doctor's patient search
│   │   ├── PatientSearch.css      # Patient search styles
│   │   ├── QRScanner.jsx          # QR code scanning component
│   │   ├── ShareRecords.jsx       # Record sharing via tokens
│   │   ├── ShareRecords.css       # Sharing styles
│   │   ├── UploadRecord.jsx       # Medical document upload
│   │   └── UploadRecord.css       # Upload styles
│   ├── services/
│   │   ├── api.js                 # Axios instance + interceptors
│   │   ├── authService.js         # Login, register, token management
│   │   ├── patientService.js      # Patient API calls
│   │   └── doctorService.js       # Doctor API calls
│   ├── App.jsx                    # Root component + route config
│   ├── App.css                    # Global styles
│   └── index.js                   # React entry point
├── backend/
│   ├── config/
│   │   ├── db.js                  # Database connection config
│   │   └── supabase.js            # Supabase client initialization
│   ├── controllers/
│   │   ├── authController.js      # Auth logic (login, register, JWT)
│   │   ├── patientController.js   # Patient CRUD + record operations
│   │   └── doctorController.js    # Doctor CRUD + patient management
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   ├── roleAuth.js            # Role-based access control
│   │   ├── errorHandler.js        # Global error handling
│   │   └── upload.js              # Multer file upload config
│   ├── models/
│   │   ├── User.js                # User model
│   │   ├── Patient.js             # Patient model
│   │   ├── Doctor.js              # Doctor model
│   │   ├── MedicalRecord.js       # Medical record model
│   │   ├── Medication.js          # Medication model
│   │   ├── Appointment.js         # Appointment model
│   │   ├── Vital.js               # Vital signs model
│   │   ├── AccessGrant.js         # Access grant model
│   │   └── ShareToken.js          # Share token model
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth endpoints
│   │   ├── patientRoutes.js       # /api/patient endpoints
│   │   └── doctorRoutes.js        # /api/doctor endpoints
│   ├── seed/
│   │   └── seed.js                # Database seeding script
│   ├── utils/
│   │   └── authUtils.js           # Token generation helpers
│   ├── uploads/                   # File upload directory
│   ├── server.js                  # Express server entry point
│   ├── .env.example               # Environment variable template
│   └── package.json               # Backend dependencies
├── supabase_schema.sql            # Full database schema
├── package.json                   # Frontend dependencies
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm installed
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/naiteekpapriwal/Hackathon---gsoc---mediarchive.git
cd Hackathon---gsoc---mediarchive
```

### 2. Setup the Database

Run the `supabase_schema.sql` file in your Supabase SQL Editor to create all required tables and triggers.

### 3. Configure the Backend

```bash
cd backend
cp .env.example .env
# Fill in your Supabase URL, Anon Key, and JWT Secret in .env
npm install
```

### 4. Configure the Frontend

```bash
cd ..
npm install
```

### 5. Run the Application

```bash
# Terminal 1 — Start the backend
cd backend
npm run dev

# Terminal 2 — Start the frontend
npm start
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

### 6. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

---

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the `backend/` directory using `.env.example` as a template:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
```

---

## 🎯 Key Highlights

- ✅ **Full-Stack Application** — React frontend + Express backend + Supabase database
- ✅ **QR-Based Patient Identification** — Instant doctor access via scannable patient QR codes
- ✅ **Role-Based Access Control** — Separate patient and doctor experiences with JWT auth
- ✅ **Medical Record Management** — Upload, view, download, and share health documents
- ✅ **Real-Time Health Metrics** — Vitals tracking with Chart.js visualizations
- ✅ **Secure Record Sharing** — Token-based temporary access for doctor consultations
- ✅ **Modern UI/UX** — Premium design with scroll animations and immersive backgrounds
- ✅ **Responsive** — Works seamlessly on all devices
- ✅ **UHI Principles** — Aligned with Unified Healthcare Interface standards

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.