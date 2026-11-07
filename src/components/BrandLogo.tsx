import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  markOnly?: boolean;
}

/**
 * Official 3D Shield Emblem ("BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"):
 * Uses `/images/bunker-fc-emblem.jpg` (3D dark steel & gold shield with Ukrainian Trident,
 * football, gamepad, and BUNKER FC 1v1 crest).
 */
export function BrandLogo({ size = 'md', markOnly = false }: BrandLogoProps) {
  const iconDims =
    size === 'sm' ? 'w-11 h-11' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  const wordSize =
    size === 'sm'
      ? 'text-[1.1rem]'
      : size === 'lg'
        ? 'text-[1.45rem]'
        : 'text-[1.24rem]';

  return (
    <div className="inline-flex items-center gap-3 shrink-0 select-none group">
      {/* Official 3D BUNKER FC 1v1 Shield Crest */}
      <div
        className={`relative ${iconDims} rounded-[14px] p-[1.5px] bg-gradient-to-br from-amber-300 via-gold to-sky-500 shadow-[0_6px_22px_rgba(245,196,81,0.32),0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-300 group-hover:scale-105 shrink-0`}
      >
        <div className="relative w-full h-full rounded-[12.5px] bg-[#0B0E17] overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/bunker-fc-emblem.jpg"
            alt="BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"
            className="w-full h-full object-cover scale-[1.04] transition-transform duration-500 group-hover:scale-[1.1]"
          />
        </div>
      </div>

      {/* Official Brand Wordmark matching the Crest */}
      {!markOnly && (
        <div className="flex flex-col justify-center leading-none">
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
