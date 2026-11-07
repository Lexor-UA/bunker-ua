'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  ImagePlus,
  Scale,
  Send,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import type { Match, User } from '@/lib/types';
import { ClubCrest } from './ClubCrest';
import { ModalDialog } from './ModalDialog';

interface MatchRoomModalProps {
  match: Match | null;
  currentUser: User | null;
  onClose: () => void;
}

async function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не вдалося прочитати зображення'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Некоректний файл зображення'));
      img.onload = () => {
        const maxWidth = 960;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function MatchRoomModal({
  match,
  currentUser,
  onClose,
}: MatchRoomModalProps) {
  const router = useRouter();
  const [score1, setScore1] = useState<string>('0');
  const [score2, setScore2] = useState<string>('0');
  const [pen1, setPen1] = useState<string>('');
  const [pen2, setPen2] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (!match) return;
    setScore1(match.score1 !== null ? String(match.score1) : '0');
    setScore2(match.score2 !== null ? String(match.score2) : '0');
    setPen1(match.penalties1 !== null ? String(match.penalties1) : '');
    setPen2(match.penalties2 !== null ? String(match.penalties2) : '');
    setProofUrl(match.proofImageUrl);
    setAdminNote(match.adminNote || '');
    setDisputeReason('');
    setShowDisputeForm(false);
    setError(null);
  }, [match]);

  if (!match) return null;

  const p1 = match.player1;
  const p2 = match.player2;
  const isAdmin = currentUser?.role === 'ADMIN';
  const isParticipant =
    Boolean(currentUser) &&
    (currentUser?.id === match.player1Id || currentUser?.id === match.player2Id);
  const canEdit = Boolean(p1 && p2) && (isAdmin || isParticipant);

  const isPlayoffDraw =
    match.stage === 'PLAYOFF' &&
    score1 !== '' &&
    score2 !== '' &&
    Number(score1) === Number(score2);

  const canOpponentConfirm =
    match.status === 'PENDING_CONFIRM' &&
    ((isParticipant && currentUser?.id !== match.submittedById) || isAdmin);

  const isP1 = Boolean(currentUser && currentUser.id === match.player1Id);
  const isP2 = Boolean(currentUser && currentUser.id === match.player2Id);
  const myCheckedInAt = isP1
    ? match.p1CheckedInAt
    : isP2
      ? match.p2CheckedInAt
      : null;
  const opponent = isP1 ? p2 : isP2 ? p1 : null;

  function formatCheckInTime(iso?: string | null): string | null {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Підтверджено';
    }
  }

  async function handleCheckIn() {
    if (!match) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_in' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка підтвердження готовності');
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleTechnicalWin(winnerSlot: 1 | 2) {
    if (!match) return;
    const winnerName = winnerSlot === 1 ? p1?.nickname : p2?.nickname;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'technical_win',
          winnerSlot,
          reason:
            adminNote.trim() ||
            `Технічна перемога (ТП 3:0) на користь ${winnerName} за неявку суперника`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка присудження ТП 3:0');
        return;
      }
      router.refresh();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      setProofUrl(dataUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Помилка завантаження скріншоту'
      );
    }
  }

  async function handleSubmitScore(e: React.FormEvent) {
    e.preventDefault();
    if (!match) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_score',
          score1: Number(score1),
          score2: Number(score2),
          penalties1: isPlayoffDraw ? Number(pen1) : null,
          penalties2: isPlayoffDraw ? Number(pen2) : null,
          proofImageUrl: proofUrl,
          adminNote: isAdmin ? adminNote : null,
          instantConfirm: isAdmin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка збереження результату');
        return;
      }
      router.refresh();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    if (!match) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm_score' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка підтвердження');
        return;
      }
      router.refresh();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function handleDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!match) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dispute',
          reason: disputeReason,
          disputeImageUrl: proofUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка подачі протесту');
        return;
      }
      router.refresh();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  const stageLabel =
    match.stage === 'GROUP'
      ? `Група ${match.groupName} • Тур ${match.roundNumber}`
      : match.playoffRound === 'FINAL'
        ? 'ГРАНД-ФІНАЛ КУБКА'
        : match.playoffRound === 'THIRD'
          ? 'Матч за 3-тє місце'
          : match.playoffRound === 'SF'
            ? `1/2 фіналу • Матч #${match.matchOrder}`
            : match.playoffRound === 'QF'
              ? `1/4 фіналу • Матч #${match.matchOrder}`
              : `1/8 фіналу • Матч #${match.matchOrder}`;

  return (
    <ModalDialog
      open={Boolean(match)}
      onClose={onClose}
      title={`VAR-Кімната матчу • ${stageLabel}`}
      subtitle="Копіюйте EA ID суперника для Online Friendlies, прикріплюйте скріншот EA FC 27 або виносьте суддівський вердикт"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Status Capsule Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.12]">
          <div className="flex items-center gap-2 text-xs font-bold">
            {match.status === 'COMPLETED' && (
              <span className="inline-flex items-center gap-1.5 text-pitch">
                <CheckCircle2 className="w-4 h-4" />
                Офіційно завершено
              </span>
            )}
            {match.status === 'PENDING_CONFIRM' && (
              <span className="inline-flex items-center gap-1.5 text-gold">
                <AlertTriangle className="w-4 h-4" />
                Очікує підтвердження суперника або судді
              </span>
            )}
            {match.status === 'DISPUTED' && (
              <span className="inline-flex items-center gap-1.5 text-[#FF7A5C]">
                <ShieldAlert className="w-4 h-4" />
                Спірний матч — розгляд Головного Судді
              </span>
            )}
            {match.status === 'SCHEDULED' && (
              <span className="text-slate-300">Очікує проведення гри 1v1</span>
            )}
          </div>
          {copiedText && (
            <span className="text-xs font-mono text-pitch">
              Скопійовано: {copiedText}
            </span>
          )}
        </div>

        {/* Scoreboard Face-off Card */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center p-5 rounded-[24px] bg-[#10121A]/70 border border-white/[0.14]">
          {/* Player 1 */}
          <div className="sm:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left gap-2.5">
            <div className="flex items-center gap-2.5">
              <ClubCrest club={p1?.club} size="lg" />
              <div>
                {p1 ? (
                  <Link
                    href={`/players/${encodeURIComponent(p1.nickname)}`}
                    onClick={onClose}
                    className="font-display font-extrabold text-sm text-white hover:text-pitch transition-colors"
                  >
                    {p1.nickname}
                  </Link>
                ) : (
                  <div className="font-display font-extrabold text-sm text-white">
                    Очікується суперник
                  </div>
                )}
                <div className="text-xs text-slate-400">
                  {p1?.club
                    ? `${p1.club.name} (${p1.club.stars}★)`
                    : 'Ultimate Team'}
                </div>
              </div>
            </div>
            {p1 && (
              <div className="flex flex-wrap gap-1.5 text-[0.68rem] font-mono">
                <button
                  type="button"
                  onClick={() => handleCopy(p1.eaId)}
                  className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 inline-flex items-center gap-1 transition-colors"
                  title="Скопіювати EA ID"
                >
                  <span>EA: {p1.eaId}</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
                <a
                  href={`https://t.me/${p1.telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-sky-400/15 text-slate-300 hover:text-sky-300 border border-white/[0.07] inline-flex items-center gap-1 transition-colors"
                >
                  <span>
                    {p1.platform} • {p1.telegram}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>

          {/* Center Score Display */}
          <div className="sm:col-span-3 flex flex-col items-center justify-center py-2">
            <div className="px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {match.score1 !== null ? match.score1 : '—'}{' '}
              <span className="text-slate-400">:</span>{' '}
              {match.score2 !== null ? match.score2 : '—'}
            </div>
            {match.penalties1 !== null && match.penalties2 !== null && (
              <span className="mt-1.5 px-2.5 py-0.5 rounded-full text-[0.68rem] font-mono bg-amber-400/15 text-gold border border-amber-400/30">
                пен. {match.penalties1} : {match.penalties2}
              </span>
            )}
          </div>

          {/* Player 2 */}
          <div className="sm:col-span-4 flex flex-col items-center sm:items-end text-center sm:text-right gap-2.5">
            <div className="flex items-center gap-2.5 sm:flex-row-reverse">
              <ClubCrest club={p2?.club} size="lg" />
              <div>
                {p2 ? (
                  <Link
                    href={`/players/${encodeURIComponent(p2.nickname)}`}
                    onClick={onClose}
                    className="font-display font-extrabold text-sm text-white hover:text-pitch transition-colors"
                  >
                    {p2.nickname}
                  </Link>
                ) : (
                  <div className="font-display font-extrabold text-sm text-white">
                    Очікується суперник
                  </div>
                )}
                <div className="text-xs text-slate-400">
                  {p2?.club
                    ? `${p2.club.name} (${p2.club.stars}★)`
                    : 'Ultimate Team'}
                </div>
              </div>
            </div>
            {p2 && (
              <div className="flex flex-wrap justify-end gap-1.5 text-[0.68rem] font-mono">
                <button
                  type="button"
                  onClick={() => handleCopy(p2.eaId)}
                  className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 inline-flex items-center gap-1 transition-colors"
                  title="Скопіювати EA ID"
                >
                  <span>EA: {p2.eaId}</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
                <a
                  href={`https://t.me/${p2.telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-sky-400/15 text-slate-300 hover:text-sky-300 border border-white/[0.07] inline-flex items-center gap-1 transition-colors"
                >
                  <span>
                    {p2.platform} • {p2.telegram}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Check-in Readiness & Direct Telegram Coordination Panel */}
        {p1 && p2 && (
          <div className="p-4 rounded-[22px] bg-[#10121A]/75 border border-white/15 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-pitch" />
                <span>Готовність до матчу (Check-in) та зв&apos;язок у Telegram</span>
              </span>
              <span className="text-[0.68rem] font-mono text-slate-400">
                Регламент очікування суперника: 15 хв
              </span>
            </div>

            {/* Two-player Check-in Status Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div
                className={`px-3.5 py-2.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  match.p1CheckedInAt
                    ? 'bg-emerald-400/12 border-emerald-400/35 text-emerald-100'
                    : 'bg-white/[0.04] border-white/10 text-slate-300'
                }`}
              >
                <span className="font-bold truncate">{p1.nickname}</span>
                {match.p1CheckedInAt ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-pitch font-mono text-[0.65rem] font-extrabold shrink-0">
                    ✓ Готовий ({formatCheckInTime(match.p1CheckedInAt)})
                  </span>
                ) : (
                  <span className="text-[0.68rem] text-slate-400 shrink-0">
                    ⏳ Очікується чек-ін
                  </span>
                )}
              </div>

              <div
                className={`px-3.5 py-2.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  match.p2CheckedInAt
                    ? 'bg-emerald-400/12 border-emerald-400/35 text-emerald-100'
                    : 'bg-white/[0.04] border-white/10 text-slate-300'
                }`}
              >
                <span className="font-bold truncate">{p2.nickname}</span>
                {match.p2CheckedInAt ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-pitch font-mono text-[0.65rem] font-extrabold shrink-0">
                    ✓ Готовий ({formatCheckInTime(match.p2CheckedInAt)})
                  </span>
                ) : (
                  <span className="text-[0.68rem] text-slate-400 shrink-0">
                    ⏳ Очікується чек-ін
                  </span>
                )}
              </div>
            </div>

            {/* Participant Check-in Button + Direct Telegram Chat Links */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {isParticipant && match.status !== 'COMPLETED' && !myCheckedInAt && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleCheckIn}
                  className="px-4 py-2 rounded-full bg-pitch text-[#09090B] hover:brightness-110 text-xs font-extrabold inline-flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Підтвердити готовність: Я на місці</span>
                </button>
              )}

              {opponent ? (
                <a
                  href={`https://t.me/${opponent.telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-sky-400/15 hover:bg-sky-400/25 border border-sky-400/35 text-xs font-extrabold text-sky-300 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    Написати супернику в Telegram ({opponent.telegram}) ↗
                  </span>
                </a>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://t.me/${p1.telegram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-sky-400/15 hover:bg-sky-400/25 border border-sky-400/30 text-[0.7rem] font-bold text-sky-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Telegram {p1.nickname}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://t.me/${p2.telegram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-sky-400/15 hover:bg-sky-400/25 border border-sky-400/30 text-[0.7rem] font-bold text-sky-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Telegram {p2.nickname}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `⚽ БУНКЕР UA • ${stageLabel}: ${p1.nickname} (${p1.club?.name ?? 'UT'}, EA ID: ${p1.eaId}) vs ${p2.nickname} (${p2.club?.name ?? 'UT'}, EA ID: ${p2.eaId}). Готовий зіграти в Online Friendlies!`
                  )
                }
                className="px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white hover:text-[#09090B] text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors ml-auto"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Скопіювати текст виклику</span>
              </button>
            </div>
          </div>
        )}

        {/* Dispute Reason Alert */}
        {match.disputeReason && (
          <div className="p-4 rounded-[20px] bg-[#FF5C39]/10 border border-[#FF5C39]/30 space-y-1.5">
            <div className="text-xs font-extrabold text-[#FF7A5C] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Звернення гравця до VAR-арбітражу:</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              «{match.disputeReason}»
            </p>
          </div>
        )}

        {/* Admin Note if present */}
        {match.adminNote && (
          <div className="p-3.5 rounded-[20px] bg-amber-400/10 border border-amber-400/30 text-xs text-amber-100">
            <strong>Вердикт судді:</strong> {match.adminNote}
          </div>
        )}

        {/* Attached Proof Screenshot */}
        {proofUrl && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              Скріншот підсумкового екрана EA SPORTS FC 27:
            </div>
            <div className="rounded-[20px] overflow-hidden border border-white/15 bg-[#09090C]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofUrl}
                alt="Скріншот результату матчу"
                className="w-full max-h-60 object-contain"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200">
            {error}
          </div>
        )}

        {/* Quick Confirm Button for Opponent or Referee */}
        {(canOpponentConfirm || (isAdmin && match.status === 'DISPUTED')) && (
          <div className="p-4 rounded-[22px] bg-emerald-400/10 border border-emerald-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-100">
              Затвердити рахунок{' '}
              <strong className="font-mono text-sm text-white tabular-nums">
                {match.score1} : {match.score2}
              </strong>{' '}
              як офіційний підсумок матчу?
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 shrink-0 transition-all"
            >
              Підтвердити {match.score1}:{match.score2} ✓
            </button>
          </div>
        )}

        {/* Score Submission / Referee Edit Form */}
        {canEdit && (match.status !== 'COMPLETED' || isAdmin) ? (
          <form
            onSubmit={handleSubmitScore}
            className="space-y-4 pt-3 border-t border-white/[0.08]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                {isAdmin ? (
                  <>
                    <Scale className="w-4 h-4 text-gold" />
                    <span>Вердикт Головного Судді (миттєва фіксація)</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-pitch" />
                    <span>Внесення результату матчу</span>
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Голи {p1?.nickname}
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  required
                  value={score1}
                  onChange={(e) => setScore1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#09090C] border border-white/15 font-mono text-lg font-extrabold text-center text-white focus:outline-none focus:border-white/50 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Голи {p2?.nickname}
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  required
                  value={score2}
                  onChange={(e) => setScore2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#09090C] border border-white/15 font-mono text-lg font-extrabold text-center text-white focus:outline-none focus:border-white/50 tabular-nums"
                />
              </div>
            </div>

            {isPlayoffDraw && (
              <div className="p-4 rounded-[20px] bg-amber-400/10 border border-amber-400/30 space-y-2.5">
                <div className="text-xs font-semibold text-gold">
                  Нічия у Плей-офф — вкажіть рахунок серії пенальті:
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    min={0}
                    max={25}
                    required
                    placeholder={`Пенальті ${p1?.nickname}`}
                    value={pen1}
                    onChange={(e) => setPen1(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#09090C] border border-amber-400/40 font-mono text-sm text-center text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    max={25}
                    required
                    placeholder={`Пенальті ${p2?.nickname}`}
                    value={pen2}
                    onChange={(e) => setPen2(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#09090C] border border-amber-400/40 font-mono text-sm text-center text-white"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.11] border border-dashed border-white/20 text-xs font-bold text-slate-200 cursor-pointer transition-colors">
                <ImagePlus className="w-4 h-4 text-pitch" />
                <span>
                  {proofUrl
                    ? 'Замінити скріншот матчу'
                    : 'Додати скріншот рахунку'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {isAdmin && (
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Коментар арбітра (необов'язково)"
                  className="px-4 py-2.5 rounded-full bg-[#09090C] border border-white/15 text-xs text-white focus:outline-none focus:border-white/40"
                />
              )}
            </div>

            {isAdmin && p1 && p2 && (
              <div className="p-3.5 rounded-[20px] bg-amber-400/10 border border-amber-400/30 space-y-2.5">
                <div className="text-xs font-extrabold text-gold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    Швидке рішення Судді: Технічна перемога (ТП 3:0 за неявку)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleTechnicalWin(1)}
                    className="py-2 px-3 rounded-full bg-white/[0.08] hover:bg-amber-400 hover:text-[#09090B] border border-amber-400/35 text-xs font-extrabold text-white transition-all truncate"
                  >
                    ⚡ ТП 3:0 → {p1.nickname}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleTechnicalWin(2)}
                    className="py-2 px-3 rounded-full bg-white/[0.08] hover:bg-amber-400 hover:text-[#09090B] border border-amber-400/35 text-xs font-extrabold text-white transition-all truncate"
                  >
                    ⚡ ТП 3:0 → {p2.nickname}
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 py-3.5 px-6 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all shadow-[0_12px_28px_rgba(255,255,255,0.14)]"
              >
                {busy
                  ? 'Збереження...'
                  : isAdmin
                    ? 'Затвердити офіційний рахунок'
                    : 'Надіслати рахунок та скріншот'}
              </button>

              {!isAdmin && match.status !== 'DISPUTED' && (
                <button
                  type="button"
                  onClick={() => setShowDisputeForm((v) => !v)}
                  className="px-5 py-3.5 rounded-full text-xs font-bold bg-[#FF5C39]/15 hover:bg-[#FF5C39]/25 text-[#FF7A5C] border border-[#FF5C39]/35 transition-colors"
                >
                  Викликати VAR-Суддю
                </button>
              )}
            </div>
          </form>
        ) : (
          !isAdmin &&
          !isParticipant && (
            <div className="p-4 rounded-[22px] bg-[#14141B] border border-white/[0.09] text-xs text-slate-300 text-center">
              Вносити рахунок, підтверджувати готовність (Check-in) або подавати
              апеляцію можуть лише учасники цього матчу та Головний Суддя.
            </div>
          )
        )}

        {/* Dispute Submission Box */}
        {showDisputeForm && (
          <form
            onSubmit={handleDispute}
            className="p-4 rounded-[22px] bg-[#FF5C39]/10 border border-[#FF5C39]/35 space-y-3"
          >
            <div className="text-xs font-extrabold text-[#FF7A5C]">
              Подача протесту Головному Судді БУНКЕР UA
            </div>
            <textarea
              required
              rows={2}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Опишіть ситуацію (невірний рахунок, дисконнект, порушення правил складу)..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#09090C] border border-[#FF5C39]/40 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#FF5C39] text-white hover:brightness-110 transition-all"
            >
              Відправити матч в Арбітраж
            </button>
          </form>
        )}
      </div>
    </ModalDialog>
  );
}
