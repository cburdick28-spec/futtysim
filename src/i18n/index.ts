import type { Language } from "@/types";

type Dict = Record<string, Record<Language, string>>;

const translations: Dict = {
  "app.title": { en: "Pocket Manager Online", es: "Pocket Manager Online" },
  "menu.create_solo": { en: "Create Solo Game", es: "Crear Partida Individual" },
  "menu.create_multi": { en: "Create Multiplayer", es: "Crear Multijugador" },
  "menu.join_multi": { en: "Join Multiplayer", es: "Unirse a Multijugador" },
  "menu.language": { en: "Language Select", es: "Seleccionar Idioma" },

  "common.back": { en: "Back", es: "Volver" },
  "common.start": { en: "Start" , es: "Comenzar" },
  "common.save": { en: "Save", es: "Guardar" },
  "common.loading": { en: "Loading...", es: "Cargando..." },
  "common.logout": { en: "Logout", es: "Cerrar sesión" },
  "common.ready": { en: "Ready", es: "Listo" },
  "common.not_ready": { en: "Not Ready", es: "No listo" },

  "auth.login": { en: "Login", es: "Iniciar sesión" },
  "auth.signup": { en: "Sign up", es: "Registrarse" },
  "auth.username": { en: "Username", es: "Usuario" },
  "auth.password": { en: "Password", es: "Contraseña" },
  "auth.open": { en: "Account", es: "Cuenta" },

  "difficulty.easy": { en: "Easy", es: "Fácil" },
  "difficulty.normal": { en: "Normal", es: "Normal" },
  "difficulty.hard": { en: "Hard", es: "Difícil" },
  "difficulty.legendary": { en: "Legendary", es: "Legendario" },

  "solo.title": { en: "Solo Career Setup", es: "Configuración de Carrera Individual" },
  "solo.select_club": { en: "Select Club", es: "Seleccionar Club" },
  "solo.select_national": { en: "National Team (if offered)", es: "Selección Nacional (si hay oferta)" },
  "solo.cheats": { en: "Solo Sandbox Cheats", es: "Trucos de Sandbox Individual" },
  "solo.infinite_money": { en: "Infinite money", es: "Dinero infinito" },
  "solo.edit_players": { en: "Edit player attributes", es: "Editar atributos de jugadores" },
  "solo.instant_sim": { en: "Instant simulation", es: "Simulación instantánea" },
  "solo.transfer_control": { en: "Transfer control", es: "Control de transferencias" },
  "solo.dashboard": { en: "Solo Manager Dashboard", es: "Panel de Mánager Individual" },
  "solo.next_matchday": { en: "Simulate Matchday", es: "Simular Jornada" },

  "multi.host": { en: "Create Multiplayer League", es: "Crear Liga Multijugador" },
  "multi.join": { en: "Join Multiplayer League", es: "Unirse a Liga Multijugador" },
  "multi.invite": { en: "Invite code", es: "Código de invitación" },
  "multi.rules": { en: "League rules", es: "Reglas de liga" },
  "multi.available_teams": { en: "Available teams", es: "Equipos disponibles" },
  "multi.no_cheats": { en: "Cheats are disabled in multiplayer unless admin ConnorB.", es: "Los trucos están desactivados en multijugador salvo admin ConnorB." },
  "multi.waiting": { en: "Waiting room", es: "Sala de espera" },
  "multi.standings": { en: "Standings", es: "Clasificación" },
  "multi.chat": { en: "League chat", es: "Chat de liga" },

  "dashboard.club": { en: "Club", es: "Club" },
  "dashboard.national": { en: "National Team", es: "Selección Nacional" },
  "dashboard.budget": { en: "Budget", es: "Presupuesto" },
  "dashboard.reputation": { en: "Reputation", es: "Reputación" },
  "dashboard.squad": { en: "Squad", es: "Plantilla" },
  "dashboard.offers": { en: "International offers", es: "Ofertas internacionales" },
  "dashboard.no_offers": { en: "No offers right now.", es: "No hay ofertas por ahora." },

  "sim.result": { en: "Result", es: "Resultado" },
  "sim.possession": { en: "Possession", es: "Posesión" },
  "sim.xg": { en: "xG", es: "xG" },

  "error.supabase": { en: "Supabase env vars missing.", es: "Faltan variables de entorno de Supabase." },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
