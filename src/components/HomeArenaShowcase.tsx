'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  LayoutGrid,
  Radio,
  Swords,
} from 'lucide-react';
import type { GroupStandingRow, Match } from '@/lib/types';
import { ClubCrest } from './ClubCrest';
import { PlayoffBracket } from './PlayoffBracket';

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
  const [tab, setTab] = useState<'playoff' | 'groups'>('playoff');

  const groupNames = Object.keys(standings).sort();
  const lastGroupLetter =
    groupNames.length > 0 ? groupNames[groupNames.length - 1] : 'E';

  return (
    <section className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-9 space-y-6 overflow-hidden relative border border-white/[0.1] shadow-[0_24px_70px_rgba(2,6,23,0.8)]">
      {/* Clean Header + 2-Tab Switcher */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-300">
            {hasMatches && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5C39]/15 border border-[#FF5C39]/40 text-[#FF7A5C] text-[0.65rem] font-extrabold uppercase">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>LIVE</span>
              </span>
            )}
            <span>{tournamentTitle}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.025em]">
            Турнірна сітка та таблиці груп
          </h2>
        </div>

        {/* Clean 2-Tab Switcher */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#040814] border border-white/[0.1] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab('playoff')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 cursor-pointer ${
              tab === 'playoff'
                ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Сітка Плей-офф</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('groups')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all inline-flex items-center gap-2 cursor-pointer ${
              tab === 'groups'
                ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Групи A–{lastGroupLetter}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PLAYOFF BRACKET */}
      {tab === 'playoff' && (
        <div className="space-y-5">
          <PlayoffBracket
            matches={matches}
            onSelectMatch={() => router.push(`/tournaments/${tournamentSlug}`)}
          />

          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Натисніть на будь-який матч, щоб відкрити сторінку поєдинку.
            </span>
            <Link
              href={`/tournaments/${tournamentSlug}`}
              className="px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-gold hover:text-[#040814] border border-white/15 text-xs font-extrabold text-white inline-flex items-center gap-2 transition-all"
            >
              <span>Сторінка турніру</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: GROUP STAGE TABLES A-E */}
      {tab === 'groups' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupNames.map((group) => {
              const rows = standings[group] ?? [];
              return (
                <div
                  key={group}
                  className="rounded-[24px] bg-[#040A1A]/90 border border-white/[0.1] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gold text-[#040814] font-mono text-xs font-extrabold flex items-center justify-center">
                          {group}
                        </span>
                        <span className="font-display text-sm font-extrabold text-white">
                          Група {group}
                        </span>
                      </div>
                      <span className="text-[0.65rem] font-mono text-slate-400">
                        2 кола
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[0.62rem] font-mono text-slate-400 uppercase">
                          <th className="py-2 pl-3 pr-1">#</th>
                          <th className="py-2 px-2">Гравець</th>
                          <th className="py-2 px-1.5 text-center">І</th>
                          <th className="py-2 px-1.5 text-center">В</th>
                          <th className="py-2 px-1.5 text-center">М&apos;ячі</th>
                          <th className="py-2 pl-1.5 pr-3 text-right">О</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {rows.map((r, idx) => {
                          const isQual = r.qualifies;
                          return (
                            <tr
                              key={r.userId}
                              className={
                                isQual ? 'bg-amber-400/[0.04]' : undefined
                              }
                            >
                              <td className="py-2.5 pl-3 pr-1 font-mono text-[0.68rem] font-bold text-slate-300">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-2">
                                <Link
                                  href={`/players/${encodeURIComponent(r.nickname)}`}
                                  className="flex items-center gap-2 group"
                                >
                                  <ClubCrest
                                    nickname={r.nickname}
                                    size="sm"
                                  />
                                  <span className="font-bold text-white group-hover:text-gold truncate max-w-[115px] transition-colors">
                                    {r.nickname}
                                  </span>
                                </Link>
                              </td>
                              <td className="py-2.5 px-1.5 text-center font-mono text-slate-300">
                                {r.played}
                              </td>
                              <td className="py-2.5 px-1.5 text-center font-mono text-emerald-400 font-bold">
                                {r.won}
                              </td>
                              <td className="py-2.5 px-1.5 text-center font-mono text-slate-400 text-[0.68rem]">
                                {r.gf}:{r.ga}
                              </td>
                              <td className="py-2.5 pl-1.5 pr-3 text-right font-mono font-extrabold text-gold">
                                {r.points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
