import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { UserProvider, useUser } from './components/UserContext';
// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const location = useLocation();
  console.log('PrivateRoute: user =', user, 'location =', location.pathname);
  if (!user) {
    console.log('PrivateRoute: No user, redirecting to login');
    // Redirect unauthenticated users to login, preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log('PrivateRoute: User authenticated, rendering children');
  return <>{children}</>;
};

// AuthRoute component to redirect authenticated users away from login/register
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  console.log('AuthRoute: user =', user);
  if (user) {
    console.log('AuthRoute: User authenticated, redirecting to dashboard');
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  console.log('AuthRoute: No user, rendering children');
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { mode } = useTheme();
  return (
    <div>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth routes - redirect authenticated users */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            {/* Fallback: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <UserProvider>
    <Router>
      <AppContent />
    </Router>
    </UserProvider>
  </ThemeProvider>
);

export default App;
