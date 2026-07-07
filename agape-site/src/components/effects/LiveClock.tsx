"use client";

import { useEffect, useState } from "react";

/* Live New York clock — HH:MM:SS EST, mono, hydration-safe
   (renders a placeholder until mounted so prerendered HTML matches). */
export default function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`tabular ${className}`} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </span>
  );
}
