import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); 
  const [user, setUser] = useState(null);

  const login = (email, password, mockRole = 'employee') => {
    // In a real app, this validates credentials against a backend
    setIsAuthenticated(true);
    setRole(mockRole);
    
    if (mockRole === 'admin') setUser({ name: 'System Admin', email: email || 'admin@company.com' });
    else if (mockRole === 'manager') setUser({ name: 'Sarah Rogers', email: email || 'sarah.manager@company.com' });
    else setUser({ name: 'John Employee', email: email || 'john.employee@company.com', balance: 0 });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  // Useful for live judging: switch roles without re-authenticating
  const switchRole = (newRole) => {
    login(user?.email || '', '', newRole);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
