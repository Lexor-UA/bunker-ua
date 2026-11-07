import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import {
  EA_OFFICIAL_DISCLAIMER_EN,
  EA_OFFICIAL_DISCLAIMER_UA,
} from '@/lib/constants';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.09] bg-[#0F121A]/75 backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <Link href="/" className="inline-block group">
              <BrandLogo size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Всеукраїнська платформа благодійних турнірів 1v1 з EA SPORTS FC на
              підтримку ЗСУ (фонд Project Ukraine). Конвертуємо голи в допомогу
              армії! 🇺🇦
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-200">
            <a
              href="https://send.monobank.ua/jar/6aFeFX1Lk2"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 text-gold transition-colors"
            >
              🫙 Банка ЗСУ ↗
            </a>
            <Link
              href="/tournaments"
              className="px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.1] hover:text-white transition-colors"
            >
              Турніри
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.1] hover:text-white transition-colors"
            >
              Рейтинг
            </Link>
            <Link
              href="/rules"
              className="px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.1] hover:text-white transition-colors"
            >
              Правила
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-pitch shrink-0" />
              <span>{EA_OFFICIAL_DISCLAIMER_EN}</span>
            </div>
            <p className="text-[0.72rem] text-slate-400">
              {EA_OFFICIAL_DISCLAIMER_UA}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[0.7rem] text-slate-300 shrink-0">
            <span>© 2026–2027 БУНКЕР UA</span>
            <span className="text-slate-500">•</span>
            <span>PS5 • PC • XBOX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
