# tech-learn v2 (beta)

Motor de explainers animados de próxima geração: **dirigido por tempo**. O
estado de cada cena é uma função pura `t → estado`. O player web interativo e
o Remotion (export de vídeo) chamam essa MESMA função com o `t` que cada um
controla à sua maneira — o mesmo conteúdo vira site interativo, MP4 vertical
(Reels/Stories), MP4 4:5 (feed), GIF e carrossel (PNGs + PDF) sem duplicar
nada.

A v1 (`../`, HTML/CSS/JS vanilla) continua no ar e intacta. Esta v2 é um
pacote npm independente; veja o [`AGENTS.md`](AGENTS.md) local antes de mexer
no motor.

## Rodar localmente

```bash
npm install
npm run dev              # site em http://localhost:3000
npm test                 # valida conteúdo + vitest (schema/timeline/interpolação)
npm run typecheck
npm run build             # export estático (out/)
```

## Estrutura

```
src/schema/    Contrato de dados (zod + TS): elementos, cenas, diretivas, formatos
src/core/      Motor PURO e determinístico: compilador de timeline, interpolação,
               layout/câmera, roteamento de conectores, PRNG com seed
src/stage/     Renderização compartilhada web+Remotion: <Stage/>, elementos,
               balão, quiz (versão vídeo), syntax highlight, glossário
src/player/    Só web: relógio (rAF), controles, quiz interativo, deep-link,
               atalhos de teclado, retomar, temas
src/remotion/  Composições de vídeo (wide/vertical/feed) — reusam o <Stage/>
src/content/   Os explainers (1 arquivo TS por tema) + registro central
src/app/       Next App Router: home, /e/[slug] (player), /studio/[slug] (export)
scripts/       validate-content.ts (roda no build) e render.ts (export social)
```

## Criar um explainer novo

1. Copie um `src/content/*.ts` existente como ponto de partida.
2. Defina `elements[]` (posições no mundo 1600×900) e `scenes[]` (o que
   aparece, cues de animação, câmera, balão `text`+`why`, `quiz`).
3. Registre em `src/content/index.ts` (slug + metadados leves + loader).
4. `npm test` valida o schema e as referências (ids/grupos/cues inexistentes
   derrubam o build com uma mensagem clara).

Ver o contrato completo em `src/schema/explainer.ts`, `elements.ts` e
`directives.ts` (comentado).

## Exportar para redes sociais

```bash
npm run render -- <slug> --format=wide|reels|feed|gif|carousel|all
```

Gera em `out/<slug>/`: MP4 16:9 (`wide.mp4`), MP4 9:16 (`reels.mp4`), MP4 4:5
(`feed.mp4`), `teaser.gif` e `carousel/` (um PNG por cena + `carousel.pdf`
pronto para o carrossel do LinkedIn). Também dá pra rodar via o workflow
manual `render.yml` no GitHub Actions.

A página `/studio/<slug>` mostra os 3 formatos lado a lado com os comandos
prontos para copiar.

## Migração da v1

Ainda não há um conversor automático `v1 → v2` — os ~39 explainers da v1
continuam no formato antigo. O schema da v2 foi desenhado para que esse
mapeamento seja mecânico quando chegar a hora: `show/hide` → `add/remove`,
`enter(ctx).moveTo` → `cue { do:"move" }`, `enter(ctx).drawArrow` → `cue {
do:"draw" }` num `connector`, etc. Ver `AGENTS.md` para mais contexto.

## Licença do Remotion

Gratuito para indivíduos e empresas de até 3 pessoas. Se este projeto virar
uso corporativo maior, reavalie a licença em remotion.dev/license.
