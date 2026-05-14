import type { Manager, Player } from "@/types";
import { v4 as uuidv4 } from "uuid";

export function processRetirements(players: Player[], seasonYear: number): { updatedPlayers: Player[]; newManagers: Manager[] } {
  // This function is intended to run once per season rollover.
  const updatedPlayers: Player[] = [];
  const newManagers: Manager[] = [];

  for (const player of players) {
    const aged = { ...player, age: player.age + 1, contract_until: player.contract_until ? player.contract_until + 1 : null };
    const retirementRoll = aged.age >= 34 && Math.random() < retirementChance(aged.age);

    if (retirementRoll) {
      if (Math.random() <= 0.05) {
        newManagers.push({
          id: uuidv4(),
          name: `${aged.first_name} ${aged.last_name}`,
          nationality: aged.nationality,
          reputation: Math.max(50, Math.min(95, Math.round((aged.potential + aged.form) / 2))),
          experience: 1,
          salary: 40000 + Math.round(aged.value * 0.001),
          contract_length: 2,
          team_type: "club",
          team_id: null,
          is_ai: true,
        });
      }
      continue;
    }

    updatedPlayers.push(aged);
  }

  return { updatedPlayers, newManagers };
}

function retirementChance(age: number): number {
  if (age < 34) return 0;
  if (age <= 35) return 0.15;
  if (age <= 37) return 0.28;
  return 0.4;
}
