import { useState, useRef, useEffect } from "react"
import { Send, Video, MoreHorizontal } from "lucide-react"
import { TdAvatar } from "../../../../shared/utils/UI"
import type { ChatThread, ChatMessage } from "../../../../domain/entities/teacher"

interface Props {
  threads: ChatThread[]
  defaultStudentId?: number
  onUpdateThreads: (t: ChatThread[]) => void
}

export default function ChatPanel({ threads, defaultStudentId, onUpdateThreads }: Props) {
  const [activeId, setActiveId] = useState<number>(
    defaultStudentId ?? threads[0]?.studentId ?? 0
  )
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  const active = threads.find(t => t.studentId === activeId)

  // Mark as read on open
  useEffect(() => {
    onUpdateThreads(
      threads.map(t =>
        t.studentId === activeId ? { ...t, unread: 0 } : t
      )
    )
    inputRef.current?.focus()
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [active?.messages.length])

  const send = () => {
    const text = input.trim()
    if (!text || !active) return
    const msg: ChatMessage = {
      id: Date.now(),
      from: "teacher",
      text,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    }
    onUpdateThreads(
      threads.map(t =>
        t.studentId === activeId
          ? { ...t, messages: [...t.messages, msg] }
          : t
      )
    )
    setInput("")
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="td-chat-root">
      {/* Thread list */}
      <aside className="td-chat-list">
        <div className="td-chat-list-head">Messages</div>
        {threads.map(t => {
          const last = t.messages[t.messages.length - 1]
          return (
            <button
              key={t.studentId}
              className={`td-thread${activeId === t.studentId ? " active" : ""}`}
              onClick={() => setActiveId(t.studentId)}
            >
              <div className="td-thread-av-wrap">
                <TdAvatar initials={t.initials} color={t.color} size="md" />
                {t.unread > 0 && (
                  <span className="td-thread-unread">{t.unread}</span>
                )}
              </div>
              <div className="td-thread-body">
                <div className="td-thread-top">
                  <span className="td-thread-name">{t.name}</span>
                  {last && <span className="td-thread-time">{last.time}</span>}
                </div>
                <span className="td-thread-preview">
                  {last ? last.text.slice(0, 40) + (last.text.length > 40 ? "…" : "") : "—"}
                </span>
              </div>
            </button>
          )
        })}
      </aside>

      {/* Chat area */}
      {active ? (
        <div className="td-chat-area">
          {/* Header */}
          <div className="td-chat-header">
            <TdAvatar initials={active.initials} color={active.color} size="sm" />
            <div className="td-chat-hinfo">
              <span className="td-chat-hname">{active.name}</span>
              <span className="td-chat-hskill">{active.skill}</span>
            </div>
            <div className="td-chat-hactions">
              <button
                className="td-icon-btn"
                title="Start Google Meet"
                onClick={() => window.open("https://meet.google.com/new", "_blank")}
              >
                <Video size={15} />
              </button>
              <button className="td-icon-btn" title="More"><MoreHorizontal size={15} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="td-chat-msgs">
            {active.messages.map(m => (
              <div key={m.id} className={`td-msg-row${m.from === "teacher" ? " mine" : ""}`}>
                {m.from === "student" && (
                  <TdAvatar initials={active.initials} color={active.color} size="sm" />
                )}
                <div className={`td-bubble${m.from === "teacher" ? " mine" : ""}`}>
                  {m.text}
                  <span className="td-bubble-time">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="td-chat-input-row">
            <input
              ref={inputRef}
              className="td-chat-input"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
            />
            <button
              className="td-send-btn"
              onClick={send}
              disabled={!input.trim()}
              aria-label="Send"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="td-chat-empty">Select a conversation to start chatting</div>
      )}
    </div>
  )
}