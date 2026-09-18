"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Nav from "@/components/Nav/Nav";
import MintCanvas from "@/components/MintCanvas/MintCanvas";

const artworks = [
  "image1","image2","image3","image4","image5","image6","image7","image8","image9",
  "image10","image11","image12","image13","image14","image15","image16","image17","image18","image19","image20",
];

const positions = [
  { left: "8%",  scale: 0.58, opacity: 0.2, rotate: -7, zIndex: 1 },
  { left: "29%", scale: 0.76, opacity: 0.5, rotate: -4, zIndex: 2 },
  { left: "50%", scale: 1,    opacity: 1,   rotate:  0, zIndex: 10 },
  { left: "71%", scale: 0.76, opacity: 0.5, rotate:  4, zIndex: 2 },
  { left: "92%", scale: 0.58, opacity: 0.2, rotate:  7, zIndex: 1 },
] as const;

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="site-shell min-h-screen overflow-hidden text-[var(--foreground)]">
      <Nav />

      <main>
        {/* ── Hero ── */}
        <section className="relative flex min-h-screen flex-col justify-center px-6 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="font-[family-name:var(--font-fraunces)] text-6xl italic leading-[0.95] text-[var(--foreground)] sm:text-7xl lg:text-8xl"
              >
                GLEE<span className="text-[var(--accent)]">.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)] sm:text-lg"
              >
                GLEEs are fully onchain generative artpieces — alive with color, shaped by movement.
                Each piece evolves as it changes hands, decays over time, and is entirely yours.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--foreground-muted)]"
              >
                <a href="/gallery" className="transition-colors hover:text-[var(--foreground)]">View Gallery →</a>
                <a href="/about" className="transition-colors hover:text-[var(--foreground)]">About →</a>
              </motion.div>
            </div>

            {/* ── Artwork carousel ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="relative mx-auto mt-20 h-[330px] w-full max-w-7xl sm:h-[430px] lg:mt-24 lg:h-[520px]"
            >
              {/* Edge fades */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[18%] bg-gradient-to-r from-[var(--background)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[18%] bg-gradient-to-l from-[var(--background)] to-transparent" />

              {/* Center guide — subtle, doesn't compete */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 border border-[var(--border-hairline)] opacity-20 sm:h-[320px] sm:w-[320px] lg:h-[400px] lg:w-[400px]" />

              <div className="absolute inset-0">
                {artworks.map((artwork, index) => {
                  const phase = index % positions.length;
                  const duration = 20;
                  const delay = -(phase * 4);

                  if (reduceMotion) {
                    const position = positions[phase];
                    return (
                      <motion.div
                        key={artwork}
                        className="absolute top-1/2 aspect-square w-[180px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[var(--border-hairline)] bg-[var(--background-2)] sm:w-[260px] lg:w-[330px]"
                        style={{ left: position.left, scale: position.scale, opacity: position.opacity, rotate: position.rotate, zIndex: position.zIndex }}
                      >
                        <Image src={`/images/${artwork}.png`} alt={`GLEE artwork ${index + 1}`} fill sizes="(min-width: 1024px) 330px, (min-width: 640px) 260px, 180px" className="object-cover" />
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={artwork}
                      initial={{ left: positions[phase].left, scale: positions[phase].scale, opacity: positions[phase].opacity, rotate: positions[phase].rotate }}
                      animate={{
                        left:    ["8%","29%","50%","71%","92%","108%","108%"],
                        scale:   [0.58, 0.76, 1, 0.76, 0.58, 0.35, 0.35],
                        opacity: [0.2, 0.5, 1, 0.5, 0.2, 0, 0],
                        rotate:  [-7, -4, 0, 4, 7, 9, 9],
                      }}
                      transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        ease: "linear",
                        times: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1],
                      }}
                      className="absolute top-1/2 aspect-square w-[180px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[var(--border-hairline)] bg-[var(--background-2)] sm:w-[260px] lg:w-[330px]"
                      style={{ zIndex: phase === 2 ? 10 : 2 }}
                    >
                      <Image src={`/images/${artwork}.png`} alt={`GLEE artwork ${index + 1}`} fill sizes="(min-width: 1024px) 330px, (min-width: 640px) 260px, 180px" className="object-cover" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-2 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--foreground-muted)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>Generative · Onchain · Alive</span>
            </motion.div>
          </div>
        </section>

        {/* ── Mint section ── */}
        <motion.section
          id="mint"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="scroll-mt-24 border-t border-[var(--border-hairline)] px-6 py-20 sm:py-28"
        >
          <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="eyebrow-quiet">Own a piece</p>
              <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
                No two GLEEs<br />are alike.
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-[var(--foreground-muted)]">
                Every token is generated entirely onchain — its colors, shape, and gradient
                unique to that moment. Transfer it, watch it change.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)]">
                {[["3,000", "public supply"], ["∞", "unique pieces"], ["100%", "onchain"]].map(([v, l]) => (
                  <div key={l} className="bg-[var(--background)] px-4 py-5 text-center">
                    <strong className="block font-[family-name:var(--font-fraunces)] text-xl italic text-[var(--foreground)]">{v}</strong>
                    <span className="mt-1 block text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[var(--border-hairline)] bg-[var(--background-2)] p-6 sm:p-8">
              <MintCanvas />
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-[var(--border-hairline)] px-6 py-8 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-[family-name:var(--font-fraunces)] italic text-[var(--foreground)]">
          Glee<span className="text-[var(--accent)]">.</span> onchain art
        </span>
        <div className="flex gap-5">
          <a href="https://x.com/GLEEproj" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--foreground)]">X</a>
          <a href="https://discord.gg/pgqN3repn" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--foreground)]">Discord</a>
        </div>
      </footer>
    </div>
  );
}
