/* ============================================================================
 * explainer.js — Motor genérico de diagramas explicativos animados
 * ----------------------------------------------------------------------------
 * Recebe um objeto "diagram" (dados puros) e monta:
 *   - um palco SVG com os elementos declarados;
 *   - uma linha do tempo de "cenas" (steps) com balões explicativos e quizzes;
 *   - controles (próximo/anterior/play/teclado), índice lateral e progresso;
 *   - extras: deep-link na URL, modo apresentação, tema claro/escuro, minimapa,
 *     leitura por leitor de tela (aria-live) e validação dos dados.
 *
 * NENHUM explicador precisa editar este arquivo. Para criar um novo diagrama
 * basta escrever um arquivo de dados (ex.: explainers/transformer.data.js) e
 * instanciar:  new Explainer(diagram).mount('#app')
 *
 * Contrato de dados — veja README.md e transformer.data.js para exemplos.
 * ==========================================================================*/

(function (global) {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs) => {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const el = (tag, attrs, html) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const stripHtml = (s) => String(s).replace(/<[^>]*>/g, "");
  const store = {
    get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };

  class Explainer {
    constructor(diagram) {
      this.d = diagram;
      this.steps = diagram.steps || [];
      this.i = -1;
      this.nodes = new Map();    // id -> { def, group }
      this.groups = new Map();   // nome de grupo -> [ids]
      this.playing = false;
      this.timer = null;
      this.autoplayMs = diagram.autoplayMs || 6500;
      this.view = { k: 1, tx: 0, ty: 0 };   // zoom/pan do palco
      this.debug = false;
      this.quizState = new Map();            // idx da cena -> opção escolhida
      this.exState = new Map();              // "cena:i" -> resultado do exercício
    }

    /* ---- montagem do esqueleto da UI ----------------------------------- */
    mount(sel) {
      this.root = typeof sel === "string" ? document.querySelector(sel) : sel;
      this.root.classList.add("xp-app");
      this.root.innerHTML = "";
      try { this._baseTitle = document.title; } catch {}
      this._applyTheme(store.get("xp-theme", "dark"));
      this._applyBalloonAlpha(parseFloat(store.get("xp-balloon-alpha", "0.9")));

      // cabeçalho + ferramentas (tema, link, apresentação)
      const head = el("header", { class: "xp-header" });
      head.appendChild(el("h1", null, this.d.title || "Explicador"));
      if (this.d.subtitle) head.appendChild(el("span", { class: "xp-sub" }, this.d.subtitle));
      const tools = el("div", { class: "xp-tools" });
      this.btnTheme = el("button", { class: "xp-icon", title: "Alternar tema", "aria-label": "Alternar tema claro/escuro" }, "🌓");
      this.btnMap = el("button", { class: "xp-icon", title: "Minimapa (m)", "aria-label": "Mostrar ou ocultar o minimapa" }, "🗺️");
      this.btnLink = el("button", { class: "xp-icon", title: "Copiar link desta cena", "aria-label": "Copiar link desta cena" }, "🔗");
      this.btnFull = el("button", { class: "xp-icon", title: "Modo apresentação (f)", "aria-label": "Entrar no modo apresentação" }, "⛶");
      this.btnPeek = el("button", { class: "xp-icon", title: "Espiar diagrama (tecla v)", "aria-label": "Mostrar diagrama sem os balões", "aria-pressed": "false" }, "👁️");
      this.btnOpacity = el("button", { class: "xp-icon", title: "Transparência do balão", "aria-label": "Ajustar transparência do balão", "aria-expanded": "false" }, "🎚️");
      this.btnRead = el("button", { class: "xp-icon", title: "Modo leitura (tecla r)", "aria-label": "Abrir modo leitura com todas as cenas", "aria-expanded": "false" }, "📖");
      this.btnHelp = el("button", { class: "xp-icon", title: "Atalhos de teclado (?)", "aria-label": "Mostrar atalhos de teclado" }, "⌨️");
      const home = el("a", { class: "xp-home", href: this.d.homeHref || "../index.html" }, "↩ Todos");
      this.btnTheme.addEventListener("click", () => this._toggleTheme());
      this.btnMap.addEventListener("click", () => this._toggleMinimap());
      this.btnLink.addEventListener("click", () => this._copyLink());
      this.btnFull.addEventListener("click", () => this._togglePresent());
      this.btnPeek.addEventListener("click", () => this._togglePeek());
      this.btnOpacity.addEventListener("click", () => this._toggleOpacity());
      this.btnRead.addEventListener("click", () => this._toggleReading());
      this.btnHelp.addEventListener("click", () => this._toggleHelp());
      tools.append(this.btnTheme, this.btnMap, this.btnLink, this.btnFull, this.btnPeek, this.btnOpacity, this.btnRead, this.btnHelp, home);
      // botão de materiais/anexos (só quando o diagrama declara diagram.materials)
      if (Array.isArray(this.d.materials) && this.d.materials.length) {
        this.btnMaterials = el("button", { class: "xp-icon", title: "Materiais e anexos", "aria-label": "Abrir materiais e anexos de apoio", "aria-expanded": "false" }, "📎");
        this.btnMaterials.addEventListener("click", () => this._toggleMaterials());
        tools.insertBefore(this.btnMaterials, home);
      }
      head.appendChild(tools);
      this.root.appendChild(head);
      this._buildOpacityPanel(head);
      if (this.btnMaterials) this._buildMaterialsPanel(head);

      // índice lateral (acessível por teclado)
      const side = el("aside", { class: "xp-side" });
      side.appendChild(el("h2", null, "Etapas"));
      this.list = el("ol", { class: "xp-steplist" });
      this.steps.forEach((s, idx) => {
        const li = el("li", { "data-idx": idx, role: "button", tabindex: "0" });
        li.appendChild(el("span", { class: "xp-dot" }, String(idx + 1)));
        li.appendChild(el("span", { class: "xp-label" }, s.title || `Etapa ${idx + 1}`));
        const goThere = () => this.go(idx);
        li.addEventListener("click", goThere);
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goThere(); }
        });
        this.list.appendChild(li);
      });
      side.appendChild(this.list);
      this.root.appendChild(side);

      // palco
      this.stage = el("main", { class: "xp-stage" });
      this.autobar = el("div", { class: "xp-autobar" });
      this.autobar.appendChild(el("span"));
      this.stage.appendChild(this.autobar);
      this.svg = svg("svg", {
        viewBox: `0 0 ${this.d.width || 1200} ${this.d.height || 700}`,
        preserveAspectRatio: "xMidYMid meet",
        role: "img", "aria-label": this.d.title || "Diagrama",
      });
      this.svg.appendChild(this._defs());
      this.layer = svg("g", { class: "xp-canvas" });
      this.layer.style.transformOrigin = `${(this.d.width || 1200) / 2}px ${(this.d.height || 700) / 2}px`;
      this.layer.style.transition = "transform .18s ease";
      this.svg.appendChild(this.layer);
      this.stage.appendChild(this.svg);
      this.balloons = el("div", { class: "xp-balloon-layer" });
      this.stage.appendChild(this.balloons);
      // minimapa
      this.minimap = el("div", { class: "xp-minimap", "aria-hidden": "true" });
      this.minimapSvg = svg("svg", { viewBox: `0 0 ${this.d.width || 1200} ${this.d.height || 700}` });
      this.minimap.appendChild(this.minimapSvg);
      this.stage.appendChild(this.minimap);
      this.root.appendChild(this.stage);

      // controles
      const ctr = el("footer", { class: "xp-controls" });
      this.btnPrev = el("button", { class: "xp-btn", "aria-label": "Cena anterior" }, "← Anterior");
      this.btnPlay = el("button", { class: "xp-btn", "aria-label": "Reproduzir automaticamente" }, "▶ Reproduzir");
      this.btnNext = el("button", { class: "xp-btn xp-btn--primary", "aria-label": "Próxima cena" }, "Próximo →");
      this.progress = el("div", { class: "xp-progress" });
      this.progress.appendChild(el("span"));
      this.counter = el("div", { class: "xp-counter" });
      this.btnPrev.addEventListener("click", () => this.prev());
      // no fim, "Próximo" vira "Reiniciar" e volta à primeira cena
      this.btnNext.addEventListener("click", () => {
        if (this.i >= this.steps.length - 1) { this.pause(); this.go(0); } else this.next();
      });
      this.btnPlay.addEventListener("click", () => this.togglePlay());
      ctr.append(this.btnPrev, this.btnPlay, this.progress, this.counter, this.btnNext);
      this.root.appendChild(ctr);

      // região para leitor de tela
      this.live = el("div", { class: "xp-sr", "aria-live": "polite", role: "status" });
      this.root.appendChild(this.live);

      // elementos do diagrama + índice de grupos
      (this.d.elements || []).forEach((def) => {
        this._renderElement(def);
        if (def.group) {
          if (!this.groups.has(def.group)) this.groups.set(def.group, []);
          this.groups.get(def.group).push(def.id);
        }
      });
      this._validate();

      // teclado
      this._onKey = (e) => {
        if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
        // Esc fecha ajuda/opacidade/saiba-mais (e só eles) antes de qualquer outro atalho
        if (e.key === "Escape" && this.root.classList.contains("show-help")) { this._toggleHelp(false); return; }
        if (e.key === "Escape" && this.root.classList.contains("show-opacity")) { this._toggleOpacity(false); return; }
        if (e.key === "Escape" && this.root.classList.contains("show-materials")) { this._toggleMaterials(false); return; }
        if (e.key === "Escape" && this.root.classList.contains("show-deep")) { this._toggleDeep(false); return; }
        if (e.key === "Escape" && this.root.classList.contains("show-reading")) { this._toggleReading(false); return; }
        if (e.key === "ArrowRight") this.next();
        else if (e.key === "ArrowLeft") this.prev();
        else if (e.key === " ") { e.preventDefault(); this.togglePlay(); }
        else if (e.key === "f") this._togglePresent();
        else if (e.key === "m") this._toggleMinimap();
        else if (e.key === "d") this._toggleDebug();
        else if (e.key === "v") this._togglePeek();
        else if (e.key === "r") this._toggleReading();
        else if (e.key === "[") this._nudgeBalloonAlpha(-0.05);
        else if (e.key === "]") this._nudgeBalloonAlpha(0.05);
        else if (e.key === "?" || e.key === "h") this._toggleHelp();
        else if (e.key === "+" || e.key === "=") this._zoomBy(1.2);
        else if (e.key === "-" || e.key === "_") this._zoomBy(1 / 1.2);
        else if (e.key === "0") this._resetView();
      };
      window.addEventListener("keydown", this._onKey);
      this._bindPointer();

      // deep-link: navegação por #cena=N
      this._onHash = () => { const idx = this._readHash(); if (idx !== this.i) this.go(idx, true); };
      window.addEventListener("hashchange", this._onHash);

      // reposiciona o balão se a janela mudar de tamanho
      this._onResize = () => this._repositionBalloon();
      window.addEventListener("resize", this._onResize);

      // contexto exposto aos hooks enter() das cenas
      this.ctx = {
        svg: this.svg, layer: this.layer,
        el: (id) => this.nodes.get(id)?.group,
        shape: (id) => this.nodes.get(id)?.group.querySelector(".xp-shape"),
        show: (id) => this._toggle(id, true),
        hide: (id) => this._toggle(id, false),
        reveal: (target, stagger = 80) => this.reveal(target, stagger),
        moveTo: (id, x, y) => this.moveTo(id, x, y),
        drawArrow: (id) => this.drawArrow(id),
        setBars: (id, vals) => this.setBars(id, vals),
        setLabel: (id, text) => this.setLabel(id, text),
        lightCells: (id, cells) => this.lightCells(id, cells),
        pulse: (id, on = true) => this.nodes.get(id)?.group.classList.toggle("is-pulse", on),
        svgEl: svg,
      };

      // restaura minimapa salvo
      if (store.get("xp-minimap", "0") === "1") this.stage.classList.add("show-minimap");

      this.go(this._initialIndex());
      return this;
    }

    /* ---- zoom / pan / gestos ------------------------------------------- */
    _rootScale() {
      const rect = this.stage.getBoundingClientRect();
      return (rect.width || 1) / (this.d.width || 1200);
    }
    _applyView() {
      const v = this.view;
      this.layer.style.transform = `translate(${v.tx}px, ${v.ty}px) scale(${v.k})`;
      this._repositionBalloon();
    }
    _zoomBy(f) {
      this.view.k = clamp(this.view.k * f, 1, 4);
      if (this.view.k === 1) { this.view.tx = 0; this.view.ty = 0; }
      this._applyView();
    }
    _resetView() { this.view = { k: 1, tx: 0, ty: 0 }; this._applyView(); }
    _bindPointer() {
      const st = this.stage;
      let pan = null;
      st.addEventListener("wheel", (e) => {
        e.preventDefault();
        this._zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
      }, { passive: false });
      st.addEventListener("dblclick", () => this._resetView());
      st.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button === 0 && this.view.k > 1) {
          pan = { x: e.clientX, y: e.clientY, tx: this.view.tx, ty: this.view.ty };
          try { st.setPointerCapture(e.pointerId); } catch {}
        }
      });
      st.addEventListener("pointermove", (e) => {
        if (!pan) return;
        const r = this._rootScale();
        this.view.tx = pan.tx + (e.clientX - pan.x) / r;
        this.view.ty = pan.ty + (e.clientY - pan.y) / r;
        this.layer.style.transform = `translate(${this.view.tx}px, ${this.view.ty}px) scale(${this.view.k})`;
      });
      st.addEventListener("pointerup", () => { if (pan) { pan = null; this._repositionBalloon(); } });

      // toque: swipe p/ navegar (sem zoom), pinça p/ zoom, arrasto p/ pan (com zoom)
      const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
      let tS = null, pinch = null;
      st.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) { tS = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: this.view.tx, ty: this.view.ty }; pinch = null; }
        else if (e.touches.length === 2) { pinch = { d: dist(e.touches) || 1, k: this.view.k }; tS = null; }
      }, { passive: true });
      st.addEventListener("touchmove", (e) => {
        if (pinch && e.touches.length === 2) {
          this.view.k = clamp(pinch.k * dist(e.touches) / pinch.d, 1, 4);
          this._applyView(); e.preventDefault();
        } else if (tS && e.touches.length === 1 && this.view.k > 1) {
          const r = this._rootScale();
          this.view.tx = tS.tx + (e.touches[0].clientX - tS.x) / r;
          this.view.ty = tS.ty + (e.touches[0].clientY - tS.y) / r;
          this.layer.style.transform = `translate(${this.view.tx}px, ${this.view.ty}px) scale(${this.view.k})`;
          e.preventDefault();
        }
      }, { passive: false });
      st.addEventListener("touchend", (e) => {
        if (tS && this.view.k === 1 && e.changedTouches.length) {
          const dx = e.changedTouches[0].clientX - tS.x, dy = e.changedTouches[0].clientY - tS.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? this.next() : this.prev());
        }
        tS = null; pinch = null;
        this._repositionBalloon();
      });
    }

    /* ---- modo debug (tecla d): grade de coordenadas + ids -------------- */
    _toggleDebug() {
      this.debug = !this.debug;
      if (this.debug && !this.dbgLayer) this._buildDebug();
      if (this.dbgLayer) this.dbgLayer.style.display = this.debug ? "" : "none";
    }
    _buildDebug() {
      const W = this.d.width || 1200, H = this.d.height || 700, S = 100;
      const g = svg("g", { class: "xp-debug" });
      for (let x = 0; x <= W; x += S) {
        g.appendChild(svg("line", { class: "xp-grid", x1: x, y1: 0, x2: x, y2: H }));
        g.appendChild(svg("text", { class: "xp-grid-t", x: x + 2, y: 12 })).textContent = x;
      }
      for (let y = 0; y <= H; y += S) {
        g.appendChild(svg("line", { class: "xp-grid", x1: 0, y1: y, x2: W, y2: y }));
        if (y > 0) g.appendChild(svg("text", { class: "xp-grid-t", x: 2, y: y - 2 })).textContent = y;
      }
      this.nodes.forEach((node, id) => {
        const d = node.def;
        const m = !d.x && d.path ? /M\s*([\d.]+)[ ,]([\d.]+)/.exec(d.path) : null;
        const px = d.x != null ? d.x : (d.x1 != null ? d.x1 : (m ? +m[1] : 0));
        const py = d.y != null ? d.y : (d.y1 != null ? d.y1 : (m ? +m[2] : 0));
        const t = svg("text", { class: "xp-dbg-id", x: px + 3, y: py - 3 });
        t.textContent = id;
        g.appendChild(t);
      });
      this.dbgLayer = g;
      this.layer.appendChild(g);
    }

    _defs() {
      const defs = svg("defs");
      const m = svg("marker", {
        id: "xp-arrowhead", viewBox: "0 0 10 10", refX: "8", refY: "5",
        markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse",
      });
      m.appendChild(svg("path", { d: "M0,0 L10,5 L0,10 z", fill: "var(--accent)" }));
      defs.appendChild(m);
      return defs;
    }

    /* ---- expande "@grupo" para a lista de ids -------------------------- */
    _ids(list) {
      const out = [];
      (list || []).forEach((id) => {
        if (typeof id === "string" && id[0] === "@") (this.groups.get(id.slice(1)) || []).forEach((x) => out.push(x));
        else out.push(id);
      });
      return out;
    }

    /* ---- validação dos dados (avisa no console) ------------------------ */
    _validate() {
      const ids = new Set(this.nodes.keys());
      const warn = [];
      this.steps.forEach((s, i) => {
        const a = s.balloon && s.balloon.anchor;
        if (typeof a === "string" && !ids.has(a)) warn.push(`cena ${i + 1}: âncora "${a}" não existe`);
        ["show", "hide", "highlight", "dim", "pulse"].forEach((k) =>
          this._ids(s[k]).forEach((id) => { if (!ids.has(id)) warn.push(`cena ${i + 1}: ${k} → "${id}" não existe`); }));
        if (s.quiz && (!Array.isArray(s.quiz.options) || s.quiz.answer == null))
          warn.push(`cena ${i + 1}: quiz precisa de options[] e answer`);
        if (Array.isArray(s.exercises)) s.exercises.forEach((ex, j) => {
          const w = this._validateExercise(ex);
          if (w) warn.push(`cena ${i + 1}: exercício ${j + 1} (${ex && ex.kind || "?"}) — ${w}`);
        });
      });
      if (warn.length) console.warn(`[Explainer] "${this.d.title || ""}" tem ${warn.length} aviso(s):\n  - ` + warn.join("\n  - "));
      return warn;
    }

    // valida um exercício por kind; devolve string de erro ou null
    _validateExercise(ex) {
      if (!ex || typeof ex !== "object") return "não é um objeto";
      switch (ex.kind || "choice") {
        case "choice":
          if (!Array.isArray(ex.options) || ex.options.length < 2) return "precisa de options[] (≥2)";
          if (ex.answer == null || ex.answer < 0 || ex.answer >= ex.options.length) return "answer inválido";
          return null;
        case "fill":
          if (!ex.sentence || !ex.sentence.includes("___")) return "sentence precisa conter '___'";
          if (ex.answer == null) return "precisa de answer";
          return null;
        case "match":
          if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) return "precisa de pairs[] (≥2)";
          if (!ex.pairs.every((p) => Array.isArray(p) && p.length === 2)) return "cada par precisa ser [a, b]";
          return null;
        case "order":
          if (!Array.isArray(ex.answer) || ex.answer.length < 2) return "precisa de answer[] (≥2)";
          return null;
        case "flashcards":
          if (!Array.isArray(ex.cards) || !ex.cards.length) return "precisa de cards[]";
          if (!ex.cards.every((c) => c && c.front != null && c.back != null)) return "cada card precisa de front/back";
          return null;
        default:
          return `kind desconhecido: "${ex.kind}"`;
      }
    }

    /* ---- renderização declarativa de cada elemento --------------------- */
    _renderElement(def) {
      const g = svg("g", { class: "xp-node", "data-type": def.type || "box", "data-id": def.id });
      if (def.className) g.classList.add(def.className);
      if (def.base) g.classList.add("is-shown");

      switch (def.type) {
        case "arrow":   this._buildArrow(g, def); break;
        case "vector":  this._buildVector(g, def); break;
        case "matrix":  this._buildMatrix(g, def); break;
        case "label":   this._buildLabel(g, def); break;
        case "token":
        case "box":
        default:        this._buildBox(g, def); break;
      }
      this.layer.appendChild(g);
      this.nodes.set(def.id, { def, group: g });
    }

    _buildBox(g, def) {
      const w = def.w || 120, h = def.h || 48;
      g.appendChild(svg("rect", {
        class: "xp-shape", x: def.x, y: def.y, width: w, height: h,
        rx: def.rx != null ? def.rx : 12,
      }));
      if (def.fill) g.querySelector(".xp-shape").style.fill = def.fill;
      if (def.stroke) g.querySelector(".xp-shape").style.stroke = def.stroke;
      if (def.style) g.querySelector(".xp-shape").style.cssText += ";" + def.style;
      const cx = def.x + w / 2;
      const lines = Array.isArray(def.label) ? def.label : (def.label != null ? def.label.split("\n") : []);
      const total = lines.length;
      lines.forEach((ln, k) => {
        const t = svg("text", {
          class: "xp-text" + (def.mono ? " xp-text--mono" : "") + (k > 0 ? " xp-text--sub" : ""),
          x: cx, y: def.y + h / 2 + (k - (total - 1) / 2) * 16,
          "text-anchor": "middle",
        });
        t.textContent = ln;
        g.appendChild(t);
      });
    }

    _buildLabel(g, def) {
      const t = svg("text", {
        class: "xp-text" + (def.sub ? " xp-text--sub" : "") + (def.mono ? " xp-text--mono" : ""),
        x: def.x, y: def.y, "text-anchor": def.anchor || "start",
      });
      if (def.size) t.style.fontSize = def.size + "px";
      if (def.style) t.style.cssText += ";" + def.style;
      t.textContent = def.label || "";
      g.appendChild(t);
    }

    _buildArrow(g, def) {
      const p = def.path || `M${def.x1},${def.y1} L${def.x2},${def.y2}`;
      const path = svg("path", { class: "xp-arrow is-draw", d: p });
      if (def.color) path.style.stroke = def.color;
      if (def.noHead) path.style.markerEnd = "none";
      if (def.dashed) {
        path.classList.remove("is-draw");
        path.style.strokeDasharray = "6 7";
      }
      g.appendChild(path);
      if (!def.dashed) requestAnimationFrame(() => {
        const len = Math.ceil(path.getTotalLength());
        path.style.setProperty("--len", len);
      });
    }

    _buildVector(g, def) {
      const w = def.w || 26, n = (def.values || []).length || 6;
      const bh = def.h || 90, x = def.x, y = def.y;
      g.dataset.bw = w; g.dataset.bh = bh;
      g.appendChild(svg("rect", { class: "xp-shape", x: x - 5, y: y - 7, width: w + 10, height: bh + 14, rx: 8 }));
      const cw = w / n;
      const color = def.color || "var(--good)";
      (def.values || Array.from({ length: n }, () => 0.5)).forEach((v, k) => {
        const bh2 = clamp(v, .05, 1) * bh;
        g.appendChild(svg("rect", {
          class: "xp-bar", x: x + k * cw + 1, y: y + (bh - bh2),
          width: cw - 2, height: bh2, rx: 2, fill: color,
        }));
      });
      if (def.label) {
        const t = svg("text", { class: "xp-text xp-text--sub", x: x + w / 2, y: y + bh + 22, "text-anchor": "middle" });
        t.textContent = def.label;
        g.appendChild(t);
      }
    }

    _buildMatrix(g, def) {
      const rows = def.rows, cols = def.cols, cell = def.cell || 34;
      const x = def.x, y = def.y;
      g.appendChild(svg("rect", {
        class: "xp-shape", x: x - 6, y: y - 6, width: cols * cell + 12, height: rows * cell + 12, rx: 8,
      }));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          g.appendChild(svg("rect", {
            class: "xp-cell", "data-r": r, "data-c": c,
            x: x + c * cell, y: y + r * cell, width: cell - 2, height: cell - 2, rx: 4,
            fill: def.color || "var(--accent-2)",
          }));
        }
      }
    }

    /* ---- helpers de animação expostos aos hooks enter() ---------------- */
    moveTo(id, x, y) {
      const node = this.nodes.get(id);
      if (!node) return;
      node.group.style.transform = `translate(${x}px, ${y}px)`;
    }
    drawArrow(id) {
      this.nodes.get(id)?.group.querySelector(".xp-arrow")?.classList.add("is-shown");
    }
    reveal(target, stagger = 80) {
      const ids = (typeof target === "string" && this.groups.has(target))
        ? this.groups.get(target)
        : (Array.isArray(target) ? target : [target]);
      ids.forEach((id, k) => setTimeout(() => this._toggle(id, true), k * stagger));
    }
    setBars(id, vals) {
      const node = this.nodes.get(id);
      if (!node) return;
      const bars = node.group.querySelectorAll(".xp-bar");
      const bh = +node.group.dataset.bh || 90;
      const baseY = +node.def.y;
      bars.forEach((bar, k) => {
        if (vals[k] == null) return;
        const h = clamp(vals[k], .05, 1) * bh;
        bar.setAttribute("height", h);
        bar.setAttribute("y", baseY + (bh - h));
      });
    }
    // troca o texto de um elemento (label/box). Útil p/ contadores ao vivo.
    setLabel(id, text) {
      const t = this.nodes.get(id)?.group.querySelector(".xp-text");
      if (t) t.textContent = text;
    }
    lightCells(id, cells) {
      const node = this.nodes.get(id);
      if (!node) return;
      node.group.querySelectorAll(".xp-cell").forEach((c) => (c.style.fillOpacity = 0));
      cells.forEach(([r, c, o], idx) => {
        const cell = node.group.querySelector(`.xp-cell[data-r="${r}"][data-c="${c}"]`);
        if (cell) setTimeout(() => { cell.style.fillOpacity = o != null ? o : .9; }, idx * 90);
      });
    }

    _toggle(id, on) {
      this.nodes.get(id)?.group.classList.toggle("is-shown", on);
    }

    /* ---- aplica o estado declarativo de uma cena ----------------------- */
    _applyStep(idx) {
      const s = this.steps[idx];
      const visible = new Set();
      (this.d.elements || []).forEach((d) => { if (d.base) visible.add(d.id); });
      for (let k = 0; k <= idx; k++) {
        this._ids(this.steps[k].show).forEach((id) => visible.add(id));
        this._ids(this.steps[k].hide).forEach((id) => visible.delete(id));
      }
      this.nodes.forEach((node, id) => {
        node.group.classList.toggle("is-shown", visible.has(id));
        node.group.classList.remove("is-highlight", "is-dim", "is-pulse");
        node.group.querySelector(".xp-arrow")?.classList.remove("is-shown");
      });
      visible.forEach((id) => {
        const n = this.nodes.get(id);
        if (n?.def.type === "arrow") this.drawArrow(id);
      });

      this._ids(s.highlight).forEach((id) => this.nodes.get(id)?.group.classList.add("is-highlight"));
      this._ids(s.dim).forEach((id) => this.nodes.get(id)?.group.classList.add("is-dim"));
      this._ids(s.pulse).forEach((id) => this.nodes.get(id)?.group.classList.add("is-pulse"));

      this._showBalloon(s);
      this._announce(s);

      if (typeof s.enter === "function") {
        setTimeout(() => { try { s.enter(this.ctx); } catch (e) { console.error(e); } }, 120);
      }
    }

    _announce(s) {
      const parts = [s.title, s.balloon && s.balloon.text, s.quiz && s.quiz.question].filter(Boolean);
      this.live.textContent = parts.map(stripHtml).join(". ");
    }

    /* ---- balão ancorado a um elemento (+ quiz opcional) ---------------- */
    _showBalloon(s) {
      // saída suave de TODOS os balões anteriores (não só do primeiro), senão,
      // ao avançar rápido, balões intermediários ficariam órfãos e empilhados.
      [...this.balloons.children].forEach((old) => {
        if (old.dataset.leaving) return;
        old.dataset.leaving = "1";
        old.classList.remove("is-visible");
        setTimeout(() => old.remove(), 280);
      });
      const hasEx = Array.isArray(s.exercises) && s.exercises.length > 0;
      if (!s.balloon && !s.quiz && !hasEx) return;
      const b = s.balloon || {};
      const node = el("div", { class: "xp-balloon" + (s.quiz || hasEx ? " is-quiz" : "") });
      let html = "";
      if (s.title) html += `<h3><span class="xp-badge">${this.i + 1}</span>${s.title}<button type="button" class="xp-balloon-collapse" aria-label="Recolher ou expandir balão" title="Recolher/expandir">▾</button><span class="xp-drag-grip" aria-hidden="true">⠿</span></h3>`;
      if (b.text) html += `<p>${b.text}</p>`;
      if (b.why) html += `<div class="xp-why">${b.why}</div>`;
      if (b.deep) html += `<button type="button" class="xp-balloon-more">🔎 Saiba mais</button>`;
      node.innerHTML = html;
      if (b.deep) node.querySelector(".xp-balloon-more").addEventListener("click", (e) => {
        e.stopPropagation();
        this._showDeep(s);
      });
      if (s.quiz) this._buildQuiz(node, s.quiz, this.i);
      if (hasEx) s.exercises.forEach((act, i) => this._buildActivity(node, act, this.i, i));
      const place = (b.anchor && b.placement) || b.placement || "right";
      node.dataset.place = place;
      node._anchor = b.anchor;
      node._dragDx = 0;
      node._dragDy = 0;
      this._bindBalloonDrag(node);
      this._bindBalloonCollapse(node);
      this.balloons.appendChild(node);

      requestAnimationFrame(() => {
        this._placeBalloon(node);
        requestAnimationFrame(() => node.classList.add("is-visible"));
      });
    }

    // posiciona (ou reposiciona) um balão já criado, ancorando-o ao elemento/ponto
    _placeBalloon(node) {
      const place = node.dataset.place || "right";
      const pt = this._anchorPoint(node._anchor);
      const bw = node.offsetWidth, bh = node.offsetHeight, gap = 22;
      let left = pt.x, top = pt.y;
      if (place === "right") { left = pt.x + gap; top = pt.y - bh / 2; }
      else if (place === "left") { left = pt.x - bw - gap; top = pt.y - bh / 2; }
      else if (place === "top") { left = pt.x - bw / 2; top = pt.y - bh - gap; }
      else if (place === "bottom") { left = pt.x - bw / 2; top = pt.y + gap; }
      left += node._dragDx || 0;
      top += node._dragDy || 0;
      const rect = this.stage.getBoundingClientRect();
      left = clamp(left, 12, rect.width - bw - 12);
      top = clamp(top, 12, rect.height - bh - 12);
      node.style.left = left + "px";
      node.style.top = top + "px";
      if (place === "top" || place === "bottom") node.style.setProperty("--tail", clamp(pt.x - left - 8, 14, bw - 30) + "px");
      else node.style.setProperty("--tail", clamp(pt.y - top - 8, 14, bh - 30) + "px");
    }
    _repositionBalloon() {
      const node = this.balloons.querySelector(".xp-balloon:not([data-leaving])");
      if (node) this._placeBalloon(node);
    }

    // arrastar o balão pelo cabeçalho (h3) para não atrapalhar a leitura do diagrama
    _bindBalloonDrag(node) {
      const handle = node.querySelector("h3");
      if (!handle) return;
      let drag = null;
      handle.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        drag = { x: e.clientX, y: e.clientY, dx: node._dragDx || 0, dy: node._dragDy || 0 };
        node.classList.add("is-dragging");
        try { handle.setPointerCapture(e.pointerId); } catch {}
        e.stopPropagation();
      });
      handle.addEventListener("pointermove", (e) => {
        if (!drag) return;
        node._dragDx = drag.dx + (e.clientX - drag.x);
        node._dragDy = drag.dy + (e.clientY - drag.y);
        this._placeBalloon(node);
        e.stopPropagation();
      });
      const endDrag = (e) => {
        if (!drag) return;
        drag = null;
        node.classList.remove("is-dragging");
        e.stopPropagation();
      };
      handle.addEventListener("pointerup", endDrag);
      handle.addEventListener("pointercancel", endDrag);
      handle.addEventListener("dblclick", (e) => {
        node._dragDx = 0;
        node._dragDy = 0;
        this._placeBalloon(node);
        e.stopPropagation();
      });
    }

    // recolhe o balão a uma pílula (só o título) pra não tampar o diagrama;
    // sempre nasce expandido — o usuário recolhe manualmente se quiser (▾)
    _bindBalloonCollapse(node) {
      const btn = node.querySelector(".xp-balloon-collapse");
      if (!btn) return;
      btn.addEventListener("pointerdown", (e) => e.stopPropagation());
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        node.classList.toggle("is-collapsed");
        this._placeBalloon(node);
      });
    }

    _buildQuiz(node, q, stepIdx) {
      const wrap = el("div", { class: "xp-quiz" });
      if (q.question) wrap.appendChild(el("div", { class: "xp-quiz-q" }, q.question));
      const opts = el("div", { class: "xp-quiz-opts" });
      const settle = (chosen) => {
        wrap.dataset.done = "1";
        [...opts.children].forEach((b, bi) => {
          b.disabled = true;
          if (bi === q.answer) b.classList.add("is-correct");
          else if (bi === chosen) b.classList.add("is-wrong");
          else b.classList.add("is-mute");
        });
        if (q.explain) {
          const ex = el("div", { class: "xp-quiz-explain" }, (chosen === q.answer ? "✅ " : "❌ ") + q.explain);
          wrap.appendChild(ex);
          requestAnimationFrame(() => ex.classList.add("is-visible"));
        }
      };
      q.options.forEach((opt, oi) => {
        const btn = el("button", { class: "xp-quiz-opt" }, opt);
        btn.addEventListener("click", () => {
          if (wrap.dataset.done) return;
          this.quizState.set(stepIdx, oi);   // lembra a resposta nesta sessão
          settle(oi);
          // se o autoplay tinha parado neste quiz, retoma após ler a explicação
          if (this._pausedForQuiz) {
            this._pausedForQuiz = false;
            setTimeout(() => { if (!this.playing) this.play(); }, 1600);
          }
        });
        opts.appendChild(btn);
      });
      wrap.appendChild(opts);
      node.appendChild(wrap);
      // se já respondeu antes (navegou e voltou), mostra o resultado de novo
      if (this.quizState.has(stepIdx)) settle(this.quizState.get(stepIdx));
    }

    /* ---- exercícios interativos genéricos (step.exercises[]) ------------ *
     * kinds: "choice" | "fill" | "match" | "order" | "flashcards".
     * Cada exercício é autocontido e idempotente (rebuild ao navegar). O
     * resultado fica em this.exState (chave "cena:i") para retomar o autoplay
     * e re-mostrar o gabarito ao voltar para a cena.                        */
    _buildActivity(node, act, stepIdx, i) {
      const kind = act.kind || "choice";
      const key = stepIdx + ":" + i;
      const solved = this.exState.has(key);
      const wrap = el("div", { class: "xp-ex xp-ex--" + kind });
      const prompt = act.prompt || act.question;
      if (prompt) wrap.appendChild(el("div", { class: "xp-ex-q" }, prompt));
      const bodyEl = el("div", { class: "xp-ex-body" });
      wrap.appendChild(bodyEl);
      node.appendChild(wrap);

      const finish = (correct) => {
        if (wrap.dataset.done) return;
        wrap.dataset.done = "1";
        wrap.classList.add(correct ? "is-ok" : "is-bad");
        if (act.explain) {
          const ex = el("div", { class: "xp-ex-explain" }, (correct ? "✅ " : "❌ ") + act.explain);
          wrap.appendChild(ex);
          requestAnimationFrame(() => ex.classList.add("is-visible"));
        }
        this.exState.set(key, { correct: !!correct });
        this._resumeIfAnswered(stepIdx);
      };

      const builders = {
        choice: () => this._exChoiceBody(bodyEl, act, finish, solved),
        fill: () => this._exFillBody(bodyEl, act, finish, solved),
        match: () => this._exMatchBody(bodyEl, act, finish, solved),
        order: () => this._exOrderBody(bodyEl, act, finish, solved),
        flashcards: () => this._exFlashBody(bodyEl, act, finish, solved),
      };
      (builders[kind] || builders.choice)();

      // ao voltar para a cena já resolvida, mostra o gabarito + explicação
      if (solved && kind !== "flashcards") {
        wrap.dataset.done = "1";
        wrap.classList.add(this.exState.get(key).correct ? "is-ok" : "is-bad");
        if (act.explain) wrap.appendChild(el("div", { class: "xp-ex-explain is-visible" }, act.explain));
      }
    }

    _exChoiceBody(body, act, finish, solved) {
      const opts = el("div", { class: "xp-ex-opts" });
      (act.options || []).forEach((opt, oi) => {
        const btn = el("button", { class: "xp-ex-opt", type: "button" }, opt);
        if (solved) {
          btn.disabled = true;
          if (oi === act.answer) btn.classList.add("is-correct");
        } else {
          btn.addEventListener("click", () => {
            if (body.dataset.done) return;
            body.dataset.done = "1";
            [...opts.children].forEach((b, bi) => {
              b.disabled = true;
              if (bi === act.answer) b.classList.add("is-correct");
              else if (bi === oi) b.classList.add("is-wrong");
              else b.classList.add("is-mute");
            });
            finish(oi === act.answer);
          });
        }
        opts.appendChild(btn);
      });
      body.appendChild(opts);
    }

    _fillAnswer(act) { return Array.isArray(act.answer) ? act.answer[0] : act.answer; }
    _fillMatch(act, val) {
      const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, " ");
      const accept = [].concat(act.answer || [], act.accept || []).map(norm);
      return accept.includes(norm(val));
    }
    _exFillBody(body, act, finish, solved) {
      const parts = String(act.sentence || "___").split("___");
      const line = el("div", { class: "xp-ex-fill-line" });
      line.appendChild(document.createTextNode(parts[0] || ""));
      const slot = el("span", { class: "xp-ex-slot" }, solved ? this._fillAnswer(act) : "____");
      if (solved) slot.classList.add("is-correct");
      line.appendChild(slot);
      line.appendChild(document.createTextNode(parts.slice(1).join("___") || ""));
      body.appendChild(line);
      if (solved) return;
      const check = (val) => {
        const ok = this._fillMatch(act, val);
        slot.textContent = val || "____";
        slot.classList.add(ok ? "is-correct" : "is-wrong");
        if (!ok) line.appendChild(el("span", { class: "xp-ex-correct" }, " → " + this._fillAnswer(act)));
        finish(ok);
      };
      if (Array.isArray(act.options) && act.options.length) {
        const chips = el("div", { class: "xp-ex-chips" });
        act.options.forEach((opt) => {
          const b = el("button", { class: "xp-ex-chip", type: "button" }, opt);
          b.addEventListener("click", () => {
            if (body.dataset.done) return;
            body.dataset.done = "1";
            [...chips.children].forEach((x) => (x.disabled = true));
            check(opt);
          });
          chips.appendChild(b);
        });
        body.appendChild(chips);
      } else {
        const form = el("form", { class: "xp-ex-inputrow" });
        const input = el("input", { class: "xp-ex-input", type: "text", placeholder: "digite aqui…", "aria-label": "Sua resposta" });
        const send = el("button", { class: "xp-ex-send", type: "submit" }, "Conferir");
        form.append(input, send);
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (body.dataset.done || !input.value.trim()) return;
          body.dataset.done = "1";
          input.disabled = true; send.disabled = true;
          check(input.value.trim());
        });
        body.appendChild(form);
      }
    }

    _exMatchBody(body, act, finish, solved) {
      const pairs = act.pairs || [];
      const grid = el("div", { class: "xp-ex-match" });
      const left = el("div", { class: "xp-ex-col" });
      const right = el("div", { class: "xp-ex-col" });
      const order = solved ? pairs.map((_, i) => i) : this._shuffle(pairs.map((_, i) => i));
      const leftBtns = [], rightBtns = [];
      pairs.forEach(([l], li) => {
        const b = el("button", { class: "xp-ex-cell", type: "button" }, l);
        b.dataset.li = String(li); leftBtns.push(b); left.appendChild(b);
      });
      order.forEach((ri) => {
        const b = el("button", { class: "xp-ex-cell", type: "button" }, pairs[ri][1]);
        b.dataset.ri = String(ri); rightBtns.push(b); right.appendChild(b);
      });
      grid.append(left, right);
      body.appendChild(grid);
      if (solved) {
        [...leftBtns, ...rightBtns].forEach((b) => { b.disabled = true; b.classList.add("is-correct"); });
        return;
      }
      const state = { sel: null, matched: 0, wrong: false };
      const pick = (btn, side) => {
        if (btn.classList.contains("is-done") || body.dataset.done) return;
        if (!state.sel) { state.sel = { btn, side }; btn.classList.add("is-sel"); return; }
        if (state.sel.side === side) { state.sel.btn.classList.remove("is-sel"); state.sel = { btn, side }; btn.classList.add("is-sel"); return; }
        const a = side === "left" ? btn : state.sel.btn;   // botão da esquerda
        const bb = side === "left" ? state.sel.btn : btn;  // botão da direita
        a.classList.remove("is-sel"); bb.classList.remove("is-sel");
        if (a.dataset.li === bb.dataset.ri) {
          a.classList.add("is-done", "is-correct"); bb.classList.add("is-done", "is-correct");
          a.disabled = true; bb.disabled = true; state.matched++;
          if (state.matched === pairs.length) { body.dataset.done = "1"; finish(!state.wrong); }
        } else {
          state.wrong = true;
          a.classList.add("is-wrong"); bb.classList.add("is-wrong");
          setTimeout(() => { a.classList.remove("is-wrong"); bb.classList.remove("is-wrong"); }, 520);
        }
        state.sel = null;
      };
      leftBtns.forEach((b) => b.addEventListener("click", () => pick(b, "left")));
      rightBtns.forEach((b) => b.addEventListener("click", () => pick(b, "right")));
    }

    _normWord(s) { return String(s).trim().toLowerCase().replace(/[.,!?;:]/g, ""); }
    _exOrderBody(body, act, finish, solved) {
      const answer = act.answer || [];
      const answerRow = el("div", { class: "xp-ex-order-answer" });
      body.appendChild(answerRow);
      if (solved) {
        answer.forEach((w) => answerRow.appendChild(el("span", { class: "xp-ex-word is-correct" }, w)));
        return;
      }
      const pool = (act.words && act.words.length ? act.words.slice() : this._shuffle(answer.slice()));
      const poolRow = el("div", { class: "xp-ex-order-pool" });
      const chosen = [];
      pool.forEach((w) => {
        const b = el("button", { class: "xp-ex-word", type: "button" }, w);
        b.addEventListener("click", () => {
          if (b.disabled || body.dataset.done) return;
          b.disabled = true; b.classList.add("is-used");
          chosen.push(w);
          answerRow.appendChild(el("span", { class: "xp-ex-word" }, w));
          if (chosen.length === answer.length) {
            body.dataset.done = "1";
            const ok = chosen.every((c, i) => this._normWord(c) === this._normWord(answer[i]));
            [...answerRow.children].forEach((c) => c.classList.add(ok ? "is-correct" : "is-wrong"));
            if (!ok) body.appendChild(el("div", { class: "xp-ex-correct" }, "✔ " + answer.join(" ")));
            finish(ok);
          }
        });
        poolRow.appendChild(b);
      });
      const reset = el("button", { class: "xp-ex-reset", type: "button" }, "↺ limpar");
      reset.addEventListener("click", () => {
        if (body.dataset.done) return;
        chosen.length = 0; answerRow.innerHTML = "";
        poolRow.querySelectorAll("button").forEach((b) => { b.disabled = false; b.classList.remove("is-used"); });
      });
      body.append(poolRow, reset);
    }

    _exFlashBody(body, act, finish) {
      const cards = act.cards || [];
      let idx = 0;
      const card = el("button", { class: "xp-ex-flash", type: "button", "aria-label": "Toque para virar o cartão" });
      const front = el("div", { class: "xp-ex-flash-face xp-ex-flash-front" });
      const back = el("div", { class: "xp-ex-flash-face xp-ex-flash-back" });
      card.append(front, back);
      const counter = el("div", { class: "xp-ex-flash-count" });
      const nav = el("div", { class: "xp-ex-flash-nav" });
      const prev = el("button", { class: "xp-ex-flash-btn", type: "button" }, "← anterior");
      const next = el("button", { class: "xp-ex-flash-btn", type: "button" }, "próximo →");
      nav.append(prev, next);
      const render = () => {
        const c = cards[idx] || { front: "", back: "" };
        front.innerHTML = c.front; back.innerHTML = c.back;
        card.classList.remove("is-flipped");
        counter.textContent = `${idx + 1} / ${cards.length}`;
        prev.disabled = idx === 0;
      };
      card.addEventListener("click", () => card.classList.toggle("is-flipped"));
      prev.addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
      next.addEventListener("click", () => {
        if (idx < cards.length - 1) { idx++; render(); }
        else { next.textContent = "✓ revisado"; finish(true); }
      });
      body.append(card, counter, nav);
      render();
    }

    _shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

    // true se a cena não tem atividade pendente (quiz + todos os exercises)
    _stepAnswered(idx) {
      const st = this.steps[idx];
      if (!st) return true;
      if (st.quiz && !this.quizState.has(idx)) return false;
      if (Array.isArray(st.exercises))
        for (let i = 0; i < st.exercises.length; i++) if (!this.exState.has(idx + ":" + i)) return false;
      return true;
    }
    _resumeIfAnswered(stepIdx) {
      if (this._pausedForQuiz && stepIdx === this.i && this._stepAnswered(stepIdx)) {
        this._pausedForQuiz = false;
        setTimeout(() => { if (!this.playing) this.play(); }, 1400);
      }
    }

    _anchorPoint(anchor) {
      const rect = this.stage.getBoundingClientRect();
      // âncora por id: mede o elemento real na tela (reflete viewBox, zoom e pan)
      if (typeof anchor === "string") {
        const node = this.nodes.get(anchor);
        if (node) {
          const b = node.group.getBoundingClientRect();
          return { x: b.left - rect.left + b.width / 2, y: b.top - rect.top + b.height / 2 };
        }
      }
      const p = (anchor && typeof anchor === "object")
        ? anchor : { x: (this.d.width || 1200) / 2, y: (this.d.height || 700) / 2 };
      return this._svgToScreen(p);
    }

    // converte um ponto em coords do SVG (após zoom/pan) para px relativos ao palco
    _svgToScreen(p) {
      const rect = this.stage.getBoundingClientRect();
      try {
        const m = this.layer.getScreenCTM();
        if (m && this.svg.createSVGPoint) {
          const sp = this.svg.createSVGPoint(); sp.x = p.x; sp.y = p.y;
          const r = sp.matrixTransform(m);
          return { x: r.x - rect.left, y: r.y - rect.top };
        }
      } catch {}
      // fallback (sem zoom): mapeamento manual do viewBox (preserveAspectRatio meet)
      const vw = this.d.width || 1200, vh = this.d.height || 700;
      const scale = Math.min(rect.width / vw, rect.height / vh);
      const ox = (rect.width - vw * scale) / 2, oy = (rect.height - vh * scale) / 2;
      return { x: ox + p.x * scale, y: oy + p.y * scale };
    }

    /* ---- navegação ----------------------------------------------------- */
    go(idx, fromHash) {
      idx = clamp(idx, 0, this.steps.length - 1);
      this.i = idx;
      this._applyStep(idx);
      this._syncUI();
      this._updateMinimap();
      // título da aba reflete a cena (útil ao compartilhar um deep-link)
      const st = this.steps[idx];
      try { document.title = (st.title ? st.title + " · " : "") + (this.d.title || this._baseTitle || "Explicador"); } catch {}
      // autoplay para numa cena com atividade pendente (quiz/exercícios); retoma ao responder
      const hasActivity = st.quiz || (Array.isArray(st.exercises) && st.exercises.length);
      if (this.playing && hasActivity && !this._stepAnswered(idx)) { this._pausedForQuiz = true; this.pause(); }
      else if (this.playing) this._runAutobar();
      if (!fromHash) {
        const h = "#cena=" + (idx + 1);
        try { if (location.hash !== h) history.replaceState(null, "", h); } catch {}
      }
      store.set("xp-last:" + (this.d.title || ""), String(idx));   // p/ retomar depois
    }

    // cena inicial: URL (#cena=N) tem prioridade; senão retoma a última vista
    _initialIndex() {
      const m = /cena=(\d+)/.exec(location.hash || "");
      if (m) return clamp(+m[1] - 1, 0, this.steps.length - 1);
      const last = store.get("xp-last:" + (this.d.title || ""), null);
      return last != null ? clamp(+last, 0, this.steps.length - 1) : 0;
    }
    next() { if (this.i < this.steps.length - 1) this.go(this.i + 1); else this.pause(); }
    prev() { if (this.i > 0) this.go(this.i - 1); }

    _syncUI() {
      this.btnPrev.disabled = this.i === 0;
      const atEnd = this.i === this.steps.length - 1;
      this.btnNext.disabled = false;
      this.btnNext.textContent = atEnd ? "↻ Reiniciar" : "Próximo →";
      this.btnNext.setAttribute("aria-label", atEnd ? "Reiniciar do começo" : "Próxima cena");
      this.counter.textContent = `${this.i + 1} / ${this.steps.length}`;
      this.progress.firstChild.style.width = ((this.i + 1) / this.steps.length) * 100 + "%";
      [...this.list.children].forEach((li, k) => {
        li.classList.toggle("is-active", k === this.i);
        li.classList.toggle("is-done", k < this.i);
        if (k === this.i) li.setAttribute("aria-current", "step");
        else li.removeAttribute("aria-current");
      });
      this.list.children[this.i]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    _updateMinimap() {
      if (!this.stage.classList.contains("show-minimap")) return;
      try { this.minimapSvg.innerHTML = this.layer.outerHTML; } catch {}
    }

    /* ---- ferramentas: tema, minimapa, link, apresentação --------------- */
    _applyTheme(t) { document.documentElement.dataset.theme = t; }
    _toggleTheme() {
      const t = (document.documentElement.dataset.theme === "light") ? "dark" : "light";
      this._applyTheme(t); store.set("xp-theme", t);
    }
    _toggleMinimap() {
      const on = this.stage.classList.toggle("show-minimap");
      store.set("xp-minimap", on ? "1" : "0");
      if (on) this._updateMinimap();
    }
    _togglePresent() {
      const on = this.root.classList.toggle("is-presenting");
      try {
        if (on && this.root.requestFullscreen) this.root.requestFullscreen();
        else if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      } catch {}
    }
    // esconde/mostra os balões sem sair da cena atual, pra ver o diagrama inteiro
    _togglePeek(force) {
      const on = force != null ? force : !this.root.classList.contains("is-peeking");
      this.root.classList.toggle("is-peeking", on);
      this.btnPeek.setAttribute("aria-pressed", String(on));
      this.btnPeek.title = on ? "Voltar a mostrar os balões (tecla v)" : "Espiar diagrama (tecla v)";
    }
    // painel flutuante com o slider de transparência do balão
    _buildOpacityPanel(head) {
      this.opacityPanel = el("div", { class: "xp-opacity-pop", role: "dialog", "aria-label": "Transparência do balão" });
      const label = el("label", null, "Transparência do balão");
      const row = el("div", { class: "xp-opacity-row" });
      this.opacitySlider = el("input", { type: "range", min: "15", max: "100", step: "5" });
      this.opacitySlider.value = String(Math.round((this._balloonAlpha ?? .9) * 100));
      this.opacityValue = el("output", { class: "xp-opacity-value" }, this.opacitySlider.value + "%");
      this.opacitySlider.addEventListener("input", () => {
        this._applyBalloonAlpha(this.opacitySlider.value / 100, true);
      });
      row.append(this.opacitySlider, this.opacityValue);
      label.appendChild(row);
      this.opacityPanel.appendChild(label);
      head.appendChild(this.opacityPanel);
    }
    _toggleOpacity(force) {
      const on = force != null ? force : !this.root.classList.contains("show-opacity");
      this.root.classList.toggle("show-opacity", on);
      this.btnOpacity.setAttribute("aria-expanded", String(on));
      if (on) this.opacitySlider?.focus();
    }
    _applyBalloonAlpha(v, persist) {
      v = clamp(v, .15, 1);
      this._balloonAlpha = v;
      this.root.style.setProperty("--balloon-alpha", v);
      // Safari/iOS às vezes não repinta o backdrop-filter numa mudança só de
      // custom property herdada; força o repaint direto no(s) balão(ões) visível(is).
      this.balloons?.querySelectorAll(".xp-balloon").forEach((node) => {
        node.style.setProperty("--balloon-alpha", v);
        void node.offsetHeight;
      });
      if (this.opacitySlider) this.opacitySlider.value = String(Math.round(v * 100));
      if (this.opacityValue) this.opacityValue.textContent = Math.round(v * 100) + "%";
      if (persist) store.set("xp-balloon-alpha", String(v));
    }
    _nudgeBalloonAlpha(delta) {
      this._applyBalloonAlpha((this._balloonAlpha ?? .9) + delta, true);
    }
    _copyLink() {
      const url = location.href;
      const done = () => { this.btnLink.textContent = "✓"; setTimeout(() => (this.btnLink.textContent = "🔗"), 1200); };
      try { navigator.clipboard ? navigator.clipboard.writeText(url).then(done, done) : done(); } catch { done(); }
    }

    /* ---- ajuda: lista de atalhos de teclado (tecla ? ou h) ------------- */
    _toggleHelp(force) {
      if (!this.help) this._buildHelp();
      const on = force != null ? force : !this.root.classList.contains("show-help");
      this.root.classList.toggle("show-help", on);
      this.help.setAttribute("aria-hidden", on ? "false" : "true");
      this.btnHelp.setAttribute("aria-expanded", on ? "true" : "false");
      if (on) this.help.querySelector(".xp-help-close")?.focus();
      else this.btnHelp.focus();
    }
    _buildHelp() {
      // lista genérica: vale para todos os explicadores (nada específico de dados)
      const rows = [
        ["← →", "Cena anterior / próxima"],
        ["Espaço", "Reproduzir / pausar"],
        ["f", "Modo apresentação (tela cheia)"],
        ["m", "Minimapa"],
        ["d", "Modo debug (grade + ids)"],
        ["v", "Espiar diagrama (esconder balões)"],
        ["r", "Modo leitura (recap de todas as cenas)"],
        ["[ ]", "Diminuir / aumentar transparência do balão"],
        ["+ −", "Zoom; arraste para mover"],
        ["0", "Resetar zoom"],
        ["? h", "Esta ajuda"],
      ];
      const overlay = el("div", { class: "xp-help", role: "dialog", "aria-modal": "true",
        "aria-label": "Atalhos de teclado", "aria-hidden": "true" });
      const card = el("div", { class: "xp-help-card" });
      card.appendChild(el("h2", null, "Atalhos de teclado"));
      const dl = el("dl", { class: "xp-help-list" });
      rows.forEach(([k, desc]) => {
        const keys = el("dt");
        k.split(" ").forEach((key) => keys.appendChild(el("kbd", null, key)));
        dl.appendChild(keys);
        dl.appendChild(el("dd", null, desc));
      });
      card.appendChild(dl);
      const close = el("button", { class: "xp-btn xp-help-close" }, "Fechar");
      close.addEventListener("click", () => this._toggleHelp(false));
      card.appendChild(close);
      overlay.appendChild(card);
      // clique fora do cartão fecha
      overlay.addEventListener("click", (e) => { if (e.target === overlay) this._toggleHelp(false); });
      this.help = overlay;
      this.root.appendChild(overlay);
    }

    /* ---- painel "Saiba mais": aprofundamento opcional de uma cena ------ */
    _buildDeepPanel() {
      const overlay = el("div", { class: "xp-deep", role: "dialog", "aria-modal": "true",
        "aria-label": "Saiba mais", "aria-hidden": "true" });
      const card = el("div", { class: "xp-deep-card" });
      this.deepTitleEl = el("h2");
      this.deepBodyEl = el("div", { class: "xp-deep-body" });
      const close = el("button", { class: "xp-btn xp-deep-close" }, "Fechar");
      close.addEventListener("click", () => this._toggleDeep(false));
      card.append(this.deepTitleEl, this.deepBodyEl, close);
      overlay.appendChild(card);
      // clique fora do cartão fecha
      overlay.addEventListener("click", (e) => { if (e.target === overlay) this._toggleDeep(false); });
      this.deep = overlay;
      this.root.appendChild(overlay);
    }
    _showDeep(s) {
      if (!this.deep) this._buildDeepPanel();
      const b = s.balloon || {};
      this.deepTitleEl.textContent = b.deepTitle || s.title || "Saiba mais";
      this.deepBodyEl.innerHTML = b.deep || "";
      this._toggleDeep(true);
    }
    _toggleDeep(force) {
      if (!this.deep) this._buildDeepPanel();
      const on = force != null ? force : !this.root.classList.contains("show-deep");
      this.root.classList.toggle("show-deep", on);
      this.deep.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) this.deep.querySelector(".xp-deep-close")?.focus();
    }

    /* ---- materiais/anexos: refs sempre à mão (diagram.materials[]) ------- */
    _buildMaterialsPanel(head) {
      const pop = el("div", { class: "xp-materials-pop", role: "menu", "aria-label": "Materiais de apoio" });
      pop.appendChild(el("div", { class: "xp-materials-title" }, "📎 Materiais de apoio"));
      const listWrap = el("div", { class: "xp-materials-list" });
      (this.d.materials || []).forEach((m) => {
        const b = el("button", { class: "xp-materials-item", role: "menuitem", type: "button" },
          `${m.icon || "📄"} ${m.label || "Material"}`);
        b.addEventListener("click", () => this._showMaterial(m));
        listWrap.appendChild(b);
      });
      pop.appendChild(listWrap);
      this.materialsPanel = pop;
      head.appendChild(pop);
    }
    _toggleMaterials(force) {
      const on = force != null ? force : !this.root.classList.contains("show-materials");
      this.root.classList.toggle("show-materials", on);
      this.btnMaterials?.setAttribute("aria-expanded", String(on));
      if (on) this.materialsPanel?.querySelector(".xp-materials-item")?.focus();
    }
    _showMaterial(m) {
      if (!this.deep) this._buildDeepPanel();
      this.deepTitleEl.textContent = `${m.icon ? m.icon + " " : ""}${m.label || "Material"}`;
      this.deepBodyEl.innerHTML = m.html || "";
      this._toggleMaterials(false);
      this._toggleDeep(true);
    }

    /* ---- modo leitura: recap de todas as cenas, base p/ imprimir/exportar */
    _buildReadingPanel() {
      const overlay = el("div", { class: "xp-reading", role: "dialog", "aria-modal": "true",
        "aria-label": "Modo leitura", "aria-hidden": "true" });
      const card = el("div", { class: "xp-reading-card" });
      const head = el("div", { class: "xp-reading-head" });
      head.appendChild(el("h2", null, this.d.title || "Modo leitura"));
      const actions = el("div", { class: "xp-reading-actions" });
      const printBtn = el("button", { class: "xp-btn" }, "🖨️ Imprimir / Exportar PDF");
      printBtn.addEventListener("click", () => window.print());
      const close = el("button", { class: "xp-btn xp-reading-close" }, "Fechar");
      close.addEventListener("click", () => this._toggleReading(false));
      actions.append(printBtn, close);
      head.appendChild(actions);
      const body = el("div", { class: "xp-reading-body" });
      this.steps.forEach((s, i) => {
        const sec = el("section", { class: "xp-reading-scene" });
        sec.appendChild(el("h3", null, `${i + 1}. ${s.title || `Etapa ${i + 1}`}`));
        const b = s.balloon || {};
        if (b.text) sec.appendChild(el("p", null, b.text));
        if (b.why) sec.appendChild(el("div", { class: "xp-why" }, b.why));
        if (b.deep) sec.appendChild(el("div", { class: "xp-reading-deep" }, b.deep));
        if (s.quiz) {
          const q = s.quiz;
          const qw = el("div", { class: "xp-reading-quiz" });
          qw.appendChild(el("p", { class: "xp-reading-quiz-q" }, `❓ ${q.question}`));
          const ol = el("ol");
          (q.options || []).forEach((opt, oi) => {
            ol.appendChild(el("li", { class: oi === q.answer ? "is-correct" : "" }, opt));
          });
          qw.appendChild(ol);
          if (q.explain) qw.appendChild(el("p", { class: "xp-reading-quiz-explain" }, q.explain));
          sec.appendChild(qw);
        }
        if (Array.isArray(s.exercises)) s.exercises.forEach((ex) => {
          const rw = this._readingExercise(ex);
          if (rw) sec.appendChild(rw);
        });
        body.appendChild(sec);
      });
      card.append(head, body);
      overlay.appendChild(card);
      // clique fora do cartão fecha
      overlay.addEventListener("click", (e) => { if (e.target === overlay) this._toggleReading(false); });
      this.reading = overlay;
      this.root.appendChild(overlay);
    }
    // representação textual de um exercício no modo leitura/impressão
    _readingExercise(ex) {
      if (!ex) return null;
      const kind = ex.kind || "choice";
      const rw = el("div", { class: "xp-reading-quiz" });
      const head = ({ choice: "Exercício", fill: "Complete", match: "Ligue os pares", order: "Ordene a frase", flashcards: "Flashcards" })[kind] || "Exercício";
      rw.appendChild(el("p", { class: "xp-reading-quiz-q" }, `📝 ${head}${(ex.prompt || ex.question) ? ": " + (ex.prompt || ex.question) : ""}`));
      if (kind === "choice") {
        const ol = el("ol");
        (ex.options || []).forEach((o, oi) => ol.appendChild(el("li", { class: oi === ex.answer ? "is-correct" : "" }, o)));
        rw.appendChild(ol);
      } else if (kind === "fill") {
        rw.appendChild(el("p", null, ex.sentence || ""));
        rw.appendChild(el("p", { class: "xp-reading-quiz-explain" }, "Resposta: " + (Array.isArray(ex.answer) ? ex.answer.join(" / ") : ex.answer)));
      } else if (kind === "match") {
        const ol = el("ul");
        (ex.pairs || []).forEach(([a, b]) => ol.appendChild(el("li", { class: "is-correct" }, `${a} → ${b}`)));
        rw.appendChild(ol);
      } else if (kind === "order") {
        rw.appendChild(el("p", { class: "is-correct" }, (ex.answer || []).join(" ")));
      } else if (kind === "flashcards") {
        const ol = el("ul");
        (ex.cards || []).forEach((c) => ol.appendChild(el("li", null, `${stripHtml(c.front)} — ${stripHtml(c.back)}`)));
        rw.appendChild(ol);
      }
      if (ex.explain) rw.appendChild(el("p", { class: "xp-reading-quiz-explain" }, ex.explain));
      return rw;
    }
    _toggleReading(force) {
      if (!this.reading) this._buildReadingPanel();
      const on = force != null ? force : !this.root.classList.contains("show-reading");
      this.root.classList.toggle("show-reading", on);
      this.reading.setAttribute("aria-hidden", on ? "false" : "true");
      this.btnRead?.setAttribute("aria-expanded", String(on));
      if (on) this.reading.querySelector(".xp-reading-close")?.focus();
      else this.btnRead?.focus();
    }

    /* ---- autoplay + barra de tempo da cena ----------------------------- */
    _runAutobar() {
      const fill = this.autobar.firstChild;
      this.autobar.classList.add("is-running");
      fill.style.transition = "none";
      fill.style.width = "0%";
      void fill.offsetWidth;                      // força reflow
      fill.style.transition = `width ${this.autoplayMs}ms linear`;
      fill.style.width = "100%";
    }
    _stopAutobar() {
      const fill = this.autobar.firstChild;
      this.autobar.classList.remove("is-running");
      fill.style.transition = "none";
      fill.style.width = "0%";
    }
    togglePlay() { this.playing ? this.pause() : this.play(); }
    play() {
      if (this.i >= this.steps.length - 1) this.go(0);
      this.playing = true;
      this.btnPlay.textContent = "⏸ Pausar";
      this._runAutobar();
      const tick = () => {
        if (!this.playing) return;
        if (this.i >= this.steps.length - 1) { this.pause(); return; }
        this.next();
        this.timer = setTimeout(tick, this.autoplayMs);
      };
      this.timer = setTimeout(tick, this.autoplayMs);
    }
    pause() {
      this.playing = false;
      this.btnPlay.textContent = "▶ Reproduzir";
      clearTimeout(this.timer);
      this._stopAutobar();
    }

    _readHash() {
      const m = /cena=(\d+)/.exec(location.hash || "");
      return m ? clamp(+m[1] - 1, 0, this.steps.length - 1) : 0;
    }
  }

  global.Explainer = Explainer;
})(window);
