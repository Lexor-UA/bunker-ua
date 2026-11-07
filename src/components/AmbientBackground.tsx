import React from 'react';

/**
 * Authentic Diia 3.0 Iridescent Mesh x Monobank Graphite Super-App Canvas.
 * Pure, smooth, distraction-free atmospheric mesh without noisy 3D ribbons,
 * engineered so every Monobank/Diia Bento card and physical pass pops with
 * razor-sharp contrast.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[#0D1017]"
    >
      {/* Top Diia Iridescent Aurora Mesh Crown (Soft Cyan + Lavender + Warm Peach + Mint) */}
      <div
        className="absolute inset-x-0 top-0 h-[44rem]"
        style={{
          background:
            'radial-gradient(ellipse 52% 48% at 22% 4%, rgba(124, 198, 254, 0.16) 0%, transparent 72%), radial-gradient(ellipse 48% 44% at 78% 6%, rgba(50, 232, 159, 0.13) 0%, transparent 72%), radial-gradient(ellipse 55% 42% at 50% -6%, rgba(214, 176, 255, 0.15) 0%, rgba(245, 201, 107, 0.07) 48%, transparent 78%)',
        }}
      />

      {/* Subtle Mid-Page Ambient Warmth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 55%, rgba(28, 34, 48, 0.45) 0%, transparent 75%)',
        }}
      />

      {/* Precision Micro-Dot Fintech Texture (Ultra-Subtle) */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 80% 65% at 50% 25%, black 10%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 65% at 50% 25%, black 10%, transparent 85%)',
        }}
      />
    </div>
  );
}
