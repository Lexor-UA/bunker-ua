import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award, Crown } from 'lucide-react';
import type { User } from '@/lib/types';
import { getSmartInitials } from './ClubCrest';
import { UaFlag } from './UaFlag';

interface ProPlayerCardProps {
  player: User;
  rank: 1 | 2 | 3;
}

/**
 * Clean, Modern Top-3 Podium Player Card — Zero Visual Clutter
 */
export function ProPlayerCard({ player, rank }: ProPlayerCardProps) {
  const actualPlayed = player.wins + player.draws + player.losses;
  const totalMatches = Math.max(1, actualPlayed);
  const winRate =
    actualPlayed > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
  const smartInitials = getSmartInitials(player.nickname);

  const customAvatarUrl =
    player.avatarUrl &&
    player.avatarUrl.trim() !== '' &&
    player.avatarUrl.trim() !== 'monogram'
      ? player.avatarUrl
      : null;

  const theme =
    rank === 1
      ? {
          rankLabel: '#1 в Україні',
          border:
            'border-amber-400/40 hover:border-amber-300/75 shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          bg: 'linear-gradient(155deg, rgba(24, 32, 62, 0.94) 0%, rgba(7, 13, 30, 0.98) 100%)',
          badge:
            'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814]',
          accent: 'text-gold',
          ring: 'ring-amber-300/50',
        }
      : rank === 2
        ? {
            rankLabel: '#2 в Україні',
            border:
              'border-sky-400/35 hover:border-sky-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            bg: 'linear-gradient(155deg, rgba(15, 34, 72, 0.94) 0%, rgba(7, 13, 30, 0.98) 100%)',
            badge: 'bg-sky-300 text-[#040814]',
            accent: 'text-sky-300',
            ring: 'ring-sky-300/50',
          }
        : {
            rankLabel: '#3 в Україні',
            border:
              'border-amber-500/30 hover:border-amber-400/65 shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            bg: 'linear-gradient(155deg, rgba(20, 28, 56, 0.94) 0%, rgba(7, 13, 30, 0.98) 100%)',
            badge: 'bg-amber-400/90 text-[#040814]',
            accent: 'text-amber-300',
            ring: 'ring-amber-400/45',
          };

  return (
    <Link
      href={`/players/${encodeURIComponent(player.nickname)}`}
      className="block group"
    >
      <div
        className={`relative rounded-[28px] border p-6 flex flex-col justify-between gap-5 transition-all duration-300 group-hover:-translate-y-1 ${theme.border}`}
        style={{ background: theme.bg }}
      >
        {/* 1. Top Row: Rank Badge + Season Points */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 ${theme.badge}`}
          >
            {rank === 1 ? (
              <Crown className="w-3.5 h-3.5" />
            ) : (
              <Award className="w-3.5 h-3.5" />
            )}
            <span>{theme.rankLabel}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span
              className={`font-display text-lg font-black tabular-nums ${theme.accent}`}
            >
              {player.seasonPoints}
            </span>
            <span className="text-xs text-slate-400 font-semibold">pts</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-0.5" />
          </div>
        </div>

        {/* 2. Player Identity */}
        <div className="flex items-center gap-4">
          {customAvatarUrl ? (
            <div
              className={`w-14 h-14 rounded-2xl overflow-hidden bg-[#040814] ring-2 shrink-0 ${theme.ring}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customAvatarUrl}
                alt={player.nickname}
                loading="lazy"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-lg text-[#040814] shrink-0 ring-2 shadow-md ${theme.ring}`}
              style={{ backgroundColor: player.avatarColor }}
            >
              {smartInitials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-extrabold text-white truncate group-hover:text-gold transition-colors">
              {player.nickname}
            </h3>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 mt-1">
              <UaFlag className="w-3.5 h-2.5" />
              <span>
                {player.city} • {player.platform}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Clean 3-Column Core Stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-white/[0.08] text-center">
          <div className="py-2 px-2 rounded-xl bg-[#040814]/60">
            <div className="font-mono text-sm font-extrabold text-white tabular-nums">
              {winRate}%
            </div>
            <div className="text-[0.65rem] text-slate-400 mt-0.5">Вінрейт</div>
          </div>

          <div className="py-2 px-2 rounded-xl bg-[#040814]/60">
            <div className="font-mono text-sm font-extrabold text-emerald-400 tabular-nums">
              {player.wins}В / {player.losses}П
            </div>
            <div className="text-[0.65rem] text-slate-400 mt-0.5">Матчі</div>
          </div>

          <div className="py-2 px-2 rounded-xl bg-[#040814]/60">
            <div className="font-mono text-sm font-extrabold text-white tabular-nums">
              {player.goalsFor}:{player.goalsAgainst}
            </div>
            <div className="text-[0.65rem] text-slate-400 mt-0.5">Голи</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
