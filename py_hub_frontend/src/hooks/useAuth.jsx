import { useEffect, useState, useContext, createContext } from "react";
import api from "@api/axiox";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    user: null,
  });

  async function refreshAuth() {
    try {
      const response = await api.get("auth/me");
      setAuth({
        loading: false,
        authenticated: true,
        user: response.data.user,
      });
    } catch (error) {
      console.error("error ", error);

      setAuth({ loading: false, authenticated: false, user: null });
    }
  }

  async function login(credentials) {
    await api.post("auth/login", credentials);
    await refreshAuth();
  }

  async function logout() {
    await api.post("auth/logout");
    setAuth({ loading: false, authenticated: false, user: null });
    await refreshAuth();
  }

  useEffect(() => {
    // Correct pattern for async calls inside useEffect
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
