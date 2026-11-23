'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  Radio,
  ShieldAlert,
  Swords,
  Trophy,
} from 'lucide-react';
import type { Match } from '@/lib/types';
import { ClubCrest } from './ClubCrest';

interface PlayoffBracketProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  prizeCurrencyLabel?: string;
}

const PLAYER_GROUP_SEEDS: Record<string, string> = {
  BRS_Nederfox: 'A1',
  BRS_Vestern: 'B1',
  BRS_Hasfer23: 'C1',
  BRS_Lunnek1: 'D1',
  BRS_YoungChamp18: 'E1',
  Grizzy: 'A2',
  Elaizer: 'C2',
  BRS_PELTIK88: 'E2',
};

function BracketMatchCard({
  match,
  onSelect,
  isFinal = false,
  isThird = false,
}: {
  match: Match;
  onSelect: (m: Match) => void;
  isFinal?: boolean;
  isThird?: boolean;
}) {
  const p1Won = Boolean(match.winnerId && match.winnerId === match.player1Id);
  const p2Won = Boolean(match.winnerId && match.winnerId === match.player2Id);
  const p1Seed = match.player1
    ? (PLAYER_GROUP_SEEDS[match.player1.nickname] ?? null)
    : null;
  const p2Seed = match.player2
    ? (PLAYER_GROUP_SEEDS[match.player2.nickname] ?? null)
    : null;

  const isBothAssigned = Boolean(match.player1 && match.player2);
  const isLivePlayable = match.status === 'SCHEDULED' && isBothAssigned;

  const tbaTitle = isFinal
    ? 'Переможець 1/2'
    : isThird
      ? 'Суперник із 1/2'
      : 'Очікується';

  return (
    <button
      type="button"
      onClick={() => onSelect(match)}
      className={`w-full text-left rounded-[20px] transition-all duration-200 group overflow-hidden relative cursor-pointer ${
        isFinal
          ? 'bg-gradient-to-br from-[#141D3B] via-[#0B1228] to-[#1F170D] border border-amber-400/45 hover:border-amber-300 shadow-[0_14px_34px_rgba(0,0,0,0.55)]'
          : isLivePlayable
            ? 'bg-[#071330] border border-sky-400/45 hover:border-sky-300 shadow-[0_12px_28px_rgba(37,99,235,0.2)]'
            : 'bg-[#050B1C]/90 border border-white/[0.09] hover:border-white/25'
      }`}
    >
      {/* Compact Match Header */}
      <div
        className={`flex items-center justify-between px-3.5 py-2 border-b text-[0.65rem] ${
          isFinal
            ? 'bg-amber-400/10 border-amber-400/25'
            : isLivePlayable
              ? 'bg-sky-400/10 border-sky-400/25'
              : 'bg-white/[0.02] border-white/[0.06]'
        }`}
      >
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          {isFinal ? (
            <span className="text-gold font-extrabold inline-flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Гранд-Фінал</span>
            </span>
          ) : isThird ? (
            <span className="text-amber-200 font-bold">Матч за 3 місце</span>
          ) : (
            <span>Матч #{match.matchOrder}</span>
          )}
        </span>

        {match.status === 'COMPLETED' && (
          <span className="text-emerald-400 inline-flex items-center gap-1 font-mono font-bold text-[0.62rem]">
            <CheckCircle2 className="w-3 h-3" />
            <span>FT</span>
          </span>
        )}
        {match.status === 'DISPUTED' && (
          <span className="text-rose-300 inline-flex items-center gap-1 font-bold text-[0.62rem]">
            <ShieldAlert className="w-3 h-3" /> Спір
          </span>
        )}
        {match.status === 'PENDING_CONFIRM' && (
          <span className="text-amber-300 inline-flex items-center gap-1 font-bold text-[0.62rem]">
            <AlertTriangle className="w-3 h-3" /> Перевірка
          </span>
        )}
        {match.status === 'SCHEDULED' &&
          (isLivePlayable ? (
            <span className="px-2 py-0.5 rounded-full bg-[#FF5C39] text-white inline-flex items-center gap-1 font-extrabold text-[0.58rem] uppercase">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>LIVE</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[0.62rem]">Очікується</span>
          ))}
      </div>

      {/* Player 1 Row */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-white/[0.05] ${
          p1Won ? 'bg-white/[0.04]' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ClubCrest
            club={match.player1?.club}
            nickname={match.player1?.nickname}
            seedBadge={p1Seed}
            size="sm"
          />
          <span
            className={`text-xs font-bold truncate ${
              p1Won
                ? 'text-white'
                : match.player1
                  ? 'text-slate-200'
                  : 'text-slate-500'
            }`}
          >
            {match.player1 ? match.player1.nickname : tbaTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 font-mono tabular-nums">
          {match.penalties1 !== null && (
            <span className="text-[0.65rem] text-gold font-bold">
              ({match.penalties1})
            </span>
          )}
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
              p1Won
                ? 'bg-gold text-[#040814]'
                : 'bg-[#040814]/80 text-slate-300 border border-white/10'
            }`}
          >
            {match.score1 !== null ? match.score1 : '—'}
          </span>
        </div>
      </div>

      {/* Player 2 Row */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 ${
          p2Won ? 'bg-white/[0.04]' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ClubCrest
            club={match.player2?.club}
            nickname={match.player2?.nickname}
            seedBadge={p2Seed}
            size="sm"
          />
          <span
            className={`text-xs font-bold truncate ${
              p2Won
                ? 'text-white'
                : match.player2
                  ? 'text-slate-200'
                  : 'text-slate-500'
            }`}
          >
            {match.player2 ? match.player2.nickname : tbaTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 font-mono tabular-nums">
          {match.penalties2 !== null && (
            <span className="text-[0.65rem] text-gold font-bold">
              ({match.penalties2})
            </span>
          )}
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
              p2Won
                ? 'bg-gold text-[#040814]'
                : 'bg-[#040814]/80 text-slate-300 border border-white/10'
            }`}
          >
            {match.score2 !== null ? match.score2 : '—'}
          </span>
        </div>
      </div>
    </button>
  );
}

export function PlayoffBracket({
  matches,
  onSelectMatch,
}: PlayoffBracketProps) {
  const playoffMatches = matches.filter((m) => m.stage === 'PLAYOFF');

  if (playoffMatches.length === 0) {
    return (
      <div className="glass-panel rounded-[28px] p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#060E24] border border-white/15 flex items-center justify-center mx-auto">
          <Swords className="w-6 h-6 text-gold" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">
          Сітка Плей-офф формується після групового етапу
        </h3>
      </div>
    );
  }

  const qf = playoffMatches
    .filter((m) => m.playoffRound === 'QF')
    .sort((a, b) => a.matchOrder - b.matchOrder);
  const sf = playoffMatches
    .filter((m) => m.playoffRound === 'SF')
    .sort((a, b) => a.matchOrder - b.matchOrder);
  const finalMatch = playoffMatches.find((m) => m.playoffRound === 'FINAL');
  const thirdMatch = playoffMatches.find((m) => m.playoffRound === 'THIRD');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Column 1: Quarterfinals */}
      <div className="flex flex-col justify-between gap-4">
        <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
          <span className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-200">
            1/4 Фіналу
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-around gap-3.5">
          {qf.map((m) => (
            <BracketMatchCard key={m.id} match={m} onSelect={onSelectMatch} />
          ))}
        </div>
      </div>

      {/* Column 2: Semifinals */}
      <div className="flex flex-col justify-between gap-4">
        <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
          <span className="font-display text-xs font-extrabold uppercase tracking-wider text-sky-200">
            1/2 Фіналу • Півфінали
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-around gap-6 py-2">
          {sf.map((m) => (
            <BracketMatchCard key={m.id} match={m} onSelect={onSelectMatch} />
          ))}
        </div>
      </div>

      {/* Column 3: Grand Final & 3rd Place Match */}
      <div className="flex flex-col justify-between gap-4">
        <div className="px-4 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-center">
          <span className="font-display text-xs font-extrabold uppercase tracking-wider text-gold inline-flex items-center justify-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Фінальні матчі</span>
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6 py-2">
          {finalMatch && (
            <BracketMatchCard
              match={finalMatch}
              onSelect={onSelectMatch}
              isFinal
            />
          )}
          {thirdMatch && (
            <BracketMatchCard
              match={thirdMatch}
              onSelect={onSelectMatch}
              isThird
            />
          )}
        </div>
      </div>
    </div>
  );
}
