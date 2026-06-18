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
    }

    /* ---- montagem do esqueleto da UI ----------------------------------- */
    mount(sel) {
      this.root = typeof sel === "string" ? document.querySelector(sel) : sel;
      this.root.classList.add("xp-app");
      this.root.innerHTML = "";
      this._applyTheme(store.get("xp-theme", "dark"));

      // cabeçalho + ferramentas (tema, link, apresentação)
      const head = el("header", { class: "xp-header" });
      head.appendChild(el("h1", null, this.d.title || "Explicador"));
      if (this.d.subtitle) head.appendChild(el("span", { class: "xp-sub" }, this.d.subtitle));
      const tools = el("div", { class: "xp-tools" });
      this.btnTheme = el("button", { class: "xp-icon", title: "Alternar tema", "aria-label": "Alternar tema claro/escuro" }, "🌓");
      this.btnMap = el("button", { class: "xp-icon", title: "Minimapa (m)", "aria-label": "Mostrar ou ocultar o minimapa" }, "🗺️");
      this.btnLink = el("button", { class: "xp-icon", title: "Copiar link desta cena", "aria-label": "Copiar link desta cena" }, "🔗");
      this.btnFull = el("button", { class: "xp-icon", title: "Modo apresentação (f)", "aria-label": "Entrar no modo apresentação" }, "⛶");
      const home = el("a", { class: "xp-home", href: this.d.homeHref || "../index.html" }, "↩ Todos");
      this.btnTheme.addEventListener("click", () => this._toggleTheme());
      this.btnMap.addEventListener("click", () => this._toggleMinimap());
      this.btnLink.addEventListener("click", () => this._copyLink());
      this.btnFull.addEventListener("click", () => this._togglePresent());
      tools.append(this.btnTheme, this.btnMap, this.btnLink, this.btnFull, home);
      head.appendChild(tools);
      this.root.appendChild(head);

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
      this.btnNext.addEventListener("click", () => this.next());
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
        if (e.key === "ArrowRight") this.next();
        else if (e.key === "ArrowLeft") this.prev();
        else if (e.key === " ") { e.preventDefault(); this.togglePlay(); }
        else if (e.key === "f") this._togglePresent();
        else if (e.key === "m") this._toggleMinimap();
      };
      window.addEventListener("keydown", this._onKey);

      // deep-link: navegação por #cena=N
      this._onHash = () => { const idx = this._readHash(); if (idx !== this.i) this.go(idx, true); };
      window.addEventListener("hashchange", this._onHash);

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
        lightCells: (id, cells) => this.lightCells(id, cells),
        pulse: (id, on = true) => this.nodes.get(id)?.group.classList.toggle("is-pulse", on),
        svgEl: svg,
      };

      // restaura minimapa salvo
      if (store.get("xp-minimap", "0") === "1") this.stage.classList.add("show-minimap");

      this.go(this._readHash());
      return this;
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
      });
      if (warn.length) console.warn(`[Explainer] "${this.d.title || ""}" tem ${warn.length} aviso(s):\n  - ` + warn.join("\n  - "));
      return warn;
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
      const cx = def.x + w / 2;
      const lines = Array.isArray(def.label) ? def.label : (def.label != null ? [def.label] : []);
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
      // saída suave do balão anterior
      const old = this.balloons.firstChild;
      if (old) { old.classList.remove("is-visible"); setTimeout(() => old.remove(), 260); }
      if (!s.balloon && !s.quiz) return;
      const b = s.balloon || {};
      const node = el("div", { class: "xp-balloon" + (s.quiz ? " is-quiz" : "") });
      let html = "";
      if (s.title) html += `<h3><span class="xp-badge">${this.i + 1}</span>${s.title}</h3>`;
      if (b.text) html += `<p>${b.text}</p>`;
      if (b.why) html += `<div class="xp-why">${b.why}</div>`;
      node.innerHTML = html;
      if (s.quiz) this._buildQuiz(node, s.quiz);
      const place = (b.anchor && b.placement) || b.placement || "right";
      node.dataset.place = place;
      this.balloons.appendChild(node);

      requestAnimationFrame(() => {
        const pt = this._anchorPoint(b.anchor);
        const bw = node.offsetWidth, bh = node.offsetHeight;
        const gap = 22;
        let left = pt.x, top = pt.y;
        if (place === "right") { left = pt.x + gap; top = pt.y - bh / 2; }
        else if (place === "left") { left = pt.x - bw - gap; top = pt.y - bh / 2; }
        else if (place === "top") { left = pt.x - bw / 2; top = pt.y - bh - gap; }
        else if (place === "bottom") { left = pt.x - bw / 2; top = pt.y + gap; }

        const rect = this.stage.getBoundingClientRect();
        left = clamp(left, 12, rect.width - bw - 12);
        top = clamp(top, 12, rect.height - bh - 12);
        node.style.left = left + "px";
        node.style.top = top + "px";
        if (place === "top" || place === "bottom") node.style.setProperty("--tail", clamp(pt.x - left - 8, 14, bw - 30) + "px");
        else node.style.setProperty("--tail", clamp(pt.y - top - 8, 14, bh - 30) + "px");
        requestAnimationFrame(() => node.classList.add("is-visible"));
      });
    }

    _buildQuiz(node, q) {
      const wrap = el("div", { class: "xp-quiz" });
      if (q.question) wrap.appendChild(el("div", { class: "xp-quiz-q" }, q.question));
      const opts = el("div", { class: "xp-quiz-opts" });
      q.options.forEach((opt, oi) => {
        const btn = el("button", { class: "xp-quiz-opt" }, opt);
        btn.addEventListener("click", () => {
          if (wrap.dataset.done) return;
          wrap.dataset.done = "1";
          [...opts.children].forEach((b, bi) => {
            b.disabled = true;
            if (bi === q.answer) b.classList.add("is-correct");
            else if (bi === oi) b.classList.add("is-wrong");
            else b.classList.add("is-mute");
          });
          if (q.explain) {
            const ex = el("div", { class: "xp-quiz-explain" }, (oi === q.answer ? "✅ " : "❌ ") + q.explain);
            wrap.appendChild(ex);
            requestAnimationFrame(() => ex.classList.add("is-visible"));
          }
        });
        opts.appendChild(btn);
      });
      wrap.appendChild(opts);
      node.appendChild(wrap);
    }

    _anchorPoint(anchor) {
      const rect = this.stage.getBoundingClientRect();
      let sx, sy;
      if (typeof anchor === "string") {
        const node = this.nodes.get(anchor);
        const bb = node ? node.group.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
        sx = bb.x + bb.width / 2; sy = bb.y + bb.height / 2;
      } else if (anchor && typeof anchor === "object") {
        sx = anchor.x; sy = anchor.y;
      } else {
        sx = (this.d.width || 1200) / 2; sy = (this.d.height || 700) / 2;
      }
      const vw = this.d.width || 1200, vh = this.d.height || 700;
      const scale = Math.min(rect.width / vw, rect.height / vh);
      const ox = (rect.width - vw * scale) / 2;
      const oy = (rect.height - vh * scale) / 2;
      return { x: ox + sx * scale, y: oy + sy * scale };
    }

    /* ---- navegação ----------------------------------------------------- */
    go(idx, fromHash) {
      idx = clamp(idx, 0, this.steps.length - 1);
      this.i = idx;
      this._applyStep(idx);
      this._syncUI();
      this._updateMinimap();
      if (this.playing) this._runAutobar();
      if (!fromHash) {
        const h = "#cena=" + (idx + 1);
        try { if (location.hash !== h) history.replaceState(null, "", h); } catch {}
      }
    }
    next() { if (this.i < this.steps.length - 1) this.go(this.i + 1); else this.pause(); }
    prev() { if (this.i > 0) this.go(this.i - 1); }

    _syncUI() {
      this.btnPrev.disabled = this.i === 0;
      this.btnNext.disabled = this.i === this.steps.length - 1;
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
    _copyLink() {
      const url = location.href;
      const done = () => { this.btnLink.textContent = "✓"; setTimeout(() => (this.btnLink.textContent = "🔗"), 1200); };
      try { navigator.clipboard ? navigator.clipboard.writeText(url).then(done, done) : done(); } catch { done(); }
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
