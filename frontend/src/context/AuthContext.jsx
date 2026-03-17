import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = async (username, password) => {

    // CAMBIÁ ESTO POR TU USUARIO Y CONTRASEÑA
    if (username === "admin" && password === "Bermoto123!") {

      const userData = {
        username: "admin",
        role: "admin"
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };

    }

    return { success: false, error: "Usuario o contraseña incorrectos" };

  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  return useContext(AuthContext);
};
