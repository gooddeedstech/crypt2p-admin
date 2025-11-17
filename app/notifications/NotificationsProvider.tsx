// app/notifications/NotificationsProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

export interface NotificationTemplate {
  id: number;
  title: string;
  body: string;
}

export interface SentNotification {
  id: string;
  title: string;
  message: string;
  totalRecipients: number;
  channel: "IN_APP" | "PUSH" | "EMAIL" | "ALL";
  createdAt: string;
  data: any;
}

interface SentNotificationsResponse {
  total: number;
  page: number;
  limit: number;
  data: SentNotification[];
}

interface NotificationsContextType {
  templates: NotificationTemplate[];
  selected: NotificationTemplate | null;
  selectTemplate: (t: NotificationTemplate) => void;
  send: (payload: {
    title: string;
    message: string;
    channel: string;
  }) => Promise<void>;
  sent: SentNotification[] | null;
  sentPagination: { total: number; page: number; limit: number } | null;
  loading: boolean;
  loadingSent: boolean;
  error: string | null;
  fetchSent: (page?: number, limit?: number) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

const TEMPLATES: NotificationTemplate[] = [
  {
    id: 1,
    title: "🔔SOL/NGN Now Live!",
    body: "SOL now live! Swap SOL ↔ NGN instantly. Tap to trade.",
  },
  {
    id: 2,
    title: "⚙️System Maintenance",
    body: "Scheduled maintenance: 2:00–2:30 AM WAT. Trading paused.",
  },
  {
    id: 3,
    title: "💱NGN Rates Updated",
    body: "New NGN rates live! BTC @ ₦95M, USDT @ ₦1,650.",
  },
  {
    id: 4,
    title: "🎉ZERO Fees Weekend",
    body: "ZERO fees this weekend! Swap any crypto ↔ NGN free.",
  },
  {
    id: 5,
    title: "💸₦500 Cashout Bonus",
    body: "Get ₦500 bonus when you cash out ₦50,000+ today!",
  },
  {
    id: 6,
    title: "👥Invite & Earn",
    body: "Invite 3 friends, get ₦2,000 each!",
  },
  {
    id: 7,
    title: "🏦NGN Transfer Delay",
    body: "Bank transfers delayed (CBN). Expect 1–2 hr delay.",
  },
  {
    id: 8,
    title: "📢CBN Update",
    body: "CBN Update: All NGN swaps now require BVN.",
  },
  {
    id: 9,
    title: "📊Tax Season Reminder",
    body: "2025 Tax Season: Download your swap history.",
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<NotificationTemplate | null>(null);
  const [sent, setSent] = useState<SentNotification[] | null>(null);
  const [sentPagination, setSentPagination] =
    useState<NotificationsContextType["sentPagination"]>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSent, setLoadingSent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectTemplate = (t: NotificationTemplate) => {
    setSelected(t);
    setError(null);
  };

  const send = async (payload: {
    title: string;
    message: string;
    channel: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/notifications/send`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSent = async (page = 1, limit = 10) => {
    setLoadingSent(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/notifications/sent`,
        {
          params: { page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { total, page: p, limit: l, data } = res.data;
      setSent(data);
      setSentPagination({ total, page: Number(p), limit: Number(l) });
    } catch (err: any) {
      console.error("Failed to load sent notifications:", err);
    } finally {
      setLoadingSent(false);
    }
  };

  useEffect(() => {
    fetchSent();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        templates: TEMPLATES,
        selected,
        selectTemplate,
        send,
        sent,
        sentPagination,
        loading,
        loadingSent,
        error,
        fetchSent,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return context;
};
