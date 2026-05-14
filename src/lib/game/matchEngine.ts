import type { Club, Difficulty, MatchResult, Player } from "@/types";

const DIFFICULTY_FACTOR: Record<Difficulty, number> = {
  easy: 0.9,
  normal: 1,
  hard: 1.12,
  legendary: 1.2,
};

function avgRating(players: Player[]): number {
  if (!players.length) return 60;
  const total = players.reduce((sum, p) => sum + (p.pace + p.shooting + p.passing + p.dribbling + p.defending + p.physical) / 6, 0);
  return total / players.length;
}

export function simulateMatch(params: {
  homeClub: Club;
  awayClub: Club;
  homeSquad: Player[];
  awaySquad: Player[];
  difficulty: Difficulty;
  instant: boolean;
}): MatchResult {
  const { homeClub, awayClub, homeSquad, awaySquad, difficulty, instant } = params;
  const homeStrength = avgRating(homeSquad) + homeClub.reputation * 0.3 + 4;
  const awayStrength = avgRating(awaySquad) + awayClub.reputation * 0.3;

  const factor = DIFFICULTY_FACTOR[difficulty];
  const balance = Math.max(0.4, Math.min(1.7, (homeStrength / Math.max(1, awayStrength)) / factor));

  const homeXg = Math.max(0.2, 1.1 * balance + Math.random() * 1.8);
  const awayXg = Math.max(0.2, 1.1 / balance + Math.random() * 1.5);
  const homeGoals = Math.round(Math.max(0, homeXg + (Math.random() - 0.45)));
  const awayGoals = Math.round(Math.max(0, awayXg + (Math.random() - 0.45)));

  const homePossession = Math.round(Math.max(35, Math.min(65, 50 + (homeStrength - awayStrength) * 0.2 + (Math.random() * 8 - 4))));
  const awayPossession = 100 - homePossession;

  const homeCards = Math.floor(Math.random() * 4);
  const awayCards = Math.floor(Math.random() * 4);
  const injuries = Math.random() < 0.18 ? 1 : 0;

  const events = instant
    ? [{ minute: 90, text: `${homeClub.name} ${homeGoals}-${awayGoals} ${awayClub.name}`, type: "commentary" as const }]
    : buildEvents(homeClub.name, awayClub.name, homeGoals, awayGoals, homeCards, awayCards, injuries);

  return {
    homeGoals,
    awayGoals,
    homeXg: Number(homeXg.toFixed(2)),
    awayXg: Number(awayXg.toFixed(2)),
    homePossession,
    awayPossession,
    homeCards,
    awayCards,
    injuries,
    events,
  };
}

function buildEvents(
  homeName: string,
  awayName: string,
  homeGoals: number,
  awayGoals: number,
  homeCards: number,
  awayCards: number,
  injuries: number,
) {
  const events: MatchResult["events"] = [];
  for (let i = 0; i < homeGoals; i += 1) {
    events.push({ minute: randomMinute(), text: `${homeName} scores a goal.`, type: "goal" });
  }
  for (let i = 0; i < awayGoals; i += 1) {
    events.push({ minute: randomMinute(), text: `${awayName} scores a goal.`, type: "goal" });
  }
  for (let i = 0; i < homeCards + awayCards; i += 1) {
    events.push({ minute: randomMinute(), text: "Referee shows a yellow card.", type: "yellow" });
  }
  for (let i = 0; i < injuries; i += 1) {
    events.push({ minute: randomMinute(), text: "Player receives an injury.", type: "injury" });
  }
  events.sort((a, b) => a.minute - b.minute);
  return events;
}

function randomMinute(): number {
  return Math.floor(Math.random() * 90) + 1;
}
