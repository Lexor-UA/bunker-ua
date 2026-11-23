'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Crown, Search, X } from 'lucide-react';
import type { PlatformType, User } from '@/lib/types';
import { getSmartInitials } from './ClubCrest';
import { UaFlag } from './UaFlag';

interface LeaderboardClientProps {
  players: User[];
}

export function LeaderboardClient({ players }: LeaderboardClientProps) {
  const [query, setQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | PlatformType>(
    'ALL'
  );

  const rankedPlayers = useMemo(
    () =>
      players.map((p, index) => ({
        player: p,
        globalRank: index + 1,
      })),
    [players]
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rankedPlayers.filter(({ player }) => {
      if (platformFilter !== 'ALL' && player.platform !== platformFilter) {
        return false;
      }
      if (!q) return true;
      return (
        player.nickname.toLowerCase().includes(q) ||
        player.city.toLowerCase().includes(q) ||
        player.eaId.toLowerCase().includes(q)
      );
    });
  }, [rankedPlayers, query, platformFilter]);

  return (
    <section className="glass-panel rounded-[32px] border border-white/[0.1] overflow-hidden">
      {/* Clean Filter & Search Header */}
      <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#040814] border border-white/[0.1] self-start">
          {(
            [
              { id: 'ALL', label: `Усі (${players.length})` },
              { id: 'PS5', label: 'PS5' },
              { id: 'PC', label: 'PC' },
              { id: 'XBOX', label: 'Xbox' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPlatformFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                platformFilter === tab.id
                  ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук гравця або міста..."
            className="w-full pl-9 pr-8 py-2 rounded-full bg-[#040814] border border-white/15 text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Очистити пошук"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {filteredRows.length === 0 ? (
        <div className="p-12 text-center text-sm text-slate-400">
          Гравців за вашим запитом не знайдено
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#040814]/60 text-[0.68rem] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 pl-6 pr-3">#</th>
                <th className="py-3.5 px-3">Гравець</th>
                <th className="py-3.5 px-3">Місто / Консоль</th>
                <th className="py-3.5 px-3 text-center">Матчі (Вінрейт)</th>
                <th className="py-3.5 px-3 text-center">Голи</th>
                <th className="py-3.5 px-3 text-center">Відбір у Фінал</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Очки</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs sm:text-sm">
              {filteredRows.map(({ player: p, globalRank }) => {
                const totalGames = Math.max(1, p.wins + p.draws + p.losses);
                const winRate = Math.round((p.wins / totalGames) * 100);
                const inTop16 = globalRank <= 16;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3.5 pl-6 pr-3 font-mono font-extrabold tabular-nums">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs ${
                          globalRank === 1
                            ? 'bg-gold text-[#040814]'
                            : globalRank === 2
                              ? 'bg-sky-300 text-[#040814]'
                              : globalRank === 3
                                ? 'bg-amber-400/90 text-[#040814]'
                                : 'bg-white/[0.06] text-slate-300'
                        }`}
                      >
                        {globalRank}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <Link
                        href={`/players/${encodeURIComponent(p.nickname)}`}
                        className="flex items-center gap-3 group"
                      >
                        <span
                          className="w-8 h-8 rounded-xl font-display font-black text-xs text-[#040814] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: p.avatarColor }}
                        >
                          {getSmartInitials(p.nickname)}
                        </span>
                        <span className="font-extrabold text-white group-hover:text-gold truncate transition-colors">
                          {p.nickname}
                        </span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-3 text-xs">
                      <div className="inline-flex items-center gap-2">
                        <UaFlag className="w-3.5 h-2.5" />
                        <span className="text-slate-200">{p.city}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.06] font-mono text-[0.65rem] text-slate-300">
                          {p.platform}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono text-xs tabular-nums">
                      <span className="font-extrabold text-white">
                        {winRate}%
                      </span>{' '}
                      <span className="text-slate-400">
                        ({p.wins}В / {p.losses}П)
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-300 tabular-nums">
                      {p.goalsFor}:{p.goalsAgainst}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {globalRank === 1 || p.qualifiedAnnual ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-extrabold bg-gold/15 text-gold border border-gold/30">
                          <Crown className="w-3 h-3" />
                          Фіналіст
                        </span>
                      ) : inTop16 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-sky-400/15 text-sky-200 border border-sky-400/25">
                          <CheckCircle2 className="w-3 h-3" />
                          ТОП-16
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 pl-3 pr-6 text-right font-mono font-extrabold">
                      <span className="text-sm text-gold tabular-nums">
                        {p.seasonPoints}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
