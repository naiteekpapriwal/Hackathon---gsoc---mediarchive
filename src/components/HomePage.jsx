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
          <Link to="/" className="nav-logo">
            <i className="bi bi-heart-pulse-fill logo-icon"></i>
            <span className="logo-text">MediVerse</span>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about-uhi">About UHI</Link>
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
              One Digital Health Record for <span className="highlight" style={{textShadow: "0 4px 24px rgba(132, 179, 206, 0.4)"}}>Every Indian</span>
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
