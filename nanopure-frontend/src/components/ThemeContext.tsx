import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { updatePreferences } from '../services/api';
import { useUser } from './UserContext';

// Types
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
  mode: 'light', 
  toggleMode: () => {}, 
  fontSize: 'medium', 
  setFontSize: () => {} 
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light'
  );
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>(
    () => (localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | 'extra-large') || 'medium'
  );

  useEffect(() => {
    // Apply theme mode
    document.body.classList.toggle('dark-mode', mode === 'dark');
    
    // Apply font size
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-extra-large');
    document.body.classList.add(`font-size-${fontSize}`);
    
    // Save to localStorage
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('fontSize', fontSize);
    
    // Sync with backend if user is logged in
    if (user) {
      updatePreferences({ theme: mode, fontSize })
        .then(() => console.log('Preferences synced with backend'))
        .catch(error => console.error('Failed to sync preferences:', error));
    }
    
    console.log(`Theme applied: mode=${mode}, fontSize=${fontSize}`);
  }, [mode, fontSize, user]);

  // Load user preferences when user logs in
  useEffect(() => {
    if (user?.preferences) {
      if (user.preferences.theme && user.preferences.theme !== mode) {
        setMode(user.preferences.theme as 'light' | 'dark');
      }
      if (user.preferences.fontSize && user.preferences.fontSize !== fontSize) {
        setFontSize(user.preferences.fontSize as 'small' | 'medium' | 'large' | 'extra-large');
      }
    }
  }, [user]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}; 