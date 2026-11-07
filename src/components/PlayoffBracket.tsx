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
  SF: '1/2 фіналу • Півфінали',
  FINAL: 'Гранд-Фінал',
  THIRD: 'Матч за 3-тє місце',
};

const ROUND_SUBTITLES: Record<PlayoffRound, string> = {
  R16: '16 КРАЩИХ',
  QF: '8 КРАЩИХ ІЗ ГРУП A–E',
  SF: '4 ПІВФІНАЛІСТИ',
  FINAL: 'ЗА ГОЛОВНИЙ ТРОФЕЙ',
  THIRD: 'БРОНЗОВИЙ ФІНАЛ',
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
    ? (PLAYER_GROUP_SEEDS[match.player1.nickname] ?? null)
    : null;
  const p2Seed = match.player2
    ? (PLAYER_GROUP_SEEDS[match.player2.nickname] ?? null)
    : null;

  const isBothAssigned = Boolean(match.player1 && match.player2);
  const isLivePlayable = match.status === 'SCHEDULED' && isBothAssigned;

  const tbaTitle = isFinal
    ? 'Переможець Півфіналу #2'
    : isThird
      ? 'Суперник із Півфіналу #2'
      : 'Очікується суперник';
  const tbaSubtitle =
    isFinal || isThird
      ? 'BRS_YoungChamp18 [E1] / Elaizer [C2]'
      : 'За результатами попереднього раунду';

  return (
    <button
      type="button"
      onClick={() => onSelect(match)}
      className={`w-full text-left rounded-[22px] transition-all duration-200 group overflow-hidden relative ${
        isFinal
          ? 'mono-iron-surface border border-amber-400/50 hover:border-amber-300/90 shadow-[0_16px_40px_rgba(245,196,81,0.16)]'
          : isThird
            ? 'bg-[#050C22]/95 border border-amber-400/30 hover:border-amber-300/65 shadow-[0_12px_30px_rgba(2,6,23,0.75)]'
            : match.status === 'DISPUTED'
              ? 'glass-panel border-rose-500/50 hover:border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.18)]'
              : isLivePlayable
                ? 'bg-[#071436]/95 border border-sky-400/55 hover:border-gold/75 shadow-[0_14px_34px_rgba(37,99,235,0.28)]'
                : 'bg-[#050C20]/95 border border-sky-400/20 hover:border-sky-400/50 shadow-[0_12px_28px_rgba(2,6,23,0.7)]'
      }`}
    >
      {/* Top Broadcast Meta Bar */}
      <div
        className={`flex items-center justify-between px-3.5 py-2 border-b text-[0.65rem] font-mono ${
          isFinal
            ? 'bg-gradient-to-r from-amber-500/20 via-[#080E22]/90 to-[#080E22]/90 border-amber-400/30'
            : isLivePlayable
              ? 'bg-gradient-to-r from-sky-500/25 via-[#07122E] to-[#07122E] border-sky-400/30'
              : 'bg-[#040918]/80 border-white/[0.08]'
        }`}
      >
        <span className="flex items-center gap-1.5 font-bold">
          {isFinal ? (
            <span className="text-gold flex items-center gap-1.5 font-extrabold tracking-wider uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>ГРАНД-ФІНАЛ • ЗА ТРОФЕЙ ЗСУ</span>
            </span>
          ) : isThird ? (
            <span className="text-amber-200 font-extrabold tracking-wider uppercase">
              🥉 МАТЧ ЗА 3 МІСЦЕ • +135 PTS
            </span>
          ) : (
            <span className="text-sky-200/90 font-extrabold">
              {match.playoffRound === 'QF'
                ? `1/4 ФІНАЛУ • МАТЧ #${match.matchOrder}`
                : `ПІВФІНАЛ #${match.matchOrder}`}
            </span>
          )}
        </span>

        {match.status === 'COMPLETED' && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/35 text-pitch inline-flex items-center gap-1 font-extrabold text-[0.6rem]">
            <CheckCircle2 className="w-3 h-3" />
            <span>FT</span>
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
        {match.status === 'SCHEDULED' &&
          (isLivePlayable ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5C39] text-white inline-flex items-center gap-1 font-sans font-extrabold text-[0.6rem] uppercase tracking-wider shadow-[0_0_12px_rgba(255,92,57,0.5)]">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>LIVE • ВІДКРИТИ</span>
            </span>
          ) : (
            <span className="text-gold/90 group-hover:text-gold transition-colors font-sans font-extrabold text-[0.64rem]">
              Очікує 1/2 →
            </span>
          ))}
      </div>

      {/* Player 1 Row */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-white/[0.06] ${
          p1Won
            ? 'bg-gradient-to-r from-emerald-500/[0.12] via-sky-500/[0.06] to-transparent'
            : ''
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
                className={`text-xs font-extrabold truncate ${
                  p1Won
                    ? 'text-white'
                    : match.player1
                      ? 'text-slate-200'
                      : 'text-slate-400'
                }`}
              >
                {match.player1 ? match.player1.nickname : tbaTitle}
              </span>
              {match.player1 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[0.52rem] font-extrabold uppercase tracking-wider shrink-0 border ${
                    isClubMemberByNickname(match.player1.nickname)
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                      : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                  }`}
                >
                  {isClubMemberByNickname(match.player1.nickname)
                    ? 'КЛУБ'
                    : 'ФАНАТ'}
                </span>
              )}
            </div>
            <div className="text-[0.64rem] text-slate-400 truncate">
              {match.player1
                ? (match.player1.club?.name ??
                  (p1Seed
                    ? `Посів ${p1Seed} • ${match.player1.city}`
                    : match.player1.city))
                : tbaSubtitle}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 font-mono tabular-nums">
          {match.penalties1 !== null && (
            <span className="text-[0.65rem] text-gold font-bold">
              ({match.penalties1})
            </span>
          )}
          <span
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold ${
              p1Won
                ? 'bg-gradient-to-b from-[#FDE68A] to-[#F5C451] text-[#040814] shadow-[0_2px_10px_rgba(245,196,81,0.35)]'
                : 'bg-[#040814]/85 text-slate-200 border border-sky-400/20'
            }`}
          >
            {match.score1 !== null ? match.score1 : '—'}
          </span>
        </div>
      </div>

      {/* Player 2 Row */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 ${
          p2Won
            ? 'bg-gradient-to-r from-emerald-500/[0.12] via-sky-500/[0.06] to-transparent'
            : ''
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
                className={`text-xs font-extrabold truncate ${
                  p2Won
                    ? 'text-white'
                    : match.player2
                      ? 'text-slate-200'
                      : 'text-sky-200/90'
                }`}
              >
                {match.player2 ? match.player2.nickname : tbaTitle}
              </span>
              {match.player2 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[0.52rem] font-extrabold uppercase tracking-wider shrink-0 border ${
                    isClubMemberByNickname(match.player2.nickname)
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                      : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                  }`}
                >
                  {isClubMemberByNickname(match.player2.nickname)
                    ? 'КЛУБ'
                    : 'ФАНАТ'}
                </span>
              )}
            </div>
            <div className="text-[0.64rem] text-slate-400 truncate">
              {match.player2
                ? (match.player2.club?.name ??
                  (p2Seed
                    ? `Посів ${p2Seed} • ${match.player2.city}`
                    : match.player2.city))
                : tbaSubtitle}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 font-mono tabular-nums">
          {match.penalties2 !== null && (
            <span className="text-[0.65rem] text-gold font-bold">
              ({match.penalties2})
            </span>
          )}
          <span
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold ${
              p2Won
                ? 'bg-gradient-to-b from-[#FDE68A] to-[#F5C451] text-[#040814] shadow-[0_2px_10px_rgba(245,196,81,0.35)]'
                : 'bg-[#040814]/85 text-slate-200 border border-sky-400/20'
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
      <div className="glass-panel rounded-[30px] p-10 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#060E24] border border-sky-400/30 flex items-center justify-center mx-auto">
          <Swords className="w-7 h-7 text-gold" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">
          Сітка Плей-офф формується після завершення Групового етапу
        </h3>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Переможці груп та найкращі другі місця виходять у сітку Single
          Elimination з крос-посівом за системою Ліги Чемпіонів.
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
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[58rem] grid grid-flow-col auto-cols-fr gap-8 items-stretch">
          {activeColumns.map((col) => (
            <div key={col.round} className="flex flex-col">
              {/* Broadcast Stage Column Header */}
              <div className="mb-4 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#071436] via-[#0A1D4D] to-[#071436] border border-sky-400/35 flex items-center justify-between gap-2 shadow-[0_8px_20px_rgba(2,6,23,0.6)]">
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white">
                  {ROUND_TITLES[col.round]}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-400/15 border border-sky-400/30 font-mono text-[0.6rem] font-extrabold text-sky-200">
                  {ROUND_SUBTITLES[col.round]}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-around gap-5">
                {col.items.map((m, idx) => (
                  <div key={m.id} className="relative">
                    <BracketMatchCard match={m} onSelect={onSelectMatch} />
                    {/* Crisp Royal Blue & Gold Broadcast Connector Line */}
                    <span
                      aria-hidden="true"
                      className="hidden sm:block pointer-events-none absolute top-1/2 -right-8 w-8 h-[2px] bg-gradient-to-r from-[#38BDF8]/75 via-[#F5C451]/75 to-[#38BDF8]/40"
                    />
                    {/* Vertical Bracket Arm Connector for Paired Matches */}
                    {col.items.length >= 2 && idx % 2 === 0 && (
                      <span
                        aria-hidden="true"
                        className="hidden sm:block pointer-events-none absolute top-1/2 -right-4 w-[2px] h-[calc(100%+1.25rem)] bg-gradient-to-b from-[#38BDF8]/65 via-[#F5C451]/80 to-[#38BDF8]/65"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Фінальна колонка (Гранд-Фінал + Матч за 3 місце) */}
          <div className="flex flex-col">
            <div className="mb-4 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-400/15 to-amber-500/25 border border-amber-400/50 flex items-center justify-between gap-2 shadow-[0_8px_24px_rgba(245,196,81,0.15)]">
              <span className="font-display text-xs font-extrabold uppercase tracking-wider text-gold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Вирішальні матчі</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 font-mono text-[0.6rem] font-extrabold text-amber-100">
                ФІНАЛ ТА 3 МІСЦЕ
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-around gap-5">
              {finalMatch && (
                <div>
                  <BracketMatchCard
                    match={finalMatch}
                    onSelect={onSelectMatch}
                    isFinal
                  />
                </div>
              )}

              {thirdMatch && (
                <div>
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
