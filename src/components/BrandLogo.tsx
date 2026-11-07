import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  markOnly?: boolean;
}

/**
 * Official Transparent Die-Cut 3D Shield Emblem ("BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"):
 * Uses `/images/bunker-fc-crest.png` with precision vector-smooth transparent silhouette.
 */
export function BrandLogo({ size = 'md', markOnly = false }: BrandLogoProps) {
  const crestDims =
    size === 'sm'
      ? 'h-12 w-auto'
      : size === 'lg'
        ? 'h-16 sm:h-20 w-auto'
        : 'h-14 sm:h-[3.75rem] w-auto';

  const wordSize =
    size === 'sm'
      ? 'text-[1.08rem]'
      : size === 'lg'
        ? 'text-[1.45rem]'
        : 'text-[1.24rem]';

  return (
    <div className="inline-flex items-center gap-3.5 shrink-0 select-none group">
      {/* Transparent Die-Cut 3D BUNKER FC 1v1 Shield Crest with Subtle Gold Halo */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-full bg-amber-400/20 blur-md group-hover:bg-amber-400/35 transition-colors"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bunker-fc-crest.png?v=orig1"
          alt="BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"
          className={`relative z-10 ${crestDims} object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105 shrink-0`}
        />
      </div>

      {/* Optically Centered Broadcast Wordmark */}
      {!markOnly && (
        <div className="hidden sm:flex flex-col justify-center leading-none pt-0.5">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className={`font-display font-extrabold ${wordSize} tracking-[-0.02em] uppercase bg-gradient-to-b from-white via-slate-100 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]`}
            >
              BUNKER
            </span>
            <span className="px-2 py-0.5 rounded-md text-[0.62rem] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-300 via-gold to-amber-500 text-[#050814] shadow-[0_2px_10px_rgba(245,196,81,0.35)]">
              FC 1v1
            </span>
          </div>
          <span className="text-[0.54rem] font-mono font-bold tracking-[0.16em] uppercase text-amber-200/85 mt-1">
            UKRAINE • БЛАГОДІЙНА ПЛАТФОРМА
          </span>
        </div>
      )}
    </div>
  );
}
