'use client';

import React, { useEffect, useState } from 'react';
import { FastForward, Play, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import type { GameMode, Participant } from '@/lib/types';
import { ClubCrest } from './ClubCrest';
import { ModalDialog } from './ModalDialog';

interface DrawCeremonyModalProps {
  open: boolean;
  onClose: () => void;
  tournamentTitle: string;
  gameMode: GameMode;
  participants: Participant[];
}

export function DrawCeremonyModal({
  open,
  onClose,
  tournamentTitle,
  gameMode,
  participants,
}: DrawCeremonyModalProps) {
  const hasGroups = participants.some((p) => Boolean(p.groupName));
  const hasClubs =
    gameMode === 'KICKOFF_CLUB_DRAFT' &&
    participants.some((p) => Boolean(p.club));

  const [mode, setMode] = useState<'CLUBS' | 'GROUPS'>(
    hasClubs ? 'CLUBS' : 'GROUPS'
  );
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [autoPlaying, setAutoPlaying] = useState<boolean>(false);

  // Ordered sequence for group draw: Pot 1 across all groups, then Pot 2, Pot 3, Pot 4
  const orderedForGroups = [...participants]
    .filter((p) => Boolean(p.groupName))
    .sort((a, b) => {
      const potDiff = (a.seedPot ?? 4) - (b.seedPot ?? 4);
      if (potDiff !== 0) return potDiff;
      return (a.groupName || '').localeCompare(b.groupName || '');
    });

  const activeList = mode === 'CLUBS' ? participants : orderedForGroups;

  useEffect(() => {
    if (open) {
      setMode(hasClubs ? 'CLUBS' : 'GROUPS');
      setRevealedCount(0);
      setAutoPlaying(true);
    } else {
      setAutoPlaying(false);
    }
  }, [open, hasClubs]);

  useEffect(() => {
    if (!open || !autoPlaying) return;
    if (revealedCount >= activeList.length) {
      setAutoPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, 520);
    return () => clearTimeout(timer);
  }, [open, autoPlaying, revealedCount, activeList.length]);

  const groupLetters = Array.from(
    new Set(
      participants
        .map((p) => p.groupName)
        .filter((g): g is string => Boolean(g))
    )
  ).sort();

  const revealedGroupIds = new Set(
    orderedForGroups.slice(0, revealedCount).map((p) => p.id)
  );

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Студія Церемонії Жеребкування • БУНКЕР DRAFT"
      subtitle={tournamentTitle}
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-5">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-[24px] bg-[#10121A]/80 border border-white/[0.12]">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.05] border border-white/10">
            {hasClubs && (
              <button
                type="button"
                onClick={() => {
                  setMode('CLUBS');
                  setRevealedCount(0);
                  setAutoPlaying(true);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  mode === 'CLUBS'
                    ? 'bg-white text-[#09090B] shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Драфт Клубів ({participants.length})
              </button>
            )}
            {hasGroups && (
              <button
                type="button"
                onClick={() => {
                  setMode('GROUPS');
                  setRevealedCount(0);
                  setAutoPlaying(true);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  mode === 'GROUPS'
                    ? 'bg-gold text-[#09090B] shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Кошики та Групи ({groupLetters.join(', ')})
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-300 mr-1 tabular-nums">
              Відкрито: {Math.min(revealedCount, activeList.length)} /{' '}
              {activeList.length}
            </span>
            <button
              type="button"
              onClick={() => {
                if (revealedCount >= activeList.length) {
                  setRevealedCount(0);
                  setAutoPlaying(true);
                } else {
                  setAutoPlaying((v) => !v);
                }
              }}
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white inline-flex items-center gap-1.5 transition-colors"
            >
              {revealedCount >= activeList.length ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-pitch" />
                  <span>Повторити</span>
                </>
              ) : autoPlaying ? (
                <span>⏸ Пауза</span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-pitch" />
                  <span>Авто-показ</span>
                </>
              )}
            </button>
            {revealedCount < activeList.length && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAutoPlaying(false);
                    setRevealedCount((c) => Math.min(activeList.length, c + 1));
                  }}
                  className="px-3.5 py-2 rounded-full text-xs font-extrabold bg-emerald-400/15 hover:bg-emerald-400/25 text-pitch border border-emerald-400/35 transition-colors"
                >
                  +1 Куля
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAutoPlaying(false);
                    setRevealedCount(activeList.length);
                  }}
                  className="px-3.5 py-2 rounded-full text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-slate-200 inline-flex items-center gap-1 transition-colors"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Усі</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mode 1: Club Draft Cards */}
        {mode === 'CLUBS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {participants.map((p, idx) => {
              const isRevealed = idx < revealedCount;
              const isJustRevealed = idx === revealedCount - 1;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-[22px] border transition-all duration-300 ${
                    isJustRevealed
                      ? 'bg-emerald-400/15 border-pitch shadow-[0_0_25px_rgba(16,245,156,0.22)] scale-[1.02]'
                      : isRevealed
                        ? 'bg-[#10121A]/85 border-white/15'
                        : 'bg-[#10121A]/45 border-white/[0.07] opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between text-[0.66rem] font-mono text-slate-400 mb-2">
                    <span>СЛОТ #{idx + 1}</span>
                    <span>{p.city}</span>
                  </div>
                  <div className="font-display text-sm font-extrabold text-white truncate mb-2.5">
                    {p.nickname}
                  </div>
                  {isRevealed && p.club ? (
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                      <ClubCrest
                        club={p.club}
                        size="sm"
                        showName
                        showStars
                      />
                    </div>
                  ) : (
                    <div className="pt-2.5 border-t border-white/[0.07] flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <Shuffle className="w-3.5 h-3.5 animate-spin text-slate-500" />
                      <span>Очікує жереб...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2: Group Pots Reveal */}
        {mode === 'GROUPS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupLetters.map((g) => {
              const gMembers = participants
                .filter((p) => p.groupName === g)
                .sort((a, b) => (a.seedPot ?? 4) - (b.seedPot ?? 4));
              return (
                <div
                  key={g}
                  className="p-4 rounded-[24px] bg-[#10121A]/80 border border-white/[0.12] space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-display text-sm font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      ГРУПА {g}
                    </span>
                    <span className="text-[0.68rem] font-mono text-slate-300">
                      Топ-2 → Плей-офф
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((pot) => {
                      const member = gMembers.find((m) => m.seedPot === pot);
                      const shown = member && revealedGroupIds.has(member.id);
                      return (
                        <div
                          key={pot}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all ${
                            shown
                              ? 'bg-white/[0.06] border-white/15'
                              : 'bg-[#10121A]/50 border-white/[0.06] text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-mono bg-white/[0.08] border border-white/10 text-slate-200 shrink-0">
                              К{pot}
                            </span>
                            {shown && member ? (
                              <>
                                <ClubCrest club={member.club} size="sm" />
                                <span className="text-xs font-extrabold text-white truncate">
                                  {member.nickname}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-mono italic">
                                Кошик #{pot} очікує...
                              </span>
                            )}
                          </div>
                          {shown && member && (
                            <span className="text-[0.68rem] font-mono text-pitch font-bold shrink-0 tabular-nums">
                              {member.seasonPoints} pts
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
