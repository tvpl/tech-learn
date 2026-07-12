# 🧠 tech-learn — Diagramas explicativos animados

Coleção de **explicadores interativos** que ensinam conceitos de tecnologia
passo a passo, com animação, realces e **balões** que aparecem em cada etapa.
Tudo em **HTML + CSS + JavaScript puro** — sem build, sem dependências. É só
abrir no navegador.

39 explicadores disponíveis, agrupados por área (descrições completas, busca e
trilhas sugeridas em [`index.html`](index.html)):

- 🤖 **IA & Agentes** (10) — Rede Transformer, RAG, Model Context Protocol,
  SubAgentes, Engenharia de Contexto, Engenharia de Prompt, Guardrails, Skills,
  Spec-Driven Development, Specs para Agentes.
- 🌐 **Web & Protocolos** (6) — Requisição HTTP, TCP/IP, ISO 8583, WebSocket,
  gRPC, TLS/mTLS.
- 🔐 **Segurança & Autenticação** (7) — OAuth 2.0/OIDC, JWT, SSO, Sessions &
  Cookies, API Keys, MFA/2FA, Criptografia.
- ⛓️ **Sistemas Distribuídos** (2) — Consistent Hashing, Blockchain.
- ☁️ **Infraestrutura & Cloud** (7) — Kubernetes, Amazon EKS, Amazon RDS,
  Ingress, Circuit Breaker, Rate Limiting, Load Balancer.
- ⚡ **Mensageria & Processamento Async** (2) — Sync → Async (Redis/Kafka),
  Kafka Serialization + Schema Registry.
- ☕ **Runtime & Linguagens** (1) — Virtual Threads (Java).
- 🔢 **Algoritmos & Estruturas de Dados** (3) — Hash Map, Busca Binária, Recursão.
- 🛠️ **Ferramentas** (1) — Git: do `add` ao `push`.

Todos compartilham o **mesmo motor** (`engine/`): cada um é apenas um arquivo de
dados. Isso é a prova de que a estrutura se reaproveita.

> 🤖 Vai trabalhar no código (humano ou IA)? Comece pelo **[`AGENTS.md`](AGENTS.md)**:
> arquitetura, o modelo de visibilidade das cenas e os principais cuidados.

### Recursos do motor

- ▶️ **Autoplay** com barra de tempo por cena, além de Próximo/Anterior e índice.
- 🔗 **Deep-link**: a cena atual vai para a URL (`#cena=7`) — dá para compartilhar
  e sobrevive ao refresh.
- 🌓 **Tema claro/escuro** (persiste) · ⛶ **modo apresentação** (fullscreen) ·
  🗺️ **minimapa** · 🔎 **zoom/pan** (roda, pinça, teclado) e **swipe** no toque.
- 🧭 **Retoma** a última cena vista e tem **modo debug** (tecla `d`) com grade e ids.
- ⌨️ **Ajuda de atalhos** (tecla `?` ou `h`) em overlay, para descobrir o teclado.
- ❓ **Quiz** opcional ao fim de cada explicador (lembra a resposta na sessão).
- 💬 **Glossário**: termos com definição em tooltip dentro dos balões.
- 🫥 **Balões translúcidos e arrastáveis**: o fundo do balão é semitransparente
  (efeito vidro fosco) para não esconder o diagrama atrás dele, e dá para
  arrastá-lo pelo título (segure e mova) quando ele ainda assim atrapalhar a
  vista — duplo-clique no título volta ao lugar original.
- 🎚️ **Opacidade ajustável** (botão no cabeçalho ou teclas `[`/`]`), persiste
  entre sessões · 👁️ **espiar diagrama** (tecla `v`): esconde todos os balões
  na hora, sem sair da cena · 🔽 **balão recolhível** (clique no título): vira
  uma pílula compacta — nasce recolhido em telas estreitas.
- 🧩 **Reposiciona sozinho** ao redimensionar a janela.
- 🧭 **Links "Próximos →"**: barra com explicadores relacionados perto do fim
  de cada leitura (`engine/related.js`).
- ♿ **Acessível**: navegação por teclado, foco visível, `aria-live` e
  `prefers-reduced-motion`.
- ✅ **Testado**: `npm test` percorre todas as cenas de todos os diagramas (jsdom).

## ▶️ Como rodar

Abra `index.html` direto no navegador (`file://`), ou suba um servidor local
(recomendado, evita restrições de `file://`):

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

Navegue com os botões **Anterior / Próximo**, o botão **Reproduzir** (autoplay),
o índice lateral de etapas, ou o teclado:

| Tecla | Ação |
|-------|------|
| **← / →** | cena anterior / próxima |
| **espaço** | play / pause do autoplay |
| **f** | modo apresentação (fullscreen) |
| **m** | mostra/oculta o minimapa |
| **+ / − / 0** | zoom: aproxima / afasta / reseta |
| **d** | modo debug (grade de coordenadas + ids) — ajuda a posicionar elementos |
| **v** | espiar diagrama (esconde os balões sem sair da cena) |
| **[ / ]** | diminui / aumenta a transparência do balão |
| **? / h** | mostra os atalhos de teclado (Esc fecha) |

Com **mouse**: roda do mouse dá zoom, arrastar (com zoom) faz *pan*, duplo-clique
reseta; segure o **título do balão** para arrastá-lo (duplo-clique nele recoloca no
lugar) e clique no ▾ pra recolher/expandir. No **toque**: *swipe* horizontal troca
de cena, pinça dá zoom e arrastar faz *pan*. No cabeçalho há botões para **tema**
(🌓), **minimapa** (🗺️), **copiar link da cena** (🔗), **apresentação** (⛶),
**espiar diagrama** (👁️), **opacidade do balão** (🎚️) e **atalhos** (⌨️). A última
cena vista é
**retomada** ao reabrir.

## 🧪 Testes

```bash
npm install   # instala o jsdom (única dependência de dev)
npm test      # percorre todas as cenas de todos os diagramas e valida
```

`npm test` roda duas verificações (e também no **CI**, `.github/workflows/ci.yml`):

- **`tools/smoke.mjs`** — monta cada explicador num DOM headless (jsdom), percorre as
  cenas (ida e volta, disparando os `enter()`) e falha se houver erro de runtime,
  âncora/referência inexistente ou quiz malformado.
- **`tools/checklinks.mjs`** — confere a consistência estrutural: todo `*.data.js`
  tem seu `*.html`, cada página referencia o motor/CSS/seus dados, e todo card do
  `index.html` aponta para um arquivo existente.

> **Publicar:** o workflow `pages.yml` faz deploy no GitHub Pages (Settings →
> Pages → Source: GitHub Actions).
>
> **Previews & social:** as páginas têm meta tags **Open Graph** apontando para
> `assets/preview/<nome>.png`. Rode o workflow **Screenshots** (`screenshots.yml`,
> via *Run workflow*) para gerar esses PNGs com o Playwright e commitá-los
> automaticamente — aí os links desdobram com imagem e dá para embuti-los no README.
> Localmente: `npm run screenshots` (requer `npx playwright install chromium`).

## 🗂 Estrutura

```
tech-learn/
├── index.html                  # vitrine: lista os explicadores
├── engine/
│   ├── explainer.css           # tema e animações (genérico)
│   ├── explainer.js            # motor: timeline, render SVG, balões, controles
│   └── explainer.types.js      # typedefs JSDoc do contrato de dados (autocomplete)
├── explainers/                 # um par .html + .data.js por tema
│   ├── transformer.html / transformer.data.js   # CONTEÚDO: elementos + cenas
│   ├── http.html        / http.data.js
│   ├── tcp.html         / tcp.data.js
│   ├── git.html         / git.data.js
│   ├── hashmap.html     / hashmap.data.js
│   ├── busca-binaria.html / busca-binaria.data.js
│   └── recursao.html    / recursao.data.js
├── tools/                      # smoke.mjs, checklinks.mjs (testes), screenshots.mjs
├── assets/preview/             # PNGs de preview (gerados pelo workflow Screenshots)
├── .github/workflows/          # ci.yml, pages.yml, screenshots.yml
└── package.json                # scripts: test, screenshots, serve
```

O **motor** (`engine/`) é genérico e nunca precisa ser editado para criar um
novo diagrama. Cada explicador é só um **arquivo de dados** + uma página HTML
fininha que instancia o motor.

## ✨ Como criar um novo explicador

1. **Copie** `explainers/transformer.html` e `explainers/transformer.data.js`
   com o nome do seu tema (ex.: `tcp.html` / `tcp.data.js`).
2. No `.data.js`, defina dois arrays: `elements` (o que aparece) e `steps`
   (a narração). No fim, exponha o objeto em `window.SEU_DIAGRAMA`.
3. No `.html`, troque a referência do script e a linha de instanciação para
   `new Explainer(window.SEU_DIAGRAMA).mount("#app")`.
4. Adicione um card apontando para a nova página em `index.html`.
5. Rode `npm test` (o smoke descobre o novo `.data.js` sozinho; o checklinks valida
   os links). **Dica:** pressione **d** no navegador para ver a grade de coordenadas
   e os ids enquanto posiciona os elementos.

Para autocomplete/checagem no editor (sem TypeScript), comece o `.data.js` com:

```js
/** @type {import("../engine/explainer.types.js").Diagram} */
window.SEU_DIAGRAMA = { title: "…", elements: [ /* … */ ], steps: [ /* … */ ] };
```

### Contrato dos dados

```js
window.MEU_DIAGRAMA = {
  title: "Título", subtitle: "Subtítulo",
  width: 1280, height: 760,        // viewBox do SVG
  autoplayMs: 8000,                // tempo por cena no autoplay
  elements: [ /* ver abaixo */ ],
  steps:    [ /* ver abaixo */ ],
};
```

**Elementos** (cada um precisa de `id` único). Tipos suportados:

| `type`   | Para quê | Campos principais |
|----------|----------|-------------------|
| `box`    | caixa/etapa | `x, y, w, h, label` (string, string com `\n`, ou array de linhas), `fill`, `mono`, `rx` |
| `token`  | "chip" de token | igual ao box, com estilo de token |
| `label`  | texto solto | `x, y, label, anchor` (`start`/`middle`/`end`), `size`, `sub`, `mono` |
| `arrow`  | seta/conector | `x1,y1,x2,y2` **ou** `path`; opções `color`, `noHead`, `dashed` |
| `vector` | coluna de barras (ex.: embedding) | `x, y, w, h, values:[0..1], color` |
| `matrix` | grade de células (ex.: atenção) | `x, y, rows, cols, cell, color` |

**Atenção ao nome do campo:** o texto de `box`/`token`/`label` é sempre
`label` — **não** `text` (esse nome é reservado ao corpo do balão,
`step.balloon.text`). Um elemento com `text` em vez de `label` é aceito sem
erro (não quebra `npm test`), mas renderiza um `<text>` vazio — é um bug
silencioso, fique atento ao revisar/criar `.data.js`.

Por padrão todo elemento começa **oculto**. Use `base: true` para já nascer
visível. Todo elemento aceita também `group: "nome"` para ser revelado em
lote (ver `ctx.reveal` e o uso de `@nome` abaixo), e um `style` (string CSS
crua, ex.: `"opacity:0.05;stroke-dasharray:6,4"`) como escape hatch genérico
quando `fill`/`stroke`/`size` não cobrirem o caso.

**Cenas** (`steps`). Campos de cada cena:

```js
{
  title: "Nome da etapa",          // aparece no índice e no balão
  balloon: {                       // o balão explicativo
    anchor: "id_do_elemento",      // ou { x, y } em coords do SVG
    placement: "right",            // top | right | bottom | left
    text: "Texto com <strong>HTML</strong>.",
    why:  "Explica POR QUE essa etapa existe (opcional).",
  },
  show:      ["id1", "id2"],        // revela elementos (acumula entre cenas)
  hide:      ["id3"],               // esconde elementos
  highlight: ["id1"],               // contorno/brilho de destaque
  dim:       ["id4"],               // esmaece
  pulse:     ["id2"],               // pulsa continuamente
  enter(ctx) { /* opcional */ },    // animação sob medida (ver abaixo)
  quiz: { /* opcional, ver abaixo */ },
}
```

`show`/`hide` **acumulam**: o que foi mostrado continua visível nas cenas
seguintes (bom para um diagrama que "cresce"). Elementos que você quer
exclusivos de uma cena (zoom/detalhe) **não** entram em `show`/`hide` — revele-os
dentro de `enter(ctx)` e o motor os esconde sozinho ao trocar de cena.

Qualquer lista (`show`, `hide`, `highlight`…) aceita `"@nome"` para expandir um
**grupo** de elementos de uma vez — ex.: `show: ["@tokens"]`.

### Quiz (cena interativa)

Uma cena pode terminar com uma pergunta de múltipla escolha:

```js
{
  title: "Teste rápido",
  balloon: { anchor: "x", placement: "right", text: "Fixe o conceito 👇" },
  quiz: {
    question: "Por que existe positional encoding?",
    options: ["…", "Porque a atenção não tem noção de ordem", "…"],
    answer: 1,                       // índice da opção correta
    explain: "Mostrado após responder.",
  },
}
```

### Glossário (tooltip em termos)

Dentro de qualquer `text`/`why`, marque termos com a classe `xp-term`:

```html
aplica <span class="xp-term" tabindex="0" data-tip="Definição do termo.">softmax</span>
```

O `tabindex="0"` deixa o tooltip acessível por teclado.

### `enter(ctx)` — animações sob medida

Para efeitos especiais, a cena pode trazer uma função `enter(ctx)`. O `ctx`
oferece helpers prontos:

| Helper | O que faz |
|--------|-----------|
| `ctx.show(id)` / `ctx.hide(id)` | revela/esconde um elemento |
| `ctx.drawArrow(id)` | anima o traçado de uma seta |
| `ctx.setBars(id, [vals])` | reanima as alturas das barras de um `vector` |
| `ctx.lightCells(id, [[r,c,op], …])` | acende células de uma `matrix` em cascata |
| `ctx.moveTo(id, x, y)` | desloca um elemento (px) |
| `ctx.pulse(id, on)` | liga/desliga o pulso |
| `ctx.reveal(grupo \| [ids], stagger)` | revela vários elementos em cascata |
| `ctx.el(id)` / `ctx.svgEl(tag, attrs)` | acesso direto ao SVG p/ casos avançados |

Exemplo (revelar barras em cascata e acender uma matriz):

```js
enter: (ctx) => {
  ["v0", "v1", "v2"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 90));
  setTimeout(() => ctx.lightCells("attn", [[2, 1, .95], [0, 0, .6]]), 400);
}
```

## ♿ Acessibilidade & desempenho

- Navegação completa por **teclado** (setas, espaço, f, m) e índice de etapas
  focável; **foco visível** em todos os controles.
- Região **`aria-live`** anuncia o texto da cena para leitores de tela; o SVG tem
  `role="img"` com rótulo.
- Respeita **`prefers-reduced-motion`**: com a preferência ligada, as animações são
  reduzidas a quase nada.
- **Tema claro/escuro** com bom contraste; SVG escala sozinho e o layout é
  responsivo (o índice recolhe em telas estreitas).

## 📄 Licença

Uso livre para fins educacionais.
