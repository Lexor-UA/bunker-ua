import React, { useId } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  markOnly?: boolean;
}

/**
 * Pleasant Soft-3D Brand Mark ("БУНКЕР UA"):
 * Apple/iOS-inspired tactile 3D squircle with a pastel-iridescent rim,
 * velvet-sapphire 3D cushion, volumetric sky-emerald 3D shield,
 * and a warm 3D golden Championship Trident-Crown centerpiece.
 */
export function BrandLogo({ size = 'md', markOnly = false }: BrandLogoProps) {
  const uid = useId().replace(/:/g, '');
  const iconDims =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const svgDims =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const wordSize =
    size === 'sm'
      ? 'text-[1.1rem]'
      : size === 'lg'
        ? 'text-[1.45rem]'
        : 'text-[1.24rem]';

  return (
    <div className="inline-flex items-center gap-3 shrink-0 select-none group">
      {/* Soft-3D Iridescent Squircle App Icon */}
      <div
        className={`relative ${iconDims} rounded-[14px] p-[1.5px] diia-iridescent-bg shadow-[0_8px_20px_-4px_rgba(56,189,248,0.28),0_4px_12px_rgba(0,245,155,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_10px_24px_-3px_rgba(56,189,248,0.38),0_4px_14px_rgba(0,245,155,0.28)] shrink-0`}
      >
        <div className="relative w-full h-full rounded-[12.5px] bg-gradient-to-br from-[#192338] via-[#101726] to-[#0A0E17] overflow-hidden flex items-center justify-center shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
          {/* Soft ambient glow inside the 3D icon */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#38BDF8]/25 blur-md"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-[#00F59B]/20 blur-md"
          />

          <svg
            viewBox="0 0 40 40"
            fill="none"
            className={`${svgDims} relative z-10 transition-transform duration-300 group-hover:scale-105`}
            aria-hidden="true"
          >
            <defs>
              {/* 3D Outer Shield Volumetric Gradient (Sky -> Mint -> Royal) */}
              <linearGradient
                id={`shield3d-${uid}`}
                x1="8"
                y1="4"
                x2="32"
                y2="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#A5F3FC" />
                <stop offset="35%" stopColor="#38BDF8" />
                <stop offset="72%" stopColor="#00F59B" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* 3D Inner Shield Velvet Cushion */}
              <linearGradient
                id={`inner3d-${uid}`}
                x1="12"
                y1="8"
                x2="28"
                y2="33"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="55%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#090D16" />
              </linearGradient>

              {/* 3D Warm Sunny Gold for Crown/Trident */}
              <linearGradient
                id={`gold3d-${uid}`}
                x1="14"
                y1="10"
                x2="26"
                y2="29"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F5C451" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Top Glossy Specular Highlight */}
              <linearGradient
                id={`gloss-${uid}`}
                x1="20"
                y1="5"
                x2="20"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Soft 3D Elevation Shadow */}
              <filter
                id={`drop3d-${uid}`}
                x="-20%"
                y="-15%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="1.6"
                  floodColor="#020617"
                  floodOpacity="0.65"
                />
              </filter>
            </defs>

            {/* 3D Outer Shield Body with Soft Rounded Corners */}
            <path
              d="M20 4.2C20.7 4.2 21.4 4.4 22 4.7L31.2 8.8C32.5 9.4 33.3 10.7 33.3 12.1V19.6C33.3 26.8 27.9 32.8 21.1 35.4C20.4 35.7 19.6 35.7 18.9 35.4C12.1 32.8 6.7 26.8 6.7 19.6V12.1C6.7 10.7 7.5 9.4 8.8 8.8L18 4.7C18.6 4.4 19.3 4.2 20 4.2Z"
              fill={`url(#shield3d-${uid})`}
              filter={`url(#drop3d-${uid})`}
            />

            {/* 3D Recessed Inner Shield Cushion */}
            <path
              d="M20 7.1C20.5 7.1 21 7.2 21.4 7.4L29.1 10.9C30 11.3 30.5 12.2 30.5 13.2V19.4C30.5 25.2 26.1 30.1 20.7 32.4C20.2 32.6 19.8 32.6 19.3 32.4C13.9 30.1 9.5 25.2 9.5 19.4V13.2C9.5 12.2 10 11.3 10.9 10.9L18.6 7.4C19 7.2 19.5 7.1 20 7.1Z"
              fill={`url(#inner3d-${uid})`}
            />

            {/* Top Glass Specular Sheen on Inner Shield */}
            <path
              d="M20 7.1C20.5 7.1 21 7.2 21.4 7.4L29.1 10.9C30 11.3 30.5 12.2 30.5 13.2V16.5C27.2 18.2 23.7 19 20 19C16.3 19 12.8 18.2 9.5 16.5V13.2C9.5 12.2 10 11.3 10.9 10.9L18.6 7.4C19 7.2 19.5 7.1 20 7.1Z"
              fill={`url(#gloss-${uid})`}
            />

            {/* 3D Sculpted Golden Trident-Crown Emblem */}
            <g filter={`url(#drop3d-${uid})`}>
              {/* Central Spire */}
              <path
                d="M20 11.2L21.6 14.2V25.2L20 27.2L18.4 25.2V14.2L20 11.2Z"
                fill={`url(#gold3d-${uid})`}
              />
              {/* Left & Right Sculpted Wings + Base */}
              <path
                d="M14.2 13.6C14.2 13.6 15.9 14.5 15.9 17.2V20.5C15.9 21.7 16.8 22.6 18 22.6H22C23.2 22.6 24.1 21.7 24.1 20.5V17.2C24.1 14.5 25.8 13.6 25.8 13.6C26.3 15.2 26.8 17.3 26.8 19.9C26.8 23.1 24.5 25.3 21.5 25.6L20 28.2L18.5 25.6C15.5 25.3 13.2 23.1 13.2 19.9C13.2 17.3 13.7 15.2 14.2 13.6Z"
                fill={`url(#gold3d-${uid})`}
              />
              {/* Top Glowing Star Jewel */}
              <circle cx="20" cy="9.4" r="1.25" fill="#FFFBEB" />
            </g>
          </svg>

          {/* Subtle Top 3D Glass Rim Reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent"
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
