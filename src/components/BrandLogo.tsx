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
      {/* 3D App Icon Squircle */}
      <div
        className={`relative ${iconDims} rounded-[14px] p-[1.5px] diia-iridescent-bg shadow-[0_6px_18px_rgba(0,245,155,0.22),0_4px_12px_rgba(56,189,248,0.2)] transition-all duration-300 group-hover:scale-105 shrink-0`}
      >
        <div className="relative w-full h-full rounded-[12.5px] bg-[#0B0F1A] overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/bunker-logo-v1.jpg"
            alt="БУНКЕР UA"
            className="w-full h-full object-cover scale-[1.16] transition-transform duration-500 group-hover:scale-[1.22]"
          />
        </div>
      </div>

      {/* Clean Wordmark + Iridescent UA Pill */}
      {!markOnly && (
        <div className="flex items-center gap-2 whitespace-nowrap leading-none">
          <span
            className={`font-display font-extrabold ${wordSize} tracking-[-0.03em] uppercase bg-gradient-to-b from-white via-white to-slate-200 bg-clip-text text-transparent`}
          >
            Бункер
          </span>
          <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-extrabold tracking-wider uppercase diia-iridescent-bg text-[#09090B] shadow-sm">
            ua
          </span>
        </div>
      )}
    </div>
  );
}
