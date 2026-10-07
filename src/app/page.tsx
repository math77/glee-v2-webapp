"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import Nav from "@/components/Nav/Nav";

// ── Image data ─────────────────────────────────────────────────────────────────
// Gallery: image1.png … imageN.png — add more files and bump this number.
const GALLERY_COUNT = 70;
const galleryImages = Array.from({ length: GALLERY_COUNT }, (_, i) => `/images/image${i + 1}.png`);

// Decay examples: naming convention decay_token_N_Xpct.png
// Add more tokens by adding entries here; stages are always the same 5 steps.
const DECAY_TOKENS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // token indices in decay_examples folder
const DECAY_STAGES = [
  { pct: 0,   label: "Origin" },
  { pct: 25,  label: "Shifting" },
  { pct: 50,  label: "Fading" },
  { pct: 75,  label: "Dying" },
  { pct: 100, label: "Terminal" },
];
function decayImagePath(token: number, pct: number) {
  return `/images/decay_examples/decay_token_${token}_${pct}pct.png`;
}

// Flip to true once the OpenSea collection is live — every CTA that links to OpenSea
// reads this flag and stays visually disabled (non-clickable, dimmed) until it's set.
const OPENSEA_LIVE = false;
const OPENSEA_URL = "https://opensea.io/collection/glee"; // TODO: update with real URL

// ── Variants ───────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function EyebrowQuiet({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow-quiet">{children}</p>;
}

function OpenSeaButton({ className = "" }: { className?: string }) {
  if (!OPENSEA_LIVE) {
    return (
      <span
        aria-disabled="true"
        title="Minting opens soon on OpenSea"
        className={`quiet-button quiet-button--filled cursor-not-allowed opacity-40 ${className}`}
      >
        Mint on OpenSea ↗
      </span>
    );
  }
  return (
    <a
      href={OPENSEA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`quiet-button quiet-button--filled ${className}`}
    >
      Mint on OpenSea ↗
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 1 — HERO
// ══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const reduceMotion = useReducedMotion();
  // Three decay states to show side-by-side — pick token 1 at 0 / 50 / 100
  const tripleStates = [0, 50, 100];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 sm:px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(100,60,220,0.07)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="eyebrow-quiet mb-6">2200 pieces · 0.00077 ETH · Robinhood Chain · Fully onchain</motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-[family-name:var(--font-fraunces)] text-[clamp(4rem,10vw,8rem)] italic leading-[0.92] tracking-tight text-[var(--foreground)]"
          >
            It changes<span className="text-[var(--accent)]">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-[var(--foreground-muted)] sm:text-xl"
          >
            Every time a GLEE changes hands, its gradient shifts.
            The faster it trades — and the more the whole collection moves —
            the darker it becomes.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4">
            <OpenSeaButton className="px-8 py-3 text-sm" />
            <Link href="/gallery" className="quiet-button px-8 py-3 text-sm">
              See the collection
            </Link>
          </motion.div>
        </motion.div>

        {/* Three-state comparison — different tokens at 0 / 50 / 100 % decay for variety */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
          className="mt-20 grid grid-cols-3 gap-1 sm:gap-3"
        >
          {tripleStates.map((pct, i) => (
            <motion.div
              key={pct}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 + i * 0.1 }}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={decayImagePath([3, 6, 9][i], pct)}
                alt={`GLEE at ${pct}% decay`}
                fill
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 220px, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={i === 1}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3 sm:px-4 sm:py-4">
                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] sm:text-xs">
                  {pct === 0 ? "Origin" : pct === 50 ? "Midlife" : "Terminal"}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-4 text-xs text-[var(--foreground-muted)] sm:text-sm"
        >
          The same GLEE — at 0%, 50%, and 100% decay.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--border-hairline-strong)] pt-2"
        >
          <div className="h-2 w-0.5 rounded-full bg-[var(--accent)] opacity-60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 2 — DECAY DEMO  (interactive slider)
// ══════════════════════════════════════════════════════════════════════════════
function DecayDemoSection() {
  const [stageIndex, setStageIndex] = useState(0);
  const [tokenIndex, setTokenIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance when not interacting
  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!isDragging) setStageIndex((i) => (i + 1) % DECAY_STAGES.length);
    }, 2400);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [isDragging]);

  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setStageIndex(Math.round(pct * (DECAY_STAGES.length - 1)));
    setIsDragging(false);
  }

  const stage = DECAY_STAGES[stageIndex];

  return (
    <section className="border-t border-[var(--border-hairline)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <EyebrowQuiet>The decay</EyebrowQuiet>
            <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              Trading changes everything.<br />
              <span className="text-[var(--accent)]">For everyone.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
              Every transfer advances a shared clock across the entire collection.
              Trade fast and your GLEE darkens faster. But here's the twist — every
              wallet in the collection feels it too. The art is a mirror of how
              the market is behaving.
            </p>
          </motion.div>

          {/* Token picker */}
          <motion.div variants={fadeUp} className="mt-10 flex gap-2">
            {DECAY_TOKENS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTokenIndex(i)}
                className={`px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-xs transition-colors border ${tokenIndex === i ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border-hairline)] text-[var(--foreground-muted)] hover:border-[var(--border-hairline-strong)]"}`}
              >
                Token {t}
              </button>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
            {/* Image */}
            <div className="relative aspect-square w-full max-w-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tokenIndex}-${stageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={decayImagePath(DECAY_TOKENS[tokenIndex], stage.pct)}
                    alt={`Token at ${stage.pct}% decay`}
                    fill
                    sizes="(min-width: 1024px) 512px, 90vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {/* Stage label overlay */}
              <div className="absolute bottom-0 inset-x-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-5">
                <span className="font-[family-name:var(--font-fraunces)] text-3xl italic text-[var(--foreground)]">{stage.label}</span>
                <span className="font-[family-name:var(--font-geist-mono)] text-lg text-[var(--accent)]">{stage.pct}%</span>
              </div>
            </div>

            {/* Slider + stage descriptions */}
            <div className="flex flex-col gap-6">
              {/* Custom scrubber */}
              <div>
                <div
                  ref={trackRef}
                  onClick={handleTrackClick}
                  onMouseEnter={() => setIsDragging(true)}
                  onMouseLeave={() => setIsDragging(false)}
                  className="relative h-1.5 w-full cursor-pointer bg-[var(--border-hairline)]"
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                    animate={{ width: `${(stageIndex / (DECAY_STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  {DECAY_STAGES.map((s, i) => (
                    <button
                      key={s.pct}
                      onClick={(e) => { e.stopPropagation(); setStageIndex(i); setIsDragging(false); }}
                      className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors ${i === stageIndex ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-hairline-strong)] bg-[var(--background)]"}`}
                      style={{ left: `${(i / (DECAY_STAGES.length - 1)) * 100}%` }}
                      aria-label={`${s.pct}% decay`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-between font-[family-name:var(--font-geist-mono)] text-[10px] text-[var(--foreground-muted)]">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>

              {/* Stage descriptions */}
              <div className="space-y-3">
                {DECAY_STAGES.map((s, i) => (
                  <button
                    key={s.pct}
                    onClick={() => { setStageIndex(i); setIsDragging(false); }}
                    className={`block w-full border px-4 py-3 text-left transition-colors ${i === stageIndex ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)]"}`}
                  >
                    <span className={`font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-wider ${i === stageIndex ? "text-[var(--accent)]" : "text-[var(--foreground-muted)]"}`}>
                      {s.label} — {s.pct}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 3 — MECHANICS  (three pillars)
// ══════════════════════════════════════════════════════════════════════════════
function MechanicsSection() {
  const pillars = [
    {
      number: "01",
      headline: "Your piece remembers.",
      body: "The GLEE you hold carries its own transfer history. Tokens that have changed hands repeatedly decay faster than ones that have barely moved — even if the rest of the collection is quiet.",
    },
    {
      number: "02",
      headline: "The collection moves together.",
      body: "A single shared clock runs across all 2200 tokens. Every transfer anywhere in the collection advances it. High market activity darkens everyone's art. Quiet periods let the gradient breathe.",
    },
    {
      number: "03",
      headline: "You can freeze your gradient.",
      body: "Lock your GLEE at any point and its visual stops changing — permanently. You control when the evolution ends. Transfers still work; only the rendering is frozen.",
    },
  ];

  return (
    <section className="border-t border-[var(--border-hairline)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <EyebrowQuiet>How it works</EyebrowQuiet>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              Three forces.<br />One living artwork.
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-14 grid gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)] sm:grid-cols-3">
            {pillars.map(({ number, headline, body }) => (
              <div key={number} className="bg-[var(--background)] p-8">
                <span className="font-[family-name:var(--font-geist-mono)] text-sm text-[var(--accent)]">{number}</span>
                <h3 className="mt-8 font-[family-name:var(--font-fraunces)] text-xl italic text-[var(--foreground)]">{headline}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--foreground-muted)]">{body}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 4 — FULLY ONCHAIN
// ══════════════════════════════════════════════════════════════════════════════
function OnchainSection() {
  const facts = [
    ["No IPFS",    "The art lives in the contract. Not on a server you don't control."],
    ["No API",     "Close this website. Your GLEE still exists, still changes, still lives."],
    ["No admin key", "The contract is the artist. Once deployed, nobody can change the rules."],
    ["Robinhood Chain", "Low fees. Fast blocks. Built for the kind of trading that makes GLEE interesting."],
  ];

  return (
    <section className="border-t border-[var(--border-hairline)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <EyebrowQuiet>Provenance</EyebrowQuiet>
            <h2 className="mt-5 max-w-xl font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              The contract is the artist.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
              GLEE is not a JPEG with a fancy website. The gradient is generated entirely
              by the smart contract, stored entirely onchain, rendered by the contract on every
              read. There is no off-chain dependency that can disappear.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 grid gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)] sm:grid-cols-2">
            {facts.map(([label, desc]) => (
              <div key={label} className="bg-[var(--background)] px-6 py-6">
                <span className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-widest text-[var(--accent)]">{label}</span>
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">{desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 5 — THE RESET  (mythology)
// ══════════════════════════════════════════════════════════════════════════════
function ResetSection() {
  const [cycleStep, setCycleStep] = useState(0);
  const steps = [
    { label: "Alive", pct: 0, desc: "The collection is born. Gradients are vivid." },
    { label: "Decaying", pct: 50, desc: "The market is active. Colors begin to fade." },
    { label: "Terminal", pct: 100, desc: "Maximum decay. The collection reaches its end." },
    { label: "Reset", pct: 0, desc: "The clock resets to zero. It begins again." },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCycleStep((s) => (s + 1) % steps.length), 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const current = steps[cycleStep];

  return (
    <section className="border-t border-[var(--border-hairline)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid gap-16 lg:grid-cols-2 lg:items-center"
        >
          <motion.div variants={fadeUp}>
            <EyebrowQuiet>The reset</EyebrowQuiet>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              It doesn't die.<br />
              <span className="text-[var(--accent)]">It begins again.</span>
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--foreground-muted)]">
              When the decay clock reaches its terminal point, the collection doesn't
              need to end — the clock can be reseted back to zero. Every GLEE not locked returns to its original gradient.
              The cycle starts over.
            </p>
            {/*
            <p className="mt-4 leading-relaxed text-[var(--foreground-muted)]">
              What triggers the reset? That's still being decided — by the community.
              What matters is that the power to bring the collection back to life exists,
              and it belongs to the people who hold it.
            </p>
            */}
          </motion.div>

          {/* Animated cycle visualization */}
          <motion.div variants={fadeUp} className="relative">
            <div className="relative aspect-square w-full max-w-sm overflow-hidden border border-[var(--border-hairline)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${cycleStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={decayImagePath(1, current.pct === 0 && cycleStep === 3 ? 0 : current.pct)}
                    alt={current.label}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay on reset step */}
              <AnimatePresence>
                {cycleStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60"
                  >
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-[family-name:var(--font-fraunces)] text-4xl italic text-[var(--foreground)]"
                    >
                      Reset.
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-5">
                <span className="font-[family-name:var(--font-fraunces)] text-2xl italic text-[var(--foreground)]">{current.label}</span>
              </div>
            </div>

            {/* Step indicators */}
            <div className="mt-4 flex items-center gap-2">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCycleStep(i)}
                  className={`h-1 flex-1 transition-colors ${i === cycleStep ? "bg-[var(--accent)]" : "bg-[var(--border-hairline-strong)]"}`}
                  aria-label={s.label}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">{current.desc}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 6 — GALLERY  (full-bleed, no borders, staggered masonry feel)
// ══════════════════════════════════════════════════════════════════════════════
function GallerySection() {
  // Shuffle for visual variety — stable across renders using a seeded approach
  const displayed = galleryImages.slice(0, 48);

  return (
    <section className="border-t border-[var(--border-hairline)] pt-24 sm:pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <EyebrowQuiet>The collection</EyebrowQuiet>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              No two GLEEs are alike.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-[var(--foreground-muted)]">
              Every token is generated entirely by the contract at mint time —
              its colors, radial shape, and gradient spread unique to that moment.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Full-bleed grid — no borders, images edge-to-edge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-12 grid grid-cols-4 gap-0.5 sm:grid-cols-6 lg:grid-cols-8"
      >
        {displayed.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i, 24) * 0.015 }}
            className="group relative aspect-square overflow-hidden bg-[var(--background-2)]"
          >
            <Image
              src={src}
              alt={`GLEE #${i + 1}`}
              fill
              sizes="(min-width: 1280px) 160px, (min-width: 768px) 16.6vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 px-6 pb-24 text-center sm:pb-32">
        <Link href="/gallery" className="quiet-button quiet-button--filled px-8 py-3 text-sm">
          Browse the full collection →
        </Link>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Section 7 — CTA / MINT
// ══════════════════════════════════════════════════════════════════════════════
function CtaSection() {
  return (
    <section className="border-t border-[var(--border-hairline)] px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-2xl overflow-hidden text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(100,60,220,0.08)] blur-[80px]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="eyebrow-quiet mb-6">Ready?</motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-[family-name:var(--font-fraunces)] text-5xl italic leading-[0.95] text-[var(--foreground)] sm:text-6xl"
          >
            Own a gradient.<br />
            <span className="text-[var(--accent)]">Watch it live.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-md leading-relaxed text-[var(--foreground-muted)]">
            One canvas. Endlessly alive. Yours to hold, trade, lock, or let
            evolve — the choice is always yours.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4">
            <OpenSeaButton className="px-10 py-3.5 text-sm" />
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-xs text-[var(--foreground-muted)]">
            2200 pieces · Robinhood Chain · Fully onchain
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div className="site-shell min-h-screen overflow-hidden text-[var(--foreground)]">
      <Nav />
      <main>
        <HeroSection />
        <DecayDemoSection />
        <MechanicsSection />
        <OnchainSection />
        <ResetSection />
        <GallerySection />
        <CtaSection />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-[var(--border-hairline)] px-6 py-8 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-[family-name:var(--font-fraunces)] italic text-[var(--foreground)]">
          Glee<span className="text-[var(--accent)]">.</span>
        </span>
        <div className="flex gap-5">
          <a href="https://x.com/GLEEproj" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--foreground)]">X / Twitter</a>
          <a href="https://discord.gg/pgqN3repn" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--foreground)]">Discord</a>
        </div>
      </footer>
    </div>
  );
}