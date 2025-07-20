import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';
import ugandaFlag from '../assets/uganda-flag.jpeg';
import waterDrop from '../assets/water-drop.avif';
import nanopureLogo from '../assets/nanopure-logo.png';
import waImg from '../assets/wa.jpeg';

const team = [
  { name: 'Kikomeko Ibrahim', role: 'Backend Engineer', bio: 'Leads backend APIs and IoT integration.' },
  { name: 'Kenkyerengye Sellah', role: 'Frontend Developer', bio: 'Designs and builds user-friendly interfaces.' },
  { name: 'Nuwenyesiga Conrad', role: 'Backend Engineer', bio: 'Develops robust backend systems.' },
  { name: 'Sunday Joseph', role: 'Frontend Developer', bio: 'Creates engaging dashboard experiences.' },
  { name: 'Travis Ayebazibwe', role: 'Backend Developer', bio: 'Ensures secure and scalable backend services.' },
];

const features = [
  { icon: '✅', text: '100% Ugandan materials (sand, biochar, zeolite, IONPs)' },
  { icon: '🌐', text: 'Smart monitoring with AI & IoT' },
  { icon: '📱', text: 'Remote access via mobile and web' },
  { icon: '🌍', text: 'Multi-language support (Luganda, Swahili, English)' },
  { icon: '♻️', text: 'Eco-friendly and upcycled materials' },
];

const steps = [
  { icon: '💧', text: 'Contaminated water enters' },
  { icon: '🧱', text: 'Filters made of local materials clean it' },
  { icon: '🧠', text: 'Sensors check pH, turbidity, and metals' },
  { icon: '📊', text: 'Data goes to the web dashboard' },
  { icon: '📱', text: 'Users monitor everything from their phone or computer' },
];

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLearnMore = () => {
    // Scroll to the "Technology" section for more detailed information
    const techSection = document.querySelector(`.${styles.techSection}`);
    if (techSection) {
      techSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={styles.aboutBg}
      style={{
        backgroundImage: `url(${require('../assets/wa.jpeg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 1. Introduction */}
      <section className={styles.introSection}>
        <div className={styles.introHeader}>
          <img src={nanopureLogo} alt="NanoPure Logo" className={styles.logo} />
          <div className={styles.introContent}>
            <h1 className={styles.title}>About NanoPure Uganda</h1>
            <p className={styles.introText}>
              NanoPure Uganda is an AI-powered water purification system designed using locally available materials. Our mission is to bring clean, affordable, and sustainable drinking water to Ugandan communities through smart technology and grassroots innovation.
            </p>
          </div>
        </div>
        <div className={styles.introImage}>
          <img src={ugandaFlag} alt="Uganda Flag" className={styles.flagImage} />
          <div className={styles.imageOverlay}>
            <span>🇺🇬 Made in Uganda, for Uganda</span>
          </div>
        </div>
      </section>

      {/* 2. Why We Started */}
      <section className={styles.whySection}>
        <h2 className={styles.sectionTitle}>Why We Started</h2>
        <div className={styles.whyContent}>
          <div className={styles.whyStats}>
            <div className={styles.statNumber}>43%</div>
            <div className={styles.statText}>of Ugandans lack access to clean water</div>
          </div>
          <ul className={styles.whyList}>
            <li>Unsafe sources, waterborne diseases, expensive chemicals</li>
            <li>Our response: building something local, smart, and affordable</li>
          </ul>
        </div>
        <div className={styles.waterImageContainer}>
          <img src={waterDrop} alt="Clean Water" className={styles.waterImage} />
          <div className={styles.waterOverlay}>
            <span>💧 Clean Water for All</span>
          </div>
        </div>
      </section>

      {/* 3. Vision and Mission */}
      <section className={styles.visionSection}>
        <div className={styles.visionCard}>
          <span className={styles.visionIcon}>🎯</span>
          <div className={styles.visionTitle}>Vision</div>
          <div className={styles.visionText}>A Uganda where every household has access to safe drinking water through local innovation.</div>
        </div>
        <div className={styles.visionCard}>
          <span className={styles.visionIcon}>🚀</span>
          <div className={styles.visionTitle}>Mission</div>
          <div className={styles.visionText}>To use AI, IoT, and Ugandan resources to create smart water filtration systems that are accessible to all.</div>
        </div>
      </section>

      {/* 4. How the System Works */}
      <section className={styles.howSection}>
        <h2 className={styles.sectionTitle}>How the System Works</h2>
        <div className={styles.howSteps}>
          {steps.map((step, i) => (
            <div key={i} className={styles.howStep}>
              <span className={styles.howIcon}>{step.icon}</span>
              <div className={styles.howText}>{step.text}</div>
            </div>
          ))}
        </div>
        <div className={styles.processVisual}>
          <div className={styles.processLine}>
            <div className={styles.processStep}>
              <div className={styles.processIcon}>💧</div>
              <span>Input</span>
            </div>
            <div className={styles.processArrow}>→</div>
            <div className={styles.processStep}>
              <div className={styles.processIcon}>🧱</div>
              <span>Filter</span>
            </div>
            <div className={styles.processArrow}>→</div>
            <div className={styles.processStep}>
              <div className={styles.processIcon}>🧠</div>
              <span>Monitor</span>
            </div>
            <div className={styles.processArrow}>→</div>
            <div className={styles.processStep}>
              <div className={styles.processIcon}>📊</div>
              <span>Data</span>
            </div>
            <div className={styles.processArrow}>→</div>
            <div className={styles.processStep}>
              <div className={styles.processIcon}>📱</div>
              <span>Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Team Behind NanoPure */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>The Team Behind NanoPure</h2>
        <div className={styles.teamGrid}>
          {team.map((member, i) => (
            <div key={i} className={styles.teamCard}>
              <div className={styles.teamAvatar}>{member.name[0]}</div>
              <div className={styles.teamName}>{member.name}</div>
              <div className={styles.teamRole}>{member.role}</div>
              <div className={styles.teamBio}>{member.bio}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. What Makes Us Different */}
      <section className={styles.differentSection}>
        <h2 className={styles.sectionTitle}>What Makes Us Different</h2>
        <ul className={styles.featuresList}>
          {features.map((f, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span> 
              <span className={styles.featureText}>{f.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Technology Details */}
      <section className={styles.techSection}>
        <h2 className={styles.sectionTitle}>Our Technology</h2>
        <div className={styles.techGrid}>
          <div className={styles.techCard}>
            <h3>🔬 Advanced Filtration</h3>
            <p>Our system uses a multi-stage filtration process combining sand, biochar, zeolite, and iron oxide nanoparticles to remove contaminants effectively.</p>
          </div>
          <div className={styles.techCard}>
            <h3>📡 IoT Sensors</h3>
            <p>Real-time monitoring with pH, turbidity, and heavy metal sensors that continuously track water quality and send data to our cloud platform.</p>
          </div>
          <div className={styles.techCard}>
            <h3>🤖 AI-Powered Analytics</h3>
            <p>Machine learning algorithms analyze water quality patterns, predict maintenance needs, and optimize filtration performance automatically.</p>
          </div>
          <div className={styles.techCard}>
            <h3>🌱 Sustainable Materials</h3>
            <p>All filtration materials are sourced locally in Uganda, reducing costs and environmental impact while supporting local communities.</p>
          </div>
        </div>
      </section>

      {/* 7. Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Join Us in Making Clean Water Accessible</h2>
          <p className={styles.ctaText}>
            Together, we can transform water access in Uganda using local innovation and smart technology.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaButton} onClick={handleGetStarted}>Get Started</button>
            <button className={styles.ctaButtonSecondary} onClick={handleLearnMore}>Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 