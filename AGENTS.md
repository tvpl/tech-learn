# AGENTS.md — Contexto para agentes de IA

Guia operacional para um agente de IA trabalhar neste repositório com segurança
e rapidez. Leia isto **antes** de editar. Para a documentação voltada a humanos
(uso, contrato de dados detalhado), veja o `README.md`.

---

## 1. O que é o projeto

`tech-learn` é uma coleção de **explicadores interativos** (diagramas animados que
ensinam um conceito de tecnologia passo a passo, com balões explicativos). Hoje há
39, cobrindo IA/Agentes, Web/Protocolos, Segurança/Auth, Sistemas Distribuídos,
Infra/Cloud, Mensageria/Async, Runtime e Algoritmos (lista completa e sempre
atualizada em `index.html`).

Stack: **HTML + CSS + JavaScript vanilla**. Sem framework, sem bundler, sem passo de
build. Abre direto no navegador (`file://`) ou via `python3 -m http.server`. A única
dependência (de desenvolvimento) é o `jsdom`, usado só nos testes.

### Princípio central (não viole)
Existe **um motor genérico** (`engine/`) e **vários arquivos de dados** (um por
diagrama). Criar/alterar um diagrama = mexer **só** no arquivo de dados dele.
**Não edite o motor para adicionar conteúdo de um diagrama específico.** Mudança no
motor só se for um recurso genérico que beneficie todos os explicadores.

---

## 2. Mapa de arquivos

```
engine/explainer.js     # Motor (classe Explainer). Genérico. Mude com cautela.
engine/explainer.css    # Tema + animações. Variáveis CSS em :root (e tema claro).
explainers/<tema>.html  # Página fininha: carrega o motor + o .data.js e instancia.
explainers/<tema>.data.js  # CONTEÚDO: elements[] + steps[]. É aqui que se trabalha.
index.html              # Vitrine com um card por explicador.
tools/smoke.mjs         # Teste headless (jsdom). Roda via `npm test`.
tools/screenshots.mjs   # Previews PNG via Playwright (`npm run screenshots`).
.github/workflows/      # ci.yml (testes), pages.yml (deploy), screenshots.yml.
.claude/settings.json   # Hook SessionStart: roda `npm install` ao abrir a sessão.
```

Cada `<tema>.data.js` expõe um global `window.<TEMA>_DIAGRAM`. O `.html` chama
`new Explainer(window.<TEMA>_DIAGRAM).mount("#app")`. **São scripts clássicos, não
ES modules** — por isso o global em `window`.

---

## 3. Modelo mental do motor (o que mais confunde)

### 3.1 Coordenadas
Tudo é desenhado num SVG com `viewBox 0 0 width height` (definidos no diagrama).
Posições em `elements` são **coordenadas do viewBox**, não pixels de tela. O motor
mapeia para a tela sozinho (`preserveAspectRatio xMidYMid meet`). Âncoras de balão
podem ser um `id` de elemento ou `{x, y}` em coords do viewBox.

### 3.2 Visibilidade: dois mecanismos que coexistem (CRÍTICO)
1. **Acumulativo (`show`/`hide` nas cenas):** o conjunto visível é recalculado do
   zero a cada cena: `base:true` + todos os `show` das cenas `≤ atual` − os `hide`.
   Serve para um diagrama que **cresce** e permanece. Funciona igual indo e voltando.
2. **Dirigido por `enter(ctx)` (auto-reset):** um elemento que **não** aparece em
   nenhum `show`/`hide` fica oculto por padrão a cada cena. Se um `enter(ctx)` o
   revela com `ctx.show(...)`, ele aparece só naquela cena e **some sozinho** ao
   navegar. Use isso para detalhes/zoom exclusivos de uma cena.

> Erro comum: revelar um detalhe via `show:` e ele "vazar" para cenas seguintes.
> Se for exclusivo de uma cena, **não** use `show:` — revele em `enter(ctx)`.

### 3.3 `enter(ctx)` e helpers
`enter(ctx)` roda ~120ms após a cena montar (e também ao voltar para ela; portanto
deve ser **idempotente** — re-rodar não pode quebrar). Helpers em `ctx`:
`show/hide`, `reveal(grupo|[ids], stagger)`, `drawArrow`, `setBars`, `lightCells`,
`moveTo`, `pulse`, `el`, `svgEl`.

`ctx.moveTo(id, x, y)` aplica `transform: translate(x,y)` — é **deslocamento
relativo** à posição original do elemento, **não** posição absoluta. Para resetar,
`ctx.moveTo(id, 0, 0)`. Como o transform **persiste** entre cenas, se um elemento se
move, reposicione-o no `enter` das cenas relevantes para a navegação reversa ficar
correta.

### 3.4 Grupos
Um elemento com `group:"nome"` entra no grupo `nome`. Em listas de cena use
`"@nome"` (ex.: `show:["@tokens"]`) e em `enter` use `ctx.reveal("nome", stagger)`.

### 3.5 Tipos de elemento
`box`, `token`, `label`, `arrow` (`x1,y1,x2,y2` ou `path`; `color`, `noHead`,
`dashed`), `vector` (barras, `values:[0..1]`), `matrix` (grade; animar com
`lightCells`). Detalhes de campos: `README.md` → "Contrato dos dados".

### 3.6 Recursos prontos (não reimplemente)
Deep-link `#cena=N`, autoplay + barra, tema claro/escuro, modo apresentação,
minimapa, **zoom/pan** (roda/pinça/teclado `+ - 0`, arrasto) e **swipe** no toque,
**retomar** última cena (localStorage), **modo debug** (tecla `d`: grade + ids),
**quiz** (`step.quiz`, lembra a resposta na sessão), **glossário** (`<span
class="xp-term" data-tip="...">`), teclado (← → espaço f m d v [ ] + − 0),
`aria-live`, `prefers-reduced-motion`, validador que avisa no console sobre ids
inexistentes, reposicionamento do balão no `resize` da janela, e o "próximos
explicadores" injetado por `engine/related.js` (mapa de relações por página,
independente do motor).

Cuidado ao mexer em balões: a posição é calculada em `_placeBalloon` via
`getBoundingClientRect`/`getScreenCTM` (reflete zoom/pan). Não recrie o balão para
reposicionar — use `_repositionBalloon()`. O balão é **translúcido** (fundo
`rgba` + `backdrop-filter`, alpha em `--balloon-alpha` — ajustável via botão 🎚️
ou teclas `[`/`]`, persistido em `xp-balloon-alpha`) e **arrastável** pelo
título (`h3`, ver `_bindBalloonDrag`) — o arraste soma um offset
(`node._dragDx/_dragDy`) por cima da posição ancorada, e reseta sozinho a cada
nova cena (novo `node`). Também dá pra **recolher** o balão a uma pílula
(botão ▾ no título, `_bindBalloonCollapse`) — nasce recolhido em telas
≤880px — e **esconder todos os balões** temporariamente com o botão 👁️/tecla
`v` (classe `is-peeking` em `.xp-app`).

### 3.7 Tipos (autocomplete sem TypeScript)
`engine/explainer.types.js` traz `@typedef`s do contrato. Comece um `.data.js` com
`/** @type {import("../engine/explainer.types.js").Diagram} */` para ganhar
autocomplete/checagem no editor (ver `transformer.data.js`).

---

## 4. Como adicionar um novo explicador

1. Copie `explainers/transformer.html` → `explainers/<tema>.html` e troque o
   `<script src>` e o nome do global na linha `new Explainer(...)`.
2. Copie um `*.data.js` simples (ex.: `git.data.js`) → `<tema>.data.js`. Defina
   `elements` e `steps`; exponha `window.<TEMA>_DIAGRAM`.
3. Adicione um card em `index.html` (reaproveite a classe `.card`).
4. Atualize a lista de explicadores no `README.md`.
5. `npm test` precisa passar (o smoke descobre o novo `.data.js` automaticamente).

Boas práticas de conteúdo: cada balão deve responder **o quê** (`text`) e **por
quê** (`why`); termine com um `quiz`; idioma **português**; reutilize as variáveis
CSS de cor (`--accent`, `--good`, `--warn`, `--hot`, `--accent-2`) em vez de hex.

---

## 5. Testes, build e comandos

```bash
npm install     # jsdom + playwright (devDependencies)
npm test        # smoke.mjs (jsdom) + checklinks.mjs (consistência de links)
npm run serve   # python3 -m http.server 8000
```

`npm test` roda **dois** scripts (e também no CI, `.github/workflows/ci.yml`):
`tools/smoke.mjs` (monta cada diagrama em jsdom, navega ida e volta disparando os
`enter()`, falha em erro de runtime/âncora-ref inexistente/quiz malformado) e
`tools/checklinks.mjs` (pares html↔data, refs no html, cards do index).
**Sempre rode `npm test` antes de commitar.**

Não há lint configurado. Não há passo de build (o site é os próprios arquivos).
Screenshots reais exigem Playwright (não instalado por padrão; ver `screenshots.yml`).

### Limitações do ambiente headless
Não há navegador neste ambiente, então a verificação visual real depende do usuário
(ou do workflow de screenshots). O `jsdom` faz stub de `getBBox`/`getTotalLength`/
layout — bom para pegar erros de lógica e referências, **não** para validar layout/
sobreposição visual. Ao mexer em posições, raciocine sobre as coordenadas.

---

## 6. Convenções de estilo de código

- JS vanilla, sem dependências em runtime. Comentários e textos em **português**.
- Indentação 2 espaços; aspas duplas; arrow functions; helpers curtos no topo dos
  arquivos de dados (ex.: `vec()`, `reveal()`).
- IDs de elementos curtos e prefixados por área quando ajuda (`r6_mha`, `m_box`,
  `cmd_push`). `id` é único por diagrama.
- Mantenha o estilo do código vizinho. Não introduza TypeScript, bundlers ou
  frameworks.

---

## 7. Git e PRs

- `node_modules/` e `package-lock.json` estão no `.gitignore` — não commite.
- Commits descritivos. **Só** abra PR se o usuário pedir explicitamente.
- Não faça deploy nem mude settings sem combinar.

---

## 8. Checklist antes de finalizar uma mudança

- [ ] `npm test` passou (todos os diagramas verdes).
- [ ] Se adicionou diagrama: card no `index.html` + entrada no `README.md`.
- [ ] Não editei o motor para resolver algo específico de um diagrama.
- [ ] Detalhes exclusivos de cena via `enter(ctx)`, não via `show:`.
- [ ] Balões em PT, com `text` + `why`; cores via variáveis CSS.
- [ ] Nada de `node_modules`/lockfile no commit.
