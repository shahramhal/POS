/* eslint-disable react-refresh/only-export-components */
// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { loginUserWithPin, getMe } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          setLoading(true);
          const currentUser = await getMe(token);
          setUser(currentUser);
        } catch (err) {
          console.error("Failed to fetch user with stored token:", err);
          setToken(null);
          localStorage.removeItem("token");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, pin) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUserWithPin(email, pin);
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        setToken(response.access_token);
        // The useEffect will now trigger to fetch the user
        return { success: true };
      } else {
         throw new Error("Login failed, no token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or PIN.");
      return { success: false, error: err.message || "Invalid email or PIN." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};