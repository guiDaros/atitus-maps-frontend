import React, { createContext, useContext, useState, useEffect } from "react";

// Criação do contexto
const AuthContext = createContext();

// Hook para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provider do contexto
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    // Busca token do localStorage ao iniciar
    return localStorage.getItem("token") || null;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || null;
  });

  // tenta derivar nome a partir do JWT (campo email) se não houver userName salvo
  function deriveNameFromToken(tkn) {
    try {
      const part = tkn.split('.')[1];
      const padded = part.replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(padded));
      const email = json.email || json.username;
      if (email) {
        const namePart = email.split('@')[0];
        const first = namePart.split(/[._]/)[0];
        return first.charAt(0).toUpperCase() + first.slice(1);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // Salva no localStorage sempre que token mudar
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // se não tivermos userName, tente derivar do token
      if (!localStorage.getItem("userName")) {
        const derived = deriveNameFromToken(token);
        if (derived) {
          setUserName(derived);
        }
      }
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // persiste userName
  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  // Função para login
  function login(newToken) {
    setToken(newToken);
    // tenta derivar nome imediatamente se não temos
    if (!localStorage.getItem("userName")) {
      const derived = deriveNameFromToken(newToken);
      if (derived) setUserName(derived);
    }
  }

  // Função para logout
  function logout() {
    setToken(null);
    setUserName(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
}