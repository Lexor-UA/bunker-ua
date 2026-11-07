'use client';

import React, { useRef, useState } from 'react';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'diia' | 'gold' | 'mint';
}

/**
 * Interactive Monobank Iron / Diia Document Card with smooth physical 3D tilt
 * and cursor-tracking iridescent holographic foil reflection.
 */
export function HoloCard({
  children,
  className = '',
  variant = 'diia',
}: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{
    rotateX: number;
    rotateY: number;
    glowX: number;
    glowY: number;
    active: boolean;
  }>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 30,
    active: false,
  });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // Subtle weighted metal card tilt (max 4 deg)
    const rotateY = (px - 0.5) * 7;
    const rotateX = (0.5 - py) * 7;

    setStyle({
      rotateX,
      rotateY,
      glowX: Math.round(px * 100),
      glowY: Math.round(py * 100),
      active: true,
    });
  }

  function handlePointerLeave() {
    setStyle((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      active: false,
    }));
  }

  const holoGradient =
    variant === 'gold'
      ? `radial-gradient(circle 280px at ${style.glowX}% ${style.glowY}%, rgba(255, 224, 150, 0.22), rgba(228, 199, 255, 0.10) 45%, transparent 75%)`
      : variant === 'mint'
        ? `radial-gradient(circle 280px at ${style.glowX}% ${style.glowY}%, rgba(168, 255, 218, 0.20), rgba(168, 216, 255, 0.12) 45%, transparent 75%)`
        : `radial-gradient(circle 300px at ${style.glowX}% ${style.glowY}%, rgba(168, 216, 255, 0.22), rgba(232, 200, 255, 0.16) 38%, rgba(255, 215, 179, 0.12) 62%, transparent 80%)`;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: style.active
          ? `perspective(1100px) rotateX(${style.rotateX.toFixed(2)}deg) rotateY(${style.rotateY.toFixed(2)}deg) translateY(-3px)`
          : 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: style.active
          ? 'transform 90ms ease-out'
          : 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`relative overflow-hidden will-change-transform ${className}`}
    >
      {/* Cursor-Tracking Diia / Mono Iron Iridescent Foil Reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 mix-blend-screen"
        style={{
          opacity: style.active ? 1 : 0.35,
          background: holoGradient,
        }}
      />
      {/* Top Iridescent Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-[1px] z-20 bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      {children}
    </div>
  );
}

