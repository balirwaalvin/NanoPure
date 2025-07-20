import React, { useState } from 'react';
import styles from './Login.module.css';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import WelcomeMessage from '../components/WelcomeMessage';
import { useUser } from '../components/UserContext';
import FlowerAnimation from '../components/FlowerAnimation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      console.log('Attempting login...');
      const res = await loginUser(email, password);
      console.log('Login response:', res);
      
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
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
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
    <div className={styles.loginBg}>
      {showWelcome && <WelcomeMessage name={userName} />}
      {/* Water Ripple SVG at bottom */}
      <svg viewBox="0 0 1440 120" className={styles.ripple}>
        <path fill="#3b82f6" fillOpacity="0.3" d="M0,80L48,74.7C96,69,192,59,288,64C384,69,480,91,576,96C672,101,768,91,864,80C960,69,1056,59,1152,69.3C1248,80,1344,112,1392,128L1440,144L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>
      <div className={styles.contentWrapper}>
        <form onSubmit={handleLogin} className={styles.card}>
          {/* Water droplet icon */}
          <img src="/assets/water-drop.avif" alt="Water Drop" className={styles.icon} />
          <h2 className={styles.title}>Login to NanoPure</h2>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.form}>
            <div>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className={styles.label}>Password</label>
              <input type="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className={styles.rememberRow}>
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className={styles.checkbox} />
              <label htmlFor="remember" className={styles.label}>Remember me</label>
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </div>
          <div className={styles.linksRow}>
            <a href="#" className={styles.link}>Forgot password?</a>
            <a href="/register" className={styles.link}>Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 