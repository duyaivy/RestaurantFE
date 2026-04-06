"use client";
import React, { useEffect, useState } from "react";
import { ConnectionStatus } from "@/components/chat/connection-status";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useSocket } from "@/hooks/common/useSocket";
import { useTableChat } from "@/hooks/common/useTableChat";
import { useChatStore } from "@/hooks/stores/useChatStore";
import { decodeToken, getAccessTokenFromLocalStorage } from "@/lib/utils";
import { Role } from "@/constants/type";
// ─── Staff-only table selector ────────────────────────────────────────────────
interface TableSelectorProps {
  onSelect: (tableNumber: number) => void;
  tableNumber: number | null;
}
function TableSelector({ onSelect, tableNumber }: TableSelectorProps) {
  const [tableInput, setTableInput] = useState("");
  const handleSelect = () => {
    const num = parseInt(tableInput, 10);
    if (!Number.isFinite(num) || num < 1) return;
    onSelect(num);
  };

  useEffect(() => {
    if (typeof tableNumber === "number") {
      setTableInput(String(tableNumber));
    }
  }, [tableNumber]);

  return (
    <div style={styles.tableSelector}>
      <p style={styles.tableSelectorLabel}>Select a table to send chat:</p>
      <div style={styles.tableSelectorRow}>
        <input
          id="chat-table-number"
          type="number"
          min={1}
          value={tableInput}
          onChange={(e) => setTableInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSelect()}
          placeholder="Table #"
          style={styles.tableInput}
          aria-label="Table number"
        />
        <button
          id="chat-select-table-btn"
          type="button"
          onClick={handleSelect}
          disabled={!tableInput}
          style={{
            ...styles.joinButton,
            opacity: !tableInput ? 0.5 : 1,
          }}
        >
          Select
        </button>
      </div>
    </div>
  );
}
// ─── Main panel ───────────────────────────────────────────────────────────────
export interface ChatPanelProps {
  /** Controls whether the panel is visible (managed by parent — e.g. a floating button) */
  isOpen?: boolean;
  onClose?: () => void;
  /** Pre-select a table number (useful when embedding in a table-detail page) */
  defaultTableNumber?: number;
}
export function ChatPanel({
  isOpen = true,
  onClose,
  defaultTableNumber,
}: ChatPanelProps) {
  const { isConnected, lastError } = useSocket();
  const { sendMessage } = useTableChat();
  const { messages, errors } = useChatStore();
  const [targetTableNumber, setTargetTableNumber] = useState<number | null>(
    defaultTableNumber ?? null,
  );
  // Derive role once (no re-render needed; token doesn't change during session)
  const userRole = (() => {
    try {
      const token = getAccessTokenFromLocalStorage();
      return token ? (decodeToken(token)?.role ?? null) : null;
    } catch {
      return null;
    }
  })();
  const isStaff = userRole === Role.Admin || userRole === Role.Employee;
  const canChat =
    isConnected && (!isStaff || typeof targetTableNumber === "number");

  useEffect(() => {
    if (typeof defaultTableNumber === "number") {
      setTargetTableNumber(defaultTableNumber);
    }
  }, [defaultTableNumber]);

  const handleSend = (message: string) => {
    if (!isStaff) {
      sendMessage(message);
    } else {
      if (typeof targetTableNumber !== "number") return;
      sendMessage(message, targetTableNumber);
    }
  };
  if (!isOpen) return null;
  return (
    <div
      style={styles.panel}
      role="dialog"
      aria-label="Table chat"
      aria-modal="true"
    >
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.title}>Table Chat</span>
          <ConnectionStatus />
        </div>
        {onClose && (
          <button
            id="chat-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            style={styles.closeButton}
          >
            ✕
          </button>
        )}
      </div>
      {/* ── Connection error banner ── */}
      {lastError && !isConnected && (
        <div style={styles.errorBanner}>⚠ {lastError}</div>
      )}
      {/* ── Table selector (staff only) ── */}
      {isStaff && (
        <TableSelector
          onSelect={setTargetTableNumber}
          tableNumber={targetTableNumber}
        />
      )}
      {/* ── Messages ── */}
      <div style={styles.messages}>
        <MessageList messages={messages} />
      </div>
      {/* ── Inline chat errors ── */}
      {errors.length > 0 && (
        <div style={styles.chatErrors}>
          {errors.slice(-3).map((err, i) => (
            <div key={i} style={styles.chatError}>
              {err}
            </div>
          ))}
        </div>
      )}
      {/* ── Input ── */}
      <ChatInput
        onSend={handleSend}
        disabled={!canChat}
        placeholder={
          !isConnected
            ? "Connecting to server…"
            : isStaff && typeof targetTableNumber !== "number"
              ? "Select a table to start chatting"
              : "Type a message…"
        }
      />
    </div>
  );
}
// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: "flex",
    flexDirection: "column",
    width: "360px",
    height: "560px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#ffffff",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  title: {
    fontWeight: 700,
    fontSize: "15px",
    letterSpacing: "-0.01em",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.8)",
    fontSize: "16px",
    cursor: "pointer",
    padding: "4px 6px",
    borderRadius: "6px",
    lineHeight: 1,
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "12px",
    padding: "8px 16px",
    borderBottom: "1px solid #fecaca",
  },
  tableSelector: {
    padding: "16px",
    borderBottom: "1px solid #f3f4f6",
    backgroundColor: "#f9fafb",
  },
  tableSelectorLabel: {
    margin: "0 0 10px",
    fontSize: "13px",
    color: "#374151",
  },
  tableSelectorRow: {
    display: "flex",
    gap: "8px",
  },
  tableInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  joinButton: {
    padding: "8px 16px",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatErrors: {
    padding: "0 16px 8px",
  },
  chatError: {
    fontSize: "12px",
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "6px 10px",
    marginBottom: "4px",
  },
};
