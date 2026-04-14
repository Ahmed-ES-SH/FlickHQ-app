"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import authClient from "../_helpers/authClient";
import { API_ENDPOINTS } from "../constants/apis";
import { AuthContextType, User } from "../types/ContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const savedToken = Cookies.get("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authClient.get(API_ENDPOINTS.AUTH.currentUser);
      setUser(response.data.user);
      setToken(savedToken);
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await authClient.post(
        API_ENDPOINTS.AUTH.login,
        credentials,
      );
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      Cookies.set("token", token, { expires: 7 }); // Save token for 7 days

      toast.success("Welcome back!");
      router.push("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authClient.post(
        API_ENDPOINTS.AUTH.register,
        userData,
      );
      toast.success(
        "Account created successfully! Please check your email for verification.",
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    toast.info("Signed out successfully");
    router.push("/signin");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
