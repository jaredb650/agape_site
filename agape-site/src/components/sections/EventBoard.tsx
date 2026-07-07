"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "@/components/effects/GlitchText";
import FlickerButton from "@/components/effects/FlickerButton";

/* Departures-board events layout.
   Desktop: rows on the left (soonest first — the order the array arrives in),
   a sticky full-poster pane on the right that crossfades to whichever row
   is active. The whole poster is always visible: object-contain over a
   blurred self-fill. Mobile: stacked full-poster cards.
   Every row carries a live T-minus countdown to the event's midnight ET. */

export interface BoardEvent {
  title: string;
  date: string;
  dateISO: string;
  venue: string;
  image: string;
  ticketUrl: string;
  ctaLabel?: string;
}

/* ── Live countdown ────────────────────────────── */

function formatRemaining(ms: number): string {
  if (ms <= 0) return "TONIGHT";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `T-${days}D ${h}:${m}:${sec}`;
}

export function Countdown({ dateISO, className = "" }: { dateISO: string; className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    // Doors ≈ midnight ET on the event date; fine-grained enough for a T-minus readout
    const target = new Date(dateISO + "T00:00:00-04:00").getTime();
    const tick = () => setLabel(formatRemaining(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dateISO]);

  return (
    <span className={`tabular font-mono ${className}`} suppressHydrationWarning>
      {label ?? "T---"}
    </span>
  );
}

/* ── Date block: big pixel day, mono month ─────── */

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function splitDate(dateISO: string) {
  const [y, m, d] = dateISO.split("-");
  return { day: d, month: MONTHS[parseInt(m, 10) - 1] ?? "---", year: `'${y.slice(2)}` };
}

function DateBlock({ dateISO, active }: { dateISO: string; active: boolean }) {
  const { day, month, year } = splitDate(dateISO);
  return (
    <div className="flex w-16 shrink-0 flex-col items-center">
      <span
        className="text-4xl leading-none transition-colors duration-300 md:text-5xl"
        style={{
          fontFamily: "var(--font-pixel)",
          color: active ? "#ff2a2a" : "#f0f0f0",
        }}
      >
        {day}
      </span>
      <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#6d6d6d]">
        {month} {year}
      </span>
    </div>
  );
}

/* ── Poster: whole artwork on a blurred self-fill ─ */

function Poster({ event, dim = false }: { event: BoardEvent; dim?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      {/* blurred fill behind the letterboxed poster */}
      <Image
        src={event.image}
        alt=""
        fill
        aria-hidden="true"
        sizes="10vw"
        className="scale-125 object-cover opacity-40 blur-2xl saturate-50"
      />
      <Image
        src={event.image}
        alt={`${event.title} — event poster`}
        fill
        sizes="(max-width: 1023px) 92vw, 40vw"
        className="object-contain p-3"
        style={{ filter: dim ? "brightness(0.75)" : "none" }}
      />
      <div className="scanlines absolute inset-0 opacity-40" />
    </div>
  );
}

/* ── Desktop row ───────────────────────────────── */

function EventRow({
  event,
  index,
  active,
  onActivate,
}: {
  event: BoardEvent;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <a
      href={event.ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className="group relative block border-t border-[#242424] py-7 pl-4 pr-5 transition-colors duration-300 hover:bg-[rgba(255,255,255,0.025)]"
      aria-label={`${event.title} — ${event.date} at ${event.venue} — ${event.ctaLabel ?? "buy tickets"}`}
    >
      {/* active marker */}
      <motion.span
        className="absolute left-0 top-0 h-full w-[2px] bg-[#ff2a2a]"
        initial={false}
        animate={{ scaleY: active ? 1 : 0 }}
        style={{ originY: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="flex items-center gap-6">
        <DateBlock dateISO={event.dateISO} active={active} />

        <div className="min-w-0 flex-1">
          <h3
            className="line-clamp-2 uppercase text-[#f0f0f0]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              letterSpacing: "0.06em",
              lineHeight: 1.25,
            }}
          >
            <GlitchText text={event.title} lines={2} />
          </h3>
          <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8a8a]">
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Countdown
            dateISO={event.dateISO}
            className={`text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 ${
              active ? "text-[#ff2a2a]" : "text-[#6d6d6d]"
            }`}
          />
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
              active ? "translate-x-0 text-[#f0f0f0] opacity-100" : "translate-x-2 opacity-0"
            }`}
          >
            {event.ctaLabel ?? "Tickets"} →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── Mobile card: full poster, info strip, CTA ──── */

function EventCardMobile({ event }: { event: BoardEvent }) {
  return (
    <div className="border border-[#242424]">
      <div className="relative aspect-[4/5] w-full">
        <Poster event={event} />
        <span
          className="absolute left-3 top-3 border border-[#242424] bg-[rgba(5,5,5,0.75)] px-2.5 py-1"
        >
          <Countdown dateISO={event.dateISO} className="text-[9px] uppercase tracking-[0.15em] text-[#ff2a2a]" />
        </span>
      </div>
      <div className="flex flex-col gap-4 border-t border-[#242424] p-5">
        <div className="flex items-center gap-5">
          <DateBlock dateISO={event.dateISO} active={false} />
          <div className="min-w-0">
            <h3
              className="uppercase text-[#f0f0f0]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "0.06em",
              }}
            >
              {event.title}
            </h3>
            <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8a8a]">
              {event.venue}
            </span>
          </div>
        </div>
        <FlickerButton href={event.ticketUrl} variant="ticket" className="w-full text-[11px] py-2.5">
          {event.ctaLabel ?? "Buy Tickets"}
        </FlickerButton>
      </div>
    </div>
  );
}

/* ── Board ─────────────────────────────────────── */

export default function EventBoard({ events }: { events: BoardEvent[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = events[Math.min(activeIndex, events.length - 1)];

  if (events.length === 0) {
    return (
      <div className="border border-[#242424] px-6 py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8a8a]">
          New dates loading <span className="block-cursor ml-1" style={{ width: "0.45em", height: "0.9em" }} />
        </p>
        <p className="mt-3 font-body text-sm text-[#6d6d6d]">
          Follow{" "}
          <a
            href="https://instagram.com/agapemusic.us"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f0f0f0] underline decoration-[#8b0000] underline-offset-4"
          >
            @agapemusic.us
          </a>{" "}
          for the next announcement.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: rows + sticky poster pane */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col self-start border-b border-[#242424]">
          {events.map((event, i) => (
            <EventRow
              key={event.title + event.dateISO}
              event={event}
              index={i}
              active={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
            />
          ))}
        </div>

        <div className="sticky top-24 self-start">
          <div className="relative aspect-[4/5] w-full border border-[#242424]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.dateISO + active.title}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Poster event={active} />
              </motion.div>
            </AnimatePresence>

            {/* corner ticks over the pane */}
            <span className="pointer-events-none absolute inset-0" aria-hidden="true">
              <span className="absolute -left-px -top-px h-4 w-4 border-l border-t border-[#6d6d6d]" />
              <span className="absolute -right-px -top-px h-4 w-4 border-r border-t border-[#6d6d6d]" />
              <span className="absolute -bottom-px -left-px h-4 w-4 border-b border-l border-[#6d6d6d]" />
              <span className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-[#6d6d6d]" />
            </span>
          </div>

          {/* caption strip + CTA */}
          <div className="flex items-center justify-between gap-4 border-x border-b border-[#242424] px-4 py-3">
            <div className="min-w-0">
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a8a8a]">
                {active.date} — {active.venue}
              </span>
              <Countdown
                dateISO={active.dateISO}
                className="mt-1 block text-[10px] uppercase tracking-[0.15em] text-[#ff2a2a]"
              />
            </div>
            <FlickerButton
              href={active.ticketUrl}
              variant="ticket"
              className="shrink-0 text-[10px] px-5 py-2 whitespace-nowrap"
            >
              {active.ctaLabel ?? "Tickets"}
            </FlickerButton>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked full-poster cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:hidden">
        {events.map((event) => (
          <EventCardMobile key={event.title + event.dateISO} event={event} />
        ))}
      </div>
    </>
  );
}
