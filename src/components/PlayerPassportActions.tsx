'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Check,
  Copy,
  ExternalLink,
  Gamepad2,
  Send,
  Settings,
} from 'lucide-react';
import {
  UKRAINIAN_CITIES,
  ZSU_CHARITY_FUND_NAME,
  ZSU_MONOBANK_JAR_URL,
} from '@/lib/constants';
import type { PlatformType, User } from '@/lib/types';
import { ModalDialog } from './ModalDialog';

interface PlayerPassportActionsProps {
  eaId: string;
  telegram: string;
  nickname: string;
  platform: string;
  player?: User;
  currentUser?: User | null;
}

const AVATAR_COLORS = [
  '#00F59B',
  '#38BDF8',
  '#F5C451',
  '#A78BFA',
  '#FB7185',
  '#34D399',
];

async function compressAvatarFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не вдалося прочитати фото'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Некоректний файл зображення'));
      img.onload = () => {
        const maxSide = 420;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function PlayerPassportActions({
  eaId,
  telegram,
  nickname,
  platform,
  player,
  currentUser = null,
}: PlayerPassportActionsProps) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<'ea' | 'invite' | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const canEditProfile = Boolean(
    player &&
      currentUser &&
      (currentUser.id === player.id || currentUser.role === 'ADMIN')
  );

  const [fullName, setFullName] = useState(player?.fullName ?? '');
  const [city, setCity] = useState(player?.city ?? 'Київ');
  const [editPlatform, setEditPlatform] = useState<PlatformType>(
    player?.platform ?? 'PS5'
  );
  const [editEaId, setEditEaId] = useState(player?.eaId ?? eaId);
  const [editTelegram, setEditTelegram] = useState(
    player?.telegram ?? telegram
  );
  const [payoutCard, setPayoutCard] = useState(player?.payoutCard ?? '');
  const [avatarColor, setAvatarColor] = useState(
    player?.avatarColor ?? '#00F59B'
  );
  const [avatarUrl, setAvatarUrl] = useState(player?.avatarUrl ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const cleanTelegramHandle = telegram.replace(/^@/, '').trim();
  const telegramUrl = `https://t.me/${cleanTelegramHandle}`;

  async function copyText(text: string, type: 'ea' | 'invite') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(type);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  }

  function openSettingsModal() {
    if (!player) return;
    setFullName(player.fullName);
    setCity(player.city);
    setEditPlatform(player.platform);
    setEditEaId(player.eaId);
    setEditTelegram(player.telegram);
    setPayoutCard(player.payoutCard || '');
    setAvatarColor(player.avatarColor);
    setAvatarUrl(player.avatarUrl || '');
    setError(null);
    setSavedOk(false);
    setEditOpen(true);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAvatarFileToDataUrl(file);
      setAvatarUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження фото');
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!player) return;
    setError(null);
    setSavedOk(false);
    setBusy(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          targetUserId: player.id,
          fullName,
          city,
          platform: editPlatform,
          eaId: editEaId,
          telegram: editTelegram,
          payoutCard,
          avatarColor,
          avatarUrl,
          newPassword: newPassword.trim() ? newPassword.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка збереження профілю');
        return;
      }
      setSavedOk(true);
      setNewPassword('');
      router.refresh();
      setTimeout(() => {
        setEditOpen(false);
        setSavedOk(false);
      }, 500);
    } finally {
      setBusy(false);
    }
  }

  const quickInviteMessage = `Привіт, ${nickname}! Готовий зіграти матч 1v1 у БУНКЕР (EA SPORTS FC)? Мій EA ID додавай у Cross-Play Friendlies.`;

  return (
    <div className="space-y-2.5">
      {/* Row 1: Two-Column EA ID + Telegram Direct Contact Pods */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => copyText(eaId, 'ea')}
          className="px-3.5 py-3 rounded-2xl bg-[#0D1017]/85 hover:bg-white/[0.08] border border-white/15 flex items-center justify-between gap-2 text-left transition-colors group"
        >
          <div className="min-w-0">
            <div className="text-[0.62rem] font-mono uppercase tracking-wider text-slate-400">
              EA ID • {platform}
            </div>
            <div className="text-xs sm:text-sm font-mono font-extrabold text-white truncate mt-0.5">
              {eaId}
            </div>
          </div>
          <span className="w-7 h-7 rounded-xl bg-white/[0.07] group-hover:bg-white group-hover:text-[#09090B] text-slate-200 flex items-center justify-center shrink-0 transition-colors">
            {copiedField === 'ea' ? (
              <Check className="w-3.5 h-3.5 text-pitch group-hover:text-[#09090B]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-3 rounded-2xl bg-[#0D1017]/85 hover:bg-sky-400/15 border border-white/15 hover:border-sky-400/35 flex items-center justify-between gap-2 text-left transition-colors group"
        >
          <div className="min-w-0">
            <div className="text-[0.62rem] font-mono uppercase tracking-wider text-slate-400">
              Telegram 1v1
            </div>
            <div className="text-xs sm:text-sm font-mono font-extrabold text-sky-300 truncate mt-0.5">
              {telegram}
            </div>
          </div>
          <span className="w-7 h-7 rounded-xl bg-sky-400/15 text-sky-300 flex items-center justify-center shrink-0">
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      </div>

      {/* Row 2: Owner Quick Settings Bar + ZSU Jar OR Visitor Challenge Copy */}
      {canEditProfile && player ? (
        <div className="p-2.5 rounded-2xl bg-[#0D1017]/85 border border-white/15 flex items-center justify-between gap-2">
          <a
            href={ZSU_MONOBANK_JAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 pl-1.5 group"
          >
            <div className="text-[0.6rem] font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <span>🫙 Спільна Банка ЗСУ</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-pitch truncate mt-0.5 transition-colors">
              Фонд {ZSU_CHARITY_FUND_NAME} 🇺🇦
            </div>
          </a>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={openSettingsModal}
              className="px-3.5 py-2 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Налаштувати профіль</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => copyText(quickInviteMessage, 'invite')}
          className="w-full py-2.5 px-4 rounded-full bg-white/[0.07] hover:bg-white hover:text-[#09090B] border border-white/15 text-xs font-extrabold text-white inline-flex items-center justify-center gap-2 transition-colors"
        >
          {copiedField === 'invite' ? (
            <>
              <Check className="w-3.5 h-3.5 text-pitch" />
              <span>Текст виклику 1v1 скопійовано!</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-sky-300" />
              <span>Скопіювати виклик на матч у Telegram</span>
            </>
          )}
        </button>
      )}

      {copiedField === 'ea' && (
        <div className="text-center text-[0.68rem] font-mono text-pitch flex items-center justify-center gap-1">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>EA ID «{eaId}» скопійовано для EA Social!</span>
        </div>
      )}

      {/* Profile & Avatar Settings Modal */}
      {canEditProfile && player && (
        <ModalDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title={`Налаштування паспорта • ${player.nickname}`}
          subtitle="Фото профілю, ігровий EA ID, платформа та Telegram для домовленості про матчі"
          maxWidthClass="max-w-lg"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-xs text-rose-200">
                {error}
              </div>
            )}
            {savedOk && (
              <div className="p-3.5 rounded-2xl bg-emerald-400/15 border border-emerald-400/35 text-xs text-pitch font-bold">
                Зміни успішно збережено!
              </div>
            )}

            {/* Photo / Monogram Selector */}
            <div className="p-4 rounded-2xl bg-[#10121A] border border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {avatarUrl && avatarUrl !== 'monogram' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={player.nickname}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/20"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-base text-[#09090B]"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {player.nickname.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs font-extrabold text-white">
                    Аватар картки гравця
                  </div>
                  <div className="text-[0.68rem] text-slate-400">
                    {avatarUrl && avatarUrl !== 'monogram'
                      ? 'Встановлено ваше власне фото'
                      : 'Клубна монограма за замовчуванням'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {avatarUrl && avatarUrl !== 'monogram' && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[0.7rem] font-bold text-slate-200 transition-colors"
                  >
                    Скинути на монограму
                  </button>
                )}
                <label className="px-3.5 py-1.5 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 text-[0.7rem] font-extrabold cursor-pointer inline-flex items-center gap-1.5 transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Завантажити своє фото</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Ім&apos;я та Прізвище
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Місто України
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                >
                  {UKRAINIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  EA ID / PSN ID *
                </label>
                <input
                  type="text"
                  required
                  value={editEaId}
                  onChange={(e) => setEditEaId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-white/45"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Ігрова платформа
                </label>
                <select
                  value={editPlatform}
                  onChange={(e) =>
                    setEditPlatform(e.target.value as PlatformType)
                  }
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                >
                  <option value="PS5">PlayStation 5</option>
                  <option value="PC">PC (EA App / Steam)</option>
                  <option value="XBOX">Xbox Series X|S</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Telegram (для домовленості про матчі) *
                </label>
                <input
                  type="text"
                  required
                  value={editTelegram}
                  onChange={(e) => setEditTelegram(e.target.value)}
                  placeholder="@nickname"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-sm font-mono text-sky-300 focus:outline-none focus:border-white/45"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Новий пароль (необов&apos;язково)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Залиште порожнім, щоб не змінювати"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#10121A] border border-white/15 text-xs text-white focus:outline-none focus:border-white/45"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Колір акцентного жетона монограми
              </label>
              <div className="flex items-center gap-2">
                {AVATAR_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setAvatarColor(col)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      avatarColor === col
                        ? 'border-white scale-110'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all"
            >
              {busy ? 'Збереження...' : 'Зберегти зміни паспорта'}
            </button>
          </form>
        </ModalDialog>
      )}
    </div>
  );
}
