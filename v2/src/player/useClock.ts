"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ClockApi {
  t: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  seekBy: (deltaMs: number) => void;
}

/**
 * Relógio do player web: acumula tempo via rAF enquanto `playing`. É a ÚNICA
 * fonte de estado mutável do lado do player — `core/timeline.ts` continua puro,
 * já que ele só recebe o `t` calculado aqui e devolve o mesmo estado sempre.
 */
export function useClock(totalMs: number, opts?: { onEnd?: () => void; speed?: number }): ClockApi {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const tRef = useRef(0);
  const speed = opts?.speed ?? 1;

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = null;
    const tick = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dt = (now - lastRef.current) * speed;
      lastRef.current = now;
      let next = tRef.current + dt;
      if (next >= totalMs) {
        next = Math.max(totalMs - 1, 0);
        tRef.current = next;
        setT(next);
        setPlaying(false);
        opts?.onEnd?.();
        return; // já decidimos parar — não agenda outro frame
      }
      tRef.current = next;
      setT(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, totalMs, speed]);

  const seek = useCallback((next: number) => {
    const clamped = Math.min(Math.max(next, 0), Math.max(totalMs - 1, 0));
    tRef.current = clamped;
    setT(clamped);
  }, [totalMs]);

  const seekBy = useCallback((deltaMs: number) => seek(tRef.current + deltaMs), [seek]);

  return {
    t,
    playing,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
    seek,
    seekBy,
  };
}
