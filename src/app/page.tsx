"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { t } from "@/i18n";
import { supabase } from "@/lib/supabase";
import { generateInternationalOffers } from "@/lib/game/internationalOffers";
import { simulateMatch } from "@/lib/game/matchEngine";
import { processRetirements } from "@/lib/game/managerSystem";
import { useGameStore } from "@/stores/gameStore";
import type { Club, Difficulty, InternationalOffer, MatchResult, MultiplayerLobby, MultiplayerPlayer, Player, Profile, SoloCheatKey } from "@/types";

const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard", "legendary"];
const SOLO_CHEATS: SoloCheatKey[] = ["infinite_money", "edit_players", "instant_sim", "transfer_control"];

export default function HomePage() {
  const store = useGameStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [leagueName, setLeagueName] = useState("Pocket League");
  const [rules, setRules] = useState("Transfers on, AI controls remaining teams");
  const [joinCode, setJoinCode] = useState("");
  const [joinLobby, setJoinLobby] = useState<MultiplayerLobby | null>(null);
  const [joinTeamId, setJoinTeamId] = useState("");
  const [chat, setChat] = useState<{ id: string; sender_username: string; body: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [lastResult, setLastResult] = useState<MatchResult | null>(null);

  const clubMap = useMemo(() => new Map(store.clubs.map((club) => [club.id, club])), [store.clubs]);
  const isAdmin = store.profile?.username === "ConnorB";

  useEffect(() => {
    loadAuthProfile();
    loadData();
  }, []);

  useEffect(() => {
    if (!supabase || !store.multiplayerLobby) return;
    const channel = supabase
      .channel(`lobby-${store.multiplayerLobby.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "multiplayer_players", filter: `lobby_id=eq.${store.multiplayerLobby.id}` }, () => refreshLobbyPlayers())
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `lobby_id=eq.${store.multiplayerLobby.id}` }, () => refreshLobbyChat())
      .subscribe();
    refreshLobbyPlayers();
    refreshLobbyChat();
    return () => void channel.unsubscribe();
  }, [store.multiplayerLobby?.id]);

  async function loadData() {
    if (!supabase) return;
    setLoading(true);
    const [clubRes, teamRes] = await Promise.all([
      supabase.from("clubs").select("*").order("reputation", { ascending: false }),
      supabase.from("teams").select("*").order("reputation", { ascending: false }),
    ]);
    if (clubRes.data) store.setClubs(clubRes.data as Club[]);
    if (teamRes.data) store.setNationalTeams(teamRes.data as any[]);
    setLoading(false);
  }

  async function loadAuthProfile() {
    if (!supabase) return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: profile } = await supabase.from("users").select("id,username,language_pref,reputation,is_admin").eq("id", data.user.id).single();
    if (profile) {
      store.setProfile(profile as Profile);
      store.setLang((profile as Profile).language_pref);
    }
  }

  async function auth(signup: boolean) {
    if (!supabase) return;
    setError("");
    const normalized = username.trim();
    if (!normalized || password.length < 6) return setError("Invalid credentials");
    const email = `${normalized.toLowerCase().replace(/[^a-z0-9._-]/g, "") || "user"}@pocket-manager.local`;
    if (signup) {
      const { error: signupError } = await supabase.auth.signUp({ email, password, options: { data: { username: normalized } } });
      if (signupError) return setError(signupError.message);
    }
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) return setError(loginError.message);
    await loadAuthProfile();
    store.setScreen("menu");
  }

  async function setLanguage(nextLang: "en" | "es") {
    store.setLang(nextLang);
    if (supabase && store.profile) await supabase.from("users").update({ language_pref: nextLang }).eq("id", store.profile.id);
  }

  async function startSolo(club: Club) {
    if (!supabase) return;
    store.setMode("solo");
    store.setSelectedClub(club);
    const { data } = await supabase.from("players").select("*").eq("club_id", club.id).limit(25);
    store.setSquad((data as Player[] | null) ?? []);
    if (store.profile) {
      store.setInternationalOffers(generateInternationalOffers({
        profile: store.profile,
        nationalTeams: store.nationalTeams,
        form: { last10Wins: 6, clubTrophies: 1, reputationDelta: club.reputation / 8 },
      }));
    }
    store.setScreen("solo_dashboard");
  }

  async function simulateSolo() {
    if (!supabase || !store.selectedClub) return;
    const opposition = store.clubs.filter((club) => club.id !== store.selectedClub?.id);
    if (!opposition.length) return;
    const away = opposition[Math.floor(Math.random() * opposition.length)];
    const awayPlayers = await supabase.from("players").select("*").eq("club_id", away.id).limit(25);
    const result = simulateMatch({
      homeClub: store.selectedClub,
      awayClub: away,
      homeSquad: store.squad,
      awaySquad: (awayPlayers.data as Player[] | null) ?? [],
      difficulty: store.difficulty,
      instant: store.soloCheats.instant_sim,
    });
    setLastResult(result);
    if (store.soloCheats.infinite_money) {
      const budget = store.selectedClub.budget + 20_000_000;
      await supabase.from("clubs").update({ budget }).eq("id", store.selectedClub.id);
      store.setSelectedClub({ ...store.selectedClub, budget });
    }
    if (Math.random() < 0.35) {
      const retired = processRetirements(store.squad, 2026);
      store.setSquad(retired.updatedPlayers);
      if (retired.newManagers.length) await supabase.from("managers").insert(retired.newManagers);
    }
  }

  async function createLobby() {
    if (!supabase || !store.profile || store.allowedClubIds.length < 2) return;
    const lobby: MultiplayerLobby = {
      id: uuidv4(),
      invite_code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      host_user_id: store.profile.id,
      league_name: leagueName,
      difficulty: store.difficulty,
      max_players: 20,
      status: "waiting",
      available_team_ids: store.allowedClubIds,
      rules,
      season_id: null,
    };
    const created = await supabase.from("multiplayer_lobbies").insert(lobby);
    if (created.error) return setError(created.error.message);
    await supabase.from("multiplayer_players").insert({ lobby_id: lobby.id, user_id: store.profile.id, club_id: store.allowedClubIds[0], is_ready: false });
    store.setMultiplayerLobby(lobby);
    store.setScreen("multi_lobby");
  }

  async function findLobby() {
    if (!supabase || !joinCode) return;
    const { data } = await supabase.from("multiplayer_lobbies").select("*").eq("invite_code", joinCode).single();
    if (!data) return setError("Invite code not found");
    const lobby = data as MultiplayerLobby;
    setJoinLobby(lobby);
    setJoinTeamId(lobby.available_team_ids[0] ?? "");
  }

  async function joinFoundLobby() {
    if (!supabase || !joinLobby || !store.profile || !joinTeamId) return;
    if (!joinLobby.available_team_ids.includes(joinTeamId)) return setError("Team not allowed");
    await supabase.from("multiplayer_players").insert({ lobby_id: joinLobby.id, user_id: store.profile.id, club_id: joinTeamId, is_ready: false });
    store.setMultiplayerLobby(joinLobby);
    store.setScreen("multi_lobby");
  }

  async function refreshLobbyPlayers() {
    if (!supabase || !store.multiplayerLobby) return;
    const { data } = await supabase.from("multiplayer_players").select("*").eq("lobby_id", store.multiplayerLobby.id);
    store.setMultiplayerPlayers((data as MultiplayerPlayer[] | null) ?? []);
  }

  async function refreshLobbyChat() {
    if (!supabase || !store.multiplayerLobby) return;
    const { data } = await supabase.from("messages").select("id,sender_username,body").eq("lobby_id", store.multiplayerLobby.id).order("created_at");
    setChat((data as { id: string; sender_username: string; body: string }[] | null) ?? []);
  }

  async function toggleReady() {
    if (!supabase || !store.profile || !store.multiplayerLobby) return;
    const me = store.multiplayerPlayers.find((p) => p.user_id === store.profile?.id);
    if (!me) return;
    await supabase.from("multiplayer_players").update({ is_ready: !me.is_ready }).eq("lobby_id", store.multiplayerLobby.id).eq("user_id", store.profile.id);
  }

  async function sendMessage() {
    if (!supabase || !store.profile || !store.multiplayerLobby || !chatInput.trim()) return;
    await supabase.from("messages").insert({ lobby_id: store.multiplayerLobby.id, sender_username: store.profile.username, body: chatInput.trim() });
    setChatInput("");
  }

  if (store.screen === "menu") return <MenuView store={store} error={error} isAdmin={isAdmin} setLanguage={setLanguage} loading={loading} />;
  if (store.screen === "auth") return <AuthView t={t} lang={store.lang} username={username} password={password} error={error} setUsername={setUsername} setPassword={setPassword} onLogin={() => auth(false)} onSignup={() => auth(true)} onBack={() => store.setScreen("menu")} />;
  if (store.screen === "solo_settings") return <SoloSettingsView store={store} onBack={() => store.setScreen("menu")} />;
  if (store.screen === "solo_clubs") return <SoloClubsView store={store} loading={loading} onBack={() => store.setScreen("solo_settings")} onStart={startSolo} />;
  if (store.screen === "solo_dashboard") return <SoloDashboardView store={store} result={lastResult} onBack={() => store.setScreen("menu")} onSim={simulateSolo} onAcceptOffer={(offer) => { store.setSelectedNationalTeam(store.nationalTeams.find((n) => n.id === offer.national_team_id) ?? null); store.setInternationalOffers(store.internationalOffers.filter((o) => o.id !== offer.id)); }} />;
  if (store.screen === "create_multi") return <CreateMultiView store={store} leagueName={leagueName} rules={rules} setLeagueName={setLeagueName} setRules={setRules} onCreate={createLobby} onBack={() => store.setScreen("menu")} />;
  if (store.screen === "join_multi") return <JoinMultiView store={store} joinCode={joinCode} setJoinCode={setJoinCode} joinLobby={joinLobby} joinTeamId={joinTeamId} setJoinTeamId={setJoinTeamId} onFind={findLobby} onJoin={joinFoundLobby} onBack={() => store.setScreen("menu")} />;
  if (store.screen === "multi_lobby" && store.multiplayerLobby) return <LobbyView store={store} clubMap={clubMap} chat={chat} chatInput={chatInput} setChatInput={setChatInput} onChat={sendMessage} onReady={toggleReady} onBack={() => store.setScreen("menu")} />;
  return null;
}

function MenuView({ store, error, isAdmin, setLanguage }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto max-w-4xl rounded-xl border border-slate-800 bg-secondary p-6"><h1 className="mb-6 text-3xl font-bold text-accent">{t("app.title", store.lang)}</h1><div className="grid gap-3 sm:grid-cols-2"><button className="btn-primary" onClick={() => store.setScreen("solo_settings")}>{t("menu.create_solo", store.lang)}</button><button className="btn-primary" onClick={() => store.setScreen("create_multi")}>{t("menu.create_multi", store.lang)}</button><button className="btn-secondary" onClick={() => store.setScreen("join_multi")}>{t("menu.join_multi", store.lang)}</button><button className="btn-secondary" onClick={() => setLanguage(store.lang === "en" ? "es" : "en")}>{t("menu.language", store.lang)}: {store.lang.toUpperCase()}</button></div><div className="mt-4">{store.profile ? <p>{store.profile.username} {isAdmin ? "(Admin)" : ""}</p> : <button className="btn-secondary" onClick={() => store.setScreen("auth")}>{t("auth.open", store.lang)}</button>}</div>{error && <p className="mt-2 text-danger">{error}</p>}</div></main>;
}

function AuthView({ lang, username, password, error, setUsername, setPassword, onLogin, onSignup, onBack }: any) {
  return <main className="flex min-h-screen items-center justify-center p-8"><div className="w-full max-w-md rounded-xl border border-slate-800 bg-secondary p-6"><h2 className="mb-4 text-2xl font-bold">{t("auth.open", lang)}</h2><input className="mb-2 w-full rounded border border-slate-700 bg-card px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username", lang)} /><input className="mb-2 w-full rounded border border-slate-700 bg-card px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password", lang)} />{error && <p className="mb-2 text-danger">{error}</p>}<div className="flex gap-2"><button className="btn-primary" onClick={onLogin}>{t("auth.login", lang)}</button><button className="btn-secondary" onClick={onSignup}>{t("auth.signup", lang)}</button><button className="btn-secondary" onClick={onBack}>{t("common.back", lang)}</button></div></div></main>;
}

function SoloSettingsView({ store, onBack }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto max-w-3xl rounded-xl border border-slate-800 bg-secondary p-6"><h2 className="text-2xl font-bold">{t("solo.title", store.lang)}</h2><div className="mt-4 flex gap-2">{DIFFICULTIES.map((d) => <button key={d} className={store.difficulty === d ? "btn-primary" : "btn-secondary"} onClick={() => store.setDifficulty(d)}>{t(`difficulty.${d}`, store.lang)}</button>)}</div><div className="mt-4 grid gap-2">{SOLO_CHEATS.map((key) => <label key={key} className="flex items-center justify-between rounded border border-slate-700 bg-card px-3 py-2"><span>{t(`solo.${key}`, store.lang)}</span><input type="checkbox" checked={store.soloCheats[key]} onChange={(e) => store.setSoloCheat(key, e.target.checked)} /></label>)}</div><div className="mt-4 flex gap-2"><button className="btn-primary" onClick={() => store.setScreen("solo_clubs")}>{t("common.start", store.lang)}</button><button className="btn-secondary" onClick={onBack}>{t("common.back", store.lang)}</button></div></div></main>;
}

function SoloClubsView({ store, loading, onBack, onStart }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto max-w-6xl"><h2 className="mb-4 text-2xl font-bold">{t("solo.select_club", store.lang)}</h2>{loading ? <p>{t("common.loading", store.lang)}</p> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{store.clubs.map((club: Club) => <button key={club.id} className="rounded-lg border border-slate-800 bg-card p-4 text-left hover:bg-hover" onClick={() => onStart(club)}><p className="font-semibold">{club.name}</p><p className="mt-1 text-sm text-secondary">{club.stadium} · {club.reputation}</p></button>)}</div>}<button className="btn-secondary mt-4" onClick={onBack}>{t("common.back", store.lang)}</button></div></main>;
}

function SoloDashboardView({ store, result, onBack, onSim, onAcceptOffer }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto max-w-6xl rounded-xl border border-slate-800 bg-secondary p-6"><h2 className="text-2xl font-bold">{store.selectedClub?.name}</h2><p className="text-secondary">{t("dashboard.national", store.lang)}: {store.selectedNationalTeam?.name ?? "-"}</p><div className="mt-4 flex gap-2"><button className="btn-primary" onClick={onSim}>{t("solo.next_matchday", store.lang)}</button><button className="btn-secondary" onClick={onBack}>{t("common.back", store.lang)}</button></div>{result && <div className="mt-4 rounded border border-slate-700 bg-card p-3"><p>{t("sim.result", store.lang)}: {result.homeGoals} - {result.awayGoals}</p><p>{t("sim.xg", store.lang)}: {result.homeXg} / {result.awayXg}</p></div>}<div className="mt-4"><h3 className="font-semibold">{t("dashboard.offers", store.lang)}</h3>{store.internationalOffers.map((offer: InternationalOffer) => <button key={offer.id} className="btn-secondary mt-2 block" onClick={() => onAcceptOffer(offer)}>{offer.national_team_id} ${Math.round(offer.salary / 1000)}k</button>)}</div></div></main>;
}

function CreateMultiView({ store, leagueName, rules, setLeagueName, setRules, onCreate, onBack }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto max-w-4xl rounded-xl border border-slate-800 bg-secondary p-6"><h2 className="text-2xl font-bold">{t("multi.host", store.lang)}</h2><div className="mt-4 grid gap-2 sm:grid-cols-2"><input className="rounded border border-slate-700 bg-card px-3 py-2" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} /><select className="rounded border border-slate-700 bg-card px-3 py-2" value={store.difficulty} onChange={(e) => store.setDifficulty(e.target.value as Difficulty)}>{DIFFICULTIES.map((d) => <option key={d} value={d}>{t(`difficulty.${d}`, store.lang)}</option>)}</select></div><textarea className="mt-2 w-full rounded border border-slate-700 bg-card px-3 py-2" rows={2} value={rules} onChange={(e) => setRules(e.target.value)} /><div className="mt-3 grid max-h-64 gap-2 overflow-auto sm:grid-cols-2">{store.clubs.slice(0, 40).map((club: Club) => <label key={club.id} className="flex items-center justify-between rounded border border-slate-700 bg-card px-3 py-2"><span>{club.name}</span><input type="checkbox" checked={store.allowedClubIds.includes(club.id)} onChange={(e) => e.target.checked ? store.setAllowedClubIds([...store.allowedClubIds, club.id]) : store.setAllowedClubIds(store.allowedClubIds.filter((id: string) => id !== club.id))} /></label>)}</div><div className="mt-4 flex gap-2"><button className="btn-primary" onClick={onCreate}>{t("common.start", store.lang)}</button><button className="btn-secondary" onClick={onBack}>{t("common.back", store.lang)}</button></div></div></main>;
}

function JoinMultiView({ store, joinCode, setJoinCode, joinLobby, joinTeamId, setJoinTeamId, onFind, onJoin, onBack }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-secondary p-6"><h2 className="text-2xl font-bold">{t("multi.join", store.lang)}</h2><div className="mt-4 flex gap-2"><input className="w-full rounded border border-slate-700 bg-card px-3 py-2" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder={t("multi.invite", store.lang)} /><button className="btn-primary" onClick={onFind}>{t("multi.join", store.lang)}</button></div>{joinLobby && <div className="mt-4 rounded border border-slate-700 bg-card p-3"><p>{joinLobby.league_name}</p><select className="mt-2 w-full rounded border border-slate-700 bg-secondary px-3 py-2" value={joinTeamId} onChange={(e) => setJoinTeamId(e.target.value)}>{joinLobby.available_team_ids.map((id: string) => <option key={id} value={id}>{store.clubs.find((c: Club) => c.id === id)?.name ?? id}</option>)}</select><button className="btn-primary mt-2" onClick={onJoin}>{t("common.start", store.lang)}</button></div>}<button className="btn-secondary mt-3" onClick={onBack}>{t("common.back", store.lang)}</button></div></main>;
}

function LobbyView({ store, clubMap, chat, chatInput, setChatInput, onChat, onReady, onBack }: any) {
  return <main className="min-h-screen p-8"><div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.4fr_1fr]"><section className="rounded-xl border border-slate-800 bg-secondary p-6"><h2 className="text-2xl font-bold">{store.multiplayerLobby.league_name}</h2><p className="text-secondary">{t("multi.invite", store.lang)}: {store.multiplayerLobby.invite_code}</p><div className="mt-4 space-y-2">{store.multiplayerPlayers.map((p: MultiplayerPlayer) => <div key={p.id} className="flex items-center justify-between rounded border border-slate-700 bg-card px-3 py-2"><span>{clubMap.get(p.club_id)?.name ?? p.club_id}</span><span className={p.is_ready ? "text-green-400" : "text-secondary"}>{p.is_ready ? t("common.ready", store.lang) : t("common.not_ready", store.lang)}</span></div>)}</div><div className="mt-4 flex gap-2"><button className="btn-primary" onClick={onReady}>{t("common.ready", store.lang)}</button><button className="btn-secondary" onClick={onBack}>{t("common.back", store.lang)}</button></div></section><aside className="rounded-xl border border-slate-800 bg-secondary p-6"><h3 className="font-semibold">{t("multi.chat", store.lang)}</h3><div className="mt-2 h-72 overflow-auto rounded border border-slate-700 bg-card p-2">{chat.map((m: any) => <p key={m.id}><span className="text-accent">{m.sender_username}:</span> {m.body}</p>)}</div><div className="mt-2 flex gap-2"><input className="w-full rounded border border-slate-700 bg-card px-3 py-2" value={chatInput} onChange={(e) => setChatInput(e.target.value)} /><button className="btn-primary" onClick={onChat}>{t("common.save", store.lang)}</button></div></aside></div></main>;
}
