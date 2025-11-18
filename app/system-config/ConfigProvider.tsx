// app/config/ConfigProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface SystemConfig {
  id: string;
  setting: "FEES" | "LOGIN" | "MARGIN" | "RATE";
  ngnValue: string | null;
  usdValue: string | null;
  status: "ENABLED" | "DISABLED";
  description: string;
  created_at: string;
  updated_at: string;
}

interface ConfigContextType {
  configs: SystemConfig[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateConfig: (id: string, data: Partial<SystemConfig>) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/system-config`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConfigs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load configs");
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (id: string, data: Partial<SystemConfig>) => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/system-config`,
        { configs: [{ id, ...data }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchConfigs();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <ConfigContext.Provider
      value={{ configs, loading, error, refetch: fetchConfigs, updateConfig }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};
