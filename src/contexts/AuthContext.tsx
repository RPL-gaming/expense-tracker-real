"use client";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  errorMessage: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setErrorMessage("");
      } else {
        setIsLoggedIn(false);
        setErrorMessage(data.error);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      setIsLoggedIn(false);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, errorMessage, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
