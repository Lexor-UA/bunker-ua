'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Radio,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import {
  ZSU_CHARITY_FUND_NAME,
  ZSU_MONOBANK_CARD,
  ZSU_MONOBANK_JAR_URL,
} from '@/lib/constants';
import type { Tournament } from '@/lib/types';
import {
  CardNetworkCircles,
  NfcIcon,
  TacticalPitchArt,
  VectorEmeraldTrophy,
  VectorGoldTrophy,
} from './FintechArt';
import { HoloCard } from './HoloCard';
import { MonoCardChip, UaFlag } from './UaFlag';

interface TournamentsCatalogClientProps {
  tournaments: Tournament[];
}

const MONTHS_UA: Record<string, string> = {
  '01': 'січня',
  '02': 'лютого',
  '03': 'березня',
  '04': 'квітня',
  '05': 'травня',
  '06': 'червня',
  '07': 'липня',
  '08': 'серпня',
  '09': 'вересня',
  '10': 'жовтня',
  '11': 'листопада',
  '12': 'грудня',
};

function formatDateUa(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const [year, month, day] = parts;
  const m = MONTHS_UA[month] ?? month;
  return `${Number(day)} ${m} ${year}`;
}

export function TournamentsCatalogClient({
  tournaments,
}: TournamentsCatalogClientProps) {
  const [filter, setFilter] = useState<
    'ALL' | 'LIVE' | 'OPEN' | 'MONTHLY' | 'ANNUAL'
  >('ALL');

  const liveCount = tournaments.filter(
    (t) => t.status === 'PLAYOFF' || t.status === 'GROUP_STAGE'
  ).length;
  const openCount = tournaments.filter(
    (t) => t.status === 'REGISTRATION'
  ).length;

  const filtered = tournaments.filter((t) => {
    if (filter === 'LIVE') {
      return t.status === 'PLAYOFF' || t.status === 'GROUP_STAGE';
    }
    if (filter === 'OPEN') {
      return t.status === 'REGISTRATION';
    }
    if (filter === 'MONTHLY') {
      return t.cupType === 'MONTHLY';
    }
    if (filter === 'ANNUAL') {
      return t.cupType === 'ANNUAL';
    }
    return true;
  });

  const annualCups = filtered.filter((t) => t.cupType === 'ANNUAL');
  const monthlyCups = filtered.filter((t) => t.cupType === 'MONTHLY');

  return (
    <div className="space-y-12 pb-6">
      {/* 1. MONOBANK x DIIA CATALOG HERO STAGE */}
      <section className="relative rounded-[34px] overflow-hidden glass-panel p-7 sm:p-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-45">
            <TacticalPitchArt accent="emerald" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-24 right-10 w-96 h-60 rounded-full opacity-25 blur-3xl diia-iridescent-bg"
          />
        </div>

        <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full diia-iridescent-subtle border border-white/15 text-xs font-bold text-white">
              <UaFlag className="w-3.5 h-2.5" />
              <span>БУНКЕР • Благодійна серія турнірів на підтримку ЗСУ</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.04em]">
              Благодійні Турніри{' '}
              <span className="diia-gradient-text">1 на 1 в EA FC</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Система Ліги Чемпіонів (групи + плей-офф), вільний графік матчів за
              домовленістю в Telegram та особливий трофей переможцю —{' '}
              <strong className="text-white">
                пам’ятна нагорода від воїнів ЗСУ 🎖️
              </strong>
              . Усі 100% внесків передаємо фонду{' '}
              <strong className="text-pitch">{ZSU_CHARITY_FUND_NAME}</strong>.
            </p>
          </div>

          {/* Right Quick KPI Capsules + Jar Link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-[#10121A]/75 border border-white/15 backdrop-blur-md">
              <div className="text-[0.65rem] text-slate-300 font-medium">
                Головний приз кубка
              </div>
              <div className="font-display text-base sm:text-lg font-extrabold text-gold">
                🎖️ Нагорода від ЗСУ
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#10121A]/75 border border-white/15 backdrop-blur-md">
              <div className="text-[0.65rem] text-slate-300 font-medium">
                Внесок на Банку ЗСУ
              </div>
              <div className="font-display text-base sm:text-lg font-extrabold text-pitch">
                від 10 ₴ • {ZSU_CHARITY_FUND_NAME}
              </div>
            </div>

            <a
              href={ZSU_MONOBANK_JAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-100 transition-all shadow-[0_14px_34px_rgba(255,255,255,0.18)] inline-flex items-center gap-2"
            >
              <span>🫙 Відкрити Банку ЗСУ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Segmented Filter Bar */}
        <div className="relative mt-7 pt-6 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-[#10121A]/80 border border-white/[0.14]">
            {(
              [
                { id: 'ALL', label: `Усі турніри (${tournaments.length})` },
                { id: 'LIVE', label: `LIVE зараз (${liveCount})` },
                { id: 'OPEN', label: `Реєстрація (${openCount})` },
                { id: 'MONTHLY', label: 'Благодійні Кубки ЗСУ' },
                { id: 'ANNUAL', label: 'Гранд-Фінал Сезону' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  filter === tab.id
                    ? 'bg-white text-[#09090B] shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-300 font-medium font-mono">
            Картка Банки ЗСУ: {ZSU_MONOBANK_CARD} • 100% у фонд {ZSU_CHARITY_FUND_NAME}
          </span>
        </div>
      </section>

      {/* 2. GRAND FINAL SPOTLIGHT */}
      {annualCups.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
              Підсумковий кубок сезону • Гранд-Фінал
            </h2>
            <span className="text-xs font-semibold text-gold">
              Кваліфікація за рейтингом благодійних кубків
            </span>
          </div>

          <div className="space-y-6">
            {annualCups.map((t) => {
              const count = t.participantCount ?? 0;
              const fillPct = Math.min(
                100,
                Math.round((count / t.maxPlayers) * 100)
              );
              const tiers =
                t.prizeBreakdown.length > 0
                  ? t.prizeBreakdown.slice(0, 4)
                  : [
                      {
                        place: '1 місце (Чемпіон)',
                        amountUah: 0,
                        points: 500,
                        badge: '🏆 Нагорода від воїнів ЗСУ',
                      },
                      {
                        place: '2 місце (Фіналіст)',
                        amountUah: 0,
                        points: 350,
                        badge: '🥈 Срібний призер',
                      },
                      {
                        place: '3 місце',
                        amountUah: 0,
                        points: 250,
                        badge: '🥉 Бронзовий призер',
                      },
                      {
                        place: '4 місце',
                        amountUah: 0,
                        points: 180,
                        badge: 'Півфіналіст',
                      },
                    ];

              return (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.slug}`}
                  className="block group"
                >
                  <HoloCard
                    variant="gold"
                    className="rounded-[34px] mono-iron-surface overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                      {/* Left Panoramic 3D Arena & Golden Trophy Stage */}
                      <div className="lg:col-span-5 relative min-h-[18rem] bg-[#0B0E17] border-b lg:border-b-0 lg:border-r border-white/15 p-6 flex flex-col justify-between overflow-hidden">
                        <img
                          src="/images/banner-grand-final.jpg"
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/55 to-[#0B0E17]/40"
                        />

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-gold text-[#09090B] text-[0.68rem] font-extrabold tracking-wide shadow">
                            ★ ФІНАЛ СЕЗОНУ • ЗСУ
                          </span>
                          <CardNetworkCircles tone="gold" />
                        </div>

                        <div className="relative z-10 my-2 flex items-center justify-center">
                          <VectorGoldTrophy className="w-44 h-44 group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        <div className="relative z-10 flex items-center justify-between text-[0.68rem] font-mono text-amber-200/95 font-bold">
                          <span>БУНКЕР UA • ЗСУ</span>
                          <span>ТОП-{t.maxPlayers} СЕЗОНУ</span>
                        </div>
                      </div>

                      {/* Right Executive Details & Prize Tiers */}
                      <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-between gap-6 relative z-10">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5 text-xs">
                              <MonoCardChip tone="gold" />
                              <span className="px-3 py-1 rounded-full bg-[#10121A]/75 border border-white/15 text-slate-200 font-semibold inline-flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gold" />
                                {formatDateUa(t.startDate)}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-pitch font-bold">
                                За рейтингом сезону
                              </span>
                            </div>

                            <span className="w-10 h-10 rounded-full bg-white/[0.08] group-hover:bg-white group-hover:text-[#09090B] text-white flex items-center justify-center transition-colors">
                              <ArrowUpRight className="w-4 h-4" />
                            </span>
                          </div>

                          <div>
                            <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-[-0.035em]">
                              {t.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                              {t.subtitle} — переможці благодійних кубків та
                              лідери загального рейтингу змагаються за головну
                              відзнаку сезону від воїнів ЗСУ.
                            </p>
                          </div>

                          {/* 4-Column Award Breakdown Bento */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                            {tiers.map((tier, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-2xl bg-[#10121A]/75 border border-white/[0.12]"
                              >
                                <div className="text-[0.65rem] text-slate-400 font-semibold">
                                  {tier.place}
                                </div>
                                <div
                                  className={`font-display text-xs sm:text-sm font-extrabold tabular-nums mt-0.5 ${
                                    idx === 0 ? 'text-gold' : 'text-white'
                                  }`}
                                >
                                  {tier.amountUah > 0
                                    ? `${tier.amountUah.toLocaleString('uk-UA')} ₴`
                                    : idx === 0
                                      ? '🎖️ Трофей ЗСУ'
                                      : `+${tier.points} pts`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Award Figure + Qualification Bar + Pill CTA */}
                        <div className="pt-5 border-t border-white/[0.1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div>
                              <div className="text-[0.68rem] text-slate-400 font-semibold uppercase tracking-wider">
                                Головна нагорода фіналу
                              </div>
                              <div className="font-display text-xl sm:text-2xl font-extrabold text-gold">
                                {t.prizePoolUah > 0
                                  ? `${t.prizePoolUah.toLocaleString('uk-UA')} ₴`
                                  : '🎖️ Ексклюзивний сувенір від ЗСУ'}
                              </div>
                            </div>

                            <div className="hidden sm:block w-36 space-y-1.5">
                              <div className="flex justify-between text-[0.68rem] text-slate-300">
                                <span>Фіналісти</span>
                                <span className="font-mono font-bold tabular-nums">
                                  {count}/{t.maxPlayers}
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gold"
                                  style={{ width: `${Math.max(8, fillPct)}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <span className="px-7 py-3.5 rounded-full bg-white text-[#09090B] group-hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all shadow-[0_14px_32px_rgba(255,255,255,0.16)]">
                            <span>Відкрити Гранд-Фінал</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoloCard>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. CHARITY CUPS BENTO GRID */}
      {monthlyCups.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white inline-flex items-center gap-2">
              <span>Благодійні Турніри 1v1 • На підтримку ЗСУ</span>
              <UaFlag className="w-4 h-3" />
            </h2>
            <span className="text-xs text-slate-300 font-medium">
              Приз: пам’ятна нагорода від воїнів ЗСУ • Внесок від 10 ₴ на Банку ЗСУ
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {monthlyCups.map((t) => {
              const count = t.participantCount ?? 0;
              const fillPct = Math.min(
                100,
                Math.round((count / t.maxPlayers) * 100)
              );
              const isLive =
                t.status === 'PLAYOFF' || t.status === 'GROUP_STAGE';

              const topPrizes =
                t.prizeBreakdown.length > 0
                  ? t.prizeBreakdown.slice(0, 3)
                  : [
                      { place: '1 місце', amountUah: 0, points: 250 },
                      { place: '2 місце', amountUah: 0, points: 180 },
                      { place: '3 місце', amountUah: 0, points: 135 },
                    ];

              return (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.slug}`}
                  className={`group rounded-[32px] p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 ${
                    isLive
                      ? 'glass-panel hover:border-white/30'
                      : 'diia-card-surface hover:border-sky-300/60'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Full-Bleed Panoramic 3D Header Stage */}
                    <div className="relative -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 px-6 sm:px-7 pt-6 pb-5 overflow-hidden border-b border-white/12 min-h-[215px] flex flex-col justify-between">
                      <img
                        src={
                          isLive
                            ? '/images/hero-arena.jpg'
                            : '/images/banner-kickoff-draft.jpg'
                        }
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111723] via-[#111723]/70 to-[#0B0E17]/35"
                      />

                      {/* Top Pass Header */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5C39] text-white text-xs font-extrabold shadow">
                            <Radio className="w-3 h-3 animate-pulse" />
                            {t.status === 'PLAYOFF'
                              ? 'Плей-офф LIVE (1/2 та Фінал)'
                              : 'Групи LIVE'}
                          </span>
                        ) : (
                          <span className="px-3.5 py-1 rounded-full diia-iridescent-bg text-[#09090B] text-xs font-extrabold shadow">
                            ● Відкрита реєстрація
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#0B0E17]/80 border border-white/20 text-xs font-semibold text-white backdrop-blur-md">
                            {formatDateUa(t.startDate)}
                          </span>
                          <MonoCardChip tone="silver" />
                        </div>
                      </div>

                      {/* Prize & Alpha-Keyed Emerald 3D Trophy */}
                      <div className="relative z-10 flex items-end justify-between gap-4 pt-3">
                        <div className="space-y-1.5">
                          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-slate-200 font-bold block">
                            {isLive
                              ? 'Зібрано в банку ЗСУ • Project Ukraine'
                              : 'Головний приз кубка • ЗСУ'}
                          </span>
                          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white block drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                            {isLive ? (
                              <>
                                🫙 2 145 <span className="text-gold">₴</span>{' '}
                                <span className="text-base sm:text-lg font-bold text-pitch">
                                  • Трофей ЗСУ
                                </span>
                              </>
                            ) : t.prizePoolUah > 0 ? (
                              <>
                                {t.prizePoolUah.toLocaleString('uk-UA')}{' '}
                                <span className="text-pitch">₴</span>
                              </>
                            ) : (
                              <span>🎖️ Нагорода від воїнів ЗСУ</span>
                            )}
                          </span>
                          <div className="pt-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B0E17]/80 border border-white/15 text-[0.65rem] font-bold text-white backdrop-blur-md">
                              <UaFlag className="w-3.5 h-2.5" />
                              <span>
                                {isLive
                                  ? '18 учасників • 5 груп A–E'
                                  : t.gameMode === 'KICKOFF_CLUB_DRAFT'
                                    ? 'Ліга Чемпіонів (Групи + Плей-офф)'
                                    : 'Ultimate Team 1v1'}
                              </span>
                            </span>
                            {t.equal95Ovr && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/35 text-[0.65rem] font-extrabold text-pitch backdrop-blur-md">
                                95 OVR Баланс
                              </span>
                            )}
                          </div>
                        </div>

                        <VectorEmeraldTrophy className="w-28 h-28 shrink-0 -mb-2 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1">
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-[-0.03em]">
                        {t.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {t.subtitle}
                      </p>
                    </div>

                    {/* Mini Top-3 Breakdown */}
                    <div className="grid grid-cols-3 gap-2">
                      {topPrizes.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2.5 rounded-2xl bg-[#10121A]/70 border border-white/[0.1] text-center"
                        >
                          <div className="text-[0.63rem] text-slate-400">
                            {p.place}
                          </div>
                          <div
                            className={`text-xs sm:text-sm font-extrabold tabular-nums mt-0.5 ${
                              pIdx === 0 ? 'text-pitch' : 'text-white'
                            }`}
                          >
                            {p.amountUah > 0
                              ? `${p.amountUah.toLocaleString('uk-UA')} ₴`
                              : pIdx === 0
                                ? '🎖️ Трофей ЗСУ'
                                : `+${p.points} pts`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Progress + Tactile Pill CTA */}
                  <div className="pt-3 border-t border-white/10 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200 inline-flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-slate-300" />
                          {isLive
                            ? 'Зіграно матчів (Групи + Плей-офф)'
                            : 'Зареєстровано гравців'}
                        </span>
                        <span className="text-white font-mono font-extrabold tabular-nums">
                          {isLive
                            ? '38 / 41 (93%)'
                            : `${count} / ${t.maxPlayers}`}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#10121A]/80 overflow-hidden p-[1px] border border-white/10">
                        <div
                          className="h-full diia-iridescent-bg rounded-full"
                          style={{
                            width: isLive ? '93%' : `${Math.max(6, fillPct)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-200">
                        {isLive
                          ? 'Фінал: BRS_Nederfox vs Переможець 1/2'
                          : t.entryFeeUah === 0
                            ? 'Вільний донат на Банку ЗСУ'
                            : `Донат від ${t.entryFeeUah} ₴ • Банка ЗСУ`}
                      </span>
                      <span className="px-5 py-2.5 rounded-full bg-white text-[#09090B] group-hover:bg-neutral-200 text-xs font-extrabold inline-flex items-center gap-1.5 transition-all shadow-sm">
                        <span>
                          {isLive ? 'Сітка та групи' : 'Узяти участь'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. CHARITY MISSION STRIP */}
      <section className="diia-card-surface rounded-[30px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pitch">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Конвертуємо голи в допомогу армії</span>
            <UaFlag className="w-3.5 h-2.5" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">
            Вільний графік у Telegram + 100% донатів у фонд {ZSU_CHARITY_FUND_NAME}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Тотального контролю по внесках немає — кожен кидає на спільну банку
            ЗСУ скільки хоче і може (від 10 грн). Про час матчів гравці
            домовляються між собою (бажано зіграти групу за тиждень).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
          <span className="px-4 py-2.5 rounded-2xl bg-[#10121A]/80 border border-white/15 text-white inline-flex items-center gap-2">
            <Trophy className="w-4 h-4 text-pitch" />
            Система Ліги Чемпіонів
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
          <span className="px-4 py-2.5 rounded-2xl bg-[#10121A]/80 border border-amber-400/35 text-gold inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            🎖️ Нагорода від воїнів ЗСУ
          </span>
          <a
            href={ZSU_MONOBANK_JAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white text-[#09090B] hover:bg-neutral-200 font-extrabold transition-colors inline-flex items-center gap-1.5"
          >
            <span>🫙 Банка ЗСУ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
