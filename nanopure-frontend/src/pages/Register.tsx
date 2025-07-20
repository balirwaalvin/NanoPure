import React, { useState } from 'react';
import styles from './Register.module.css';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import WelcomeMessage from '../components/WelcomeMessage';
import ugandaFlag from '../assets/uganda-flag.jpeg';
import { useUser } from '../components/UserContext';
import FlowerAnimation from '../components/FlowerAnimation';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('viewer');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password || !confirm || !firstName || !lastName) {
      setError('All fields except phone are required.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      console.log('Attempting registration...');
      const res = await registerUser(
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        phone || undefined
      );
      console.log('Registration response:', res);
      
      // Check if we have the expected data structure
      if (!res.data || !res.data.data || !res.data.data.user || !res.data.data.token) {
        console.error('Invalid response structure:', res);
        setError('Invalid response from server');
        return;
      }
      
      const user = res.data.data.user;
      const token = res.data.data.token;
      
      console.log('Setting user:', user);
      console.log('Setting token:', token);
      
      // Save user info globally
      setUser(user);
      
      // Save token for API calls
      localStorage.setItem('token', token);
      
      // Set user name for welcome message
      const displayName = user?.firstName || user?.username || user?.email || undefined;
      setUserName(displayName);
      
      console.log('Showing welcome animation...');
      setShowWelcome(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeFinish = () => {
    console.log('Welcome animation finished, navigating to dashboard...');
    navigate('/dashboard');
  };

  if (showWelcome) {
    return <FlowerAnimation onFinish={handleWelcomeFinish} />;
  }

  return (
    <div className={styles.registerBg}>
      {showWelcome && <WelcomeMessage name={userName} />}
      {/* Decorative dots pattern */}
      <svg width="100%" height="100%" className={styles.dots}>
        <circle cx="40" cy="40" r="3" fill="#2563eb" />
        <circle cx="120" cy="120" r="2" fill="#facc15" />
        <circle cx="200" cy="80" r="2.5" fill="#22c55e" />
      </svg>
      <div className={styles.registerContainer}>
        <form onSubmit={handleRegister} className={styles.card}>
          <h2 className={styles.title}>Register for NanoPure</h2>
          {error && <div className={styles.error}>{error}</div>}
          {/* Uganda flag icon */}
          <img src={ugandaFlag} alt="Uganda Flag" className={styles.icon} />
          <div className={styles.form}>
            <div>
              <label className={styles.label}>Username</label>
              <input type="text" className={styles.input} value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>First Name</label>
              <input type="text" className={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>Last Name</label>
              <input type="text" className={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>Password</label>
              <input type="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>Confirm Password</label>
              <input type="password" className={styles.input} value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>Role</label>
              <select className={styles.input} value={role} onChange={e => setRole(e.target.value)}>
                <option value="viewer">Viewer</option>
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Phone (optional)</label>
              <input type="tel" className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
          <div className={styles.linkRow}>
            <a href="/login" className={styles.link}>Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 