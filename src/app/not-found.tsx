import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#10121A]/80 border border-white/15 flex items-center justify-center mx-auto">
        <Trophy className="w-8 h-8 text-pitch" />
      </div>
      <h1 className="font-display text-3xl font-extrabold text-white">
        404 • Сторінку або турнір не знайдено
      </h1>
      <p className="text-sm text-slate-300 max-w-md mx-auto">
        Перевірте посилання або поверніться до головного списку благодійних
        турнірів БУНКЕР UA.
      </p>
      <div>
        <Link
          href="/"
          className="inline-flex px-6 py-3 rounded-full font-display text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-colors"
        >
          Повернутися на Головну
        </Link>
      </div>
    </div>
  );
}

