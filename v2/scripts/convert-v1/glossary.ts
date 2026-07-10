/**
 * Converte HTML da v1 (`<strong>`, `<code>`, `<em>`, `<span class="xp-term"
 * data-tip="...">`) para o markdown leve da v2 (`**neg**`, `` `code` ``,
 * `*it*`, `{{chave|texto}}`) e vai acumulando o glossário num objeto
 * compartilhado por explainer (repassado entre chamadas).
 */
export function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

const XP_TERM_RE = /<span class="xp-term"[^>]*data-tip="([^"]*)"[^>]*>([\s\S]*?)<\/span>/g;
const STRONG_RE = /<strong>([\s\S]*?)<\/strong>/g;
const CODE_RE = /<code>([\s\S]*?)<\/code>/g;
const EM_RE = /<em>([\s\S]*?)<\/em>/g;

export function htmlToMd(html: string | undefined, glossary: Record<string, string>, warn: (msg: string) => void): string | undefined {
  if (!html) return undefined;
  let out = decodeEntities(html);

  out = out.replace(XP_TERM_RE, (_m, tip: string, shown: string) => {
    const key = stripTags(shown).trim();
    const tipText = decodeEntities(tip).trim();
    if (glossary[key] !== undefined && glossary[key] !== tipText) {
      warn(`glossário: chave "${key}" com definições conflitantes — mantendo a primeira`);
    } else {
      glossary[key] = tipText;
    }
    const shownMd = shown.trim();
    return shownMd === key ? `{{${key}}}` : `{{${key}|${shownMd}}}`;
  });

  out = out.replace(STRONG_RE, (_m, t: string) => `**${t}**`);
  out = out.replace(CODE_RE, (_m, t: string) => `\`${t}\``);
  out = out.replace(EM_RE, (_m, t: string) => `*${t}*`);

  const leftover = out.match(/<[a-z][^>]*>/i);
  if (leftover) warn(`tag HTML não convertida encontrada: "${leftover[0]}" — revisar manualmente`);

  return out.trim();
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, "");
}
