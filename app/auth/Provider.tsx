// app/auth/Provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
  });

  // Inject token from localStorage (or cookie fallback)
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/admin/auth/login", { email, password });
      const { admin, token } = res.data;
      setUser(admin);
      localStorage.setItem("admin", JSON.stringify(admin));
      localStorage.setItem("auth_token", token);
      toast.success(`Welcome ${admin.name}`);
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("auth_token");
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters");
    }

    try {
      await api.post("/admin/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to change password";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, changePassword, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
