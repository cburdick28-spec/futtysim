"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { t } from "@/i18n";
import { supabase } from "@/lib/supabase";
import type { Club } from "@/types";

export default function HomePage() {
  const { lang, setLang, setMode, setDifficulty, difficulty, mode, selectedClub, setSelectedClub, cheats, setCheat, squad, setSquad } = useGameStore();
  const [screen, setScreen] = useState<"menu" | "solo_settings" | "solo_clubs" | "solo_game" | "create_multi" | "join_multi" | "auth">("menu");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState("");

  // Load clubs when entering club selection
  useEffect(() => {
    if (screen === "solo_clubs" && clubs.length === 0) {
      setLoading(true);
      supabase!.from("clubs").select("*").limit(100).then(({ data }) => {
        if (data) setClubs(data as Club[]);
        setLoading(false);
      });
    }
  }, [screen, clubs.length]);

  const handleLogin = async () => {
    setAuthError("");
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) { setAuthError(error.message); return; }
    const { data: profile } = await supabase!.from("profiles").select("*").eq("id", (await supabase!.auth.getUser()).data.user?.id).single();
    if (profile) {
      useGameStore.setState({ isLoggedIn: true, username: (profile as any).username, userId: (profile as any).id, lang: (profile as any).language_pref || "en" });
    }
    setScreen("menu");
  };

  const handleSignup = async () => {
    setAuthError("");
    const { error } = await supabase!.auth.signUp({ email, password, options: { data: { username, display_name: username } } });
    if (error) { setAuthError(error.message); return; }
    setScreen("menu");
  };

  // Select club and start solo game
  const startSoloGame = (club: Club) => {
    setSelectedClub(club);
    setLoading(true);
    supabase!.from("players").select("*").eq("club_id", club.id).order("pace", { ascending: false }).limit(23).then(({ data }) => {
      if (data) setSquad(data as any[]);
      setLoading(false);
      setScreen("solo_game");
    });
  };

  // === MENU ===
  if (screen === "menu") return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-5xl font-bold text-accent mb-4">⚽ {t("menu.title", lang)}</h1>
      <button onClick={() => setScreen("solo_settings")} className="btn-primary w-72 text-lg">
        🎮 {t("menu.create_solo", lang)}
      </button>
      <button onClick={() => { setMode("multiplayer"); setScreen("create_multi"); }} className="btn-primary w-72 text-lg">
        🌐 {t("menu.create_multi", lang)}
      </button>
      <button onClick={() => { setMode("multiplayer"); setScreen("join_multi"); }} className="btn-secondary w-72 text-lg">
        🔗 {t("menu.join_multi", lang)}
      </button>
      <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="btn-secondary w-72">
        🌐 {t("menu.language", lang)}: {lang.toUpperCase()}
      </button>
    </div>
  );

  // === SOLO SETTINGS ===
  if (screen === "solo_settings") {
    const diffs: Array<"easy" | "normal" | "hard" | "legendary"> = ["easy", "normal", "hard", "legendary"];
    const cheatOpts = [
      { key: "infinite_money", label: { en: "Infinite Money", es: "Dinero Infinito" } },
      { key: "edit_players", label: { en: "Edit Player Attributes", es: "Editar Atributos" } },
      { key: "instant_sim", label: { en: "Instant Simulation", es: "Simulación Instantánea" } },
      { key: "transfer_control", label: { en: "Full Transfer Control", es: "Control Total de Transferencias" } },
    ];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8">
        <h2 className="text-3xl font-bold">{t("menu.create_solo", lang)}</h2>
        <p className="text-secondary">{t("solo.select_club", lang)}</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {diffs.map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={difficulty === d ? "btn-primary" : "btn-secondary"}>
              {t(`solo.${d}`, lang)}
            </button>
          ))}
        </div>
        <h3 className="text-xl mt-4 text-accent">🛠️ Cheats</h3>
        {cheatOpts.map(c => (
          <label key={c.key} className="flex gap-3 items-center cursor-pointer">
            <input type="checkbox" checked={!!cheats[c.key]} onChange={e => setCheat(c.key, e.target.checked)}
              className="w-4 h-4 accent-blue-500" />
            <span className="text-secondary">{c.label[lang]}</span>
          </label>
        ))}
        <div className="flex gap-3 mt-6">
          <button onClick={() => { setMode("solo"); setScreen("solo_clubs"); }} className="btn-primary text-lg">
            {t("common.start", lang)}
          </button>
          <button onClick={() => setScreen("menu")} className="btn-secondary">{t("common.back", lang)}</button>
        </div>
      </div>
    );
  }

  // === CLUB SELECTION ===
  if (screen === "solo_clubs") return (
    <div className="flex flex-col items-center min-h-screen gap-4 p-8">
      <h2 className="text-2xl font-bold">{t("solo.select_club", lang)}</h2>
      {loading ? <p className="text-secondary">{t("common.loading", lang)}</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl">
          {clubs.map(club => (
            <button key={club.id} onClick={() => startSoloGame(club)}
              className="bg-card hover:bg-hover border border-subtle rounded-lg p-4 text-left transition">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: club.colors }} />
                <span className="font-bold">{club.name}</span>
              </div>
              <div className="text-xs text-secondary mt-1">
                {club.stadium} · ⭐ {club.reputation} · 💰 {(club.budget / 1000000).toFixed(0)}M
              </div>
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setScreen("solo_settings")} className="btn-secondary mt-4">{t("common.back", lang)}</button>
    </div>
  );

  // === SOLO GAME DASHBOARD ===
  if (screen === "solo_game" && selectedClub) return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-6">
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 rounded-full" style={{ background: selectedClub.colors }} />
        <h1 className="text-3xl font-bold">{selectedClub.name}</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
        <StatCard label={{ en: "Budget", es: "Presupuesto" }} value={`$${(selectedClub.budget / 1000000).toFixed(0)}M`} lang={lang} />
        <StatCard label={{ en: "Reputation", es: "Reputación" }} value={`⭐ ${selectedClub.reputation}`} lang={lang} />
        <StatCard label={{ en: "Stadium", es: "Estadio" }} value={selectedClub.stadium} lang={lang} />
        <StatCard label={{ en: "Squad Size", es: "Plantilla" }} value={`${squad.length}`} lang={lang} />
      </div>
      {cheats.infinite_money && (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg px-4 py-2 text-yellow-400 text-sm">
          ⚠️ {lang === "en" ? "INFINITE MONEY ACTIVE" : "DINERO INFINITO ACTIVO"}
        </div>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        <button className="btn-primary" onClick={() => alert(lang === "en" ? "Squad view coming soon!" : "¡Vista de plantilla próximamente!")}>
          👥 {t("solo.squad", lang)} ({squad.length})
        </button>
        <button className="btn-primary" onClick={() => alert(lang === "en" ? "Match engine coming!" : "¡Motor de partidos próximamente!")}>
          ⚽ {t("solo.play_match", lang)}
        </button>
        <button className="btn-secondary" onClick={() => alert(cheats.instant_sim ? (lang === "en" ? "INSTANT SIM: Season skipped!" : "SIM INSTANTÁNEA: ¡Temporada saltada!") : (lang === "en" ? "Season simulation coming!" : "¡Simulación próximamente!"))}>
          ⏩ {t("solo.sim_season", lang)}
        </button>
      </div>
      {cheats.edit_players && (
        <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-3 mt-4">
          <p className="text-purple-400 text-sm font-bold">{lang === "en" ? "🔧 PLAYER EDITOR UNLOCKED" : "🔧 EDITOR DE JUGADORES DESBLOQUEADO"}</p>
          <p className="text-xs text-secondary mt-1">{lang === "en" ? "Click any player to edit attributes." : "Haz clic en cualquier jugador para editar atributos."}</p>
        </div>
      )}
      <button onClick={() => { setSelectedClub(null); setSquad([]); setScreen("menu"); }} className="btn-secondary mt-6">
        {t("common.back", lang)}
      </button>
    </div>
  );

  // === CREATE MULTIPLAYER ===
  if (screen === "create_multi") return <CreateMulti onBack={() => setScreen("menu")} lang={lang} difficulty={difficulty} setDifficulty={setDifficulty} />;

  // === JOIN MULTIPLAYER ===
  if (screen === "join_multi") return <JoinMulti onBack={() => setScreen("menu")} lang={lang} />;

  // === AUTH ===
  if (screen === "auth") return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h2 className="text-2xl font-bold">{t("auth.login", lang)} / {t("auth.signup", lang)}</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="bg-card border border-subtle rounded-lg px-4 py-3 text-primary w-64" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder={t("auth.password", lang)} type="password" className="bg-card border border-subtle rounded-lg px-4 py-3 text-primary w-64" />
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder={t("auth.username", lang)} className="bg-card border border-subtle rounded-lg px-4 py-3 text-primary w-64" />
      {authError && <p className="text-danger text-sm">{authError}</p>}
      <div className="flex gap-3">
        <button onClick={handleLogin} className="btn-primary">{t("auth.login", lang)}</button>
        <button onClick={handleSignup} className="btn-secondary">{t("auth.signup", lang)}</button>
      </div>
      <button onClick={() => setScreen("menu")} className="btn-secondary mt-4">{t("common.back", lang)}</button>
    </div>
  );

  return null;
}

function StatCard({ label, value, lang }: { label: { en: string; es: string }; value: string; lang: "en" | "es" }) {
  return (
    <div className="bg-card border border-subtle rounded-lg p-4 text-center">
      <div className="text-xs text-secondary">{label[lang]}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function CreateMulti({ onBack, lang, difficulty, setDifficulty }: { onBack: () => void; lang: "en" | "es"; difficulty: string; setDifficulty: (d: any) => void }) {
  const diffs: Array<"easy" | "normal" | "hard" | "legendary"> = ["easy", "normal", "hard", "legendary"];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8">
      <h2 className="text-3xl font-bold">{t("multi.host", lang)}</h2>
      <p className="text-secondary">{lang === "en" ? "No cheats available in multiplayer." : "Sin trucos en multijugador."}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {diffs.map(d => (
          <button key={d} onClick={() => setDifficulty(d)} className={difficulty === d ? "btn-primary" : "btn-secondary"}>
            {t(`solo.${d}`, lang)}
          </button>
        ))}
      </div>
      <button className="btn-primary mt-4">{t("common.start", lang)}</button>
      <button onClick={onBack} className="btn-secondary">{t("common.back", lang)}</button>
    </div>
  );
}

function JoinMulti({ onBack, lang }: { onBack: () => void; lang: "en" | "es" }) {
  const [code, setCode] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8">
      <h2 className="text-3xl font-bold">{t("multi.join", lang)}</h2>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder={t("multi.invite", lang)}
        className="bg-card border border-subtle rounded-lg px-4 py-3 text-primary w-64 text-center text-lg" />
      <button className="btn-primary" disabled={code.length < 4}>{t("multi.join", lang)}</button>
      <button onClick={onBack} className="btn-secondary">{t("common.back", lang)}</button>
    </div>
  );
}
