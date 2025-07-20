import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTheme } from './ThemeContext';
import { useUser } from './UserContext';
import navImg from '../assets/nav.jpeg';

const Navbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={styles.navbar} style={{ backgroundImage: `url(${navImg})`, backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
      <div className={styles.logoRow}>
        <img src="/assets/nanopure-logo.png" alt="NanoPure Logo" className={styles.logo} />
        <span className={styles.brand}>NanoPure</span>
        <button className={styles.hamburger} onClick={() => setMenuOpen(m => !m)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`} onClick={() => setMenuOpen(false)}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} end>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>About</NavLink>
        {user && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Dashboard</NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Settings</NavLink>
          </>
        )}
      </div>
      <div className={styles.rightControls}>
        {/* Theme Controls */}
        <div className={styles.themeControls}>
          <button 
            className={styles.themeBtn} 
            onClick={toggleMode}
            title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {/* Removed bulb icon */}
          </button>
        </div>
        
        <div className={styles.profile} tabIndex={0}>
          {user ? (
            <>
              <button className={styles.profileBtn}>
                {user.firstName || user.username || 'User'}
              </button>
              <div className={styles.dropdown}>
                <NavLink to="/settings" className={styles.dropdownLink}>Settings</NavLink>
                <button onClick={handleLogout} className={styles.dropdownLink}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <button className={styles.profileBtn}>Guest</button>
              <div className={styles.dropdown}>
                <NavLink to="/login" className={styles.dropdownLink}>Login</NavLink>
                <NavLink to="/register" className={styles.dropdownLink}>Register</NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 