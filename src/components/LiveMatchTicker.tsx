import React from 'react';
import Link from 'next/link';
import { Flame, Radio, Trophy } from 'lucide-react';
import type { Match, Tournament } from '@/lib/types';

interface LiveMatchTickerProps {
  recentMatches: Array<Match & { tournamentSlug: string; tournamentTitle: string }>;
  tournaments: Tournament[];
}

export function LiveMatchTicker({
  recentMatches,
  tournaments,
}: LiveMatchTickerProps) {
  const openTournament = tournaments.find((t) => t.status === 'REGISTRATION');

  return (
    <div className="border-b border-white/[0.07] bg-[#03050B]/95 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2.5 flex items-center justify-between gap-4 text-xs">
        {/* Left Live Label + Soft-Edge Masked Scrollable Match Stream */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/35 font-mono font-extrabold text-[0.65rem] tracking-wide shrink-0 shadow-[0_0_18px_rgba(244,63,94,0.18)]">
            <Radio className="w-3 h-3 animate-pulse text-rose-400" />
            LIVE МАТЧІ
          </span>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar soft-edge-fade-x pr-10 min-w-0 flex-1">
            {recentMatches.map((m) => (
              <Link
                key={m.id}
                href={`/tournaments/${m.tournamentSlug}`}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border transition-all shrink-0 ${
                  m.status === 'DISPUTED'
                    ? 'bg-rose-950/35 border-rose-500/40 hover:border-rose-400'
                    : 'bg-[#10121A]/75 border-white/10 hover:border-emerald-400/45 hover:bg-[#161924]'
                }`}
              >
                <span className="font-mono text-[0.63rem] uppercase text-slate-400">
                  {m.playoffRound === 'FINAL'
                    ? 'ФІНАЛ'
                    : m.playoffRound === 'SF'
                      ? '1/2'
                      : m.playoffRound === 'QF'
                        ? '1/4'
                        : `Гр.${m.groupName}`}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  {m.player1?.club && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: m.player1.club.primaryColor }}
                    />
                  )}
                  <span className="font-bold text-slate-100">
                    {m.player1?.nickname ?? 'TBD'}
                  </span>
                </span>

                <span
                  className={`px-1.5 py-0.5 rounded-md font-mono font-extrabold text-[0.68rem] leading-none ${
                    m.status === 'DISPUTED'
                      ? 'bg-rose-500/25 text-rose-200 border border-rose-400/30'
                      : 'bg-emerald-500/15 text-pitch border border-emerald-400/25'
                  }`}
                >
                  {m.score1 !== null && m.score2 !== null
                    ? `${m.score1}:${m.score2}`
                    : 'VS'}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <span className="font-bold text-slate-100">
                    {m.player2?.nickname ?? 'TBD'}
                  </span>
                  {m.player2?.club && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: m.player2.club.primaryColor }}
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Pinned Quick Tournament Pills (Desktop) */}
        <div className="hidden xl:flex items-center gap-2.5 shrink-0">
          {openTournament && (
            <Link
              href={`/tournaments/${openTournament.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20 text-pitch font-bold shrink-0 transition-colors"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>
                {openTournament.monthLabel}:{' '}
                {openTournament.participantCount ?? 0}/{openTournament.maxPlayers}{' '}
                • {openTournament.prizePoolUah.toLocaleString('uk-UA')} ₴
              </span>
            </Link>
          )}

          <Link
            href="/tournaments/ukraine-grand-final-2027"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/35 hover:bg-amber-400/20 text-gold font-bold shrink-0 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Гранд-Фінал: 100 000 ₴</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
