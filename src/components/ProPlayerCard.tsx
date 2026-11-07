import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Crown, QrCode, Trophy } from 'lucide-react';
import type { User } from '@/lib/types';
import { getSmartInitials, isClubMemberByNickname } from './ClubCrest';
import { HoloCard } from './HoloCard';
import { UaFlag } from './UaFlag';

interface ProPlayerCardProps {
  player: User;
  rank: 1 | 2 | 3;
}

/**
 * Official CYBERLIGA ID Digital Athlete Pass
 */
export function ProPlayerCard({ player, rank }: ProPlayerCardProps) {
  const actualPlayed = player.wins + player.draws + player.losses;
  const totalMatches = Math.max(1, actualPlayed);
  const winRate =
    actualPlayed > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
  const gpg =
    actualPlayed > 0 ? (player.goalsFor / totalMatches).toFixed(1) : '0.0';
  const proOvr = Math.min(
    96,
    Math.max(85, 85 + Math.round(player.seasonPoints / 52))
  );
  const isClub = isClubMemberByNickname(player.nickname);
  const smartInitials = getSmartInitials(player.nickname);

  const customAvatarUrl =
    player.avatarUrl &&
    player.avatarUrl.trim() !== '' &&
    player.avatarUrl.trim() !== 'monogram'
      ? player.avatarUrl
      : null;

  const variant = rank === 1 ? 'gold' : rank === 2 ? 'diia' : 'mint';

  const cardSurfaceClass =
    rank === 1
      ? 'mono-iron-surface'
      : rank === 2
        ? 'diia-card-surface'
        : 'glass-panel-emerald';

  const rankBadgeClass =
    rank === 1
      ? 'bg-gold text-[#09090B]'
      : rank === 2
        ? 'diia-iridescent-bg text-[#09090B]'
        : 'bg-white text-[#09090B]';

  return (
    <Link
      href={`/players/${encodeURIComponent(player.nickname)}`}
      className="block group"
    >
      <HoloCard
        variant={variant}
        className={`rounded-[30px] ${cardSurfaceClass} p-6 flex flex-col justify-between gap-5 transition-transform duration-300 group-hover:-translate-y-1`}
      >
      {/* Top Diia Document Header */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[0.68rem] font-extrabold tracking-tight shadow-sm inline-flex items-center gap-1 ${rankBadgeClass}`}
          >
            {rank === 1 && <Crown className="w-3 h-3" />}
            <span>#{rank} в Україні</span>
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[0.62rem] font-extrabold uppercase tracking-wider border ${
              isClub
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
            }`}
          >
            {isClub ? 'КЛУБ' : 'ФАНАТ'}
          </span>
        </div>

        {player.qualifiedAnnual ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-emerald-400/15 text-pitch border border-emerald-400/30">
            <CheckCircle2 className="w-3 h-3" /> У Фіналі року
          </span>
        ) : actualPlayed === 0 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-emerald-400/15 text-pitch border border-emerald-400/30">
            Старт сезону
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-white/[0.08] text-slate-200 border border-white/10">
            ТОП-3 Сезону
          </span>
        )}
      </div>

      {/* Athlete Identity: Custom Photo OR Clean Club Monogram Shield */}
      <div className="flex items-center gap-4 relative z-10">
        {customAvatarUrl ? (
          <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-[22px] overflow-hidden bg-[#0A0A0D] border border-white/20 shrink-0 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={customAvatarUrl}
              alt={player.nickname}
              loading="lazy"
              width={400}
              height={500}
              className="w-full h-full object-cover object-[50%_15%]"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/85 to-transparent" />
            <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white text-[#09090B] text-[0.62rem] font-extrabold tabular-nums shadow">
              {actualPlayed > 0 ? `${proOvr} OVR` : player.platform}
            </span>
          </div>
        ) : (
          <div
            className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-[22px] overflow-hidden border border-white/25 shrink-0 shadow-2xl flex flex-col items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${player.avatarColor}55, #0B0E17 82%)`,
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg sm:text-xl text-[#09090B] shadow-lg ring-2 ring-white/25"
              style={{ backgroundColor: player.avatarColor }}
            >
              {smartInitials}
            </div>
            <span className="mt-2 px-2.5 py-0.5 rounded-full bg-black/65 border border-white/15 text-slate-200 text-[0.6rem] font-extrabold tabular-nums">
              {actualPlayed > 0 ? `${proOvr} OVR` : player.platform}
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2.5">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white truncate tracking-[-0.03em]">
              {player.nickname}
            </h3>
            <div className="text-xs font-medium text-slate-300 truncate mt-0.5">
              {player.fullName}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10121A]/65 border border-white/15 text-xs font-semibold text-slate-100">
            <UaFlag className="w-3.5 h-2.5" />
            <span className="truncate">
              {player.city} • {player.platform}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="font-display text-2xl font-extrabold text-white tabular-nums leading-none">
              {player.seasonPoints}
            </span>
            <span className="text-xs font-bold text-slate-300">
              очок сезону
            </span>
          </div>
        </div>
      </div>

      {/* Monobank Tactile Metrics Strip + Luminous Diia Verification Bar */}
      <div className="space-y-3 relative z-10">
        {/* Dual-Tone Recessed Metrics Wells */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="py-2.5 rounded-2xl bg-[#10121A]/65 border border-white/10">
            <div className="text-sm font-extrabold text-white tabular-nums">
              {winRate}%
            </div>
            <div className="text-[0.6rem] text-slate-300 mt-0.5">Вінрейт</div>
          </div>
          <div className="py-2.5 rounded-2xl bg-[#10121A]/65 border border-white/10">
            <div className="text-sm font-extrabold text-pitch tabular-nums">
              {player.wins}
            </div>
            <div className="text-[0.6rem] text-slate-300 mt-0.5">Перемог</div>
          </div>
          <div className="py-2.5 rounded-2xl bg-[#10121A]/65 border border-white/10">
            <div className="text-sm font-extrabold text-slate-100 tabular-nums">
              {gpg}
            </div>
            <div className="text-[0.6rem] text-slate-300 mt-0.5">Гол/м</div>
          </div>
          <div className="py-2.5 rounded-2xl bg-[#10121A]/65 border border-white/10">
            <div className="text-sm font-extrabold text-gold inline-flex items-center justify-center gap-1 tabular-nums">
              <Trophy className="w-3.5 h-3.5" />
              <span>{player.tournamentsWon}</span>
            </div>
            <div className="text-[0.6rem] text-slate-300 mt-0.5">Кубки</div>
          </div>
        </div>

        {/* Vivid Diia Iridescent Holographic Document Strip */}
        <div className="p-[1px] rounded-full diia-iridescent-bg">
          <div className="px-3.5 py-1.5 rounded-full bg-[#131620]/95 flex items-center justify-between text-[0.64rem] font-mono text-slate-100">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <QrCode className="w-3.5 h-3.5 text-sky-300" />
              <span>БУНКЕР ID • ВІДКРИТИ ПАСПОРТ</span>
            </span>
            <span className="font-extrabold diia-gradient-text inline-flex items-center gap-1">
              <span>UA • 00{rank}</span>
              <ArrowUpRight className="w-3 h-3 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
      </HoloCard>
    </Link>
  );
}
