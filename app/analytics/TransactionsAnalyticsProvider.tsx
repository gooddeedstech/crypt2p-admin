// app/analytics/TransactionAnalyticsProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export interface Transaction {
  email: string;
  asset: string;
  network: string;
  amount: string;
  exchangeRate: string;
  convertedAmount: string;
  status: string;
  type: string;
  created_at: string;
  meta_data: any;
}

interface TransactionsResponse {
  total: number;
  page: string;
  limit: string;
  totalPages: number;
  data: Transaction[];
}

interface TransactionCards {
  total: number;
  successful: number;
  pending: number;
  failed: number;
  cancelled: number;
}

export interface AssetSummary {
  asset: string;
  count: number;
  totalAmount: number;
}

interface FetchParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED" | "CANCELLED";
  asset?: string;
  type?: "CRYPTO_TO_CASH" | "CASH_TO_CRYPTO";
  startDate?: string;
  endDate?: string;
}

export interface SupportedAsset {
  code: string;
  description: string;
  networks: Array<{ name: string; value: string }>;
  usdBuyPrice: number;
  usdSellPrice: number;
  ngnBuyPrice: number;
  ngnSellPrice: number;
  minBuyValue: number;
  maxBuyValue: number;
  minSellValue: number;
  maxSellValue: number;
}

interface TransactionContextType {
  transactions: Transaction[] | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  cards: TransactionCards | null;
  assetSummary: AssetSummary[] | null;
  loading: boolean;
  loadingCards: boolean;
  loadingAssets: boolean;
  error: string | null;
  refetch: (params: FetchParams) => void;
  refetchCards: () => void;
  refetchAssets: () => void;
  supportedAssets: SupportedAsset[] | null;
  loadingSupportedAssets: boolean;
  refetchSupportedAssets: () => void;
  assetDailyData: {
    assets: string[];
    days: string[];
    dataset: Array<Record<string, number> & { date: string }>;
  } | null;
  loadingAssetDaily: boolean;
  fetchAssetDaily: (
    days: number,
    type: "CRYPTO_TO_CASH" | "CASH_TO_CRYPTO"
  ) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionAnalyticsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [pagination, setPagination] =
    useState<TransactionContextType["pagination"]>(null);
  const [cards, setCards] = useState<TransactionCards | null>(null);
  const [assetSummary, setAssetSummary] = useState<AssetSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supportedAssets, setSupportedAssets] = useState<
    SupportedAsset[] | null
  >(null);
  const [loadingSupportedAssets, setLoadingSupportedAssets] = useState(true);
  const [assetDailyData, setAssetDailyData] =
    useState<TransactionContextType["assetDailyData"]>(null);
  const [loadingAssetDaily, setLoadingAssetDaily] = useState(false);

  const fetchAssetDaily = async (
    days: number,
    type: "CRYPTO_TO_CASH" | "CASH_TO_CRYPTO"
  ) => {
    setLoadingAssetDaily(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/analytics/transactions/by-asset-days`,
        {
          params: { days, type },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAssetDailyData(res.data);
    } catch (err) {
      console.error("Failed to load daily asset data:", err);
      setAssetDailyData(null);
    } finally {
      setLoadingAssetDaily(false);
    }
  };

  const fetchSupportedAssets = async () => {
    setLoadingSupportedAssets(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/analytics/assets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSupportedAssets(res.data);
    } catch (err: any) {
      console.error("Failed to load supported assets:", err);
    } finally {
      setLoadingSupportedAssets(false);
    }
  };

  const fetchRecent = async (params: FetchParams = {}) => {
    const {
      page = 1,
      limit = 10,
      status,
      asset,
      type,
      startDate,
      endDate,
    } = params;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/analytics/transactions/transactions/logs`,
        {
          params: {
            page,
            limit,
            status,
            asset,
            type,
            startDate,
            endDate,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { total, page: p, limit: l, totalPages, data } = res.data;
      setTransactions(data);
      setPagination({
        total: Number(total),
        page: Number(p),
        limit: Number(l),
        totalPages: Number(totalPages),
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/analytics/transactions/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCards(res.data);
    } catch (err: any) {
      console.error("Failed to load transaction cards:", err);
    } finally {
      setLoadingCards(false);
    }
  };

  const fetchAssetSummary = async () => {
    setLoadingAssets(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/analytics/transactions/transactions/summary-by-asset`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAssetSummary(res.data);
    } catch (err: any) {
      console.error("Failed to load asset summary:", err);
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    fetchCards();
    fetchAssetSummary();
    fetchSupportedAssets();
    fetchAssetDaily(7, "CRYPTO_TO_CASH");
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        pagination,
        cards,
        assetSummary,
        loading,
        loadingCards,
        loadingAssets,
        error,
        refetch: fetchRecent,
        refetchCards: fetchCards,
        refetchAssets: fetchAssetSummary,
        supportedAssets,
        loadingSupportedAssets,
        refetchSupportedAssets: fetchSupportedAssets,
        assetDailyData,
        loadingAssetDaily,
        fetchAssetDaily,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactionAnalytics = () => {
  const context = useContext(TransactionContext);
  if (!context)
    throw new Error(
      "useTransactionAnalytics must be used within TransactionAnalyticsProvider"
    );
  return context;
};
