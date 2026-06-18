/* ============================================================================
 * explainer.js — Motor genérico de diagramas explicativos animados
 * ----------------------------------------------------------------------------
 * Recebe um objeto "diagram" (dados puros) e monta:
 *   - um palco SVG com os elementos declarados;
 *   - uma linha do tempo de "cenas" (steps) com balões explicativos;
 *   - controles (próximo/anterior/play/teclado), índice lateral e progresso.
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

  class Explainer {
    constructor(diagram) {
      this.d = diagram;
      this.steps = diagram.steps || [];
      this.i = -1;
      this.nodes = new Map();   // id -> { def, group }
      this.playing = false;
      this.timer = null;
      this.autoplayMs = diagram.autoplayMs || 6500;
    }

    /* ---- montagem do esqueleto da UI ----------------------------------- */
    mount(sel) {
      this.root = typeof sel === "string" ? document.querySelector(sel) : sel;
      this.root.classList.add("xp-app");
      this.root.innerHTML = "";

      // cabeçalho
      const head = el("header", { class: "xp-header" });
      head.appendChild(el("h1", null, this.d.title || "Explicador"));
      if (this.d.subtitle) head.appendChild(el("span", { class: "xp-sub" }, this.d.subtitle));
      const home = el("a", { class: "xp-home", href: this.d.homeHref || "../index.html" }, "↩ Todos os diagramas");
      head.appendChild(home);
      this.root.appendChild(head);

      // índice lateral
      const side = el("aside", { class: "xp-side" });
      side.appendChild(el("h2", null, "Etapas"));
      this.list = el("ol", { class: "xp-steplist" });
      this.steps.forEach((s, idx) => {
        const li = el("li", { "data-idx": idx });
        li.appendChild(el("span", { class: "xp-dot" }, String(idx + 1)));
        li.appendChild(el("span", { class: "xp-label" }, s.title || `Etapa ${idx + 1}`));
        li.addEventListener("click", () => this.go(idx));
        this.list.appendChild(li);
      });
      side.appendChild(this.list);
      this.root.appendChild(side);

      // palco
      this.stage = el("main", { class: "xp-stage" });
      this.svg = svg("svg", {
        viewBox: `0 0 ${this.d.width || 1200} ${this.d.height || 700}`,
        preserveAspectRatio: "xMidYMid meet",
      });
      this.svg.appendChild(this._defs());
      this.layer = svg("g", { class: "xp-canvas" });
      this.svg.appendChild(this.layer);
      this.stage.appendChild(this.svg);
      this.balloons = el("div", { class: "xp-balloon-layer" });
      this.stage.appendChild(this.balloons);
      this.root.appendChild(this.stage);

      // controles
      const ctr = el("footer", { class: "xp-controls" });
      this.btnPrev = el("button", { class: "xp-btn" }, "← Anterior");
      this.btnPlay = el("button", { class: "xp-btn" }, "▶ Reproduzir");
      this.btnNext = el("button", { class: "xp-btn xp-btn--primary" }, "Próximo →");
      this.progress = el("div", { class: "xp-progress" });
      this.progress.appendChild(el("span"));
      this.counter = el("div", { class: "xp-counter" });
      this.btnPrev.addEventListener("click", () => this.prev());
      this.btnNext.addEventListener("click", () => this.next());
      this.btnPlay.addEventListener("click", () => this.togglePlay());
      ctr.append(this.btnPrev, this.btnPlay, this.progress, this.counter, this.btnNext);
      this.root.appendChild(ctr);

      // elementos do diagrama (começam ocultos, exceto base:true)
      (this.d.elements || []).forEach((def) => this._renderElement(def));

      // teclado
      this._onKey = (e) => {
        if (e.key === "ArrowRight") { this.next(); }
        else if (e.key === "ArrowLeft") { this.prev(); }
        else if (e.key === " ") { e.preventDefault(); this.togglePlay(); }
      };
      window.addEventListener("keydown", this._onKey);

      // contexto exposto aos hooks enter() das cenas
      this.ctx = {
        svg: this.svg, layer: this.layer,
        el: (id) => this.nodes.get(id)?.group,
        shape: (id) => this.nodes.get(id)?.group.querySelector(".xp-shape"),
        show: (id) => this._toggle(id, true),
        hide: (id) => this._toggle(id, false),
        moveTo: (id, x, y) => this.moveTo(id, x, y),
        drawArrow: (id) => this.drawArrow(id),
        setBars: (id, vals) => this.setBars(id, vals),
        lightCells: (id, cells) => this.lightCells(id, cells),
        pulse: (id, on = true) => this.nodes.get(id)?.group.classList.toggle("is-pulse", on),
        svgEl: svg,
      };

      this.go(0);
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
        // linha tracejada decorativa: não usa o traçado animado (stroke-dashoffset)
        path.classList.remove("is-draw");
        path.style.strokeDasharray = "6 7";
      }
      g.appendChild(path);
      // mede comprimento p/ animar o traçado das setas normais
      if (!def.dashed) requestAnimationFrame(() => {
        const len = Math.ceil(path.getTotalLength());
        path.style.setProperty("--len", len);
      });
    }

    // vetor = coluna de barras coloridas (embeddings, Q/K/V ...)
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

    // matriz de atenção (grade de células)
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
      const node = this.nodes.get(id);
      node?.group.querySelector(".xp-arrow")?.classList.add("is-shown");
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
      const all = node.group.querySelectorAll(".xp-cell");
      all.forEach((c) => (c.style.fillOpacity = 0));
      cells.forEach(([r, c, o], idx) => {
        const cell = node.group.querySelector(`.xp-cell[data-r="${r}"][data-c="${c}"]`);
        if (cell) setTimeout(() => { cell.style.fillOpacity = o != null ? o : .9; }, idx * 90);
      });
    }

    _toggle(id, on) {
      this.nodes.get(id)?.group.classList.toggle("is-shown", on);
    }

    /* ---- aplica o estado declarativo de uma cena ----------------------- */
    _applyStep(idx, dir) {
      const s = this.steps[idx];

      // resolve o conjunto acumulado de elementos visíveis: tudo marcado
      // base:true + tudo que cenas <= idx pediram show, menos hide posteriores.
      const visible = new Set();
      (this.d.elements || []).forEach((d) => { if (d.base) visible.add(d.id); });
      for (let k = 0; k <= idx; k++) {
        (this.steps[k].show || []).forEach((id) => visible.add(id));
        (this.steps[k].hide || []).forEach((id) => visible.delete(id));
      }
      this.nodes.forEach((node, id) => {
        node.group.classList.toggle("is-shown", visible.has(id));
        node.group.classList.remove("is-highlight", "is-dim", "is-pulse");
        node.group.querySelector(".xp-arrow")?.classList.remove("is-shown");
      });
      // desenha setas visíveis
      visible.forEach((id) => {
        const n = this.nodes.get(id);
        if (n?.def.type === "arrow") this.drawArrow(id);
      });

      (s.highlight || []).forEach((id) => this.nodes.get(id)?.group.classList.add("is-highlight"));
      (s.dim || []).forEach((id) => this.nodes.get(id)?.group.classList.add("is-dim"));
      (s.pulse || []).forEach((id) => this.nodes.get(id)?.group.classList.add("is-pulse"));

      this._showBalloon(s);

      // hook sob medida da cena
      if (typeof s.enter === "function") {
        // pequeno atraso p/ as transições de visibilidade assentarem
        setTimeout(() => { try { s.enter(this.ctx); } catch (e) { console.error(e); } }, 120);
      }
    }

    /* ---- balão ancorado a um elemento ---------------------------------- */
    _showBalloon(s) {
      this.balloons.innerHTML = "";
      if (!s.balloon) return;
      const b = s.balloon;
      const node = el("div", { class: "xp-balloon" });
      let html = "";
      if (s.title) html += `<h3><span class="xp-badge">${this.i + 1}</span>${s.title}</h3>`;
      html += `<p>${b.text}</p>`;
      if (b.why) html += `<div class="xp-why">${b.why}</div>`;
      node.innerHTML = html;
      const place = b.placement || "right";
      node.dataset.place = place;
      this.balloons.appendChild(node);

      // posiciona usando as coordenadas do SVG mapeadas p/ a tela
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
        // alinha o ponteiro com a âncora
        if (place === "top" || place === "bottom") node.style.setProperty("--tail", clamp(pt.x - left - 8, 14, bw - 30) + "px");
        else node.style.setProperty("--tail", clamp(pt.y - top - 8, 14, bh - 30) + "px");
        requestAnimationFrame(() => node.classList.add("is-visible"));
      });
    }

    // converte âncora (id de elemento ou {x,y} em coords do SVG) -> px na tela
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
      // mapeia coords do viewBox p/ pixels (preserveAspectRatio xMidYMid meet)
      const vw = this.d.width || 1200, vh = this.d.height || 700;
      const scale = Math.min(rect.width / vw, rect.height / vh);
      const ox = (rect.width - vw * scale) / 2;
      const oy = (rect.height - vh * scale) / 2;
      return { x: ox + sx * scale, y: oy + sy * scale };
    }

    /* ---- navegação ----------------------------------------------------- */
    go(idx) {
      idx = clamp(idx, 0, this.steps.length - 1);
      const dir = idx >= this.i ? 1 : -1;
      this.i = idx;
      this._applyStep(idx, dir);
      this._syncUI();
    }
    next() { if (this.i < this.steps.length - 1) this.go(this.i + 1); else this.pause(); }
    prev() { if (this.i > 0) this.go(this.i - 1); }

    _syncUI() {
      this.btnPrev.disabled = this.i === 0;
      this.btnNext.disabled = this.i === this.steps.length - 1;
      this.counter.textContent = `${this.i + 1} / ${this.steps.length}`;
      this.progress.firstChild.style.width =
        ((this.i + 1) / this.steps.length) * 100 + "%";
      [...this.list.children].forEach((li, k) => {
        li.classList.toggle("is-active", k === this.i);
        li.classList.toggle("is-done", k < this.i);
      });
      this.list.children[this.i]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    /* ---- autoplay ------------------------------------------------------ */
    togglePlay() { this.playing ? this.pause() : this.play(); }
    play() {
      if (this.i >= this.steps.length - 1) this.go(0);
      this.playing = true;
      this.btnPlay.textContent = "⏸ Pausar";
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
    }
  }

  global.Explainer = Explainer;
})(window);
