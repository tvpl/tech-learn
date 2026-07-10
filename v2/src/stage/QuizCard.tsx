import React from "react";
import type { Quiz } from "@/schema/directives";
import { ease, windowProgress } from "@/core/interpolate";

/**
 * Versão do quiz para EXPORT (vídeo/carrossel): puramente função de `local`
 * (ms desde o início da cena) — sem clique, sem estado. A resposta certa se
 * revela sozinha depois de uma pausa "de leitura", como um card de Reels.
 * O player web interativo usa `QuizGate` (com estado, clicável); esta versão
 * só aparece quando `exporting` está ativo no Stage.
 */
export function QuizCard({ quiz, local, duration }: { quiz: Quiz; local: number; duration: number }) {
  const revealAt = duration * 0.45;
  const revealP = ease("out", windowProgress(local, revealAt, 450));
  const answered = revealP > 0.05;

  return (
    <div className="tl-quiz-card">
      <div className="tl-quiz-card-q">{quiz.question}</div>
      <div className="tl-quiz-card-options">
        {quiz.options.map((opt, i) => {
          const isAnswer = i === quiz.answer;
          const cls = isAnswer && answered ? "tl-quiz-card-opt tl-quiz-card-correct" : "tl-quiz-card-opt";
          return (
            <div key={i} className={cls} style={isAnswer ? { ["--reveal" as string]: revealP } : undefined}>
              {opt}
            </div>
          );
        })}
      </div>
      <div className="tl-quiz-card-explain" style={{ opacity: revealP }}>
        {quiz.explain}
      </div>
    </div>
  );
}
