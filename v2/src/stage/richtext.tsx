import React from "react";

/**
 * Markdown leve dos textos de conteúdo:
 *   **negrito**   `código`   {{termo}} ou {{termo|texto exibido}} (glossário)
 * Parseado para nós React (nunca dangerouslySetInnerHTML em texto de conteúdo).
 */
export function richText(
  src: string,
  glossary: Record<string, string> = {},
  interactive = true,
): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*)|(`([^`]+)`)|(\{\{([^}|]+)(?:\|([^}]+))?\}\})/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    if (m[2] !== undefined) {
      out.push(<strong key={key++}>{m[2]}</strong>);
    } else if (m[4] !== undefined) {
      out.push(<code key={key++} className="tl-code-inline">{m[4]}</code>);
    } else if (m[6] !== undefined) {
      const term = m[6].trim();
      const shown = m[7]?.trim() ?? term;
      const tip = glossary[term];
      out.push(
        tip ? (
          <span key={key++} className="tl-term" tabIndex={interactive ? 0 : -1} data-tip={tip}>
            {shown}
          </span>
        ) : (
          shown
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/** Corta texto para efeito typewriter preservando marcação por caractere visível. */
export function typewriterSlice(src: string, progress: number): string {
  if (progress >= 1) return src;
  // remove marcação para contar caracteres visíveis
  const plain = src.replace(/\*\*(.+?)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\{\{([^}|]+)(?:\|([^}]+))?\}\}/g, (_, t, s) => s ?? t);
  const n = Math.floor(plain.length * Math.max(0, progress));
  // aproximação: corta o texto cru (marcação parcial é aceitável no meio da animação)
  let visible = 0;
  let i = 0;
  while (i < src.length && visible < n) {
    if (src.startsWith("**", i) || src.startsWith("{{", i) || src.startsWith("}}", i)) { i += 2; continue; }
    if (src[i] === "`" || src[i] === "|") { i++; continue; }
    i++;
    visible++;
  }
  return src.slice(0, i);
}
