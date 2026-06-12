import { useEffect, useRef, useState } from "react";
import { Bell, Check, Trash2, X, UserPlus, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useNotifications, type Notification } from "../../../../contexts/NotificationContext";

// ── helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  const map: Record<string, JSX.Element> = {
    connect_request:  <UserPlus   size={14} />,
    connect_accepted: <CheckCircle size={14} />,
    connect_declined: <XCircle    size={14} />,
    session_booked:   <Calendar   size={14} />,
    general:          <Bell       size={14} />,
  };
  const colors: Record<string, string> = {
    connect_request:  "rgba(99,102,241,0.15)",
    connect_accepted: "rgba(34,197,94,0.15)",
    connect_declined: "rgba(239,68,68,0.15)",
    session_booked:   "rgba(251,191,36,0.15)",
    general:          "rgba(100,116,139,0.15)",
  };
  const textColors: Record<string, string> = {
    connect_request:  "#a5b4fc",
    connect_accepted: "#4ade80",
    connect_declined: "#f87171",
    session_booked:   "#fbbf24",
    general:          "#94a3b8",
  };
  return (
    <span style={{
      width: 30, height: 30, borderRadius: "50%",
      background: colors[type] ?? colors.general,
      color: textColors[type] ?? textColors.general,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {map[type] ?? map.general}
    </span>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
  .nb-wrap { position: relative; }

  .nb-btn {
    position: relative; width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.2s;
  }
  .nb-btn:hover { background: rgba(255,255,255,0.1); color: #f8fafc; }

  .nb-badge {
    position: absolute; top: -4px; right: -4px;
    min-width: 18px; height: 18px; border-radius: 9px;
    background: #6366f1; color: #fff;
    font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px; border: 2px solid #04080f;
    animation: nbPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes nbPop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  /* dropdown */
  .nb-panel {
    position: absolute; top: calc(100% + 12px); right: 0;
    width: 360px; max-height: 520px;
    background: #0d1117; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    display: flex; flex-direction: column; overflow: hidden;
    z-index: 500;
    animation: nbSlideIn 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes nbSlideIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .nb-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .nb-head-title {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    color: #f8fafc; display: flex; align-items: center; gap: 8px;
  }
  .nb-head-count {
    font-size: 11px; font-weight: 600; padding: 2px 8px;
    border-radius: 100px; background: rgba(99,102,241,0.2);
    color: #a5b4fc;
  }
  .nb-head-actions { display: flex; align-items: center; gap: 6px; }
  .nb-text-btn {
    font-size: 12px; color: #60a5fa; background: none; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    padding: 4px 8px; border-radius: 6px; transition: background 0.2s;
  }
  .nb-text-btn:hover { background: rgba(96,165,250,0.1); }
  .nb-icon-btn {
    width: 28px; height: 28px; border-radius: 50%;
    background: none; border: none; cursor: pointer; color: #64748b;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .nb-icon-btn:hover { background: rgba(255,255,255,0.08); color: #f8fafc; }

  /* list */
  .nb-list { flex: 1; overflow-y: auto; }
  .nb-list::-webkit-scrollbar { width: 3px; }
  .nb-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

  .nb-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 18px; cursor: pointer;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s; position: relative;
  }
  .nb-item:hover { background: rgba(255,255,255,0.03); }
  .nb-item--unread { background: rgba(99,102,241,0.04); }
  .nb-item--unread:hover { background: rgba(99,102,241,0.08); }

  .nb-dot {
    position: absolute; top: 18px; right: 16px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #6366f1;
  }

  .nb-item-body { flex: 1; min-width: 0; }
  .nb-item-title {
    font-size: 13px; font-weight: 600; color: #e2e8f0;
    font-family: 'DM Sans', sans-serif; margin-bottom: 2px;
  }
  .nb-item-msg {
    font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif;
    line-height: 1.4; margin-bottom: 4px;
  }
  .nb-item-time {
    font-size: 11px; color: #334155; font-family: 'DM Sans', sans-serif;
  }

  .nb-item-del {
    opacity: 0; transition: opacity 0.2s;
    background: none; border: none; cursor: pointer; color: #475569;
    padding: 2px; border-radius: 4px; flex-shrink: 0;
  }
  .nb-item:hover .nb-item-del { opacity: 1; }
  .nb-item-del:hover { color: #f87171; }

  /* empty */
  .nb-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 8px; padding: 48px 20px;
    color: #334155; font-family: 'DM Sans', sans-serif; font-size: 13px;
    text-align: center;
  }

  @media (max-width: 480px) {
    .nb-panel { width: calc(100vw - 32px); right: -8px; }
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, deleteOne } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleItemClick = (n: Notification) => {
    if (!n.read) markRead(n._id);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="nb-wrap" ref={ref}>
        <button
          className="nb-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="nb-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="nb-panel">
            <div className="nb-head">
              <div className="nb-head-title">
                Notifications
                {unreadCount > 0 && (
                  <span className="nb-head-count">{unreadCount} new</span>
                )}
              </div>
              <div className="nb-head-actions">
                {unreadCount > 0 && (
                  <button className="nb-text-btn" onClick={markAllRead}>
                    <Check size={11} style={{ display: "inline", marginRight: 3 }} />
                    Mark all read
                  </button>
                )}
                <button className="nb-icon-btn" onClick={() => setOpen(false)}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="nb-list">
              {notifications.length === 0 ? (
                <div className="nb-empty">
                  <Bell size={28} />
                  <div>You're all caught up</div>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`nb-item${!n.read ? " nb-item--unread" : ""}`}
                    onClick={() => handleItemClick(n)}
                  >
                    <NotifIcon type={n.type} />
                    <div className="nb-item-body">
                      <div className="nb-item-title">{n.title}</div>
                      <div className="nb-item-msg">{n.message}</div>
                      <div className="nb-item-time">{timeAgo(n.createdAt)}</div>
                    </div>
                    {!n.read && <span className="nb-dot" />}
                    <button
                      className="nb-item-del"
                      onClick={(e) => { e.stopPropagation(); deleteOne(n._id); }}
                      title="Dismiss"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}