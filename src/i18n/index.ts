export type Lang = "en" | "es";

const translations: Record<string, Record<string, string>> = {
  "menu.title": { en: "FootySim", es: "FootySim" },
  "menu.create_solo": { en: "Create Solo Game", es: "Crear Partida Individual" },
  "menu.create_multi": { en: "Create Multiplayer", es: "Crear Multijugador" },
  "menu.join_multi": { en: "Join Multiplayer", es: "Unirse a Multijugador" },
  "menu.language": { en: "Language", es: "Idioma" },
  "auth.login": { en: "Login", es: "Iniciar Sesión" },
  "auth.signup": { en: "Sign Up", es: "Registrarse" },
  "auth.username": { en: "Username", es: "Usuario" },
  "auth.password": { en: "Password", es: "Contraseña" },
  "solo.easy": { en: "Easy", es: "Fácil" },
  "solo.normal": { en: "Normal", es: "Normal" },
  "solo.hard": { en: "Hard", es: "Difícil" },
  "solo.legendary": { en: "Legendary", es: "Legendario" },
  "solo.select_club": { en: "Select Club", es: "Seleccionar Club" },
  "solo.squad": { en: "Squad", es: "Plantilla" },
  "solo.play_match": { en: "Play Match", es: "Jugar Partido" },
  "solo.sim_season": { en: "Sim Season", es: "Simular Temporada" },
  "multi.host": { en: "Host League", es: "Crear Liga" },
  "multi.join": { en: "Join League", es: "Unirse a Liga" },
  "multi.invite": { en: "Invite Code", es: "Código de Invitación" },
  "common.back": { en: "Back", es: "Volver" },
  "common.start": { en: "Start", es: "Comenzar" },
  "common.save": { en: "Save", es: "Guardar" },
  "common.loading": { en: "Loading...", es: "Cargando..." },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}
