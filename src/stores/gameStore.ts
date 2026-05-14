import { create } from "zustand";
import type { Language, GameMode, Difficulty, Player, Club, League } from "@/types";
interface GameState {
  lang: Language; setLang: (l: Language) => void;
  mode: GameMode | null; setMode: (m: GameMode|null) => void;
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  selectedClub: Club|null; setSelectedClub: (c: Club|null) => void;
  isLoggedIn: boolean; setLoggedIn: (v: boolean) => void;
  username: string; setUsername: (n: string) => void;
  userId: string; setUserId: (id: string) => void;
  cheats: Record<string,boolean>; setCheat: (k:string,v:boolean) => void;
  squad: Player[]; setSquad: (p: Player[]) => void;
}
export const useGameStore = create<GameState>((set) => ({
  lang: "en", setLang: (lang) => set({ lang }),
  mode: null, setMode: (mode) => set({ mode }),
  difficulty: "normal", setDifficulty: (difficulty) => set({ difficulty }),
  selectedClub: null, setSelectedClub: (selectedClub) => set({ selectedClub }),
  isLoggedIn: false, setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  username: "", setUsername: (username) => set({ username }),
  userId: "", setUserId: (userId) => set({ userId }),
  cheats: {}, setCheat: (k,v) => set((s) => ({ cheats: {...s.cheats,[k]:v} })),
  squad: [], setSquad: (squad) => set({ squad }),
}));
