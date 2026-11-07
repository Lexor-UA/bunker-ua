import React from 'react';
import type { Club } from '@/lib/types';

interface ClubCrestProps {
  club: Club | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showStars?: boolean;
}

export function ClubCrest({
  club,
  size = 'md',
  showName = false,
  showStars = false,
}: ClubCrestProps) {
  const dims =
    size === 'sm'
      ? 'w-7 h-7 text-[0.58rem]'
      : size === 'lg'
        ? 'w-12 h-12 text-xs'
        : size === 'xl'
          ? 'w-16 h-16 text-sm'
          : 'w-9 h-9 text-[0.65rem]';

  if (!club) {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className={`${dims} inline-flex items-center justify-center rounded-xl border border-white/15 bg-[#10121A]/85 font-mono font-extrabold text-slate-300 shrink-0 shadow-inner`}
          title="Ultimate Team / Власний склад"
        >
          FUT
        </span>
        {showName && (
          <span className="text-xs text-slate-400">Власний склад</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 min-w-0">
      <span
        className={`${dims} relative inline-flex items-center justify-center shrink-0 select-none`}
        title={`${club.name} (${club.stars}★ • OVR ${club.ovr})`}
      >
        <svg
          viewBox="0 0 40 44"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
          aria-hidden="true"
        >
          <path
            d="M20 2 L36 8 V21 C36 31.5 28.8 38.8 20 42 C11.2 38.8 4 31.5 4 21 V8 Z"
            fill={club.primaryColor}
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="2"
          />
          <path
            d="M20 2 L36 8 V21 C36 31.5 28.8 38.8 20 42 Z"
            fill={club.secondaryColor}
            fillOpacity="0.84"
          />
          <path
            d="M20 5.5 L33 10.3 V20.8 C33 29.4 27.1 35.6 20 38.4 C12.9 35.6 7 29.4 7 20.8 V10.3 Z"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
          <rect
            x="6"
            y="14"
            width="28"
            height="14"
            rx="3.5"
            fill="rgba(4, 7, 15, 0.86)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="0.8"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono font-extrabold tracking-tighter text-white drop-shadow">
          {club.shortCode}
        </span>
      </span>

      {showName && (
        <span className="flex flex-col min-w-0 leading-tight">
          <span className="text-sm font-semibold text-slate-100 truncate">
            {club.name}
          </span>
          {showStars && (
            <span className="text-[0.7rem] text-amber-300/90 font-mono">
              {club.stars}★ • OVR {club.ovr}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
