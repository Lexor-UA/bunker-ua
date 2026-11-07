import React from 'react';
import { getCurrentUser } from '@/lib/session';
import {
  getEaComplianceSummary,
  getPendingAndDisputedMatches,
  listTournaments,
} from '@/lib/tournament-engine';
import { AdminStudioClient } from '@/components/AdminStudioClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  const compliance = getEaComplianceSummary(2026);
  const disputedMatches = getPendingAndDisputedMatches();
  const tournaments = listTournaments();

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
      <AdminStudioClient
        currentUser={currentUser}
        compliance={compliance}
        disputedMatches={disputedMatches}
        tournaments={tournaments}
      />
    </div>
  );
}

