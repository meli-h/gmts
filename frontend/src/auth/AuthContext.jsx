// frontend/src/auth/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { login as apiLogin } from '../api.js';  // :contentReference[oaicite:8]{index=8}:contentReference[oaicite:9]{index=9}

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const login = async (username, password) => {
    const data = await apiLogin({ username, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
