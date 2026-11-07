'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ExternalLink,
  LogOut,
  Menu,
  Swords,
  UserPlus,
  X,
} from 'lucide-react';
import type { Match, PlatformType, User } from '@/lib/types';
import { UKRAINIAN_CITIES, ZSU_MONOBANK_JAR_URL } from '@/lib/constants';
import { BrandLogo } from './BrandLogo';
import { ModalDialog } from './ModalDialog';

interface NavbarProps {
  currentUser: User | null;
  disputedCount: number;
  activeMatch?: (Match & { tournamentSlug: string; tournamentTitle: string }) | null;
}

export function Navbar({
  currentUser,
  disputedCount,
  activeMatch = null,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [nickname, setNickname] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [city, setCity] = useState('Київ');
  const [platform, setPlatform] = useState<PlatformType>('PS5');
  const [eaId, setEaId] = useState('');
  const [telegram, setTelegram] = useState('');

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка входу');
        return;
      }
      setAuthOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          nickname,
          fullName,
          email,
          password: regPassword,
          city,
          platform,
          eaId,
          telegram,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка реєстрації');
        return;
      }
      setAuthOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const isAdmin = currentUser?.role === 'ADMIN';
  const myOpponent =
    activeMatch && currentUser
      ? activeMatch.player1Id === currentUser.id
        ? activeMatch.player2
        : activeMatch.player1
      : null;

  const navLinks: Array<{ href: string; label: string; badge?: number }> = [
    { href: '/', label: 'Головна' },
    { href: '/tournaments', label: 'Турніри' },
    { href: '/leaderboard', label: 'Рейтинг' },
    { href: '/rules', label: 'Правила' },
    ...(isAdmin
      ? [
          {
            href: '/admin',
            label: 'Адмін',
            badge: disputedCount > 0 ? disputedCount : undefined,
          },
        ]
      : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.09] bg-[#12151E]/75 backdrop-blur-2xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-[4.5rem] flex items-center justify-between gap-4">
          {/* Minimalist Diia/Monobank Brand Mark */}
          <Link href="/" className="group shrink-0">
            <BrandLogo size="md" />
          </Link>

          {/* Floating Monobank/iOS Segmented Capsule Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-white/[0.06] p-1 rounded-full border border-white/[0.12] backdrop-blur-xl">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-[#09090B] shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 leading-none rounded-full text-[0.6rem] font-mono font-extrabold bg-[#FF5C39] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Tactile Pill Controls */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <a
              href={ZSU_MONOBANK_JAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/30 text-xs font-extrabold text-pitch inline-flex items-center gap-1.5 whitespace-nowrap transition-all"
            >
              <span>🫙 Банка ЗСУ</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {activeMatch && myOpponent && (
                  <Link
                    href={`/tournaments/${activeMatch.tournamentSlug}?match=${activeMatch.id}`}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-400/15 hover:bg-emerald-400/25 border border-emerald-400/35 text-xs font-extrabold text-pitch inline-flex items-center gap-1.5 whitespace-nowrap transition-all"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Мій матч vs {myOpponent.nickname} →</span>
                  </Link>
                )}

                <Link
                  href={`/players/${encodeURIComponent(currentUser.nickname)}`}
                  title="Відкрити мій БУНКЕР ID Паспорт гравця"
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/25 whitespace-nowrap transition-all"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: currentUser.avatarColor }}
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">
                      {currentUser.nickname}
                    </span>
                    {currentUser.role === 'ADMIN' ? (
                      <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-amber-400/20 text-gold">
                        Суддя
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-mono font-bold bg-white/[0.1] text-slate-100 tabular-nums">
                        {currentUser.seasonPoints} pts
                      </span>
                    )}
                  </div>
                </Link>

                <button
                  type="button"
                  disabled={busy}
                  onClick={handleLogout}
                  aria-label="Вийти з акаунта"
                  className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/[0.12] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setError(null);
                    setAuthOpen(true);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/15 transition-all"
                >
                  Реєстрація
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setError(null);
                    setAuthOpen(true);
                  }}
                  className="px-5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap bg-white text-[#09090B] hover:bg-neutral-100 transition-all shadow-sm"
                >
                  Увійти
                </button>
              </div>
            )}
          </div>

          {/* Mobile Burger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню навігації"
            className="xl:hidden p-2.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-slate-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#141722]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-100 hover:bg-white/[0.08] flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#FF5C39] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-white/[0.08] flex flex-wrap gap-2">
              {activeMatch && myOpponent && (
                <Link
                  href={`/tournaments/${activeMatch.tournamentSlug}?match=${activeMatch.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="w-full px-4 py-2.5 rounded-full text-xs font-extrabold bg-emerald-400/20 text-pitch border border-emerald-400/35 text-center"
                >
                  ⚔️ Мій матч vs {myOpponent.nickname} →
                </Link>
              )}
              {!currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthOpen(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-full text-xs font-extrabold bg-white text-[#09090B]"
                >
                  Увійти або Створити Профіль
                </button>
              ) : (
                <div className="w-full grid grid-cols-2 gap-2">
                  <Link
                    href={`/players/${encodeURIComponent(currentUser.nickname)}`}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] text-center"
                  >
                    Мій Профіль
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white/[0.08] text-slate-200 border border-white/15"
                  >
                    Вийти ({currentUser.nickname})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Clean Auth Modal Dialog */}
      <ModalDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title={authTab === 'login' ? 'Вхід у профіль' : 'Картка нового гравця'}
        subtitle="Єдиний БУНКЕР ID для участі у Благодійних Турнірах 1v1 на підтримку ЗСУ 🇺🇦"
        maxWidthClass="max-w-lg"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 p-1 rounded-full bg-[#10121A]/80 border border-white/[0.12]">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setError(null);
              }}
              className={`py-2 rounded-full text-xs font-bold transition-colors ${
                authTab === 'login'
                  ? 'bg-white text-[#09090B]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Вхід
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('register');
                setError(null);
              }}
              className={`py-2 rounded-full text-xs font-bold transition-colors ${
                authTab === 'register'
                  ? 'bg-white text-[#09090B]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Реєстрація
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-xs text-rose-200">
              {error}
            </div>
          )}

          {authTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Email або Нікнейм
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="kozak@cyberliga.ua або Kozak_FC27"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Пароль
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-full font-extrabold text-sm bg-white text-[#09090B] hover:bg-neutral-100 transition-all"
              >
                {busy ? 'Вхід...' : 'Увійти'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Ігровий нікнейм *
                  </label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Kyiv_Legend"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Ім&apos;я та Прізвище
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Іван Петренко"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    EA ID / PSN ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={eaId}
                    onChange={(e) => setEaId(e.target.value)}
                    placeholder="Kyiv_Legend_UA"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Платформа
                  </label>
                  <select
                    value={platform}
                    onChange={(e) =>
                      setPlatform(e.target.value as PlatformType)
                    }
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  >
                    <option value="PS5">PlayStation 5</option>
                    <option value="PC">PC (EA App / Steam)</option>
                    <option value="XBOX">Xbox Series X|S</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Місто
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A] border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  >
                    {UKRAINIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@kyiv_legend"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@ukr.net"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Пароль *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={5}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Мінімум 5 символів"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#10121A]/80 border border-white/15 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-full font-extrabold text-sm bg-white text-[#09090B] hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {busy ? 'Створення...' : 'Створити картку гравця'}
                </span>
              </button>
            </form>
          )}
        </div>
      </ModalDialog>
    </>
  );
}
