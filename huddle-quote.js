/* Huddle "in action" quote panel — pinned, scroll-driven ring lockup.
   Self-contained web component (own 220vh pin + scroll animation) so it can be
   dropped onto any page. Ported from the landing page's quote beat. */
(function () {
  if (customElements.get('huddle-quote')) return;

  var HTML = `
  <style>
    :host{display:block}
    .q-track{height:220vh;position:relative}
    .q-sticky{position:sticky;top:0;height:100vh;overflow:hidden;background:#10171F}
    .q-video{position:absolute;top:-80px;left:0;width:100%;height:calc(100% + 160px);object-fit:cover;opacity:.85;transform:translateY(0px) scale(1.05);will-change:transform}
    .q-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,23,31,.35) 0%,rgba(16,23,31,.55) 100%)}
    .q-glass{position:absolute;top:50%;left:50%;width:min(58vh,84vw);height:min(58vh,84vw);border-radius:50%;background:rgba(16,23,31,.34);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);transform:translate(-50%,-50%) scale(.6);opacity:0;z-index:2;will-change:transform,opacity}
    .q-ring{position:absolute;top:50%;left:50%;width:min(66vh,96vw);height:min(66vh,96vw);border-radius:50%;background:linear-gradient(180deg,#21C6CD,#0D6CCE);-webkit-mask-image:radial-gradient(circle,transparent 0 calc(50% - 6.7%),black calc(50% - 6.1%) 100%);mask-image:radial-gradient(circle,transparent 0 calc(50% - 6.7%),black calc(50% - 6.1%) 100%);transform:translate(-50%,-50%) scale(.6) rotate(-40deg);opacity:0;z-index:3;will-change:transform,opacity}
    .q-inner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(46vh,80vw);text-align:center;display:flex;flex-direction:column;align-items:center;gap:2.4vh;opacity:0;filter:blur(14px);z-index:5;will-change:transform,opacity,filter}
    .q-mark{font-family:'Poppins',sans-serif;font-weight:900;font-size:min(8vh,9vw);line-height:.6;color:rgba(255,255,255,.4);height:4vh}
    .q-text{font-family:'Roboto',sans-serif;font-weight:700;font-size:min(3.6vh,4.6vw);line-height:1.28;color:#fff}
    .q-attr{font-family:'Poppins',sans-serif;font-weight:600;font-size:min(1.7vh,2.6vw);letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.85)}
    @media (prefers-reduced-motion: reduce){
      .q-track{height:auto}.q-sticky{position:static;height:auto;padding:18vh 24px}
      .q-glass,.q-ring{opacity:1;transform:translate(-50%,-50%) scale(1)}
      .q-ring{transform:translate(-50%,-50%) scale(1) rotate(0)}
      .q-inner{opacity:1;filter:none;transform:translate(-50%,-50%)}
    }
  </style>
  <div class="q-track" id="qTrack">
    <div class="q-sticky">
      <video class="q-video" id="qVideo" src="assets/huddle-footer.mp4" autoplay muted loop playsinline></video>
      <div class="q-scrim"></div>
      <div style="position:absolute;inset:0;">
        <div class="q-glass" id="qGlass"></div>
        <div class="q-ring" id="qRing"></div>
        <div class="q-inner" id="qInner">
          <div class="q-mark">“</div>
          <div class="q-text">Talent wins games, but teamwork and intelligence win championships.</div>
          <div class="q-attr">Michael Jordan</div>
        </div>
      </div>
    </div>
  </div>`;

  class HuddleQuote extends HTMLElement {
    connectedCallback() {
      if (this._m) return; this._m = true;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = HTML;
      var track = root.getElementById('qTrack');
      var video = root.getElementById('qVideo');
      var ring = root.getElementById('qRing');
      var glass = root.getElementById('qGlass');
      var inner = root.getElementById('qInner');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
      var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
      var update = function () {
        var vh = window.innerHeight || 800;
        var r = track.getBoundingClientRect();
        var scrollable = r.height - vh;
        var q = scrollable > 0 ? clamp(-r.top / scrollable) : 0;
        var enter = clamp(q / 0.42);
        var exit = clamp((q - 0.58) / 0.42);
        var vis = Math.min(enter, 1 - exit);
        var v = ease(vis);
        video.style.transform = 'translateY(' + (q * -60).toFixed(1) + 'px) scale(1.06)';
        ring.style.opacity = String(v);
        ring.style.transform = 'translate(-50%, -50%) scale(' + (0.62 + 0.38 * v).toFixed(3) + ') rotate(' + ((1 - v) * -45).toFixed(1) + 'deg)';
        glass.style.opacity = String(v);
        glass.style.transform = 'translate(-50%, -50%) scale(' + (0.62 + 0.38 * v).toFixed(3) + ')';
        inner.style.opacity = String(clamp((vis - 0.25) / 0.75));
        inner.style.filter = 'blur(' + ((1 - vis) * 14).toFixed(1) + 'px)';
        inner.style.transform = 'translate(-50%, -50%) translateY(' + ((1 - vis) * 26).toFixed(1) + 'px)';
      };
      this._tick = false;
      this._onScroll = () => { if (!this._tick) { requestAnimationFrame(() => { update(); this._tick = false; }); this._tick = true; } };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onScroll, { passive: true });
      update();
    }
    disconnectedCallback() {
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onScroll);
    }
  }

  customElements.define('huddle-quote', HuddleQuote);
})();
