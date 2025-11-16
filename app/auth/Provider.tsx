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
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
    validateStatus: (status) => status >= 200 && status < 300,
    // withCredentials: true,
  });

  // Inject JWT from cookie into every request
  api.interceptors.request.use((config) => {
    const match = document.cookie.match(/(^|;) ?auth-token=([^;]*)(;|$)/);
    const token = match ? match[2] : null;
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
      console.log(res.data);
      const { admin, token } = res.data;
      setUser(admin);
      localStorage.setItem("admin", JSON.stringify(admin));
      localStorage.setItem("auth_token", token);
      toast.success(`Welcome ${res.data.admin.name}`);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("admin");
      localStorage.removeItem("auth_token");
    } catch {}
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
