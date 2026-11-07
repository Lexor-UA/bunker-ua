import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Crown,
  Flame,
  QrCode,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import {
  getPlayerProfileByNicknameOrId,
  listTournaments,
} from '@/lib/tournament-engine';
import { ClubCrest, getSmartInitials } from '@/components/ClubCrest';
import { NfcIcon, TacticalPitchArt } from '@/components/FintechArt';
import { HoloCard } from '@/components/HoloCard';
import { PlayerPassportActions } from '@/components/PlayerPassportActions';
import { MonoCardChip, UaFlag } from '@/components/UaFlag';

export const dynamic = 'force-dynamic';

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;
  const profile = getPlayerProfileByNicknameOrId(nickname);
  const currentUser = await getCurrentUser();

  if (!profile) {
    notFound();
  }

  const {
    user: player,
    nationalRank,
    totalRankedPlayers,
    participations,
    matches,
  } = profile;

  const openTournaments =
    participations.length === 0
      ? listTournaments()
          .filter((t) => t.status === 'REGISTRATION')
          .slice(0, 2)
      : [];

  const totalMatches = Math.max(1, player.wins + player.draws + player.losses);
  const actualPlayed = player.wins + player.draws + player.losses;
  const winRate =
    actualPlayed > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
  const gpg =
    actualPlayed > 0 ? (player.goalsFor / totalMatches).toFixed(1) : '0.0';
  const gd = player.goalsFor - player.goalsAgainst;
  const proOvr = Math.min(
    96,
    Math.max(85, 84 + Math.round(player.seasonPoints / 45))
  );

  // Dynamic EA FC 27 1v1 Attribute Ratings
  const attStat = Math.min(97, proOvr + 1 + (player.goalsFor > 20 ? 2 : 0));
  const ctlStat = Math.min(96, proOvr + (player.wins > 5 ? 1 : 0));
  const defStat = Math.min(95, Math.max(83, proOvr - 1 + (gd > 5 ? 2 : 0)));

  const inTop32 = nationalRank <= 32;

  // Відображаємо фото лише якщо гравець сам завантажив власний аватар; за замовчуванням — чиста клубна монограма без чужих фото
  const resolvedPortraitSrc =
    player.avatarUrl &&
    player.avatarUrl.trim() !== '' &&
    player.avatarUrl.trim() !== 'monogram'
      ? player.avatarUrl
      : null;

  const cardVariant =
    nationalRank === 1 ? 'gold' : nationalRank <= 3 ? 'diia' : 'mint';

  const cardSurfaceClass =
    nationalRank === 1
      ? 'mono-iron-surface'
      : nationalRank <= 3
        ? 'diia-card-surface'
        : 'glass-panel-emerald';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-8 pb-10">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <Link
            href="/leaderboard"
            className="px-3.5 py-2 rounded-full glass-panel hover:bg-white/[0.08] text-white font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Рейтинг України</span>
          </Link>
          <span className="text-slate-500">/</span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 font-semibold text-slate-200">
            БУНКЕР ID • Паспорт гравця #{nationalRank} в Україні
          </span>
        </div>

        <Link
          href="/tournaments"
          className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors"
        >
          <span>Турніри сезону</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: DIIA.ID × MONOBANK × EA FC 27 PRO PLAYER PASS */}
        <div className="lg:col-span-4 space-y-6">
          <HoloCard
            variant={cardVariant}
            className={`rounded-[32px] ${cardSurfaceClass} p-6 sm:p-7 flex flex-col justify-between gap-5 relative overflow-hidden`}
          >
            {/* Subtle Vector Tactical Pitch & Ambient Glow Backdrop */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-30">
                <TacticalPitchArt
                  accent={nationalRank === 1 ? 'gold' : 'emerald'}
                />
              </div>
              <div
                className="absolute -top-16 -right-12 w-48 h-48 rounded-full opacity-25 blur-3xl"
                style={{ backgroundColor: player.avatarColor }}
              />
            </div>

            {/* 1. Document Chip & OVR Rating Header */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MonoCardChip tone={nationalRank === 1 ? 'gold' : 'silver'} />
                <span
                  className={`px-3 py-1 rounded-full text-[0.68rem] font-extrabold tracking-tight shadow-sm ${
                    nationalRank === 1
                      ? 'bg-gold text-[#09090B]'
                      : nationalRank <= 3
                        ? 'diia-iridescent-bg text-[#09090B]'
                        : 'bg-white text-[#09090B]'
                  }`}
                >
                  #{nationalRank} із {totalRankedPlayers} в Україні
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#0B0E16]/85 border border-emerald-400/35 text-xs font-extrabold text-pitch tabular-nums shadow-sm">
                {actualPlayed > 0 ? `${proOvr} OVR` : 'PRO ID'}
              </span>
            </div>

            {/* 2. Pro Athlete Identity & Status */}
            <div className="relative z-10 flex items-stretch gap-4">
              {resolvedPortraitSrc ? (
                <div className="relative w-28 sm:w-32 rounded-[22px] overflow-hidden bg-[#0A0C12] border border-white/25 shrink-0 shadow-[0_16px_36px_rgba(0,0,0,0.65)] flex flex-col justify-end min-h-[8.75rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolvedPortraitSrc}
                    alt={player.nickname}
                    width={400}
                    height={500}
                    className="absolute inset-0 w-full h-full object-cover object-[50%_15%]"
                  />
                  <div className="relative z-10 inset-x-0 pt-8 pb-2 px-2.5 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#09090B] text-[0.6rem] font-extrabold tabular-nums">
                      {actualPlayed > 0 ? `${proOvr} OVR` : 'PRO'}
                    </span>
                    <span className="text-[0.6rem] font-extrabold text-slate-200">
                      {player.platform}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-28 sm:w-32 rounded-[22px] overflow-hidden border border-white/25 shrink-0 shadow-2xl flex flex-col items-center justify-center min-h-[8.75rem]"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, ${player.avatarColor}44, #0B0E17 82%)`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-2xl text-[#09090B] shadow-lg"
                    style={{ backgroundColor: player.avatarColor }}
                  >
                    {getSmartInitials(player.nickname)}
                  </div>
                  <span className="mt-2.5 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-slate-200 text-[0.62rem] font-extrabold tabular-nums">
                    {actualPlayed > 0 ? `${proOvr} OVR` : player.platform}
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5 space-y-2.5">
                <div>
                  <div className="inline-flex items-center gap-1 text-[0.64rem] font-bold uppercase tracking-wider text-pitch">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Паспорт гравця 1v1</span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-[1.7rem] font-extrabold text-white truncate tracking-[-0.03em] leading-tight mt-0.5">
                    {player.nickname}
                  </h1>
                  <div className="text-xs font-medium text-slate-300 truncate">
                    {player.fullName}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#0D1017]/85 border border-white/15 text-xs font-semibold text-slate-100">
                  <UaFlag className="w-3.5 h-2.5" />
                  <span>
                    {player.city} • {player.platform}
                  </span>
                </div>

                {/* Honest Pre-Season / Match Stats Mini-Bar */}
                {actualPlayed > 0 ? (
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    <div className="px-2 py-1 rounded-xl bg-[#0D1017]/85 border border-white/10 text-center">
                      <div className="text-[0.55rem] font-bold text-slate-400 uppercase">
                        АТК
                      </div>
                      <div className="font-display text-xs font-extrabold text-white tabular-nums">
                        {attStat}
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-xl bg-[#0D1017]/85 border border-white/10 text-center">
                      <div className="text-[0.55rem] font-bold text-slate-400 uppercase">
                        ПАС
                      </div>
                      <div className="font-display text-xs font-extrabold text-pitch tabular-nums">
                        {ctlStat}
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-xl bg-[#0D1017]/85 border border-white/10 text-center">
                      <div className="text-[0.55rem] font-bold text-slate-400 uppercase">
                        ЗАХ
                      </div>
                      <div className="font-display text-xs font-extrabold text-sky-300 tabular-nums">
                        {defStat}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    <div className="px-2 py-1 rounded-xl bg-[#0D1017]/85 border border-white/10 text-center">
                      <div className="text-[0.55rem] font-bold text-slate-400 uppercase">
                        МАТЧІВ
                      </div>
                      <div className="font-display text-xs font-extrabold text-white tabular-nums">
                        0
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-xl bg-[#0D1017]/85 border border-white/10 text-center">
                      <div className="text-[0.55rem] font-bold text-slate-400 uppercase">
                        ОЧКИ
                      </div>
                      <div className="font-display text-xs font-extrabold text-pitch tabular-nums">
                        {player.seasonPoints}
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-xl bg-[#0D1017]/85 border border-white/10 text-center">
                      <div className="text-[0.55rem] font-bold text-slate-400 uppercase">
                        СТАТУС
                      </div>
                      <div className="font-display text-xs font-extrabold text-sky-300">
                        СТАРТ
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Interactive EA ID, Telegram & Profile Settings */}
            <div className="relative z-10">
              <PlayerPassportActions
                eaId={player.eaId}
                telegram={player.telegram}
                nickname={player.nickname}
                platform={player.platform}
                player={player}
                currentUser={currentUser}
              />
            </div>

            {/* 4. Monobank × Дія Signature Card Number Footer */}
            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[0.68rem] font-mono text-slate-200 tabular-nums">
                <QrCode className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>
                  5375 •••• •••• {String(nationalRank).padStart(4, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-wider diia-gradient-text">
                  БУНКЕР ID • VERIFIED
                </span>
                <div className="flex items-center -space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400/80" />
                  <span className="w-4 h-4 rounded-full bg-sky-400/80" />
                </div>
              </div>
            </div>
          </HoloCard>

          {/* Grand Final Qualification Card */}
          <div className="glass-panel rounded-[30px] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white">
                <Crown className="w-4 h-4 text-gold" />
                <span>Відбір на Гранд-Фінал Сезону 🇺🇦</span>
              </span>
              {player.qualifiedAnnual ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/35 text-[0.65rem] font-extrabold text-gold">
                  Путівка чемпіона ✓
                </span>
              ) : inTop32 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[0.65rem] font-extrabold text-pitch">
                  Прохідна зона
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-[0.65rem] font-bold text-slate-300">
                  Резерв сезону
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {player.qualifiedAnnual
                ? `${player.nickname} виграв Благодійний Кубок і вже гарантував собі пряме місце у Кошику #1 Гранд-Фіналу Сезону на підтримку ЗСУ.`
                : inTop32
                  ? `${player.nickname} входить у прохідну зону рейтингу (#${nationalRank} місце) на підсумковий Гранд-Фінал Сезону за головну нагороду від воїнів ЗСУ.`
                  : `Здобувайте очки у благодійних турнірах 1v1, щоб піднятися у прохідну зону рейтингу сезону.`}
            </p>

            <Link
              href="/tournaments/november-cup-2026"
              className="w-full py-3 px-4 rounded-full bg-white/[0.08] hover:bg-white hover:text-[#09090B] text-xs font-extrabold text-white inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Перейти до Благодійного Турніру</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: CAREER STATS BENTO, TOURNAMENT CLUBS & MATCH HISTORY */}
        <div className="lg:col-span-8 space-y-7">
          {/* 1. 4-KPI Career Metrics Bento */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel rounded-[26px] p-5 space-y-1.5">
              <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
                <span>Очки сезону</span>
                <Flame className="w-4 h-4 text-sky-300" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white tabular-nums">
                {player.seasonPoints}
              </div>
              <div className="text-[0.68rem] font-semibold text-pitch">
                Місце #{nationalRank} в Україні
              </div>
            </div>

            <div className="glass-panel rounded-[26px] p-5 space-y-1.5">
              <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
                <span>Вінрейт 1v1</span>
                <ShieldCheck className="w-4 h-4 text-pitch" />
              </div>
              <div className="font-display text-3xl font-extrabold text-pitch tabular-nums">
                {winRate}%
              </div>
              <div className="text-[0.68rem] font-mono text-slate-300 tabular-nums">
                <span className="text-pitch font-bold">{player.wins}В</span> •{' '}
                <span>{player.draws}Н</span> •{' '}
                <span className="text-[#FF7A5C]">{player.losses}П</span>
              </div>
            </div>

            <div className="glass-panel rounded-[26px] p-5 space-y-1.5">
              <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
                <span>Різниця голів</span>
                <Swords className="w-4 h-4 text-slate-200" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white tabular-nums">
                {gd > 0 ? `+${gd}` : gd}
              </div>
              <div className="text-[0.68rem] font-mono text-slate-300 tabular-nums">
                М&apos;ячі {player.goalsFor}:{player.goalsAgainst} ({gpg}/м)
              </div>
            </div>

            <div className="glass-panel rounded-[26px] p-5 space-y-1.5">
              <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
                <span>Титули сезону</span>
                <Trophy className="w-4 h-4 text-gold" />
              </div>
              <div className="font-display text-3xl font-extrabold text-gold tabular-nums">
                {player.tournamentsWon}
              </div>
              <div className="text-[0.68rem] font-mono text-slate-300">
                Зіграно турнірів: {participations.length}
              </div>
            </div>
          </section>

          {/* 2. Tournament Participations & Drafted Clubs (With Smart Onboarding when 0) */}
          <section className="glass-panel rounded-[30px] p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-pitch" />
                  <span>
                    Турнірна кар&apos;єра та клуби за драфтом (
                    {participations.length})
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Історія виступів гравця в кубках сезону та закріплені клуби з
                  кошиків жеребкування
                </p>
              </div>
            </div>

            {participations.length === 0 ? (
              <div className="p-6 rounded-[24px] bg-[#10121A]/75 border border-white/12 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-pitch flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Відкриті турніри для старту сезону</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {player.nickname} ще не брав участі у матчах — оберіть
                      активний кубок, щоб отримати клуб на драфті та здобути
                      перші очки:
                    </p>
                  </div>
                </div>

                {openTournaments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {openTournaments.map((t) => (
                      <Link
                        key={t.id}
                        href={`/tournaments/${t.slug}`}
                        className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 hover:border-white/25 flex items-center justify-between gap-3 transition-all group"
                      >
                        <div className="min-w-0">
                          <div className="text-[0.65rem] font-bold text-slate-400">
                            {t.monthLabel} • Вільних місць:{' '}
                            {Math.max(
                              0,
                              t.maxPlayers - (t.participantCount ?? 0)
                            )}
                          </div>
                          <div className="font-display text-sm font-extrabold text-white truncate mt-0.5">
                            {t.title}
                          </div>
                          <div className="text-xs font-extrabold text-pitch tabular-nums mt-0.5">
                            Фонд {t.prizePoolUah.toLocaleString('uk-UA')} ₴
                          </div>
                        </div>

                        <span className="px-3.5 py-2 rounded-full bg-white text-[#09090B] group-hover:scale-105 text-xs font-extrabold shrink-0 transition-transform">
                          Узяти участь →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participations.map((part) => (
                  <Link
                    key={part.tournamentId}
                    href={`/tournaments/${part.tournamentSlug}`}
                    className={`p-5 rounded-[24px] border transition-all flex flex-col justify-between gap-4 group ${
                      part.isChampion
                        ? 'mono-iron-surface hover:border-amber-300/60'
                        : 'bg-[#10121A]/70 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[0.62rem] font-mono text-slate-200">
                            {part.monthLabel}
                          </span>
                          {part.seedPot && (
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-400/15 border border-sky-400/30 text-[0.62rem] font-mono text-sky-300">
                              Кошик #{part.seedPot}
                            </span>
                          )}
                          {part.groupName && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[0.62rem] font-mono text-pitch font-bold">
                              Група {part.groupName}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-base font-extrabold text-white truncate pt-1">
                          {part.tournamentTitle}
                        </h3>
                      </div>

                      <span className="font-display text-sm font-extrabold text-white tabular-nums shrink-0">
                        {part.prizePoolUah.toLocaleString('uk-UA')}{' '}
                        <span className="text-pitch">₴</span>
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <ClubCrest
                        club={part.club}
                        size="sm"
                        showName
                        showStars
                      />

                      {part.isChampion ? (
                        <span className="px-3 py-1 rounded-full bg-gold text-[#09090B] text-[0.65rem] font-extrabold inline-flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          Чемпіон
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white inline-flex items-center gap-1 transition-colors">
                          <span>Сітка</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* 3. Official 1v1 Match History */}
          <section className="glass-panel rounded-[30px] p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-sky-300" />
                  <span>Історія офіційних матчів 1v1 ({matches.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Результати групового етапу та плей-офф із верифікованими
                  рахунками
                </p>
              </div>
            </div>

            {matches.length === 0 ? (
              <div className="p-6 rounded-[24px] bg-[#10121A]/65 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  Офіційні матчі з&apos;являться тут одразу після жеребкування
                  груп обраного турніру.
                </div>
                <Link
                  href="/tournaments"
                  className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white hover:text-[#09090B] text-xs font-extrabold text-white shrink-0 transition-colors"
                >
                  Переглянути календар →
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {matches.map((m) => {
                  const isP1 = m.player1Id === player.id;
                  const myScore = isP1 ? m.score1 : m.score2;
                  const oppScore = isP1 ? m.score2 : m.score1;
                  const myPen = isP1 ? m.penalties1 : m.penalties2;
                  const oppPen = isP1 ? m.penalties2 : m.penalties1;
                  const myClub = isP1 ? m.player1?.club : m.player2?.club;
                  const opponent = isP1 ? m.player2 : m.player1;

                  let outcome: 'WIN' | 'DRAW' | 'LOSS' | 'SCHEDULED' =
                    'SCHEDULED';
                  if (
                    m.status === 'COMPLETED' &&
                    myScore !== null &&
                    oppScore !== null
                  ) {
                    if (myScore > oppScore) outcome = 'WIN';
                    else if (myScore < oppScore) outcome = 'LOSS';
                    else if (myPen !== null && oppPen !== null) {
                      outcome = myPen > oppPen ? 'WIN' : 'LOSS';
                    } else {
                      outcome = 'DRAW';
                    }
                  }

                  const stageBadge =
                    m.stage === 'GROUP'
                      ? `Група ${m.groupName} • Тур ${m.roundNumber}`
                      : m.playoffRound === 'FINAL'
                        ? 'Гранд-Фінал'
                        : m.playoffRound === 'THIRD'
                          ? 'Матч за 3-тє місце'
                          : m.playoffRound === 'SF'
                            ? '1/2 фіналу'
                            : m.playoffRound === 'QF'
                              ? '1/4 фіналу'
                              : '1/8 фіналу';

                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-[22px] bg-[#10121A]/70 hover:bg-[#141824]/85 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[0.62rem] font-mono font-extrabold shrink-0 ${
                            outcome === 'WIN'
                              ? 'bg-emerald-400/15 text-pitch border border-emerald-400/30'
                              : outcome === 'LOSS'
                                ? 'bg-[#FF5C39]/15 text-[#FF7A5C] border border-[#FF5C39]/30'
                                : outcome === 'DRAW'
                                  ? 'bg-white/10 text-slate-200 border border-white/15'
                                  : 'bg-amber-400/15 text-gold border border-amber-400/30'
                          }`}
                        >
                          {outcome === 'WIN'
                            ? 'ПЕРЕМОГА'
                            : outcome === 'LOSS'
                              ? 'ПОРАЗКА'
                              : outcome === 'DRAW'
                                ? 'НІЧИЯ'
                                : m.status === 'DISPUTED'
                                  ? 'VAR СПІР'
                                  : 'ОЧІКУЄТЬСЯ'}
                        </span>

                        <div className="min-w-0">
                          <div className="text-[0.68rem] text-slate-400 truncate">
                            <Link
                              href={`/tournaments/${m.tournamentSlug}`}
                              className="hover:text-white transition-colors"
                            >
                              {m.tournamentTitle}
                            </Link>{' '}
                            • <span className="text-slate-300">{stageBadge}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-white">
                              <ClubCrest club={myClub} size="sm" />
                              <span>{player.nickname}</span>
                            </span>

                            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/15 font-mono text-xs font-extrabold text-white tabular-nums">
                              {myScore ?? '—'} : {oppScore ?? '—'}
                              {myPen !== null && oppPen !== null
                                ? ` (${myPen}:${oppPen} пен.)`
                                : ''}
                            </span>

                            {opponent ? (
                              <Link
                                href={`/players/${encodeURIComponent(opponent.nickname)}`}
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 hover:text-pitch transition-colors"
                              >
                                <ClubCrest club={opponent.club} size="sm" />
                                <span>{opponent.nickname}</span>
                              </Link>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Очікується суперник
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0">
                        {m.status === 'COMPLETED' && (
                          <span className="text-[0.65rem] font-mono text-slate-400 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-pitch" />
                            <span>Верифіковано</span>
                          </span>
                        )}
                        <Link
                          href={`/tournaments/${m.tournamentSlug}?match=${m.id}`}
                          className="px-3.5 py-1.5 rounded-full bg-white/[0.07] hover:bg-white hover:text-[#09090B] text-xs font-bold text-white transition-colors"
                        >
                          Матч-центр →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
