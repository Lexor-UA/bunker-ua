'use client';

import React, { useState } from 'react';
import { ChevronDown, Shuffle, Star } from 'lucide-react';
import { CLUBS } from '@/lib/clubs';
import type { Club } from '@/lib/types';
import { ClubCrest } from './ClubCrest';
import { UaFlag } from './UaFlag';

export function ClubDraftRoulettePreview() {
  const [filter, setFilter] = useState<
    'ALL' | 'ELITE_5' | 'BALANCED_45' | 'UPL_PRIDE'
  >('ALL');
  const [expanded, setExpanded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [drawnClub, setDrawnClub] = useState<Club | null>(CLUBS[8]); // Шахтар Донецьк

  const filteredClubs =
    filter === 'ALL' ? CLUBS : CLUBS.filter((c) => c.tier === filter);

  const visibleClubs = expanded ? filteredClubs : filteredClubs.slice(0, 12);

  function triggerDemoSpin() {
    if (spinning) return;
    const pool = filteredClubs.length > 0 ? filteredClubs : CLUBS;
    setSpinning(true);
    let ticks = 0;
    const totalTicks = 15;
    const interval = setInterval(() => {
      const randomClub = pool[Math.floor(Math.random() * pool.length)];
      setDrawnClub(randomClub);
      ticks += 1;
      if (ticks >= totalTicks) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 80);
  }

  return (
    <div className="space-y-4">
      {/* Monobank Tactile Roulette Header Tile */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-[#10121A]/70 border border-white/[0.14] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 rounded-2xl bg-white/[0.08] border border-white/15 transition-transform ${
              spinning ? 'scale-110 animate-pulse border-white/40' : ''
            }`}
          >
            <ClubCrest club={drawnClub} size="lg" />
          </div>
          <div>
            <div className="text-[0.68rem] text-pitch font-bold uppercase tracking-wider">
              Результат жеребкування
            </div>
            <div className="font-display text-lg sm:text-xl font-extrabold text-white">
              {drawnClub ? drawnClub.name : 'Оберіть кошик'}
            </div>
            {drawnClub && (
              <div className="text-xs text-slate-400 tabular-nums">
                {drawnClub.league} •{' '}
                <span className="text-gold font-semibold">
                  {drawnClub.stars}★
                </span>{' '}
                • OVR {drawnClub.ovr}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={triggerDemoSpin}
          disabled={spinning}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all shadow-[0_10px_28px_rgba(255,255,255,0.14)] inline-flex items-center justify-center gap-2 shrink-0"
        >
          <Shuffle className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
          <span>{spinning ? 'Крутимо...' : 'Крутити жереб'}</span>
        </button>
      </div>

      {/* Monobank / iOS Segmented Filter Capsules + Expand Control */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#10121A]/75 border border-white/[0.12]">
          {(
            [
              { key: 'ALL', label: `Усі (${CLUBS.length})`, flag: false },
              { key: 'UPL_PRIDE', label: 'УПЛ', flag: true },
              { key: 'ELITE_5', label: '5★ Гранди', flag: false },
              { key: 'BALANCED_45', label: '4.5★ Баланс', flag: false },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setFilter(tab.key);
                setExpanded(false);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'bg-white text-[#09090B] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.flag && <UaFlag className="w-3.5 h-2.5" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {filteredClubs.length > 12 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors inline-flex items-center gap-1"
          >
            <span>
              {expanded ? 'Згорнути' : `Усі ${filteredClubs.length} клубів`}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Unclipped Complete Rows Club Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {visibleClubs.map((club) => {
          const isSelected = drawnClub?.id === club.id;
          return (
            <button
              key={club.id}
              type="button"
              onClick={() => setDrawnClub(club)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-white/[0.15] border-white/45 shadow-[0_0_24px_rgba(255,255,255,0.1)]'
                  : 'bg-[#10121A]/60 border-white/[0.1] hover:border-white/25 hover:bg-white/[0.08]'
              }`}
            >
              <ClubCrest club={club} size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">
                  {club.name}
                </div>
                <div className="text-[0.65rem] text-slate-400 flex items-center gap-1 tabular-nums mt-0.5">
                  <Star className="w-2.5 h-2.5 fill-gold text-gold shrink-0" />
                  <span>
                    {club.stars} • OVR {club.ovr}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
