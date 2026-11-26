"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SparklesIcon } from "./sparkles-icon";

type Hint = {
  id: number;
  title: string;
  prompt: string;
  reveal: string;
  link?: {
    href: string;
    label: string;
    download?: boolean;
  };
  image?: {
    src: string;
    alt: string;
  };
  availableFrom: Date;
};

type BaseHint = Omit<Hint, "availableFrom">;

const baseHints: BaseHint[] = [
  {
    id: 1,
    title: "Welcome Aboard, Morten",
    prompt: "First day, first clue. Scratch for a welcome tune...",
    reveal:
      "Welcome to the team! Someone here is already your Secret Santa. Start the hunt with the jolliest earworm of them all.",
    link: {
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      label: "Open the welcome carol"
    }
  },
  {
    id: 2,
    title: "Detective Mode",
    prompt: "A week in. Know your way to the coffee yet?",
    reveal:
      "Whoever built this page left fingerprints. Find out where the code lives, and read the README."
  },
  {
    id: 3,
    title: "Getting Warmer",
    prompt: "You've met a few faces by now...",
    reveal: "Your Santa's first name has six letters. Start counting around the office."
  },
  {
    id: 4,
    title: "Final Reveal",
    prompt: "One last hint before the big day.",
    reveal: "Your Santa’s badge in hex: 0x18A93."
  }
];

// Morten starts 1 December 2027. Clues unlock one week apart.
const START_YEAR = 2027;
const UNLOCK_DATES: Record<number, Date> = {
  1: new Date(START_YEAR, 11, 1), // 1/12 – first day
  2: new Date(START_YEAR, 11, 8), // 8/12
  3: new Date(START_YEAR, 11, 15), // 15/12
  4: new Date(START_YEAR, 11, 22) // 22/12 – right before Christmas
};

function formatUnlock(date: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(date);
}

function ScratchCard({
  hint,
  scratched,
  onScratch,
  available
}: {
  hint: Hint;
  scratched: boolean;
  onScratch: () => void;
  available: boolean;
}) {
  const [shimmerSeed] = useState(() => Math.random());

  const shimmerStyle = useMemo(
    () => ({
      animationDelay: `${shimmerSeed * 4}s`
    }),
    [shimmerSeed]
  );

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-card backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-60" />
      <div className="absolute -top-32 right-[-120px] h-72 w-72 rotate-12 rounded-full bg-gradient-to-br from-gold/35 via-holly/25 to-transparent blur-3xl" />
      <div className="relative flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gold">
          <span className="font-semibold">Day {hint.id}</span>
          <span className="text-white/70">{scratched ? "Revealed" : "Hidden"}</span>
        </div>
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-gold" />
          <h3 className="font-festive text-2xl text-white drop-shadow-sm">{hint.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-white/80">
          {scratched ? hint.reveal : hint.prompt}
        </p>
        {scratched && hint.link ? (
          <a
            href={hint.link.href}
            target="_blank"
            rel="noreferrer"
            download={hint.link.download}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-holly px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105 hover:shadow-glow/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {hint.link.label}
            <span aria-hidden>↗</span>
          </a>
        ) : null}
        {scratched && hint.image ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <Image
              src={hint.image.src}
              alt={hint.image.alt}
              width={800}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}
        <div className="mt-auto">
          <button
            type="button"
            onClick={onScratch}
            disabled={!available}
            className="group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            aria-pressed={scratched}
            aria-disabled={!available}
          >
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span>
                {scratched
                  ? "You revealed this clue"
                  : available
                  ? "Scratch to reveal"
                  : "Locked until date"}
              </span>
              <span className="text-gold">
                {available ? "✦" : formatUnlock(hint.availableFrom)}
              </span>
            </div>
            <p className="mt-2 text-xs text-white/70">
              {scratched
                ? "Feel free to revisit this hint anytime."
                : available
                ? "Gently swipe the snow to see what's underneath."
                : "Come back on the unlock date to reveal this hint."}
            </p>
            {!scratched && available && (
              <span
                aria-hidden
                className="scratch-foil pointer-events-none absolute inset-0"
                style={shimmerStyle}
              />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const DEBUG_SHOW_ALL = false; // set to false to enforce unlock schedule
  const availability = useMemo(
    () => new Map<number, Date>(Object.entries(UNLOCK_DATES).map(([id, d]) => [Number(id), d])),
    []
  );

  const [scratchedIds, setScratchedIds] = useState<Set<number>>(new Set());
  const now = useMemo(() => new Date(), []);
  const hints: Hint[] = useMemo(
    () =>
      baseHints.map((hint) => ({
        ...hint,
        availableFrom: DEBUG_SHOW_ALL ? new Date(0) : availability.get(hint.id) ?? new Date(0)
      })),
    [availability, DEBUG_SHOW_ALL]
  );

  const toggleScratch = (id: number) => {
    setScratchedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-16">
      <div className="snowfall pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(247,208,70,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(219,27,58,0.08),transparent_40%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-12 md:px-10 lg:px-16">
        <header className="flex flex-col gap-4 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-gold shadow-glow">
            Secret Santa {START_YEAR}
          </div>
          <h1 className="text-balance font-festive text-4xl text-white drop-shadow-sm sm:text-5xl md:text-6xl">
            Welcome, Morten
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
            New job, new colleagues, and already a Secret Santa. One clue unlocks every week
            in December. Follow all four and you&apos;ll know who&apos;s behind the beard before
            Christmas.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {hints.map((hint) => (
            <ScratchCard
              key={hint.id}
              hint={hint}
              scratched={scratchedIds.has(hint.id)}
              onScratch={() => toggleScratch(hint.id)}
              available={DEBUG_SHOW_ALL || now >= hint.availableFrom}
            />
          ))}
        </section>

        <footer className="mt-4 flex flex-col items-center gap-3 text-center text-xs text-white/70">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
            <SparklesIcon className="h-4 w-4 text-gold" />
            Hosted on Vercel · Share the link, not the secrets.
          </span>
          <p className="max-w-xl text-pretty">
            Pro tip: reveal one clue per day like a mini Advent calendar to keep the suspense
            warm and bright.
          </p>
        </footer>
      </div>
    </main>
  );
}
