import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import {
  EA_OFFICIAL_DISCLAIMER_EN,
  EA_OFFICIAL_DISCLAIMER_UA,
} from '@/lib/constants';
import { BrandLogo } from './BrandLogo';
import { UaFlag } from './UaFlag';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sky-400/20 bg-[#030712]/90 backdrop-blur-2xl relative overflow-hidden">
      {/* Subtle Top Broadcast Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-md">
            <Link href="/" className="inline-block group">
              <BrandLogo size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Всеукраїнська благодійна платформа турнірів 1 на 1 з EA SPORTS FC
              на підтримку ЗСУ (фонд Project Ukraine). Конвертуємо голи в
              допомогу українській армії!{' '}
              <UaFlag className="w-3.5 h-2.5 inline-block align-middle ml-1" />
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2.5 text-xs font-extrabold text-slate-200">
            <a
              href="https://send.monobank.ua/jar/6aFeFX1Lk2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 transition-all shadow-[0_6px_18px_rgba(245,196,81,0.28)]"
            >
              <UaFlag className="w-3.5 h-2.5" />
              <span>Банка ЗСУ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/tournaments"
              className="px-4 py-2.5 rounded-full bg-[#060E24] hover:bg-[#0D1E4A] border border-sky-400/25 hover:border-sky-400/50 text-white transition-colors"
            >
              Турніри
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-2.5 rounded-full bg-[#060E24] hover:bg-[#0D1E4A] border border-sky-400/25 hover:border-sky-400/50 text-white transition-colors"
            >
              Рейтинг
            </Link>
            <Link
              href="/rules"
              className="px-4 py-2.5 rounded-full bg-[#060E24] hover:bg-[#0D1E4A] border border-sky-400/25 hover:border-sky-400/50 text-white transition-colors"
            >
              Правила
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-sky-400/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>{EA_OFFICIAL_DISCLAIMER_EN}</span>
            </div>
            <p className="text-[0.72rem] text-slate-400">
              {EA_OFFICIAL_DISCLAIMER_UA}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[0.7rem] text-slate-300 shrink-0">
            <span className="text-gold font-bold">
              © 2026–2027 BUNKER FC 1v1 • UKRAINE
            </span>
            <span className="text-slate-500">•</span>
            <span>PS5 • PC • XBOX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
