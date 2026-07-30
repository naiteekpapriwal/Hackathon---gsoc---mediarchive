import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './HomePage.css';

const AboutUHI = () => {
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
    <div className="homepage about-uhi-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <i className="bi bi-heart-pulse-fill logo-icon"></i>
            <span className="logo-text">MediVerse</span>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
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

      <div style={{ paddingTop: '80px' }}>
        {/* Vision Section */}
        <section id="vision" className="vision-section">
          <div className="section-container">
            <h2 className="section-title scroll-animate">Our Vision for UHI</h2>
            <p className="section-subtitle scroll-animate">
              Unified Healthcare Interface (UHI) aims to make high-quality, data-driven healthcare accessible to every Indian by giving patients lifetime control over their medical records.
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
            <h2 className="section-title scroll-animate">How UHI Works</h2>
            <p className="section-subtitle scroll-animate">
              India is digitising fast, but records are still scattered. MediVerse uses UHI principles to give you one place to see and share your history securely
            </p>
            <div className="steps-container">
              <div className="step-card scroll-animate">
                <div className="step-number">01</div>
                <div className="step-icon"><i className="bi bi-qr-code-scan"></i></div>
                <h3>Generate Your Medical QR</h3>
                <p>Get your unique patient QR code upon registration, giving you a secure, scannable digital identity for all future visits.</p>
              </div>
              <div className="step-card scroll-animate">
                <div className="step-number">02</div>
                <div className="step-icon"><i className="bi bi-hospital-fill"></i></div>
                <h3>Instant Doctor Access</h3>
                <p>Doctors scan your QR code to instantly access your timeline or issue new digital prescriptions directly to your account.</p>
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
                <details open={activeIndex === 0} onClick={(e) => { e.preventDefault(); toggleFAQ(0); }}>
                  <summary>Is my medical data safe and private?</summary>
                  <p>Yes. We use end-to-end encryption and comply with strict national healthcare data protection standards. Your records are completely private, and you are the only one who decides which doctors get access.</p>
                </details>
              </div>
              <div className="faq-item scroll-animate">
                <details open={activeIndex === 1} onClick={(e) => { e.preventDefault(); toggleFAQ(1); }}>
                  <summary>What is my Medical QR Code?</summary>
                  <p>When you register, you receive a unique Medical QR Code—think of it as your secure digital health badge. Whenever you visit a clinic, simply show this code on your phone instead of carrying paper files.</p>
                </details>
              </div>
              <div className="faq-item scroll-animate">
                <details open={activeIndex === 2} onClick={(e) => { e.preventDefault(); toggleFAQ(2); }}>
                  <summary>How do I share my medical history with a new doctor?</summary>
                  <p>Just let the doctor scan your Medical QR Code! They will instantly receive secure, temporary access to your timeline. They can review your past treatments and add new digital prescriptions directly to your account.</p>
                </details>
              </div>
              <div className="faq-item scroll-animate">
                <details open={activeIndex === 3} onClick={(e) => { e.preventDefault(); toggleFAQ(3); }}>
                  <summary>Is MediVerse free to use?</summary>
                  <p>Yes! Our platform is completely free for patients. Our mission is to ensure every individual has seamless, barrier-free access to their own medical journey.</p>
                </details>
              </div>
              <div className="faq-item scroll-animate">
                <details open={activeIndex === 4} onClick={(e) => { e.preventDefault(); toggleFAQ(4); }}>
                  <summary>Can I download or print my lab reports?</summary>
                  <p>Absolutely. While your records are stored safely in the cloud, you can view, download, or print any test result, prescription, or scan directly from your patient dashboard at any time.</p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>MediVerse</h4>
              <p>India's unified digital health record platform based on UHI. Secure, interoperable, patient-controlled.</p>
            </div>
            <div className="footer-col">
              <h4>Patients</h4>
              <Link to="/login/patient">Login</Link>
              <a href="#abha">ABHA Integration</a>
            </div>
            <div className="footer-col">
              <h4>Doctors</h4>
              <Link to="/login/doctor">Doctor Login</Link>
              <a href="#search">Patient Search</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p><i className="bi bi-envelope-fill"></i> support@mediverse.in</p>
              <p><i className="bi bi-telephone-fill"></i> +91 98765 43210</p>
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

export default AboutUHI;
