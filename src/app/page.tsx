import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Crown,
  QrCode,
  Radio,
  Scale,
  ShieldCheck,
  Shuffle,
  Swords,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import {
  computeGroupStandings,
  getLeaderboard,
  getRecentTickerMatches,
  getTournamentMatches,
  listTournaments,
} from '@/lib/tournament-engine';
import { getClubById } from '@/lib/clubs';
import {
  ClubCrest,
  getSmartInitials,
  isClubMemberByNickname,
} from '@/components/ClubCrest';
import {
  VectorEmeraldTrophy,
  VectorGoldTrophy,
} from '@/components/FintechArt';
import { HoloCard } from '@/components/HoloCard';
import { HomeArenaShowcase } from '@/components/HomeArenaShowcase';
import { ProPlayerCard } from '@/components/ProPlayerCard';
import { MonoPrizeJarSvg, UaFlag } from '@/components/UaFlag';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const tournaments = listTournaments();
  const top8Players = getLeaderboard().slice(0, 8);
  const top3Players = top8Players.slice(0, 3);
  const recentMatches = getRecentTickerMatches(6);

  const liveOctoberCup =
    tournaments.find((t) => t.status === 'PLAYOFF') || tournaments[0];
  const openNovemberCup =
    tournaments.find((t) => t.status === 'REGISTRATION') || tournaments[1];

  const arenaMatches = liveOctoberCup
    ? getTournamentMatches(liveOctoberCup.id)
    : [];
  const arenaStandings = liveOctoberCup
    ? computeGroupStandings(liveOctoberCup.id)
    : {};

  const featuredMatch =
    recentMatches.find((m) => m.status === 'DISPUTED') ||
    recentMatches.find((m) => m.playoffRound === 'SF') ||
    recentMatches[0];

  const novCount = openNovemberCup?.participantCount ?? 0;
  const novMax = openNovemberCup?.maxPlayers ?? 16;
  const novFillPct = Math.min(100, Math.round((novCount / novMax) * 100));

  const showcaseDraftClubs = ['rma', 'mci', 'shk', 'dyn']
    .map((id) => getClubById(id))
    .filter(Boolean);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 space-y-20 pb-10">
      {/* 1. UEFA CHAMPIONS LEAGUE BROADCAST HERO + LIVE MATCHDAY SCOREBOARD */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Columns: UEFA Champions League Night Stadium Broadcast Card */}
        <div className="lg:col-span-7 glass-panel rounded-[36px] p-8 sm:p-11 flex flex-col justify-between gap-8 relative overflow-hidden border border-sky-400/25 shadow-[0_28px_80px_rgba(2,6,23,0.85)]">
          {/* Top UEFA Starball Royal Blue & Trophy Gold Broadcast Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] diia-iridescent-bg"
          />

          {/* Subtle Atmospheric 3D Night Stadium Backdrop on Right */}
          <img
            src="/images/hero-arena.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 w-[82%] h-[86%] object-cover opacity-55 mix-blend-screen saturate-125"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse 75% 75% at 72% 38%, #000 22%, rgba(0,0,0,0.5) 58%, transparent 96%)',
              maskImage:
                'radial-gradient(ellipse 75% 75% at 72% 38%, #000 22%, rgba(0,0,0,0.5) 58%, transparent 96%)',
            }}
          />

          {/* Stadium Floodlight Beam */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-16 w-96 h-60 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#F5C451]"
          />

          {/* Top Bar: Official Season Broadcast Badge + Cross-Play */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#07112E]/90 border border-amber-400/35 text-xs font-extrabold text-white backdrop-blur-md shadow-[0_0_25px_rgba(245,196,81,0.22)]">
              <UaFlag className="w-4 h-3" />
              <span className="tracking-wide uppercase">
                СЕЗОН 2026/27 • БЛАГОДІЙНА ЛІГА НА ПІДТРИМКУ ЗСУ
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#04091A]/90 border border-sky-400/25 text-xs font-extrabold text-sky-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-pitch animate-pulse" />
              <span>EA SPORTS FC • PS5 / PC / XBOX</span>
            </div>
          </div>

          {/* Center Stage: Harmonious Headline + Studio Spotlight Pedestal for 3D BUNKER FC 1v1 Crest */}
          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 items-center gap-6 my-auto py-1">
            <div className="xl:col-span-8 space-y-5">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.16em] text-gold">
                  <Trophy className="w-3.5 h-3.5 shrink-0" />
                  <span>ОФІЦІЙНА КІБЕРФУТБОЛЬНА АРЕНА УКРАЇНИ</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl xl:text-[3.05rem] font-extrabold tracking-[-0.035em] text-white leading-[1.06] uppercase">
                  <span className="block">Українська</span>
                  <span className="block">Ліга Чемпіонів</span>
                  <span className="block mt-1.5 diia-gradient-text whitespace-nowrap">
                    1 на 1 в EA SPORTS FC
                  </span>
                </h1>

                <p className="text-sm sm:text-[0.95rem] text-slate-200/95 leading-relaxed max-w-xl pt-0.5">
                  Груповий етап у 2 кола, олімпійська сітка Плей-офф, офіційні
                  FUT-картки гравців та головний приз —{' '}
                  <strong className="text-gold">
                    пам’ятний трофей від воїнів ЗСУ
                  </strong>
                  . Усі 100% донатів передаємо фонду{' '}
                  <strong className="text-white">Project Ukraine</strong>!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/tournaments/${openNovemberCup?.slug ?? 'november-cup-2026'}`}
                  className="group inline-flex items-center gap-3 pl-5 pr-4 py-3.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 font-extrabold text-xs sm:text-sm shadow-[0_14px_36px_rgba(245,196,81,0.35)] hover:scale-[1.01] transition-all"
                >
                  <span>Подати заявку на Турнір #2</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#040814] text-gold text-xs font-extrabold tabular-nums">
                    {novCount}/{novMax}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#040814] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-full bg-[#0A193D]/90 hover:bg-[#122B66] border border-sky-400/40 text-xs sm:text-sm font-extrabold text-white backdrop-blur-xl transition-all shadow-[0_10px_28px_rgba(37,99,235,0.25)]"
                >
                  <Radio className="w-3.5 h-3.5 text-[#FF5C39] animate-pulse shrink-0" />
                  <span>Матч-центр LIVE</span>
                </Link>

                <a
                  href="https://send.monobank.ua/jar/6aFeFX1Lk2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-[#060E24]/90 hover:bg-amber-400/15 border border-amber-400/35 text-xs sm:text-sm font-extrabold text-gold backdrop-blur-xl transition-all"
                >
                  <span>🫙 Банка ЗСУ</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Official 3D BUNKER FC 1v1 Shield Emblem on Champions Halo Pedestal */}
            <div className="hidden sm:flex xl:col-span-4 items-center justify-center relative py-2">
              {/* Soft Dark-Navy + Gold Radial Aura so stadium background never clashes with the crest */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute w-56 h-56 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(4,9,26,0.82) 0%, rgba(245,196,81,0.18) 52%, rgba(37,99,235,0.12) 72%, transparent 100%)',
                }}
              />
              {/* Subtle Concentric Champions Ring */}
              <svg
                aria-hidden="true"
                viewBox="0 0 240 240"
                className="pointer-events-none absolute w-56 h-56 xl:w-60 xl:h-60 opacity-45"
              >
                <circle
                  cx="120"
                  cy="120"
                  r="106"
                  fill="none"
                  stroke="#F5C451"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="92"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="0.75"
                  strokeOpacity="0.6"
                />
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/bunker-fc-crest.png"
                alt="BUNKER FC 1v1 • UKRAINE БЛАГОДІЙНА ПЛАТФОРМА"
                className="relative z-10 w-48 xl:w-56 h-auto object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bottom 3 Broadcast Telemetry Pods */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-[24px] bg-[#040A1C]/90 border border-sky-400/20 flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.65rem] font-mono uppercase tracking-wider text-sky-300 font-bold">
                  БЛАГОДІЙНИЙ ФОНД ЗСУ
                </div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-white tabular-nums mt-0.5">
                  2 145 <span className="text-gold">₴</span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Внесок від 10 ₴ • Project Ukraine
                </div>
              </div>
              <MonoPrizeJarSvg className="w-10 h-10 shrink-0" />
            </div>

            <div className="p-4 rounded-[24px] bg-[#040A1C]/90 border border-sky-400/20 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[0.65rem] font-mono uppercase tracking-wider text-sky-300 font-bold truncate">
                  ФОРМАТ ЛІГИ ЧЕМПІОНІВ
                </span>
                <span className="text-[0.62rem] font-extrabold text-pitch whitespace-nowrap shrink-0">
                  2 КОЛА + ПО
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  Групи <span className="text-sky-400">A–E</span>
                </div>
                <div className="flex items-center -space-x-2">
                  {showcaseDraftClubs.slice(0, 3).map((club) =>
                    club ? (
                      <div
                        key={club.id}
                        className="ring-2 ring-[#040A1C] rounded-full"
                      >
                        <ClubCrest club={club} size="sm" />
                      </div>
                    ) : null
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Вільний графік (1 тиждень на групу)
              </div>
            </div>

            <div className="p-4 rounded-[24px] bg-[#040A1C]/90 border border-amber-400/30 flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.65rem] font-mono uppercase tracking-wider text-gold font-bold">
                  ГОЛОВНА НАГОРОДА
                </div>
                <div className="font-display text-lg sm:text-xl font-extrabold text-gold mt-0.5">
                  Трофей від ЗСУ
                </div>
                <div className="text-xs text-amber-100/90 font-semibold mt-0.5">
                  Ексклюзив від воїнів України
                </div>
              </div>
              <div className="w-11 h-11 shrink-0">
                <VectorGoldTrophy className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: UEFA CHAMPIONS LEAGUE LIVE MATCHDAY SCOREBOARD (3 DECISIVE MATCHES + PROGRESS) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="h-full rounded-[36px] glass-panel p-6 sm:p-7 flex flex-col justify-between gap-4 relative overflow-hidden border border-sky-400/30 shadow-[0_28px_80px_rgba(2,6,23,0.9)]">
            {/* Top Gold/Blue Broadcast Strip */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#F5C451] to-[#38BDF8]"
            />

            {/* Header: Matchday Broadcast Studio */}
            <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-sky-400/20">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5C39] text-white text-[0.68rem] font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,92,57,0.45)]">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>LIVE ТАБЛО</span>
                </span>
                <div>
                  <div className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Благодійний Турнір #1 • Плей-офф
                  </div>
                  <div className="text-[0.68rem] text-sky-300 font-semibold">
                    Стадія вирішальних матчів • 18 учасників (Групи A–E)
                  </div>
                </div>
              </div>

              <Link
                href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                className="w-9 h-9 rounded-full bg-sky-500/15 hover:bg-gold hover:text-[#040814] border border-sky-400/30 text-white flex items-center justify-center transition-colors shrink-0"
                title="Відкрити Матч-центр"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Harmonious Broadcast Match Cards */}
            <div className="relative z-10 space-y-3 my-auto">
              {/* MATCH 1: GRAND FINAL SHOWCASE */}
              <Link
                href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                className="block rounded-[24px] mono-iron-surface p-4 border border-amber-400/40 hover:border-amber-300/75 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold text-[#040814] text-[0.62rem] font-extrabold uppercase tracking-wider">
                    <Crown className="w-3 h-3" />
                    <span>ГРАНД-ФІНАЛ КУБКА</span>
                  </span>
                  <span className="text-[0.65rem] font-mono font-bold text-amber-200">
                    🏆 За пам’ятну нагороду від ЗСУ
                  </span>
                </div>

                <div className="grid grid-cols-11 items-center gap-2">
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                    <ClubCrest
                      nickname="BRS_Nederfox"
                      seedBadge="A1"
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="font-display text-xs sm:text-sm font-extrabold text-white truncate">
                        BRS_Nederfox
                      </div>
                      <div className="text-[0.64rem] text-gold font-bold">
                        8:5 у 1/2 • Фіналіст
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <span className="px-2 py-0.5 rounded-lg bg-[#040814]/90 border border-amber-400/40 font-mono text-[0.62rem] font-extrabold text-gold">
                      VS
                    </span>
                  </div>

                  <div className="col-span-5 flex items-center justify-end gap-2.5 min-w-0 text-right">
                    <div className="min-w-0">
                      <div className="font-display text-xs sm:text-sm font-extrabold text-slate-100 truncate">
                        Переможець 1/2
                      </div>
                      <div className="text-[0.64rem] text-sky-300 font-semibold truncate">
                        YoungChamp18 / Elaizer
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-[#040814]/90 border border-amber-400/35 flex items-center justify-center shrink-0">
                      <VectorGoldTrophy className="w-7 h-7" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* MATCH 2: SEMI-FINAL #2 LIVE */}
              <Link
                href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                className="block rounded-[24px] bg-[#050E26]/95 p-4 border border-sky-400/35 hover:border-sky-300/70 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-[0.62rem] font-extrabold uppercase tracking-wider">
                    <Swords className="w-3 h-3 text-pitch" />
                    <span>ПІВФІНАЛ #2 • LIVE МАТЧ ТИЖНЯ</span>
                  </span>
                  <span className="text-[0.65rem] font-mono font-bold text-pitch">
                    До 2 перемог (BO3)
                  </span>
                </div>

                <div className="grid grid-cols-11 items-center gap-2">
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                    <ClubCrest
                      nickname="BRS_YoungChamp18"
                      seedBadge="E1"
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="font-display text-xs sm:text-sm font-extrabold text-white truncate">
                        BRS_YoungChamp18
                      </div>
                      <div className="text-[0.64rem] text-slate-300">
                        Київ • 42 голи
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <span className="px-2 py-0.5 rounded-lg bg-[#040814] border border-sky-400/30 font-mono text-[0.65rem] font-extrabold text-white">
                      —:—
                    </span>
                  </div>

                  <div className="col-span-5 flex items-center justify-end gap-2.5 min-w-0 text-right">
                    <div className="min-w-0">
                      <div className="font-display text-xs sm:text-sm font-extrabold text-white truncate">
                        Elaizer
                      </div>
                      <div className="text-[0.64rem] text-slate-300">
                        Львів • 5:3 у 1/4
                      </div>
                    </div>
                    <ClubCrest nickname="Elaizer" seedBadge="C2" size="md" />
                  </div>
                </div>
              </Link>

              {/* MATCH 3: BRONZE FINAL (3RD PLACE MATCH) */}
              <Link
                href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                className="block rounded-[24px] bg-[#040A1E]/90 p-3.5 border border-white/12 hover:border-amber-400/40 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-200 text-[0.6rem] font-mono font-extrabold uppercase tracking-wider">
                    <span>🥉 МАТЧ ЗА 3 МІСЦЕ • БРОНЗОВИЙ ФІНАЛ</span>
                  </span>
                  <span className="text-[0.64rem] font-mono font-bold text-slate-300">
                    +135 pts рейтингу
                  </span>
                </div>

                <div className="grid grid-cols-11 items-center gap-2">
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                    <ClubCrest
                      nickname="BRS_Hasfer23"
                      seedBadge="C1"
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="font-display text-xs font-extrabold text-white truncate">
                        BRS_Hasfer23
                      </div>
                      <div className="text-[0.62rem] text-slate-400">
                        Київ • 5:4 у 1/4
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <span className="px-1.5 py-0.5 rounded bg-[#040814] border border-white/15 font-mono text-[0.6rem] font-bold text-slate-300">
                      VS
                    </span>
                  </div>

                  <div className="col-span-5 flex items-center justify-end gap-2 min-w-0 text-right">
                    <div className="min-w-0">
                      <div className="font-display text-xs font-bold text-slate-300 truncate">
                        Суперник із 1/2
                      </div>
                      <div className="text-[0.62rem] text-slate-400 truncate">
                        Очікується після 1/2
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Footer: Progress Bar + Open Full Bracket Button */}
            <div className="relative z-10 pt-2.5 border-t border-sky-400/20 flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[0.68rem] font-semibold">
                  <span className="text-slate-300">Прогрес Турніру #1</span>
                  <span className="text-pitch font-mono font-extrabold">
                    38 / 41 матчів (93%)
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#040814] overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full diia-iridescent-bg"
                    style={{ width: '93%' }}
                  />
                </div>
              </div>

              <Link
                href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-gold hover:text-[#040814] border border-white/15 text-xs font-extrabold text-white inline-flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>Сітка Плей-офф</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOURNAMENTS OF THE SEASON — UEFA CHAMPIONS LEAGUE BROADCAST PANELS */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-gold font-extrabold">
              <Trophy className="w-3.5 h-3.5" />
              <span>КАЛЕНДАР СЕЗОНУ 2026/27 • BUNKER FC 1v1 UKRAINE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.03em] uppercase">
              Турніри сезону
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#060E24]/90 border border-sky-400/25 text-xs font-bold text-sky-200">
              <span className="w-2 h-2 rounded-full bg-pitch animate-pulse" />
              <span>Система Ліги Чемпіонів (Групи + ПО)</span>
            </span>

            <Link
              href="/tournaments"
              className="px-5 py-2.5 rounded-full glass-panel hover:bg-gold hover:text-[#040814] text-xs font-extrabold text-white inline-flex items-center gap-2 transition-all"
            >
              <span>Усі турніри</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Harmonious Tournament Cards (2 Monthly Cups + Full-Width Grand Final Banner) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {tournaments.map((t) => {
            const isAnnual = t.cupType === 'ANNUAL';
            const isPlayoff =
              t.status === 'PLAYOFF' || t.status === 'GROUP_STAGE';
            const count = t.participantCount ?? 0;
            const fillPct = Math.min(
              100,
              Math.round((count / t.maxPlayers) * 100)
            );
            const displayTitle = t.title.replace('БУНКЕР UA', 'BUNKER FC 1v1');

            const top3Prizes =
              t.prizeBreakdown.length >= 3
                ? t.prizeBreakdown.slice(0, 3)
                : [
                    {
                      place: '1 місце',
                      amountUah: 0,
                      points: isAnnual ? 1000 : 250,
                      badge: 'Трофей від воїнів ЗСУ',
                    },
                    {
                      place: '2 місце',
                      amountUah: 0,
                      points: isAnnual ? 700 : 180,
                      badge: 'Срібний фіналіст',
                    },
                    {
                      place: '3 місце',
                      amountUah: 0,
                      points: isAnnual ? 500 : 135,
                      badge: 'Бронзовий призер',
                    },
                  ];

            const headerBackdrop = isAnnual
              ? '/images/banner-grand-final.jpg'
              : isPlayoff
                ? '/images/hero-arena.jpg'
                : '/images/banner-kickoff-draft.jpg';

            const rankBadges = ['I МІСЦЕ', 'II МІСЦЕ', 'III МІСЦЕ', 'IV МІСЦЕ'];

            if (isAnnual) {
              const annualPrizes =
                t.prizeBreakdown.length >= 4
                  ? t.prizeBreakdown.slice(0, 4)
                  : [
                      ...top3Prizes,
                      {
                        place: '4 місце',
                        amountUah: 0,
                        points: 350,
                        badge: 'Півфіналіст року',
                      },
                    ];

              return (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.slug}`}
                  className="lg:col-span-2 group relative rounded-[34px] mono-iron-surface border border-amber-400/40 hover:border-amber-300/80 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_28px_70px_rgba(2,6,23,0.85)]"
                >
                  {/* Top Champions Gold Strip */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#D97706] via-[#FDE68A] to-[#2563EB] z-20"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Left 5 Cols: Panoramic Golden Trophy Stage */}
                    <div className="lg:col-span-5 relative min-h-[240px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-amber-400/20">
                      <img
                        src={headerBackdrop}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090D1A] via-[#090D1A]/70 to-[#050814]/40"
                      />

                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] text-xs font-extrabold uppercase tracking-wide shadow-sm">
                          <Crown className="w-3.5 h-3.5" />
                          <span>Фінал Сезону • Major</span>
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#050A18]/90 text-amber-200 border border-amber-400/35 backdrop-blur-md">
                          ТОП-16 УКРАЇНИ
                        </span>
                      </div>

                      <div className="relative z-10 my-2 flex items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="text-[0.68rem] font-mono uppercase tracking-[0.15em] text-amber-200/90 font-extrabold">
                            ГОЛОВНИЙ ТРОФЕЙ РОКУ • BUNKER FC 1v1
                          </div>
                          <div className="font-display text-2xl sm:text-3xl font-extrabold text-gradient-gold leading-tight uppercase">
                            Кубок Чемпіонів ЗСУ
                          </div>
                          <div className="pt-1 flex flex-wrap items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#050A18]/90 border border-sky-400/30 text-xs font-bold text-slate-100">
                              Кваліфікація за рейтингом
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-xs font-extrabold text-gold">
                              ×2 Подвійні очки
                            </span>
                          </div>
                        </div>

                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-full bg-amber-400/20 blur-2xl"
                          />
                          <VectorGoldTrophy className="relative z-10 w-full h-full" />
                        </div>
                      </div>
                    </div>

                    {/* Right 7 Cols: Executive Championship Details (Clean, Zero Repetition) */}
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1.5 max-w-2xl">
                            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white uppercase tracking-[-0.02em]">
                              {displayTitle}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              Підсумковий турнір сезону серед чемпіонів
                              благодійних кубків та 16 лідерів національного
                              рейтингу України за головну відзнаку року від
                              воїнів ЗСУ.
                            </p>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-[0.68rem] font-mono font-extrabold text-gold uppercase shrink-0">
                            ★ GRAND FINAL
                          </span>
                        </div>

                        {/* 4-Column Sculpted Podium Pods */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {annualPrizes.map((tier, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-2xl border text-center transition-colors ${
                                idx === 0
                                  ? 'bg-gradient-to-b from-amber-500/20 to-[#060D20]/95 border-amber-400/45'
                                  : 'bg-[#050B1C]/85 border-sky-400/20'
                              }`}
                            >
                              <div
                                className={`text-[0.62rem] font-mono font-extrabold uppercase tracking-wider ${
                                  idx === 0 ? 'text-gold' : 'text-sky-300'
                                }`}
                              >
                                {rankBadges[idx]}
                              </div>
                              <div
                                className={`font-display text-xs sm:text-sm font-extrabold tabular-nums mt-1 ${
                                  idx === 0 ? 'text-white' : 'text-white'
                                }`}
                              >
                                {idx === 0
                                  ? 'Трофей ЗСУ + 1000 pts'
                                  : `+${tier.points} pts рейтингу`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 max-w-md space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-semibold">
                              Зона відбору за рейтингом сезону (ТОП-16)
                            </span>
                            <span className="text-gold font-mono font-extrabold tabular-nums">
                              8 / {t.maxPlayers} у зоні відбору
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#040814] overflow-hidden p-[1px] border border-amber-400/25">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#F5C451] transition-all"
                              style={{ width: '50%' }}
                            />
                          </div>
                        </div>

                        <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] group-hover:brightness-110 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-[0_10px_24px_rgba(245,196,81,0.3)]">
                          <span>Регламент Фіналу</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={t.id}
                href={`/tournaments/${t.slug}`}
                className={`group relative rounded-[34px] p-6 sm:p-7 flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_24px_60px_rgba(2,6,23,0.8)] ${
                  isPlayoff
                    ? 'glass-panel border border-sky-400/35 hover:border-sky-300/75'
                    : 'diia-card-surface border border-amber-400/35 hover:border-amber-300/75'
                }`}
              >
                {/* Top Broadcast Accent Line */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] z-20 ${
                    isPlayoff
                      ? 'bg-gradient-to-r from-[#FF5C39] via-[#38BDF8] to-[#2563EB]'
                      : 'bg-gradient-to-r from-[#00F59B] via-[#F5C451] to-[#38BDF8]'
                  }`}
                />

                <div className="space-y-5">
                  {/* Panoramic 3D Header Stage */}
                  <div className="relative -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 px-6 sm:px-7 pt-5 pb-5 overflow-hidden border-b border-sky-400/20 min-h-[205px] flex flex-col justify-between">
                    <img
                      src={headerBackdrop}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060E24] via-[#060E24]/75 to-[#040814]/40"
                    />

                    {/* Top Pass Header */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      {isPlayoff ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5C39] text-white text-xs font-extrabold uppercase tracking-wide shadow-[0_0_20px_rgba(255,92,57,0.4)]">
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>Плей-офф LIVE • 1/2 та Фінал</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] text-xs font-extrabold uppercase tracking-wide shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Відкрита реєстрація в групи</span>
                        </span>
                      )}

                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#040814]/85 text-sky-200 border border-sky-400/30 backdrop-blur-md">
                        {isPlayoff ? 'ТУРНІР #1 • LIVE' : 'ТУРНІР #2 • 16 МІСЦЬ'}
                      </span>
                    </div>

                    {/* Center Stage Metric & 3D Trophy */}
                    <div className="relative z-10 flex items-end justify-between gap-4 pt-3">
                      <div className="space-y-1.5">
                        <div className="text-[0.68rem] font-mono uppercase tracking-[0.14em] text-sky-300 font-bold">
                          {isPlayoff
                            ? 'БЛАГОДІЙНИЙ ЗБІР ФОНДУ PROJECT UKRAINE'
                            : 'ГОЛОВНА НАГОРОДА ПЕРЕМОЖЦЮ ТУРНІРУ'}
                        </div>

                        <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] leading-tight text-white">
                          {isPlayoff ? (
                            <span className="inline-flex flex-wrap items-baseline gap-2">
                              <span className="text-gradient-gold">2 145 ₴</span>
                              <span className="text-base sm:text-lg font-extrabold text-white">
                                + Трофей від воїнів ЗСУ
                              </span>
                            </span>
                          ) : (
                            <span className="text-gradient-gold">
                              Пам’ятний Трофей від ЗСУ
                            </span>
                          )}
                        </div>

                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#040814]/85 border border-sky-400/25 text-xs font-semibold text-slate-100">
                            {isPlayoff
                              ? '18 учасників • 5 груп (A–E)'
                              : 'Ultimate Team 1v1 • Групи + ПО'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/35 text-xs font-bold text-pitch">
                            {isPlayoff ? '38 / 41 матчів' : 'Донат від 10 ₴'}
                          </span>
                        </div>
                      </div>

                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 -mb-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-1 rounded-full blur-xl ${
                            isPlayoff ? 'bg-sky-400/20' : 'bg-amber-400/20'
                          }`}
                        />
                        {isPlayoff ? (
                          <VectorEmeraldTrophy className="relative z-10 w-full h-full" />
                        ) : (
                          <VectorGoldTrophy className="relative z-10 w-full h-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clean Title & Non-Repetitive Description */}
                  <div className="space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white truncate tracking-[-0.02em]">
                      {displayTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {isPlayoff
                        ? 'Груповий етап у 5 групах (A–E) та чвертьфінали завершено. Визначаються призери та володар кубка.'
                        : 'Новий набір на 16 учасників за форматом Ліги Чемпіонів (4 групи A–D по 2 кола + сітка Плей-офф).'}
                    </p>
                  </div>

                  {/* Distinct Body Grid: Live Playoff Stage for #1 vs Podium Rewards for #2 */}
                  {isPlayoff ? (
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-500/18 to-[#050B1C]/90 border border-amber-400/40">
                        <div className="text-[0.6rem] font-mono font-extrabold text-gold uppercase tracking-wider">
                          ГРАНД-ФІНАЛ
                        </div>
                        <div className="font-display text-xs sm:text-sm font-extrabold text-white truncate mt-1">
                          BRS_Nederfox
                        </div>
                        <div className="text-[0.62rem] text-amber-200/90 font-semibold truncate">
                          Очікує 1/2
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#050D24]/90 border border-sky-400/35">
                        <div className="text-[0.6rem] font-mono font-extrabold text-pitch uppercase tracking-wider">
                          1/2 ФІНАЛУ • LIVE
                        </div>
                        <div className="font-display text-xs sm:text-sm font-extrabold text-white truncate mt-1">
                          YoungChamp18
                        </div>
                        <div className="text-[0.62rem] text-sky-300 font-semibold truncate">
                          vs Elaizer [C2]
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#050B1C]/85 border border-white/12">
                        <div className="text-[0.6rem] font-mono font-extrabold text-slate-300 uppercase tracking-wider">
                          ЗА 3 МІСЦЕ
                        </div>
                        <div className="font-display text-xs sm:text-sm font-extrabold text-white truncate mt-1">
                          BRS_Hasfer23
                        </div>
                        <div className="text-[0.62rem] text-slate-400 font-semibold truncate">
                          Бронзовий фінал
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5">
                      {top3Prizes.map((tier, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border text-center ${
                            idx === 0
                              ? 'bg-gradient-to-b from-amber-500/18 to-[#050B1C]/90 border-amber-400/40'
                              : 'bg-[#050B1C]/85 border-sky-400/20'
                          }`}
                        >
                          <div
                            className={`text-[0.6rem] font-mono font-extrabold uppercase tracking-wider ${
                              idx === 0 ? 'text-gold' : 'text-sky-300'
                            }`}
                          >
                            {rankBadges[idx]}
                          </div>
                          <div className="font-display text-xs sm:text-sm font-extrabold text-white tabular-nums mt-1">
                            {idx === 0
                              ? 'Трофей ЗСУ'
                              : `+${tier.points} pts`}
                          </div>
                          <div className="text-[0.62rem] text-slate-300 font-medium mt-0.5">
                            {idx === 0 ? '+250 pts' : idx === 1 ? 'Срібло' : 'Бронза'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clean Progress Bar + Action Row */}
                <div className="space-y-4 pt-3.5 border-t border-sky-400/20">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">
                        {isPlayoff
                          ? 'Зіграно матчів (Групи A–E + Плей-офф)'
                          : 'Вільні слоти у групах A–D (відкритий набір)'}
                      </span>
                      <span
                        className={`font-mono font-extrabold tabular-nums ${
                          isPlayoff ? 'text-pitch' : 'text-gold'
                        }`}
                      >
                        {isPlayoff
                          ? '38 / 41 (93%)'
                          : `${t.maxPlayers - count} із ${t.maxPlayers} місць вільно`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#040814] overflow-hidden p-[1px] border border-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPlayoff
                            ? 'diia-iridescent-bg'
                            : 'bg-gradient-to-r from-[#00F59B] via-[#38BDF8] to-[#F5C451]'
                        }`}
                        style={{
                          width: isPlayoff
                            ? '93%'
                            : `${Math.max(18, fillPct)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-200">
                      {isPlayoff
                        ? 'Гранд-Фінал та півфінал #2 у прямому ефірі'
                        : 'Вільний графік (1 тиждень на групу) • Telegram-чат'}
                    </span>

                    <span
                      className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 transition-all shrink-0 ${
                        isPlayoff
                          ? 'bg-white text-[#040814] group-hover:bg-sky-200'
                          : 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] group-hover:brightness-110 shadow-[0_8px_20px_rgba(245,196,81,0.3)]'
                      }`}
                    >
                      <span>
                        {isPlayoff ? 'Матч-центр LIVE' : 'Подати заявку'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE 3-IN-1 LIVE ARENA (PLAYOFF BRACKET / GROUPS A-D / 32-CLUB DRAFT) */}
      {liveOctoberCup && (
        <HomeArenaShowcase
          tournamentSlug={liveOctoberCup.slug}
          tournamentTitle={liveOctoberCup.title}
          matches={arenaMatches}
          standings={arenaStandings}
        />
      )}

      {/* 4. 3-STEP CHARITY TOURNAMENT JOURNEY */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            step: '01',
            icon: Wallet,
            accent: 'text-gold',
            badge: 'БАНКА ЗСУ • ВІД 10 ₴',
            title: 'Реєстрація та донат на ЗСУ',
            desc: 'Створіть профіль гравця на сайті та закиньте від 10 ₴ (або скільки хочете і можете) на спільну Банку ЗСУ для фонду Project Ukraine.',
          },
          {
            step: '02',
            icon: Shuffle,
            accent: 'text-sky-300',
            badge: 'ЛІГА ЧЕМПІОНІВ',
            title: 'Автоматичне жеребкування груп',
            desc: 'Платформа автоматично проводить посів учасників у групи (по 2 кола) та формує олімпійську сітку Плей-офф.',
          },
          {
            step: '03',
            icon: Swords,
            accent: 'text-pitch',
            badge: 'ГРУПА ЗА ТИЖДЕНЬ',
            title: 'Вільний графік у Telegram і Приз',
            desc: 'Про час матчів гравці домовляються між собою в Telegram (бажано зіграти групу за тиждень) і змагаються за нагороду від воїнів ЗСУ.',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="glass-panel rounded-[30px] p-6 sm:p-7 space-y-3.5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full diia-iridescent-bg text-[#09090B] text-[0.65rem] font-mono font-extrabold">
                    КРОК {item.step}
                  </span>
                  <span className="text-[0.68rem] font-mono font-bold text-slate-300">
                    {item.badge}
                  </span>
                </div>
                <span className="w-10 h-10 rounded-2xl bg-[#10121A]/80 border border-white/15 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.accent}`} />
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* 5. EA SPORTS FC ULTIMATE TEAM × UCL SHIELD CARDS (TOP-3 UKRAINE) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>EA SPORTS FC ULTIMATE TEAM • UCL SHIELD CARDS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-[-0.03em]">
              Топ-3 гравці України (FUT Рейтинг)
            </h2>
          </div>
          <Link
            href="/leaderboard"
            className="px-5 py-2.5 rounded-full glass-panel hover:bg-gold hover:text-[#040814] text-xs font-extrabold text-white inline-flex items-center gap-1.5 transition-all"
          >
            <span>Таблиця ТОП-32</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([1, 2, 3] as const).map((slotRank, idx) => {
            const player = top3Players[idx];
            if (player) {
              return (
                <ProPlayerCard
                  key={player.id}
                  player={player}
                  rank={slotRank}
                />
              );
            }
            return (
              <Link
                key={`empty-slot-${slotRank}`}
                href="/tournaments"
                className="rounded-[30px] glass-panel border border-dashed border-white/20 hover:border-pitch/50 p-6 flex flex-col justify-between gap-5 transition-all group min-h-[260px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[0.68rem] font-extrabold text-slate-200">
                    Вільний слот #{slotRank} в Україні
                  </span>
                  <span className="text-xs font-bold text-pitch">
                    Старт сезону
                  </span>
                </div>

                <div className="my-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-pitch">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white">
                    Місце на подіумі сезону вільне
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Турніри сезону ще не розпочалися. Зареєструйтесь у першому
                    Кубку України 1v1 та очольте національний рейтинг.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-extrabold text-white group-hover:text-pitch transition-colors">
                  <span>Подати заявку на перший кубок</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* #4..#8 Direct Qualification Capsules (only if > 3 players registered) */}
        {top8Players.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {top8Players.slice(3).map((u, idx) => {
              const isClub = isClubMemberByNickname(u.nickname);
              return (
                <Link
                  key={u.id}
                  href={`/players/${encodeURIComponent(u.nickname)}`}
                  className="p-3.5 rounded-[22px] glass-panel flex items-center justify-between gap-2 hover:border-white/30 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-[#10121A]/80 border border-white/15 text-xs font-bold text-slate-200 flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 4}
                    </span>
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center font-mono text-[0.62rem] font-extrabold text-[#09090B] shrink-0 shadow"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {getSmartInitials(u.nickname)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-extrabold text-white group-hover:text-pitch truncate transition-colors">
                          {u.nickname}
                        </span>
                        <span
                          className={`px-1 py-0.5 rounded text-[0.5rem] font-extrabold uppercase shrink-0 border ${
                            isClub
                              ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                              : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                          }`}
                        >
                          {isClub ? 'КЛУБ' : 'ФАНАТ'}
                        </span>
                      </div>
                      <div className="text-[0.65rem] text-slate-300 truncate">
                        {u.city} • {u.platform}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-extrabold text-white shrink-0 tabular-nums">
                    {u.seasonPoints}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. CHARITY JAR FOR AFU (PROJECT UKRAINE) + FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Charity Jar for AFU Card */}
        <HoloCard
          variant="diia"
          className="lg:col-span-5 diia-card-surface rounded-[32px] p-7 sm:p-8 flex flex-col justify-between gap-6"
        >
          <div className="space-y-5 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10121A]/75 border border-white/15 text-xs font-bold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-pitch" />
                  <span>Спільна Банка для ЗСУ</span>
                  <UaFlag className="w-3.5 h-2.5" />
                </span>

                <div>
                  <div className="text-xs text-slate-200 font-medium">
                    Усі 100% внесків передаємо фонду Project Ukraine
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em] leading-tight mt-2">
                    Внесок від 10 <span className="diia-gradient-text">₴</span>
                  </div>
                </div>
              </div>

              <MonoPrizeJarSvg className="w-20 h-24 sm:w-24 sm:h-28" />
            </div>

            <div className="p-4 rounded-[22px] bg-[#10121A]/75 border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Картка Банки ЗСУ:</span>
                <span className="font-mono font-extrabold text-gold">
                  4874 1000 3491 9384
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.08]">
                <span className="text-slate-300">Зібрано в Турнірі #1:</span>
                <span className="font-mono font-extrabold text-pitch">
                  2 145 ₴ • 18 учасників
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Тотального контролю по внесках немає — кожен кидає на банку ЗСУ
                скільки хоче і може. Квитанція та звіт публікуються у нашій
                Telegram-групі.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#10121A]/65 border border-white/10">
                <div className="text-slate-300">Формат змагання</div>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  Ліга Чемпіонів
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#10121A]/65 border border-white/10">
                <div className="text-slate-300">Головний приз</div>
                <div className="text-sm sm:text-base font-extrabold text-gold mt-0.5">
                  Нагорода від ЗСУ
                </div>
              </div>
            </div>
          </div>

          <a
            href="https://send.monobank.ua/jar/6aFeFX1Lk2"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full py-3.5 px-5 rounded-full bg-white text-[#09090B] hover:bg-neutral-100 text-xs font-extrabold text-center transition-all shadow-[0_12px_28px_rgba(255,255,255,0.18)] inline-flex items-center justify-center gap-2"
          >
            <span>🫙 Відкрити Банку ЗСУ (send.monobank.ua)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </HoloCard>

        {/* Clean Tactile FAQ */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-7 sm:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-white">
                Як проходить благодійний турнір
              </h2>
              <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-xs font-semibold text-slate-200">
                Вільний графік • 1v1
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  q: 'Як взяти участь у благодійному турнірі?',
                  a: '1) Зареєструйте профіль на сайті та натисніть «Узяти участь» на сторінці турніру. 2) Закиньте від 10 грн (або скільки хочете і можете) на спільну Банку ЗСУ (картка: 4874 1000 3491 9384). Усі 100% передаємо фонду Project Ukraine.',
                },
                {
                  q: 'Який графік матчів і як зв’язатися з суперником?',
                  a: 'Графік вільний: про час та дату матчів гравці домовляються між собою напряму в Telegram (бажано зіграти групу протягом тижня). Пряме посилання на Telegram та EA ID суперника відкривається у Кімнаті матчу.',
                },
                {
                  q: 'Як працює жеребкування груп і плей-офф?',
                  a: 'Формат Ліги Чемпіонів: платформа автоматично ділить учасників на групи по 4 гравці та формує турнірну сітку Плей-офф.',
                },
                {
                  q: 'Який приз отримує переможець турніру?',
                  a: 'Головний приз — ексклюзивна пам’ятна нагорода від воїнів ЗСУ, а також кубковий титул та очки у загальному рейтингу платформи.',
                },
              ].map((item, idx) => (
                <details
                  key={idx}
                  open={idx === 0}
                  className="group rounded-[22px] bg-[#10121A]/65 hover:bg-[#151824]/80 border border-white/10 open:border-white/25 transition-colors"
                >
                  <summary className="cursor-pointer px-5 py-4 flex items-center justify-between gap-4 text-sm font-bold text-white select-none">
                    <span>{item.q}</span>
                    <span className="w-7 h-7 rounded-full bg-white/10 group-open:bg-white group-open:text-[#09090B] text-slate-200 flex items-center justify-center shrink-0 transition-colors">
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <span>Хочете протестувати кабінет гравця або арбітражу?</span>
            <Link
              href="/admin"
              className="font-bold text-white hover:text-pitch transition-colors inline-flex items-center gap-1"
            >
              <span>Відкрити Студію Адміна</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
