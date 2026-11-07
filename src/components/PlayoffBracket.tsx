'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Crown, ShieldAlert, Swords, Trophy } from 'lucide-react';
import type { Match, PlayoffRound } from '@/lib/types';
import { ClubCrest, isClubMemberByNickname } from './ClubCrest';

interface PlayoffBracketProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  prizeCurrencyLabel?: string;
}

const ROUND_TITLES: Record<PlayoffRound, string> = {
  R16: '1/8 фіналу',
  QF: '1/4 фіналу',
  SF: 'Півфінали',
  FINAL: 'Гранд-Фінал',
  THIRD: 'Матч за 3-тє місце',
};

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
    ? PLAYER_GROUP_SEEDS[match.player1.nickname] ?? null
    : null;
  const p2Seed = match.player2
    ? PLAYER_GROUP_SEEDS[match.player2.nickname] ?? null
    : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(match)}
      className={`w-full text-left rounded-[22px] transition-all group overflow-hidden ${isFinal
          ? 'mono-iron-surface hover:border-amber-300/70 shadow-[0_14px_34px_rgba(251,191,36,0.12)]'
          : isThird
            ? 'glass-panel hover:border-amber-400/40'
            : match.status === 'DISPUTED'
              ? 'glass-panel border-rose-500/50 hover:border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.18)]'
              : 'glass-panel hover:border-white/30'
        }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.09] bg-[#10121A]/55 text-[0.66rem] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
          {isFinal ? (
            <span className="text-gold flex items-center gap-1 font-extrabold">
              <Crown className="w-3.5 h-3.5" /> ГРАНД-ФІНАЛ
            </span>
          ) : isThird ? (
            <span className="text-amber-200/90 font-bold">МАТЧ ЗА 3 МІСЦЕ</span>
          ) : (
            <span>МАТЧ #{match.matchOrder}</span>
          )}
        </span>

        {match.status === 'COMPLETED' && (
          <span className="text-pitch inline-flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3" /> FT
          </span>
        )}
        {match.status === 'DISPUTED' && (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1 animate-pulse">
            <ShieldAlert className="w-3 h-3" /> СПІР
          </span>
        )}
        {match.status === 'PENDING_CONFIRM' && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> ПЕРЕВІРКА
          </span>
        )}
        {match.status === 'SCHEDULED' && (
          <span className="text-pitch group-hover:text-white transition-colors font-sans font-bold">
            LIVE • Відкрити →
          </span>
        )}
      </div>

      {/* Player 1 Row */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-white/[0.05] ${p1Won ? 'bg-emerald-400/[0.07]' : ''
          }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ClubCrest
            club={match.player1?.club}
            nickname={match.player1?.nickname}
            seedBadge={p1Seed}
            size="sm"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`text-xs font-bold truncate ${p1Won
                    ? 'text-white'
                    : match.player1
                      ? 'text-slate-200'
                      : 'text-slate-500 italic'
                  }`}
              >
                {match.player1 ? match.player1.nickname : 'TBA • Очікується'}
              </span>
              {match.player1 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[0.55rem] font-extrabold uppercase tracking-wider shrink-0 border ${isClubMemberByNickname(match.player1.nickname)
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                      : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                    }`}
                >
                  {isClubMemberByNickname(match.player1.nickname) ? 'КЛУБ' : 'ФАНАТ'}
                </span>
              )}
            </div>
            {match.player1 && (
              <div className="text-[0.65rem] text-slate-400 truncate">
                {match.player1.club?.name ??
                  (p1Seed
                    ? `Посів ${p1Seed} • ${match.player1.city}`
                    : match.player1.city)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 font-mono tabular-nums">
          {match.penalties1 !== null && (
            <span className="text-[0.65rem] text-amber-300">
              ({match.penalties1})
            </span>
          )}
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${p1Won
                ? 'bg-white text-[#09090B]'
                : 'bg-[#10121A]/65 text-slate-200 border border-white/15'
              }`}
          >
            {match.score1 !== null ? match.score1 : '—'}
          </span>
        </div>
      </div>

      {/* Player 2 Row */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 ${p2Won ? 'bg-emerald-400/[0.07]' : ''
          }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ClubCrest
            club={match.player2?.club}
            nickname={match.player2?.nickname}
            seedBadge={p2Seed}
            size="sm"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`text-xs font-bold truncate ${p2Won
                    ? 'text-white'
                    : match.player2
                      ? 'text-slate-200'
                      : 'text-slate-500 italic'
                  }`}
              >
                {match.player2 ? match.player2.nickname : 'TBA • Очікується'}
              </span>
              {match.player2 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[0.55rem] font-extrabold uppercase tracking-wider shrink-0 border ${isClubMemberByNickname(match.player2.nickname)
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                      : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                    }`}
                >
                  {isClubMemberByNickname(match.player2.nickname) ? 'КЛУБ' : 'ФАНАТ'}
                </span>
              )}
            </div>
            {match.player2 && (
              <div className="text-[0.65rem] text-slate-400 truncate">
                {match.player2.club?.name ??
                  (p2Seed
                    ? `Посів ${p2Seed} • ${match.player2.city}`
                    : match.player2.city)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 font-mono tabular-nums">
          {match.penalties2 !== null && (
            <span className="text-[0.65rem] text-amber-300">
              ({match.penalties2})
            </span>
          )}
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${p2Won
                ? 'bg-white text-[#09090B]'
                : 'bg-[#10121A]/65 text-slate-200 border border-white/15'
              }`}
          >
            {match.score2 !== null ? match.score2 : '—'}
          </span>
        </div>
      </div>
    </button>
  );
}

export function PlayoffBracket({ matches, onSelectMatch }: PlayoffBracketProps) {
  const playoffMatches = matches.filter((m) => m.stage === 'PLAYOFF');

  if (playoffMatches.length === 0) {
    return (
      <div className="glass-panel rounded-[30px] p-10 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#10121A]/80 border border-white/15 flex items-center justify-center mx-auto">
          <Swords className="w-7 h-7 text-pitch" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">
          Сітка Плей-офф формується після завершення Групового етапу
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          ТОП-2 гравці з кожної групи виходять у сітку Single Elimination з
          крос-посівом (1-ше місце грає проти 2-го місця іншої групи, а одногрупники
          розводяться у різні половини сітки до самого фіналу).
        </p>
      </div>
    );
  }

  const r16 = playoffMatches.filter((m) => m.playoffRound === 'R16');
  const qf = playoffMatches.filter((m) => m.playoffRound === 'QF');
  const sf = playoffMatches.filter((m) => m.playoffRound === 'SF');
  const finalMatch = playoffMatches.find((m) => m.playoffRound === 'FINAL');
  const thirdMatch = playoffMatches.find((m) => m.playoffRound === 'THIRD');

  const activeColumns: Array<{
    round: PlayoffRound;
    items: Match[];
  }> = [];
  if (r16.length > 0) activeColumns.push({ round: 'R16', items: r16 });
  if (qf.length > 0) activeColumns.push({ round: 'QF', items: qf });
  if (sf.length > 0) activeColumns.push({ round: 'SF', items: sf });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <span>
          Натисніть на будь-який матч у сітці, щоб відкрити кімнату матчу 1v1,
          переглянути скріншот або внести результат.
        </span>
        <span className="font-mono text-pitch">
          Single Elimination • Крос-посів груп
        </span>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[56rem] grid grid-flow-col auto-cols-fr gap-7 items-stretch">
          {activeColumns.map((col) => (
            <div key={col.round} className="flex flex-col">
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#131620]/75 border border-white/15 text-center shadow-inner">
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-100">
                  {ROUND_TITLES[col.round]}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-around gap-5">
                {col.items.map((m) => (
                  <div key={m.id} className="relative">
                    <BracketMatchCard match={m} onSelect={onSelectMatch} />
                    {/* Subtle horizontal broadcast connector */}
                    <span
                      aria-hidden="true"
                      className="hidden sm:block pointer-events-none absolute top-1/2 -right-7 w-7 h-[2px] bg-gradient-to-r from-emerald-400/35 to-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Фінальна колонка (Гранд-Фінал + Матч за 3 місце) */}
          <div className="flex flex-col">
            <div className="mb-4 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border border-amber-400/40 text-center">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-gold flex items-center justify-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Вирішальні матчі
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
              {finalMatch && (
                <div className="space-y-2">
                  <BracketMatchCard
                    match={finalMatch}
                    onSelect={onSelectMatch}
                    isFinal
                  />
                </div>
              )}

              {thirdMatch && (
                <div className="space-y-2">
                  <BracketMatchCard
                    match={thirdMatch}
                    onSelect={onSelectMatch}
                    isThird
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

