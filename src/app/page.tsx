import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Crown,
  Radio,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';
import {
  computeGroupStandings,
  getLeaderboard,
  getTournamentMatches,
  listTournaments,
} from '@/lib/tournament-engine';
import { ClubCrest, getSmartInitials } from '@/components/ClubCrest';
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

  const liveOctoberCup =
    tournaments.find((t) => t.slug === 'october-cup-2026') ?? tournaments[0];
  const openNovemberCup =
    tournaments.find((t) => t.slug === 'november-cup-2026') ?? tournaments[1];
  const annualCup = tournaments.find((t) => t.cupType === 'ANNUAL');

  const arenaMatches = liveOctoberCup
    ? getTournamentMatches(liveOctoberCup.id)
    : [];
  const arenaStandings = liveOctoberCup
    ? computeGroupStandings(liveOctoberCup.id)
    : {};

  const novCount = openNovemberCup?.participantCount ?? 0;
  const novMax = openNovemberCup?.maxPlayers ?? 16;

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 space-y-16 pb-12">
      {/* 1. CLEAN HERO STAGE + LIVE PLAYOFF SCOREBOARD */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Columns: Main Welcome Banner */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-7 sm:p-10 flex flex-col justify-between gap-8 relative overflow-hidden border border-white/[0.1] shadow-[0_24px_70px_rgba(2,6,23,0.8)]">
          {/* Night Stadium Backdrop */}
          <img
            src="/images/hero-arena.jpg?v=blue1"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 w-[82%] h-[86%] object-cover opacity-55 mix-blend-screen"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse 76% 76% at 74% 40%, #000 24%, rgba(0,0,0,0.5) 60%, transparent 96%)',
              maskImage:
                'radial-gradient(ellipse 76% 76% at 74% 40%, #000 24%, rgba(0,0,0,0.5) 60%, transparent 96%)',
            }}
          />

          {/* Single Clean Top Pill */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#060E24]/90 border border-white/15 text-xs font-bold text-white backdrop-blur-md">
              <UaFlag className="w-4 h-3" />
              <span>Благодійна ліга 1v1 • На підтримку ЗСУ</span>
            </div>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04091A]/85 border border-white/10 text-xs font-semibold text-slate-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>PS5 • PC • Xbox</span>
            </span>
          </div>

          {/* Center Headline & Actions */}
          <div className="relative z-10 my-auto space-y-6 max-w-2xl">
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl xl:text-[3.25rem] font-extrabold tracking-[-0.035em] text-white leading-[1.06] uppercase">
                <span className="block">Українська</span>
                <span className="block">Ліга Чемпіонів</span>
                <span className="block mt-1 diia-gradient-text whitespace-nowrap">
                  1 на 1 в EA SPORTS FC
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Турніри за системою Ліги Чемпіонів (групи + плей-офф) із вільним
                графіком у Telegram. Усі 100% донатів передаємо фонду{' '}
                <strong className="text-white">Project Ukraine</strong>, а
                переможець отримує{' '}
                <strong className="text-gold">
                  пам’ятний трофей від воїнів ЗСУ
                </strong>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/tournaments/${openNovemberCup?.slug ?? 'november-cup-2026'}`}
                className="group inline-flex items-center gap-3 pl-5 pr-4 py-3.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 font-extrabold text-xs sm:text-sm shadow-[0_12px_30px_rgba(245,196,81,0.3)] transition-all"
              >
                <span>Подати заявку на Турнір #2</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#040814] text-gold text-xs font-extrabold tabular-nums">
                  {novCount}/{novMax}
                </span>
                <ArrowRight className="w-4 h-4 text-[#040814] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs sm:text-sm font-extrabold text-white backdrop-blur-xl transition-all"
              >
                <Radio className="w-3.5 h-3.5 text-[#FF5C39] animate-pulse shrink-0" />
                <span>Матч-центр Турніру #1</span>
              </Link>
            </div>
          </div>

          {/* Clean 3-Stat Bottom Bar */}
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
            <div>
              <div className="font-display text-lg sm:text-2xl font-extrabold text-white tabular-nums">
                2 145 <span className="text-gold">₴</span>
              </div>
              <div className="text-xs text-slate-400">
                Зібрано на Банку ЗСУ
              </div>
            </div>

            <div>
              <div className="font-display text-lg sm:text-2xl font-extrabold text-white">
                Групи + ПО
              </div>
              <div className="text-xs text-slate-400">
                Формат Ліги Чемпіонів
              </div>
            </div>

            <div>
              <div className="font-display text-lg sm:text-2xl font-extrabold text-gold">
                Трофей ЗСУ
              </div>
              <div className="text-xs text-slate-400">
                Нагорода переможцю
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live Tournament #1 Playoff Scoreboard */}
        <div className="lg:col-span-5 glass-panel rounded-[32px] p-6 sm:p-8 flex flex-col justify-between gap-5 border border-white/[0.1] shadow-[0_24px_70px_rgba(2,6,23,0.8)]">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF5C39] text-white text-[0.65rem] font-extrabold uppercase">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>LIVE</span>
              </span>
              <div>
                <div className="font-display text-sm sm:text-base font-extrabold text-white">
                  Благодійний Турнір #1 • Плей-офф
                </div>
                <div className="text-xs text-slate-400">
                  Вирішальні матчі кубка
                </div>
              </div>
            </div>

            <Link
              href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
              className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Відкрити Турнір #1"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Clean Match Cards */}
          <div className="space-y-3 my-auto">
            {/* Match 1: Grand Final */}
            <Link
              href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
              className="block rounded-2xl bg-gradient-to-r from-[#141D38] via-[#0B1226] to-[#1C160E] p-4 border border-amber-400/35 hover:border-amber-300 transition-all"
            >
              <div className="flex items-center justify-between text-[0.65rem] font-bold text-gold mb-2.5">
                <span className="inline-flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>ГРАНД-ФІНАЛ КУБКА</span>
                </span>
                <span className="text-amber-200/80">За трофей від ЗСУ</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ClubCrest
                    nickname="BRS_Nederfox"
                    seedBadge="A1"
                    size="sm"
                  />
                  <span className="font-display text-sm font-extrabold text-white truncate">
                    BRS_Nederfox
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#040814] border border-white/10 font-mono text-[0.65rem] font-bold text-gold shrink-0">
                  VS
                </span>

                <div className="text-right min-w-0">
                  <span className="font-display text-sm font-bold text-slate-300 truncate block">
                    Переможець 1/2
                  </span>
                </div>
              </div>
            </Link>

            {/* Match 2: Semifinal #2 LIVE */}
            <Link
              href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
              className="block rounded-2xl bg-[#06102A] p-4 border border-sky-400/35 hover:border-sky-300 transition-all"
            >
              <div className="flex items-center justify-between text-[0.65rem] font-bold text-sky-300 mb-2.5">
                <span className="inline-flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5" />
                  <span>ПІВФІНАЛ #2 • LIVE</span>
                </span>
                <span className="text-slate-400">До 2 перемог (BO3)</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ClubCrest
                    nickname="BRS_YoungChamp18"
                    seedBadge="E1"
                    size="sm"
                  />
                  <span className="font-display text-sm font-extrabold text-white truncate">
                    BRS_YoungChamp18
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#040814] border border-white/10 font-mono text-[0.65rem] font-bold text-white shrink-0">
                  VS
                </span>

                <div className="flex items-center justify-end gap-2.5 min-w-0">
                  <span className="font-display text-sm font-extrabold text-white truncate">
                    Elaizer
                  </span>
                  <ClubCrest nickname="Elaizer" seedBadge="C2" size="sm" />
                </div>
              </div>
            </Link>

            {/* Match 3: 3rd Place Match */}
            <Link
              href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
              className="block rounded-2xl bg-[#050B1C] p-3.5 border border-white/[0.08] hover:border-white/25 transition-all"
            >
              <div className="flex items-center justify-between text-[0.65rem] font-bold text-slate-400 mb-2">
                <span>МАТЧ ЗА 3 МІСЦЕ</span>
                <span>+135 pts рейтингу</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <ClubCrest
                    nickname="BRS_Hasfer23"
                    seedBadge="C1"
                    size="sm"
                  />
                  <span className="font-display text-xs sm:text-sm font-bold text-white truncate">
                    BRS_Hasfer23
                  </span>
                </div>

                <span className="text-[0.65rem] font-mono text-slate-500">
                  VS
                </span>

                <span className="text-xs font-semibold text-slate-400 truncate">
                  Суперник із 1/2
                </span>
              </div>
            </Link>
          </div>

          {/* Scoreboard Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Зіграно <strong className="text-white">38 із 41</strong> матчів
            </div>

            <Link
              href={`/tournaments/${liveOctoberCup?.slug ?? 'october-cup-2026'}`}
              className="text-xs font-extrabold text-gold hover:text-amber-200 inline-flex items-center gap-1 transition-colors"
            >
              <span>Уся сітка Плей-офф</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SEASON TOURNAMENTS (2 CLEAN CARDS + COMPACT GRAND FINAL) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.025em]">
              Турніри сезону
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Поточний розіграш Плей-офф та відкритий набір на новий кубок
            </p>
          </div>

          <Link
            href="/tournaments"
            className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-extrabold text-white inline-flex items-center gap-1.5 transition-all"
          >
            <span>Усі турніри</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Tournament #1 LIVE */}
          {liveOctoberCup && (
            <Link
              href={`/tournaments/${liveOctoberCup.slug}`}
              className="group glass-panel rounded-[30px] p-6 sm:p-7 flex flex-col justify-between gap-6 border border-white/[0.1] hover:border-sky-400/50 transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5C39] text-white text-xs font-extrabold">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Плей-офф LIVE</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    18 учасників • 5 груп A–E
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white group-hover:text-sky-200 transition-colors">
                      {liveOctoberCup.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Зібрано <strong className="text-gold">2 145 ₴</strong> на
                      Банку ЗСУ • Головний приз — трофей від воїнів ЗСУ
                    </p>
                  </div>
                  <VectorEmeraldTrophy className="w-16 h-16 shrink-0" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Стадія: 1/2 фіналу та Гранд-Фінал
                  </span>
                  <span className="font-mono font-bold text-white">
                    38 / 41 матчів
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#040814] overflow-hidden">
                  <div
                    className="h-full rounded-full diia-iridescent-bg"
                    style={{ width: '93%' }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300 font-medium">
                    Фінал: BRS_Nederfox vs Переможець 1/2
                  </span>
                  <span className="text-xs font-extrabold text-sky-300 group-hover:text-white inline-flex items-center gap-1 transition-colors">
                    <span>Переглянути сітку</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 2: Tournament #2 OPEN REGISTRATION */}
          {openNovemberCup && (
            <Link
              href={`/tournaments/${openNovemberCup.slug}`}
              className="group glass-panel rounded-[30px] p-6 sm:p-7 flex flex-col justify-between gap-6 border border-amber-400/35 hover:border-amber-300 transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] text-xs font-extrabold">
                    <span>Відкрита реєстрація</span>
                  </span>
                  <span className="text-xs font-mono text-gold font-bold">
                    Вільні місця: {novMax - novCount} із {novMax}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white group-hover:text-gold transition-colors">
                      {openNovemberCup.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Система Ліги Чемпіонів (Групи + Плей-офф) • Донат від{' '}
                      <strong className="text-gold">10 ₴</strong> на Банку ЗСУ
                    </p>
                  </div>
                  <VectorGoldTrophy className="w-16 h-16 shrink-0" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Набір учасників у груповий етап
                  </span>
                  <span className="font-mono font-bold text-gold">
                    {novCount} / {novMax} гравців
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#040814] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{
                      width: `${Math.max(8, Math.round((novCount / novMax) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300 font-medium">
                    Приз: пам’ятний трофей від воїнів ЗСУ
                  </span>
                  <span className="text-xs font-extrabold text-gold group-hover:text-amber-200 inline-flex items-center gap-1 transition-colors">
                    <span>Подати заявку</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Compact Grand Final Strip */}
        {annualCup && (
          <Link
            href={`/tournaments/${annualCup.slug}`}
            className="group block rounded-[28px] bg-gradient-to-r from-[#131C38] via-[#0B1226] to-[#1E160C] border border-amber-400/35 hover:border-amber-300 p-6 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#040814]/80 border border-amber-400/35 flex items-center justify-center shrink-0">
                  <VectorGoldTrophy className="w-11 h-11" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-gold">
                    <Crown className="w-3.5 h-3.5" />
                    <span>ПІДСУМКОВИЙ КУБОК СЕЗОНУ • ТОП-16 РЕЙТИНГУ</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">
                    {annualCup.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Переможці благодійних турнірів та лідери рейтингу України
                    розіграють головний трофей сезону від воїнів ЗСУ.
                  </p>
                </div>
              </div>

              <span className="px-5 py-2.5 rounded-full bg-gold text-[#040814] group-hover:brightness-110 text-xs font-extrabold inline-flex items-center gap-1.5 self-start lg:self-center shrink-0 transition-all">
                <span>Детальніше про Фінал</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        )}
      </section>

      {/* 3. INTERACTIVE MATCH-CENTER (PLAYOFF BRACKET & GROUPS A-E) */}
      {liveOctoberCup && (
        <HomeArenaShowcase
          tournamentSlug={liveOctoberCup.slug}
          tournamentTitle={liveOctoberCup.title}
          matches={arenaMatches}
          standings={arenaStandings}
        />
      )}

      {/* 4. UKRAINE LEADERBOARD SHOWCASE (TOP-3 PODIUM + #4..#8) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.025em]">
              Лідери рейтингу України
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Топ-8 гравців поточного сезону за підсумками групового етапу та
              Плей-офф
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-extrabold text-white inline-flex items-center gap-1.5 transition-all"
          >
            <span>Уся таблиця рейтингу</span>
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
            return null;
          })}
        </div>

        {/* #4..#8 Clean Capsules */}
        {top8Players.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {top8Players.slice(3).map((u, idx) => (
              <Link
                key={u.id}
                href={`/players/${encodeURIComponent(u.nickname)}`}
                className="p-3.5 rounded-2xl bg-[#050C20]/90 border border-white/[0.08] hover:border-white/25 flex items-center justify-between gap-2 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#040814] border border-white/10 text-[0.7rem] font-mono font-bold text-slate-300 flex items-center justify-center shrink-0 tabular-nums">
                    {idx + 4}
                  </span>
                  <span
                    className="w-7 h-7 rounded-xl flex items-center justify-center font-mono text-[0.62rem] font-extrabold text-[#040814] shrink-0"
                    style={{ backgroundColor: u.avatarColor }}
                  >
                    {getSmartInitials(u.nickname)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white group-hover:text-gold truncate transition-colors">
                      {u.nickname}
                    </div>
                    <div className="text-[0.65rem] text-slate-400 truncate">
                      {u.city} • {u.platform}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-xs font-mono font-extrabold text-gold shrink-0 tabular-nums">
                  {u.seasonPoints}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. CHARITY JAR FOR AFU + CONCISE FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Charity Jar for AFU */}
        <HoloCard
          variant="diia"
          className="lg:col-span-5 diia-card-surface rounded-[32px] p-7 sm:p-8 flex flex-col justify-between gap-6 border border-white/15"
        >
          <div className="space-y-5 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040A18]/85 border border-white/15 text-xs font-bold text-white">
                  <UaFlag className="w-3.5 h-2.5" />
                  <span>Спільна Банка ЗСУ • Project Ukraine</span>
                </span>

                <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em] pt-1">
                  Внесок від <span className="text-gold">10 ₴</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Фіксованого ліміту немає — кожен донатить скільки хоче і може.
                  Усі 100% передаємо на підтримку ЗСУ.
                </p>
              </div>

              <MonoPrizeJarSvg className="w-20 h-24 shrink-0" />
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/85 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Картка Банки ЗСУ:</span>
                <span className="font-mono font-extrabold text-gold">
                  4874 1000 3491 9384
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <span className="text-slate-400">Зібрано в Турнірі #1:</span>
                <span className="font-mono font-extrabold text-white">
                  2 145 ₴ • 18 учасників
                </span>
              </div>
            </div>
          </div>

          <a
            href="https://send.monobank.ua/jar/6aFeFX1Lk2"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] hover:brightness-110 text-[#040814] text-xs sm:text-sm font-extrabold text-center transition-all shadow-[0_12px_28px_rgba(245,196,81,0.3)] inline-flex items-center justify-center gap-2"
          >
            <UaFlag className="w-4 h-3 shrink-0" />
            <span>Відкрити Банку ЗСУ (send.monobank.ua)</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </a>
        </HoloCard>

        {/* Right: Clean 4-Question FAQ */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-7 sm:p-8 flex flex-col justify-between gap-5 border border-white/[0.1]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-white">
                Як проходить турнір
              </h2>
              <Link
                href="/rules"
                className="text-xs font-bold text-gold hover:text-amber-200 inline-flex items-center gap-1 transition-colors"
              >
                <span>Повний регламент</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  q: 'Як взяти участь у турнірі?',
                  a: 'Створіть профіль гравця на сайті, натисніть «Подати заявку» на сторінці відкритого турніру та закиньте від 10 ₴ на Спільну Банку ЗСУ.',
                },
                {
                  q: 'Який графік матчів і як зв’язатися з суперником?',
                  a: 'Графік вільний: про зручний час гри учасники домовляються напряму в Telegram (бажано зіграти групу протягом тижня).',
                },
                {
                  q: 'Як працює жеребкування груп і сітка Плей-офф?',
                  a: 'За системою Ліги Чемпіонів: платформа ділить учасників на групи (матчі у 2 кола), після чого найкращі гравці виходять у сітку Плей-офф.',
                },
                {
                  q: 'Яку нагороду отримує переможець?',
                  a: 'Переможець отримує ексклюзивний пам’ятний трофей від воїнів ЗСУ та очки в загальний рейтинг сезону.',
                },
              ].map((item, idx) => (
                <details
                  key={idx}
                  open={idx === 0}
                  className="group rounded-2xl bg-[#040A18]/75 hover:bg-[#071126] border border-white/[0.08] open:border-white/20 transition-all"
                >
                  <summary className="cursor-pointer px-5 py-3.5 flex items-center justify-between gap-4 text-sm font-bold text-white select-none">
                    <span>{item.q}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 group-open:text-gold transition-transform shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
