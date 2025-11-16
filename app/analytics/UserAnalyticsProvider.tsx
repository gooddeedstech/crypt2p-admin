// app/analytics/UserAnalyticsProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface UserTrend {
  date: string;
  count: number;
}

export interface TopActiveUser {
  user: string | null;
  transactionCount: number;
}
export interface TopVolumeUser {
  user: string | null;
  totalAmount: number;
}

interface UserAnalyticsContextType {
  trends: UserTrend[] | null;
  topActive: TopActiveUser[] | null;
  topVolume: TopVolumeUser[] | null;
  loading: boolean;
  loadingTop: boolean;
  error: string | null;
  refetch: (days: number) => void;
  refetchTop: () => void;
  users: User[] | null;
  usersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loadingUsers: boolean;
  fetchUsers: (params?: FetchUsersParams) => void;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  rewardPoint: string;
  kycLevel: number;
  isDisabled: boolean;
  dateCreated: string;
  wallets: any[];
  bankAccounts: any[];
  transactions: any[];
  loginLogs: any[];
}

interface UsersResponse {
  page: string;
  limit: string;
  total: number;
  totalPages: number;
  data: User[];
}

interface FetchUsersParams {
  page?: number;
  limit?: number;
  sort?: "createdAt" | "lastLoginAt";
  order?: "ASC" | "DESC";
  search?: string;
  kycLevel?: 0 | 1 | 2;
  isDisabled?: boolean;
  isDeleted?: boolean;
  bvnStatus?: "pending" | "verified" | "failed";
}

const UserAnalyticsContext = createContext<
  UserAnalyticsContextType | undefined
>(undefined);

export function UserAnalyticsProvider({ children }: { children: ReactNode }) {
  const [trends, setTrends] = useState<UserTrend[] | null>(null);
  const [topActive, setTopActive] = useState<TopActiveUser[] | null>(null);
  const [topVolume, setTopVolume] = useState<TopVolumeUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [usersPagination, setUsersPagination] =
    useState<UserAnalyticsContextType["usersPagination"]>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async (params: FetchUsersParams = {}) => {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
      search,
      kycLevel,
      isDisabled,
      isDeleted,
      bvnStatus,
    } = params;

    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/users`,
        {
          params: {
            page,
            limit,
            sort,
            order,
            search,
            kycLevel,
            isDisabled,
            isDeleted,
            bvnStatus,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { page: p, limit: l, total, totalPages, data } = res.data;
      setUsers(data);
      setUsersPagination({
        page: Number(p),
        limit: Number(l),
        total,
        totalPages,
      });
    } catch (err: any) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTrends = async (days: number = 90) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/analytics/users/trend`,
        {
          params: { days },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrends(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load user trends");
    } finally {
      setLoading(false);
    }
  };

  const fetchTop = async () => {
    setLoadingTop(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const [activeRes, volumeRes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/analytics/users/top-active`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/analytics/users/top-volume`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      setTopActive(activeRes.data);
      setTopVolume(volumeRes.data);
    } catch (err: any) {
      console.error("Failed to load top users:", err);
    } finally {
      setLoadingTop(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTrends();
    fetchTop();
  }, []);

  return (
    <UserAnalyticsContext.Provider
      value={{
        users,
        usersPagination,
        loadingUsers,
        trends,
        topActive,
        topVolume,
        loading,
        loadingTop,
        error,
        fetchUsers,
        refetch: fetchTrends,
        refetchTop: fetchTop,
      }}
    >
      {children}
    </UserAnalyticsContext.Provider>
  );
}

export const useUserAnalytics = () => {
  const context = useContext(UserAnalyticsContext);
  if (!context)
    throw new Error(
      "useUserAnalytics must be used within UserAnalyticsProvider"
    );
  return context;
};
