(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, hasIO = 'IntersectionObserver' in window;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  $('#yr').textContent = new Date().getFullYear();

  // Intro
  $$('.up').forEach((e, i) => e.style.setProperty('--k', i));
  requestAnimationFrame(() => setTimeout(() => root.classList.add('go'), 100));

  // Mobile menu
  const mb = $('#mbtn'), menu = $('#menu');
  const setM = o => { mb.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); mb.firstElementChild.textContent = o ? 'Close' : 'Menu'; };
  mb.addEventListener('click', () => setM(mb.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setM(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setM(false); });
  document.addEventListener('click', e => { if (!e.target.closest('#nav')) setM(false); });

  // Reveal
  const rv = $$('.reveal, .proj, .map');
  if (!hasIO || reduce) rv.forEach(e => e.classList.add('in'));
  else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -40px 0px' }); rv.forEach((e, i) => { if (e.classList.contains('reveal')) e.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(e); }); }

  // Active nav + sliding pill
  const links = $$('#nl a'), pill = $('#pill'); let cur = null;
  const mv = a => { if (!a || getComputedStyle(pill).display === 'none') return; const u = $('#nl').getBoundingClientRect(), r = a.getBoundingClientRect(); pill.style.width = r.width + 'px'; pill.style.transform = `translateX(${r.left - u.left}px)`; pill.style.opacity = 1; };
  const act = id => { const a = links.find(l => l.getAttribute('href') === '#' + id); links.forEach(l => { l.classList.toggle('on', l === a); l === a ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'); }); cur = a; if (!a) pill.style.opacity = 0; else mv(a); };
  if (hasIO) { const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) act(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' }); $$('main section[id]').forEach(s => so.observe(s)); }
  addEventListener('resize', () => mv(cur));

  // Story line
  const st = $('#story'), upd = () => { const r = st.getBoundingClientRect(); st.style.setProperty('--p', reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)).toFixed(3)); };
  addEventListener('scroll', upd, { passive: true }); upd();

  // System map
  const map = $('#map'), svg = $('#lines'); const NS = 'http://www.w3.org/2000/svg';
  const drawMap = () => {
    svg.innerHTML = ''; const mr = map.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${mr.width} ${mr.height}`);
    const ns = ['.n1', '.n2', '.n3', '.n4', '.n5', '.n6'].map(s => $(s, map));
    const c = n => { const r = n.getBoundingClientRect(); return [r.left - mr.left + r.width / 2, r.top - mr.top + r.height / 2]; };
    for (let i = 0; i < 5; i++) {
      const [x1, y1] = c(ns[i]), [x2, y2] = c(ns[i + 1]);
      const horiz = Math.abs(x2 - x1) > Math.abs(y2 - y1), k = horiz ? Math.abs(x2 - x1) * .35 : Math.abs(y2 - y1) * .4;
      const d = horiz ? `M${x1} ${y1}C${x1 + Math.sign(x2 - x1) * k} ${y1 - 24} ${x2 - Math.sign(x2 - x1) * k} ${y2 + 24} ${x2} ${y2}` : `M${x1} ${y1}C${x1 + 50} ${y1 + k} ${x2 - 50} ${y2 - k} ${x2} ${y2}`;
      const b = document.createElementNS(NS, 'path'); b.setAttribute('d', d); b.setAttribute('class', 'base'); svg.append(b);
      const f = document.createElementNS(NS, 'path'); f.setAttribute('d', d); f.setAttribute('class', 'flow'); svg.append(f);
      const len = f.getTotalLength(); f.style.setProperty('--len', len); f.style.setProperty('--i', i);
      if (!reduce) { const ci = document.createElementNS(NS, 'circle'); ci.setAttribute('r', 4); const a = document.createElementNS(NS, 'animateMotion'); a.setAttribute('dur', (3 + i * .3) + 's'); a.setAttribute('repeatCount', 'indefinite'); a.setAttribute('begin', (i * .6) + 's'); a.setAttribute('path', d); ci.append(a); svg.append(ci); }
    }
  };
  drawMap(); addEventListener('resize', drawMap); addEventListener('load', drawMap); if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawMap);

  if (fine && !reduce) {
    root.classList.add('fine');
    // Cursor
    const cu = $('#cur'); let x = -50, y = -50, tx = x, ty = y;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function l() { x += (tx - x) * .22; y += (ty - y) * .22; cu.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(l); })();
    document.addEventListener('pointerover', e => cu.classList.toggle('hv', !!e.target.closest('a,button,.t,.node')));
    // Tilt
    $$('[data-tilt]').forEach(el => { el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 5}deg)`; }); el.addEventListener('pointerleave', () => el.style.transform = ''); });
  }
})();

/* ===== App screenshot galleries (your real Play Store screenshots only) =====
   For each app card, looks in assets/apps/<slug>/ for screen-1 … screen-5 (.png, .jpg or .webp),
   and shows them unmodified in phone frames in a swipeable gallery. No screenshots found: the card keeps
   its neutral tile. Nothing is ever generated or faked. */
(() => {
  'use strict';
  const MAX = 5, EXT = ['png', 'jpg', 'webp'];
  const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const find = async (base, n) => { for (const e of EXT) { const i = await load(`${base}screen-${n}.${e}`); if (i) return i; } return null; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.app[data-slug]').forEach(async card => {
    const base = `assets/apps/${card.dataset.slug}/`, media = card.querySelector('[data-media]'), name = card.querySelector('h3').textContent, shots = [];
    for (let n = 1; n <= MAX; n++) { const i = await find(base, n); if (!i) break; shots.push(i); }
    if (!shots.length) return;
    const track = document.createElement('div'); track.className = 'gal-track'; track.tabIndex = 0; track.setAttribute('role', 'group'); track.setAttribute('aria-label', `${name} screenshots`);
    shots.forEach((img, i) => { const f = document.createElement('figure'); f.className = 'phone'; img.alt = `${name} — screenshot ${i + 1} of ${shots.length}`; img.loading = 'lazy'; img.decoding = 'async'; f.append(img); track.append(f); });
    const gal = document.createElement('div'); gal.className = 'gal'; gal.append(track);
    if (shots.length > 1) {
      const mk = (cls, label, d) => { const b = document.createElement('button'); b.type = 'button'; b.className = `gal-nav ${cls}`; b.setAttribute('aria-label', `${label} screenshot`); b.textContent = d > 0 ? '›' : '‹'; b.addEventListener('click', () => { const w = track.querySelector('.phone').offsetWidth + 14; track.scrollBy({ left: d * w, behavior: reduce ? 'auto' : 'smooth' }); }); return b; };
      const dots = document.createElement('div'); dots.className = 'gal-dots'; dots.setAttribute('aria-hidden', 'true');
      shots.forEach(() => dots.append(document.createElement('i')));
      gal.append(mk('prev', 'Previous', -1), mk('next', 'Next', 1), dots);
      const upd = () => { const ph = [...track.children], c = track.scrollLeft + track.clientWidth / 2; let k = 0, best = 1e9; ph.forEach((p, i) => { const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - c); if (d < best) { best = d; k = i; } }); [...dots.children].forEach((d, i) => d.classList.toggle('on', i === k)); gal.querySelector('.prev').disabled = k === 0; gal.querySelector('.next').disabled = k === ph.length - 1; };
      track.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); addEventListener('resize', upd); upd();
    }
    media.replaceChildren(gal); media.classList.add('has-gal');
  });
})();

/* ===== Privacy-friendly analytics (GoatCounter) =====
   No cookies, no personal data, no visitor identification. Disabled until config.js has a site code,
   and skipped on localhost / file:// so your own testing never pollutes the numbers. */
(() => {
  'use strict';
  const cfg = window.SITE_CONFIG || {}, code = (cfg.goatcounter || '').trim();
  if (!/^[a-z0-9-]+$/i.test(code)) return;
  if (location.protocol === 'file:' || /^(localhost|127\.|\[::1\])/.test(location.hostname)) return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js'; s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  document.head.append(s);
  const priv = document.getElementById('priv'); if (priv) priv.hidden = false;
  if (!cfg.showPublicCounter) return;
  const out = document.getElementById('stats'), fmt = v => String(v == null ? '' : v).trim();
  fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`).then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      const views = fmt(d.count), uniq = fmt(d.count_unique);
      if (!views || !out) return;
      out.textContent = `Page views ${views}` + (uniq ? ` · Unique visitors ${uniq}` : '');
      out.hidden = false;
    }).catch(() => { /* counter not public yet: show nothing rather than a made-up number */ });
})();
