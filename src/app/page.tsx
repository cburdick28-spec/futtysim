"use client";
import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { t } from "@/i18n";

export default function HomePage() {
  const { lang, setLang, setMode, setDifficulty, difficulty } = useGameStore();
  const [screen, setScreen] = useState<"menu"|"solo"|"create_multi"|"join_multi">("menu");

  if (screen === "menu") return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-5xl font-bold text-accent mb-4">⚽ {t("menu.title", lang)}</h1>
      <button onClick={()=>{setMode("solo");setScreen("solo")}} className="btn-primary w-72 text-lg">
        {t("menu.create_solo", lang)}
      </button>
      <button onClick={()=>{setMode("multiplayer");setScreen("create_multi")}} className="btn-primary w-72 text-lg">
        {t("menu.create_multi", lang)}
      </button>
      <button onClick={()=>{setMode("multiplayer");setScreen("join_multi")}} className="btn-secondary w-72 text-lg">
        {t("menu.join_multi", lang)}
      </button>
      <button onClick={()=>setLang(lang==="en"?"es":"en")} className="btn-secondary w-72">
        🌐 {t("menu.language", lang)}: {lang.toUpperCase()}
      </button>
    </div>
  );

  if (screen === "solo") return <SoloSettings onBack={()=>setScreen("menu")} />;
  if (screen === "create_multi") return <CreateMulti onBack={()=>setScreen("menu")} />;
  if (screen === "join_multi") return <JoinMulti onBack={()=>setScreen("menu")} />;
}

function SoloSettings({ onBack }: { onBack: () => void }) {
  const { lang, difficulty, setDifficulty, cheats, setCheat } = useGameStore();
  const diffs:Array<"easy"|"normal"|"hard"|"legendary"> = ["easy","normal","hard","legendary"];
  const cheatOpts = ["infinite_money","edit_players","instant_sim","transfer_control"];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8">
      <h2 className="text-3xl font-bold">{t("menu.create_solo", lang)}</h2>
      <div className="flex gap-3 flex-wrap justify-center">
        {diffs.map(d=>(
          <button key={d} onClick={()=>setDifficulty(d)}
            className={difficulty===d?"btn-primary":"btn-secondary"}>
            {t(`solo.${d}`, lang)}
          </button>
        ))}
      </div>
      <h3 className="text-xl mt-4">Cheats</h3>
      {cheatOpts.map(c=>(
        <label key={c} className="flex gap-2 items-center">
          <input type="checkbox" checked={!!cheats[c]} onChange={e=>setCheat(c,e.target.checked)} />
          <span className="text-secondary">{c.replace(/_/g," ")}</span>
        </label>
      ))}
      <button onClick={onBack} className="btn-secondary mt-6">{t("common.back", lang)}</button>
    </div>
  );
}

function CreateMulti({ onBack }: { onBack: () => void }) {
  const { lang, difficulty, setDifficulty } = useGameStore();
  const diffs:Array<"easy"|"normal"|"hard"|"legendary"> = ["easy","normal","hard","legendary"];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8">
      <h2 className="text-3xl font-bold">{t("multi.host", lang)}</h2>
      <p className="text-secondary">No cheats available in multiplayer.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {diffs.map(d=>(
          <button key={d} onClick={()=>setDifficulty(d)}
            className={difficulty===d?"btn-primary":"btn-secondary"}>
            {t(`solo.${d}`, lang)}
          </button>
        ))}
      </div>
      <button className="btn-primary mt-4">{t("common.start", lang)}</button>
      <button onClick={onBack} className="btn-secondary">{t("common.back", lang)}</button>
    </div>
  );
}

function JoinMulti({ onBack }: { onBack: () => void }) {
  const { lang } = useGameStore();
  const [code, setCode] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8">
      <h2 className="text-3xl font-bold">{t("multi.join", lang)}</h2>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder={t("multi.invite", lang)}
        className="bg-card border border-subtle rounded-lg px-4 py-3 text-primary w-64 text-center text-lg" />
      <button className="btn-primary" disabled={code.length<4}>{t("multi.join", lang)}</button>
      <button onClick={onBack} className="btn-secondary">{t("common.back", lang)}</button>
    </div>
  );
}
