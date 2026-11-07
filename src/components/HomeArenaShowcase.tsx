'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Crown,
  LayoutGrid,
  Radio,
  Scale,
  ShieldCheck,
  Shuffle,
  Swords,
  Trophy,
} from 'lucide-react';
import type { GroupStandingRow, Match } from '@/lib/types';
import { ClubCrest, isClubMemberByNickname } from './ClubCrest';
import { ClubDraftRoulettePreview } from './ClubDraftRoulettePreview';
import {
  TacticalPitchArt,
  VectorEmeraldTrophy,
  VectorGoldTrophy,
} from './FintechArt';
import { PlayoffBracket } from './PlayoffBracket';
import { UaFlag } from './UaFlag';

interface HomeArenaShowcaseProps {
  tournamentSlug: string;
  tournamentTitle: string;
  matches: Match[];
  standings: Record<string, GroupStandingRow[]>;
}

const QUALIFIED_SEEDS = [
  { seed: 'A1', nickname: 'BRS_Nederfox', status: 'У Фіналі' },
  { seed: 'B1', nickname: 'BRS_Vestern', status: '1/4 фіналу' },
  { seed: 'C1', nickname: 'BRS_Hasfer23', status: 'За 3 місце' },
  { seed: 'D1', nickname: 'BRS_Lunnek1', status: '1/4 фіналу' },
  { seed: 'E1', nickname: 'BRS_YoungChamp18', status: '1/2 LIVE' },
  { seed: 'A2', nickname: 'Grizzy', status: '1/4 фіналу' },
  { seed: 'C2', nickname: 'Elaizer', status: '1/2 LIVE' },
  { seed: 'E2', nickname: 'BRS_PELTIK88', status: '1/4 фіналу' },
];

export function HomeArenaShowcase({
  tournamentSlug,
  tournamentTitle,
  matches,
  standings,
}: HomeArenaShowcaseProps) {
  const router = useRouter();
  const hasMatches = matches.length > 0;
  const [tab, setTab] = useState<'playoff' | 'groups' | 'draft'>(
    hasMatches ? 'playoff' : 'draft'
  );

  const groupNames = Object.keys(standings).sort();
  const lastGroupLetter =
    groupNames.length > 0 ? groupNames[groupNames.length - 1] : 'E';

  const allStandingsRows = Object.values(standings).flat();
  const totalGroupGoals = Math.round(
    allStandingsRows.reduce((acc, r) => acc + r.gf, 0)
  );
  const completedGroupMatchesCount = matches.filter(
    (m) => m.stage === 'GROUP' && m.status === 'COMPLETED'
  ).length;

  return (
    <section className="glass-panel rounded-[36px] p-6 sm:p-9 lg:p-10 space-y-6 overflow-hidden relative border border-sky-400/30 shadow-[0_28px_80px_rgba(2,6,23,0.88)]">
      {/* Top UEFA Starball Royal Blue & Gold Broadcast Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] diia-iridescent-bg"
      />

      {/* Subtle Stadium Floodlight Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-96 h-48 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#F5C451]"
      />

      {/* Header + UEFA Broadcast Segmented Switcher */}
      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-5 border-b border-sky-400/20">
        <div className="space-y-1.5">
          <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold text-slate-200">
            {hasMatches ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5C39] text-white text-[0.65rem] font-extrabold uppercase tracking-wider shadow-[0_0_16px_rgba(255,92,57,0.45)]">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>LIVE МАТЧ-ЦЕНТР • 1/2 ТА ФІНАЛ</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/35 text-pitch text-[0.65rem] font-extrabold">
                СТАРТ СЕЗОНУ • РЕЄСТРАЦІЯ
              </span>
            )}
            <span className="font-extrabold text-white">{tournamentTitle}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-gold text-[0.65rem] font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Зібрано 2 145 ₴ у фонд Project Ukraine</span>
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-[-0.03em]">
            Матч-центр Турніру #1: Сітка Плей-офф та Групи A–{lastGroupLetter}
          </h2>
        </div>

        {/* UEFA Broadcast Segmented Capsule Switcher */}
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#04091A]/90 border border-sky-400/30 self-start xl:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setTab('playoff')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              tab === 'playoff'
                ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] shadow-[0_4px_14px_rgba(245,196,81,0.35)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Сітка Плей-офф</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('groups')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              tab === 'groups'
                ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] shadow-[0_4px_14px_rgba(245,196,81,0.35)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>
              Групи A–{lastGroupLetter} ({groupNames.length || 5} груп)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('draft')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              tab === 'draft'
                ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] shadow-[0_4px_14px_rgba(245,196,81,0.35)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Драфт 32 клубів</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE PLAYOFF BRACKET */}
      {tab === 'playoff' && (
        <div className="space-y-5">
          {/* Compact 8-Player Knockout Seeding Telemetry Strip (No Redundant Match Banners!) */}
          {hasMatches && (
            <div className="rounded-[24px] bg-[#040A1E]/90 border border-sky-400/25 px-4 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/35 font-mono text-[0.62rem] font-extrabold text-gold uppercase">
                  ПОСІВ ПЛЕЙ-ОФФ (ТОП-8)
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  5 переможців груп (A1–E1) + 3 найкращі другі місця (A2, C2, E2):
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {QUALIFIED_SEEDS.map((item) => {
                  const isFinalist = item.status === 'У Фіналі';
                  const isLive = item.status === '1/2 LIVE';
                  return (
                    <span
                      key={item.seed}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold border ${
                        isFinalist
                          ? 'bg-amber-400/15 border-amber-400/45 text-gold'
                          : isLive
                            ? 'bg-sky-500/20 border-sky-400/45 text-white'
                            : 'bg-[#071026] border-white/10 text-slate-300'
                      }`}
                    >
                      <span className="font-mono font-extrabold text-pitch">
                        {item.seed}
                      </span>
                      <span>{item.nickname.replace(/^BRS_/, '')}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <PlayoffBracket
            matches={matches}
            onSelectMatch={() => router.push(`/tournaments/${tournamentSlug}`)}
          />

          <div className="pt-2 border-t border-sky-400/20 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-300">
              Натисніть на будь-яку пару в сітці Плей-офф, щоб відкрити кімнату
              матчу 1v1, рахунок або протокол серії.
            </span>
            <Link
              href={`/tournaments/${tournamentSlug}`}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-[0_8px_20px_rgba(245,196,81,0.3)]"
            >
              <span>Відкрити повний Матч-центр кубка</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: GROUP STAGE TABLES A-E */}
      {tab === 'groups' && (
        <div className="space-y-5">
          {groupNames.length === 0 ? (
            <div className="p-8 rounded-[26px] bg-[#050C22]/85 border border-sky-400/25 text-center space-y-3">
              <div className="font-display text-lg font-extrabold text-white">
                Груповий етап ще не сформовано (триває реєстрація)
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                Після заповнення квоти учасників система автоматично розподілить
                гравців на групи за кошиками посіву.
              </p>
              <Link
                href={`/tournaments/${tournamentSlug}`}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] text-xs font-extrabold inline-flex items-center gap-2 transition-all"
              >
                <span>Зареєструватися у кубку</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {groupNames.map((group) => {
                const rows = standings[group] ?? [];
                return (
                  <div
                    key={group}
                    className="rounded-[24px] bg-[#050C22]/95 border border-sky-400/25 overflow-hidden flex flex-col justify-between shadow-[0_14px_34px_rgba(2,6,23,0.75)]"
                  >
                    <div>
                      <div className="px-4 py-3 border-b border-sky-400/20 flex items-center justify-between bg-gradient-to-r from-[#08163B] to-[#050C22]">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-gold text-[#040814] font-mono text-xs font-extrabold flex items-center justify-center">
                            {group}
                          </span>
                          <span className="font-display text-sm font-extrabold text-white uppercase tracking-wide">
                            Група {group}
                          </span>
                        </div>
                        <span className="text-[0.62rem] font-mono text-sky-300 font-bold uppercase">
                          2 кола • Завершено
                        </span>
                      </div>

                      <div className="divide-y divide-white/[0.06]">
                        {rows.map((r) => {
                          const isClub = isClubMemberByNickname(r.nickname);
                          return (
                            <div
                              key={r.userId}
                              className={`px-4 py-2.5 flex items-center justify-between gap-2.5 text-xs ${
                                r.qualifies
                                  ? 'bg-gradient-to-r from-emerald-500/[0.08] to-transparent'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`w-5 h-5 rounded-full text-[0.65rem] font-extrabold flex items-center justify-center shrink-0 tabular-nums ${
                                    r.qualifies
                                      ? 'bg-pitch/20 text-pitch border border-pitch/45'
                                      : 'bg-white/[0.05] text-slate-400'
                                  }`}
                                >
                                  {r.rank}
                                </span>
                                <ClubCrest
                                  club={r.club}
                                  nickname={r.nickname}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <Link
                                      href={`/players/${encodeURIComponent(r.nickname)}`}
                                      className="font-bold text-white hover:text-gold truncate block transition-colors"
                                    >
                                      {r.nickname}
                                    </Link>
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[0.5rem] font-extrabold uppercase shrink-0 border ${
                                        isClub
                                          ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                                          : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                                      }`}
                                    >
                                      {isClub ? 'КЛУБ' : 'ФАНАТ'}
                                    </span>
                                  </div>
                                  <div className="text-[0.63rem] text-slate-400 truncate">
                                    {r.gf}:{r.ga} голів • {r.city}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0 font-mono tabular-nums">
                                <span className="text-slate-400 text-[0.66rem]">
                                  {r.played}М
                                </span>
                                <span className="text-slate-300 text-[0.66rem] w-7 text-right">
                                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-white font-extrabold">
                                  {r.points}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 6th Symmetrical Summary Card for 5 Groups in a 3x2 Grid */}
              <div className="rounded-[24px] mono-iron-surface border border-amber-400/40 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-gold text-[#040814] text-[0.62rem] font-mono font-extrabold uppercase">
                      СТАТИСТИКА ГРУП A–{lastGroupLetter}
                    </span>
                    <span className="text-xs font-mono font-bold text-pitch">
                      100% ЗІГРАНО
                    </span>
                  </div>

                  <div>
                    <div className="font-display text-xl font-extrabold text-white">
                      {completedGroupMatchesCount || 33} матчі •{' '}
                      <span className="text-gold">{totalGroupGoals} голів</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Усі 5 груп відіграли по 2 кола. До 1/4 фіналу вийшли 5
                      переможців груп (A1–E1) та 3 найкращі другі місця (A2, C2,
                      E2).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-[#040814]/85 border border-amber-400/25">
                      <div className="text-[0.62rem] text-slate-400">
                        Найкраща атака
                      </div>
                      <div className="text-xs font-extrabold text-gold truncate mt-0.5">
                        YoungChamp18 (42)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#040814]/85 border border-sky-400/25">
                      <div className="text-[0.62rem] text-slate-400">
                        Зібрано на ЗСУ
                      </div>
                      <div className="text-xs font-extrabold text-pitch mt-0.5">
                        2 145 ₴ • Банка
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/tournaments/${tournamentSlug}`}
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Усі 33 матчі груп</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-400">
              Критерії при рівності очок: 1) Очні зустрічі • 2) Різниця м’ячів •
              3) Забиті голи.
            </span>
            <Link
              href={`/tournaments/${tournamentSlug}`}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-gold hover:text-[#040814] border border-white/15 text-xs font-extrabold text-white inline-flex items-center gap-2 transition-all"
            >
              <span>Усі матчі груп у Матч-центрі</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE 32-CLUB DRAFT STUDIO */}
      {tab === 'draft' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="relative rounded-[28px] overflow-hidden diia-card-surface border border-sky-400/35 p-6 flex flex-col justify-between min-h-[13.5rem]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-45"
              >
                <TacticalPitchArt accent="emerald" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-[#040814] text-[0.65rem] font-mono font-extrabold uppercase">
                  <Crown className="w-3 h-3" />
                  <span>FAIR DRAFT • SHA-256</span>
                </span>
                <span className="text-xs font-mono font-bold text-pitch">
                  32 КЛУБИ УЄФА + УПЛ
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-between gap-4 my-2">
                <div>
                  <div className="text-xs text-slate-200 font-medium">
                    Рівні умови для кожного гравця
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    4.5★ + УПЛ • 95 OVR
                  </div>
                </div>
                <VectorEmeraldTrophy className="w-20 h-20 shrink-0" />
              </div>

              <div className="relative z-10 text-[0.66rem] font-mono text-sky-200 uppercase pt-2 border-t border-white/10">
                ШАХТАР ДОНЕЦЬК • ДИНАМО КИЇВ • ЄВРОПЕЙСЬКІ КЛУБИ
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                Чесний драфт рівних клубів у 1 клік
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Більше ніяких однотипних матчів одним і тим самим мета-складом.
                Перед стартом груп система випадково видає кожному гравцю рівний
                клуб із кошика.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#060E24] border border-sky-400/25 text-slate-100">
                <UaFlag className="w-3.5 h-2.5" />
                <span>Шахтар і Динамо</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#060E24] border border-amber-400/30 text-slate-100">
                <Scale className="w-3.5 h-3.5 text-gold" />
                <span>Режим 95 OVR</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#060E24] border border-emerald-400/30 text-slate-100">
                <Trophy className="w-3.5 h-3.5 text-pitch" />
                <span>4 кошики посіву</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-5 sm:p-6 rounded-[26px] bg-[#050C22]/90 border border-sky-400/25">
            <ClubDraftRoulettePreview />
          </div>
        </div>
      )}
    </section>
  );
}
