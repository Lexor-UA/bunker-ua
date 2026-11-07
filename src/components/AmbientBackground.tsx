import React from 'react';

/**
 * UEFA Champions League Broadcast Stadium Night Canvas (#030712 -> #07112E).
 * Combines deep midnight stadium navy, royal blue floodlight beams, subtle
 * championship gold aura, and an architectural starlight pitch grid.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[#030712]"
    >
      {/* Primary UEFA Champions League Royal Navy Stadium Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% -10%, rgba(30, 64, 175, 0.42) 0%, rgba(15, 23, 42, 0.65) 52%, #030712 100%)',
        }}
      />

      {/* Left & Right Stadium Floodlight Cones (Royal Blue + Champions Gold) */}
      <div
        className="absolute inset-x-0 top-0 h-[52rem]"
        style={{
          background:
            'radial-gradient(ellipse 46% 42% at 16% 2%, rgba(37, 99, 235, 0.32) 0%, transparent 70%), radial-gradient(ellipse 44% 40% at 84% 4%, rgba(56, 189, 248, 0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 32% at 50% 0%, rgba(245, 196, 81, 0.14) 0%, transparent 72%)',
        }}
      />

      {/* Mid-Page Deep Champions Arena Glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 50% at 50% 55%, rgba(12, 25, 64, 0.55) 0%, transparent 78%)',
        }}
      />

      {/* UEFA Broadcast Diagonal Tactical Grid & Starlight Dots */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(147, 197, 253, 0.24) 1px, transparent 1px), linear-gradient(135deg, rgba(30, 64, 175, 0.08) 25%, transparent 25%, transparent 50%, rgba(30, 64, 175, 0.08) 50%, rgba(30, 64, 175, 0.08) 75%, transparent 75%, transparent)',
          backgroundSize: '32px 32px, 64px 64px',
          maskImage:
            'radial-gradient(ellipse 85% 70% at 50% 22%, black 15%, transparent 88%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 70% at 50% 22%, black 15%, transparent 88%)',
        }}
      />

      {/* Subtle UEFA Champions Starball Geometric Rings in Upper Right */}
      <svg
        viewBox="0 0 800 800"
        className="absolute -top-44 -right-40 w-[46rem] h-[46rem] opacity-[0.09] text-sky-300"
        fill="none"
      >
        <circle
          cx="400"
          cy="400"
          r="320"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="8 8"
        />
        <circle
          cx="400"
          cy="400"
          r="240"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle
          cx="400"
          cy="400"
          r="160"
          stroke="#F5C451"
          strokeWidth="1.5"
        />
        <path
          d="M400 80 L435 190 L550 190 L458 258 L492 368 L400 300 L308 368 L342 258 L250 190 L365 190 Z"
          stroke="#F5C451"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
