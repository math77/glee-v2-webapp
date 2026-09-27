"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { isAddress, type Address } from "viem";
import { usePublicClient } from "wagmi";
import Nav from "@/components/Nav/Nav";
import { GLEE_CONTRACT_ADDRESS, gleeAbi } from "@/utils/contractAbi";

type PreviewState = "idle" | "loading" | "success" | "error";

export default function TransferPreviewPage() {
  const publicClient = usePublicClient();

  const [tokenId, setTokenId] = useState("");
  const [nextOwner, setNextOwner] = useState("");
  const [svg, setSvg] = useState<string | null>(null);
  const [state, setState] = useState<PreviewState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSvg(null);
    setMessage("");

    if (!publicClient) {
      setState("error");
      setMessage("The contract connection is unavailable. Please try again.");
      return;
    }

    if (!/^\d+$/.test(tokenId.trim())) {
      setState("error");
      setMessage("Enter a valid token ID.");
      return;
    }

    const parsedTokenId = BigInt(tokenId.trim());

    if (parsedTokenId < BigInt(1)) {
      setState("error");
      setMessage("Token ID must be greater than zero.");
      return;
    }

    const trimmedOwner = nextOwner.trim();

    if (!isAddress(trimmedOwner)) {
      setState("error");
      setMessage("Enter a valid wallet address.");
      return;
    }

    setState("loading");

    try {
      const locked = await publicClient.readContract({
        address: GLEE_CONTRACT_ADDRESS,
        abi: gleeAbi,
        functionName: "isLocked",
        args: [parsedTokenId],
      });

      if (locked) {
        setState("error");
        setMessage("This GLEE is locked and will not change when transferred.");
        return;
      }

      const nextSvg = await publicClient.readContract({
        address: GLEE_CONTRACT_ADDRESS,
        abi: gleeAbi,
        functionName: "previewNewGradient",
        args: [trimmedOwner as Address, parsedTokenId],
      });

      setSvg(nextSvg as string);
      setState("success");
      setMessage("Preview generated from the next owner address.");
    } catch {
      setState("error");
      setMessage("We couldn't generate that preview. Check the token ID and try again.");
    }
  };

  return (
    <div className="site-shell min-h-screen text-[var(--foreground)]">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="eyebrow-quiet">Transfer preview</p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-fraunces)] text-5xl italic leading-[1.05] text-[var(--foreground)] sm:text-6xl">
            See what happens when a GLEE changes hands.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)]">
            A GLEE&apos;s visual is derived from its token ID and owner wallet. Enter a token and a
            potential next owner to preview the gradient it would take after a transfer.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)] lg:grid-cols-[360px_1fr]">
          <motion.section
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
            className="bg-[var(--background)] p-7 sm:p-8"
          >
            <p className="studio-label">New owner</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label htmlFor="transfer-token-id" className="studio-label">
                  Token ID
                </label>
                <input
                  id="transfer-token-id"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={tokenId}
                  onChange={(event) => setTokenId(event.target.value)}
                  placeholder="e.g. 42"
                  className="studio-input"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="transfer-next-owner" className="studio-label">
                  Wallet address
                </label>
                <input
                  id="transfer-next-owner"
                  type="text"
                  value={nextOwner}
                  onChange={(event) => setNextOwner(event.target.value)}
                  placeholder="0x…"
                  className="studio-input font-[family-name:var(--font-geist-mono)] text-xs"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="quiet-button quiet-button--filled w-full"
              >
                {state === "loading" ? "Previewing…" : "Preview"}
              </button>
            </form>

            <div className="mt-8 border-t border-[var(--border-hairline)] pt-6">
              <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
                Locked GLEEs keep their current visual through transfers. The lock is checked onchain
                before a new gradient is rendered.
              </p>
            </div>

            {message && (
              <p
                role="status"
                className={`mt-6 text-xs leading-relaxed ${
                  state === "success"
                    ? "text-[var(--accent)]"
                    : "text-[var(--foreground-muted)]"
                }`}
              >
                {message}
              </p>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.16 }}
            className="bg-[var(--background-2)] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="studio-label">Result</p>
                <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-xs text-[var(--foreground-muted)]">
                  {state === "success" && tokenId ? `GLEE #${tokenId}` : "Awaiting preview"}
                </p>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>

            <div className="mt-6 aspect-square min-h-[300px] border border-[var(--border-hairline)] bg-black">
              {svg ? (
                <div
                  className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center p-8 text-center">
                  <p className="max-w-xs font-[family-name:var(--font-fraunces)] text-xl italic text-[var(--foreground-muted)]">
                    {state === "loading" ? "Calculating the new gradient…" : "Your transfer preview will appear here."}
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-[var(--border-hairline)] px-6 py-8 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-[family-name:var(--font-fraunces)] italic text-[var(--foreground)]">
          Glee<span className="text-[var(--accent)]">.</span> onchain art
        </span>
        <div className="flex gap-5">
          <a href="https://x.com/GLEEproj" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--foreground)]">
            X
          </a>
          <a href="https://discord.gg/pgqN3repn" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--foreground)]">
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}
