# 🏥 MediVerse - Digital Health Records Platform

<div align="center">
  
  ### One Digital Health Record for Every Indian
  
  *India's modern unified health data system linking patients, doctors, and hospitals through secure Medical QR Codes and UHI principles.*

  [![Live Demo](https://img.shields.io/badge/Live-Demo-2A6F28?style=for-the-badge)](https://mediverse-zr98.vercel.app/)
  [![Video Demo](https://img.shields.io/badge/Watch-Video_Demo-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/iHHp_tco93g)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

</div>

---

## 🔗 Important Links
- **Live Vercel Deployment**: [https://mediverse-zr98.vercel.app/](https://mediverse-zr98.vercel.app/)
- **YouTube Video Demo**: [Watch Here (Unlisted)](https://youtu.be/iHHp_tco93g)

---

### 🔐 Authentication & Access System
- **Medical QR Identity**: Patients generate a unique, scannable QR code upon registration, replacing cumbersome manual health ID linking.
- **Instant Doctor Access**: Doctors seamlessly scan patient QR codes to get secure, temporary access to the patient's longitudinal timeline.
- **Dual Role Architecture**: Distinct authentication flows and features for Patients and Doctors.

### 👤 Patient Portal
- **Health Metrics Dashboard**: 
  - Comprehensive view of medical history, prescriptions, and timeline.
  - Blood pressure, blood sugar, and heart rate monitoring built-in.
  - View and easily download laboratory reports and medical documents.
- **Medications Management**: Track active prescriptions with dosage and frequency details.

### 👨‍⚕️ Doctor Dashboard
- **Efficient Patient Management**:
  - Direct QR scanning interface to pull patient records instantly.
  - My Patients overview with pending reviews and daily appointments.
  - Ability to seamlessly issue digital prescriptions and register new diagnoses.
- **Medical History Timeline**: Chronological, unified view of a patient's historical medical records seamlessly integrated into the ecosystem.

### 🎨 Design & UX - Modern UI Revamp
- **Mesmerizing Aesthetics**: Completely revamped the UI toward a premium, high-trust SaaS aesthetic featuring deep dark teals (`#16587B`) on warm cream (`#F5EEDD`) backgrounds.
- **Balanced Visuals**: Rich, full-bleed imagery with smooth `linear-gradient` fades ensures perfect text contrast and approachability.
- **Modern Typography**: Smooth integration of `Outfit` and `Inter` font families for maximum readability across dense data sets.
- **Glassmorphism**: Elegant backgrounds and translucent UI cards for a layered, deep user interface.
- **Responsive Layout**: Fluidly adapts across mobile, tablet, and high-fidelity desktop displays.

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Core UI library
- **React Router DOM 6.8** - Client-side routing for seamless navigation
- **Vanilla CSS3** - Complete custom styling without heavy framework dependencies
- **Bootstrap Icons** - For modern, crisp SVGs.

### Backend Integrations
- **Supabase / Node.js** - Architecture to drive the authentication and relational database capabilities.
- **QR Generation Engine** - Powering dynamic health identity generation.

---

## 📁 Project Structure

```
mediverse/
├── public/                 # Static public assets (Favicon, Manifests)
├── src/
│   ├── assets/             # Core UI images (Doctors, Medical Scans, etc.)
│   ├── components/
│   │   ├── HomePage.jsx          # Stunning landing page with image fade
│   │   ├── HomePage.css
│   │   ├── AboutUHI.jsx          # Detailed UHI documentation & FAQ component
│   │   ├── LoginPage.jsx         # Clean, centered authorization module
│   │   ├── PatientDashboard.jsx  # Patient dashboard UI
│   │   └── DoctorDashboard.jsx   # Doctor dashboard UI
│   ├── App.jsx             # Router definition uniting the app
│   ├── App.css             # Global stylings and design tokens
│   └── index.js            # Entry point
```

---

## 🎯 Key Highlights
- ✅ **UHI Architecture Core**: Designed natively with Unified Healthcare Interface (UHI) goals at heart.
- ✅ **Scanner-Ready Workflow**: Moving past typing long IDs in favor of rapidly scalable QR handshakes.
- ✅ **Streamlined Content**: Extracted educational resources into a dedicated `AboutUHI` page, keeping the landing page conversion-focused.
- ✅ **Zero Compilation Errors**: Stable, production-ready codebase.

---

## 👨‍💻 Author
**Naiteek Papriwal**

*Project built for CS50 / Harvard.*