import { create } from "zustand";
import type {
  Club,
  Difficulty,
  GameMode,
  InternationalOffer,
  Language,
  MultiplayerLobby,
  MultiplayerPlayer,
  NationalTeam,
  Player,
  Profile,
  SoloCheatKey,
} from "@/types";

export type Screen =
  | "menu"
  | "auth"
  | "solo_settings"
  | "solo_clubs"
  | "solo_dashboard"
  | "create_multi"
  | "join_multi"
  | "multi_lobby";

interface GameState {
  lang: Language;
  profile: Profile | null;
  mode: GameMode | null;
  screen: Screen;
  difficulty: Difficulty;

  clubs: Club[];
  nationalTeams: NationalTeam[];
  squad: Player[];
  selectedClub: Club | null;
  selectedNationalTeam: NationalTeam | null;
  internationalOffers: InternationalOffer[];

  multiplayerLobby: MultiplayerLobby | null;
  multiplayerPlayers: MultiplayerPlayer[];
  allowedClubIds: string[];

  soloCheats: Record<SoloCheatKey, boolean>;

  setLang: (lang: Language) => void;
  setProfile: (profile: Profile | null) => void;
  setMode: (mode: GameMode | null) => void;
  setScreen: (screen: Screen) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setClubs: (clubs: Club[]) => void;
  setNationalTeams: (teams: NationalTeam[]) => void;
  setSquad: (squad: Player[]) => void;
  setSelectedClub: (club: Club | null) => void;
  setSelectedNationalTeam: (team: NationalTeam | null) => void;
  setInternationalOffers: (offers: InternationalOffer[]) => void;
  setMultiplayerLobby: (lobby: MultiplayerLobby | null) => void;
  setMultiplayerPlayers: (players: MultiplayerPlayer[]) => void;
  setAllowedClubIds: (clubIds: string[]) => void;
  setSoloCheat: (key: SoloCheatKey, value: boolean) => void;
  resetSession: () => void;
}

const emptyCheats: Record<SoloCheatKey, boolean> = {
  infinite_money: false,
  edit_players: false,
  instant_sim: false,
  transfer_control: false,
};

export const useGameStore = create<GameState>((set) => ({
  lang: "en",
  profile: null,
  mode: null,
  screen: "menu",
  difficulty: "normal",

  clubs: [],
  nationalTeams: [],
  squad: [],
  selectedClub: null,
  selectedNationalTeam: null,
  internationalOffers: [],

  multiplayerLobby: null,
  multiplayerPlayers: [],
  allowedClubIds: [],

  soloCheats: emptyCheats,

  setLang: (lang) => set({ lang }),
  setProfile: (profile) => set({ profile }),
  setMode: (mode) => set({ mode }),
  setScreen: (screen) => set({ screen }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setClubs: (clubs) => set({ clubs }),
  setNationalTeams: (nationalTeams) => set({ nationalTeams }),
  setSquad: (squad) => set({ squad }),
  setSelectedClub: (selectedClub) => set({ selectedClub }),
  setSelectedNationalTeam: (selectedNationalTeam) => set({ selectedNationalTeam }),
  setInternationalOffers: (internationalOffers) => set({ internationalOffers }),
  setMultiplayerLobby: (multiplayerLobby) => set({ multiplayerLobby }),
  setMultiplayerPlayers: (multiplayerPlayers) => set({ multiplayerPlayers }),
  setAllowedClubIds: (allowedClubIds) => set({ allowedClubIds }),
  setSoloCheat: (key, value) =>
    set((state) => ({
      soloCheats: {
        ...state.soloCheats,
        [key]: value,
      },
    })),
  resetSession: () =>
    set({
      mode: null,
      screen: "menu",
      squad: [],
      selectedClub: null,
      selectedNationalTeam: null,
      internationalOffers: [],
      multiplayerLobby: null,
      multiplayerPlayers: [],
      allowedClubIds: [],
      soloCheats: emptyCheats,
    }),
}));
