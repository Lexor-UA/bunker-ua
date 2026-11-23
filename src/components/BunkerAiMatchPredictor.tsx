'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Bot,
  Cpu,
  Flame,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import type { User } from '@/lib/types';
import { getSmartInitials, isClubMemberByNickname } from './ClubCrest';
import { UaFlag } from './UaFlag';

interface BunkerAiMatchPredictorProps {
  players: User[];
}

interface SimulatedSeriesResult {
  game1: [number, number];
  game2: [number, number];
  game3: [number, number] | null;
  seriesScore: [number, number];
  winnerNickname: string;
  mvpStat: string;
  keyMoment: string;
}

export function BunkerAiMatchPredictor({
  players,
}: BunkerAiMatchPredictorProps) {
  const topPlayers = useMemo(() => players.slice(0, 12), [players]);

  // Default matchup: #1 BRS_Nederfox vs #3 BRS_YoungChamp18 (or top 2 available)
  const [playerAId, setPlayerAId] = useState<string>(
    topPlayers[0]?.id ?? ''
  );
  const [playerBId, setPlayerBId] = useState<string>(
    topPlayers[2]?.id ?? topPlayers[1]?.id ?? ''
  );
  const [simResult, setSimResult] = useState<SimulatedSeriesResult | null>(
    null
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const playerA = useMemo(
    () =>
      topPlayers.find((p) => p.id === playerAId) ??
      topPlayers[0],
    [topPlayers, playerAId]
  );

  const playerB = useMemo(
    () =>
      topPlayers.find((p) => p.id === playerBId) ??
      topPlayers[1] ??
      topPlayers[0],
    [topPlayers, playerBId]
  );

  // Compute AI telemetry metrics for a player
  const getTelemetry = (p: User, rankIdx: number) => {
    const games = Math.max(1, p.wins + p.draws + p.losses);
    const winRate = Math.round((p.wins / games) * 100);
    const gpg = p.goalsFor / games;
    const gapg = p.goalsAgainst / games;
    const gd = p.goalsFor - p.goalsAgainst;

    const ovr = Math.min(
      96,
      Math.max(
        85,
        86 +
          Math.round(p.seasonPoints / 42) +
          (rankIdx === 0 ? 2 : rankIdx === 1 ? 1 : 0)
      )
    );

    const attackScore = Math.min(99, Math.max(74, Math.round(72 + gpg * 4.8)));
    const defenseScore = Math.min(
      98,
      Math.max(70, Math.round(96 - gapg * 4.2 + (gd > 10 ? 4 : 0)))
    );
    const clutchScore = Math.min(
      99,
      Math.max(75, Math.round(68 + winRate * 0.31))
    );
    const tempoScore = Math.min(
      98,
      Math.max(76, Math.round(75 + (p.seasonPoints / 300) * 22))
    );

    // Composite AI Power Index
    const powerIndex =
      ovr * 1.8 +
      winRate * 0.55 +
      gpg * 6.5 -
      gapg * 3.2 +
      p.seasonPoints * 0.08;

    return {
      games,
      winRate,
      gpg: gpg.toFixed(1),
      gpgNum: gpg,
      gapgNum: gapg,
      gd,
      ovr,
      attackScore,
      defenseScore,
      clutchScore,
      tempoScore,
      powerIndex,
    };
  };

  const analysis = useMemo(() => {
    if (!playerA || !playerB) return null;
    const rankA = topPlayers.findIndex((p) => p.id === playerA.id);
    const rankB = topPlayers.findIndex((p) => p.id === playerB.id);
    const telA = getTelemetry(playerA, rankA >= 0 ? rankA : 5);
    const telB = getTelemetry(playerB, rankB >= 0 ? rankB : 5);

    const diff = telA.powerIndex - telB.powerIndex;
    const probA = Math.min(
      78,
      Math.max(22, Math.round(50 + diff * 1.15))
    );
    const probB = 100 - probA;

    const xgA = Math.max(
      1.8,
      Number(((telA.gpgNum * 0.65 + (100 - telB.defenseScore) * 0.06)).toFixed(1))
    );
    const xgB = Math.max(
      1.5,
      Number(((telB.gpgNum * 0.65 + (100 - telA.defenseScore) * 0.06)).toFixed(1))
    );

    const favorite = probA >= probB ? playerA : playerB;
    const underdog = probA >= probB ? playerB : playerA;
    const favTel = probA >= probB ? telA : telB;
    const undTel = probA >= probB ? telB : telA;

    const verdict =
      Math.abs(probA - probB) <= 8
        ? `Надзвичайно рівне протистояння 1v1: ${playerA.nickname} (${telA.ovr} OVR) та ${playerB.nickname} (${telB.ovr} OVR) мають майже ідентичний індекс сили. Долю серії BO3 вирішить реалізація моментів у кінцівці другого тайму.`
        : `Алгоритм BUNKER AI віддає перевагу ${favorite.nickname} (${Math.max(probA, probB)}% на перемогу в BO3) завдяки вищому темпу атаки (${favTel.gpg} голів/матч, вінрейт ${favTel.winRate}%). Проте ${underdog.nickname} (${undTel.gpg} г/м) здатний перевернути гру на контратаках.`;

    return {
      telA,
      telB,
      probA,
      probB,
      xgA,
      xgB,
      verdict,
    };
  }, [playerA, playerB, topPlayers]);

  if (!playerA || !playerB || !analysis) return null;

  const { telA, telB, probA, probB, xgA, xgB, verdict } = analysis;

  const handleSelectPreset = (nickA: string, nickB: string) => {
    const foundA = topPlayers.find((p) => p.nickname === nickA);
    const foundB = topPlayers.find((p) => p.nickname === nickB);
    if (foundA) setPlayerAId(foundA.id);
    if (foundB) setPlayerBId(foundB.id);
    setSimResult(null);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Deterministic-seeded yet dynamic BO3 match simulation weighted by xgA / xgB
      const rollGoals = (baseXg: number) => {
        const variance = (Math.random() - 0.46) * 2.6;
        return Math.max(1, Math.round(baseXg + variance));
      };

      let g1A = rollGoals(xgA);
      let g1B = rollGoals(xgB);
      if (g1A === g1B) {
        if (Math.random() * 100 < probA) g1A += 1;
        else g1B += 1;
      }

      let g2A = rollGoals(xgA);
      let g2B = rollGoals(xgB);
      if (g2A === g2B) {
        if (Math.random() * 100 < probA) g2A += 1;
        else g2B += 1;
      }

      let winsA = (g1A > g1B ? 1 : 0) + (g2A > g2B ? 1 : 0);
      let winsB = (g1B > g1A ? 1 : 0) + (g2B > g2A ? 1 : 0);

      let game3: [number, number] | null = null;
      if (winsA === 1 && winsB === 1) {
        let g3A = rollGoals(xgA);
        let g3B = rollGoals(xgB);
        if (g3A === g3B) {
          if (Math.random() * 100 < probA) g3A += 1;
          else g3B += 1;
        }
        game3 = [g3A, g3B];
        if (g3A > g3B) winsA += 1;
        else winsB += 1;
      }

      const winnerNickname =
        winsA > winsB ? playerA.nickname : playerB.nickname;
      const totalGoalsA = g1A + g2A + (game3 ? game3[0] : 0);
      const totalGoalsB = g1B + g2B + (game3 ? game3[1] : 0);

      setSimResult({
        game1: [g1A, g1B],
        game2: [g2A, g2B],
        game3,
        seriesScore: [winsA, winsB],
        winnerNickname,
        mvpStat: `${winnerNickname} • Загальний рахунок голів серії ${totalGoalsA}:${totalGoalsB}`,
        keyMoment: game3
          ? `Вирішальний 3-й матч серії BO3 завершився перемогою ${winnerNickname} на останніх хвилинах!`
          : `Впевнена перемога ${winnerNickname} у двох матчах поспіль (${g1A}:${g1B}, ${g2A}:${g2B}).`,
      });
      setIsSimulating(false);
    }, 350);
  };

  return (
    <section
      id="bunker-ai-arena"
      className="relative rounded-[36px] glass-panel border border-sky-400/30 p-6 sm:p-9 lg:p-10 overflow-hidden shadow-[0_30px_90px_rgba(2,6,23,0.9)] space-y-7"
    >
      {/* Top Animated Broadcast Beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] diia-iridescent-bg"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-1/4 w-[28rem] h-56 rounded-full bg-sky-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/4 w-[28rem] h-56 rounded-full bg-amber-400/10 blur-3xl"
      />

      {/* 1. HEADER & QUICK MATCHUP PRESETS */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-5 border-b border-sky-400/20 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#040A1E]/90 border border-gold/40 text-[0.7rem] font-mono font-extrabold uppercase tracking-wider text-gold shadow-[0_0_24px_rgba(245,196,81,0.2)]">
            <Cpu className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span>BUNKER AI ENGINE 2026/27 • НЕЙромережева аналітика 1v1</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-[-0.03em] uppercase">
            AI-Прогноз та Симулятор Матчів{' '}
            <span className="diia-gradient-text">EA SPORTS FC</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Оберіть будь-яких двох гравців України: алгоритм в реальному часі
            розраховує ймовірність перемоги в серії BO3, очікувані голи (xG),
            5-осьову телеметрію та моделює хід поєдинку.
          </p>
        </div>

        {/* Quick Broadcast Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 font-bold mr-1">
            Топ-матчі:
          </span>
          {[
            {
              label: 'Гранд-Фінал: Nederfox vs YoungChamp18',
              a: 'BRS_Nederfox',
              b: 'BRS_YoungChamp18',
            },
            {
              label: 'Півфінал #2: YoungChamp18 vs Elaizer',
              a: 'BRS_YoungChamp18',
              b: 'Elaizer',
            },
            {
              label: 'Матч за 3 місце: Hasfer23 vs Elaizer',
              a: 'BRS_Hasfer23',
              b: 'Elaizer',
            },
          ].map((preset) => {
            const isActive =
              playerA.nickname === preset.a && playerB.nickname === preset.b;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.a, preset.b)}
                className={`px-3.5 py-2 rounded-full text-xs font-extrabold transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] border-gold shadow-[0_8px_22px_rgba(245,196,81,0.35)]'
                    : 'bg-[#040A1C]/90 text-slate-200 border-sky-400/25 hover:border-sky-300/60 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN HEAD-TO-HEAD AI TELEMETRY STAGE */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: PLAYER A SELECTOR & CARD */}
        <div className="lg:col-span-4 rounded-[28px] bg-[#040A1C]/90 border border-amber-400/35 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-[0.65rem] font-mono font-extrabold text-gold uppercase tracking-wider">
                КУТ А • ФАВОРИТ / ГОСПОДАР
              </span>
              <span className="font-mono text-xs font-extrabold text-amber-200">
                {telA.ovr} OVR
              </span>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Оберіть гравця А:
              </label>
              <select
                value={playerA.id}
                onChange={(e) => {
                  setPlayerAId(e.target.value);
                  setSimResult(null);
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#07122E] border border-amber-400/35 text-sm font-extrabold text-white focus:outline-none focus:border-gold transition-colors"
              >
                {topPlayers.map((p, idx) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={p.id === playerB.id}
                  >
                    #{idx + 1} {p.nickname} ({p.city} • {p.seasonPoints} pts)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl text-[#040814] shrink-0 ring-2 ring-amber-300/60 shadow-[0_10px_25px_rgba(245,196,81,0.25)]"
                style={{ backgroundColor: playerA.avatarColor }}
              >
                {getSmartInitials(playerA.nickname)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/players/${encodeURIComponent(playerA.nickname)}`}
                    className="font-display text-xl font-black text-white hover:text-gold truncate transition-colors"
                  >
                    {playerA.nickname}
                  </Link>
                  <span className="px-1.5 py-0.5 rounded text-[0.55rem] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                    {isClubMemberByNickname(playerA.nickname)
                      ? 'КЛУБ'
                      : 'ФАНАТ'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 inline-flex items-center gap-1.5 mt-1">
                  <UaFlag className="w-3.5 h-2.5" />
                  <span>
                    {playerA.city} • {playerA.platform}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-gold mt-0.5">
                  {playerA.seasonPoints} pts • {playerA.wins}В / {playerA.losses}П
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-xl bg-[#030714] border border-white/10">
              <div className="font-mono text-sm font-extrabold text-gold">
                {probA}%
              </div>
              <div className="text-[0.6rem] text-slate-400">Шанс AI</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030714] border border-white/10">
              <div className="font-mono text-sm font-extrabold text-white">
                {xgA}
              </div>
              <div className="text-[0.6rem] text-slate-400">xG / Матч</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030714] border border-white/10">
              <div className="font-mono text-sm font-extrabold text-emerald-400">
                {telA.winRate}%
              </div>
              <div className="text-[0.6rem] text-slate-400">Вінрейт</div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: AI PROBABILITY ENGINE, 5-AXIS COMPARISON & BO3 SIMULATOR */}
        <div className="lg:col-span-4 rounded-[28px] bg-[#050D24]/95 border border-sky-400/30 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
          {/* Win Probability Split Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-extrabold">
              <span className="text-gold">
                {playerA.nickname} • {probA}%
              </span>
              <span className="text-[0.65rem] text-slate-400 uppercase">
                ЙМОВІРНІСТЬ ПЕРЕМОГИ
              </span>
              <span className="text-sky-300">
                {probB}% • {playerB.nickname}
              </span>
            </div>

            <div className="h-3.5 rounded-full bg-[#020611] p-0.5 border border-white/15 flex overflow-hidden">
              <div
                className="h-full rounded-l-full bg-gradient-to-r from-amber-500 via-gold to-amber-200 transition-all duration-500"
                style={{ width: `${probA}%` }}
              />
              <div
                className="h-full rounded-r-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-600 transition-all duration-500"
                style={{ width: `${probB}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[0.68rem] font-mono text-slate-300 pt-0.5">
              <span>Прогноз xG: {xgA} голів</span>
              <span className="text-white font-bold">Серія BO3</span>
              <span>Прогноз xG: {xgB} голів</span>
            </div>
          </div>

          {/* 5-Axis Comparative Telemetry Bars */}
          <div className="space-y-2.5 py-2 border-y border-white/10">
            {[
              {
                label: 'Атака та реалізація (Г/М)',
                valA: telA.attackScore,
                valB: telB.attackScore,
              },
              {
                label: 'Надійність оборони',
                valA: telA.defenseScore,
                valB: telB.defenseScore,
              },
              {
                label: 'Ментальність та Вінрейт',
                valA: telA.clutchScore,
                valB: telB.clutchScore,
              },
              {
                label: 'Турнірний темп сезону',
                valA: telA.tempoScore,
                valB: telB.tempoScore,
              },
            ].map((axis) => (
              <div key={axis.label} className="space-y-1">
                <div className="flex items-center justify-between text-[0.68rem] font-mono">
                  <span
                    className={
                      axis.valA >= axis.valB
                        ? 'font-extrabold text-gold'
                        : 'text-slate-400'
                    }
                  >
                    {axis.valA}
                  </span>
                  <span className="text-slate-300 font-sans font-semibold">
                    {axis.label}
                  </span>
                  <span
                    className={
                      axis.valB >= axis.valA
                        ? 'font-extrabold text-sky-300'
                        : 'text-slate-400'
                    }
                  >
                    {axis.valB}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 h-1.5">
                  <div className="bg-[#020611] rounded-full overflow-hidden flex justify-end">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-500"
                      style={{ width: `${axis.valA}%` }}
                    />
                  </div>
                  <div className="bg-[#020611] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-500"
                      style={{ width: `${axis.valB}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive BO3 Match Simulator Button & Live Result */}
          <div className="space-y-3">
            {simResult ? (
              <div className="p-3.5 rounded-2xl bg-[#030817] border border-gold/40 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[0.68rem] font-mono">
                  <span className="text-gold font-extrabold inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-СИМУЛЯЦІЯ СЕРІЇ BO3
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gold/20 text-gold font-extrabold">
                    Рахунок серії {simResult.seriesScore[0]}:
                    {simResult.seriesScore[1]}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 font-mono text-xs text-white">
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10">
                    Матч 1: <strong>{simResult.game1[0]}:{simResult.game1[1]}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10">
                    Матч 2: <strong>{simResult.game2[0]}:{simResult.game2[1]}</strong>
                  </span>
                  {simResult.game3 && (
                    <span className="px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/35 text-gold">
                      Матч 3: <strong>{simResult.game3[0]}:{simResult.game3[1]}</strong>
                    </span>
                  )}
                </div>
                <p className="text-[0.7rem] text-slate-300 leading-snug text-center">
                  {simResult.keyMoment}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] hover:brightness-110 text-[#040814] text-xs font-extrabold transition-all shadow-[0_12px_28px_rgba(245,196,81,0.3)] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {simResult ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Перезапустити AI-симуляцію BO3</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>
                    {isSimulating
                      ? 'Моделювання матчу...'
                      : 'Запустити AI-Симуляцію Матчу BO3'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PLAYER B SELECTOR & CARD */}
        <div className="lg:col-span-4 rounded-[28px] bg-[#040A1C]/90 border border-sky-400/35 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-400/15 border border-sky-400/40 text-[0.65rem] font-mono font-extrabold text-sky-300 uppercase tracking-wider">
                КУТ Б • ПРЕТЕНДЕНТ / ГІСТЬ
              </span>
              <span className="font-mono text-xs font-extrabold text-sky-200">
                {telB.ovr} OVR
              </span>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Оберіть гравця Б:
              </label>
              <select
                value={playerB.id}
                onChange={(e) => {
                  setPlayerBId(e.target.value);
                  setSimResult(null);
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#07122E] border border-sky-400/35 text-sm font-extrabold text-white focus:outline-none focus:border-sky-300 transition-colors"
              >
                {topPlayers.map((p, idx) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={p.id === playerA.id}
                  >
                    #{idx + 1} {p.nickname} ({p.city} • {p.seasonPoints} pts)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl text-[#040814] shrink-0 ring-2 ring-sky-300/60 shadow-[0_10px_25px_rgba(56,189,248,0.25)]"
                style={{ backgroundColor: playerB.avatarColor }}
              >
                {getSmartInitials(playerB.nickname)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/players/${encodeURIComponent(playerB.nickname)}`}
                    className="font-display text-xl font-black text-white hover:text-sky-300 truncate transition-colors"
                  >
                    {playerB.nickname}
                  </Link>
                  <span className="px-1.5 py-0.5 rounded text-[0.55rem] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                    {isClubMemberByNickname(playerB.nickname)
                      ? 'КЛУБ'
                      : 'ФАНАТ'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 inline-flex items-center gap-1.5 mt-1">
                  <UaFlag className="w-3.5 h-2.5" />
                  <span>
                    {playerB.city} • {playerB.platform}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-sky-300 mt-0.5">
                  {playerB.seasonPoints} pts • {playerB.wins}В / {playerB.losses}П
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-xl bg-[#030714] border border-white/10">
              <div className="font-mono text-sm font-extrabold text-sky-300">
                {probB}%
              </div>
              <div className="text-[0.6rem] text-slate-400">Шанс AI</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030714] border border-white/10">
              <div className="font-mono text-sm font-extrabold text-white">
                {xgB}
              </div>
              <div className="text-[0.6rem] text-slate-400">xG / Матч</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030714] border border-white/10">
              <div className="font-mono text-sm font-extrabold text-emerald-400">
                {telB.winRate}%
              </div>
              <div className="text-[0.6rem] text-slate-400">Вінрейт</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM AI ANALYST VERDICT & NEXT-GEN TECH BADGES */}
      <div className="relative z-10 p-4 sm:p-5 rounded-[24px] bg-[#030816]/90 border border-sky-400/25 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold/25 to-sky-500/25 border border-gold/40 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-gold" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[0.65rem] font-mono uppercase tracking-wider text-gold font-extrabold">
              ТАКТИЧНИЙ ВЕРДИКТ BUNKER AI • АНАЛІЗ РЕАЛЬНОЇ СТАТИСТИКИ СЕЗОНУ
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {verdict}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-[0.68rem] font-mono font-bold text-sky-200">
            AI Vision VAR • Активно
          </span>
          <span className="px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-[0.68rem] font-mono font-bold text-gold">
            FUT Telemetry v2.7
          </span>
        </div>
      </div>
    </section>
  );
}
