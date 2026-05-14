export type Language = "en" | "es";
export type GameMode = "solo" | "multiplayer";
export type Difficulty = "easy" | "normal" | "hard" | "legendary";
export type PlayerPosition = "GK"|"CB"|"LB"|"RB"|"CDM"|"CM"|"CAM"|"LM"|"RM"|"LW"|"RW"|"ST"|"CF";
export type PlayingStyle = "possession"|"counter_attack"|"high_press"|"park_bus"|"balanced"|"tiki_taka"|"direct";
export type Mentality = "very_defensive"|"defensive"|"balanced"|"attacking"|"very_attacking";
export type MatchStatus = "scheduled"|"live"|"finished";
export type TransferStatus = "pending"|"negotiating"|"accepted"|"rejected"|"completed"|"cancelled";
export type LobbyStatus = "waiting"|"ready"|"in_progress"|"finished";
export type OfferStatus = "pending"|"accepted"|"rejected"|"expired";
export type NotifType = "transfer_offer"|"contract_expiring"|"injury"|"international_offer"|"match_result"|"league_update"|"lobby_invite"|"system";
export interface Profile{id:string;username:string;display_name:string|null;avatar_url:string|null;reputation:number;language_pref:Language;is_admin:boolean}
export interface League{id:string;name:string;country:string;tier:number;max_teams:number;reputation:number}
export interface Club{id:string;name:string;short_name:string;league_id:string;stadium:string;budget:number;reputation:number;founded:number;colors:string;is_ai:boolean}
export interface Player{id:string;first_name:string;last_name:string;nationality:string;age:number;position:PlayerPosition;club_id:string|null;pace:number;shooting:number;passing:number;dribbling:number;defending:number;physical:number;potential:number;form:number;morale:number;fitness:number;value:number;wage:number;contract_until:number|null;is_injured:boolean;injury_type:string|null;injury_weeks:number;is_suspended:boolean;goals:number;assists:number;appearances:number}
export interface Match{id:string;season_id:string;matchday:number;home_club_id:string;away_club_id:string;home_score:number|null;away_score:number|null;home_xg:number;away_xg:number;home_possession:number;away_possession:number;status:MatchStatus}
export interface MatchEvent{id:string;match_id:string;minute:number;event_type:string;player_id:string;club_id:string;description:string}
export interface Transfer{id:string;player_id:string;from_club_id:string;to_club_id:string;fee:number;is_loan:boolean;status:TransferStatus}
export interface Tactics{id:string;user_id:string;club_id:string;formation:string;playing_style:PlayingStyle;mentality:Mentality;tempo:number;pressing:number;defensive_line:number}
export interface Manager{id:string;name:string;nationality:string;reputation:number;experience:number;preferred_formation:string;playing_style:string;is_ai:boolean}
export interface NationalTeam{id:string;name:string;country:string;fifa_rank:number;reputation:number;manager_id:string|null}
export interface Season{id:string;league_id:string;season_number:number;year:number;is_active:boolean;matchday:number;total_matchdays:number}
export interface Standing{id:string;season_id:string;club_id:string;played:number;wins:number;draws:number;losses:number;goals_for:number;goals_against:number;goals_diff:number;points:number}
export interface MultiplayerLobby{id:string;invite_code:string;host_user_id:string;league_name:string;difficulty:Difficulty;max_players:number;status:LobbyStatus}
export interface MultiplayerPlayer{id:string;lobby_id:string;user_id:string;club_id:string;is_ready:boolean}
export interface Notification{id:string;type:NotifType;title:string;body:string|null;is_read:boolean}
export interface Save{id:string;name:string;mode:GameMode;club_id:string|null;season_id:string|null;cheats_enabled:Record<string,boolean>}
