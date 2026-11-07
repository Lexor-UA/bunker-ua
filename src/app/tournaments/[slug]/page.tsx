import React from 'react';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import {
  computeGroupStandings,
  getTournamentBySlugOrId,
  getTournamentMatches,
  getTournamentParticipants,
} from '@/lib/tournament-engine';
import { TournamentHubClient } from '@/components/TournamentHubClient';

export const dynamic = 'force-dynamic';

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = getTournamentBySlugOrId(slug);
  if (!tournament) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const participants = getTournamentParticipants(tournament.id);
  const matches = getTournamentMatches(tournament.id);
  const standings = computeGroupStandings(tournament.id);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
      <TournamentHubClient
        tournament={tournament}
        participants={participants}
        matches={matches}
        standings={standings}
        currentUser={currentUser}
      />
    </div>
  );
}

