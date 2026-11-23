'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Crown,
  ExternalLink,
  Radio,
  Trophy,
  Users,
} from 'lucide-react';
import {
  ZSU_CHARITY_FUND_NAME,
  ZSU_MONOBANK_JAR_URL,
} from '@/lib/constants';
import type { Tournament } from '@/lib/types';
import {
  VectorEmeraldTrophy,
  VectorGoldTrophy,
} from './FintechArt';
import { UaFlag } from './UaFlag';

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
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'OPEN' | 'ANNUAL'>(
    'ALL'
  );

  const filtered = tournaments.filter((t) => {
    if (filter === 'LIVE') {
      return t.status === 'PLAYOFF' || t.status === 'GROUP_STAGE';
    }
    if (filter === 'OPEN') {
      return t.status === 'REGISTRATION';
    }
    if (filter === 'ANNUAL') {
      return t.cupType === 'ANNUAL';
    }
    return true;
  });

  const monthlyCups = filtered.filter((t) => t.cupType === 'MONTHLY');
  const annualCups = filtered.filter((t) => t.cupType === 'ANNUAL');

  return (
    <div className="space-y-10 pb-12">
      {/* 1. CLEAN HEADER + FILTER BAR */}
      <section className="glass-panel rounded-[32px] border border-white/[0.1] p-7 sm:p-9 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-bold text-white">
              <UaFlag className="w-3.5 h-2.5" />
              <span>Благодійна серія турнірів 1v1 • {ZSU_CHARITY_FUND_NAME}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em]">
              Турніри <span className="diia-gradient-text">BUNKER FC 1v1</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Система Ліги Чемпіонів (групи + плей-офф), вільний графік у
              Telegram та головна нагорода переможцю — пам’ятний трофей від
              воїнів ЗСУ.
            </p>
          </div>

          <a
            href={ZSU_MONOBANK_JAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 transition-all shadow-[0_12px_28px_rgba(245,196,81,0.3)] inline-flex items-center gap-2 self-start lg:self-center shrink-0"
          >
            <UaFlag className="w-3.5 h-2.5 shrink-0" />
            <span>Спільна Банка ЗСУ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Clean Filter Tabs */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'ALL', label: 'Усі турніри' },
              { id: 'LIVE', label: 'LIVE зараз' },
              { id: 'OPEN', label: 'Відкрита реєстрація' },
              { id: 'ANNUAL', label: 'Підсумковий Кубок Сезону' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-[#040814]'
                  : 'bg-white/[0.05] text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. CHARITY TOURNAMENTS GRID */}
      {monthlyCups.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monthlyCups.map((t) => {
            const count = t.participantCount ?? 0;
            const fillPct = Math.min(
              100,
              Math.round((count / t.maxPlayers) * 100)
            );
            const isLive =
              t.status === 'PLAYOFF' || t.status === 'GROUP_STAGE';

            return (
              <Link
                key={t.id}
                href={`/tournaments/${t.slug}`}
                className={`group glass-panel rounded-[30px] p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 border ${
                  isLive
                    ? 'border-white/[0.1] hover:border-sky-400/50'
                    : 'border-amber-400/35 hover:border-amber-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5C39] text-white text-xs font-extrabold">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>Плей-офф LIVE</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] text-xs font-extrabold">
                        Відкрита реєстрація
                      </span>
                    )}

                    <span className="text-xs text-slate-400 inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>{formatDateUa(t.startDate)}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <h2 className="font-display text-2xl font-extrabold text-white group-hover:text-gold transition-colors">
                        {t.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {t.subtitle}
                      </p>
                    </div>
                    {isLive ? (
                      <VectorEmeraldTrophy className="w-20 h-20 shrink-0" />
                    ) : (
                      <VectorGoldTrophy className="w-20 h-20 shrink-0" />
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {isLive
                          ? 'Зіграно матчів турніру'
                          : 'Зареєстровано учасників'}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-white">
                      {isLive ? '38 / 41 (93%)' : `${count} / ${t.maxPlayers}`}
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-[#040814] overflow-hidden">
                    <div
                      className="h-full rounded-full diia-iridescent-bg"
                      style={{
                        width: isLive ? '93%' : `${Math.max(8, fillPct)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300 font-medium">
                      {isLive
                        ? 'Зібрано 2 145 ₴ на Банку ЗСУ'
                        : 'Внесок від 10 ₴ на Банку ЗСУ'}
                    </span>
                    <span className="text-xs font-extrabold text-gold inline-flex items-center gap-1">
                      <span>
                        {isLive ? 'Відкрити сітку' : 'Подати заявку'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      {/* 3. GRAND FINAL CARD */}
      {annualCups.map((t) => (
        <Link
          key={t.id}
          href={`/tournaments/${t.slug}`}
          className="group block rounded-[32px] bg-gradient-to-r from-[#131C38] via-[#0B1226] to-[#1E160C] border border-amber-400/35 hover:border-amber-300 p-7 sm:p-8 transition-all"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#040814]/80 border border-amber-400/35 flex items-center justify-center shrink-0">
                <VectorGoldTrophy className="w-12 h-12" />
              </div>
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold text-gold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>ПІДСУМКОВИЙ КУБОК СЕЗОНУ • ТОП-{t.maxPlayers}</span>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-white">
                  {t.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Головний турнір року серед переможців благодійних кубків та
                  лідерів загального рейтингу України за ексклюзивний трофей від
                  воїнів ЗСУ.
                </p>
              </div>
            </div>

            <span className="px-6 py-3 rounded-full bg-gold text-[#040814] group-hover:brightness-110 text-xs font-extrabold inline-flex items-center gap-2 self-start lg:self-center shrink-0 transition-all">
              <span>Детальніше про Фінал</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
