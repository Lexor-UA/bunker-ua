import React from 'react';
import type { Club } from '@/lib/types';

const CLUB_NICKNAMES = new Set(['Grizzy', 'Elaizer', 'Tripik']);

export function isClubMemberByNickname(nickname?: string | null): boolean {
  if (!nickname) return false;
  return nickname.startsWith('BRS_') || CLUB_NICKNAMES.has(nickname);
}

export function getSmartInitials(nickname?: string | null): string {
  if (!nickname) return 'UA';
  const clean = nickname.replace(/^BRS_/i, '').trim();
  if (!clean) return 'UA';
  const uppers = clean.match(/[A-ZА-ЯІЇЄҐ]/g);
  if (uppers && uppers.length >= 2) {
    return (uppers[0] + uppers[1]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

interface ClubCrestProps {
  club?: Club | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showStars?: boolean;
  nickname?: string | null;
  seedBadge?: string | null;
}

export function ClubCrest({
  club,
  size = 'md',
  showName = false,
  showStars = false,
  nickname = null,
  seedBadge = null,
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
    const label = seedBadge || (nickname ? getSmartInitials(nickname) : '1v1');
    const isClub = isClubMemberByNickname(nickname);
    const badgeTone = seedBadge
      ? 'border-emerald-400/40 bg-gradient-to-br from-emerald-500/25 via-[#101522] to-[#0B0E17] text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
      : isClub
        ? 'border-amber-400/40 bg-gradient-to-br from-amber-500/25 via-[#141218] to-[#0B0E17] text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.14)]'
        : nickname
          ? 'border-sky-400/35 bg-gradient-to-br from-sky-500/20 via-[#101522] to-[#0B0E17] text-sky-200'
          : 'border-white/15 bg-[#10121A]/85 text-slate-300';

    return (
      <span className="inline-flex items-center gap-2">
        <span
          className={`${dims} inline-flex items-center justify-center rounded-xl border font-mono font-extrabold shrink-0 shadow-inner ${badgeTone}`}
          title={nickname ? `${nickname} • Ultimate Team 1v1` : 'Ultimate Team / Власний склад'}
        >
          {label}
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
