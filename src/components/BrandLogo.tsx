import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  markOnly?: boolean;
}

/**
 * 3D App-Icon Brand Mark ("БУНКЕР UA"):
 * Uses the macro 3D Golden-Emerald Crowned Football Shield (`/images/bunker-logo-v1.jpg`)
 * framed inside a pastel-iridescent squircle that matches the UA pill.
 */
export function BrandLogo({ size = 'md', markOnly = false }: BrandLogoProps) {
  const iconDims =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const wordSize =
    size === 'sm'
      ? 'text-[1.1rem]'
      : size === 'lg'
        ? 'text-[1.45rem]'
        : 'text-[1.24rem]';

  return (
    <div className="inline-flex items-center gap-3 shrink-0 select-none group">
      {/* 3D Golden Crowned Lion Crest in Champions Gold & Royal Navy Frame */}
      <div
        className={`relative ${iconDims} rounded-[14px] p-[1.5px] bg-gradient-to-br from-amber-300 via-gold to-blue-500 shadow-[0_6px_22px_rgba(245,196,81,0.28),0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-300 group-hover:scale-105 shrink-0`}
      >
        <div className="relative w-full h-full rounded-[12.5px] bg-[#050A18] overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/bunker-logo-v3.jpg"
            alt="БУНКЕР UA"
            className="w-full h-full object-cover scale-[1.18] transition-transform duration-500 group-hover:scale-[1.24]"
          />
        </div>
      </div>

      {/* UEFA Champions Broadcast Wordmark + Gold UA Emblem */}
      {!markOnly && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className={`font-display font-extrabold ${wordSize} tracking-[-0.03em] uppercase bg-gradient-to-b from-white via-white to-sky-100 bg-clip-text text-transparent`}
            >
              Бункер
            </span>
            <span className="px-2 py-0.5 rounded-md text-[0.6rem] font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-300 via-gold to-amber-500 text-[#050814] shadow-[0_2px_10px_rgba(245,196,81,0.3)]">
              ★ UA
            </span>
          </div>
          <span className="text-[0.54rem] font-mono font-bold tracking-[0.18em] uppercase text-sky-300/80 mt-0.5">
            EA FC • ЛІГА ЧЕМПІОНІВ 1V1
          </span>
        </div>
      )}
    </div>
  );
}
