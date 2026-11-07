import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  markOnly?: boolean;
}

/**
 * Official Transparent Die-Cut 3D Shield Emblem ("BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"):
 * Uses `/images/bunker-fc-crest.png` with a 100% transparent background — no square box or border.
 */
export function BrandLogo({ size = 'md', markOnly = false }: BrandLogoProps) {
  const crestDims =
    size === 'sm'
      ? 'h-12 w-auto'
      : size === 'lg'
        ? 'h-16 sm:h-20 w-auto'
        : 'h-14 sm:h-16 w-auto';

  const wordSize =
    size === 'sm'
      ? 'text-[1.08rem]'
      : size === 'lg'
        ? 'text-[1.45rem]'
        : 'text-[1.22rem]';

  return (
    <div className="inline-flex items-center gap-3 shrink-0 select-none group">
      {/* Transparent Die-Cut 3D BUNKER FC 1v1 Shield Crest (Zero Box, Pure Silhouette) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/bunker-fc-crest.png"
        alt="BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"
        className={`${crestDims} object-contain drop-shadow-[0_6px_18px_rgba(245,196,81,0.28)] transition-transform duration-300 group-hover:scale-105 shrink-0`}
      />

      {/* Clean Broadcast Wordmark */}
      {!markOnly && (
        <div className="hidden sm:flex flex-col justify-center leading-none">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className={`font-display font-extrabold ${wordSize} tracking-[-0.03em] uppercase bg-gradient-to-b from-white via-slate-100 to-amber-200 bg-clip-text text-transparent`}
            >
              BUNKER
            </span>
            <span className="px-2 py-0.5 rounded-md text-[0.62rem] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-300 via-gold to-amber-500 text-[#050814] shadow-[0_2px_10px_rgba(245,196,81,0.35)]">
              FC 1v1
            </span>
          </div>
          <span className="text-[0.54rem] font-mono font-bold tracking-[0.15em] uppercase text-amber-200/85 mt-1">
            UKRAINE • БЛАГОДІЙНА ПЛАТФОРМА
          </span>
        </div>
      )}
    </div>
  );
}
