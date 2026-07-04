"use client";

import React from "react";
import type { Quiz } from "@/schema/directives";

export function QuizGate({
  quiz,
  selected,
  onSelect,
}: {
  quiz: Quiz;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const answered = selected !== null;
  return (
    <div className="tl-quiz" role="group" aria-label="Quiz">
      <div className="tl-quiz-q">{quiz.question}</div>
      <div className="tl-quiz-options">
        {quiz.options.map((opt, i) => {
          const isAnswer = i === quiz.answer;
          const isSelected = i === selected;
          const cls = !answered
            ? "tl-quiz-opt"
            : isAnswer
              ? "tl-quiz-opt tl-quiz-correct"
              : isSelected
                ? "tl-quiz-opt tl-quiz-wrong"
                : "tl-quiz-opt tl-quiz-disabled";
          return (
            <button key={i} type="button" className={cls} disabled={answered} onClick={() => onSelect(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered ? <div className="tl-quiz-explain">{quiz.explain}</div> : null}
    </div>
  );
}
