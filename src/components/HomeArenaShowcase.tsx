'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  LayoutGrid,
  Radio,
  Scale,
  Shuffle,
  Swords,
  Trophy,
} from 'lucide-react';
import type { GroupStandingRow, Match } from '@/lib/types';
import { ClubCrest } from './ClubCrest';
import { ClubDraftRoulettePreview } from './ClubDraftRoulettePreview';
import { TacticalPitchArt, VectorEmeraldTrophy } from './FintechArt';
import { PlayoffBracket } from './PlayoffBracket';
import { MonoCardChip, UaFlag } from './UaFlag';

interface HomeArenaShowcaseProps {
  tournamentSlug: string;
  tournamentTitle: string;
  matches: Match[];
  standings: Record<string, GroupStandingRow[]>;
}

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

  return (
    <section className="glass-panel rounded-[34px] p-6 sm:p-9 lg:p-10 space-y-7 overflow-hidden relative">
      {/* Subtle Top Diia Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-96 h-48 rounded-full opacity-15 blur-3xl diia-iridescent-bg"
      />

      {/* Header + Segmented Pill Switcher */}
      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-300">
            {hasMatches ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5C39]/15 border border-[#FF5C39]/35 text-[#FF7A5C] text-[0.65rem] font-extrabold">
                <Radio className="w-3 h-3 animate-pulse" />
                LIVE АРЕНА
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/35 text-pitch text-[0.65rem] font-extrabold">
                СТАРТ СЕЗОНУ • РЕЄСТРАЦІЯ
              </span>
            )}
            <span>{tournamentTitle}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Чесний драфт 32 клубів, групи та сітка плей-офф
          </h2>
        </div>

        {/* Monobank / iOS Segmented Capsule Switcher */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-[#10121A]/75 border border-white/[0.14] self-start xl:self-auto">
          <button
            type="button"
            onClick={() => setTab('playoff')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              tab === 'playoff'
                ? 'bg-white text-[#09090B] shadow-sm'
                : 'text-slate-400 hover:text-white'
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
                ? 'bg-white text-[#09090B] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Групи A–D</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('draft')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              tab === 'draft'
                ? 'bg-white text-[#09090B] shadow-sm'
                : 'text-slate-400 hover:text-white'
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
          <PlayoffBracket
            matches={matches}
            onSelectMatch={() => router.push(`/tournaments/${tournamentSlug}`)}
          />

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Крос-посів: 1-ші місця груп грають проти 2-х місць інших груп.
            </span>
            <Link
              href={`/tournaments/${tournamentSlug}`}
              className="px-5 py-2.5 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center gap-2 transition-all"
            >
              <span>Відкрити Матч-центр кубка</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: GROUP STAGE TABLES A-D */}
      {tab === 'groups' && (
        <div className="space-y-5">
          {groupNames.length === 0 ? (
            <div className="p-8 rounded-[26px] bg-[#10121A]/65 border border-white/[0.12] text-center space-y-3">
              <div className="font-display text-lg font-extrabold text-white">
                Груповий етап ще не сформовано (триває реєстрація)
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                Після заповнення квоти учасників система автоматично розподілить
                гравців на Групи A–D за 4 кошиками посіву.
              </p>
              <Link
                href={`/tournaments/${tournamentSlug}`}
                className="px-5 py-2.5 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center gap-2 transition-all"
              >
                <span>Зареєструватися у кубку</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupNames.map((group) => {
                const rows = standings[group] ?? [];
                return (
                  <div
                    key={group}
                    className="rounded-[24px] bg-[#10121A]/65 border border-white/[0.12] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
                      <span className="font-display text-sm font-extrabold text-white">
                        Група {group}
                      </span>
                      <span className="text-[0.65rem] font-mono text-pitch font-bold">
                        ТОП-2 → Плей-офф
                      </span>
                    </div>

                    <div className="divide-y divide-white/[0.05]">
                      {rows.map((r) => (
                        <div
                          key={r.userId}
                          className={`px-4 py-2.5 flex items-center justify-between gap-3 text-xs ${
                            r.qualifies ? 'bg-emerald-400/[0.03]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-5 h-5 rounded-full text-[0.65rem] font-extrabold flex items-center justify-center shrink-0 tabular-nums ${
                                r.qualifies
                                  ? 'bg-pitch/20 text-pitch border border-pitch/40'
                                  : 'bg-white/[0.05] text-slate-400'
                              }`}
                            >
                              {r.rank}
                            </span>
                            <ClubCrest club={r.club} size="sm" />
                            <div className="min-w-0">
                              <Link
                                href={`/players/${encodeURIComponent(r.nickname)}`}
                                className="font-bold text-white hover:text-pitch truncate block transition-colors"
                              >
                                {r.nickname}
                              </Link>
                              <div className="text-[0.65rem] text-slate-400 truncate">
                                {r.club?.name ?? r.city}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
                            <span className="text-slate-400 text-[0.68rem]">
                              {r.played}М
                            </span>
                            <span className="text-slate-400 text-[0.68rem] w-8 text-right">
                              {r.gd > 0 ? `+${r.gd}` : r.gd}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-white font-extrabold">
                              {r.points}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-400">
              Посів у 4 кошики за Всеукраїнським рейтингом сезону.
            </span>
            <Link
              href={`/tournaments/${tournamentSlug}`}
              className="px-5 py-2.5 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center gap-2 transition-all"
            >
              <span>Усі матчі груп</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE 32-CLUB DRAFT STUDIO */}
      {tab === 'draft' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="relative rounded-[28px] overflow-hidden diia-card-surface p-6 flex flex-col justify-between min-h-[13.5rem]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-45"
              >
                <TacticalPitchArt accent="emerald" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MonoCardChip tone="silver" />
                  <span className="px-3 py-1 rounded-full diia-iridescent-bg text-[#09090B] text-[0.65rem] font-extrabold">
                    FAIR DRAFT • SHA-256
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-pitch">
                  32 КЛУБИ
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

              <div className="relative z-10 text-[0.66rem] font-mono text-slate-200 uppercase pt-2 border-t border-white/10">
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
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] text-slate-100">
                <UaFlag className="w-3.5 h-2.5" />
                <span>Шахтар і Динамо</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] text-slate-100">
                <Scale className="w-3.5 h-3.5 text-gold" />
                <span>Режим 95 OVR</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] text-slate-100">
                <Trophy className="w-3.5 h-3.5 text-pitch" />
                <span>4 кошики посіву</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-5 sm:p-6 rounded-[26px] bg-[#10121A]/65 border border-white/[0.12]">
            <ClubDraftRoulettePreview />
          </div>
        </div>
      )}
    </section>
  );
}

