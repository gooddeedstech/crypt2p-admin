// app/dashboard/Provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  deletedAccounts: number;
  registeredToday: number;
  registeredThisMonth: number;
  registeredThisYear: number;
  changes: Changes;
}

interface ChangeEntry {
  value: number;
  direction: "up" | "down" | "neutral";
}

interface Changes {
  registeredToday: ChangeEntry;
  registeredThisMonth: ChangeEntry;
  registeredThisYear: ChangeEntry;
  totalUsers: ChangeEntry;
  activeUsers: ChangeEntry;
}

interface DashboardContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/analytics/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.summary);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};
