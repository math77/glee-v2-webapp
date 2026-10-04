"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Nav from "@/components/Nav/Nav";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={stagger}
      className={`border-t border-[var(--border-hairline)] py-20 sm:py-28 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function AboutPage() {
  return (
    <div className="site-shell min-h-screen text-[var(--foreground)]">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 sm:pt-44">

        {/* ── HERO ── */}
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.p variants={fadeUp} className="eyebrow-quiet">About GLEE</motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-3xl font-[family-name:var(--font-fraunces)] text-5xl italic leading-[1.04] text-[var(--foreground)] sm:text-6xl"
          >
            An NFT that behaves<br />
            <span className="text-[var(--accent)]">like a living thing.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--foreground-muted)]">
            GLEE is a collection of 7,777 generative gradient artworks on Robinhood Chain.
            Every piece is produced entirely by a smart contract, stored entirely onchain,
            and shaped by the trading behavior of everyone who holds the collection.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
            It&apos;s not a JPEG. It&apos;s not art that happens to be tokenized.
            It&apos;s a programmable object that evolves in response to real market activity —
            and the people who hold it are the ones who shape what it becomes.
          </motion.p>
        </motion.div>

        {/* ── WHAT IT IS ── */}
        <Section>
          <motion.div variants={fadeUp}>
            <p className="eyebrow-quiet">What it is</p>
            <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              Generative. Onchain. Yours.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 grid gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)] sm:grid-cols-2">
            {[
              {
                n: "01",
                title: "Generated entirely onchain.",
                body: "The contract is the artist. There's no off-chain renderer, no IPFS link, no metadata API. Every GLEE's gradient — its colors, spread, layering — is computed and stored by the smart contract. Close this website. Your token still exists and still renders.",
              },
              {
                n: "02",
                title: "Unique by construction.",
                body: "Each token ID produces a distinct visual signature. The algorithm selects hues, radial spread, and gradient composition at mint time. No two GLEEs share the same output — not because of randomness added by a reveal, but because the math makes it impossible.",
              },
              {
                n: "03",
                title: "Programmable by design.",
                body: "GLEE uses the actual capabilities of the ERC-721 standard — not just for ownership, but for behavior. Transfers change the visual. Market activity changes the visual. The contract has mechanics that most NFT projects leave permanently unused.",
              },
              {
                n: "04",
                title: "Built on Robinhood Chain.",
                body: "Low fees and fast blocks make the decay mechanic viable in a way it isn't on expensive chains. Transfers happen freely enough that the collection actually accumulates a real history — and that history is what makes GLEE interesting to hold.",
              },
            ].map(({ n, title, body }) => (
              <motion.article key={n} variants={fadeUp} className="bg-[var(--background)] p-8">
                <span className="font-[family-name:var(--font-geist-mono)] text-sm text-[var(--accent)]">{n}</span>
                <h3 className="mt-8 font-[family-name:var(--font-fraunces)] text-xl italic text-[var(--foreground)]">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--foreground-muted)]">{body}</p>
              </motion.article>
            ))}
          </motion.div>
        </Section>

        {/* ── GTD / PUBLIC MINT BENEFITS ── */}
        <Section>
          <motion.div variants={fadeUp}>
            <p className="eyebrow-quiet">Mint mechanics</p>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              GTD. FCFS/Public.<br />
              <span className="text-[var(--accent)]">What you get.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
              {/* TODO: add a one-line description of the mint structure here */}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 grid gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)] sm:grid-cols-2">

            {/* GTD column */}
            <div className="bg-[var(--background)] p-8">
              <span className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-widest text-[var(--accent)]">Guaranteed (GTD)</span>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: GTD benefit */}
                  <span className="block text-[var(--foreground-muted)]">Mint fee half of the public price</span>
                </li>
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: GTD benefit with sub-items */}
                  <span className="block text-[var(--foreground-muted)]">— Industrial Imagination Board Points</span>
                  <ul className="mt-2 ml-4 space-y-1.5 border-l border-[var(--border-hairline)] pl-4">
                    <li className="text-xs text-[var(--foreground-muted)]">GTD eligible → 100 points</li>
                    <li className="text-xs text-[var(--foreground-muted)]">Each GLEE minted via GTD → 75 points</li>
                    <li className="text-xs text-[var(--foreground-muted)]">Each GLEE minted via public → 50 points</li>
                  </ul>
                </li>
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: GTD benefit */}
                  <span className="block text-[var(--foreground-muted)]">
                    Participate on the free NFT gift raffle event (happens post mint sold out; Only those who minted and have points can participate) → 20 NFTs; 10 winnners; 2 NFTs per winner.
                  </span>
                </li>
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: GTD benefit */}
                  <span className="block text-[var(--foreground-muted)]">— Better positioned to FNSCN (future nice stuff coming next)</span>
                </li>
              </ul>
            </div>

            {/* Public column */}
            <div className="bg-[var(--background)] p-8">
              <span className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-widest text-[var(--accent)]">FCFS/Public</span>
              <ul className="mt-6 space-y-4">
                {/*
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: Public benefit 
                  <span className="block text-[var(--foreground-muted)]">— </span>
                  *#/}
                </li>
                */}
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: Public benefit with sub-items */}
                  <span className="block text-[var(--foreground-muted)]">— Industrial Imagination Board Points</span>
                  <ul className="mt-2 ml-4 space-y-1.5 border-l border-[var(--border-hairline)] pl-4">
                    <li className="text-xs text-[var(--foreground-muted)]">→ FCFS → 70 points</li>
                    <li className="text-xs text-[var(--foreground-muted)]">→ Public → 40 points</li>
                    <li className="text-xs text-[var(--foreground-muted)]">→ FCFS/Public → Each GLEE minted → 25 points</li>
                  </ul>
                </li>
                <li className="text-sm leading-relaxed text-[var(--foreground)]">
                  {/* TODO: Public benefit */}
                  <span className="block text-[var(--foreground-muted)]">— Participate on the free NFT gift raffle event (happens post mint sold out; Only those who minted and have points can participate) → 10 NFTs; 10 winnners; 1 NFT per winner.</span>
                </li>
              </ul>
            </div>

          </motion.div>
        </Section>

        {/* ── THE DECAY ── */}
        <Section>
          <motion.div variants={fadeUp} className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <p className="eyebrow-quiet">The decay mechanic</p>
              <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
                Trading changes<br />
                <span className="text-[var(--accent)]">everyone&apos;s art.</span>
              </h2>
              <p className="mt-6 leading-relaxed text-[var(--foreground-muted)]">
                A single decay clock runs across the entire collection. Every transfer —
                by any wallet, of any token — advances it. The faster the collection has been
                trading recently, the larger the jump. And if a specific token has been
                changing hands repeatedly, it gets an additional amplifier on top of that.
              </p>
              <p className="mt-4 leading-relaxed text-[var(--foreground-muted)]">
                As the clock advances, every GLEE&apos;s gradient desaturates — starting from
                the outer edges and working inward, ring by ring, until the piece reaches
                its terminal form. The transformation is smooth, continuous, and collective.
                You don&apos;t decide when it happens. The market does.
              </p>
              <p className="mt-4 leading-relaxed text-[var(--foreground-muted)]">
                This isn&apos;t a metaphor. It&apos;s a formula baked into the contract: your
                trading behavior, and everyone else&apos;s, is the input. The art is the output.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px border border-[var(--border-hairline)] bg-[var(--border-hairline)]">
                {[
                  ["Global pressure", "How actively the whole collection has been trading"],
                  ["Token pressure", "How recently this specific token has changed hands"],
                  ["Combined effect", "The two multiply — hot tokens in an active market decay fastest"],
                  ["Terminal state", "100% decay changes the visual permanently, until a reset"],
                ].map(([label, desc]) => (
                  <div key={label} className="bg-[var(--background)] px-5 py-5">
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-[var(--accent)]">{label}</span>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--foreground-muted)]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Decay visual strip */}
            <motion.div variants={fadeUp} className="flex flex-col gap-1">
              {[0, 25, 50, 75, 100].map((pct) => (
                <div key={pct} className="group relative aspect-square w-full overflow-hidden">
                  <Image
                    src={`/images/decay_examples/decay_token_4_${pct}pct.png`}
                    alt={`Decay at ${pct}%`}
                    fill
                    sizes="340px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[var(--foreground-muted)]">{pct}%</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Section>

        {/* ── THE LOCK ── */}
        <Section>
          <motion.div variants={fadeUp} className="max-w-2xl">
            <p className="eyebrow-quiet">The lock</p>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              Freeze what you love.
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--foreground-muted)]">
              At any point, a holder can lock their GLEE. The gradient freezes in place —
              permanently. Future transfers still work; the token can still be bought and sold.
              But the visual stops responding to the decay clock from that moment forward.
            </p>
            <p className="mt-4 leading-relaxed text-[var(--foreground-muted)]">
              This is a choice, not a default. Some holders will want to preserve a gradient
              they find beautiful. Others will let it decay all the way to terminal and hold
              the final state as a record of the collection&apos;s history. Neither is wrong.
            </p>
          </motion.div>
        </Section>

        {/* ── THE RESET ── */}
        <Section>
          <motion.div variants={fadeUp} className="border-l-2 border-[var(--accent)] pl-8">
            <p className="eyebrow-quiet">The reset</p>
            <h2 className="mt-5 max-w-xl font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              It doesn&apos;t end.<br />
              <span className="text-[var(--accent)]">It begins again.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
              When the decay clock reaches its terminal point, it doesn&apos;t stay there.
              A reset mechanic exists — one that returns the clock to zero and restores
              every GLEE&apos;s gradient to its original generated form. The cycle starts over.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
              What action triggers the reset is still being decided — by the community.
              What matters is that the power exists, and it belongs to the people who hold the collection,
              not to whoever deployed the contract.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--foreground-muted)]">
              This makes GLEE a collection with no defined end state. It can decay and reset
              indefinitely. The art is always in motion. The question is just how fast,
              and who chooses to intervene.
            </p>
          </motion.div>
        </Section>

        {/* ── WHY THIS MATTERS ── */}
        <Section>
          <motion.div variants={fadeUp}>
            <p className="eyebrow-quiet">Why it&apos;s different</p>
            <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-fraunces)] text-4xl italic leading-tight text-[var(--foreground)] sm:text-5xl">
              Not another generative collection.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 space-y-0 divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
            {[
              {
                claim: "Most generative NFTs are static the moment they're minted.",
                contrast: "GLEE changes every time it moves. You don't know what it'll look like in six months.",
              },
              {
                claim: "Most collections use IPFS. That's a dependency that can disappear.",
                contrast: "GLEE has no external dependencies. The contract generates the art. That's it.",
              },
              {
                claim: "Most collection mechanics are cosmetic. Rarity, traits, tiers.",
                contrast: "GLEE's mechanics are behavioral. The market is the artist. You're participating in it.",
              },
              {
                claim: "Most 'dynamic' NFTs are controlled by an admin key.",
                contrast: "GLEE's evolution is deterministic. No one controls it — not even the team.",
              },
            ].map(({ claim, contrast }) => (
              <div key={claim} className="grid gap-4 py-6 sm:grid-cols-2 sm:gap-10">
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)] line-through decoration-[var(--border-hairline-strong)]">{claim}</p>
                <p className="text-sm leading-relaxed text-[var(--foreground)]">{contrast}</p>
              </div>
            ))}
          </motion.div>
        </Section>

        {/* ── FAQ ── */}
        <Section>
          <motion.div variants={fadeUp}>
            <p className="eyebrow-quiet">Questions</p>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl italic text-[var(--foreground)]">
              Common questions.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 space-y-0 divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
            {[
              {
                q: "What happens to my locked GLEE when the collection resets?",
                a: "Locking only freezes the rendering — it doesn't remove the token from the decay system. A reset brings the decay clock back to zero for the whole collection. Whether a locked token's visual updates from a reset is a design decision we haven't finalized yet.",
              },
              {
                q: "Can I mint more than one?",
                a: "Yes. Each token is independent. You can hold as many as you want. Each one carries its own transfer history on top of the shared global clock.",
              },
              {
                q: "What does 'fully onchain' actually mean?",
                a: "The SVG is generated by the contract at read time. No API. No IPFS hash. No server. If you call tokenURI() directly on the contract, you get the full data URI back — the art is in the response, not linked from it.",
              },
              {
                q: "Does trading my GLEE affect other people's tokens?",
                a: "Yes. Every transfer advances the shared decay clock. The effect is proportional — one transfer doesn't change much — but high trading volume across the collection accelerates decay for everyone.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-6">
                <p className="font-[family-name:var(--font-fraunces)] italic text-[var(--foreground)]">{q}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">{a}</p>
              </div>
            ))}
          </motion.div>
        </Section>

      </main>

      <footer className="mx-auto flex max-w-5xl flex-col gap-4 border-t border-[var(--border-hairline)] px-6 py-8 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
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