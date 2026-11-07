import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Crown, Shield, Star, Trophy } from 'lucide-react';
import type { User } from '@/lib/types';
import { getSmartInitials, isClubMemberByNickname } from './ClubCrest';
import { UaFlag } from './UaFlag';

interface ProPlayerCardProps {
  player: User;
  rank: 1 | 2 | 3;
}

/**
 * Authentic EA SPORTS FC Ultimate Team (FUT) × UEFA Champions League Shield Card
 */
export function ProPlayerCard({ player, rank }: ProPlayerCardProps) {
  const actualPlayed = player.wins + player.draws + player.losses;
  const totalMatches = Math.max(1, actualPlayed);
  const winRate =
    actualPlayed > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
  const gpg =
    actualPlayed > 0 ? (player.goalsFor / totalMatches).toFixed(1) : '0.0';
  const gd = player.goalsFor - player.goalsAgainst;

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

  // Card Edition Theme (Rank 1 = TOTY Gold/Navy, Rank 2 = UCL Royal Blue, Rank 3 = UCL Knockout Emerald)
  const theme =
    rank === 1
      ? {
          edition: 'CHAMPIONS TOTY',
          pos: 'ST',
          outerGlow:
            'hover:shadow-[0_28px_70px_rgba(245,196,81,0.28)] border-amber-300/60',
          bgGradient:
            'linear-gradient(155deg, #1b2448 0%, #0a122c 42%, #241c12 82%, #070b19 100%)',
          accentColor: '#F5C451',
          accentText: 'text-gold',
          badgeBg:
            'bg-gradient-to-r from-amber-300 via-gold to-amber-500 text-[#050814]',
          dividerBorder: 'border-amber-300/35',
          statAccent: 'text-amber-300',
          crestRing: 'ring-amber-300/60 shadow-[0_0_32px_rgba(245,196,81,0.35)]',
        }
      : rank === 2
        ? {
            edition: 'UCL ROAD TO FINAL',
            pos: 'CAM',
            outerGlow:
              'hover:shadow-[0_28px_70px_rgba(56,189,248,0.28)] border-sky-400/55',
            bgGradient:
              'linear-gradient(155deg, #102a63 0%, #09173a 48%, #0c224e 82%, #050b1c 100%)',
            accentColor: '#38BDF8',
            accentText: 'text-sky-300',
            badgeBg:
              'bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 text-[#050814]',
            dividerBorder: 'border-sky-400/35',
            statAccent: 'text-sky-300',
            crestRing:
              'ring-sky-300/60 shadow-[0_0_32px_rgba(56,189,248,0.35)]',
          }
        : {
            edition: 'UCL KNOCKOUT HERO',
            pos: 'CF',
            outerGlow:
              'hover:shadow-[0_28px_70px_rgba(0,245,155,0.24)] border-emerald-400/50',
            bgGradient:
              'linear-gradient(155deg, #0d333e 0%, #081832 50%, #09292b 84%, #050b1a 100%)',
            accentColor: '#00F59B',
            accentText: 'text-pitch',
            badgeBg:
              'bg-gradient-to-r from-emerald-300 via-pitch to-teal-300 text-[#050814]',
            dividerBorder: 'border-emerald-400/35',
            statAccent: 'text-pitch',
            crestRing:
              'ring-emerald-300/60 shadow-[0_0_32px_rgba(0,245,155,0.3)]',
          };

  return (
    <Link
      href={`/players/${encodeURIComponent(player.nickname)}`}
      className="block group"
    >
      <div
        className={`relative rounded-[28px] border-2 p-6 flex flex-col justify-between gap-4 overflow-hidden transition-all duration-300 group-hover:-translate-y-2 shadow-[0_24px_60px_rgba(0,0,0,0.75)] ${theme.outerGlow}`}
        style={{
          background: theme.bgGradient,
        }}
      >
        {/* Inner Metallic FUT Shield Frame & Starball Watermark */}
        <svg
          viewBox="0 0 400 520"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
          fill="none"
          aria-hidden="true"
        >
          {/* Diagonal Stadium Light Beams */}
          <path
            d="M-40 120 L260 -40 L340 -40 L-40 200 Z"
            fill={theme.accentColor}
            fillOpacity="0.18"
          />
          <path
            d="M80 540 L440 180 L440 270 L160 540 Z"
            fill={theme.accentColor}
            fillOpacity="0.12"
          />
          {/* Inner Sculpted FUT Shield Outline */}
          <path
            d="M200 14 L366 46 L366 375 C366 435 295 480 200 506 C105 480 34 435 34 375 L34 46 Z"
            stroke={theme.accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.65"
          />
          {/* UEFA Starball Ring Watermark */}
          <circle
            cx="255"
            cy="145"
            r="88"
            stroke={theme.accentColor}
            strokeWidth="1.2"
            strokeDasharray="6 6"
            strokeOpacity="0.5"
          />
        </svg>

        {/* 1. TOP FUT EDITION HEADER RIBBON */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b border-white/10">
          <span
            className={`px-3 py-1 rounded-md text-[0.65rem] font-extrabold uppercase tracking-wider shadow-md inline-flex items-center gap-1 ${theme.badgeBg}`}
          >
            {rank === 1 ? (
              <Crown className="w-3.5 h-3.5" />
            ) : (
              <Star className="w-3 h-3 fill-current" />
            )}
            <span>#{rank} УКРАЇНА • {theme.edition}</span>
          </span>

          <span className="px-2.5 py-1 rounded-md bg-[#040814]/85 border border-white/15 font-mono text-xs font-extrabold text-white tabular-nums">
            {player.seasonPoints} <span className={theme.accentText}>PTS</span>
          </span>
        </div>

        {/* 2. AUTHENTIC FUT UPPER STAGE: LEFT OVR/POS/FLAG COLUMN + RIGHT ATHLETE CREST */}
        <div className="relative z-10 grid grid-cols-12 items-center gap-3 pt-1">
          {/* Left 4 Cols: Classic FUT Rating Stack */}
          <div className="col-span-4 flex flex-col items-center justify-center py-2 px-2 rounded-2xl bg-[#040814]/70 border border-white/12 shadow-inner">
            <div
              className={`font-display text-4xl sm:text-[2.75rem] font-black leading-none tracking-tighter tabular-nums ${theme.accentText}`}
            >
              {proOvr}
            </div>
            <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-white mt-1">
              {theme.pos}
            </div>

            <div className={`w-10 border-t my-2 ${theme.dividerBorder}`} />

            <UaFlag className="w-6 h-4 shadow-sm" />

            <div className={`w-10 border-t my-2 ${theme.dividerBorder}`} />

            <span
              className={`px-2 py-0.5 rounded text-[0.58rem] font-extrabold uppercase tracking-wider border ${
                isClub
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
              }`}
            >
              {isClub ? 'КЛУБ' : 'ФАНАТ'}
            </span>
          </div>

          {/* Right 8 Cols: Player Portrait or 3D Champions Shield Emblem */}
          <div className="col-span-8 flex flex-col items-center justify-center relative py-2">
            {customAvatarUrl ? (
              <div
                className={`relative w-28 h-32 sm:w-32 sm:h-36 rounded-2xl overflow-hidden bg-[#050914] ring-2 ${theme.crestRing}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customAvatarUrl}
                  alt={player.nickname}
                  loading="lazy"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover object-[50%_15%]"
                />
              </div>
            ) : (
              <div className="relative flex flex-col items-center">
                {/* 3D FUT Shield Emblem with Smart Initials */}
                <div
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-[26px] flex flex-col items-center justify-center ring-2 transition-transform duration-500 group-hover:scale-105 ${theme.crestRing}`}
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${player.avatarColor}66, #060D24 78%)`,
                  }}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-[#050814] shadow-xl"
                    style={{ backgroundColor: player.avatarColor }}
                  >
                    {smartInitials}
                  </div>
                </div>
                <span className=" -mt-2.5 relative z-10 px-3 py-0.5 rounded-full bg-[#040814] border border-white/20 text-[0.65rem] font-mono font-extrabold text-white shadow">
                  {player.platform} • {player.city}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. FUT NAMEPLATE BANNER */}
        <div
          className={`relative z-10 py-2.5 px-3 rounded-xl bg-[#040814]/85 border-y-2 text-center ${theme.dividerBorder}`}
        >
          <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight truncate">
            {player.nickname}
          </h3>
          <div className="flex items-center justify-center gap-3 text-[0.68rem] font-mono text-slate-300 mt-0.5">
            <span>
              <strong className="text-pitch">{player.wins}В</strong> •{' '}
              {player.draws}Н • {player.losses}П
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Голи:{' '}
              <strong className="text-white">
                {player.goalsFor}:{player.goalsAgainst}
              </strong>
            </span>
          </div>
        </div>

        {/* 4. CLASSIC FUT 6-ATTRIBUTE 2x3 GRID */}
        <div className="relative z-10 grid grid-cols-2 gap-x-5 gap-y-1.5 px-3 py-2.5 rounded-2xl bg-[#040814]/65 border border-white/10 font-mono">
          {/* Vertical Center FUT Divider */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-2.5 left-1/2 -translate-x-1/2 border-l ${theme.dividerBorder}`}
          />

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold">ШВД</span>
            <span className="font-extrabold text-white tabular-nums">
              {pacStat}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold">ДРИ</span>
            <span className="font-extrabold text-white tabular-nums">
              {driStat}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold">УДР</span>
            <span className={`font-extrabold tabular-nums ${theme.statAccent}`}>
              {shoStat}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold">ЗАХ</span>
            <span className="font-extrabold text-white tabular-nums">
              {defStat}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold">ПАС</span>
            <span className="font-extrabold text-white tabular-nums">
              {pasStat}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold">ФІЗ</span>
            <span className="font-extrabold text-white tabular-nums">
              {phyStat}
            </span>
          </div>
        </div>

        {/* 5. BOTTOM FUT SHIELD FOOTER: WINRATE + GPG + PASSPORT LINK */}
        <div className="relative z-10 pt-1 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#040814]/80 border border-white/12 text-slate-200 font-bold">
              WIN <strong className="text-pitch">{winRate}%</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#040814]/80 border border-white/12 text-slate-200 font-bold">
              <strong className="text-gold">{gpg}</strong> Г/М
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 font-sans text-xs font-extrabold ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}
          >
            <span>Картка FUT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
