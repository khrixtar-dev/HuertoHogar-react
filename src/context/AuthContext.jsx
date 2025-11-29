import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // <-- Guarda email y rol

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const role = decoded?.roles?.[0]?.authority || null;

        setToken(savedToken);
        setUser({
          email: decoded.sub,
          role,
        });
      } catch (err) {
        console.error("Error decodificando token:", err);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      const role = decoded?.roles?.[0]?.authority || null;

      // 🔥 TEMPORAL: solo permitir ADMIN
      if (role !== "ADMIN") {
        throw new Error("Usuario no autorizado (solo ADMIN temporalmente)");
      }

      setToken(newToken);
      setUser({
        email: decoded.sub,
        role,
      });

      localStorage.setItem("authToken", newToken);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
