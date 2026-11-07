'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Crown, Search, Trophy, X } from 'lucide-react';
import type { PlatformType, User } from '@/lib/types';
import { UaFlag } from './UaFlag';

interface LeaderboardClientProps {
  players: User[];
}

export function LeaderboardClient({ players }: LeaderboardClientProps) {
  const [query, setQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | PlatformType>(
    'ALL'
  );
  const [zoneFilter, setZoneFilter] = useState<'ALL' | 'DIRECT' | 'TOP32'>(
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
    return rankedPlayers.filter(({ player, globalRank }) => {
      if (platformFilter !== 'ALL' && player.platform !== platformFilter) {
        return false;
      }
      if (zoneFilter === 'DIRECT' && !player.qualifiedAnnual) {
        return false;
      }
      if (zoneFilter === 'TOP32' && globalRank > 32) {
        return false;
      }
      if (!q) return true;
      return (
        player.nickname.toLowerCase().includes(q) ||
        player.city.toLowerCase().includes(q) ||
        player.eaId.toLowerCase().includes(q) ||
        player.fullName.toLowerCase().includes(q)
      );
    });
  }, [rankedPlayers, query, platformFilter, zoneFilter]);

  return (
    <section className="glass-panel rounded-[32px] overflow-hidden">
      {/* Interactive Filter & Search Header */}
      <div className="p-6 border-b border-white/[0.1] space-y-4 bg-white/[0.03]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
              Офіційна таблиця гравців України ({filteredRows.length})
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 text-gold font-semibold">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Золотий квиток (Чемпіон місяця)
              </span>
              <span className="inline-flex items-center gap-1.5 text-pitch font-semibold">
                <span className="w-2 h-2 rounded-full bg-pitch" />
                Зона відбору ТОП-32 у Фінал
              </span>
            </div>
          </div>

          {/* Search Capsule */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Нікнейм, місто або EA ID..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#10121A]/75 border border-white/[0.14] text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-white/40 transition-colors"
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

        {/* Segmented Monobank Pill Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#10121A]/75 border border-white/[0.12]">
            {(
              [
                { id: 'ALL', label: 'Усі консолі' },
                { id: 'PS5', label: 'PS5' },
                { id: 'PC', label: 'PC' },
                { id: 'XBOX', label: 'Xbox' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPlatformFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  platformFilter === tab.id
                    ? 'bg-white text-[#09090B]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#10121A]/75 border border-white/[0.12]">
            {(
              [
                { id: 'ALL', label: 'Усі учасники' },
                { id: 'DIRECT', label: 'Золоті квитки' },
                { id: 'TOP32', label: 'Прохідна зона' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setZoneFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  zoneFilter === tab.id
                    ? 'bg-white text-[#09090B]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {filteredRows.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="text-sm font-extrabold text-white">
            Гравців за вашим фільтром не знайдено
          </div>
          <p className="text-xs text-slate-400">
            Спробуйте змінити платформу або очистити пошуковий запит.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.1] bg-[#10121A]/65 text-[0.68rem] font-mono uppercase tracking-wider text-slate-300">
                <th className="py-3.5 pl-6 pr-3">#</th>
                <th className="py-3.5 px-3">Гравець / EA ID</th>
                <th className="py-3.5 px-3">Місто / Консоль</th>
                <th className="py-3.5 px-3 text-center">Кубки</th>
                <th className="py-3.5 px-3 text-center">Вінрейт (В/Н/П)</th>
                <th className="py-3.5 px-3 text-center">М&apos;ячі</th>
                <th className="py-3.5 px-3 text-center">Відбір у Фінал</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Рейтинг</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs sm:text-sm">
              {filteredRows.map(({ player: p, globalRank }) => {
                const gd = p.goalsFor - p.goalsAgainst;
                const totalGames = Math.max(1, p.wins + p.draws + p.losses);
                const winRate = Math.round((p.wins / totalGames) * 100);
                const inTop32 = globalRank <= 32;

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      p.qualifiedAnnual
                        ? 'bg-amber-400/[0.04] hover:bg-amber-400/[0.08]'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Rank Pill */}
                    <td className="py-3.5 pl-6 pr-3 font-mono font-extrabold tabular-nums">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs ${
                          globalRank === 1
                            ? 'bg-gold text-[#09090B]'
                            : globalRank === 2
                              ? 'diia-iridescent-bg text-[#09090B]'
                              : globalRank === 3
                                ? 'bg-white text-[#09090B]'
                                : 'bg-white/[0.08] text-slate-200 border border-white/15'
                        }`}
                      >
                        {globalRank}
                      </span>
                    </td>

                    {/* Player Identity */}
                    <td className="py-3.5 px-3">
                      <Link
                        href={`/players/${encodeURIComponent(p.nickname)}`}
                        className="flex items-center gap-3 group"
                      >
                        <span
                          className="w-9 h-9 rounded-2xl font-display font-extrabold text-xs text-[#09090B] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: p.avatarColor }}
                        >
                          {p.nickname.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-white group-hover:text-pitch truncate transition-colors">
                            {p.nickname}
                          </div>
                          <div className="text-[0.68rem] text-slate-400 font-mono truncate">
                            EA: {p.eaId}
                          </div>
                        </div>
                      </Link>
                    </td>

                    {/* City + Platform */}
                    <td className="py-3.5 px-3 text-xs">
                      <div className="inline-flex items-center gap-2">
                        <UaFlag className="w-3.5 h-2.5" />
                        <span className="text-slate-200 font-medium">
                          {p.city}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 font-mono text-[0.65rem] font-bold text-slate-200">
                          {p.platform}
                        </span>
                      </div>
                    </td>

                    {/* Cups Won */}
                    <td className="py-3.5 px-3 text-center">
                      {p.tournamentsWon > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 font-mono text-xs font-extrabold text-gold tabular-nums">
                          <Trophy className="w-3 h-3" />
                          {p.tournamentsWon}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Winrate + W/D/L */}
                    <td className="py-3.5 px-3 text-center font-mono text-xs tabular-nums">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div>
                          <span className="font-extrabold text-white mr-1.5">
                            {winRate}%
                          </span>
                          <span className="text-[0.68rem] text-slate-400">
                            (<span className="text-pitch">{p.wins}</span>/
                            <span>{p.draws}</span>/
                            <span className="text-[#FF7A5C]">{p.losses}</span>)
                          </span>
                        </div>
                        <div className="w-20 h-1 rounded-full bg-white/[0.08] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-pitch"
                            style={{ width: `${winRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Goals & GD */}
                    <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-300 tabular-nums">
                      {p.goalsFor}:{p.goalsAgainst}{' '}
                      <span
                        className={
                          gd > 0
                            ? 'text-pitch font-bold'
                            : gd < 0
                              ? 'text-[#FF7A5C]'
                              : 'text-slate-500'
                        }
                      >
                        ({gd > 0 ? `+${gd}` : gd})
                      </span>
                    </td>

                    {/* Grand Final Qualification Pill */}
                    <td className="py-3.5 px-3 text-center">
                      {p.qualifiedAnnual ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.66rem] font-extrabold bg-amber-400/20 text-gold border border-amber-400/35">
                          <Crown className="w-3 h-3" />
                          Золотий квиток
                        </span>
                      ) : inTop32 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.66rem] font-bold bg-emerald-400/15 text-pitch border border-emerald-400/25">
                          <CheckCircle2 className="w-3 h-3" />
                          Зона ТОП-32
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Резерв</span>
                      )}
                    </td>

                    {/* Points Capsule */}
                    <td className="py-3.5 pl-3 pr-6 text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 font-display text-sm font-extrabold text-white tabular-nums">
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

