import type { Club, Standing, Transfer } from "@/types";
import { v4 as uuidv4 } from "uuid";

export function initStandings(seasonId: string, clubs: Club[]): Standing[] {
  return clubs.map((club) => ({
    id: uuidv4(),
    season_id: seasonId,
    club_id: club.id,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals_for: 0,
    goals_against: 0,
    goals_diff: 0,
    points: 0,
  }));
}

export function applyMatchToStandings(
  standings: Standing[],
  homeClubId: string,
  awayClubId: string,
  homeGoals: number,
  awayGoals: number,
): Standing[] {
  return standings.map((row) => {
    if (row.club_id !== homeClubId && row.club_id !== awayClubId) return row;

    const isHome = row.club_id === homeClubId;
    const goalsFor = isHome ? homeGoals : awayGoals;
    const goalsAgainst = isHome ? awayGoals : homeGoals;

    const win = goalsFor > goalsAgainst ? 1 : 0;
    const draw = goalsFor === goalsAgainst ? 1 : 0;
    const loss = goalsFor < goalsAgainst ? 1 : 0;

    return {
      ...row,
      played: row.played + 1,
      wins: row.wins + win,
      draws: row.draws + draw,
      losses: row.losses + loss,
      goals_for: row.goals_for + goalsFor,
      goals_against: row.goals_against + goalsAgainst,
      goals_diff: row.goals_diff + (goalsFor - goalsAgainst),
      points: row.points + win * 3 + draw,
    };
  });
}

export function sortStandings(standings: Standing[]): Standing[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goals_diff !== a.goals_diff) return b.goals_diff - a.goals_diff;
    return b.goals_for - a.goals_for;
  });
}

export function generateAiTransferWindow(clubs: Club[], seasonId: string): Transfer[] {
  const outputs: Transfer[] = [];
  for (let i = 0; i < Math.min(10, clubs.length); i += 1) {
    const fromClub = clubs[Math.floor(Math.random() * clubs.length)];
    let toClub = clubs[Math.floor(Math.random() * clubs.length)];
    if (fromClub.id === toClub.id) {
      toClub = clubs[(clubs.indexOf(fromClub) + 1) % clubs.length];
    }
    outputs.push({
      id: uuidv4(),
      player_id: uuidv4(),
      from_club_id: fromClub.id,
      to_club_id: toClub.id,
      fee: Math.round(1_500_000 + Math.random() * 48_000_000),
      is_loan: Math.random() < 0.2,
      status: "completed",
      season_id: seasonId,
    });
  }
  return outputs;
}
