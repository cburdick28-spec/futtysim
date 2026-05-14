import type { InternationalOffer, NationalTeam, Profile } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface FormInput {
  last10Wins: number;
  clubTrophies: number;
  reputationDelta: number;
}

export function generateInternationalOffers(params: {
  profile: Profile;
  nationalTeams: NationalTeam[];
  form: FormInput;
}): InternationalOffer[] {
  const { profile, nationalTeams, form } = params;
  const score = profile.reputation + form.last10Wins * 3 + form.clubTrophies * 8 + form.reputationDelta;

  return nationalTeams
    .filter((team) => score >= requiredReputation(team.reputation))
    .slice(0, 3)
    .map((team) => ({
      id: uuidv4(),
      user_id: profile.id,
      national_team_id: team.id,
      offer_status: "pending",
      salary: 30000 + team.reputation * 1200,
    }));
}

function requiredReputation(teamReputation: number): number {
  if (teamReputation >= 88) return 86;
  if (teamReputation >= 82) return 74;
  return 60;
}
