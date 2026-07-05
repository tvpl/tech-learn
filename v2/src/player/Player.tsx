"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play, Maximize, Minimize, Moon, Sun, Wand2 } from "lucide-react";
import { compileTimeline } from "@/core/timeline";
import type { Explainer } from "@/schema/explainer";
import { Stage } from "@/stage/Stage";
import { prepareExplainer } from "@/stage/highlight";
import { useClock } from "./useClock";
import { QuizGate } from "./QuizGate";
import { getItem, lastSceneKey, quizKey, setItem, THEME_KEY, visitedKey } from "@/lib/storage";
import "./player.css";

export function Player({ explainer }: { explainer: Explainer }) {
  const timeline = useMemo(() => compileTimeline(explainer, "wide"), [explainer]);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPausedForQuiz = useRef(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const clock = useClock(timeline.totalMs);
  const state = timeline.getState(clock.t);
  const scene = state.scene;

  // prepara syntax highlight (shiki é assíncrono; Stage fica puro/síncrono depois disso)
  useEffect(() => {
    let alive = true;
    prepareExplainer(explainer).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [explainer]);

  // tema + progresso salvos localmente
  useEffect(() => {
    setTheme((getItem(THEME_KEY) as "dark" | "light") ?? "dark");
    const answers: Record<string, number> = {};
    for (const sc of explainer.scenes) {
      if (!sc.quiz) continue;
      const saved = getItem(quizKey(explainer.slug, sc.id));
      if (saved !== null) answers[sc.id] = Number(saved);
    }
    setQuizAnswers(answers);

    const landingMs = (idx: number) => {
      const s = timeline.scenes[idx];
      return s ? s.startMs + s.revealMs : 0;
    };
    const hash = typeof window !== "undefined" ? window.location.hash.match(/cena=(\d+)/) : null;
    if (hash) {
      clock.seek(landingMs(Math.min(Number(hash[1]), timeline.scenes.length - 1)));
    } else {
      const last = getItem(lastSceneKey(explainer.slug));
      clock.seek(landingMs(last ? Math.min(Number(last), timeline.scenes.length - 1) : 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explainer.slug]);

  // deep-link + retomar + marca "visitado"
  useEffect(() => {
    if (typeof window === "undefined") return;
    const newHash = `#cena=${scene.index}`;
    if (window.location.hash !== newHash) window.history.replaceState(null, "", newHash);
    setItem(lastSceneKey(explainer.slug), String(scene.index));
    setItem(visitedKey(explainer.slug), "1");
  }, [scene.index, explainer.slug]);

  // pausa automaticamente ao chegar na janela do quiz, se não respondido
  useEffect(() => {
    if (!scene.def.quiz) return;
    const answered = quizAnswers[scene.def.id] !== undefined;
    if (answered) return;
    if (clock.t - scene.startMs >= scene.revealMs && clock.playing) {
      autoPausedForQuiz.current = true;
      clock.pause();
      clock.seek(scene.startMs + scene.revealMs);
    }
  }, [clock, scene]);

  const goScene = (idx: number) => {
    const target = timeline.scenes[Math.min(Math.max(idx, 0), timeline.scenes.length - 1)];
    clock.seek(target.startMs + target.revealMs);
  };

  const handleAnswer = (i: number) => {
    setQuizAnswers((prev) => ({ ...prev, [scene.def.id]: i }));
    setItem(quizKey(explainer.slug, scene.def.id), String(i));
    if (autoPausedForQuiz.current) {
      autoPausedForQuiz.current = false;
      clock.play();
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setItem(THEME_KEY, next);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowRight") goScene(scene.index + 1);
      else if (e.key === "ArrowLeft") goScene(scene.index - 1);
      else if (e.key === " ") { e.preventDefault(); clock.toggle(); }
      else if (e.key.toLowerCase() === "f") toggleFullscreen();
      else if (e.key.toLowerCase() === "t") toggleTheme();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.index, clock]);

  const showQuiz = !!scene.def.quiz && clock.t - scene.startMs >= scene.revealMs;
  const progressPct = ((scene.index + (clock.t - scene.startMs) / (scene.endMs - scene.startMs)) / timeline.scenes.length) * 100;

  return (
    <div ref={containerRef} className={`flex h-screen flex-col bg-[var(--tl-bg)] text-[var(--tl-ink)] tl-theme-${theme}`}>
      <header className="flex items-center justify-between border-b border-[var(--tl-line)] px-5 py-3">
        <div>
          <h1 className="text-base font-bold">{explainer.title}</h1>
          {explainer.subtitle ? <p className="text-xs text-[var(--tl-ink-soft)]">{explainer.subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/studio/${explainer.slug}/`}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--tl-line)] px-3 py-2 text-xs font-medium hover:border-[var(--tl-accent)]"
          >
            <Wand2 size={14} /> Studio
          </Link>
          <button onClick={toggleTheme} aria-label="Alternar tema" className="rounded-lg border border-[var(--tl-line)] p-2 hover:border-[var(--tl-accent)]">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={toggleFullscreen} aria-label="Tela cheia" className="rounded-lg border border-[var(--tl-line)] p-2 hover:border-[var(--tl-accent)]">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden w-64 shrink-0 overflow-y-auto border-r border-[var(--tl-line)] p-3 md:block" aria-label="Cenas">
          {timeline.scenes.map((s) => (
            <button
              key={s.def.id}
              onClick={() => goScene(s.index)}
              className={`mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm ${
                s.index === scene.index ? "bg-[var(--tl-accent)] text-white" : "hover:bg-[var(--tl-panel)]"
              }`}
            >
              <span className="opacity-60">{s.index + 1}.</span> {s.def.title}
            </button>
          ))}
        </nav>

        <main className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
          {ready ? (
            <div className="aspect-[16/9] w-full max-w-5xl" style={{ containerType: "inline-size" }}>
              <div
                style={{
                  width: 1600,
                  height: 900,
                  transform: "scale(calc(100cqw / 1600px))",
                  transformOrigin: "top left",
                }}
              >
                <Stage timeline={timeline} tMs={clock.t} theme={theme} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-[var(--tl-ink-soft)]">Preparando…</div>
          )}

          {showQuiz && scene.def.quiz ? (
            <div className="absolute inset-x-4 bottom-4 mx-auto max-w-md">
              <QuizGate
                quiz={scene.def.quiz}
                selected={quizAnswers[scene.def.id] ?? null}
                onSelect={handleAnswer}
              />
            </div>
          ) : null}
        </main>
      </div>

      <footer className="border-t border-[var(--tl-line)] px-5 py-3">
        <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-[var(--tl-line)]">
          <div className="h-full bg-[var(--tl-accent)] transition-[width]" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clock.toggle}
            aria-label={clock.playing ? "Pausar" : "Reproduzir"}
            className="rounded-full bg-[var(--tl-accent)] p-2 text-white"
          >
            {clock.playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={() => goScene(scene.index - 1)} className="text-sm text-[var(--tl-ink-soft)] hover:text-[var(--tl-ink)]">
            ← Anterior
          </button>
          <span className="text-xs text-[var(--tl-ink-soft)]">
            Cena {scene.index + 1} de {timeline.scenes.length}
          </span>
          <button onClick={() => goScene(scene.index + 1)} className="text-sm text-[var(--tl-ink-soft)] hover:text-[var(--tl-ink)]">
            Próxima →
          </button>
        </div>
      </footer>
    </div>
  );
}
