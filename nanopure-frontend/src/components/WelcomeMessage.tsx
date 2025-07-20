import React, { useState } from 'react';
import styles from './WelcomeMessage.module.css';
import logoImg from '../assets/nanopure-logo.png';
import navImg from '../assets/nav.jpeg';

interface WelcomeMessageProps {
  name?: string; // Accepts string or undefined
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ name }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.heroBg} style={{ backgroundImage: `url(${navImg})` }}>
        <div className={styles.logoWrap}>
          <img src={logoImg} alt="NanoPure Logo" className={styles.logo} />
        </div>
        <h1 className={styles.welcomeTitle}>Welcome to NanoPure</h1>
        <p className={styles.mission}>NanoPure is dedicated to providing advanced, affordable, and sustainable water purification solutions. Our smart system ensures you always have access to clean water, while our real-time dashboard keeps you informed and in control.</p>
      </div>
      <div className={styles.card}>
        <h2 className={styles.howItWorksTitle}>How It Works</h2>
        <div className={styles.howItWorksSteps}>
          <div className={styles.step}><span className={styles.emoji}>🚰</span><span>Water enters system</span></div>
          <div className={styles.step}><span className={styles.emoji}>🧱</span><span>Filtration through local materials</span></div>
          <div className={styles.step}><span className={styles.emoji}>🧠</span><span>Sensors monitor quality</span></div>
          <div className={styles.step}><span className={styles.emoji}>📊</span><span>Dashboard displays data</span></div>
          <div className={styles.step}><span className={styles.emoji}>✅</span><span>Safe water delivered</span></div>
        </div>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaText}>Ready to Experience Clean Water?<br/>Join NanoPure</h2>
        </div>
        <button className={styles.closeBtn} onClick={() => setVisible(false)}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default WelcomeMessage;