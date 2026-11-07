import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Crown,
  Flame,
  QrCode,
  Shield,
  Trophy,
} from 'lucide-react';
import type { User } from '@/lib/types';
import { getSmartInitials, isClubMemberByNickname } from './ClubCrest';
import { UaFlag } from './UaFlag';

interface ProPlayerCardProps {
  player: User;
  rank: 1 | 2 | 3;
}

/**
 * Official BUNKER FC 1v1 • UKRAINE Top-3 Podium Player Card
 * Combines UEFA Champions League Broadcast Podium aesthetics with EA SPORTS FC Ultimate Team telemetry.
 */
export function ProPlayerCard({ player, rank }: ProPlayerCardProps) {
  const actualPlayed = player.wins + player.draws + player.losses;
  const totalMatches = Math.max(1, actualPlayed);
  const winRate =
    actualPlayed > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
  const gpg =
    actualPlayed > 0 ? (player.goalsFor / totalMatches).toFixed(1) : '0.0';
  const gd = player.goalsFor - player.goalsAgainst;
  const gdFormatted = gd > 0 ? `+${gd}` : `${gd}`;

  // FUT Overall Rating (86..96)
  const proOvr = Math.min(
    96,
    Math.max(
      86,
      86 +
        Math.round(player.seasonPoints / 42) +
        (rank === 1 ? 2 : rank === 2 ? 1 : 0)
    )
  );

  // 6 Classic FUT Attributes derived from real match performance
  const pacStat = Math.min(98, proOvr + 2);
  const shoStat = Math.min(
    98,
    proOvr + (player.goalsFor >= 30 ? 3 : player.goalsFor >= 20 ? 2 : 1)
  );
  const pasStat = Math.min(96, proOvr + (player.wins >= 5 ? 1 : 0));
  const driStat = Math.min(97, proOvr + 1);
  const defStat = Math.min(94, Math.max(82, proOvr - 2 + (gd > 10 ? 2 : 0)));
  const phyStat = Math.min(96, Math.max(84, proOvr + (winRate >= 75 ? 1 : 0)));

  const isClub = isClubMemberByNickname(player.nickname);
  const smartInitials = getSmartInitials(player.nickname);

  const customAvatarUrl =
    player.avatarUrl &&
    player.avatarUrl.trim() !== '' &&
    player.avatarUrl.trim() !== 'monogram'
      ? player.avatarUrl
      : null;

  // Tournament Stage / Achievement Subtitle
  const stageStatus =
    rank === 1
      ? 'Фіналіст Турніру #1 • Посів A1'
      : rank === 2
        ? 'Півфіналіст Турніру #1 • Посів C2'
        : 'Півфіналіст Турніру #1 • Посів E1';

  // Podium Tier Theme: #1 Champions Gold, #2 Platinum Ice Blue, #3 Warm Bronze-Amber
  const theme =
    rank === 1
      ? {
          rankLabel: '#1 В УКРАЇНІ',
          editionLabel: 'ЛІДЕР СЕЗОНУ',
          topBeam: 'from-transparent via-amber-300/90 to-transparent',
          cardBorder:
            'border-amber-400/50 hover:border-amber-300/80 shadow-[0_24px_60px_rgba(0,0,0,0.75)] hover:shadow-[0_28px_70px_rgba(245,196,81,0.22)]',
          bgGradient:
            'linear-gradient(155deg, rgba(28, 36, 68, 0.96) 0%, rgba(9, 17, 40, 0.98) 48%, rgba(36, 26, 12, 0.95) 100%)',
          rankBadge:
            'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] shadow-[0_6px_18px_rgba(245,196,81,0.35)]',
          ovrBadge:
            'bg-amber-400/15 border-amber-300/45 text-amber-200',
          accentText: 'text-gold',
          pointsGlow:
            'bg-gradient-to-r from-amber-200 via-gold to-amber-400 bg-clip-text text-transparent',
          avatarRing:
            'ring-amber-300/60 shadow-[0_12px_30px_rgba(245,196,81,0.28)]',
          statusPill:
            'bg-amber-400/12 border-amber-400/35 text-amber-200',
          footerHover:
            'group-hover:border-amber-400/45 group-hover:bg-amber-400/10',
        }
      : rank === 2
        ? {
            rankLabel: '#2 В УКРАЇНІ',
            editionLabel: 'ВІЦЕ-ЛІДЕР',
            topBeam: 'from-transparent via-sky-300/90 to-transparent',
            cardBorder:
              'border-sky-400/45 hover:border-sky-300/75 shadow-[0_24px_60px_rgba(0,0,0,0.75)] hover:shadow-[0_28px_70px_rgba(56,189,248,0.22)]',
            bgGradient:
              'linear-gradient(155deg, rgba(16, 38, 84, 0.96) 0%, rgba(8, 19, 45, 0.98) 52%, rgba(11, 29, 64, 0.96) 100%)',
            rankBadge:
              'bg-gradient-to-r from-sky-200 via-sky-300 to-blue-400 text-[#040814] shadow-[0_6px_18px_rgba(56,189,248,0.3)]',
            ovrBadge:
              'bg-sky-400/15 border-sky-300/45 text-sky-200',
            accentText: 'text-sky-300',
            pointsGlow:
              'bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent',
            avatarRing:
              'ring-sky-300/60 shadow-[0_12px_30px_rgba(56,189,248,0.25)]',
            statusPill:
              'bg-sky-400/12 border-sky-400/35 text-sky-200',
            footerHover:
              'group-hover:border-sky-400/45 group-hover:bg-sky-400/10',
          }
        : {
            rankLabel: '#3 В УКРАЇНІ',
            editionLabel: 'ТОП-3 СЕЗОНУ',
            topBeam: 'from-transparent via-amber-500/85 to-transparent',
            cardBorder:
              'border-amber-500/40 hover:border-amber-400/70 shadow-[0_24px_60px_rgba(0,0,0,0.75)] hover:shadow-[0_28px_70px_rgba(217,119,6,0.2)]',
            bgGradient:
              'linear-gradient(155deg, rgba(24, 32, 62, 0.96) 0%, rgba(9, 17, 38, 0.98) 52%, rgba(32, 20, 14, 0.96) 100%)',
            rankBadge:
              'bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 text-[#040814] shadow-[0_6px_18px_rgba(245,158,11,0.3)]',
            ovrBadge:
              'bg-amber-500/15 border-amber-400/40 text-amber-200',
            accentText: 'text-amber-300',
            pointsGlow:
              'bg-gradient-to-r from-amber-100 via-amber-300 to-orange-300 bg-clip-text text-transparent',
            avatarRing:
              'ring-amber-400/55 shadow-[0_12px_30px_rgba(217,119,6,0.24)]',
            statusPill:
              'bg-amber-500/12 border-amber-500/35 text-amber-200',
            footerHover:
              'group-hover:border-amber-400/45 group-hover:bg-amber-400/10',
          };

  return (
    <Link
      href={`/players/${encodeURIComponent(player.nickname)}`}
      className="block group"
    >
      <div
        className={`relative rounded-[30px] border p-6 flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 ${theme.cardBorder}`}
        style={{
          background: theme.bgGradient,
        }}
      >
        {/* Top Broadcast Glow Line */}
        <div
          className={`pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r ${theme.topBeam}`}
        />

        {/* Subtle Corner Rank Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-2 -top-4 font-display text-[6.5rem] font-black leading-none text-white/[0.03]"
        >
          #{rank}
        </div>

        {/* 1. TOP BROADCAST HEADER: RANK BADGE + FUT OVR PILL */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[0.68rem] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 ${theme.rankBadge}`}
            >
              {rank === 1 ? (
                <Crown className="w-3.5 h-3.5" />
              ) : (
                <Award className="w-3.5 h-3.5" />
              )}
              <span>{theme.rankLabel}</span>
            </span>
            <span className="text-[0.68rem] font-mono font-bold text-slate-300 hidden sm:inline">
              {theme.editionLabel}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full border text-[0.68rem] font-mono font-extrabold inline-flex items-center gap-1.5 ${theme.statusPill}`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>У Фіналі року</span>
          </span>
        </div>

        {/* 2. MAIN ATHLETE IDENTITY & SEASON POINTS STAGE */}
        <div className="relative z-10 flex items-center gap-4">
          {/* Left: Sculpted 3D Monogram / Portrait Shield with OVR Pill */}
          <div className="relative shrink-0 flex flex-col items-center">
            {customAvatarUrl ? (
              <div
                className={`w-20 h-24 rounded-2xl overflow-hidden bg-[#040814] ring-2 ${theme.avatarRing}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customAvatarUrl}
                  alt={player.nickname}
                  loading="lazy"
                  width={200}
                  height={240}
                  className="w-full h-full object-cover object-[50%_15%]"
                />
              </div>
            ) : (
              <div
                className={`w-20 h-24 rounded-2xl bg-[#040918]/90 border border-white/15 ring-2 flex flex-col items-center justify-center gap-1.5 p-2 ${theme.avatarRing}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-xl text-[#040814] shadow-lg"
                  style={{ backgroundColor: player.avatarColor }}
                >
                  {smartInitials}
                </div>
                <span className="px-2 py-0.5 rounded bg-[#02050D] border border-white/15 font-mono text-[0.58rem] font-extrabold text-white tracking-wider">
                  {proOvr} OVR
                </span>
              </div>
            )}
          </div>

          {/* Right: Nickname, Club Status, City/Platform & Season Points */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-display text-xl sm:text-2xl font-black text-white truncate tracking-tight group-hover:text-gold transition-colors">
                {player.nickname}
              </h3>
              <span
                className={`px-1.5 py-0.5 rounded text-[0.55rem] font-extrabold uppercase tracking-wider shrink-0 border ${
                  isClub
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                }`}
              >
                {isClub ? 'КЛУБ' : 'ФАНАТ'}
              </span>
            </div>

            <div className="text-[0.72rem] text-slate-300 font-medium truncate">
              {stageStatus}
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#040814]/85 border border-white/12 text-[0.68rem] font-bold text-slate-200">
                <UaFlag className="w-3.5 h-2.5" />
                <span>
                  {player.city} • {player.platform}
                </span>
              </span>
            </div>

            <div className="pt-1 flex items-baseline gap-2">
              <span
                className={`font-display text-2xl sm:text-3xl font-black leading-none tabular-nums ${theme.pointsGlow}`}
              >
                {player.seasonPoints}
              </span>
              <span className="text-xs font-bold text-slate-300">
                очок сезону
              </span>
            </div>
          </div>
        </div>

        {/* 3. REAL 4-POD TOURNAMENT TELEMETRY */}
        <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-[#040814]/80 border border-white/10">
            <div className="font-mono text-sm sm:text-base font-extrabold text-white tabular-nums">
              {winRate}%
            </div>
            <div className="text-[0.62rem] text-slate-400 font-semibold mt-0.5">
              Вінрейт
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#040814]/80 border border-white/10">
            <div className="font-mono text-sm sm:text-base font-extrabold text-emerald-400 tabular-nums">
              {player.wins}В
            </div>
            <div className="text-[0.62rem] text-slate-400 font-semibold mt-0.5">
              {actualPlayed} ігор
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#040814]/80 border border-white/10">
            <div className="font-mono text-sm sm:text-base font-extrabold text-white tabular-nums">
              {gpg}
            </div>
            <div className="text-[0.62rem] text-slate-400 font-semibold mt-0.5">
              Гол/М ({gdFormatted})
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#040814]/80 border border-white/10">
            <div
              className={`font-mono text-sm sm:text-base font-extrabold tabular-nums inline-flex items-center justify-center gap-1 ${theme.accentText}`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{rank === 1 ? 'Фінал' : '1/2'}</span>
            </div>
            <div className="text-[0.62rem] text-slate-400 font-semibold mt-0.5">
              Турнір #1
            </div>
          </div>
        </div>

        {/* 4. COMPACT FUT 6-ATTRIBUTE TELEMETRY STRIP */}
        <div className="relative z-10 px-3 py-2 rounded-xl bg-[#030712]/75 border border-white/[0.08] flex items-center justify-between gap-1 text-[0.64rem] font-mono">
          <span>
            <span className="text-slate-400">ШВД </span>
            <strong className="text-white">{pacStat}</strong>
          </span>
          <span className="text-white/15">•</span>
          <span>
            <span className="text-slate-400">УДР </span>
            <strong className={theme.accentText}>{shoStat}</strong>
          </span>
          <span className="text-white/15">•</span>
          <span>
            <span className="text-slate-400">ПАС </span>
            <strong className="text-white">{pasStat}</strong>
          </span>
          <span className="text-white/15">•</span>
          <span>
            <span className="text-slate-400">ДРИ </span>
            <strong className="text-white">{driStat}</strong>
          </span>
          <span className="text-white/15">•</span>
          <span>
            <span className="text-slate-400">ЗАХ </span>
            <strong className="text-white">{defStat}</strong>
          </span>
          <span className="text-white/15">•</span>
          <span>
            <span className="text-slate-400">ФІЗ </span>
            <strong className="text-white">{phyStat}</strong>
          </span>
        </div>

        {/* 5. OFFICIAL BUNKER ID PASSPORT BAR */}
        <div
          className={`relative z-10 px-3.5 py-2.5 rounded-xl bg-[#040814]/85 border border-white/12 flex items-center justify-between gap-2 text-[0.68rem] font-mono transition-colors ${theme.footerHover}`}
        >
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-200">
            <QrCode className={`w-3.5 h-3.5 ${theme.accentText}`} />
            <span>ПАСПОРТ ГРАВЦЯ • ВІДКРИТИ</span>
          </span>
          <span
            className={`inline-flex items-center gap-1 font-extrabold ${theme.accentText}`}
          >
            <span>UA • 00{rank}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
