'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Crown,
  ExternalLink,
  Flame,
  HeartHandshake,
  Play,
  Scale,
  Settings,
  Shield,
  Shuffle,
  Sparkles,
  Swords,
  Trash2,
  Trophy,
  UserMinus,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import {
  ZSU_CHARITY_FUND_NAME,
  ZSU_MONOBANK_CARD,
  ZSU_MONOBANK_JAR_URL,
} from '@/lib/constants';
import type {
  GroupStandingRow,
  Match,
  Participant,
  Tournament,
  User,
} from '@/lib/types';
import { ClubCrest } from './ClubCrest';
import { DrawCeremonyModal } from './DrawCeremonyModal';
import {
  NfcIcon,
  TacticalPitchArt,
  VectorEmeraldTrophy,
  VectorGoldTrophy,
} from './FintechArt';
import { HoloCard } from './HoloCard';
import { MatchRoomModal } from './MatchRoomModal';
import { ModalDialog } from './ModalDialog';
import { PlayoffBracket } from './PlayoffBracket';
import { MonoCardChip, UaFlag } from './UaFlag';

interface TournamentHubClientProps {
  tournament: Tournament;
  participants: Participant[];
  matches: Match[];
  standings: Record<string, GroupStandingRow[]>;
  currentUser: User | null;
}

export function TournamentHubClient({
  tournament,
  participants,
  matches,
  standings,
  currentUser,
}: TournamentHubClientProps) {
  const router = useRouter();

  const defaultTab =
    tournament.status === 'PLAYOFF' || tournament.status === 'COMPLETED'
      ? 'playoff'
      : tournament.status === 'GROUP_STAGE'
        ? 'groups'
        : 'participants';

  const [activeTab, setActiveTab] = useState<
    'playoff' | 'groups' | 'participants' | 'prizes'
  >(defaultTab);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [ceremonyOpen, setCeremonyOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  // Edit Tournament Form State (Admin)
  const [editTitle, setEditTitle] = useState(tournament.title);
  const [editSubtitle, setEditSubtitle] = useState(tournament.subtitle);
  const [editPrizePool, setEditPrizePool] = useState(tournament.prizePoolUah);
  const [editEntryFee, setEditEntryFee] = useState(tournament.entryFeeUah);
  const [editMaxPlayers, setEditMaxPlayers] = useState<8 | 16 | 32>(
    tournament.maxPlayers
  );
  const [editMonthLabel, setEditMonthLabel] = useState(tournament.monthLabel);
  const [editStartDate, setEditStartDate] = useState(tournament.startDate);
  const [editRulesNote, setEditRulesNote] = useState(tournament.rulesNote);

  const isAnnual = tournament.cupType === 'ANNUAL';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isRegistered = Boolean(
    currentUser && participants.some((p) => p.userId === currentUser.id)
  );
  const slotsLeft = Math.max(0, tournament.maxPlayers - participants.length);

  // Sync selectedMatch when matches prop updates (e.g. after Check-in) & open ?match= from URL
  useEffect(() => {
    if (selectedMatch) {
      const updated = matches.find((m) => m.id === selectedMatch.id);
      if (updated) {
        setSelectedMatch(updated);
      }
      return;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const matchId = params.get('match');
      if (matchId) {
        const found = matches.find((m) => m.id === matchId);
        if (found) {
          setSelectedMatch(found);
          setActiveTab(found.stage === 'PLAYOFF' ? 'playoff' : 'groups');
        }
      }
    }
  }, [matches, selectedMatch]);

  const groupLetters = Object.keys(standings).sort();
  const groupMatches = matches.filter((m) => m.stage === 'GROUP');
  const playoffMatches = matches.filter((m) => m.stage === 'PLAYOFF');
  const finalMatch = playoffMatches.find((m) => m.playoffRound === 'FINAL');
  const hasDrawnClubsOrGroups = participants.some(
    (p) => Boolean(p.club) || Boolean(p.groupName)
  );

  async function runAction(
    action: string,
    successMsg: string,
    openCeremonyAfter = false,
    extraPayload: Record<string, unknown> = {}
  ) {
    setFeedback(null);
    setBusyAction(action);
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraPayload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: 'err',
          text: data.error || 'Помилка виконання дії',
        });
        return;
      }
      if (action === 'delete_tournament') {
        router.push('/tournaments');
        router.refresh();
        return;
      }
      setFeedback({ type: 'ok', text: successMsg });
      setRegisterModalOpen(false);
      setEditModalOpen(false);
      router.refresh();
      if (openCeremonyAfter) {
        setTimeout(() => setCeremonyOpen(true), 250);
      }
      if (action === 'group_draw') setActiveTab('groups');
      if (action === 'generate_playoff') setActiveTab('playoff');
    } finally {
      setBusyAction(null);
    }
  }

  const steps: Array<{ key: string; label: string }> = [
    { key: 'REGISTRATION', label: '1. Реєстрація' },
    {
      key: 'CLUB_DRAW',
      label:
        tournament.gameMode === 'KICKOFF_CLUB_DRAFT'
          ? '2. Драфт Клубів'
          : '2. Посів Кошиків',
    },
    { key: 'GROUP_STAGE', label: '3. Груповий Етап' },
    { key: 'PLAYOFF', label: '4. Сітка Плей-офф' },
    { key: 'COMPLETED', label: '5. Нагородження' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === tournament.status);
  const fillPct = Math.min(
    100,
    Math.round((participants.length / tournament.maxPlayers) * 100)
  );

  return (
    <div className="space-y-8 pb-8">
      {/* 1. HERO TOURNAMENT STAGE */}
      <section
        className={`relative rounded-[34px] p-6 sm:p-10 overflow-hidden ${
          isAnnual ? 'glass-panel-gold' : 'glass-panel-emerald'
        }`}
      >
        {/* Clean Vector Tactical Pitch Backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-45">
            <TacticalPitchArt accent={isAnnual ? 'gold' : 'emerald'} />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-24 right-20 w-96 h-56 rounded-full opacity-25 blur-3xl diia-iridescent-bg"
          />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-tight shadow-sm inline-flex items-center gap-1.5 ${
                  isAnnual
                    ? 'bg-gold text-[#09090B]'
                    : 'bg-white text-[#09090B]'
                }`}
              >
                <UaFlag className="w-3.5 h-2.5" />
                <span>
                  {isAnnual
                    ? 'Гранд-Фінал Сезону • На підтримку ЗСУ'
                    : 'Благодійний Турнір ЗСУ'}
                </span>
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#10121A]/80 text-slate-100 border border-white/15 backdrop-blur-md">
                {tournament.gameMode === 'KICKOFF_CLUB_DRAFT'
                  ? `Драфт клубів${tournament.equal95Ovr ? ' • 95 OVR' : ''}`
                  : 'Ultimate Team 1v1'}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#10121A]/80 text-slate-200 border border-white/15 backdrop-blur-md inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pitch" />
                <span>{tournament.monthLabel}</span>
              </span>
              <a
                href={ZSU_MONOBANK_JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-400/15 hover:bg-emerald-400/25 text-pitch border border-emerald-400/35 backdrop-blur-md inline-flex items-center gap-1.5 transition-colors"
              >
                <span>🫙 Банка ЗСУ ({ZSU_CHARITY_FUND_NAME})</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.04em]">
              {tournament.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              {tournament.subtitle}
            </p>
          </div>

          {/* 3D Trophy + Charity Award & CTA Card */}
          <div className="lg:col-span-5">
            <HoloCard
              variant={isAnnual ? 'gold' : 'diia'}
              className={`rounded-[28px] p-6 flex flex-col justify-between gap-4 relative overflow-hidden ${
                isAnnual ? 'mono-iron-surface' : 'diia-card-surface'
              }`}
            >
              {/* Pure Vector 3D Trophy */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-36 h-36 flex items-center justify-center"
              >
                {isAnnual ? (
                  <VectorGoldTrophy className="w-full h-full" />
                ) : (
                  <VectorEmeraldTrophy className="w-full h-full" />
                )}
              </div>

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <MonoCardChip tone={isAnnual ? 'gold' : 'silver'} />
                  <span className="px-2.5 py-0.5 rounded-full bg-black/45 border border-white/15 text-[0.65rem] font-extrabold text-white uppercase tracking-wider">
                    {tournament.entryFeeUah === 0
                      ? 'Вхід за рейтингом'
                      : `Донат від ${tournament.entryFeeUah} ₴ на ЗСУ`}
                  </span>
                </div>
              </div>

              <div className="relative z-10 max-w-[68%] space-y-2.5">
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    Головний трофей турніру
                  </div>
                  {tournament.prizePoolUah > 0 ? (
                    <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.04em] tabular-nums leading-none mt-1">
                      {tournament.prizePoolUah.toLocaleString('uk-UA')}{' '}
                      <span className={isAnnual ? 'text-gold' : 'text-pitch'}>
                        ₴
                      </span>
                    </div>
                  ) : (
                    <div className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-[-0.03em] leading-tight mt-1">
                      🎖️ Нагорода від воїнів ЗСУ
                    </div>
                  )}
                  <div className="text-[0.68rem] text-emerald-300 font-semibold mt-1">
                    Усі 100% внесків — фонду {ZSU_CHARITY_FUND_NAME} 🇺🇦
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[0.68rem] text-slate-200">
                    <span>Зареєстровано гравців</span>
                    <span className="font-mono font-extrabold text-white tabular-nums">
                      {participants.length}/{tournament.maxPlayers}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isAnnual ? 'bg-gold' : 'diia-iridescent-bg'
                      }`}
                      style={{ width: `${Math.max(8, fillPct)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-1 flex flex-col sm:flex-row gap-2">
                {tournament.status === 'REGISTRATION' && (
                  <div className="flex-1">
                    {isRegistered ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex-1 py-2.5 px-4 rounded-full bg-emerald-400/15 border border-emerald-400/35 text-pitch text-xs font-extrabold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ви у списку ✓</span>
                        </div>
                        <button
                          type="button"
                          disabled={busyAction !== null}
                          onClick={() =>
                            runAction(
                              'unregister',
                              'Вашу заявку на участь у турнірі скасовано.'
                            )
                          }
                          className="py-2.5 px-3.5 rounded-full bg-white/[0.08] hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 border border-white/15 hover:border-rose-400/35 text-xs font-bold transition-colors"
                          title="Скасувати реєстрацію до початку жеребкування"
                        >
                          Вийти
                        </button>
                      </div>
                    ) : slotsLeft > 0 ? (
                      <button
                        type="button"
                        onClick={() => setRegisterModalOpen(true)}
                        className="w-full py-3 px-5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(255,255,255,0.2)]"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>
                          Узяти участь ({slotsLeft}{' '}
                          {slotsLeft === 1 ? 'місце' : 'місць'})
                        </span>
                      </button>
                    ) : (
                      <div className="w-full py-2.5 px-4 rounded-full bg-[#10121A]/80 border border-white/15 text-slate-300 text-xs font-bold text-center">
                        Сітка заповнена ({tournament.maxPlayers}/
                        {tournament.maxPlayers})
                      </div>
                    )}
                  </div>
                )}

                {hasDrawnClubsOrGroups ? (
                  <button
                    type="button"
                    onClick={() => setCeremonyOpen(true)}
                    className="py-2.5 px-4 rounded-full bg-[#10121A]/80 hover:bg-white hover:text-[#09090B] text-white border border-white/15 text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 text-pitch" />
                    <span>Церемонія драфту</span>
                  </button>
                ) : (
                  <a
                    href={ZSU_MONOBANK_JAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-full bg-[#10121A]/80 hover:bg-white hover:text-[#09090B] text-white border border-white/15 text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <span>🫙 Банка ЗСУ</span>
                    <ExternalLink className="w-3.5 h-3.5 text-pitch" />
                  </a>
                )}
              </div>
            </HoloCard>
          </div>
        </div>

        {/* Champion Celebration Banner */}
        {tournament.status === 'COMPLETED' && tournament.championNickname && (
          <div className="relative mt-6 p-4 rounded-[24px] mono-iron-surface flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
                <Crown className="w-6 h-6 text-gold" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-amber-200">
                  Офіційний Переможець Турніру
                </div>
                <Link
                  href={`/players/${encodeURIComponent(tournament.championNickname)}`}
                  className="font-display text-lg font-extrabold text-white hover:text-gold transition-colors"
                >
                  {tournament.championNickname}
                </Link>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#10121A]/80 border border-amber-400/40 text-xs font-bold text-gold">
              {isAnnual
                ? '🏆 Чемпіон Сезону • Нагорода від воїнів ЗСУ'
                : '🎖️ Пам’ятна нагорода від воїнів ЗСУ + 250 pts та путівка у Гранд-Фінал'}
            </span>
          </div>
        )}

        {/* 5-Stage Stepper */}
        <div className="relative mt-7 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((st, idx) => {
            const done =
              idx < currentStepIndex || tournament.status === 'COMPLETED';
            const current =
              idx === currentStepIndex && tournament.status !== 'COMPLETED';
            return (
              <div
                key={st.key}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border flex items-center gap-2 transition-colors ${
                  current
                    ? 'bg-white text-[#09090B] border-white shadow-sm'
                    : done
                      ? 'bg-emerald-400/15 border-emerald-400/35 text-pitch'
                      : 'bg-[#10121A]/65 border-white/10 text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    current
                      ? 'bg-[#09090B] animate-pulse'
                      : done
                        ? 'bg-pitch'
                        : 'bg-slate-500'
                  }`}
                />
                <span className="truncate">{st.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feedback Banner */}
      {feedback && !isAdmin && (
        <div
          className={`px-5 py-3.5 rounded-2xl text-xs font-bold border ${
            feedback.type === 'ok'
              ? 'bg-emerald-400/15 border-emerald-400/35 text-emerald-100'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* 2. ADMIN LIVE ORCHESTRATION PANEL (Visible ONLY to Referee/Admin) */}
      {isAdmin && (
        <section className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gold">
                  Пульт Організатора та Жеребкування Турніру
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Керуйте етапами кубка в реальному часі: драфт клубів, посів по
                  групах, сітка плей-офф, редагування та фіналізація очок.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {tournament.status === 'REGISTRATION' && slotsLeft > 0 && (
                <button
                  type="button"
                  disabled={busyAction !== null}
                  onClick={() =>
                    runAction(
                      'fill_demo',
                      `Сітку заповнено до ${tournament.maxPlayers} українських гравців!`
                    )
                  }
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 transition-colors"
                >
                  ➕ Доповнити ботами ({slotsLeft})
                </button>
              )}

              {tournament.gameMode === 'KICKOFF_CLUB_DRAFT' &&
                (tournament.status === 'REGISTRATION' ||
                  tournament.status === 'CLUB_DRAW' ||
                  tournament.status === 'GROUP_STAGE') && (
                  <button
                    type="button"
                    disabled={busyAction !== null || participants.length < 4}
                    onClick={() =>
                      runAction(
                        'club_draft',
                        'Жеребкування клубів успішно проведено!',
                        true
                      )
                    }
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-emerald-400/15 hover:bg-emerald-400/25 text-pitch border border-emerald-400/35 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Жеребкування Клубів</span>
                  </button>
                )}

              {(tournament.status === 'REGISTRATION' ||
                tournament.status === 'CLUB_DRAW' ||
                tournament.status === 'GROUP_STAGE') && (
                <button
                  type="button"
                  disabled={busyAction !== null || participants.length < 8}
                  onClick={() =>
                    runAction(
                      'group_draw',
                      'Кошики посіву розподілено по групах, розклад матчів створено!',
                      true
                    )
                  }
                  className="px-4 py-2 rounded-full text-xs font-extrabold bg-sky-400/15 hover:bg-sky-400/25 text-sky-300 border border-sky-400/35 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Жеребкування Груп</span>
                </button>
              )}

              {tournament.status === 'GROUP_STAGE' && (
                <>
                  <button
                    type="button"
                    disabled={busyAction !== null}
                    onClick={() =>
                      runAction(
                        'simulate_groups',
                        'Усі незавершені матчі групового етапу симульовано!'
                      )
                    }
                    className="px-4 py-2 rounded-full text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] text-slate-100 border border-white/15 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-gold" />
                    <span>Авто-рахунок груп</span>
                  </button>
                  <button
                    type="button"
                    disabled={busyAction !== null}
                    onClick={() =>
                      runAction(
                        'generate_playoff',
                        'ТОП-2 кожної групи виведено у сітку Плей-офф з крос-посівом!'
                      )
                    }
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Сформувати Плей-офф</span>
                  </button>
                </>
              )}

              {tournament.status === 'PLAYOFF' &&
                finalMatch?.status === 'COMPLETED' && (
                  <button
                    type="button"
                    disabled={busyAction !== null}
                    onClick={() =>
                      runAction(
                        'finalize',
                        'Турнір офіційно завершено! Рейтингові очки та путівку нараховано!'
                      )
                    }
                    className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-gold text-[#09090B] hover:brightness-110 inline-flex items-center gap-1.5 shadow-[0_0_24px_rgba(245,196,81,0.35)]"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Завершити Кубок & Нарахувати Очки</span>
                  </button>
                )}

              <button
                type="button"
                disabled={busyAction !== null}
                onClick={() => {
                  setEditTitle(tournament.title);
                  setEditSubtitle(tournament.subtitle);
                  setEditPrizePool(tournament.prizePoolUah);
                  setEditEntryFee(tournament.entryFeeUah);
                  setEditMaxPlayers(tournament.maxPlayers);
                  setEditMonthLabel(tournament.monthLabel);
                  setEditStartDate(tournament.startDate);
                  setEditRulesNote(tournament.rulesNote);
                  setEditModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-full text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] text-slate-100 border border-white/15 inline-flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Налаштування</span>
              </button>

              <button
                type="button"
                disabled={busyAction !== null}
                onClick={() => {
                  if (
                    window.confirm(
                      `Видалити турнір «${tournament.title}» та всі його матчі?`
                    )
                  ) {
                    runAction('delete_tournament', 'Турнір видалено.');
                  }
                }}
                className="px-3.5 py-2 rounded-full text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/35 inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Видалити</span>
              </button>
            </div>
          </div>

          {feedback && (
            <div
              className={`mt-4 px-4 py-3 rounded-2xl text-xs font-bold border ${
                feedback.type === 'ok'
                  ? 'bg-emerald-400/15 border-emerald-400/35 text-emerald-100'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </section>
      )}

      {/* 3. NAVIGATION TABS — Monobank / Дія Segmented Capsule */}
      <div className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-[#10121A]/75 border border-white/[0.14]">
        <button
          type="button"
          onClick={() => setActiveTab('playoff')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'playoff'
              ? 'bg-white text-[#09090B] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Сітка Плей-офф ({playoffMatches.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'groups'
              ? 'bg-white text-[#09090B] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Групи & Таблиці ({groupLetters.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'participants'
              ? 'bg-white text-[#09090B] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>
            {tournament.gameMode === 'KICKOFF_CLUB_DRAFT'
              ? `Клуби & Учасники (${participants.length}/${tournament.maxPlayers})`
              : `Учасники & Посів (${participants.length}/${tournament.maxPlayers})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prizes')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'prizes'
              ? 'bg-white text-[#09090B] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Призи & Правила</span>
        </button>
      </div>

      {/* TAB 1: PLAYOFF BRACKET */}
      {activeTab === 'playoff' && (
        <PlayoffBracket
          matches={matches}
          onSelectMatch={(m) => setSelectedMatch(m)}
        />
      )}

      {/* TAB 2: GROUP STAGE TABLES & FIXTURES */}
      {activeTab === 'groups' && (
        <div className="space-y-8">
          {groupLetters.length === 0 ? (
            <div className="glass-panel rounded-[30px] p-10 text-center space-y-3">
              <Shuffle className="w-10 h-10 text-sky-300 mx-auto" />
              <h3 className="font-display text-lg font-extrabold text-white">
                Групи ще не сформовані
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Після завершення реєстрації ({participants.length}/
                {tournament.maxPlayers}) організатор запускає жеребкування по 4
                кошиках рейтингу, яке автоматично розподіляє гравців у Групи A–D
                та створює календар матчів.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {groupLetters.map((g) => {
                const rows = standings[g] || [];
                const gFixtures = groupMatches.filter((m) => m.groupName === g);

                return (
                  <div
                    key={g}
                    className="glass-panel rounded-[30px] overflow-hidden flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-white/[0.1] bg-[#10121A]/65 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full diia-iridescent-bg font-display font-extrabold text-xs text-[#09090B] flex items-center justify-center">
                          {g}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display font-extrabold text-sm text-white">
                              ГРУПА {g}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-extrabold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/35">
                              ЛЧ • 2 КОЛА
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-extrabold uppercase tracking-wider bg-emerald-400/15 text-emerald-300 border border-emerald-400/35">
                              ТОП-2 У ПЛЕЙ-ОФ
                            </span>
                          </div>
                          <span className="text-[0.68rem] text-slate-300">
                            1–2 місця виходять у Плей-офф
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 text-xs font-mono text-slate-200 tabular-nums">
                        {
                          gFixtures.filter((m) => m.status === 'COMPLETED')
                            .length
                        }
                        /{gFixtures.length} зіграно
                      </span>
                    </div>

                    {/* Group Standings Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.08] text-[0.66rem] font-mono uppercase text-slate-300 bg-[#10121A]/45">
                            <th className="py-3 pl-5 pr-2">#</th>
                            <th className="py-3 px-2">Учасник</th>
                            <th className="py-3 px-2 text-center">І</th>
                            <th className="py-3 px-2 text-center">В</th>
                            <th className="py-3 px-2 text-center">Н</th>
                            <th className="py-3 px-2 text-center">П</th>
                            <th className="py-3 px-2 text-center">М&apos;ячі</th>
                            <th className="py-3 px-2 text-center">РМ</th>
                            <th className="py-3 pl-2 pr-5 text-right">ОЧК</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06] text-xs">
                          {rows.map((r) => {
                            const isClub =
                              r.nickname.startsWith('BRS_') ||
                              ['Grizzy', 'Elaizer', 'Tripik'].includes(
                                r.nickname
                              );
                            return (
                              <tr
                                key={r.userId}
                                className={
                                  r.qualifies
                                    ? 'bg-emerald-400/[0.06] hover:bg-emerald-400/[0.11]'
                                    : 'hover:bg-white/[0.03]'
                                }
                              >
                                <td className="py-3 pl-5 pr-2 font-mono font-bold">
                                  <span
                                    className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[0.68rem] ${
                                      r.qualifies
                                        ? 'bg-white text-[#09090B] font-extrabold'
                                        : 'bg-white/[0.07] text-slate-300'
                                    }`}
                                  >
                                    {r.rank}
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2.5">
                                    <ClubCrest club={r.club} size="sm" />
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <Link
                                          href={`/players/${encodeURIComponent(r.nickname)}`}
                                          className="font-extrabold text-white hover:text-pitch truncate block transition-colors"
                                        >
                                          {r.nickname}
                                        </Link>
                                        <span
                                          className={`px-1.5 py-0.5 rounded-md text-[0.55rem] font-extrabold uppercase tracking-wider shrink-0 border ${
                                            isClub
                                              ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                                              : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35'
                                          }`}
                                        >
                                          {isClub ? 'КЛУБ' : 'ФАНАТ'}
                                        </span>
                                      </div>
                                      <div className="text-[0.68rem] text-slate-400 truncate">
                                        {r.club ? r.club.name : r.city} •{' '}
                                        {r.platform}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-slate-300 tabular-nums">
                                  {r.played}
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-pitch font-bold tabular-nums">
                                  {r.won}
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-slate-400 tabular-nums">
                                  {r.drawn}
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-[#FF7A5C] tabular-nums">
                                  {r.lost}
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-slate-300 tabular-nums">
                                  {r.gf}:{r.ga}
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-slate-300 tabular-nums">
                                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                                </td>
                                <td className="py-3 pl-2 pr-5 text-right font-mono text-sm font-extrabold text-amber-300 tabular-nums">
                                  {r.points}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Group Fixtures List */}
                    <div className="p-5 bg-[#10121A]/55 border-t border-white/[0.08] space-y-2.5">
                      <div className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-300">
                        Матчі групи {g} (натисніть для відкриття VAR-кімнати)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {gFixtures.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedMatch(m)}
                            className={`px-3.5 py-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                              m.status === 'DISPUTED'
                                ? 'bg-[#FF5C39]/15 border-[#FF5C39]/45'
                                : m.status === 'PENDING_CONFIRM'
                                  ? 'bg-amber-400/15 border-amber-400/40'
                                  : 'bg-[#10121A]/75 hover:bg-[#161A26] border-white/10 hover:border-white/25'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-[0.62rem] font-mono text-slate-400">
                                Тур {m.roundNumber}
                                {m.status === 'PENDING_CONFIRM' && (
                                  <span className="text-gold ml-1">
                                    • Перевірка
                                  </span>
                                )}
                                {m.status === 'DISPUTED' && (
                                  <span className="text-[#FF7A5C] ml-1">
                                    • СПІР
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-bold text-white truncate mt-0.5">
                                {m.player1?.nickname} — {m.player2?.nickname}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full font-mono text-xs font-extrabold shrink-0 tabular-nums ${
                                m.status === 'COMPLETED'
                                  ? 'bg-white/[0.08] text-pitch border border-emerald-400/30'
                                  : 'bg-white/[0.05] text-slate-300 border border-white/10'
                              }`}
                            >
                              {m.score1 !== null && m.score2 !== null
                                ? `${m.score1}:${m.score2}`
                                : 'VS'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PARTICIPANTS, CLUB DRAFT & SEEDING POTS */}
      {activeTab === 'participants' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">
                Зареєстровані гравці та закріплені клуби ({participants.length}/
                {tournament.maxPlayers})
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Гравці автоматично ранжуються за очками Всеукраїнського сезону
                для чесного посіву по кошиках 1–4.
              </p>
            </div>
            {hasDrawnClubsOrGroups && (
              <button
                type="button"
                onClick={() => setCeremonyOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-extrabold bg-emerald-400/15 hover:bg-emerald-400/25 text-pitch border border-emerald-400/35 inline-flex items-center gap-1.5 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Повторити анімацію жеребкування</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {participants.map((p, index) => {
              const inferredPot =
                p.seedPot ??
                Math.min(
                  4,
                  Math.floor(
                    index / Math.max(1, Math.ceil(tournament.maxPlayers / 4))
                  ) + 1
                );

              return (
                <div
                  key={p.id}
                  className="glass-panel rounded-[26px] p-5 space-y-3.5 hover:border-white/25 transition-colors"
                >
                  <div className="flex items-center justify-between text-[0.68rem] font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#10121A]/75 border border-white/15 text-slate-200">
                      Кошик #{inferredPot}
                    </span>
                    {p.groupName ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-pitch font-bold">
                        Група {p.groupName}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                        {p.platform}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/players/${encodeURIComponent(p.nickname)}`}
                    className="flex items-center gap-3 group"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm text-[#09090B] shrink-0 group-hover:scale-105 transition-transform shadow"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-sm font-extrabold text-white group-hover:text-pitch truncate transition-colors">
                        {p.nickname}
                      </div>
                      <div className="text-xs text-slate-300 truncate">
                        {p.city} •{' '}
                        <span className="font-mono text-pitch font-bold">
                          {p.seasonPoints} pts
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    {tournament.gameMode === 'KICKOFF_CLUB_DRAFT' ? (
                      p.club ? (
                        <ClubCrest
                          club={p.club}
                          size="sm"
                          showName
                          showStars
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          Очікує драфту клубу
                        </span>
                      )
                    ) : (
                      <ClubCrest club={null} size="sm" showName />
                    )}
                  </div>

                  <div className="text-[0.68rem] font-mono text-slate-400 flex items-center justify-between pt-1">
                    <span className="truncate">EA: {p.eaId}</span>
                    <a
                      href={`https://t.me/${p.telegram.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{p.telegram}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  {isAdmin &&
                    (tournament.status === 'REGISTRATION' ||
                      tournament.status === 'CLUB_DRAW') && (
                      <button
                        type="button"
                        disabled={busyAction !== null}
                        onClick={() =>
                          runAction(
                            'remove_participant',
                            `Гравця ${p.nickname} виключено зі списку турніру.`,
                            false,
                            { userId: p.userId }
                          )
                        }
                        className="w-full py-1.5 px-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-[0.68rem] font-bold text-rose-200 inline-flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <UserMinus className="w-3 h-3" />
                        <span>Виключити з турніру</span>
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRIZE BREAKDOWN & RULES */}
      {activeTab === 'prizes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-[30px] p-6 sm:p-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-extrabold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                <span>Нагороди Турніру та Очки Сезону</span>
              </h3>
              <a
                href={ZSU_MONOBANK_JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-emerald-400/15 hover:bg-emerald-400/25 border border-emerald-400/35 text-xs font-extrabold text-pitch inline-flex items-center gap-1.5 transition-colors"
              >
                <span>🫙 Спільна Банка ЗСУ ({ZSU_CHARITY_FUND_NAME})</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-2.5">
              {tournament.prizeBreakdown.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[22px] bg-[#10121A]/70 border border-white/10 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-display text-sm font-extrabold text-white">
                      {tier.place}
                    </div>
                    {tier.badge && (
                      <div className="text-xs text-gold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{tier.badge}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 text-xs text-sky-300 font-bold">
                      +{tier.points} pts рейтингу
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-extrabold tabular-nums ${
                        tier.amountUah > 0
                          ? 'text-pitch'
                          : idx === 0
                            ? 'text-gold'
                            : 'text-slate-300'
                      }`}
                    >
                      {tier.amountUah > 0
                        ? `${tier.amountUah.toLocaleString('uk-UA')} ₴`
                        : idx === 0
                          ? '🎖️ Сувенір від ЗСУ'
                          : 'Кубковий залік'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[30px] p-6 sm:p-7 space-y-4">
            <h3 className="font-display text-lg font-extrabold text-white">
              Регламент благодійного турніру
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {tournament.rulesNote}
            </p>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pitch shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Вільний графік (Telegram):</strong>{' '}
                  про час та дату матчів гравці домовляються між собою напряму в
                  Telegram (бажано зіграти групу за тиждень).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pitch shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Cross-Play 1v1:</strong>{' '}
                  дозволена гра між PS5, PC та Xbox Series X|S через EA Social
                  (інвайт за EA ID).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pitch shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Система Ліги Чемпіонів:</strong>{' '}
                  3 очки за перемогу, 1 за нічию. ТОП-2 кожної групи виходять у
                  сітку Плей-офф.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">На підтримку ЗСУ:</strong>{' '}
                  внесок від 10 ₴ на спільну Банку ЗСУ (100% передаємо фонду{' '}
                  {ZSU_CHARITY_FUND_NAME}). Звіт і квитанція публікуються в нашій
                  Telegram-групі.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* REGISTRATION & CHARITY JAR MODAL */}
      <ModalDialog
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Участь у благодійному турнірі 1v1 🇺🇦"
        subtitle={tournament.title}
        maxWidthClass="max-w-md"
      >
        {!currentUser ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-200 leading-relaxed">
              Для реєстрації в турнірі увійдіть у свій профіль або створіть
              картку гравця (кнопка <strong>«Увійти / Реєстрація»</strong> у
              верхній панелі сайту).
            </p>
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="w-full py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all"
            >
              Зрозуміло
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-[24px] bg-[#10121A]/80 border border-white/15 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Гравець:</span>
                <strong className="text-white">{currentUser.nickname}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">EA ID / Платформа:</span>
                <strong className="text-sky-300 font-mono">
                  {currentUser.eaId} ({currentUser.platform})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Зв&apos;язок у Telegram:</span>
                <strong className="text-white font-mono">
                  {currentUser.telegram}
                </strong>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-white/10">
                <span className="text-slate-300">Благодійний внесок на ЗСУ:</span>
                <strong className="text-pitch font-mono text-sm">
                  {tournament.entryFeeUah === 0
                    ? 'Вільний донат на ЗСУ'
                    : `від ${tournament.entryFeeUah} ₴ (скільки хочеш і можеш)`}
                </strong>
              </div>
            </div>

            {/* Monobank Charity Jar Block */}
            <div className="p-4 rounded-[24px] bg-emerald-400/[0.08] border border-emerald-400/30 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>🫙 Крок 1. Закинь донат у Банку ЗСУ</span>
                  </div>
                  <p className="text-[0.72rem] text-slate-300 mt-1 leading-relaxed">
                    Тотального контролю по внесках немає — кожен кидає на банку
                    ЗСУ скільки хоче і може (від 10 грн). Усі 100% передаємо
                    фонду <strong className="text-white">{ZSU_CHARITY_FUND_NAME}</strong> 🇺🇦🙏
                  </p>
                </div>
              </div>

              <a
                href={ZSU_MONOBANK_JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-400/20 hover:bg-emerald-400/30 border border-emerald-400/40 text-xs font-extrabold text-white flex items-center justify-between transition-colors"
              >
                <span>🫙 Відкрити Банку ЗСУ (send.monobank.ua)</span>
                <ExternalLink className="w-4 h-4 text-pitch shrink-0" />
              </a>

              <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#10121A]/85 border border-white/10">
                <div>
                  <div className="text-[0.62rem] font-mono uppercase text-slate-400">
                    Номер картки банки Моно
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-white tracking-wider">
                    {ZSU_MONOBANK_CARD}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      ZSU_MONOBANK_CARD.replace(/\s+/g, '')
                    );
                    setCopiedCard(true);
                    setTimeout(() => setCopiedCard(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[0.68rem] font-bold text-slate-200 inline-flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedCard ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-pitch" />
                      <span className="text-pitch">Скопійовано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Скопіювати</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={busyAction !== null}
              onClick={() =>
                runAction(
                  'register',
                  `Дякуємо за підтримку ЗСУ, ${currentUser.nickname}! Вас зареєстровано в турнірі 🇺🇦`
                )
              }
              className="w-full py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all shadow-[0_12px_28px_rgba(255,255,255,0.16)]"
            >
              {busyAction === 'register'
                ? 'Реєстрація в турнірній сітці...'
                : '🇺🇦 Я підтримав Банку ЗСУ — Зареєструватись у турнірі'}
            </button>
          </div>
        )}
      </ModalDialog>

      {/* EDIT TOURNAMENT MODAL (ADMIN) */}
      <ModalDialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Налаштування турніру"
        subtitle={tournament.title}
        maxWidthClass="max-w-lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runAction(
              'update_tournament',
              'Параметри турніру успішно оновлено!',
              false,
              {
                title: editTitle,
                subtitle: editSubtitle,
                prizePoolUah: Number(editPrizePool),
                entryFeeUah: Number(editEntryFee),
                maxPlayers: editMaxPlayers,
                monthLabel: editMonthLabel,
                startDate: editStartDate,
                rulesNote: editRulesNote,
              }
            );
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Назва турніру *
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Мітка місяця / сезону
              </label>
              <input
                type="text"
                required
                value={editMonthLabel}
                onChange={(e) => setEditMonthLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Підзаголовок / опис
            </label>
            <input
              type="text"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-xs text-white focus:outline-none focus:border-white/45"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Призовий фонд (0 = Сувенір ЗСУ)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                required
                value={editPrizePool}
                onChange={(e) => setEditPrizePool(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-white/45"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Донат на Банку ЗСУ (₴)
              </label>
              <input
                type="number"
                min={0}
                max={800}
                step={5}
                required
                value={editEntryFee}
                onChange={(e) => setEditEntryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-white/45"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Дата старту
              </label>
              <input
                type="date"
                required
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/45"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Регламент матчу
            </label>
            <textarea
              rows={2}
              value={editRulesNote}
              onChange={(e) => setEditRulesNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-xs text-white focus:outline-none focus:border-white/45"
            />
          </div>

          <button
            type="submit"
            disabled={busyAction !== null}
            className="w-full py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all"
          >
            {busyAction === 'update_tournament'
              ? 'Збереження...'
              : 'Зберегти зміни турніру'}
          </button>
        </form>
      </ModalDialog>

      {/* MATCH ROOM MODAL */}
      <MatchRoomModal
        match={selectedMatch}
        currentUser={currentUser}
        onClose={() => setSelectedMatch(null)}
      />

      {/* DRAW CEREMONY STUDIO MODAL */}
      <DrawCeremonyModal
        open={ceremonyOpen}
        onClose={() => setCeremonyOpen(false)}
        tournamentTitle={tournament.title}
        gameMode={tournament.gameMode}
        participants={participants}
      />
    </div>
  );
}
