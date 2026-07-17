/* Huddle "Pause the hiring / Read the team" — dot-narrative particle field.
   Scroll progress (0..1) fed via setProgress(p). Six big dots:
   1) drift as scattered "hiring noise"
   2) line up into a PAUSE glyph — 3 dots per column → "Pause the hiring."
   3) fly out to the six OUTER positions of the Huddle mark (the H shape) and
      colour in; a 7th white CENTRE dot fades in → "Read the team.", scan sweep.
   Canvas-based; eases toward its target each frame. Subtle cursor parallax. */
(function () {
  if (customElements.get('huddle-dotfield')) return;

  // six outer dots of the Huddle mark (logo viewBox coords), centre is the 7th
  var OUTER = [[4, 4], [44.4, 4], [4, 24.2], [44.4, 24.2], [4, 44.4], [44.4, 44.4]];
  var PAL = ['#0d6cce', '#df166a', '#21c0db', '#f9cc10', '#039995', '#f36f2c'];
  var SCATTER = [[0.16, 0.28], [0.82, 0.22], [0.30, 0.72], [0.72, 0.74], [0.52, 0.40], [0.22, 0.58]];
  var OFF = { r: 224, g: 232, b: 226 };

  function hexToRgb(h) { h = h.replace('#', ''); return { r: parseInt(h.substr(0, 2), 16), g: parseInt(h.substr(2, 2), 16), b: parseInt(h.substr(4, 2), 16) }; }

  class HuddleDotfield extends HTMLElement {
    connectedCallback() {
      if (this._m) return; this._m = true;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>:host{display:block;width:100%;height:100%}canvas{display:block;width:100%;height:100%}</style><canvas></canvas>';
      this.cv = root.querySelector('canvas');
      this.ctx = this.cv.getContext('2d');
      this.p = 0; this.mx = 0; this.my = 0; this.hasPtr = false;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.buildParts();
      this.center = { x: 0, y: 0 };
      this.resize();
      this._onR = () => this.resize();
      window.addEventListener('resize', this._onR, { passive: true });
      this._onM = (e) => { this.mx = e.clientX; this.my = e.clientY; this.hasPtr = true; };
      window.addEventListener('pointermove', this._onM, { passive: true });
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onR);
      window.removeEventListener('pointermove', this._onM);
    }

    setProgress(p) { this.p = Math.max(0, Math.min(1, p)); }

    buildParts() {
      this.parts = [];
      for (var i = 0; i < 6; i++) {
        this.parts.push({ x: 0, y: 0, i: i, ph: (i / 6) * 6.2832, cr: { r: OFF.r, g: OFF.g, b: OFF.b } });
      }
    }

    resize() {
      var r = this.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      this.w = r.width; this.h = r.height;
      this.cv.width = Math.max(1, Math.round(r.width * dpr));
      this.cv.height = Math.max(1, Math.round(r.height * dpr));
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.computeTargets();
      if (!this._pos) { this.parts.forEach(function (p) { p.x = p.sx; p.y = p.sy; }); this._pos = true; }
    }

    computeTargets() {
      var w = this.w, h = this.h, cx = w / 2, cy = h * 0.40, S = Math.min(w, h);
      var bw = Math.min(w * 0.94, 900), bh = Math.min(h * 0.72, 520);   // stream scatter box (wide: dots start far apart)
      var colX = S * 0.052, barH = S * 0.30;                           // pause: two columns, 3 dots each
      var rows = [0.5, 0, -0.5];
      var scale = (S * 0.135) / 20.2;                                  // huddle formation
      this.cx = cx; this.cy = cy; this.S = S;
      this.center.x = cx; this.center.y = cy;
      this.parts.forEach(function (p) {
        var i = p.i;
        p.sx = cx + (SCATTER[i][0] - 0.5) * bw;
        p.sy = cy + (SCATTER[i][1] - 0.5) * bh;
        var col = i < 3 ? -1 : 1, row = i % 3;
        p.px = cx + col * colX;
        p.py = cy + rows[row] * barH;
        var b = OUTER[i];
        p.hx = cx + (b[0] - 24.2) * scale;
        p.hy = cy + (b[1] - 24.2) * scale;
      });
    }

    loop() {
      var ctx = this.ctx, w = this.w, h = this.h, p = this.p;
      if (!w || !h) { requestAnimationFrame(this.loop); return; }
      var t = performance.now() / 1000;
      var ease = function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
      var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
      var pauseT = ease(clamp((p - 0.04) / 0.11));
      var huddleT = ease(clamp((p - 0.50) / 0.24));
      var S = this.S, cy = this.cy;
      var base = Math.max(8, S * 0.019);

      var ox = 0, oy = 0;
      if (this.hasPtr && !this.reduced) {
        var r = this.getBoundingClientRect();
        ox = ((this.mx - (r.left + w / 2)) / w) * S * 0.05;
        oy = ((this.my - (r.top + h / 2)) / h) * S * 0.05;
      }

      ctx.clearRect(0, 0, w, h);
      var lerp = this.reduced ? 1 : 0.14;
      for (var k = 0; k < this.parts.length; k++) {
        var d = this.parts[k], tx, ty;
        // aimless float: layered slow waves, larger when far from the pause formation
        var wander = (1 - pauseT) * 0.85 + 0.15;
        var sX = d.sx + (Math.cos(t * 0.42 + d.ph) * 0.055 + Math.cos(t * 0.9 + d.ph * 1.7) * 0.028) * S * wander;
        var sY = d.sy + (Math.sin(t * 0.5 + d.ph) * 0.05 + Math.sin(t * 1.05 + d.ph * 1.3) * 0.03) * S * wander;
        if (huddleT > 0) { tx = d.px + (d.hx - d.px) * huddleT; ty = d.py + (d.hy - d.py) * huddleT; }
        else { tx = sX + (d.px - sX) * pauseT; ty = sY + (d.py - sY) * pauseT; }
        d.x += (tx - d.x) * lerp;
        d.y += (ty - d.y) * lerp;

        var tgt = huddleT > 0.02 ? hexToRgb(PAL[d.i]) : OFF;
        var cf = this.reduced ? 1 : 0.09;
        d.cr.r += (tgt.r - d.cr.r) * cf;
        d.cr.g += (tgt.g - d.cr.g) * cf;
        d.cr.b += (tgt.b - d.cr.b) * cf;

        var rr = base + huddleT * base * 0.4;
        ctx.beginPath();
        ctx.fillStyle = 'rgb(' + (d.cr.r | 0) + ',' + (d.cr.g | 0) + ',' + (d.cr.b | 0) + ')';
        if (huddleT > 0.35) { ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14 * huddleT; } else { ctx.shadowBlur = 0; }
        ctx.arc(d.x + ox, d.y + oy, rr, 0, 6.2832);
        ctx.fill();
      }

      // 7th centre dot — appears (fades + pops) once the mark is assembling
      var ca = clamp((huddleT - 0.4) / 0.5);
      if (ca > 0.001) {
        var cr = base * (0.55 + 0.45 * ca);
        ctx.beginPath();
        ctx.globalAlpha = ca;
        ctx.fillStyle = '#eef2ec';
        ctx.shadowColor = '#eef2ec'; ctx.shadowBlur = 16 * ca;
        ctx.arc(this.center.x + ox, this.center.y + oy, cr, 0, 6.2832);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.shadowBlur = 0;

      // reading scan-sweep while the mark assembles
      if (huddleT > 0.001 && huddleT < 0.999) {
        var sy = cy - S * 0.34 + huddleT * S * 0.68;
        var a = 0.42 * (1 - huddleT) + 0.12;
        var g = ctx.createLinearGradient(0, sy - 34, 0, sy + 34);
        g.addColorStop(0, 'rgba(33,192,219,0)');
        g.addColorStop(0.5, 'rgba(120,224,240,' + a.toFixed(3) + ')');
        g.addColorStop(1, 'rgba(33,192,219,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, sy - 34, w, 68);
      }
      requestAnimationFrame(this.loop);
    }
  }

  customElements.define('huddle-dotfield', HuddleDotfield);
})();
