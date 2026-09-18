"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletButton from "../WalletButton/WalletButton";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between border border-[var(--border-hairline)] bg-black/70 px-4 py-3 backdrop-blur-md sm:px-5">
        <Link href="/" className="font-[family-name:var(--font-fraunces)] text-2xl italic tracking-tight text-[var(--foreground)] sm:text-3xl">
          Glee<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {link.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-[var(--accent)] transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <WalletButton iconVersion={false} shape="" backgroundColor="quiet-button quiet-button--filled" paddingX="px-4" />
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center border border-[var(--border-hairline-strong)] text-[var(--foreground)] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mx-auto overflow-hidden border-x border-b border-[var(--border-hairline)] bg-black/90 backdrop-blur-md md:hidden"
          >
            <div className="max-w-6xl p-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-[var(--border-hairline)] px-3 py-3 text-lg text-[var(--foreground)] last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 pt-3">
                <WalletButton iconVersion={false} shape="" backgroundColor="quiet-button quiet-button--filled" paddingX="px-4" />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}