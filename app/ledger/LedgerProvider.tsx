// app/ledger/LedgerProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export interface LedgerEntry {
  id: string;
  user_id: string;
  type: "CR" | "DR";
  description: string;
  amount: string;
  balance: string;
  created_at: string;
}

interface LedgerResponse {
  total: number;
  page: number;
  limit: number;
  data: LedgerEntry[];
}

interface LedgerContextType {
  entries: LedgerEntry[] | null;
  pagination: { total: number; page: number; limit: number } | null;
  loading: boolean;
  error: string | null;
  fetchEntries: (params?: {
    userId?: string;
    type?: "CR" | "DR";
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => void;
  credit: (payload: {
    adminId: string;
    description: string;
    amount: number;
  }) => Promise<void>;
  loadingCredit: boolean;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LedgerEntry[] | null>(null);
  const [pagination, setPagination] =
    useState<LedgerContextType["pagination"]>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async (
    params: {
      userId?: string;
      type?: "CR" | "DR";
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const { userId, type, startDate, endDate, page = 1, limit = 20 } = params;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/ledger`,
        {
          params: { page, limit, userId, type, startDate, endDate },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { total, page: p, limit: l, data } = res.data;
      setEntries(data);
      setPagination({ total, page: Number(p), limit: Number(l) });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  const credit = async (payload: {
    adminId: string;
    description: string;
    amount: number;
  }) => {
    setLoadingCredit(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/ledger/credit`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEntries(); // Refresh table
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to credit ledger");
    } finally {
      setLoadingCredit(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <LedgerContext.Provider
      value={{
        entries,
        pagination,
        loading,
        error,
        fetchEntries,
        credit,
        loadingCredit,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (!context) throw new Error("useLedger must be used within LedgerProvider");
  return context;
};
