"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";

import { LoginForm } from "./login-form";
import { CircuitCanvas } from "./components/CircuitCanvas";

const STATS = [
  { label: "Listings", fill: 87 },
  { label: "Orders", fill: 64 },
  { label: "Inventory", fill: 52 },
];

const TICKER_TEXT =
  "■ PRIME VAULT: OPEN  |  KUVA LICH MARKET: 2.4K ACTIVE LISTINGS  |  VOID TRADER: ARRIVING IN 3D 12H  |  TOP TRADE: LATO VANDAL SET +420P  |  NETWORK STATUS: NOMINAL  |  RELAY CONNECTIONS: 4 / 4  |  ■";

// Stagger container variants
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function AuthPage() {
  return (
    <main
      className="relative flex h-screen w-full overflow-hidden"
      style={{ background: "#050c14", color: "#e8f4ff" }}
    >
      {/* Layer 0 — animated circuit grid */}
      <CircuitCanvas />

      {/* Layer 1 — scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-1"
        style={{
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* Layer 2 — vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-2"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* ── LEFT PANEL ── */}
      <section className="relative z-10 flex flex-1 flex-col justify-between p-12 overflow-hidden">
        {/* HUD corner brackets */}
        <HudCorner pos="tl" />
        <HudCorner pos="tr" />
        <HudCorner pos="bl" />
        <HudCorner pos="br" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-10"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <BrandIcon />
            <span
              className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#00e5ff]"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              Warframe Market
            </span>
          </motion.div>

          {/* Hero */}
          <motion.div variants={fadeLeft}>
            <div
              className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#00e5ff]"
              style={{ fontFamily: "Share Tech Mono, monospace" }}
            >
              <span className="inline-block h-px w-7 bg-[#00e5ff]" />
              TENNO TRADE NETWORK
            </div>

            <h1
              className="mb-5 text-[clamp(2rem,3.5vw,3.2rem)] font-black leading-[1.15] text-white"
              style={{
                fontFamily: "Orbitron, monospace",
                textShadow: "0 0 60px rgba(0,229,255,0.2)",
              }}
            >
              Trade Tracking
              <br />
              Built for{" "}
              <span className="text-[#00e5ff]">Fast</span>
              <br />
              Decisions.
            </h1>

            <p
              className="max-w-md text-[12px] leading-loose tracking-wider text-[rgba(180,220,255,0.6)]"
              style={{ fontFamily: "Share Tech Mono, monospace" }}
            >
              &gt; REAL-TIME MARKET DATA ACROSS ALL RELAYS
              <br />
              &gt; INVENTORY SYNC: ENABLED
              <br />
              &gt; STANDING TRACKER: ACTIVE
            </p>
          </motion.div>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="grid max-w-130 grid-cols-3 gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } },
          }}
        >
          {STATS.map((s) => (
            <StatCard key={s.label} label={s.label} fill={s.fill} />
          ))}
        </motion.div>

        {/* Ticker */}
        <div
          className="absolute bottom-6 left-12 right-12 overflow-hidden border-t border-[rgba(0,229,255,0.08)] pt-2"
          style={{ fontFamily: "Share Tech Mono, monospace" }}
        >
          <motion.span
            className="inline-block whitespace-nowrap text-[9px] tracking-[0.2em] text-[rgba(0,229,255,0.3)]"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {TICKER_TEXT}
          </motion.span>
        </div>
      </section>

      {/* ── VERTICAL DIVIDER ── */}
      <motion.div
        className="relative z-10 w-px flex-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,229,255,0.6) 20%, rgba(0,229,255,0.6) 80%, transparent)",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glow pip */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.75 h-10 bg-[#00e5ff]"
          style={{ boxShadow: "0 0 20px #00e5ff, 0 0 40px #00e5ff" }}
        />
      </motion.div>

      {/* ── RIGHT PANEL (auth) ── */}
      <motion.section
        className="relative z-10 flex w-120 flex-none items-center justify-center overflow-hidden px-14 py-12"
        style={{ background: "rgba(5,15,28,0.92)", borderLeft: "1px solid rgba(0,229,255,0.25)" }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ambient glow blob */}
        <div
          className="pointer-events-none absolute -right-48 -top-48 h-96 w-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Scan sweep */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-0.5"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)",
          }}
          animate={{ top: ["-2px", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Corner brackets */}
        <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-[rgba(0,229,255,0.6)]" />
        <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-[rgba(0,229,255,0.6)]" />

        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </motion.section>
    </main>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────

function HudCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const classes = {
    tl: "top-4 left-4 border-t border-l",
    tr: "top-4 right-4 border-t border-r",
    bl: "bottom-4 left-4 border-b border-l",
    br: "bottom-4 right-4 border-b border-r",
  }[pos];
  return (
    <div
      className={`absolute h-6 w-6 border-[rgba(0,229,255,0.5)] ${classes}`}
    />
  );
}

function BrandIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <polygon
        points="18,2 34,28 2,28"
        fill="none"
        stroke="#00e5ff"
        strokeWidth="1.5"
      />
      <polygon
        points="18,8 28,26 8,26"
        fill="rgba(0,229,255,0.1)"
        stroke="#00e5ff"
        strokeWidth="1"
      />
      <circle cx="18" cy="20" r="3" fill="#00e5ff" opacity="0.9" />
      <line
        x1="18"
        y1="8"
        x2="18"
        y2="14"
        stroke="#00e5ff"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

function StatCard({ label, fill }: { label: string; fill: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${fill}%`;
    }, 900);
    return () => clearTimeout(timeout);
  }, [fill]);

  return (
    <motion.div
      
      variants={fadeUp}
      className="relative border border-[rgba(0,229,255,0.25)] bg-[rgba(0,229,255,0.04)] p-4 transition-colors duration-300 hover:border-[rgba(0,229,255,0.6)] hover:bg-[rgba(0,229,255,0.07)]"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      }}
    >
      {/* Top-right chamfer accent */}
      <div
        className="absolute right-0 top-0 border-r-12 border-t-12 border-[rgba(0,229,255,0.6)]"
        style={{ borderLeftColor: "transparent", borderBottomColor: "transparent" }}
      />

      <p
        className="mb-3 text-[10px] tracking-[0.2em] uppercase text-[rgba(180,220,255,0.6)]"
        style={{ fontFamily: "Share Tech Mono, monospace" }}
      >
        {label}
      </p>

      {/* Bar */}
      <div className="relative mb-2 h-0.75 overflow-hidden bg-[rgba(0,229,255,0.15)]">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 bg-linear-to-r from-[#00b8cc] to-[#00e5ff] shadow-[0_0_8px_#00e5ff] transition-[width] duration-[1.5s] ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ width: "0%" }}
        />
      </div>

      <div className="h-0.5 w-[55%] bg-[rgba(0,229,255,0.1)]" />
    </motion.div>
  );
}
