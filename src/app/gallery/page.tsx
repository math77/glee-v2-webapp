"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Nav from "@/components/Nav/Nav";
import { gleeAbi, GLEE_CONTRACT_ADDRESS } from "@/utils/contractAbi";
import { SITE_URL } from "@/utils/siteConfig";
import { useToast } from "@/components/Toast/ToastProvider";

const MAX_GALLERY = 200;

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

type GalleryMode = "all" | "mine";

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.256 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LockIcon({ locked }: { locked: boolean }) {
  return locked ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

// Standalone LockButton component — owns its own write/receipt lifecycle so locking one
// token doesn't block the rest of the "Mine" view from rendering or responding.
function LockButton({ tokenId, isLocked, onLocked }: { tokenId: bigint; isLocked: boolean; onLocked: (id: bigint) => void }) {
  const { pushToast } = useToast();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const processedRef = useRef(false);

  useEffect(() => {
    if (hash) processedRef.current = false;
  }, [hash]);

  useEffect(() => {
    if (!receipt.isSuccess || processedRef.current) return;
    processedRef.current = true;
    pushToast({ title: "Visual locked", description: `GLEE #${tokenId} will no longer change when transferred.`, variant: "success" });
    onLocked(tokenId);
  }, [receipt.isSuccess, tokenId, pushToast, onLocked]);

  useEffect(() => {
    if (receipt.isError || error) {
      const isAlreadyLocked = error?.message?.includes("AlreadyLocked");
      pushToast({
        title: isAlreadyLocked ? "Already locked" : "Transaction failed",
        description: isAlreadyLocked ? `GLEE #${tokenId} is already locked.` : "Check your wallet and try again.",
        variant: "error",
      });
    }
  }, [receipt.isError, error, tokenId, pushToast]);

  if (isLocked) {
    return (
      <span className="flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-[10px] text-[var(--accent)]">
        <LockIcon locked={true} /> Locked
      </span>
    );
  }

  const busy = isPending || receipt.isLoading;
  return (
    <motion.button
      whileHover={{ scale: busy ? 1 : 1.05 }}
      whileTap={{ scale: busy ? 1 : 0.95 }}
      disabled={busy}
      onClick={(e) => {
        e.stopPropagation();
        writeContract({ address: GLEE_CONTRACT_ADDRESS, abi: gleeAbi, functionName: "lock", args: [tokenId] });
      }}
      className="flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-[10px] text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-40"
      aria-label={`Lock GLEE #${tokenId}`}
    >
      <LockIcon locked={false} />
      {busy ? "Locking…" : "Lock"}
    </motion.button>
  );
}

interface GalleryPageProps { initialTokenId?: string; }

export default function GalleryPage({ initialTokenId }: GalleryPageProps) {
  const [mode, setMode] = useState<GalleryMode>("all");
  const [selectedId, setSelectedId] = useState<bigint | null>(() => {
    try { return initialTokenId ? BigInt(initialTokenId) : null; } catch { return null; }
  });
  const [copiedId, setCopiedId] = useState<bigint | null>(null);
  // Optimistically track which tokens the user just locked this session so the UI updates
  // without waiting for a full re-fetch of lockedTokensOf.
  const [justLocked, setJustLocked] = useState<Set<bigint>>(new Set());
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pushToast } = useToast();
  const { address, isConnected } = useAccount();

  const { data: totalSupply = BigInt(0), isPending: supplyLoading } = useReadContract({
    address: GLEE_CONTRACT_ADDRESS, abi: gleeAbi, functionName: "totalSupply",
  });

  // Owned token IDs
  const { data: myTokenIds = [] } = useReadContract({
    address: GLEE_CONTRACT_ADDRESS, abi: gleeAbi, functionName: "walletOfOwner",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && mode === "mine" },
  });

  // Fetch lock statuses for owned tokens in one batched call.
  // Returns bool[] in the same order as myTokenIds.
  const myIds = myTokenIds as bigint[];
  const { data: lockedStatuses = [], refetch: refetchLocked } = useReadContract({
    address: GLEE_CONTRACT_ADDRESS,
    abi: gleeAbi,
    functionName: "isLockedBatch",
    args: myIds.length > 0 ? [myIds] : undefined,
    query: { enabled: myIds.length > 0 && mode === "mine" },
  });

  const lockedSet = useMemo(() => {
    const s = new Set<bigint>();
    // lockedStatuses is bool[] aligned to myTokenIds — zip them into a set of locked IDs
    (myTokenIds as bigint[]).forEach((id, i) => {
      if ((lockedStatuses as boolean[])[i]) s.add(id);
    });
    // Optimistically include any tokens locked this session before the refetch lands
    justLocked.forEach((id) => s.add(id));
    return s;
  }, [myTokenIds, lockedStatuses, justLocked]);

  const handleTokenLocked = useCallback((tokenId: bigint) => {
    setJustLocked((prev) => new Set([...prev, tokenId]));
    void refetchLocked();
  }, [refetchLocked]);

  // All mode: sequential IDs 1..totalSupply
  const allIds = useMemo(
    () => Array.from({ length: Math.min(Number(totalSupply), MAX_GALLERY) }, (_, i) => BigInt(i + 1)),
    [totalSupply]
  );

  const displayIds = mode === "mine" ? (myTokenIds as bigint[]) : allIds;

  // Fetch SVGs
  const svgContracts = useMemo(
    () => displayIds.map((id) => ({ address: GLEE_CONTRACT_ADDRESS, abi: gleeAbi, functionName: "generateSvg" as const, args: [id] as const })),
    [displayIds]
  );
  const { data: svgResults = [], isPending: svgsLoading } = useReadContracts({ contracts: svgContracts, query: { enabled: displayIds.length > 0 } });

  const svgMap = useMemo(() => {
    const map = new Map<bigint, string>();
    displayIds.forEach((id, i) => {
      if (svgResults[i]?.status === "success") map.set(id, svgResults[i].result as string);
    });
    return map;
  }, [displayIds, svgResults]);

  const isLoading = supplyLoading || svgsLoading;

  // Share
  const handleShare = useCallback(async (tokenId: bigint) => {
    const url = `${SITE_URL}/gallery/${tokenId}`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(`Just minted GLEE #${tokenId} — a fully onchain generative artwork that evolves as it changes hands.`)}&url=${encodeURIComponent(url)}&via=GLEEproj`;
    if (navigator.share) {
      try { await navigator.share({ title: `GLEE #${tokenId}`, url }); return; }
      catch (e) { if ((e as { name?: string }).name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(tokenId);
      setTimeout(() => setCopiedId(null), 2000);
      pushToast({ title: "Link copied", description: url, variant: "success" });
    } catch {
      pushToast({ title: "Couldn't copy link", description: url, variant: "error" });
    }
    window.open(xUrl, "_blank", "noopener,noreferrer");
  }, [pushToast]);

  const closeLightbox = useCallback(() => {
    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    setSelectedId(null);
  }, []);

  useEffect(() => () => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); }, []);

  const selectedSvg = selectedId !== null ? svgMap.get(selectedId) : undefined;
  const selectedIsLocked = selectedId !== null && lockedSet.has(selectedId);
  const selectedIsOwned = selectedId !== null && (myTokenIds as bigint[]).some((id) => id === selectedId);

  return (
    <div className="site-shell min-h-screen text-[var(--foreground)]">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="eyebrow-quiet">Exhibition</p>
            <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl italic text-[var(--foreground)] sm:text-5xl">
              The collection.
            </h1>
          </div>
          <div className="flex items-center border border-[var(--border-hairline-strong)] p-1 text-xs font-[family-name:var(--font-geist-mono)]">
            <button
              onClick={() => setMode("all")}
              className={`px-4 py-2 transition-colors ${mode === "all" ? "bg-[var(--accent)] text-black" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
            >
              All
            </button>
            <button
              onClick={() => {
                if (!isConnected) { pushToast({ title: "Connect your wallet", description: "Connect to see your tokens.", variant: "info" }); return; }
                setMode("mine");
              }}
              className={`px-4 py-2 transition-colors ${mode === "mine" ? "bg-[var(--accent)] text-black" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
            >
              Mine
            </button>
          </div>
        </motion.div>

        {/* Empty / loading states */}
        {isLoading && (
          <p className="mt-20 text-center font-[family-name:var(--font-fraunces)] italic text-[var(--foreground-muted)]">
            Loading the collection…
          </p>
        )}
        {!isLoading && displayIds.length === 0 && (
          <div className="mt-20 border border-[var(--border-hairline)] p-12 text-center">
            <p className="font-[family-name:var(--font-fraunces)] text-2xl italic text-[var(--foreground)]">
              {mode === "mine" ? "You don't hold any GLEEs yet." : "No GLEEs minted yet."}
            </p>
            {mode === "mine" && (
              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                <a href="/#mint" className="text-[var(--accent)] underline underline-offset-2">Mint one</a> to get started.
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {!isLoading && displayIds.map((id) => {
            const svg = svgMap.get(id);
            const isLocked = lockedSet.has(id);
            const isMine = mode === "mine";
            return (
              <motion.div
                key={id.toString()}
                variants={cardVariants}
                className="group relative cursor-pointer border border-[var(--border-hairline)] bg-black transition-colors hover:border-[var(--border-hairline-strong)]"
                onClick={() => setSelectedId(id)}
              >
                {/* Lock badge — top-right corner, only in Mine view */}
                {isMine && isLocked && (
                  <div className="absolute right-2 top-2 z-10 flex items-center gap-1 border border-[var(--border-hairline-strong)] bg-black/80 px-1.5 py-0.5 backdrop-blur-sm">
                    <LockIcon locked={true} />
                    <span className="font-[family-name:var(--font-geist-mono)] text-[9px] text-[var(--accent)]">Locked</span>
                  </div>
                )}

                <div className="aspect-square">
                  {svg
                    ? <div className="h-full w-full [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
                    : <div className="h-full w-full animate-pulse bg-[var(--background-2)]" />
                  }
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border-hairline)] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[var(--foreground-muted)]">
                      #{id.toString()}
                    </span>
                    {/* Lock button — only in Mine view, only when not already locked */}
                    {isMine && (
                      <LockButton
                        tokenId={id}
                        isLocked={isLocked}
                        onLocked={handleTokenLocked}
                      />
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => { e.stopPropagation(); void handleShare(id); }}
                    aria-label={`Share GLEE #${id}`}
                    className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {copiedId === id ? <span className="text-[10px] text-[var(--accent)]">Copied!</span> : <ShareIcon />}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md border border-[var(--border-hairline-strong)] bg-black"
            >
              <div className="aspect-square [&_svg]:h-full [&_svg]:w-full">
                {selectedSvg
                  ? <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: selectedSvg }} />
                  : <div className="h-full w-full animate-pulse bg-[var(--background-2)]" />
                }
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-hairline)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[var(--foreground)]">
                    GLEE <span className="text-[var(--accent)]">#{selectedId.toString()}</span>
                  </p>
                  {selectedIsLocked && (
                    <span className="flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-[10px] text-[var(--accent)]">
                      <LockIcon locked={true} /> Locked
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Lock button in lightbox — only when viewing own unlocked token */}
                  {mode === "mine" && selectedIsOwned && !selectedIsLocked && (
                    <LockButton
                      tokenId={selectedId}
                      isLocked={false}
                      onLocked={(id) => { handleTokenLocked(id); }}
                    />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => void handleShare(selectedId)}
                    className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    <ShareIcon /> Share
                  </motion.button>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Check out GLEE #${selectedId} — a fully onchain generative gradient that evolves as it changes hands.`)}&url=${encodeURIComponent(`${SITE_URL}/gallery/${selectedId}`)}&via=GLEEproj`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <XIcon /> Post on X
                  </a>
                  <button onClick={closeLightbox} className="text-xl leading-none text-[var(--foreground-muted)] hover:text-[var(--foreground)]">×</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}