/* Huddle site-wide footer — ported verbatim from huddle-footer.html.
   Single <huddle-footer> layout component: aurora blobs, wandering seven-dot
   flock that gathers beside a hovered contact link, spectrum underlines,
   mini-nav (real routes) + logo home + legal easter-egg. */
(function () {
  if (customElements.get('huddle-footer')) return;

  var HOME = 'index.html';
  var SYSTEM = 'the-system.html';
  var ABOUT = 'about.html';

  var LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220.2 48.5">' +
    '<path fill="#fff" d="M93.9,39.9v-12.3h-14.1v12.3h-5.8V10.5h5.8v11.8h14.1v-11.8h5.8v29.4s-5.8,0-5.8,0Z"/>' +
    '<path fill="#fff" d="M121.5,17.7h5.3v11.6c0,1.9-.3,3.5-.8,4.9s-1.3,2.6-2.2,3.5c-1,.9-2.1,1.7-3.5,2.1s-2.8.7-4.5.7-3.2-.2-4.5-.7-2.5-1.2-3.5-2.1c-1-.9-1.7-2.1-2.2-3.5s-.8-3-.8-4.9v-11.6h5.3v11.6c0,2.1.5,3.7,1.5,4.7s2.4,1.5,4.1,1.5,3.1-.5,4.1-1.5,1.5-2.6,1.5-4.7v-11.6h.2Z"/>' +
    '<path fill="#fff" d="M154.2,28.6c0,1.8-.3,3.4-.9,4.9-.6,1.5-1.4,2.7-2.4,3.8s-2.3,1.8-3.8,2.4-3.1.8-4.8.8-3.4-.3-4.8-.9c-1.5-.6-2.7-1.4-3.8-2.4s-1.9-2.3-2.5-3.7-.9-3-.9-4.7.3-3.7,1-5.1c.6-1.5,1.5-2.7,2.5-3.6,1-1,2.2-1.7,3.5-2.2s2.6-.7,4-.7,3.2.3,4.4,1c1.3.7,2.3,1.6,3,2.7h0v-12.9h5.4v20.7h.1ZM142.3,35.5c2,0,3.6-.6,4.8-1.9,1.2-1.2,1.8-2.9,1.8-4.8s-.6-3.6-1.8-4.8c-1.2-1.2-2.8-1.9-4.8-1.9s-3.6.6-4.8,1.9-1.8,2.9-1.8,4.8.6,3.6,1.8,4.8,2.8,1.9,4.8,1.9Z"/>' +
    '<path fill="#fff" d="M181.5,28.6c0,1.8-.3,3.4-.9,4.9-.6,1.5-1.4,2.7-2.4,3.8s-2.3,1.8-3.8,2.4-3.1.8-4.8.8-3.4-.3-4.8-.9c-1.5-.6-2.7-1.4-3.8-2.4s-1.9-2.3-2.5-3.7-.9-3-.9-4.7.3-3.7,1-5.1c.6-1.5,1.5-2.7,2.5-3.6,1-1,2.2-1.7,3.5-2.2s2.6-.7,4-.7,3.2.3,4.4,1c1.3.7,2.3,1.6,3,2.7h0v-12.9h5.4v20.7h.1ZM169.6,35.5c2,0,3.6-.6,4.8-1.9,1.2-1.2,1.8-2.9,1.8-4.8s-.6-3.6-1.8-4.8c-1.2-1.2-2.8-1.9-4.8-1.9s-3.6.6-4.8,1.9-1.8,2.9-1.8,4.8.6,3.6,1.8,4.8,2.8,1.9,4.8,1.9Z"/>' +
    '<path fill="#fff" d="M186.7,39.9V8h5.4v31.9h-5.4Z"/>' +
    '<path fill="#fff" d="M201.9,30.7h0c.4,1.6,1.1,2.8,2.2,3.6s2.5,1.3,4.2,1.3,4.1-.7,5.3-2.1h5.7c-.8,2.1-2.2,3.8-4.1,5.1s-4.2,1.9-6.8,1.9-3.4-.3-4.8-.9c-1.5-.6-2.7-1.4-3.8-2.4s-1.9-2.3-2.5-3.7-.9-3-.9-4.7.3-3.2.9-4.7c.6-1.4,1.4-2.7,2.5-3.7s2.3-1.8,3.8-2.4c1.4-.6,3.1-.9,4.8-.9s3.3.3,4.8.9,2.7,1.4,3.8,2.4c1,1,1.8,2.3,2.4,3.7.6,1.4.9,3,.9,4.7v1.9h-18.4ZM208.3,22c-1.6,0-2.9.4-4,1.2s-1.8,1.8-2.2,3.2h12.4c-.4-1.4-1.2-2.5-2.2-3.3s-2.4-1.2-4-1.2h0Z"/>' +
    '<circle fill="#df166a" cx="44.4" cy="4" r="4"/><circle fill="#f36f2c" cx="44.4" cy="44.4" r="4"/>' +
    '<circle fill="#0d6cce" cx="4" cy="4" r="4"/><circle fill="#039995" cx="4" cy="44.4" r="4"/>' +
    '<circle fill="#21c0db" cx="4" cy="24.2" r="4"/><circle fill="#f9cc10" cx="44.4" cy="24.2" r="4"/>' +
    '<circle fill="#fff" cx="24.2" cy="24.2" r="4"/></svg>';

  var CSS = `
    :host{display:block;--ink:#0a0a0a;--c1:#0d6cce;--c2:#21c0db;--c3:#039995;--c4:#f9cc10;--c5:#f36f2c;--c6:#df166a}
    *{box-sizing:border-box;margin:0;padding:0}
    footer{position:relative;overflow:hidden;background:var(--ink);color:#fff;font-family:'Roboto',sans-serif;padding:120px 6vw 46px}

    .blob{position:absolute;border-radius:50%;filter:blur(110px);opacity:.14;mix-blend-mode:screen;transition:opacity 1.2s ease;pointer-events:none;z-index:0}
    .b1{width:55vw;height:55vw;background:var(--c1);left:-18vw;top:-22vw;animation:drift1 28s ease-in-out infinite alternate}
    .b2{width:45vw;height:45vw;background:var(--c2);right:-12vw;top:-16vw;animation:drift2 34s ease-in-out infinite alternate}
    .b3{width:42vw;height:42vw;background:var(--c6);left:28vw;bottom:-26vw;animation:drift3 26s ease-in-out infinite alternate}
    .b4{width:36vw;height:36vw;background:var(--c5);right:12vw;bottom:-22vw;animation:drift1 38s ease-in-out infinite alternate-reverse}
    @keyframes drift1{to{transform:translate(8vw,5vw) scale(1.15)}}
    @keyframes drift2{to{transform:translate(-7vw,4vw) scale(.92)}}
    @keyframes drift3{to{transform:translate(6vw,-4vw) scale(1.1)}}
    footer.lean-cyan .b1,footer.lean-cyan .b2{opacity:.3}
    footer.lean-cyan .b3,footer.lean-cyan .b4{opacity:.06}
    footer.lean-amber .b4,footer.lean-amber .b3{opacity:.3}
    footer.lean-amber .b1,footer.lean-amber .b2{opacity:.06}

    .wander{position:absolute;inset:0;pointer-events:none;z-index:1}
    .wd{position:absolute;width:10px;height:10px}
    .wd i{display:block;width:100%;height:100%;border-radius:50%;transition:transform 1s cubic-bezier(.4,0,.2,1)}
    .wd:nth-child(1){left:6%;top:18%;animation:w1 27s ease-in-out infinite alternate}
    .wd:nth-child(2){left:76%;top:12%;animation:w2 33s ease-in-out infinite alternate}
    .wd:nth-child(3){left:58%;top:58%;animation:w3 24s ease-in-out infinite alternate}
    .wd:nth-child(4){left:28%;top:66%;animation:w1 30s ease-in-out infinite alternate-reverse}
    .wd:nth-child(5){left:86%;top:52%;animation:w2 26s ease-in-out infinite alternate-reverse}
    .wd:nth-child(6){left:42%;top:10%;animation:w3 35s ease-in-out infinite alternate}
    .wd:nth-child(7){left:13%;top:48%;animation:w2 29s ease-in-out infinite alternate}
    .wd:nth-child(1) i{background:var(--c1)} .wd:nth-child(2) i{background:var(--c2)}
    .wd:nth-child(3) i{background:var(--c3)} .wd:nth-child(4) i{background:#fff}
    .wd:nth-child(5) i{background:var(--c4)} .wd:nth-child(6) i{background:var(--c5)}
    .wd:nth-child(7) i{background:var(--c6)}
    @keyframes w1{25%{transform:translate(13vw,7vh)}60%{transform:translate(4vw,14vh)}100%{transform:translate(17vw,3vh)}}
    @keyframes w2{30%{transform:translate(-11vw,9vh)}70%{transform:translate(-3vw,-5vh)}100%{transform:translate(-15vw,11vh)}}
    @keyframes w3{35%{transform:translate(7vw,-9vh)}65%{transform:translate(-8vw,4vh)}100%{transform:translate(5vw,-12vh)}}
    footer.gathering .wd{animation-play-state:paused}

    .lockup{position:relative;z-index:2;display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:center}
    .mic{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(1.9rem,4.4vw,3.4rem);line-height:1.16;letter-spacing:-.01em}
    .mic .dim{color:#5d5d5d}
    .contact{display:flex;flex-direction:column;gap:14px;align-items:flex-end;text-align:right}
    .contact a{position:relative;font-family:'Poppins',sans-serif;font-weight:700;color:#fff;text-decoration:none;font-size:clamp(1.25rem,2.6vw,2rem);letter-spacing:-.01em;padding-bottom:7px;width:max-content;max-width:100%}
    .contact a::after{content:'';position:absolute;left:0;bottom:0;height:3px;width:100%;background:linear-gradient(90deg,var(--c1),var(--c2),var(--c3),var(--c4),var(--c5),var(--c6));border-radius:2px;transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.65,0,.35,1)}
    .contact a:hover::after{transform:scaleX(1)}

    .base{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;margin-top:110px;position:relative;z-index:2}
    .logo{display:block;line-height:0}
    .logo svg{height:32px;width:auto;display:block}
    .mini-nav{display:flex;gap:26px}
    .mini-nav a{color:#8a8a8a;text-decoration:none;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;transition:color .25s}
    .mini-nav a:hover{color:#fff}
    .legal{width:100%;color:#4a4a4a;font-size:.7rem;margin-top:6px;font-family:'Roboto',sans-serif}

    @media (max-width:820px){
      .lockup{grid-template-columns:1fr;gap:40px}
      .contact{align-items:flex-start;text-align:left}
    }
    @media (prefers-reduced-motion: reduce){
      .blob,.wd{animation:none}
      .wd i{transition:none}
    }`;

  var HTML = `
    <footer id="foot">
      <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
      <div class="wander">
        <span class="wd"><i></i></span><span class="wd"><i></i></span><span class="wd"><i></i></span>
        <span class="wd"><i></i></span><span class="wd"><i></i></span><span class="wd"><i></i></span>
        <span class="wd"><i></i></span>
      </div>
      <div class="lockup">
        <p class="mic">Every great team<br><span class="dim">starts with a conversation.</span></p>
        <div class="contact">
          <a href="mailto:info@huddletalent.com" data-lean="cyan">info@huddletalent.com</a>
          <a href="tel:+61424348925" data-lean="amber">+61 (424) 348 925</a>
        </div>
      </div>
      <div class="base">
        <a class="logo" href="${HOME}" aria-label="Huddle — Home">${LOGO}</a>
        <nav class="mini-nav"><a href="${HOME}">This is Huddle</a><a href="${SYSTEM}">The System</a><a href="${ABOUT}">About</a><a href="https://www.linkedin.com/company/huddletalent" target="_blank" rel="noopener">LinkedIn</a></nav>
        <p class="legal">© 2026 Huddle Partners. Great teams don't just happen.</p>
      </div>
    </footer>`;

  class HuddleFooter extends HTMLElement {
    connectedCallback() {
      if (this._m) return; this._m = true;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>' + CSS + '</style>' + HTML;
      var foot = root.getElementById('foot');
      var wds = Array.prototype.slice.call(foot.querySelectorAll('.wd'));
      var links = foot.querySelectorAll('.contact a');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      function gather(target) {
        foot.classList.add('gathering');
        var t = target.getBoundingClientRect();
        var cx = t.left - 44, cy = t.top + t.height / 2;
        wds.forEach(function (wd, i) {
          var r = wd.getBoundingClientRect();
          var ang = (i / wds.length) * Math.PI * 2 - Math.PI / 2;
          var rad = 24;
          var dx = (cx + Math.cos(ang) * rad) - (r.left + 5);
          var dy = (cy + Math.sin(ang) * rad) - (r.top + 5);
          wd.querySelector('i').style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        });
      }
      function release() {
        wds.forEach(function (wd) { wd.querySelector('i').style.transform = ''; });
        setTimeout(function () { foot.classList.remove('gathering'); }, 950);
      }
      links.forEach(function (a) {
        a.addEventListener('pointerenter', function () { gather(a); foot.classList.add('lean-' + a.dataset.lean); });
        a.addEventListener('pointerleave', function () { release(); foot.classList.remove('lean-cyan', 'lean-amber'); });
      });
    }
  }

  customElements.define('huddle-footer', HuddleFooter);
})();
