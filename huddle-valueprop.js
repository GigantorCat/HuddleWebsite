/* Huddle home value-proposition lockup — <huddle-valueprop> (shadow DOM).
   The word-by-word reading scrub was retired (redundant with the definition
   block). What remains: the value proposition as the anchor of a credibility
   lockup, with two "Huddle is / is not" cards that float in beneath it on
   scroll — reveal only, the copy never fades or moves out once shown. */
(function () {
  if (customElements.get('huddle-valueprop')) return;

  var CSS = `
    :host{display:block;--ink:#0a0a0a;--cyan:#00B9DA;background:var(--ink);color:#fff;font-family:'Roboto',sans-serif;-webkit-font-smoothing:antialiased}
    *{box-sizing:border-box;margin:0;padding:0}

    .lockup{position:relative;padding:clamp(96px,13vh,168px) 24px clamp(96px,13vh,168px)}
    .lockup .inner{max-width:1160px;margin:0 auto}
    .vp-settled{max-width:960px;margin:0 auto clamp(48px,6vw,80px);text-align:center;
      font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(1.2rem,2.5vw,1.95rem);
      line-height:1.42;letter-spacing:-.01em;color:#fff}
    .vp-settled .key{color:var(--cyan)}

    .cards{display:grid;grid-template-columns:1fr 1.08fr;gap:clamp(20px,2.4vw,30px);align-items:stretch}
    @media (max-width:700px){.cards{grid-template-columns:1fr}}

    .card{position:relative;border-radius:22px;padding:clamp(32px,3.4vw,46px);
      opacity:0;transform:translateY(30px);
      transition:opacity .85s cubic-bezier(.2,.7,.2,1),transform .85s cubic-bezier(.2,.7,.2,1)}
    .card.in{opacity:1;transform:none}
    .card .head{display:flex;align-items:center;gap:14px}
    .card .kicker{font-family:'Poppins',sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase}

    /* NOT card — muted, recessive */
    .card-not{background:#101316;border:1px solid #24292e}
    .card-not .kicker{color:#79818a}
    .card-not .not-list{margin-top:clamp(22px,2.4vw,30px);display:flex;flex-direction:column;gap:15px}
    .card-not .not-list li{list-style:none;position:relative;padding-left:28px;
      font-family:'Roboto',sans-serif;font-weight:300;font-size:clamp(1rem,1.35vw,1.16rem);color:#98a0a9;line-height:1.4}
    .card-not .not-list li::before{content:'';position:absolute;left:0;top:.36em;width:13px;height:13px;border-radius:50%;
      border:1.5px solid #545b63;background:transparent}

    /* IS card — elevated, iridescent, the winner */
    .card-is{background:linear-gradient(#0c1013,#0c1013) padding-box,
      linear-gradient(120deg,#0d6cce,#21c0db,#039995,#f9cc10,#f36f2c,#df166a) border-box;
      border:1.6px solid transparent;
      box-shadow:0 26px 74px rgba(0,0,0,.55),0 0 46px rgba(3,195,221,.12);
      display:flex;flex-direction:column;justify-content:center}
    .card-is .kicker{color:#d3dae1}
    .card-is .statement{margin-top:clamp(22px,2.4vw,30px);font-family:'Poppins',sans-serif;font-weight:600;
      font-size:clamp(1.28rem,2.05vw,1.8rem);line-height:1.42;color:#fff;text-wrap:pretty}
    .card-is .statement .cy{color:var(--cyan)}

    .dot-hollow{width:16px;height:16px;border-radius:50%;border:2px solid #545b63;background:transparent;flex:none}
    .dot-solid{width:16px;height:16px;border-radius:50%;background:var(--cyan);flex:none;
      animation:isPulse 2.4s ease-in-out infinite}
    @keyframes isPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 rgba(0,185,218,0)}
      50%{transform:scale(1.45);box-shadow:0 0 20px rgba(0,185,218,.75)}}

    @media (prefers-reduced-motion: reduce){
      .card{opacity:1;transform:none}
      .dot-solid{animation:none}
    }`;

  var HTML = `
    <section class="lockup">
      <div class="inner">
        <p class="vp-settled">Huddle provides leaders with diagnostic data on how their team operates, so every people decision is <span class="key">intentional and evidence-based.</span></p>
        <div class="cards">
          <article class="card card-not" id="cardNot">
            <div class="head"><span class="dot-hollow"></span><span class="kicker">Huddle is not</span></div>
            <ul class="not-list">
              <li>Open-ended facilitation.</li>
              <li>Culture surveys.</li>
              <li>Team building days.</li>
              <li>Personality tests.</li>
              <li>Frameworks without findings.</li>
            </ul>
          </article>
          <article class="card card-is" id="cardIs">
            <div class="head"><span class="dot-solid"></span><span class="kicker">Huddle is</span></div>
            <p class="statement">A <span class="cy">fixed-scope team diagnostic</span> that uses surveys and interviews to measure the structural conditions of a leadership team against a <span class="cy">research-backed model.</span></p>
          </article>
        </div>
      </div>
    </section>`;

  class HuddleValueprop extends HTMLElement {
    connectedCallback() {
      if (this._m) return; this._m = true;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>' + CSS + '</style>' + HTML;
      this.init(root);
    }

    init(root) {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var cardNot = root.getElementById('cardNot');
      var cardIs = root.getElementById('cardIs');
      if (reduced) { cardNot.classList.add('in'); cardIs.classList.add('in'); return; }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            // "is" leads by a beat so it reads as the winner
            cardIs.classList.add('in');
            setTimeout(function () { cardNot.classList.add('in'); }, 130);
            io.disconnect();
          }
        });
      }, { threshold: 0.28 });
      io.observe(cardIs);
    }
  }

  customElements.define('huddle-valueprop', HuddleValueprop);
})();
