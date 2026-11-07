import React from 'react';

/**
 * Contactless NFC Bank Card Symbol (Monobank / Apple Pay style)
 */
export function NfcIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6.5 15.5C8.3 13.7 8.3 10.3 6.5 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 17.8C13 14.6 13 9.4 10 6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13.5 20C17.8 15.6 17.8 8.4 13.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Dual Overlapping Fintech Card Circles (Monobank / Mastercard style)
 */
export function CardNetworkCircles({
  tone = 'gold',
  className = 'w-8 h-5',
}: {
  tone?: 'gold' | 'diia';
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 36 22"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="13"
        cy="11"
        r="9"
        fill={tone === 'gold' ? '#F5C96B' : '#7CC6FE'}
        fillOpacity="0.88"
      />
      <circle
        cx="23"
        cy="11"
        r="9"
        fill={tone === 'gold' ? '#FF7A5C' : '#32E89F'}
        fillOpacity="0.88"
      />
    </svg>
  );
}

/**
 * Photorealistic 3D Golden Championship Trophy with True Alpha-Channel PNG (`/images/trophy-gold-alpha.png`)
 * Zero background box on any surface.
 */
export function VectorGoldTrophy({
  className = 'w-32 h-32',
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-2 rounded-full blur-2xl opacity-75"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(245, 201, 107, 0.44) 0%, rgba(245, 158, 11, 0.14) 55%, transparent 78%)',
        }}
      />
      <img
        src="/images/trophy-gold-alpha.png"
        alt=""
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_14px_28px_rgba(245,201,107,0.32)]"
      />
    </div>
  );
}

/**
 * Photorealistic 3D Emerald Championship Trophy with True Alpha-Channel PNG (`/images/trophy-emerald-alpha.png`)
 * Zero background box on any surface.
 */
export function VectorEmeraldTrophy({
  className = 'w-32 h-32',
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-2 rounded-full blur-2xl opacity-75"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(50, 232, 159, 0.42) 0%, rgba(124, 198, 254, 0.16) 55%, transparent 78%)',
        }}
      />
      <img
        src="/images/trophy-emerald-alpha.png"
        alt=""
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_14px_28px_rgba(50,232,159,0.32)]"
      />
    </div>
  );
}

/**
 * Clean Vector Football Pitch / Arena Schematic for Digital Tournament Passes
 */
export function TacticalPitchArt({
  accent = 'emerald',
  className = 'w-full h-full',
}: {
  accent?: 'emerald' | 'gold' | 'coral';
  className?: string;
}) {
  const strokeColor =
    accent === 'gold'
      ? 'rgba(245, 201, 107, 0.22)'
      : accent === 'coral'
        ? 'rgba(255, 92, 57, 0.22)'
        : 'rgba(130, 206, 255, 0.22)';

  return (
    <svg
      viewBox="0 0 400 180"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Outer Pitch Boundary */}
      <rect
        x="24"
        y="16"
        width="352"
        height="148"
        rx="14"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Halfway Line */}
      <line
        x1="200"
        y1="16"
        x2="200"
        y2="164"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Center Circle */}
      <circle
        cx="200"
        cy="90"
        r="32"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <circle cx="200" cy="90" r="3" fill={strokeColor} />
      {/* Left Penalty Box */}
      <rect
        x="24"
        y="50"
        width="54"
        height="80"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Right Penalty Box */}
      <rect
        x="322"
        y="50"
        width="54"
        height="80"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
}
