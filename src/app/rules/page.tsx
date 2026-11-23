import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Shuffle,
  Trophy,
} from 'lucide-react';
import {
  ZSU_CHARITY_FUND_NAME,
  ZSU_MONOBANK_CARD,
  ZSU_MONOBANK_JAR_URL,
} from '@/lib/constants';
import { HoloCard } from '@/components/HoloCard';
import { MonoPrizeJarSvg, UaFlag } from '@/components/UaFlag';

export const dynamic = 'force-dynamic';

export default function RulesAndCompliancePage() {
  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-10 pb-12">
      {/* 1. CLEAN HEADER + CHARITY JAR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 glass-panel rounded-[32px] border border-white/[0.1] p-7 sm:p-9 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-bold text-white">
              <UaFlag className="w-3.5 h-2.5" />
              <span>Офіційний регламент • BUNKER FC 1v1</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em]">
              Правила турніру та{' '}
              <span className="diia-gradient-text">підтримка ЗСУ</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Змагання проходять у форматі{' '}
              <strong className="text-white">
                Ліги Чемпіонів (групи у 2 кола + сітка Плей-офф)
              </strong>{' '}
              із вільним графіком матчів за домовленістю в Telegram. Усі 100%
              благодійних внесків передаємо фонду{' '}
              <strong className="text-white">{ZSU_CHARITY_FUND_NAME}</strong>, а
              переможець отримує{' '}
              <strong className="text-gold">
                пам’ятний трофей від воїнів ЗСУ
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tournaments/november-cup-2026"
              className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 transition-all inline-flex items-center gap-2"
            >
              <span>Подати заявку на Турнір #2</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={ZSU_MONOBANK_JAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-extrabold bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-white transition-colors inline-flex items-center gap-2"
            >
              <UaFlag className="w-3.5 h-2.5 shrink-0" />
              <span>Відкрити Банку ЗСУ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Monobank Jar Summary */}
        <HoloCard
          variant="diia"
          className="lg:col-span-5 diia-card-surface rounded-[32px] border border-white/15 p-7 sm:p-8 flex flex-col justify-between gap-6"
        >
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040A18]/85 border border-white/15 text-xs font-bold text-white">
                <HeartHandshake className="w-3.5 h-3.5 text-gold" />
                <span>Спільна Банка ЗСУ</span>
              </span>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em] pt-1">
                від <span className="text-gold">10 ₴</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Кожен учасник донатить скільки хоче і може. Звіт про переказ
                100% коштів публікується у Telegram-спільноті.
              </p>
            </div>

            <MonoPrizeJarSvg className="w-20 h-24 shrink-0" />
          </div>

          <div className="relative z-10 p-4 rounded-2xl bg-[#040A18]/85 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Картка Банки ЗСУ:</span>
              <span className="font-mono font-extrabold text-gold">
                {ZSU_MONOBANK_CARD}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-slate-400">Посилання Monobank:</span>
              <a
                href={ZSU_MONOBANK_JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sky-300 hover:text-gold inline-flex items-center gap-1 transition-colors"
              >
                <span>send.monobank.ua/jar/6aFeFX1Lk2</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </HoloCard>
      </section>

      {/* 2. TWO CLEAR RULES BLOCKS: FORMAT & MATCH ROOM */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-[32px] border border-white/[0.1] p-7 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-display text-xl font-extrabold">
            <Shuffle className="w-5 h-5 text-sky-300" />
            <h2>Формат турніру: Групи та Плей-офф</h2>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-[#040A18]/75 border border-white/[0.08] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Автоматичний посів груп
                </strong>
                Учасники розподіляються на групи, де грають по 2 матчі з кожним
                суперником (вдома та на виїзді). Перемога — 3 очки, нічия — 1
                очко.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/75 border border-white/[0.08] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Вільний графік у Telegram
                </strong>
                Про день і час гри учасники домовляються між собою напряму в
                Telegram (бажано зіграти матчі групи протягом тижня).
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/75 border border-white/[0.08] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Сітка Плей-офф на виліт
                </strong>
                Найкращі гравці з груп виходять в 1/4 фіналу, Півфінали та
                Гранд-Фінал за головний трофей від воїнів ЗСУ.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] border border-white/[0.1] p-7 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-display text-xl font-extrabold">
            <Scale className="w-5 h-5 text-gold" />
            <h2>Налаштування матчу та чесна гра</h2>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-[#040A18]/75 border border-white/[0.08] flex items-start gap-3">
              <Trophy className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Параметри лобі EA SPORTS FC
                </strong>
                Режим Online Friendlies / Ultimate Team 1v1 (Cross-Play PS5 /
                PC / Xbox), тривалість тайму — 6 хвилин, швидкість гри — Normal.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/75 border border-white/[0.08] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Фіксація результату
                </strong>
                Після фінального свистка гравці роблять скріншот рахунку та
                вносять результат у Кімнаті матчу на сайті або в Telegram-групі.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/75 border border-white/[0.08] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Розрив з&apos;єднання та арбітраж
                </strong>
                У разі дисконнекту дограються хвилини, що залишилися, зі
                збереженням поточного рахунку. Спірні моменти вирішує
                організатор турніру.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
