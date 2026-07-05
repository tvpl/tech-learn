# AGENTS.md (v2) — Contexto para agentes de IA

Guia operacional para trabalhar em `v2/`. Para a v1 (HTML/CSS/JS vanilla,
raiz do repo), veja o `AGENTS.md` da raiz — as duas convivem no mesmo
repositório, mas são projetos tecnicamente independentes.

## 1. O que é

Motor de explainers animados **dirigido por tempo**: o estado de uma cena é
`getState(t)`, uma função pura. O player web (`src/player/`) só controla o
relógio; o Remotion (`src/remotion/`) chama a mesma função com
`useCurrentFrame()/fps`. Isso dá paridade pixel-a-pixel entre o site
interativo e os vídeos exportados (Reels, feed, GIF, carrossel) — o mesmo
conteúdo alimenta todos os formatos, sem duplicação.

## 2. Princípio central (não viole)

`src/schema/` + `src/core/` + `src/stage/` são o **motor genérico**.
`src/content/*.ts` é **conteúdo**. Criar/editar um explainer = mexer só em
`src/content/`. Mudança no motor só se for um recurso genérico que beneficia
todos os explainers.

**Regra de pureza (inegociável):** nada em `src/core/` ou `src/stage/` pode
chamar `Date.now()`, `Math.random()` ou manter estado mutável entre chamadas.
Duas chamadas de `getState(t)` com o mesmo `t` têm que devolver o mesmo
resultado sempre — é isso que garante que o Remotion renderiza exatamente o
que o player mostra. Partículas/efeitos "aleatórios" usam `core/prng.ts`
(seed determinística por chave).

## 3. Modelo mental do motor

- **Mundo de autoria:** canvas lógico 1600×900 (`schema/formats.ts::WORLD`).
  Todo `elements[].at` é um rect nesse espaço.
- **Visibilidade acumulativa:** `scene.add`/`scene.remove` resolvidos pelo
  compilador (`core/timeline.ts::compileTimeline`) — o conjunto visível numa
  cena é `base ∪ adds(≤cena) − removes(≤cena)`. Igual indo e voltando.
- **Cues são locais à cena:** `scene.cues[]` (move, highlight, pulse, flow de
  partículas, setBars, lightCells, focusLines, count, morphText…) só têm
  efeito enquanto a cena atual está ativa. Ao trocar de cena, o efeito
  desaparece — não existe o "vazamento" que a v1 tinha com `enter(ctx)`
  imperativo.
- **`scene.set`** é o único jeito de mudar uma propriedade de forma
  **persistente** (keyframe que vale dali pra frente).
- **Câmera autoral:** `scene.camera.fit` (ids, "@grupo" ou rect) enquadra o
  conteúdo dentro da região `stage` do formato atual. Sem fit explícito, usa
  tudo que está visível na cena.
- **Multi-formato:** cada `FormatSpec` (`wide`/`vertical`/`feed`) define seu
  próprio canvas + regiões (`title`, `stage`, `caption`, `watermark`). Em
  `wide` o balão flutua ancorado no elemento; em `vertical`/`feed` vira um
  card fixo na região `caption` (safe area já descontada da UI do
  Instagram/TikTok). Overrides pontuais: `element.layout.vertical`/`.feed`.

## 4. Onde NÃO editar sem necessidade genérica

- `core/timeline.ts` — o compilador. Mudança aqui afeta TODOS os explainers
  e a paridade web/vídeo.
- `stage/Stage.tsx` — o renderizador puro compartilhado.
- `remotion/ExplainerComposition.tsx` / `Root.tsx` — a ponte com o Remotion.

Se um explainer parece precisar de "só mais um tipo de elemento" ou "só mais
uma diretiva de cue", considere se dá pra expressar com o vocabulário atual
(`schema/elements.ts`, `schema/directives.ts`) antes de estender o schema.

## 5. Testes e comandos

```bash
npm test          # validate-content.ts (zod + refs) + vitest (core/)
npm run typecheck
npm run dev
npm run build      # roda validate + next build (export estático)
npm run render -- <slug> --format=...   # export social (ver README.md)
```

`npm test`/`npm run build` **falham** se um `.ts` em `src/content/` tiver
referência quebrada (id/grupo inexistente, cue fora da duração da cena, quiz
malformado, etc.) — a validação semântica está em
`schema/explainer.ts::validateExplainer`.

Vitest cobre `core/` (interpolação determinística, compilador de timeline,
conectores). Ao mexer em `core/timeline.ts`, rode `npx vitest run` e preste
atenção especial ao teste de determinismo (`getState(t)` duas vezes com o
mesmo `t` tem que dar `deepEqual`).

## 6. Convenções

- TypeScript estrito, sem `any` gratuito. Conteúdo/textos em **português**.
- Cores só via tons semânticos (`tone: "accent"|"accent2"|"good"|"warn"|"hot"|"neutral"`
  em `schema/elements.ts`) — nunca hex direto no conteúdo. Mapeiam para
  `--tl-*` em `stage/stage.css`.
- `stage/stage.css` é **CSS puro** (sem Tailwind) — é importado pelo bundle
  do Remotion, que não processa Tailwind. Tailwind só no chrome do site
  (`app/`, `player/player.css` usa CSS puro pelo mesmo motivo — ver abaixo).
- Balões (`scene.caption`) sempre com `text` (o quê) e, quando fizer sentido,
  `why` (por quê) — herdado da v1, é o que dá densidade pedagógica.
- Todo explainer termina com uma cena de `quiz`.
- Bibliotecas de animação nas CENAS: **proibido** framer-motion/Motion, GSAP,
  Lottie — todas quebram a paridade determinística com o Remotion (springs
  com estado interno não são reproduzíveis frame a frame). O interpolador
  próprio (`core/interpolate.ts`) é a peça central do design; estenda-o ali
  se precisar de um easing novo.

## 7. Checklist antes de finalizar uma mudança

- [ ] `npm test` e `npm run typecheck` verdes.
- [ ] Se adicionou explainer: registrado em `src/content/index.ts`.
- [ ] Nada de `Date.now`/`Math.random`/estado mutável em `core/` ou `stage/`.
- [ ] Câmera/layout conferidos visualmente em pelo menos 2 formatos
      (`/studio/<slug>` no `npm run dev`, ou um `npx remotion still` pontual).
- [ ] `npm test` da v1 (raiz) continua verde — não é afetado por mudanças
      aqui, mas confirme se você tocou em algo compartilhado (ex.: workflows).
