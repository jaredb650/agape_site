"use client";

import { useEffect, useRef, useState } from "react";
import { Orbitron } from "next/font/google";
import { asset } from "@/lib/asset";

// Ported from the agape-festival repo's Winter Edition hero (src/app/page.tsx).
// Keep dates and links in sync with agape-festival.com.

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-orbitron" });

// Midnight in New York, same target as the festival site's countdown.
const FEST_START = Date.parse("2027-02-19T00:00:00-05:00");
// Banner removes itself once the second day is over (NY time).
const FEST_END = Date.parse("2027-02-21T12:00:00-05:00");
const NOTIFY_URL = "https://laylo.com/agapenyc/GHSBKw";
const FESTIVAL_URL = "https://agape-festival.com/";

function remainingTime(now: number) {
  const seconds = Math.max(0, Math.floor((FEST_START - now) / 1000));
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60, seconds % 60];
}

// Own component so the once-a-second tick re-renders only the digits.
// Starts as "––" so the prerendered HTML matches the first client render.
function Countdown() {
  const [remaining, setRemaining] = useState<number[] | null>(null);
  useEffect(() => {
    const update = () => setRemaining(remainingTime(Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="wfest-countdown" role="timer" aria-label="Countdown to February 19, 2027, midnight New York time">
      {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => (
        <div className="wfest-time" key={label}>
          <span className="wfest-number">{remaining ? String(remaining[index]).padStart(2, "0") : "––"}</span>
          <span className="wfest-unit">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function WinterFestBanner() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => setOver(Date.now() > FEST_END), []);

  // Entrance animation runs once; the video only loads near the viewport and
  // only plays while visible.
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        setLoadVideo(true);
      }
      const v = video.current;
      if (!v) return;
      if (entry.isIntersecting && !userPaused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        v.play().catch(() => setPlaying(false));
      } else {
        v.pause();
      }
    }, { rootMargin: "100px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [userPaused, loadVideo]);

  const toggleVideo = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => setPlaying(false));
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  if (over) return null;

  return (
    <section ref={section} className={`wfest ${orbitron.variable} ${inView ? "is-inview" : ""}`} aria-label="ÄGAPĒ Festival Winter Edition">
      <div className="wfest-background" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative poster under the video */}
        <img className="wfest-poster" src={asset("/media/winter-fest-banner.jpg")} alt="" loading="lazy" />
        {loadVideo && (
          <video ref={video} src={asset("/media/winter-fest-banner.mp4")}
            className={playing ? "is-playing" : ""} muted playsInline loop preload="auto"
            onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        )}
      </div>
      <div className="wfest-vignette" aria-hidden="true" />
      <div className="wfest-scanlines" aria-hidden="true" />
      <div className="wfest-frame" aria-hidden="true"><i /><i /><i /><i /></div>
      <span className="wfest-label">Featured Event</span>

      <div className="wfest-content">
        <h3 className="wfest-logo">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static logo, no optimization needed */}
          <img src={asset("/images/festival/afest-white.png")} alt="ÄGAPĒ Festival" width={586} height={310} />
        </h3>
        <div className="wfest-details">
          <p className="wfest-edition"><span>Winter Edition</span></p>
          <p className="wfest-date"><span>Feb 19–20</span></p>
        </div>
        <div className="wfest-reveal">
          <div className="wfest-divider" aria-hidden="true" />
          <Countdown />
          <div className="wfest-actions">
            <a className="wfest-notify" href={NOTIFY_URL} target="_blank" rel="noopener noreferrer">
              <span className="wfest-notify-glow" aria-hidden="true" />
              Get notified
            </a>
            <a className="wfest-site" href={FESTIVAL_URL} target="_blank" rel="noopener noreferrer">
              agape-festival.com →
            </a>
          </div>
        </div>
      </div>

      {loadVideo && (
        <button className="wfest-motion" type="button" onClick={toggleVideo}
          aria-label={playing ? "Pause background video" : "Play background video"}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            {playing ? <><rect x="4" y="2" width="2" height="12" /><rect x="10" y="2" width="2" height="12" /></> : <path d="M4 2 14 8 4 14Z" />}
          </svg>
        </button>
      )}
    </section>
  );
}
