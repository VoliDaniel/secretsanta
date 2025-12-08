"use client";

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
  };
  availableFrom: Date;
};

type BaseHint = Omit<Hint, "availableFrom">;

const baseHints: BaseHint[] = [
  {
    id: 1,
    title: "Warming Up",
    prompt: "Scratch for your first tune...",
    reveal: "Start with the jolliest earworm of them all.",
    link: {
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      label: "Open the secret carol"
    }
  },
  {
    id: 2,
    title: "Cozy Clue",
    prompt: "Could your Santa love something comfy?",
    reveal: "Think soft textures and the scent of pine on a winter night."
  },
  {
    id: 3,
    title: "Festive Favorite",
    prompt: "Scratch to find a shared tradition.",
    reveal: "They never skip gingerbread-making day, no matter how busy."
  },
  {
    id: 4,
    title: "Final Reveal",
    prompt: "One last hint before the big day.",
    reveal: "Your match is the one who always sneaks in to switch on the tree lights first."
  }
];

function startOfWeek(date: Date) {
  // Start week on Monday
  const day = date.getDay(); // Sunday 0 ... Saturday 6
  const diff = (day + 6) % 7; // days since Monday
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - diff);
  return start;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

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
            className="inline-flex w-fit items-center gap-2 rounded-full bg-holly px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105 hover:shadow-glow/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {hint.link.label}
            <span aria-hidden>↗</span>
          </a>
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
  const availability = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStart = startOfWeek(todayStart);

    // This Wednesday (or next if already past)
    let thisWednesday = addDays(weekStart, 2);
    if (thisWednesday < todayStart) {
      thisWednesday = addDays(thisWednesday, 7);
    }

    // Next week (relative to current week)
    const nextWeekStart = addDays(weekStart, 7);
    const nextMonday = addDays(nextWeekStart, 0);
    const nextFriday = addDays(nextWeekStart, 4);

    const map = new Map<number, Date>();
    map.set(1, new Date(0)); // always available
    map.set(2, thisWednesday);
    map.set(3, nextMonday);
    map.set(4, nextFriday);
    return map;
  }, []);

  const [scratchedIds, setScratchedIds] = useState<Set<number>>(new Set());
  const now = useMemo(() => new Date(), []);
  const hints: Hint[] = useMemo(
    () =>
      baseHints.map((hint) => ({
        ...hint,
        availableFrom: availability.get(hint.id) ?? new Date(0)
      })),
    [availability]
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
            Secret Santa 2025
          </div>
          <h1 className="text-balance font-festive text-4xl text-white drop-shadow-sm sm:text-5xl md:text-6xl">
            Scratch Calendar of Cozy Clues
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
            Reveal one hint at a time to keep the mystery alive. Four festive clues lead you
            straight to your Secret Santa match—starting with a mischievous carol.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {hints.map((hint) => (
            <ScratchCard
              key={hint.id}
              hint={hint}
              scratched={scratchedIds.has(hint.id)}
              onScratch={() => toggleScratch(hint.id)}
              available={now >= hint.availableFrom}
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
