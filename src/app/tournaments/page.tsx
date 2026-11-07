import React from 'react';
import { listTournaments } from '@/lib/tournament-engine';
import { TournamentsCatalogClient } from '@/components/TournamentsCatalogClient';

export const dynamic = 'force-dynamic';

export default function TournamentsCatalogPage() {
  const tournaments = listTournaments();

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
      <TournamentsCatalogClient tournaments={tournaments} />
    </div>
  );
}
