import React from 'react';

/**
 * Crisp inline SVG Ukrainian Flag pill — immune to Windows Segoe UI Emoji
 * rendering regional indicators as lowercase "ua" letters.
 */
export function UaFlag({ className = 'w-4 h-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={`inline-block shrink-0 rounded-[3px] shadow-sm ring-1 ring-white/20 ${className}`}
      aria-hidden="true"
    >
      <rect width="20" height="7" y="0" fill="#0057B7" />
      <rect width="20" height="7" y="7" fill="#FFD700" />
    </svg>
  );
}

/**
 * Minimalist Monobank IRON / Platinum physical EMV metallic chip + NFC contactless waves.
 */
export function MonoCardChip({
  tone = 'silver',
}: {
  tone?: 'gold' | 'silver';
}) {
  const stroke = tone === 'gold' ? '#F5C96B' : '#D8DCE8';
  const fill =
    tone === 'gold' ? 'rgba(245, 201, 107, 0.16)' : 'rgba(220, 228, 245, 0.14)';

  return (
    <div className="inline-flex items-center gap-2.5" aria-hidden="true">
      {/* Metallic EMV Chip */}
      <svg viewBox="0 0 36 26" className="w-8 h-6 shrink-0">
        <rect
          x="1"
          y="1"
          width="34"
          height="24"
          rx="5"
          fill={fill}
          stroke={stroke}
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <path
          d="M12 1V25M24 1V25M1 9H12M24 9H35M1 17H12M24 17H35"
          stroke={stroke}
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <rect
          x="13.5"
          y="7.5"
          width="9"
          height="11"
          rx="2"
          stroke={stroke}
          strokeOpacity="0.45"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Contactless NFC Waves */}
      <svg viewBox="0 0 18 18" className="w-4 h-4 opacity-60 shrink-0">
        <path
          d="M4.5 11.8a4.5 4.5 0 0 0 0-5.6M7.8 13.6a7.2 7.2 0 0 0 0-9.2M11.2 15.4a10 10 0 0 0 0-12.8"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Custom SVG Monobank-inspired Translucent Glass "Банка Сезону"
 * filled to ~52% with luminous Diia iridescent liquid.
 */
export function MonoPrizeJarSvg({ className = 'w-24 h-28' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 144"
      className={`shrink-0 drop-shadow-[0_12px_28px_rgba(168,216,255,0.18)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="jarLiquid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#74C7FF" />
          <stop offset="36%" stopColor="#C79DFF" />
          <stop offset="72%" stopColor="#FFC08E" />
          <stop offset="100%" stopColor="#6DF2BC" />
        </linearGradient>
        <linearGradient id="jarGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.14)" />
        </linearGradient>
        <clipPath id="jarInterior">
          <rect x="22" y="34" width="76" height="96" rx="20" />
        </clipPath>
      </defs>

      {/* Metallic Jar Lid & Neck */}
      <rect
        x="34"
        y="12"
        width="52"
        height="11"
        rx="5.5"
        fill="url(#jarLiquid)"
        opacity="0.92"
      />
      <rect
        x="38"
        y="23"
        width="44"
        height="8"
        rx="3"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />

      {/* Glass Jar Body Background */}
      <rect
        x="20"
        y="32"
        width="80"
        height="100"
        rx="22"
        fill="rgba(16, 16, 22, 0.85)"
        stroke="url(#jarGlass)"
        strokeWidth="2"
      />

      {/* Iridescent Liquid Fill (~54% height) */}
      <g clipPath="url(#jarInterior)">
        <path
          d="M18 82 Q 40 75, 60 81 T 102 80 L 102 134 L 18 134 Z"
          fill="url(#jarLiquid)"
          opacity="0.88"
        />
        <path
          d="M18 86 Q 42 92, 64 85 T 102 86 L 102 134 L 18 134 Z"
          fill="#FFFFFF"
          opacity="0.16"
        />
      </g>

      {/* Hryvnia Emblem Floating Inside Jar */}
      <circle
        cx="60"
        cy="98"
        r="14"
        fill="rgba(9, 9, 11, 0.72)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.4"
      />
      <text
        x="60"
        y="103.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="16"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        ₴
      </text>

      {/* Left Vertical Specular Glass Highlight */}
      <path
        d="M30 46V114"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="78" cy="54" r="2.2" fill="#FFD7B3" opacity="0.85" />
      <circle cx="48" cy="62" r="1.6" fill="#A8D8FF" opacity="0.85" />
    </svg>
  );
}

