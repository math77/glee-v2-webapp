"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav/Nav";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const mechanics = [
  {
    number: "01",
    title: "Generated onchain.",
    body: "Every GLEE is produced entirely by the smart contract — no off-chain rendering, no IPFS dependency. The algorithm runs on Robinhood Chain and the result is stored there permanently.",
  },
  {
    number: "02",
    title: "Alive with color.",
    body: "Each piece is a radial gradient unique to its token ID + owner wallet. The algorithm selects hues, spread, and layering at mint time — no two tokens share the same visual signature.",
  },
  {
    number: "03",
    title: "Shaped by movement.",
    body: "Every transfer updates a decay clock. The more a GLEE changes hands — and the faster it trades — the more its visual form shifts toward a final transformed state.",
  },
  {
    number: "04",
    title: "The last act.",
    body: "When the collection approaches its terminal decay, anyone can call the Savior function — resetting every piece to its original form, but making the entire collection permanently soulbound. Untransferable. A final choice.",
  },
];

export default function AboutPage() {
  return (
    <div className="site-shell min-h-screen text-[var(--foreground)]">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 sm:pt-44">

        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p variants={fadeUp} className="eyebrow-quiet">What is GLEE</motion.p>
          <motion.h1 variants={fadeUp} className="mt-6 max-w-3xl font-[family-name:var(--font-fraunces)] text-5xl italic leading-[1.05] text-[var(--foreground)] sm:text-6xl">
            Generative.<br />
            <span className="text-[var(--accent)]">Onchain. Alive.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--foreground-muted)]">
            GLEE is an onchain generative art collection on Robinhood Chain. Every piece is a radial
            gradient — fully produced by a smart contract, stored onchain, and shaped by the history
            of its transfers.
          </motion.p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-20 grid gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)] sm:grid-cols-2"
        >
          {mechanics.map(({ number, title, body }) => (
            <motion.article key={number} variants={fadeUp} className="bg-[var(--background)] p-8">
              <span className="font-[family-name:var(--font-geist-mono)] text-sm text-[var(--accent)]">{number}</span>
              <h2 className="mt-8 font-[family-name:var(--font-fraunces)] text-2xl italic text-[var(--foreground)]">{title}</h2>
              <p className="mt-4 leading-relaxed text-[var(--foreground-muted)]">{body}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* Decay mechanic */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-20"
        >
          <p className="eyebrow-quiet">The decay</p>
          <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
            Trading changes everything.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)]">
            A global decay clock advances every time any GLEE is transferred. The speed of that
            advance depends on how recently the collection has been trading — and whether that
            specific token has been ping-ponging between wallets. Rapid, concentrated trading
            accelerates decay far faster than slow, distributed movement.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--foreground-muted)]">
            As the clock advances, every token&apos;s visual shifts — a smooth desaturation from
            the edges inward, ring by ring, until the piece reaches its terminal form. The
            transformation is collective. Every transfer made by anyone in the collection
            contributes to the state every token shows.
          </p>
        </motion.div>

        {/* Savior mechanic */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-14 flex flex-col justify-between gap-6 border-l-2 border-[var(--accent)] bg-[var(--background-2)] p-7 sm:flex-row sm:items-center"
        >
          <div className="max-w-lg">
            <p className="eyebrow-quiet">The savior</p>
            <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl italic text-[var(--foreground)]">
              When the collection is close to its end, anyone can act.
            </h3>
            <p className="mt-4 leading-relaxed text-[var(--foreground-muted)]">
              Once decay reaches a critical threshold, a public Savior function unlocks. Any wallet
              can call it — resetting the visual of every GLEE back to its original generated form.
              The cost: the entire collection becomes soulbound. Permanently untransferable.
              A living collection, frozen in place.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-20 text-center"
        >
          <Link href="/#mint">
            <motion.span
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="quiet-button quiet-button--filled inline-flex px-8 py-3 text-sm"
            >
              Mint a GLEE ↘
            </motion.span>
          </Link>
        </motion.div>
      </main>

      <footer className="mx-auto flex max-w-5xl flex-col gap-4 border-t border-[var(--border-hairline)] px-6 py-8 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
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