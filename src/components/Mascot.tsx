"use client";

import { useEffect, useRef, useState } from "react";
import { Verdict } from "../lib/types";

type MascotState = "idle" | Verdict;

const STATES: Record<MascotState, { fill: string; mouth: string; cheek: number }> = {
  idle: { fill: "#ffffff", mouth: "M78 116 Q90 126 102 116", cheek: 0.5 },
  safe: { fill: "#d9f24b", mouth: "M76 114 Q90 130 104 114", cheek: 0.6 },
  warn: { fill: "#fac775", mouth: "M78 120 Q90 120 102 120", cheek: 0.3 },
  bad: { fill: "#f5c4b3", mouth: "M78 124 Q90 112 102 124", cheek: 0.15 },
};

const BODY_PATH =
  "M90 26 C132 26 150 62 150 96 C150 134 124 156 90 156 C56 156 30 134 30 96 C30 62 48 26 90 26 Z";

function Sprout({ strokeWidth }: { strokeWidth: number }) {
  return (
    <g>
      <path d="M90 26 L90 12" stroke="#639922" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M90 16 Q80 8 74 14 Q80 20 90 18 Z"
        fill="#97c459"
        stroke="#131309"
        strokeWidth={strokeWidth - 1.5}
      />
      <path
        d="M90 20 Q100 12 106 18 Q100 24 90 21 Z"
        fill="#97c459"
        stroke="#131309"
        strokeWidth={strokeWidth - 1.5}
      />
    </g>
  );
}

/** The hero mascot: always idle, gently bobs, blinks periodically. */
export function HeroMascot({ className }: { className?: string }) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 130);
    }, 3400);
    return () => clearInterval(iv);
  }, []);

  const s = STATES.idle;

  return (
    <svg
      width={128}
      height={128}
      viewBox="0 0 180 180"
      role="img"
      aria-label="Glootie the mascot"
      className={`motion-safe:animate-gbob ${className ?? ""}`}
    >
      <ellipse cx="90" cy="162" rx="46" ry="8" fill="#131309" opacity="0.1" />
      <path d={BODY_PATH} fill={s.fill} stroke="#131309" strokeWidth={3.5} />
      <ellipse cx="62" cy="110" rx="9" ry="6" fill="#f0997b" opacity={s.cheek} />
      <ellipse cx="118" cy="110" rx="9" ry="6" fill="#f0997b" opacity={s.cheek} />
      <g
        style={{
          transform: blinking ? "scaleY(0.12)" : "scaleY(1)",
          transformOrigin: "70px 90px",
          transition: "transform .09s ease",
        }}
      >
        <ellipse cx="70" cy="90" rx="10" ry="12" fill="#131309" />
        <circle cx="73" cy="85" r="3" fill="#fff" />
      </g>
      <g
        style={{
          transform: blinking ? "scaleY(0.12)" : "scaleY(1)",
          transformOrigin: "110px 90px",
          transition: "transform .09s ease",
        }}
      >
        <ellipse cx="110" cy="90" rx="10" ry="12" fill="#131309" />
        <circle cx="113" cy="85" r="3" fill="#fff" />
      </g>
      <path d={s.mouth} fill="none" stroke="#131309" strokeWidth={3.5} strokeLinecap="round" />
      <Sprout strokeWidth={2} />
    </svg>
  );
}

/** The result mascot: reacts to the verdict and pops in on every new scan. */
export function ResultMascot({ state }: { state: Verdict }) {
  const s = STATES[state];
  const [popKey, setPopKey] = useState(0);
  const prevState = useRef(state);

  useEffect(() => {
    if (prevState.current !== state) {
      prevState.current = state;
    }
    setPopKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <svg
      key={popKey}
      width={60}
      height={60}
      viewBox="0 0 180 180"
      role="img"
      aria-label="Glootie reacting to the result"
      className="motion-safe:animate-gr-pop"
    >
      <ellipse cx="90" cy="162" rx="46" ry="8" fill="#131309" opacity="0.1" />
      <g className="motion-safe:animate-grbob">
        <path d={BODY_PATH} fill={s.fill} stroke="#131309" strokeWidth={4} />
        <ellipse cx="62" cy="110" rx="9" ry="6" fill="#f0997b" opacity={s.cheek} />
        <ellipse cx="118" cy="110" rx="9" ry="6" fill="#f0997b" opacity={s.cheek} />
        <g>
          <ellipse cx="70" cy="90" rx="10" ry="12" fill="#131309" />
          <circle cx="73" cy="85" r="3" fill="#fff" />
        </g>
        <g>
          <ellipse cx="110" cy="90" rx="10" ry="12" fill="#131309" />
          <circle cx="113" cy="85" r="3" fill="#fff" />
        </g>
        <path d={s.mouth} fill="none" stroke="#131309" strokeWidth={4} strokeLinecap="round" />
        <Sprout strokeWidth={2.5} />
      </g>
    </svg>
  );
}

/** A small static mascot for empty states. */
export function MiniMascot({
  size = 60,
  mood = "idle",
}: {
  size?: number;
  mood?: "idle" | "safe" | "sad";
}) {
  const fill = mood === "safe" ? "#d9f24b" : mood === "sad" ? "#f5c4b3" : "#ffffff";
  const mouth =
    mood === "sad"
      ? "M78 124 Q90 112 102 124"
      : mood === "safe"
        ? "M76 114 Q90 130 104 114"
        : "M78 116 Q90 126 102 116";

  return (
    <svg width={size} height={size} viewBox="0 0 180 180" aria-hidden="true">
      <ellipse cx="90" cy="162" rx="46" ry="8" fill="#131309" opacity="0.1" />
      <path d={BODY_PATH} fill={fill} stroke="#131309" strokeWidth={4} />
      <ellipse cx="70" cy="90" rx="10" ry="12" fill="#131309" />
      <circle cx="73" cy="85" r="3" fill="#fff" />
      <ellipse cx="110" cy="90" rx="10" ry="12" fill="#131309" />
      <circle cx="113" cy="85" r="3" fill="#fff" />
      <path d={mouth} fill="none" stroke="#131309" strokeWidth={4} strokeLinecap="round" />
      <Sprout strokeWidth={2.5} />
    </svg>
  );
}
