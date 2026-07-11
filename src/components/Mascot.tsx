export default function Mascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label="Glootie, the Glutify mascot"
    >
      <ellipse cx="100" cy="205" rx="52" ry="9" fill="#00000014" />

      <path
        d="M100 38 Q78 20 62 26"
        stroke="#4E8B2F"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 38 Q124 16 142 22"
        stroke="#6FBF3E"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 38 L100 52"
        stroke="#4E8B2F"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      <ellipse cx="100" cy="115" rx="68" ry="80" fill="#FFFFFF" stroke="#181811" strokeWidth="3" />

      <circle cx="76" cy="112" r="6.5" fill="#181811" />
      <circle cx="124" cy="112" r="6.5" fill="#181811" />

      <circle cx="66" cy="132" r="10" fill="#F6A6A0" opacity="0.7" />
      <circle cx="134" cy="132" r="10" fill="#F6A6A0" opacity="0.7" />

      <path
        d="M85 140 Q100 152 115 140"
        stroke="#181811"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
