export type PlatformType = 'PS5' | 'PC' | 'XBOX';
export type UserRole = 'PLAYER' | 'ADMIN';
export type CupType = 'MONTHLY' | 'ANNUAL';
export type GameMode = 'KICKOFF_CLUB_DRAFT' | 'ULTIMATE_TEAM';
export type ClubPoolType = 'ALL_TOP' | 'BALANCED_45' | 'ELITE_5' | 'NONE';
export type TournamentStatus =
  | 'REGISTRATION'
  | 'CLUB_DRAW'
  | 'GROUP_STAGE'
  | 'PLAYOFF'
  | 'COMPLETED';

export type MatchStage = 'GROUP' | 'PLAYOFF';
export type PlayoffRound = 'R16' | 'QF' | 'SF' | 'THIRD' | 'FINAL';
export type MatchStatus =
  | 'SCHEDULED'
  | 'PENDING_CONFIRM'
  | 'DISPUTED'
  | 'COMPLETED';

export interface Club {
  id: string;
  name: string;
  shortCode: string;
  country: string;
  league: string;
  stars: 5 | 4.5;
  tier: 'ELITE_5' | 'BALANCED_45' | 'UPL_PRIDE';
  ovr: number;
  primaryColor: string;
  secondaryColor: string;
}

export interface User {
  id: string;
  nickname: string;
  fullName: string;
  email: string;
  city: string;
  platform: PlatformType;
  eaId: string;
  telegram: string;
  role: UserRole;
  seasonPoints: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  tournamentsWon: number;
  qualifiedAnnual: boolean;
  avatarColor: string;
  avatarUrl?: string;
  payoutCard?: string;
  createdAt: string;
}

export interface PrizeTier {
  place: string;
  amountUah: number;
  points: number;
  badge?: string;
}

export interface Tournament {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cupType: CupType;
  gameMode: GameMode;
  clubPool: ClubPoolType;
  equal95Ovr: boolean;
  prizePoolUah: number;
  entryFeeUah: number;
  maxPlayers: 8 | 16 | 32;
  groupSize: 4;
  status: TournamentStatus;
  seasonYear: number;
  monthLabel: string;
  startDate: string;
  rulesNote: string;
  prizeBreakdown: PrizeTier[];
  championUserId: string | null;
  participantCount?: number;
  championNickname?: string | null;
  createdAt: string;
}

export interface Participant {
  id: string;
  tournamentId: string;
  userId: string;
  seedPot: number | null;
  assignedClubId: string | null;
  groupName: string | null;
  paymentStatus: 'FREE' | 'PAID';
  registeredAt: string;
  // Joined fields
  nickname: string;
  fullName: string;
  city: string;
  platform: PlatformType;
  eaId: string;
  telegram: string;
  seasonPoints: number;
  avatarColor: string;
  club: Club | null;
}

export interface MatchPlayerInfo {
  id: string;
  nickname: string;
  city: string;
  platform: PlatformType;
  eaId: string;
  telegram: string;
  avatarColor: string;
  club: Club | null;
}

export interface Match {
  id: string;
  tournamentId: string;
  stage: MatchStage;
  groupName: string | null;
  roundNumber: number;
  playoffRound: PlayoffRound | null;
  matchOrder: number;
  player1Id: string | null;
  player2Id: string | null;
  score1: number | null;
  score2: number | null;
  penalties1: number | null;
  penalties2: number | null;
  winnerId: string | null;
  status: MatchStatus;
  submittedById: string | null;
  proofImageUrl: string | null;
  disputeReason: string | null;
  disputeImageUrl: string | null;
  adminNote: string | null;
  p1CheckedInAt?: string | null;
  p2CheckedInAt?: string | null;
  nextMatchId: string | null;
  nextMatchSlot: 1 | 2 | null;
  loserNextMatchId: string | null;
  loserNextMatchSlot: 1 | 2 | null;
  updatedAt: string;
  player1: MatchPlayerInfo | null;
  player2: MatchPlayerInfo | null;
  tournamentTitle?: string;
  tournamentSlug?: string;
}

export interface GroupStandingRow {
  userId: string;
  nickname: string;
  city: string;
  platform: PlatformType;
  eaId: string;
  avatarColor: string;
  seedPot: number | null;
  club: Club | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  rank: number;
  qualifies: boolean;
}

export interface EaComplianceSummary {
  calendarYear: number;
  totalPrizeUah: number;
  totalPrizeUsd: number;
  limitUsd: number;
  limitUah: number;
  remainingUsd: number;
  remainingUah: number;
  usagePercent: number;
  exchangeRateUahPerUsd: number;
  maxEntryFeeUsd: number;
  maxEntryFeeUah: number;
  isCompliant: boolean;
  tournamentsCount: number;
}

export interface PlayerTournamentParticipation {
  participantId: string;
  tournamentId: string;
  tournamentSlug: string;
  tournamentTitle: string;
  tournamentSubtitle: string;
  cupType: CupType;
  gameMode: GameMode;
  status: TournamentStatus;
  prizePoolUah: number;
  monthLabel: string;
  startDate: string;
  seedPot: number | null;
  groupName: string | null;
  club: Club | null;
  isChampion: boolean;
}

export interface PlayerProfileData {
  user: User;
  nationalRank: number;
  totalRankedPlayers: number;
  participations: PlayerTournamentParticipation[];
  matches: Match[];
}

