'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Cpu, Crown, Search, Trophy, X } from 'lucide-react';
import type { PlatformType, User } from '@/lib/types';
import { getSmartInitials, isClubMemberByNickname } from './ClubCrest';
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
      if (zoneFilter === 'TOP32' && globalRank > 16) {
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
    <section className="glass-panel rounded-[34px] border border-sky-400/25 overflow-hidden shadow-[0_24px_65px_rgba(0,0,0,0.65)]">
      {/* Interactive Filter & Search Header */}
      <div className="p-6 sm:p-7 border-b border-sky-400/20 space-y-4 bg-[#040A1E]/75">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-white">
              Офіційна таблиця гравців України ({filteredRows.length})
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 text-gold font-semibold">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Золотий квиток / Фіналіст
              </span>
              <span className="inline-flex items-center gap-1.5 text-sky-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Зона відбору ТОП-16 у Підсумковий Кубок Сезону
              </span>
            </div>
          </div>

          {/* Search Capsule */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-sky-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук: нікнейм, місто або EA ID..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#04091A] border border-sky-400/30 text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors"
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

        {/* Segmented Broadcast Pill Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#030714] border border-sky-400/20">
            {(
              [
                { id: 'ALL', label: 'Усі платформи' },
                { id: 'PS5', label: 'PlayStation 5' },
                { id: 'PC', label: 'PC (EA App)' },
                { id: 'XBOX', label: 'Xbox Series X|S' },
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

          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#030714] border border-sky-400/20">
            {(
              [
                { id: 'ALL', label: 'Усі учасники' },
                { id: 'DIRECT', label: 'Золоті квитки' },
                { id: 'TOP32', label: 'Зона ТОП-16 Фіналу' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setZoneFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  zoneFilter === tab.id
                    ? 'bg-sky-400 text-[#040814]'
                    : 'text-slate-300 hover:text-white'
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
              <tr className="border-b border-sky-400/20 bg-[#030714]/90 text-[0.68rem] font-mono uppercase tracking-wider text-sky-200/90">
                <th className="py-3.5 pl-6 pr-3">#</th>
                <th className="py-3.5 px-3">Гравець / Паспорт BUNKER ID</th>
                <th className="py-3.5 px-3">Місто / Платформа</th>
                <th className="py-3.5 px-3 text-center">FUT OVR • AI Сила</th>
                <th className="py-3.5 px-3 text-center">Вінрейт (В/Н/П)</th>
                <th className="py-3.5 px-3 text-center">Голи (Різниця)</th>
                <th className="py-3.5 px-3 text-center">Статус Сезону</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Очки</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-400/10 text-xs sm:text-sm">
              {filteredRows.map(({ player: p, globalRank }) => {
                const gd = p.goalsFor - p.goalsAgainst;
                const totalGames = Math.max(1, p.wins + p.draws + p.losses);
                const winRate = Math.round((p.wins / totalGames) * 100);
                const inTop16 = globalRank <= 16;
                const isClub = isClubMemberByNickname(p.nickname);
                const futOvr = Math.min(
                  96,
                  Math.max(
                    85,
                    86 +
                      Math.round(p.seasonPoints / 42) +
                      (globalRank === 1 ? 2 : globalRank === 2 ? 1 : 0)
                  )
                );

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      globalRank <= 3
                        ? 'bg-amber-400/[0.04] hover:bg-amber-400/[0.09]'
                        : 'hover:bg-sky-400/[0.05]'
                    }`}
                  >
                    {/* Rank Pill */}
                    <td className="py-3.5 pl-6 pr-3 font-mono font-extrabold tabular-nums">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs ${
                          globalRank === 1
                            ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] shadow-[0_0_15px_rgba(245,196,81,0.4)]'
                            : globalRank === 2
                              ? 'bg-sky-300 text-[#040814]'
                              : globalRank === 3
                                ? 'bg-amber-500 text-[#040814]'
                                : 'bg-[#040A1C] text-slate-200 border border-sky-400/25'
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
                          className="w-9 h-9 rounded-2xl font-display font-black text-xs text-[#040814] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: p.avatarColor }}
                        >
                          {getSmartInitials(p.nickname)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-white group-hover:text-gold truncate transition-colors">
                              {p.nickname}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[0.52rem] font-extrabold uppercase border shrink-0 ${
                                isClub
                                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                                  : 'bg-sky-400/15 text-sky-300 border-sky-400/35'
                              }`}
                            >
                              {isClub ? 'КЛУБ' : 'ФАНАТ'}
                            </span>
                          </div>
                          <div className="text-[0.68rem] text-slate-400 font-mono truncate">
                            EA ID: {p.eaId}
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
                        <span className="px-2 py-0.5 rounded-full bg-[#040A1C] border border-sky-400/25 font-mono text-[0.65rem] font-bold text-sky-200">
                          {p.platform}
                        </span>
                      </div>
                    </td>

                    {/* FUT OVR & AI Power Rating */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-mono text-xs font-extrabold tabular-nums ${
                          futOvr >= 92
                            ? 'bg-gold/15 border-gold/40 text-gold'
                            : 'bg-sky-400/12 border-sky-400/30 text-sky-200'
                        }`}
                      >
                        <Cpu className="w-3 h-3" />
                        <span>{futOvr} OVR</span>
                      </span>
                    </td>

                    {/* Winrate + W/D/L */}
                    <td className="py-3.5 px-3 text-center font-mono text-xs tabular-nums">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div>
                          <span className="font-extrabold text-white mr-1.5">
                            {winRate}%
                          </span>
                          <span className="text-[0.68rem] text-slate-400">
                            (<span className="text-emerald-400">{p.wins}В</span>/
                            <span>{p.draws}Н</span>/
                            <span className="text-[#FF7A5C]">{p.losses}П</span>)
                          </span>
                        </div>
                        <div className="w-20 h-1.5 rounded-full bg-[#020611] overflow-hidden border border-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-gold"
                            style={{ width: `${winRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Goals & GD */}
                    <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-200 tabular-nums">
                      {p.goalsFor}:{p.goalsAgainst}{' '}
                      <span
                        className={
                          gd > 0
                            ? 'text-gold font-bold'
                            : gd < 0
                              ? 'text-[#FF7A5C]'
                              : 'text-slate-400'
                        }
                      >
                        ({gd > 0 ? `+${gd}` : gd})
                      </span>
                    </td>

                    {/* Grand Final Qualification Pill */}
                    <td className="py-3.5 px-3 text-center">
                      {p.qualifiedAnnual || globalRank === 1 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.66rem] font-extrabold bg-gold/20 text-gold border border-gold/40">
                          <Crown className="w-3 h-3" />
                          Фіналіст / Квиток
                        </span>
                      ) : inTop16 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.66rem] font-bold bg-sky-400/15 text-sky-200 border border-sky-400/30">
                          <CheckCircle2 className="w-3 h-3" />
                          ТОП-16 Сезону
                        </span>
                      ) : (
                        <span className="text-[0.68rem] text-slate-500">
                          Претендент
                        </span>
                      )}
                    </td>

                    {/* Season Points */}
                    <td className="py-3.5 pl-3 pr-6 text-right font-mono font-extrabold">
                      <span className="text-sm sm:text-base text-gold tabular-nums">
                        {p.seasonPoints}
                      </span>{' '}
                      <span className="text-[0.65rem] text-slate-400">PTS</span>
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
