/* Huddle site navigation — ported verbatim from huddle-nav-prototype.html.
   Encapsulated as a <huddle-nav> web component (shadow DOM keeps the class-based
   CSS / keyframes / WAAPI flock logic exactly as specced in the brief). */
(function () {
  if (customElements.get('huddle-nav')) return;

  var TEMPLATE = `
<style>
  :host{ --ink:#0a0a0a; }
  *{box-sizing:border-box;margin:0;padding:0}

  header{position:fixed;top:0;left:0;right:0;z-index:100;
    display:flex;align-items:center;justify-content:space-between;
    padding:20px 40px;background:rgba(10,10,10,.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
  .logo{display:block;line-height:0;cursor:pointer}
  .logo svg{height:34px;width:auto}

  nav{position:relative;display:flex;align-items:center;gap:38px}

  .nav-item{position:relative;display:flex;align-items:center;gap:10px;cursor:pointer;
    background:none;border:none;color:#9a9a9a;font-family:'Roboto',sans-serif;font-weight:400;
    font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;transition:color .25s ease;padding:8px 0}
  .nav-item:hover{color:#fff}
  .nav-item.active{color:#fff}
  .nav-item .anchor{width:8px;height:8px;border-radius:50%;flex:0 0 auto;visibility:hidden}

  .flock{position:absolute;inset:0;pointer-events:none}
  .fdot{position:absolute;left:0;top:0;width:8px;height:8px;will-change:transform}
  .fdot .core{display:block;width:100%;height:100%;border-radius:50%;background:#fff}
  .flock.settled .core{animation:huddlePulse 2.6s ease-in-out infinite;
    box-shadow:0 0 8px rgba(255,255,255,.9), 0 0 20px rgba(255,255,255,.35)}
  @keyframes huddlePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.45)}}

  .pill{margin-left:6px;padding:11px 24px;border:1.5px solid #fff;border-radius:999px;
    background:transparent;color:#fff;font-family:'Poppins',sans-serif;font-weight:700;font-size:.72rem;
    letter-spacing:.14em;cursor:pointer;transition:all .25s ease}
  .pill:hover{background:#fff;color:var(--ink);transform:scale(1.04)}

  .dotburger{display:none;background:none;border:none;cursor:pointer;padding:10px;z-index:210}
  .dotburger span{display:block;width:9px;height:9px;border-radius:50%;margin:5px auto;background:#fff;
    transition:transform .4s cubic-bezier(.6,0,.3,1.4)}
  .dotburger.open span:nth-child(1){transform:translate(-5px,14px) scale(.9)}
  .dotburger.open span:nth-child(2){transform:scale(1.3)}
  .dotburger.open span:nth-child(3){transform:translate(5px,-14px) scale(.9)}

  .mobile-menu{position:fixed;inset:0;z-index:200;background:#0a0a0a;
    display:flex;flex-direction:column;justify-content:center;padding:0 40px;gap:8px;
    opacity:0;pointer-events:none;transition:opacity .35s ease}
  .mobile-menu.open{opacity:1;pointer-events:auto}
  .mobile-menu a{display:flex;align-items:center;gap:22px;text-decoration:none;color:#fff;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:2rem;padding:18px 0;
    opacity:0;transform:translateY(16px);transition:opacity .4s ease, transform .4s ease}
  .mobile-menu.open a{opacity:1;transform:translateY(0)}
  .mobile-menu.open a:nth-child(1){transition-delay:.08s}
  .mobile-menu.open a:nth-child(2){transition-delay:.16s}
  .mobile-menu.open a:nth-child(3){transition-delay:.24s}
  .mobile-menu.open a:nth-child(4){transition-delay:.32s}
  .mobile-menu a .form{flex:0 0 44px}
  .mobile-menu .form circle{fill:#fff}

  .huddle-page{position:fixed;inset:0;z-index:300;
    background:rgba(8,8,8,.55);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    display:flex;align-items:center;justify-content:center;padding:24px;
    opacity:0;pointer-events:none;transition:opacity .35s ease}
  .huddle-page.open{opacity:1;pointer-events:auto}

  .hcard{position:relative;width:min(760px,94vw);max-height:94vh;overflow:auto;
    background:#0f0f10;border:1px solid #242424;border-radius:32px;
    box-shadow:0 40px 120px rgba(0,0,0,.7);
    padding:96px 80px 80px;text-align:center;will-change:transform}
  .hcard .close{position:absolute;top:18px;right:24px;background:none;border:none;
    color:#8a8a8a;font-size:1.9rem;cursor:pointer;font-family:'Roboto',sans-serif;font-weight:300;transition:color .25s;line-height:1}
  .hcard .close:hover{color:#fff}

  .break-svg{width:154px;height:154px;overflow:visible;margin:0 auto 52px;display:block}
  .break-svg circle{transform-box:fill-box;transform-origin:center;opacity:0;will-change:transform,opacity}
  .hcard.play .break-svg circle{animation:volley 1.5s cubic-bezier(.65,0,.2,1) forwards}
  .hcard.play .break-svg .cN{animation-name:volley,answer;animation-duration:1.5s,2.6s;
    animation-timing-function:cubic-bezier(.65,0,.2,1),ease-in-out;
    animation-delay:0s,2s;animation-iteration-count:1,infinite;animation-fill-mode:forwards,none}
  @keyframes volley{
    0%{transform:translate(var(--sx),var(--sy));opacity:0}
    18%{opacity:1}
    100%{transform:translate(0,0);opacity:1}
  }
  @keyframes answer{0%,100%{transform:translate(0,0) scale(1)}42%{transform:translate(0,0) scale(1.32)}}

  .hcard h1{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(1.9rem,5.4vw,3rem);line-height:1.18;letter-spacing:-.015em}
  .hcard h1 .line{display:block}
  .hcard h1 .word{display:inline-block;opacity:0;will-change:transform,opacity}
  .hcard.play h1 .word{animation:wordIn .85s cubic-bezier(.2,.8,.2,1) both}
  .hcard.play h1 .l1 .word{animation-delay:1.15s}
  .hcard.play h1 .l2 .word{animation-delay:1.34s}
  .hcard.play h1 .l3 .word{animation-delay:1.56s}
  .hcard h1 .l3{background:linear-gradient(90deg,#03C3DD,#2f86dd,#6b5cd6,#b74fbf,#F2065B,#f85a3b,#F96816,#F9AE06,#03C3DD,#2f86dd,#6b5cd6,#b74fbf,#F2065B,#f85a3b,#F96816,#F9AE06);
    background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
    animation:l3flow 8s linear infinite}
  .hcard h1 .l3 .word{background:none;-webkit-text-fill-color:transparent;color:transparent}
  @keyframes l3flow{to{background-position:-200% 0}}
  @keyframes wordIn{
    0%{opacity:0;transform:translateX(var(--wx)) scale(.9);filter:blur(6px)}
    100%{opacity:1;transform:translateX(0) scale(1);filter:blur(0)}
    100%{opacity:1;transform:scale(1)}
  }

  .hcard .sub,.hcard .contact-rows{opacity:0;transform:translateY(14px)}
  .hcard.play .sub{animation:riseIn .9s cubic-bezier(.16,1,.3,1) 2.35s forwards}
  .hcard.play .contact-rows{animation:riseIn .9s cubic-bezier(.16,1,.3,1) 2.55s forwards}
  @keyframes riseIn{to{opacity:1;transform:translateY(0)}}

  .hcard .sub{margin-top:18px;color:#b9b9b9;font-weight:300;font-size:clamp(.95rem,2vw,1.15rem);font-family:'Roboto',sans-serif}
  .contact-rows{margin-top:44px;display:flex;flex-direction:column;gap:8px}
  .contact-rows a{font-family:'Poppins',sans-serif;font-weight:600;font-size:clamp(1.15rem,3.2vw,1.8rem);
    color:#fff;text-decoration:none;transition:opacity .25s ease}
  .contact-rows a:hover{opacity:.6}

  @media (max-width:820px){
    nav{display:none}
    .dotburger{display:block}
    header{padding:16px 24px}
    .logo svg{height:28px}
    .hcard{padding:56px 28px 44px}
  }
  @media (prefers-reduced-motion: reduce){
    .flock.settled .core{animation:none}
    .hcard.play .break-svg circle{animation:none;opacity:1;transform:none}
    .hcard.play h1 .word,.hcard.play .sub,.hcard.play .contact-rows{animation:none;opacity:1;transform:none}
  }
</style>

<header>
  <a class="logo" data-nav="home" aria-label="Huddle — Home">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220.2 48.5">
      <g>
        <path fill="#fff" d="M93.9,39.9v-12.3h-14.1v12.3h-5.8V10.5h5.8v11.8h14.1v-11.8h5.8v29.4s-5.8,0-5.8,0Z"/>
        <path fill="#fff" d="M121.5,17.7h5.3v11.6c0,1.9-.3,3.5-.8,4.9s-1.3,2.6-2.2,3.5c-1,.9-2.1,1.7-3.5,2.1s-2.8.7-4.5.7-3.2-.2-4.5-.7-2.5-1.2-3.5-2.1c-1-.9-1.7-2.1-2.2-3.5s-.8-3-.8-4.9v-11.6h5.3v11.6c0,2.1.5,3.7,1.5,4.7s2.4,1.5,4.1,1.5,3.1-.5,4.1-1.5,1.5-2.6,1.5-4.7v-11.6h.2Z"/>
        <path fill="#fff" d="M154.2,28.6c0,1.8-.3,3.4-.9,4.9-.6,1.5-1.4,2.7-2.4,3.8s-2.3,1.8-3.8,2.4-3.1.8-4.8.8-3.4-.3-4.8-.9c-1.5-.6-2.7-1.4-3.8-2.4s-1.9-2.3-2.5-3.7-.9-3-.9-4.7.3-3.7,1-5.1c.6-1.5,1.5-2.7,2.5-3.6,1-1,2.2-1.7,3.5-2.2s2.6-.7,4-.7,3.2.3,4.4,1c1.3.7,2.3,1.6,3,2.7h0v-12.9h5.4v20.7h.1ZM142.3,35.5c2,0,3.6-.6,4.8-1.9,1.2-1.2,1.8-2.9,1.8-4.8s-.6-3.6-1.8-4.8c-1.2-1.2-2.8-1.9-4.8-1.9s-3.6.6-4.8,1.9-1.8,2.9-1.8,4.8.6,3.6,1.8,4.8,2.8,1.9,4.8,1.9Z"/>
        <path fill="#fff" d="M181.5,28.6c0,1.8-.3,3.4-.9,4.9-.6,1.5-1.4,2.7-2.4,3.8s-2.3,1.8-3.8,2.4-3.1.8-4.8.8-3.4-.3-4.8-.9c-1.5-.6-2.7-1.4-3.8-2.4s-1.9-2.3-2.5-3.7-.9-3-.9-4.7.3-3.7,1-5.1c.6-1.5,1.5-2.7,2.5-3.6,1-1,2.2-1.7,3.5-2.2s2.6-.7,4-.7,3.2.3,4.4,1c1.3.7,2.3,1.6,3,2.7h0v-12.9h5.4v20.7h.1ZM169.6,35.5c2,0,3.6-.6,4.8-1.9,1.2-1.2,1.8-2.9,1.8-4.8s-.6-3.6-1.8-4.8c-1.2-1.2-2.8-1.9-4.8-1.9s-3.6.6-4.8,1.9-1.8,2.9-1.8,4.8.6,3.6,1.8,4.8,2.8,1.9,4.8,1.9Z"/>
        <path fill="#fff" d="M186.7,39.9V8h5.4v31.9h-5.4Z"/>
        <path fill="#fff" d="M201.9,30.7h0c.4,1.6,1.1,2.8,2.2,3.6s2.5,1.3,4.2,1.3,4.1-.7,5.3-2.1h5.7c-.8,2.1-2.2,3.8-4.1,5.1s-4.2,1.9-6.8,1.9-3.4-.3-4.8-.9c-1.5-.6-2.7-1.4-3.8-2.4s-1.9-2.3-2.5-3.7-.9-3-.9-4.7.3-3.2.9-4.7c.6-1.4,1.4-2.7,2.5-3.7s2.3-1.8,3.8-2.4c1.4-.6,3.1-.9,4.8-.9s3.3.3,4.8.9,2.7,1.4,3.8,2.4c1,1,1.8,2.3,2.4,3.7.6,1.4.9,3,.9,4.7v1.9h-18.4ZM208.3,22c-1.6,0-2.9.4-4,1.2s-1.8,1.8-2.2,3.2h12.4c-.4-1.4-1.2-2.5-2.2-3.3s-2.4-1.2-4-1.2h0Z"/>
        <circle fill="#df166a" cx="44.4" cy="4" r="4"/>
        <circle fill="#f36f2c" cx="44.4" cy="44.4" r="4"/>
        <circle fill="#0d6cce" cx="4" cy="4" r="4"/>
        <circle fill="#039995" cx="4" cy="44.4" r="4"/>
        <circle fill="#21c0db" cx="4" cy="24.2" r="4"/>
        <circle fill="#f9cc10" cx="44.4" cy="24.2" r="4"/>
        <circle fill="#fff" cx="24.2" cy="24.2" r="4"/>
      </g>
    </svg>
  </a>

  <nav id="nav">
    <button class="nav-item active" data-nav="home"><span class="anchor"></span>This is Huddle</button>
    <button class="nav-item" data-nav="system"><span class="anchor"></span>The System</button>
    <button class="nav-item" data-nav="about"><span class="anchor"></span>About</button>
    <button class="pill" id="huddleBtn">LET'S HUDDLE</button>
    <div class="flock settled" id="flock" aria-hidden="true">
      <span class="fdot"><span class="core"></span></span>
      <span class="fdot"><span class="core"></span></span>
      <span class="fdot"><span class="core"></span></span>
      <span class="fdot"><span class="core"></span></span>
      <span class="fdot"><span class="core"></span></span>
      <span class="fdot"><span class="core"></span></span>
      <span class="fdot"><span class="core"></span></span>
    </div>
  </nav>

  <button class="dotburger" id="dotburger" aria-label="Menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</header>

<div class="mobile-menu" id="mobileMenu">
  <a data-nav="home">
    <svg class="form" width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="5"/></svg>
    This is Huddle
  </a>
  <a data-nav="system">
    <svg class="form" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="9" r="4"/><circle cx="10" cy="33" r="4"/><circle cx="34" cy="33" r="4"/>
    </svg>
    The System
  </a>
  <a data-nav="about">
    <svg class="form" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="13.5" cy="8.7" r="3"/><circle cx="20.2" cy="3.1" r="3"/><circle cx="27.9" cy="5.3" r="3"/>
      <circle cx="30.5" cy="13.1" r="3"/><circle cx="25.4" cy="20.3" r="3"/><circle cx="22.9" cy="27.9" r="3"/>
      <circle cx="22.7" cy="40.9" r="3"/>
    </svg>
    About
  </a>
  <a id="huddleBtnMobile">
    <svg class="form" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="18" cy="18" r="4"/><circle cx="27" cy="20" r="4"/><circle cx="21" cy="27" r="4"/>
    </svg>
    Let's Huddle
  </a>
</div>

<div class="huddle-page" id="huddlePage" role="dialog" aria-modal="true" aria-label="Contact Huddle">
  <div class="hcard" id="hcard">
    <button class="close" id="huddleClose" aria-label="Close">&times;</button>

    <svg class="break-svg" viewBox="0 0 48.4 48.4" aria-hidden="true">
      <circle fill="#0d6cce" cx="4" cy="4" r="4"    style="--sx:-230px;--sy:0px"/>
      <circle class="cN" fill="#df166a" cx="44.4" cy="4" r="4"  style="--sx:230px;--sy:0px"/>
      <circle fill="#21c0db" cx="4" cy="24.2" r="4"  style="--sx:-230px;--sy:0px"/>
      <circle fill="#fff"    cx="24.2" cy="24.2" r="4" style="--sx:0px;--sy:-150px"/>
      <circle class="cN" fill="#f9cc10" cx="44.4" cy="24.2" r="4" style="--sx:230px;--sy:0px"/>
      <circle fill="#039995" cx="4" cy="44.4" r="4"  style="--sx:-230px;--sy:0px"/>
      <circle fill="#f36f2c" cx="44.4" cy="44.4" r="4" style="--sx:230px;--sy:0px"/>
    </svg>

    <h1>
      <span class="line l1"><span class="word" style="--wx:-26px">No</span> <span class="word" style="--wx:26px">forms.</span></span>
      <span class="line l2"><span class="word" style="--wx:-26px">No</span> <span class="word" style="--wx:26px">funnels.</span></span>
      <span class="line l3"><span class="word" style="--wx:-26px">Just</span> <span class="word" style="--wx:26px">a</span> <span class="word" style="--wx:-26px">conversation.</span></span>
    </h1>
    <p class="sub">Bring us your team. We'll bring the data.</p>

    <div class="contact-rows">
      <a href="mailto:info@huddletalent.com">info@huddletalent.com</a>
      <a href="tel:+61424348925">+61 (424) 348 925</a>
    </div>
  </div>
</div>
`;

  class HuddleNav extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = TEMPLATE;
      this._init(root);
    }

    _init(root) {
      var self = this;
      var nav = root.getElementById('nav');
      var flock = root.getElementById('flock');
      var dots = Array.prototype.slice.call(flock.querySelectorAll('.fdot'));
      var items = Array.prototype.slice.call(root.querySelectorAll('.nav-item'));
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // where each nav item takes you on this site
      // x-import lowercases attribute names and strips hyphens (home-href → homehref).
      var attrOf = function (name, def) {
        var v = self.getAttribute(name);
        return v != null ? v : def;
      };

      var activeKey = attrOf('active', 'home');
      var activeItem = items.filter(function (i) { return i.dataset.nav === activeKey; })[0] || items[0];
      items.forEach(function (i) { i.classList.toggle('active', i === activeItem); });
      var gatherItem = activeItem;
      var anims = [];
      var pos = dots.map(function () { return { x: 0, y: 0 }; });

      function anchorOf(item) {
        var a = item.querySelector('.anchor').getBoundingClientRect();
        var n = nav.getBoundingClientRect();
        return { x: a.left - n.left, y: a.top - n.top };
      }
      function setDot(i, x, y) {
        pos[i] = { x: x, y: y };
        dots[i].style.transform = 'translate(' + x + 'px,' + y + 'px)';
      }
      function snapTo(item) {
        var t = anchorOf(item);
        for (var i = 0; i < dots.length; i++) { setDot(i, t.x, t.y); }
        flock.classList.add('settled');
      }
      function fly(item) {
        if (item === gatherItem) return;
        gatherItem = item;
        var t = anchorOf(item);
        flock.classList.remove('settled');
        anims.forEach(function (a) { a.cancel(); });
        anims = [];
        dots.forEach(function (dot, i) {
          var from = pos[i];
          if (reduced) { setDot(i, t.x, t.y); return; }
          var midX = (from.x + t.x) / 2 + (i - 3) * 5;
          var midY = (from.y + t.y) / 2 + (i - 3) * 11 - 10;
          var anim = dot.animate([
            { transform: 'translate(' + from.x + 'px,' + from.y + 'px)' },
            { transform: 'translate(' + midX + 'px,' + midY + 'px)', offset: .5 },
            { transform: 'translate(' + t.x + 'px,' + t.y + 'px)' }
          ], { duration: 480, delay: i * 28, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' });
          anims.push(anim);
          anim.onfinish = function () {
            setDot(i, t.x, t.y);
            if (i === dots.length - 1) { flock.classList.add('settled'); anims = []; }
          };
        });
        if (reduced) { flock.classList.add('settled'); }
      }

      function go(navKey) {
        if (navKey === 'home') {
          var hh = attrOf('homehref', null);
          if (hh) { window.location.href = hh; return; }
          window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
          return;
        }
        if (navKey === 'system') { window.location.href = attrOf('systemhref', 'the-system.html'); return; }
        if (navKey === 'about') { window.location.href = attrOf('abouthref', 'about.html'); return; }
      }

      function setPage(item) {
        activeItem = item;
        items.forEach(function (i) { i.classList.toggle('active', i === item); });
        fly(item);
        go(item.dataset.nav);
      }

      items.forEach(function (item) {
        item.addEventListener('pointerenter', function () { fly(item); });
        item.addEventListener('click', function () { setPage(item); });
        item.addEventListener('focus', function () { fly(item); });
      });
      nav.addEventListener('pointerleave', function () { fly(activeItem); });

      root.querySelector('.logo').addEventListener('click', function (e) {
        e.preventDefault(); setPage(items[0]);
      });
      window.addEventListener('resize', function () { snapTo(gatherItem); });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { snapTo(activeItem); });
      }
      snapTo(activeItem);

      // dotburger + mobile menu
      var burger = root.getElementById('dotburger');
      var menu = root.getElementById('mobileMenu');
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
      });
      Array.prototype.forEach.call(menu.querySelectorAll('a[data-nav]'), function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var item = items.filter(function (i) { return i.dataset.nav === a.dataset.nav; })[0];
          if (item) setPage(item);
          menu.classList.remove('open'); burger.classList.remove('open');
        });
      });

      // LET'S HUDDLE modal (FLIP from trigger)
      var page = root.getElementById('huddlePage');
      var card = root.getElementById('hcard');
      var lastTrigger = null;
      var closing = false;

      function triggerDelta(trigger) {
        var c = card.getBoundingClientRect();
        var t = trigger.getBoundingClientRect();
        return {
          dx: (t.left + t.width / 2) - (c.left + c.width / 2),
          dy: (t.top + t.height / 2) - (c.top + c.height / 2),
          s: Math.max(t.width / c.width, .06)
        };
      }
      function openHuddle(trigger) {
        lastTrigger = trigger;
        closing = false;
        menu.classList.remove('open'); burger.classList.remove('open');
        page.classList.add('open');
        card.classList.remove('play');
        if (!reduced && trigger) {
          var d = triggerDelta(trigger);
          card.style.transition = 'none';
          card.style.transform = 'translate(' + d.dx + 'px,' + d.dy + 'px) scale(' + d.s + ')';
          card.style.opacity = '.35';
          void card.offsetWidth;
          card.style.transition = 'transform .45s cubic-bezier(.3,0,.2,1), opacity .3s ease';
          card.style.transform = '';
          card.style.opacity = '';
        }
        void card.offsetWidth;
        card.classList.add('play');
      }
      function closeHuddle() {
        if (closing || !page.classList.contains('open')) return;
        closing = true;
        if (!reduced && lastTrigger && lastTrigger.offsetParent !== null) {
          var d = triggerDelta(lastTrigger);
          card.style.transition = 'transform .38s cubic-bezier(.5,0,.6,1), opacity .3s ease .08s';
          card.style.transform = 'translate(' + d.dx + 'px,' + d.dy + 'px) scale(' + d.s + ')';
          card.style.opacity = '0';
        }
        page.classList.remove('open');
        setTimeout(function () {
          card.style.transition = 'none';
          card.style.transform = '';
          card.style.opacity = '';
          card.classList.remove('play');
          closing = false;
        }, 420);
      }

      root.getElementById('huddleBtn').addEventListener('click', function () { openHuddle(this); });
      root.getElementById('huddleBtnMobile').addEventListener('click', function (e) { e.preventDefault(); openHuddle(this); });
      root.getElementById('huddleClose').addEventListener('click', closeHuddle);
      page.addEventListener('click', function (e) { if (e.target === page) closeHuddle(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeHuddle(); });
    }
  }

  customElements.define('huddle-nav', HuddleNav);
})();
