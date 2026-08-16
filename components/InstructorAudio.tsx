"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SRC = "/audio/instructor-pitch.mp3";
const BARS = 44;

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function InstructorAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
      el.currentTime = 0;
    };
    const onErr = () => setMissing(true);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", onErr);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("error", onErr);
    };
  }, []);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setMissing(true));
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const seek = useCallback(
    (clientX: number) => {
      const el = ref.current;
      const track = trackRef.current;
      if (!el || !track || !duration) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      el.currentTime = ratio * duration;
      setCurrent(el.currentTime);
    },
    [duration]
  );

  // If the file is not deployed yet, render nothing rather than a dead control.
  if (missing) return <audio ref={ref} src={SRC} preload="metadata" className="hidden" />;

  const progress = duration ? current / duration : 0;
  const label = duration ? `${Math.round(duration)} seconds` : "60 seconds";

  return (
    <div className="flex items-center gap-4 mt-7.5 px-4.5 py-4 border border-white/10 bg-white/[0.02]">
      <audio ref={ref} src={SRC} preload="metadata" />
      <div className="relative w-[42px] h-[42px] shrink-0">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-gold block"
          style={{ animation: playing ? "pulseRing 2.6s ease-out infinite" : "none" }}
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the instructor message" : "Play the instructor message"}
          className="relative w-[42px] h-[42px] rounded-full bg-gold text-ink border-0 cursor-pointer font-mono text-[13px] hover:bg-gold-hover"
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400 truncate">
            {label} — why this program exists
          </span>
          <span className="font-mono text-[10.5px] text-muted-500 tabular-nums shrink-0">
            {fmt(current)} / {fmt(duration)}
          </span>
        </div>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Seek within the instructor message"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 60}
          aria-valuenow={Math.round(current)}
          onClick={(e) => seek(e.clientX)}
          onKeyDown={(e) => {
            const el = ref.current;
            if (!el || !duration) return;
            if (e.key === "ArrowRight") {
              el.currentTime = Math.min(duration, el.currentTime + 5);
              setCurrent(el.currentTime);
            } else if (e.key === "ArrowLeft") {
              el.currentTime = Math.max(0, el.currentTime - 5);
              setCurrent(el.currentTime);
            } else if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              toggle();
            }
          }}
          className="flex items-center gap-[3px] h-6 cursor-pointer"
        >
          {Array.from({ length: BARS }).map((_, i) => {
            const h = 6 + Math.abs(Math.sin(i * 0.7)) * 18;
            const played = i / BARS <= progress;
            const atHead = playing && Math.abs(i / BARS - progress) < 0.07;
            return (
              <span
                key={i}
                className="block w-0.5 transition-colors duration-150"
                style={{
                  height: `${h}px`,
                  background: played ? "#d9b978" : "#3b3833",
                  transformOrigin: "center",
                  animation: atHead ? "wave 1.1s ease-in-out infinite" : "none",
                  animationDelay: `${i * 0.045}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
