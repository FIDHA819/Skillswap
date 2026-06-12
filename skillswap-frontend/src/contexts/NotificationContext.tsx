import React, {
  createContext, useContext, useEffect,
  useRef, useState, useCallback,
} from "react";
import api from "../infrastructure/api/axios";
import { useAuth } from "./AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Notification = {
  _id: string;
  type: "connect_request" | "connect_accepted" | "connect_declined" | "session_booked" | "general";
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  senderId: { _id: string; fullName: string; email: string } | null;
  createdAt: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchAll: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
};

// ── Context ───────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationState | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications ?? []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch {
      // fail silently — not critical
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const pollCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/notifications/unread-count");
      const newCount: number = res.data.count ?? 0;
      // If count changed, refetch full list so bell+panel are in sync
      if (newCount !== unreadCount) {
        setUnreadCount(newCount);
        fetchAll();
      }
    } catch {}
  }, [isAuthenticated, unreadCount, fetchAll]);

  // Initial load + polling every 20 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAll();
    pollRef.current = setInterval(pollCount, 20_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isAuthenticated]); // eslint-disable-line

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    await api.patch(`/notifications/${id}/read`).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await api.patch("/notifications/read-all").catch(() => {});
  };

  const deleteOne = async (id: string) => {
    const n = notifications.find((x) => x._id === id);
    setNotifications((prev) => prev.filter((x) => x._id !== id));
    if (n && !n.read) setUnreadCount((c) => Math.max(0, c - 1));
    await api.delete(`/notifications/${id}`).catch(() => {});
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, fetchAll, markRead, markAllRead, deleteOne }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};