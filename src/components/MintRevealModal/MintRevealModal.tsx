"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { SITE_URL } from "@/utils/siteConfig";

// ── Animation stages ──────────────────────────────────────────────────────────
// idle → entering → anticipating → flipping → shining → done
type Stage = "idle" | "entering" | "anticipating" | "flipping" | "shining" | "done";

const STAGE_DURATIONS: Record<Stage, number> = {
  idle: 0,
  entering: 600,
  anticipating: 1100,
  flipping: 700,
  shining: 1400,
  done: 0,
};

// ── Sparkle data ──────────────────────────────────────────────────────────────
interface Sparkle { id: number; x: number; y: number; size: number; delay: number; color: string }

const SPARKLE_COLORS = [
  "rgba(200,200,255,0.9)",
  "rgba(255,255,255,0.9)",
  "rgba(160,160,220,0.9)",
  "rgba(220,210,255,0.9)",
  "rgba(180,180,255,0.85)",
];

function generateSparkles(n = 22): Sparkle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 140 - 20,     // -20% to 120% — some spill outside the card
    y: Math.random() * 140 - 20,
    size: 3 + Math.random() * 6,
    delay: Math.random() * 0.5,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
  }));
}

// ── Holographic tilt effect ───────────────────────────────────────────────────
function HoloCard({ svg, stage }: { svg: string; stage: Stage }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const isDone = stage === "done";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDone || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isDone ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
      className="relative select-none"
    >
      {/* The gradient art */}
      <div
        className="h-[340px] w-[340px] overflow-hidden sm:h-[400px] sm:w-[400px]"
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ display: "block" }}
      />

      {/* Holographic prismatic overlay — only in shining + done stages */}
      <AnimatePresence>
        {(stage === "shining" || stage === "done") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.5, 0.7, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, times: [0, 0.2, 0.5, 0.7, 1] }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 20%, rgba(160,120,255,0.35) 35%, rgba(100,200,255,0.3) 45%, rgba(255,180,120,0.25) 55%, rgba(120,255,180,0.3) 65%, transparent 80%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>

      {/* Mouse-follow shine glare — only after reveal is done */}
      {isDone && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-none"
          style={{
            background: useTransform(
              [shineX, shineY],
              ([x, y]) =>
                `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.18) 0%, transparent 55%)`,
            ),
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Diagonal shine sweep — fires once on reveal */}
      <AnimatePresence>
        {stage === "shining" && (
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: "-120%", skewX: -18 }}
              animate={{ x: "220%" }}
              transition={{ duration: 0.7, ease: "easeInOut", delay: 0.1 }}
              className="absolute inset-y-0 w-[60%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), rgba(200,180,255,0.3), transparent)",
              }}
            />
            {/* Second sweep, slightly delayed */}
            <motion.div
              initial={{ x: "-120%", skewX: -18 }}
              animate={{ x: "220%" }}
              transition={{ duration: 0.65, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-y-0 w-[40%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(180,200,255,0.3), rgba(255,255,255,0.25), transparent)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Dark card back (shown before flip) ────────────────────────────────────────
function CardBack() {
  return (
    <div className="relative h-[340px] w-[340px] overflow-hidden sm:h-[400px] sm:w-[400px]">
      {/* Deep black base */}
      <div className="absolute inset-0 bg-[#02020a]" />
      {/* Subtle radial glow from center */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(100, 80, 200, 0.4) 0%, transparent 65%)",
        }}
      />
      {/* "G" monogram hint */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-[family-name:var(--font-fraunces)] text-8xl italic text-white/20 select-none"
        >
          G
        </motion.span>
      </div>
      {/* Corner edge glows */}
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          className={`absolute h-16 w-16 ${pos}`}
          style={{
            background: `radial-gradient(ellipse at ${i < 2 ? "top" : "bottom"} ${i % 2 === 0 ? "left" : "right"}, rgba(140,120,255,0.5), transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export interface MintRevealModalProps {
  tokenId: bigint;
  svg: string;
  onClose: () => void;
}

export default function MintRevealModal({ tokenId, svg, onClose }: MintRevealModalProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [isFaceUp, setIsFaceUp] = useState(false);
  const sparkles = useMemo(() => generateSparkles(22), []);
  const stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function nextStage(from: Stage) {
    const order: Stage[] = ["idle", "entering", "anticipating", "flipping", "shining", "done"];
    const next = order[order.indexOf(from) + 1];
    if (!next) return;
    stageTimer.current = setTimeout(() => {
      setStage(next);
      // Halfway through the flip, switch which face is shown
      if (from === "anticipating") {
        setTimeout(() => setIsFaceUp(true), STAGE_DURATIONS.flipping / 2);
      }
      nextStage(next);
    }, STAGE_DURATIONS[from]);
  }

  useEffect(() => {
    setStage("entering");
    nextStage("entering");
    return () => { if (stageTimer.current) clearTimeout(stageTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareUrl = `${SITE_URL}/gallery/${tokenId}`;
  const xShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(`Just minted GLEE #${tokenId} — a fully onchain generative gradient. Every transfer changes its form.`)}&url=${encodeURIComponent(shareUrl)}&via=GLEEproj`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/95 p-4"
      onClick={(e) => { if (stage === "done" && e.target === e.currentTarget) onClose(); }}
    >
      {/* Ambient background glow — reacts to reveal stage */}
      <motion.div
        animate={
          stage === "shining" || stage === "done"
            ? { opacity: 0.25, scale: 1.2 }
            : { opacity: 0.08, scale: 1 }
        }
        transition={{ duration: 1, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(120, 80, 255, 0.6) 0%, rgba(60, 40, 160, 0.3) 40%, transparent 70%)",
        }}
      />

      {/* Pre-reveal label */}
      <AnimatePresence>
        {(stage === "entering" || stage === "anticipating") && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mb-8 font-[family-name:var(--font-fraunces)] italic text-lg text-white/40"
          >
            Your GLEE is ready…
          </motion.p>
        )}
      </AnimatePresence>

      {/* The card */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.88 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Card border / frame */}
        <motion.div
          animate={
            stage === "shining"
              ? { boxShadow: "0 0 0 1px rgba(160,140,255,0.6), 0 0 40px rgba(120,80,255,0.5), 0 0 80px rgba(80,60,200,0.3)" }
              : stage === "done"
              ? { boxShadow: "0 0 0 1px rgba(160,140,255,0.3), 0 0 20px rgba(100,70,200,0.2)" }
              : { boxShadow: "0 0 0 1px rgba(100,80,180,0.25), 0 0 30px rgba(80,60,180,0.2)" }
          }
          transition={{ duration: 0.8 }}
          // 3-D flip: rotateY goes from 0 → -90 (back disappears) then jumps to +90 → 0 (front appears)
          // We achieve this with two separate motion.divs using the isFaceUp flag
          className="overflow-hidden"
        >
          <motion.div
            animate={{
              rotateY: stage === "flipping" ? (isFaceUp ? [90, 0] : [0, -90]) : 0,
            }}
            transition={{ duration: STAGE_DURATIONS.flipping / 1000 / 2, ease: "easeIn" }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {isFaceUp
              ? <HoloCard svg={svg} stage={stage} />
              : <CardBack />
            }
          </motion.div>
        </motion.div>

        {/* Sparkles — burst outward after flip */}
        <AnimatePresence>
          {(stage === "shining" || stage === "done") && sparkles.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: "50%", y: "50%", scale: 0 }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                x: `${s.x}%`,
                y: `${s.y}%`,
                scale: [0, 1, 0.7, 0],
              }}
              transition={{ duration: 0.9 + s.delay, delay: s.delay, ease: "easeOut" }}
              className="pointer-events-none absolute rounded-full"
              style={{
                width: s.size,
                height: s.size,
                backgroundColor: s.color,
                filter: `blur(${s.size > 7 ? 1 : 0}px)`,
                boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Post-reveal token label + actions */}
      <AnimatePresence>
        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <p className="font-[family-name:var(--font-fraunces)] text-2xl italic text-white">
              GLEE <span className="text-[var(--accent)]">#{tokenId.toString()}</span>
            </p>
            <p className="max-w-xs text-center text-sm text-white/40">
              Yours. It'll change with every transfer — or you can lock its visual forever.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-button px-5 py-2.5 text-sm"
              >
                Post on X ↗
              </a>
              <button onClick={onClose} className="quiet-button quiet-button--filled px-5 py-2.5 text-sm">
                Enter the collection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}