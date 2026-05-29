import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 
import logo from '../assets/logo.png';
import heroDoctor from '../assets/doctor.png'; 
import iconAccount from '../assets/icon-account.png';
import iconDoctor from '../assets/icon-doctor.png';
import iconSchedule from '../assets/icon-schedule.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      
      <header className="landing-header">
        <img src={logo} alt="ClinicSync Logo" className="logo" />
        <button className="btn-primary" onClick={goToSignIn}>
          Book an Appointment
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-text-content">
          <h1>Book Your Doctor<br />Appointment<br />Online Now.</h1>
          <p>
            Book your next doctor's appointment online from the comfort of your home, 
            our group of medical experts are waiting for you! Schedule your appointment now!
          </p>
          <button className="btn-secondary" onClick={goToSignIn}>
            Book an Appointment
          </button>
        </div>
        
        <div className="hero-image-container">
          <img src={heroDoctor} alt="Smiling Doctor" className="hero-image" />
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="section-title">How It Works!</h2>
        <p className="section-subtitle">
          Book your appointments from this website and experience the best healthcare in Cebu!
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <img src={iconAccount} alt="Create an Account Icon" className="feature-icon" />
            <h3>Create an<br />Account</h3>
          </div>
          <div className="feature-card">
            <img src={iconDoctor} alt="Browse Doctors Icon" className="feature-icon" />
            <h3>Browse Through<br />our Doctors</h3>
          </div>
          <div className="feature-card">
            <img src={iconSchedule} alt="Schedule Appointment Icon" className="feature-icon" />
            <h3>Schedule an<br />Appointment</h3>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;