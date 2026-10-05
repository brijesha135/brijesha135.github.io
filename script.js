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
