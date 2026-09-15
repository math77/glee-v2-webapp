"use client";

import Image from "next/image";
import { motion, useReducedMotion, type MotionStyle } from "framer-motion";

const artworks = [
  "image1",
  "image2",
  "image3",
  "image4",
  "image5",
  "image6",
  "image7",
  "image8",
  "image9",
  "image10",
  "image11",
  "image12",
  "image13",
  "image14",
  "image15",
  "image16",
  "image17",
  "image18",
  "image19",
  "image20"
];

const positions = [
  { left: "8%", scale: 0.58, opacity: 0.2, rotate: -7, zIndex: 1 },
  { left: "29%", scale: 0.76, opacity: 0.5, rotate: -4, zIndex: 2 },
  { left: "50%", scale: 1, opacity: 1, rotate: 0, zIndex: 10 },
  { left: "71%", scale: 0.76, opacity: 0.5, rotate: 4, zIndex: 2 },
  { left: "92%", scale: 0.58, opacity: 0.2, rotate: 7, zIndex: 1 },
] as const;

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="site-shell min-h-screen overflow-hidden text-[var(--foreground)]">
      <main>
        <section className="relative flex min-h-screen flex-col justify-center px-6 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">

            {/* Hero */}
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
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.15,
                }}
                className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)] sm:text-lg"
              >
                GLEEs are fully onchain generative colorful artpieces. These
                pieces take on new shapes and colors as they change hands;
                decay and are alive. Coming soon to Robinhoodchain.
              </motion.p>
            </div>

            {/* Living gallery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: 0.3,
              }}
              className="relative mx-auto mt-20 h-[330px] w-full max-w-7xl sm:h-[430px] lg:mt-24 lg:h-[520px]"
            >
              {/* Edge fades */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[18%] bg-gradient-to-r from-[var(--background)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[18%] bg-gradient-to-l from-[var(--background)] to-transparent" />

              {/* Center guide */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 border border-[var(--border-hairline)] opacity-20 sm:h-[320px] sm:w-[320px] lg:h-[400px] lg:w-[400px]" />

              {/* Artwork stream */}
              <div className="absolute inset-0">
                {artworks.map((artwork, index) => {
                  const phase = index % positions.length;
                  const duration = 20;
                  const delay = -(phase * 4);

                  // FIX 1: Changed plain <div> to <motion.div> so the style prop is typed as
                  // MotionStyle, which accepts numeric `rotate` values. React's CSSProperties
                  // types `rotate` as string-only (CSS Individual Transforms spec), causing
                  // the "not assignable to type 'Rotate | undefined'" error on a plain div.
                  //
                  // FIX 2: Removed the stray `left-0` Tailwind class that conflicted with
                  // `left: position.left` in the inline style (inline wins on specificity,
                  // so it was invisible at runtime but still wrong).
                  if (reduceMotion) {
                    const position = positions[phase];

                    return (
                      <motion.div
                        key={artwork}
                        className="absolute top-1/2 aspect-square w-[180px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[var(--border-hairline)] bg-[var(--background-2)] sm:w-[260px] lg:w-[330px]"
                        style={{
                          left: position.left,
                          scale: position.scale,
                          opacity: position.opacity,
                          rotate: position.rotate,
                          zIndex: position.zIndex,
                        }}
                      >
                        <Image
                          src={`/images/${artwork}.png`}
                          alt={`GLEE generative artwork ${index + 1}`}
                          fill
                          // FIX 3: Corrected sizes to match the responsive w-[180px]/sm:w-[260px]/lg:w-[330px]
                          // classes. The original "330px" told Next.js to always serve a 330px-optimised
                          // image even on mobile where the card is only 180px wide.
                          sizes="(min-width: 1024px) 330px, (min-width: 640px) 260px, 180px"
                          className="object-cover"
                        />
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={artwork}
                      initial={{
                        left: positions[phase].left,
                        scale: positions[phase].scale,
                        opacity: positions[phase].opacity,
                        rotate: positions[phase].rotate,
                      }}
                      animate={{
                        left: [
                          "8%",
                          "29%",
                          "50%",
                          "71%",
                          "92%",
                          "108%",
                          "108%",
                        ],
                        scale: [
                          0.58,
                          0.76,
                          1,
                          0.76,
                          0.58,
                          0.35,
                          0.35,
                        ],
                        opacity: [
                          0.2,
                          0.5,
                          1,
                          0.5,
                          0.2,
                          0,
                          0,
                        ],
                        rotate: [
                          -7,
                          -4,
                          0,
                          4,
                          7,
                          9,
                          9,
                        ],
                      }}
                      transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        ease: "linear",
                        times: [
                          0,
                          0.2,
                          0.4,
                          0.6,
                          0.8,
                          0.95,
                          1,
                        ],
                      }}
                      className="absolute top-1/2 aspect-square w-[180px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[var(--border-hairline)] bg-[var(--background-2)] sm:w-[260px] lg:w-[330px]"
                      style={{
                        zIndex: phase === 2 ? 10 : 2,
                      }}
                    >
                      <Image
                        src={`/images/${artwork}.png`}
                        alt={`GLEE generative artwork ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 330px, (min-width: 640px) 260px, 180px"
                        className="object-cover"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Status */}
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
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[var(--border-hairline)] px-6 py-8 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-[family-name:var(--font-fraunces)] italic text-[var(--foreground)]">
          Glee<span className="text-[var(--accent)]">.</span> onchain art
        </span>

        <div className="flex gap-5">
          <a
            href="https://x.com/GLEEproj"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            X
          </a>

          <a
            href="https://discord.gg/pgqN3repn"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}