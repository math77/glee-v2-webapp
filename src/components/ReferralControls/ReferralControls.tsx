"use client";

import { useEffect, useState } from "react";
import { type Address } from "viem";

interface ReferralControlsProps {
  address: Address | undefined;
}

interface ProcessResult {
  attributed: boolean;
  minterPoints: number;
  referrerPoints: number;
}

// Reads a referral code from the ?ref= query param on first load and persists it in
// localStorage so it survives wallet-connection redirects.
export default function ReferralControls({ address }: ReferralControlsProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("ref");
    if (codeFromUrl) {
      const normalized = codeFromUrl.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, "").slice(0, 6);
      if (normalized.length === 6) {
        window.localStorage.setItem("glee:referralCode", normalized);
        setReferralCode(normalized);
      }
    } else {
      const stored = window.localStorage.getItem("glee:referralCode");
      if (stored) setReferralCode(stored);
    }
  }, []);

  if (!referralCode || !address) return null;

  return (
    <p className="mt-3 text-xs text-[var(--foreground-muted)]">
      Referral code <span className="font-[family-name:var(--font-geist-mono)] text-[var(--accent)]">{referralCode}</span> applied.
    </p>
  );
}

// Called by MintCanvas after a confirmed mint to process referral points server-side.
export async function processConfirmedReferralMint(address: Address, hash: `0x${string}`): Promise<ProcessResult> {
  const referralCode = typeof window !== "undefined" ? window.localStorage.getItem("glee:referralCode") : null;
  try {
    const res = await fetch("/api/referrals/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minterAddress: address, transactionHash: hash, referralCode }),
    });
    const data = await res.json() as ProcessResult;
    if (data.attributed && referralCode) {
      window.localStorage.removeItem("glee:referralCode");
    }
    return data;
  } catch {
    return { attributed: false, minterPoints: 0, referrerPoints: 0 };
  }
}