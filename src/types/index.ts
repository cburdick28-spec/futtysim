export type Language = "en" | "es";
export type GameMode = "solo" | "multiplayer";
export type Difficulty = "easy" | "normal" | "hard" | "legendary";
export type PlayerPosition = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "LM" | "RM" | "LW" | "RW" | "ST" | "CF";

export type MatchStatus = "scheduled" | "live" | "finished";
export type TransferStatus = "pending" | "negotiating" | "accepted" | "rejected" | "completed" | "cancelled";
export type LobbyStatus = "waiting" | "ready" | "in_progress" | "finished";
export type OfferStatus = "pending" | "accepted" | "rejected" | "expired";

export type SoloCheatKey = "infinite_money" | "edit_players" | "instant_sim" | "transfer_control";
export interface Profile {
  id: string;
  username: string;
  language_pref: Language;
  reputation: number;
  is_admin: boolean;
}

export interface League {
  id: string;
  name: string;
  country: string;
  tier: number;
  max_teams: number;
  reputation: number;
}

export interface Club {
  id: string;
  name: string;
  short_name: string;
  league_id: string;
  stadium: string;
  budget: number;
  reputation: number;
  founded: number;
  colors: string;
  is_ai: boolean;
  manager_id?: string | null;
}

export interface NationalTeam {
  id: string;
  name: string;
  country: string;
  fifa_rank: number;
  reputation: number;
  manager_id: string | null;
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  age: number;
  position: PlayerPosition;
  club_id: string | null;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  potential: number;
  morale: number;
  fitness: number;
  form: number;
  value: number;
  wage: number;
  contract_until: number | null;
  is_injured: boolean;
  injury_weeks: number;
  is_suspended: boolean;
  goals: number;
  assists: number;
  appearances: number;
}

export interface Manager {
  id: string;
  name: string;
  nationality: string;
  reputation: number;
  experience: number;
  salary: number;
  contract_length: number;
  team_type: "club" | "national";
  team_id: string | null;
  is_ai: boolean;
}

export interface Match {
  id: string;
  season_id: string;
  matchday: number;
  home_club_id: string;
  away_club_id: string;
  home_score: number | null;
  away_score: number | null;
  home_xg: number;
  away_xg: number;
  home_possession: number;
  away_possession: number;
  status: MatchStatus;
}

export interface Standing {
  id: string;
  season_id: string;
  club_id: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goals_diff: number;
  points: number;
}

export interface Transfer {
  id: string;
  player_id: string;
  from_club_id: string;
  to_club_id: string;
  fee: number;
  is_loan: boolean;
  status: TransferStatus;
  season_id: string;
}

export interface MultiplayerLobby {
  id: string;
  invite_code: string;
  host_user_id: string;
  league_name: string;
  difficulty: Difficulty;
  max_players: number;
  status: LobbyStatus;
  available_team_ids: string[];
  rules: string;
  season_id: string | null;
}

export interface MultiplayerPlayer {
  id: string;
  lobby_id: string;
  user_id: string;
  club_id: string;
  is_ready: boolean;
}

export interface InternationalOffer {
  id: string;
  user_id: string;
  national_team_id: string;
  offer_status: OfferStatus;
  salary: number;
  created_at?: string;
}

export interface MatchEvent {
  minute: number;
  text: string;
  type: "goal" | "yellow" | "red" | "injury" | "commentary";
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  homeXg: number;
  awayXg: number;
  homePossession: number;
  awayPossession: number;
  homeCards: number;
  awayCards: number;
  injuries: number;
  events: MatchEvent[];
}
