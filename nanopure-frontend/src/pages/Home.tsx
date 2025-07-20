import React from 'react';
import styles from './Home.module.css';
import nanopureLogo from '../assets/nanopure-logo.png';
import heroImg from '../assets/wat.jpg';
import waImg from '../assets/wa.jpeg';
import wattImg from '../assets/watt.jpeg';

const features = [
  { icon: '💧', title: 'Clean Water', desc: 'Advanced filtration for safe, healthy drinking water.' },
  { icon: '📈', title: 'Real-Time Monitoring', desc: 'Track water quality and system status anytime, anywhere.' },
  { icon: '🌱', title: 'Eco-Friendly', desc: 'Sustainable technology using local materials.' },
  { icon: '💸', title: 'Affordable', desc: 'Low-cost, high-impact solutions for communities.' },
];

const steps = [
  { icon: '🚰', text: 'Water enters system' },
  { icon: '🧱', text: 'Filtration through local materials' },
  { icon: '🧠', text: 'Sensors monitor quality' },
  { icon: '📊', text: 'Dashboard displays data' },
  { icon: '✅', text: 'Safe water delivered' },
];

// White container wrapper for sections
const WhiteContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.whiteContainer}>{children}</div>
);

const Home: React.FC = () => {
  return (
    <div className={styles.homeModern}>
      {/* Hero Section */}
      <section className={styles.heroModern} style={{ backgroundImage: `url(${heroImg})` }}>
        <div className={styles.heroOverlayModern}>
          <div className={styles.heroContentModern}>
            <h1 className={styles.heroTitleModern}>NanoPure: Clean Water, Smart Future</h1>
            <p className={styles.heroSubtitleModern}>Affordable, AI-powered water purification for every community.</p>
            <a href="/login" className={styles.ctaBtnModern}>Get Started</a>
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className={styles.featuresSectionModern} style={{ backgroundImage: `url(${waImg})` }}>
        {features.map((f, i) => (
          <div className={styles.featureCardModern} key={i}>
            <div className={styles.featureIconModern}>{f.icon}</div>
            <div className={styles.featureTitleModern}>{f.title}</div>
            <div className={styles.featureDescModern}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Main Content with watt.jpeg as background */}
      <div className={styles.wattBgRest}>
        {/* Section 1: Logo, Welcome, Description */}
        <WhiteContainer>
          <img src={nanopureLogo} alt="NanoPure Logo" className={styles.aboutImgModern} />
          <div className={styles.aboutTextModern}>
            <h2>Welcome to NanoPure</h2>
            <p>
              NanoPure is dedicated to providing advanced, affordable, and sustainable water purification solutions. Our smart system ensures you always have access to clean water, while our real-time dashboard keeps you informed and in control.
            </p>
          </div>
        </WhiteContainer>

        {/* Section 2: How It Works */}
        <WhiteContainer>
          <h2 className={styles.timelineTitleModern}>How It Works</h2>
          <div className={styles.timelineModern}>
            {steps.map((step, i) => (
              <div className={styles.timelineStepModern} key={i}>
                <div className={styles.timelineIconModern}>{step.icon}</div>
                <div className={styles.timelineTextModern}>{step.text}</div>
                {i < steps.length - 1 && <div className={styles.timelineConnectorModern}></div>}
              </div>
            ))}
          </div>
        </WhiteContainer>

        {/* Section 3: Call to Action */}
        <WhiteContainer>
          <h2 className={styles.ctaSectionModern}>Ready to Experience Clean Water?</h2>
          <a href="/register" className={styles.ctaBtnModern}>Join NanoPure</a>
        </WhiteContainer>
      </div>
    </div>
  );
};

export default Home; 