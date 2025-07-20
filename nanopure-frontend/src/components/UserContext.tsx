import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Preferences {
  language?: string;
  theme?: string;
  fontSize?: string;
  notifications?: boolean;
  timezone?: string;
  aiEnabled?: boolean;
  aiLevel?: string;
  override?: string;
  // Add more as needed
}

interface User {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  preferences?: Preferences;
  // Add other user fields as needed
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const setUserAndStore = (user: User | null) => {
    console.log('UserContext: Setting user:', user);
    setUser(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('UserContext: User saved to localStorage');
    } else {
      localStorage.removeItem('user');
      console.log('UserContext: User removed from localStorage');
    }
  };

  const logout = () => {
    setUserAndStore(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserAndStore, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 