import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './HomePage.css';

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-logo">
            <i className="bi bi-heart-pulse-fill logo-icon"></i>
            <span className="logo-text">MediVerse</span>
          </a>
          <div className="nav-links">
            <a href="#vision">Vision</a>
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-actions">
            <Link to="/login/patient" className="nav-cta-btn">Patient Login</Link>
            <Link to="/login/doctor" className="nav-cta-btn-secondary">Doctor Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Digital Health Records</span>
            </div>
            <h1 className="hero-title">
              One Digital Health Record for <span className="highlight">Every Indian</span>
            </h1>
            <p className="hero-description">
              MediVerse links patients, doctors, labs and hospitals through a single, secure health ID so your care history is always available when it matters most.
            </p>
            <div className="hero-cta-buttons">
              <Link to="/login/patient" className="btn-primary">
                <span>Login as Patient</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
              <Link to="/login/doctor" className="btn-secondary">Login as Doctor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="trust-stats">
        <div className="stats-container">
          <div className="stat-card scroll-animate">
            <div className="stat-icon">
              <i className="bi bi-wallet2"></i>
            </div>
            <div className="stat-number">50%</div>
            <div className="stat-label">Out-of-Pocket Health Spending</div>
            <p className="stat-description">Total health spending in India paid by patients directly, making every repeated test costly</p>
          </div>
          <div className="stat-card scroll-animate">
            <div className="stat-icon">
              <i className="bi bi-hospital"></i>
            </div>
            <div className="stat-number">35%</div>
            <div className="stat-label">Hospitals with EMR</div>
            <p className="stat-description">Approximate share of Indian hospitals using electronic records today</p>
          </div>
          <div className="stat-card scroll-animate">
            <div className="stat-icon">
              <i className="bi bi-database-check"></i>
            </div>
            <div className="stat-number">42 Cr+</div>
            <div className="stat-label">ABHA Records Created</div>
            <p className="stat-description">Health records linked under Ayushman Bharat Digital Mission</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="vision-section">
        <div className="section-container">
          <h2 className="section-title scroll-animate">Our Vision</h2>
          <p className="section-subtitle scroll-animate">
            To make high-quality, data-driven healthcare accessible to every Indian by giving patients lifetime control over their medical records
          </p>
          <div className="vision-grid">
            <div className="vision-card scroll-animate">
              <div className="vision-icon"><i className="bi bi-person-fill"></i></div>
              <h3>Patient First</h3>
              <p>Every design choice starts with patient safety, consent, and clarity</p>
            </div>
            <div className="vision-card scroll-animate">
              <div className="vision-icon"><i className="bi bi-diagram-3-fill"></i></div>
              <h3>Connected Care</h3>
              <p>Break silos between clinics, hospitals, labs and telemedicine platforms</p>
            </div>
            <div className="vision-card scroll-animate">
              <div className="vision-icon"><i className="bi bi-shield-fill-check"></i></div>
              <h3>Secure by Design</h3>
              <p>Modern encryption with fine-grained access controls for Indian regulations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-modern-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-label">Our Services</span>
            <h2 className="section-title-large">Comprehensive Digital Health Solutions</h2>
            <p className="section-description">
              Designed for Indian healthcare to make medical records accessible and secure
            </p>
          </div>
          <div className="services-grid-cards">
            <div className="service-card-white scroll-animate">
              <div className="service-icon-box">
                <i className="bi bi-file-medical-fill"></i>
              </div>
              <h3>Unified Records</h3>
              <p>All your medical history, lab reports, prescriptions and imaging in one secure digital location</p>
              <span className="service-arrow">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
            <div className="service-card-white scroll-animate">
              <div className="service-icon-box">
                <i className="bi bi-share-fill"></i>
              </div>
              <h3>Secure Sharing</h3>
              <p>Share records via QR code or OTP with time-bound access that you control completely</p>
              <span className="service-arrow">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
            <div className="service-card-white scroll-animate">
              <div className="service-icon-box">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3>Doctor Collaboration</h3>
              <p>Seamless communication between healthcare providers with complete patient consent</p>
              <span className="service-arrow">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
            <div className="service-card-white scroll-animate">
              <div className="service-icon-box">
                <i className="bi bi-phone-fill"></i>
              </div>
              <h3>Mobile & Web Access</h3>
              <p>Access your records from any device, anywhere in India, with real-time updates</p>
              <span className="service-arrow">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <h2 className="section-title scroll-animate">How MediVerse Works</h2>
          <p className="section-subtitle scroll-animate">
            India is digitising fast, but records are still scattered. MediVerse gives you one place to see and share your history securely
          </p>
          <div className="steps-container">
            <div className="step-card scroll-animate">
              <div className="step-number">01</div>
              <div className="step-icon"><i className="bi bi-card-heading"></i></div>
              <h3>Create / Link Your ABHA</h3>
              <p>Sign up with Aadhaar and link your Ayushman Bharat Health Account for a single longitudinal timeline</p>
            </div>
            <div className="step-card scroll-animate">
              <div className="step-number">02</div>
              <div className="step-icon"><i className="bi bi-hospital-fill"></i></div>
              <h3>Connect Doctors & Hospitals</h3>
              <p>Doctors request time-bound access using QR or OTP to see your full verified history</p>
            </div>
            <div className="step-card scroll-animate">
              <div className="step-number">03</div>
              <div className="step-icon"><i className="bi bi-graph-up-arrow"></i></div>
              <h3>One Timeline, Smarter Decisions</h3>
              <p>Every visit and report is added to your secure record, reducing repeated tests and costs</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="section-container">
          <h2 className="section-title scroll-animate">Frequently Asked Questions</h2>
          <div className="faq-container">
            <div className="faq-item scroll-animate">
              <details open={activeIndex === 0} onClick={() => toggleFAQ(0)}>
                <summary>Is my data secure?</summary>
                <p>Yes. We use end-to-end encryption, patient-controlled access, and comply with Indian data protection standards. You decide who sees what and for how long.</p>
              </details>
            </div>
            <div className="faq-item scroll-animate">
              <details open={activeIndex === 1} onClick={() => toggleFAQ(1)}>
                <summary>How do I link my existing hospital records?</summary>
                <p>Connect your ABHA ID during signup. Any hospital already sharing digital records to the Ayushman Bharat ecosystem will automatically appear in your timeline.</p>
              </details>
            </div>
            <div className="faq-item scroll-animate">
              <details open={activeIndex === 2} onClick={() => toggleFAQ(2)}>
                <summary>Can I use this for emergency care?</summary>
                <p>Absolutely. Generate an emergency QR code that gives 24-hour read access to any doctor without needing your phone or OTP.</p>
              </details>
            </div>
            <div className="faq-item scroll-animate">
              <details open={activeIndex === 3} onClick={() => toggleFAQ(3)}>
                <summary>Does this work with my telemedicine app?</summary>
                <p>Yes. We integrate with major telemedicine platforms and hospital EMR systems that support ABHA/ABDM standards.</p>
              </details>
            </div>
            <div className="faq-item scroll-animate">
              <details open={activeIndex === 4} onClick={() => toggleFAQ(4)}>
                <summary>What if I forget my password?</summary>
                <p>Use Aadhaar-based recovery or link your phone number for OTP reset. We never store your password in plain text.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container scroll-animate">
          <h2 className="cta-title">Ready to Secure Your Health Data?</h2>
          <p className="cta-subtitle">
            Join thousands of patients and doctors already using MediVerse to make healthcare simpler and safer
          </p>
          <div className="cta-buttons">
            <Link to="/login/patient" className="btn-primary-large">Get Started as Patient</Link>
            <Link to="/login/doctor" className="btn-secondary-large">For Doctors & Clinics</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>MediVerse</h4>
              <p>India's unified digital health record platform. Secure, interoperable, patient-controlled.</p>
            </div>
            <div className="footer-col">
              <h4>Patients</h4>
              <a href="/patient/login">Login</a>
              <a href="/abha">ABHA Integration</a>
              <a href="/emergency">Emergency Access</a>
            </div>
            <div className="footer-col">
              <h4>Doctors</h4>
              <a href="/doctor/login">Doctor Login</a>
              <a href="/search">Patient Search</a>
              <a href="/records">Add Records</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p><i className="bi bi-envelope-fill"></i> support@mediverse.in</p>
              <p><i className="bi bi-telephone-fill"></i> +91 98765 43210</p>
              <p><i className="bi bi-geo-alt-fill"></i> Bengaluru, India</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 MediVerse. Built for VIT-JHU Health Hackathon 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
