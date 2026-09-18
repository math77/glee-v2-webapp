"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";

export type ToastVariant = "success" | "error" | "info";

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  href?: string;
  hrefLabel?: string;
  duration?: number;
}

export interface ActivityEntry {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  href?: string;
  hrefLabel?: string;
  address?: string;
  createdAt: number;
}

interface ToastContextValue {
  pushToast: (input: ToastInput) => void;
  history: ActivityEntry[];
  clearHistory: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const MAX_HISTORY = 30;
const DEFAULT_DURATION = 5000;

function getStorageKey(address?: string) {
  return address ? `glee:activity:${address.toLowerCase()}` : null;
}

function loadHistory(address?: string): ActivityEntry[] {
  const key = getStorageKey(address);
  if (!key || typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ActivityEntry[]) : [];
  } catch { return []; }
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const [toasts, setToasts] = useState<ActivityEntry[]>([]);
  const [history, setHistory] = useState<ActivityEntry[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => { setHistory(loadHistory(address)); }, [address]);

  useEffect(() => {
    const active = timers.current;
    return () => { active.forEach((t) => clearTimeout(t)); active.clear(); };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((c) => c.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const pushToast = useCallback((input: ToastInput) => {
    const entry: ActivityEntry = {
      id: createId(),
      title: input.title,
      description: input.description,
      variant: input.variant ?? "info",
      href: input.href,
      hrefLabel: input.hrefLabel,
      address,
      createdAt: Date.now(),
    };
    setToasts((c) => [...c, entry]);
    setHistory((c) => {
      const next = [entry, ...c].slice(0, MAX_HISTORY);
      const key = getStorageKey(address);
      if (key) { try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* private browsing */ } }
      return next;
    });
    const timeout = setTimeout(() => dismiss(entry.id), input.duration ?? DEFAULT_DURATION);
    timers.current.set(entry.id, timeout);
  }, [dismiss, address]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    const key = getStorageKey(address);
    if (key) { try { window.localStorage.removeItem(key); } catch { /* ignore */ } }
  }, [address]);

  return (
    <ToastContext.Provider value={{ pushToast, history, clearHistory }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-end gap-2 p-4 sm:p-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-xs overflow-hidden border border-[var(--border-hairline-strong)] bg-[var(--background-2)]"
              style={{
                borderLeftWidth: 2,
                borderLeftColor: toast.variant === "error" ? "#c17a72" : toast.variant === "success" ? "var(--accent)" : "var(--border-hairline-strong)",
              }}
            >
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-sm text-[var(--foreground)]">{toast.title}</p>
                  {toast.description && <p className="mt-1 text-xs leading-relaxed text-[var(--foreground-muted)]">{toast.description}</p>}
                  {toast.href && (
                    <a href={toast.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-[var(--accent)] underline underline-offset-2">
                      {toast.hrefLabel ?? "View details"}
                    </a>
                  )}
                </div>
                <button onClick={() => dismiss(toast.id)} aria-label="Dismiss" className="shrink-0 text-lg leading-none text-[var(--foreground-muted)] hover:text-[var(--foreground)]">×</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}