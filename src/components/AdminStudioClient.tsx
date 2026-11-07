'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Database,
  FileCheck2,
  Lock,
  Plus,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import type {
  ClubPoolType,
  CupType,
  EaComplianceSummary,
  GameMode,
  Match,
  Tournament,
  User,
} from '@/lib/types';
import { EA_MAX_ENTRY_FEE_UAH } from '@/lib/constants';
import { ClubCrest } from './ClubCrest';
import { HoloCard } from './HoloCard';
import { MatchRoomModal } from './MatchRoomModal';
import { MonoPrizeJarSvg, UaFlag } from './UaFlag';

interface AdminStudioClientProps {
  currentUser: User | null;
  compliance: EaComplianceSummary;
  disputedMatches: Match[];
  tournaments: Tournament[];
}

function getUkrainianStatusMeta(status: Tournament['status']): {
  label: string;
  pillClass: string;
} {
  switch (status) {
    case 'PLAYOFF':
      return {
        label: '● Плей-офф LIVE',
        pillClass: 'bg-[#FF5C39]/20 text-[#FF7A5C] border border-[#FF5C39]/35',
      };
    case 'GROUP_STAGE':
      return {
        label: '● Групи LIVE',
        pillClass: 'bg-sky-400/15 text-sky-300 border border-sky-400/30',
      };
    case 'CLUB_DRAW':
      return {
        label: '● Жереб клубів',
        pillClass: 'bg-amber-400/15 text-gold border border-amber-400/30',
      };
    case 'REGISTRATION':
      return {
        label: '● Реєстрація',
        pillClass: 'bg-white text-[#09090B]',
      };
    default:
      return {
        label: 'Завершено',
        pillClass: 'bg-white/[0.07] text-slate-300 border border-white/10',
      };
  }
}

export function AdminStudioClient({
  currentUser,
  compliance,
  disputedMatches,
  tournaments,
}: AdminStudioClientProps) {
  const router = useRouter();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemMsg, setSystemMsg] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<'monthly' | 'upl' | 'annual'>(
    'monthly'
  );

  // Admin Login Form State (when not authenticated as ADMIN)
  const [adminLoginId, setAdminLoginId] = useState('');
  const [adminLoginPass, setAdminLoginPass] = useState('');
  const [adminLoginErr, setAdminLoginErr] = useState<string | null>(null);

  // Create Tournament Form State
  const [title, setTitle] = useState('Благодійний Турнір 1v1 • На підтримку ЗСУ');
  const [subtitle, setSubtitle] = useState(
    'Система Ліги Чемпіонів (4 групи + Плей-офф) • Приз: пам’ятна нагорода від воїнів ЗСУ'
  );
  const [cupType, setCupType] = useState<CupType>('MONTHLY');
  const [gameMode, setGameMode] = useState<GameMode>('KICKOFF_CLUB_DRAFT');
  const [clubPool, setClubPool] = useState<ClubPoolType>('BALANCED_45');
  const [equal95Ovr, setEqual95Ovr] = useState(true);
  const [prizePoolUah, setPrizePoolUah] = useState(0);
  const [entryFeeUah, setEntryFeeUah] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState<8 | 16 | 32>(16);
  const [monthLabel, setMonthLabel] = useState('Грудень 2026');
  const [startDate, setStartDate] = useState('2026-12-05');
  const [rulesNote, setRulesNote] = useState(
    'Благодійний турнір 1х1 в EA FC на підтримку ЗСУ (усі 100% внесків передаємо фонду Project Ukraine). Графік вільний: про час та дату матчів гравці домовляються між собою в Telegram (бажано зіграти групу за тиждень).'
  );

  const totalRegisteredAcrossCups = tournaments.reduce(
    (acc, t) => acc + (t.participantCount ?? 0),
    0
  );
  const totalSlotsAcrossCups = tournaments.reduce(
    (acc, t) => acc + t.maxPlayers,
    0
  );

  const projectedTotalUah = compliance.totalPrizeUah + Number(prizePoolUah || 0);
  const projectedPct = Math.min(
    100,
    Math.round((projectedTotalUah / compliance.limitUah) * 1000) / 10
  );
  const exceedsEaCap = Number(prizePoolUah || 0) > compliance.remainingUah;

  function applyPreset(preset: 'monthly' | 'upl' | 'annual') {
    setActivePreset(preset);
    setError(null);
    if (preset === 'monthly') {
      setTitle('Благодійний Турнір 1v1 • На підтримку ЗСУ');
      setSubtitle(
        'Система Ліги Чемпіонів (4 групи + Плей-офф) • Приз: пам’ятна нагорода від воїнів ЗСУ'
      );
      setCupType('MONTHLY');
      setGameMode('KICKOFF_CLUB_DRAFT');
      setClubPool('BALANCED_45');
      setEqual95Ovr(true);
      setPrizePoolUah(0);
      setEntryFeeUah(10);
      setMaxPlayers(16);
      setMonthLabel('Грудень 2026');
      setStartDate('2026-12-05');
    } else if (preset === 'upl') {
      setTitle('Благодійний Кубок УПЛ & Європи • ЗСУ');
      setSubtitle('Шахтар, Динамо та гранди у режимі 95 OVR • 16 гравців');
      setCupType('MONTHLY');
      setGameMode('KICKOFF_CLUB_DRAFT');
      setClubPool('ALL_TOP');
      setEqual95Ovr(true);
      setPrizePoolUah(0);
      setEntryFeeUah(10);
      setMaxPlayers(16);
      setMonthLabel('Зима 2026');
      setStartDate('2026-12-19');
    } else {
      setTitle('Гранд-Фінал Сезону • На підтримку ЗСУ');
      setSubtitle('Підсумковий кубок чемпіонів та лідерів рейтингу • Нагорода від воїнів ЗСУ');
      setCupType('ANNUAL');
      setGameMode('ULTIMATE_TEAM');
      setClubPool('NONE');
      setEqual95Ovr(false);
      setPrizePoolUah(0);
      setEntryFeeUah(0);
      setMaxPlayers(16);
      setMonthLabel('Фінал Сезону');
      setStartDate('2026-12-28');
    }
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAdminLoginErr(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          identifier: adminLoginId,
          password: adminLoginPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminLoginErr(data.error || 'Невірний логін або пароль судді.');
        return;
      }
      if (data.user?.role !== 'ADMIN') {
        setAdminLoginErr(
          'Цей акаунт належить гравцю. Увійдіть за обліковим записом Головного Судді.'
        );
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDatabaseAction(
    action: 'clean_demo_data' | 'restore_demo_data',
    mode?: 'keep_cups' | 'full_wipe'
  ) {
    setError(null);
    setSystemMsg(null);
    setBusy(true);
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка виконання операції з базою');
        return;
      }
      setSystemMsg(data.message || 'Операцію успішно виконано.');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function quickConfirmMatch(matchId: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm_score' }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateTournament(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) return;
    setError(null);
    setCreatedSlug(null);
    setBusy(true);
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          cupType,
          gameMode,
          clubPool: gameMode === 'KICKOFF_CLUB_DRAFT' ? clubPool : 'NONE',
          equal95Ovr: gameMode === 'KICKOFF_CLUB_DRAFT' ? equal95Ovr : false,
          prizePoolUah: Number(prizePoolUah),
          entryFeeUah: Number(entryFeeUah),
          maxPlayers,
          monthLabel,
          startDate,
          rulesNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка створення турніру');
        return;
      }
      setCreatedSlug(data.tournament.slug);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <div className="glass-panel rounded-[32px] p-7 sm:p-9 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-gold" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-gold font-extrabold">
                Захищений периметр • БУНКЕР UA
              </div>
              <h1 className="font-display text-2xl font-extrabold text-white">
                Вхід для Головного Судді
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Студія керування турнірами, жеребкуванням та VAR-арбітражем доступна
            лише авторизованому Організатору платформи.
          </p>

          {adminLoginErr && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-xs text-rose-200 font-semibold">
              {adminLoginErr}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Логін або Email Організатора
              </label>
              <input
                type="text"
                required
                value={adminLoginId}
                onChange={(e) => setAdminLoginId(e.target.value)}
                placeholder="admin@cyberliga.ua або ChiefReferee_UA"
                className="w-full px-4 py-3 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Пароль Судді
              </label>
              <input
                type="password"
                required
                value={adminLoginPass}
                onChange={(e) => setAdminLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all shadow-[0_14px_34px_rgba(255,255,255,0.16)]"
            >
              {busy ? 'Перевірка доступу...' : 'Увійти в Студію Судді →'}
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-[#10121A]/80 border border-white/10 space-y-2 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Стандартний доступ власника платформи:</span>
              <button
                type="button"
                onClick={() => {
                  setAdminLoginId('admin@cyberliga.ua');
                  setAdminLoginPass('admin123');
                }}
                className="px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white hover:text-[#09090B] text-[0.68rem] font-extrabold text-gold transition-colors"
              >
                Підставити дані
              </button>
            </div>
            <div className="font-mono text-[0.72rem] text-slate-400">
              Логін: <strong className="text-slate-200">admin@cyberliga.ua</strong> • Пароль:{' '}
              <strong className="text-slate-200">admin123</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-6">
      {/* 1. EXECUTIVE MONOBANK x DIIA HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full diia-iridescent-subtle border border-white/15 text-xs font-bold text-white">
            <UaFlag className="w-3.5 h-2.5" />
            <span>БУНКЕР • Кабінет Організатора та VAR</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-[-0.035em]">
            Студія керування турнірами та VAR
          </h1>
        </div>

        {/* Live Referee Status Capsule */}
        <div className="p-[1px] rounded-full diia-iridescent-bg self-start lg:self-auto">
          <div className="px-4 py-2 rounded-full bg-[#131620]/95 flex items-center gap-2.5 text-xs font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-pitch animate-pulse" />
            <span>Головний Суддя активний</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] font-mono text-[0.68rem] text-slate-200">
              {currentUser?.nickname}
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE BENTO KPI OVERVIEW (EA JAR + VAR QUEUE + ECOSYSTEM HEALTH) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card A: Monobank Glass Jar for EA $10,000 Annual Limit */}
        <HoloCard
          variant="diia"
          className="lg:col-span-6 diia-card-surface rounded-[30px] p-6 sm:p-7 flex flex-col justify-between gap-5"
        >
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/15 text-[0.68rem] font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-pitch" />
                Річний ліміт EA ({compliance.calendarYear} рік)
              </span>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.04em] tabular-nums">
                {compliance.totalPrizeUah.toLocaleString('uk-UA')}{' '}
                <span className="diia-gradient-text">₴</span>
              </div>
              <p className="text-xs text-slate-300">
                Використано{' '}
                <strong className="text-white tabular-nums">
                  ${compliance.totalPrizeUsd.toLocaleString('en-US')}
                </strong>{' '}
                із дозволених{' '}
                <strong className="text-white tabular-nums">
                  ${compliance.limitUsd.toLocaleString('en-US')} USD
                </strong>{' '}
                (~{compliance.limitUah.toLocaleString('uk-UA')} ₴/рік без
                комерційної ліцензії).
              </p>
            </div>

            <MonoPrizeJarSvg className="w-20 h-24 shrink-0" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="h-2 rounded-full bg-white/[0.1] overflow-hidden">
              <div
                className="h-full rounded-full diia-iridescent-bg transition-all duration-500"
                style={{ width: `${Math.max(4, compliance.usagePercent)}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-medium tabular-nums">
                Зайнято ліміту: {compliance.usagePercent}%
              </span>
              <span className="text-pitch font-bold tabular-nums">
                Вільно: {compliance.remainingUah.toLocaleString('uk-UA')} ₴ (~$
                {compliance.remainingUsd.toLocaleString('en-US')})
              </span>
            </div>
          </div>
        </HoloCard>

        {/* Card B: Live VAR Arbitration Status */}
        <div className="lg:col-span-3 glass-panel rounded-[30px] p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-[#FF5C39]/15 border border-[#FF5C39]/30 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#FF7A5C]" />
              </span>
              {disputedMatches.length > 0 ? (
                <span className="px-2.5 py-1 rounded-full bg-[#FF5C39]/20 border border-[#FF5C39]/35 text-[0.65rem] font-extrabold text-[#FF7A5C] animate-pulse">
                  ● VAR АКТИВНИЙ
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[0.65rem] font-extrabold text-pitch">
                  ● ЧИСТО
                </span>
              )}
            </div>

            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                {disputedMatches.length}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">
                Матчів у черзі арбітражу
              </div>
            </div>
          </div>

          {disputedMatches[0] ? (
            <button
              type="button"
              onClick={() => setSelectedMatch(disputedMatches[0])}
              className="w-full py-2.5 px-4 rounded-full bg-white/[0.08] hover:bg-white hover:text-[#09090B] text-white text-xs font-extrabold transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <span>Розглянути спір</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="text-xs text-pitch font-semibold">
              Усі рахунки підтверджено ✓
            </div>
          )}
        </div>

        {/* Card C: Active Season Health & Legal Checklist */}
        <div className="lg:col-span-3 glass-panel rounded-[30px] p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gold" />
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[0.65rem] font-bold text-slate-200 tabular-nums">
                {totalRegisteredAcrossCups}/{totalSlotsAcrossCups} слотів
              </span>
            </div>

            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                {tournaments.length}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">
                Активних кубки сезону
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[0.65rem] font-bold">
            <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 text-pitch border border-emerald-400/25">
              Ліміт ≤ $10k ✓
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 text-pitch border border-emerald-400/25">
              Внесок ≤ $20 ✓
            </span>
          </div>
        </div>
      </section>

      {/* 3. DUAL-COLUMN EXECUTIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN (5 cols): VAR ARBITRATION TICKETS + ACTIVE CUPS DECK */}
        <div className="lg:col-span-5 space-y-6">
          {/* VAR Arbitration Queue */}
          <section className="glass-panel rounded-[32px] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#FF7A5C]" />
                <h2 className="font-display text-lg font-extrabold text-white">
                  VAR-Арбітраж матчів
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono font-bold text-slate-300 tabular-nums">
                {disputedMatches.length}
              </span>
            </div>

            {disputedMatches.length === 0 ? (
              <div className="p-7 rounded-[24px] bg-[#10121A]/60 border border-white/[0.12] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-pitch mx-auto" />
                <div className="text-sm font-extrabold text-white">
                  Черга арбітражу порожня
                </div>
                <p className="text-xs text-slate-300">
                  Усі спірні матчі та скріншоти гравців успішно верифіковано.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {disputedMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-[26px] bg-[#10121A]/70 border border-[#FF5C39]/40 space-y-4 shadow-[0_14px_34px_rgba(255,92,57,0.1)]"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-200 truncate">
                        {m.tournamentTitle}
                      </span>
                      {m.status === 'DISPUTED' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF5C39]/20 border border-[#FF5C39]/40 text-[#FF7A5C] text-[0.65rem] font-extrabold inline-flex items-center gap-1 shrink-0">
                          <ShieldAlert className="w-3 h-3" /> СПІРНИЙ
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/35 text-gold text-[0.65rem] font-extrabold inline-flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3 h-3" /> ПЕРЕВІРКА
                        </span>
                      )}
                    </div>

                    {/* Crisp Scoreboard Capsule */}
                    <div className="flex items-center justify-between gap-2 bg-white/[0.06] px-4 py-3 rounded-[20px] border border-white/[0.12]">
                      <div className="flex items-center gap-2 min-w-0">
                        <ClubCrest club={m.player1?.club} size="sm" />
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-white truncate">
                            {m.player1?.nickname}
                          </div>
                          <div className="text-[0.64rem] text-slate-400 truncate">
                            {m.player1?.club?.name ?? m.player1?.platform}
                          </div>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-black/55 border border-white/10 font-display text-sm font-extrabold text-white tabular-nums shrink-0">
                        {m.score1 ?? '—'} : {m.score2 ?? '—'}
                      </span>

                      <div className="flex items-center gap-2 min-w-0 text-right">
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-white truncate">
                            {m.player2?.nickname}
                          </div>
                          <div className="text-[0.64rem] text-slate-400 truncate">
                            {m.player2?.club?.name ?? m.player2?.platform}
                          </div>
                        </div>
                        <ClubCrest club={m.player2?.club} size="sm" />
                      </div>
                    </div>

                    {m.disputeReason && (
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                        «{m.disputeReason}»
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-[0.7rem] text-slate-400 font-medium">
                        <FileCheck2 className="w-3.5 h-3.5 text-pitch" />
                        <span>
                          {m.proofImageUrl
                            ? 'Скріншот EA FC 27 додано'
                            : 'Без скріншоту'}
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        {isAdmin &&
                          m.score1 !== null &&
                          m.score2 !== null && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => quickConfirmMatch(m.id)}
                              className="px-3.5 py-2 rounded-full text-xs font-bold bg-emerald-400/15 hover:bg-emerald-400/25 text-pitch border border-emerald-400/30 transition-colors"
                            >
                              Підтвердити {m.score1}:{m.score2} ✓
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={() => setSelectedMatch(m)}
                          className="px-4 py-2 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all"
                        >
                          Винести вердикт →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Cups Control Deck */}
          <section className="glass-panel rounded-[32px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-gold" />
                <h2 className="font-display text-lg font-extrabold text-white">
                  Пульт активних кубків
                </h2>
              </div>
              <Link
                href="/tournaments"
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Усі кубки →
              </Link>
            </div>

            <div className="space-y-3">
              {tournaments.map((t) => {
                const count = t.participantCount ?? 0;
                const fillPct = Math.min(
                  100,
                  Math.round((count / t.maxPlayers) * 100)
                );
                const statusMeta = getUkrainianStatusMeta(t.status);
                const isAnnual = t.cupType === 'ANNUAL';

                return (
                  <Link
                    key={t.id}
                    href={`/tournaments/${t.slug}`}
                    className="block p-4 rounded-[24px] bg-[#10121A]/60 hover:bg-[#171A26]/80 border border-white/[0.12] hover:border-white/25 transition-all group space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[0.62rem] font-extrabold ${statusMeta.pillClass}`}
                          >
                            {statusMeta.label}
                          </span>
                          <span className="text-[0.68rem] font-semibold text-slate-400">
                            {t.gameMode === 'KICKOFF_CLUB_DRAFT'
                              ? 'Драфт клубів'
                              : 'Ultimate Team'}
                          </span>
                        </div>
                        <div className="font-display text-sm sm:text-base font-extrabold text-white truncate">
                          {t.title}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-display text-sm sm:text-base font-extrabold tabular-nums ${
                            isAnnual ? 'text-gold' : 'text-white'
                          }`}
                        >
                          {t.prizePoolUah > 0
                            ? `${t.prizePoolUah.toLocaleString('uk-UA')} ₴`
                            : '🎖️ Нагорода ЗСУ'}
                        </div>
                        <span className="text-[0.68rem] font-bold text-slate-400 group-hover:text-white inline-flex items-center gap-1 transition-colors">
                          <span>Пульт</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Participant Jar Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[0.68rem] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3" /> Учасники
                        </span>
                        <span className="font-mono font-bold text-slate-200 tabular-nums">
                          {count} / {t.maxPlayers}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isAnnual ? 'bg-gold' : 'diia-iridescent-bg'
                          }`}
                          style={{ width: `${Math.max(6, fillPct)}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Release Database Management Card */}
          <section className="glass-panel rounded-[32px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-sky-300" />
                <h2 className="font-display text-lg font-extrabold text-white">
                  Керування базою сезону
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[0.65rem] font-mono text-slate-300">
                Релізний старт
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Перед запуском реальної реєстрації очистіть тестових ботів та
              демо-матчі. Ваш акаунт Головного Судді залишиться активним.
            </p>

            {systemMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-400/15 border border-emerald-400/35 text-xs font-bold text-emerald-100">
                {systemMsg}
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      'Видалити всіх демо-гравців та тестові матчі, залишивши турніри чистими (0 учасників)?'
                    )
                  ) {
                    handleDatabaseAction('clean_demo_data', 'keep_cups');
                  }
                }}
                className="w-full py-3 px-4 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Очистити демо-ботів (Чистий старт кубків)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Повністю очистити базу (видалити всі демо-турніри, матчі та ботів)?'
                      )
                    ) {
                      handleDatabaseAction('clean_demo_data', 'full_wipe');
                    }
                  }}
                  className="py-2.5 px-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-[0.7rem] font-bold text-rose-200 inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Видалити і кубки</span>
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleDatabaseAction('restore_demo_data')}
                  className="py-2.5 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[0.7rem] font-bold text-slate-200 inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Повернути демо-стенд</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (7 cols): INTERACTIVE MONOBANK-STYLE TOURNAMENT CONFIGURATOR */}
        <section className="lg:col-span-7 glass-panel rounded-[32px] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pitch">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Конструктор кубка 1v1</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                Створити новий турнір
              </h2>
            </div>

            {/* 1-Click Smart Templates */}
            <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#10121A]/75 border border-white/[0.12]">
              {(
                [
                  { id: 'monthly', label: 'Благодійний ЗСУ' },
                  { id: 'upl', label: 'УПЛ 95 OVR' },
                  { id: 'annual', label: 'Гранд-Фінал' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1.5 rounded-full text-[0.7rem] font-extrabold transition-all ${
                    activePreset === p.id
                      ? 'bg-white text-[#09090B]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-[#FF5C39]/15 border border-[#FF5C39]/40 text-xs font-semibold text-rose-200">
              {error}
            </div>
          )}

          {createdSlug && (
            <div className="p-4 rounded-[22px] bg-emerald-400/15 border border-emerald-400/35 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-extrabold text-white inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pitch" />
                Турнір опубліковано у календарі сезону!
              </span>
              <Link
                href={`/tournaments/${createdSlug}`}
                className="px-4 py-2 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all"
              >
                Відкрити пульт жеребкування →
              </Link>
            </div>
          )}

          <form onSubmit={handleCreateTournament} className="space-y-5">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Назва турніру *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] text-sm font-bold text-white focus:outline-none focus:border-white/45 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Короткий опис формату
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] text-xs font-medium text-slate-100 focus:outline-none focus:border-white/45 transition-colors"
                />
              </div>
            </div>

            {/* Tactile Segmented Selectors: Cup Type + Grid Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Рівень кубка
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#10121A]/75 border border-white/[0.12]">
                  <button
                    type="button"
                    onClick={() => {
                      setCupType('MONTHLY');
                      if (prizePoolUah === 100000) setPrizePoolUah(10000);
                    }}
                    className={`py-2 px-3 rounded-full text-xs font-extrabold transition-all ${
                      cupType === 'MONTHLY'
                        ? 'bg-white text-[#09090B]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Місячний Кубок
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCupType('ANNUAL');
                      setPrizePoolUah(100000);
                    }}
                    className={`py-2 px-3 rounded-full text-xs font-extrabold transition-all ${
                      cupType === 'ANNUAL'
                        ? 'bg-gold text-[#09090B]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Гранд-Фінал
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Кількість учасників (групи → плей-офф)
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#10121A]/75 border border-white/[0.12]">
                  {(
                    [
                      { size: 8, label: '8 (A–B)' },
                      { size: 16, label: '16 (A–D)' },
                      { size: 32, label: '32 (A–H)' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      onClick={() => setMaxPlayers(opt.size)}
                      className={`py-2 px-2 rounded-full text-xs font-extrabold transition-all tabular-nums ${
                        maxPlayers === opt.size
                          ? 'bg-white text-[#09090B]'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Mode Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Ігровий режим EA SPORTS FC 27
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 rounded-[22px] sm:rounded-full bg-[#10121A]/75 border border-white/[0.12]">
                <button
                  type="button"
                  onClick={() => {
                    setGameMode('KICKOFF_CLUB_DRAFT');
                    if (clubPool === 'NONE') setClubPool('BALANCED_45');
                  }}
                  className={`py-2.5 px-4 rounded-full text-xs font-extrabold transition-all ${
                    gameMode === 'KICKOFF_CLUB_DRAFT'
                      ? 'bg-white text-[#09090B]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kick-Off • Чесний драфт клубів
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('ULTIMATE_TEAM')}
                  className={`py-2.5 px-4 rounded-full text-xs font-extrabold transition-all ${
                    gameMode === 'ULTIMATE_TEAM'
                      ? 'bg-white text-[#09090B]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ultimate Team • Власні склади FUT
                </button>
              </div>
            </div>

            {/* Club Draft Pool Bento Cards + iOS 95 OVR Toggle */}
            {gameMode === 'KICKOFF_CLUB_DRAFT' && (
              <div className="p-4 rounded-[24px] bg-[#10121A]/65 border border-white/[0.12] space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-200 mb-2">
                    Кошик клубів для автоматичного жеребкування
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setClubPool('BALANCED_45')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        clubPool === 'BALANCED_45'
                          ? 'bg-white/[0.15] border-white/45'
                          : 'bg-white/[0.04] border-white/[0.1] hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                        <UaFlag className="w-3.5 h-2.5" />
                        <span>4.5★ + УПЛ</span>
                      </div>
                      <div className="text-[0.65rem] text-slate-300 mt-0.5">
                        Шахтар, Динамо + 22 клуби
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClubPool('ELITE_5')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        clubPool === 'ELITE_5'
                          ? 'bg-white/[0.15] border-white/45'
                          : 'bg-white/[0.04] border-white/[0.1] hover:border-white/25'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white">
                        5★ Євро-Гранди
                      </div>
                      <div className="text-[0.65rem] text-slate-300 mt-0.5">
                        Реал, Сіті, Баварія, ПСЖ
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClubPool('ALL_TOP')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        clubPool === 'ALL_TOP'
                          ? 'bg-white/[0.15] border-white/45'
                          : 'bg-white/[0.04] border-white/[0.1] hover:border-white/25'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white">
                        Усі 32 клуби
                      </div>
                      <div className="text-[0.65rem] text-slate-300 mt-0.5">
                        Повний пул Європи та УПЛ
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tactile Monobank / iOS Toggle Switch for 95 OVR */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={equal95Ovr}
                  onClick={() => setEqual95Ovr((v) => !v)}
                  className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-between gap-4 text-left"
                >
                  <div>
                    <div className="text-xs font-extrabold text-white">
                      Режим рівних скілів 95 OVR
                    </div>
                    <div className="text-[0.68rem] text-slate-400">
                      Урівнює рейтинги Шахтаря, Динамо та 4.5★ клубів у лобі
                      Online Friendlies
                    </div>
                  </div>
                  <span
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
                      equal95Ovr ? 'bg-pitch justify-end' : 'bg-white/15 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[#09090B] shadow" />
                  </span>
                </button>
              </div>
            )}

            {/* Prize Pool (with Quick Chips) & Entry Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Призовий фонд (0 ₴ = Сувенір ЗСУ)
                  </label>
                  <div className="flex items-center gap-1">
                    {[0, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPrizePoolUah(amt)}
                        className={`px-2 py-0.5 rounded-full text-[0.62rem] font-mono font-bold transition-colors ${
                          Number(prizePoolUah) === amt
                            ? 'bg-white text-[#09090B]'
                            : 'bg-white/[0.06] text-slate-400 hover:text-white'
                        }`}
                      >
                        {amt === 0
                          ? '🎖️ Сувенір ЗСУ'
                          : amt >= 1000
                            ? `${amt / 1000}к`
                            : amt}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min={0}
                  max={compliance.remainingUah}
                  step={100}
                  required
                  value={prizePoolUah}
                  onChange={(e) => setPrizePoolUah(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] font-display text-base text-white font-extrabold tabular-nums focus:outline-none focus:border-white/45"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Донат на Банку ЗСУ (₴)
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEntryFeeUah(10)}
                      className={`px-2.5 py-0.5 rounded-full text-[0.62rem] font-bold ${
                        Number(entryFeeUah) === 10
                          ? 'bg-pitch/20 text-pitch'
                          : 'bg-white/[0.08] text-slate-300'
                      }`}
                    >
                      від 10 ₴ Банка ЗСУ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntryFeeUah(0)}
                      className={`px-2 py-0.5 rounded-full text-[0.62rem] font-bold ${
                        Number(entryFeeUah) === 0
                          ? 'bg-white text-[#09090B]'
                          : 'bg-white/[0.08] text-slate-300'
                      }`}
                    >
                      0 ₴
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  min={0}
                  max={EA_MAX_ENTRY_FEE_UAH}
                  step={5}
                  required
                  value={entryFeeUah}
                  onChange={(e) => setEntryFeeUah(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] font-display text-base text-white font-extrabold tabular-nums focus:outline-none focus:border-white/45"
                />
              </div>
            </div>

            {/* Season Label + Start Date + Rules Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Мітка місяця / сезону
                </label>
                <input
                  type="text"
                  required
                  value={monthLabel}
                  onChange={(e) => setMonthLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] text-xs font-semibold text-white focus:outline-none focus:border-white/45"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Дата старту кубка
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] text-xs font-mono font-semibold text-white focus:outline-none focus:border-white/45"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Короткий регламент матчу
              </label>
              <textarea
                rows={2}
                value={rulesNote}
                onChange={(e) => setRulesNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#10121A]/70 border border-white/[0.14] text-xs text-slate-100 focus:outline-none focus:border-white/45"
              />
            </div>

            {/* Live EA Annual Budget Impact Bar */}
            <div className="p-4 rounded-[22px] bg-[#10121A]/65 border border-white/[0.12] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400">
                  Прогноз річного фонду після публікації:
                </span>
                <span
                  className={`font-extrabold tabular-nums ${
                    exceedsEaCap ? 'text-[#FF7A5C]' : 'text-white'
                  }`}
                >
                  {projectedTotalUah.toLocaleString('uk-UA')} ₴ /{' '}
                  {compliance.limitUah.toLocaleString('uk-UA')} ₴ ({projectedPct}
                  %)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    exceedsEaCap ? 'bg-[#FF5C39]' : 'diia-iridescent-bg'
                  }`}
                  style={{ width: `${Math.max(4, projectedPct)}%` }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || exceedsEaCap}
              className="w-full py-4 px-6 rounded-full text-sm font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 disabled:opacity-50 transition-all shadow-[0_16px_38px_rgba(255,255,255,0.16)] inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>
                {busy ? 'Публікація кубка...' : 'Опублікувати новий турнір'}
              </span>
            </button>
          </form>
        </section>
      </div>

      {/* Match Room Modal for Admin VAR Arbitration */}
      <MatchRoomModal
        match={selectedMatch}
        currentUser={currentUser}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
