/* ============================================================
   YiQi Site Header — Web Component
   DS v1.2.5
   ============================================================ */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const page = this.getAttribute('current-page') || '';
    document.documentElement.dataset.page = page;
    const base = this.getAttribute('base') || './';
    const r = (path) => base + path;

    const navItems = [
      { label: 'IA Ready',      href: r('ia-ready.html'),       page: 'ia-ready'              },
      { label: 'API Docs',      href: r('api-docs.html'),      page: 'api-docs'               },
      { label: 'Novedades',     href: r('novedades.html'),      page: 'novedades'             },
      { label: 'Capacitaciones',href: r('capacitaciones.html'), page: 'capacitaciones'        },
      { label: 'FAQ',           href: r('faq.html'),            page: 'faq'                   },
      { label: 'Acerca de',     href: r('acerca-de.html'),      page: 'acerca-de'             },
      { label: 'Ayuda ERP',     href: r('ayuda-erp.html'),      page: 'soporte'               },
      { label: 'Contacto',      href: r('contacto.html'),       page: 'contacto'              },
    ].map(n => {
      const active = n.page === page ? ' active" aria-current="page' : '';
      const ext    = n.external ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${n.href}"${ext} class="nav-link${active}">${n.label}</a>`;
    }).join('\n');

    const logo = `<svg class="yq-logo-anim" data-yiqi-logo data-axis="y" width="60" height="39" viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g class="yq-all anim">
        <path class="yql yq-y anim" d="M20.44,48.34l2.57-6.15-6.79-16.91c-.14-.39.07-.61.46-.61h4.97c.29,0,.57.14.68.43l3.58,10.08,3.61-10.08c.11-.29.39-.43.68-.43h4.97c.39,0,.57.21.43.61l-9.26,23.27c-.11.29-.39.43-.68.43h-4.75c-.43,0-.68-.21-.47-.64Z"/>
        <path class="yql yq-i1s anim" d="M38.72,25.24c0-.32.25-.57.57-.57h4.89c.32,0,.57.25.57.57v16.24c0,.32-.25.57-.57.57h-4.89c-.32,0-.57-.25-.57-.57v-16.24Z"/>
        <g class="yq-q anim"><path class="yqs" d="M57.91,44.78v-2.66c-2.18-.53-4.21-1.66-5.92-3.36-4.97-4.97-5.09-13.02-.03-18.08,5.09-5.09,13.14-4.97,18.11,0s5.09,13.02,0,18.11c-1.78,1.78-3.94,2.93-6.22,3.46v2.51c0,.35-.18.53-.58.53h-4.82c-.3,0-.55-.2-.55-.5ZM56.28,34.47c.5.5,1.05.9,1.65,1.2v-3.36c0-.35.18-.53.53-.53h4.87c.25,0,.53.18.53.53v3.36c.63-.33,1.23-.78,1.78-1.33,2.73-2.73,2.78-6.75.15-9.38s-6.67-2.61-9.41.13c-2.71,2.71-2.73,6.75-.1,9.38Z"/></g>
        <path class="yql yq-i2s anim" d="M77.44,25.24c0-.32.25-.57.57-.57h4.89c.32,0,.57.25.57.57v16.24c0,.32-.25.57-.57.57h-4.89c-.32,0-.57-.25-.57-.57v-16.24Z"/>
        <path class="yql yq-i1d anim" d="M38.5,18.99c0-1.77,1.35-3.19,3.23-3.19s3.23,1.42,3.23,3.19-1.38,3.23-3.23,3.23-3.23-1.42-3.23-3.23Z"/>
        <path class="yql yq-i2d anim" d="M77.22,18.99c0-1.77,1.35-3.19,3.23-3.19s3.23,1.42,3.23,3.19-1.38,3.23-3.23,3.23-3.23-1.42-3.23-3.23Z"/>
      </g>
    </svg>`;

    const themeToggle = `<div class="theme-switch" role="group" aria-label="Tema">
      <button class="theme-opt" data-val="dark"   title="Oscuro"  onclick="setTheme('dark')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="theme-opt" data-val="system" title="Sistema" onclick="setTheme('system')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </button>
      <button class="theme-opt" data-val="light"  title="Claro"   onclick="setTheme('light')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      </button>
    </div>`;

    this.innerHTML = `
<div class="ds-overlay" id="overlay"></div>

<nav class="mobile-nav" id="mobileNav">
  <button class="close-btn" id="mobileNavClose" type="button" aria-label="Cerrar menú">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="mobile-nav-links">
  ${navItems}
  <a href="https://me.yiqi.com.ar" target="_blank" class="nav-link">Login</a>
  </div>
  ${themeToggle}
</nav>

<header class="topbar">
  <a href="${r('index.html')}" class="topbar-logo">${logo}</a>

  <div class="topbar-spacer"></div>

  <nav class="topbar-nav">
    ${navItems}
  </nav>

  <a href="https://me.yiqi.com.ar" target="_blank" class="btn-login">
    Login
  </a>

  ${themeToggle}

  <button class="mobile-menu-btn" id="menuBtn" style="margin-left:auto" aria-label="Menú">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</header>`;

    /* ── yq-logo-anim: rise al tocar → la Q gira al entrar a la otra pagina ── */
    (function(){
      if (!window.YiQiLogo) {
        (function (global) {
          'use strict';
          const T = { body:260, qDur:680, yDelay:0, i1sDelay:40, i2sDelay:80, qDelay:80, dotGap1:60, dotGap2:120 };
          const LETTERS = ['yq-y','yq-i1s','yq-i2s'];
          const ALLP = ['yq-all','yq-y','yq-i1s','yq-i2s','yq-q','yq-i1d','yq-i2d'];
          const reduceMotion = () => global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const $ = (svg, cls) => svg.querySelector('.' + cls);
          function qFrames(axis){
            if (axis === 'z') {
              return { easing:'cubic-bezier(.18,.7,.2,1)', frames:[
                { opacity:0, transform:'rotate(360deg) scale(.3)',  offset:0 },
                { opacity:1, transform:'rotate(10deg) scale(1.05)', offset:.72 },
                { opacity:1, transform:'rotate(0deg) scale(1)',     offset:1 } ]};
            }
            const f = axis === 'x' ? (a,b)=>'scaleX('+b+') scaleY('+a+')' : (a,b)=>'scaleX('+a+') scaleY('+b+')';
            return { easing:'cubic-bezier(.45,.02,.25,1)', frames:[
              { opacity:0,   transform:f(.82,.82),  offset:0   },
              { opacity:1,   transform:f(1,.84),    offset:.12 },
              { opacity:.30, transform:f(0,.88),    offset:.32 },
              { opacity:1,   transform:f(-.92,.92), offset:.5  },
              { opacity:.30, transform:f(0,.96),    offset:.7  },
              { opacity:1,   transform:f(1.05,1),   offset:.88 },
              { opacity:1,   transform:f(1,1),      offset:1   } ]};
          }
          function clear(svg){ ALLP.forEach(c=>{ const el=$(svg,c); if(el) el.getAnimations().forEach(a=>a.cancel()); }); }
          function reset(svg){ clear(svg); ALLP.forEach(c=>{ const el=$(svg,c); if(el){ el.style.opacity=''; el.style.transform=''; } }); }
          function showLetters(svg){ LETTERS.forEach(c=>{ const el=$(svg,c); if(el){ el.style.opacity=''; el.style.transform=''; } }); }
          function rise(svg, k, ease){
            const fr = [{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}];
            const A = (c, o) => { const el=$(svg,c); return el ? el.animate(fr, Object.assign({fill:'both'}, o)) : null; };
            return [
              A('yq-y',   {duration:T.body*k, delay:T.yDelay*k,   easing:ease}),
              A('yq-i1s', {duration:T.body*k, delay:T.i1sDelay*k, easing:ease}),
              A('yq-i2s', {duration:T.body*k, delay:T.i2sDelay*k, easing:ease})
            ].filter(Boolean);
          }
          function spin(svg, k, axis){
            const qf = qFrames(axis);
            const A = (c, delay) => { const el=$(svg,c); return el ? el.animate(qf.frames, {duration:T.qDur*k, delay:delay*k, easing:qf.easing, fill:'both'}) : null; };
            return [
              A('yq-q',   T.qDelay),
              A('yq-i1d', T.qDelay+T.dotGap1),
              A('yq-i2d', T.qDelay+T.dotGap2)
            ].filter(Boolean);
          }
          function play(svg, opts){
            opts = opts || {};
            const axis = (opts.axis || svg.dataset.axis || 'y').toLowerCase();
            const rate = opts.rate != null ? +opts.rate : 1;
            const k = 1 / rate;
            clear(svg);
            if (reduceMotion() && !opts.force) { reset(svg); return []; }
            const ease = 'cubic-bezier(.22,1,.36,1)';
            const phase = opts.phase || 'all';
            let anims = [];
            if (phase === 'q') showLetters(svg);
            if (phase === 'all' || phase === 'rise') anims = anims.concat(rise(svg, k, ease));
            if (phase === 'all' || phase === 'q')    anims = anims.concat(spin(svg, k, axis));
            return anims;
          }
          function autoInit(){
            let cont = false;
            try { cont = sessionStorage.getItem('yiqiLogoContinue') === '1'; if (cont) sessionStorage.removeItem('yiqiLogoContinue'); } catch(e){}
            document.querySelectorAll('[data-yiqi-logo]').forEach(svg => play(svg, cont ? {phase:'q', force:true} : {}));
          }
          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
          else autoInit();
          global.YiQiLogo = { play, reset };
        })(window);
      }
      if (!document.getElementById('yq-logo-anim-style')) {
        const st = document.createElement('style');
        st.id = 'yq-logo-anim-style';
        st.textContent = '[data-yiqi-logo] .anim{transform-box:fill-box;transform-origin:center}';
        document.head.appendChild(st);
      }
      const _link = this.querySelector('.topbar-logo');
      const _svg  = _link && _link.querySelector('[data-yiqi-logo]');
      if (_link && _svg) {
        const _home = _link.getAttribute('href');
        _link.addEventListener('click', (e) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (!window.YiQiLogo) return;
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          let _abs = null; try { _abs = new URL(_home, location.href).href; } catch(err){}
          const _samePage = _abs && _abs.split('#')[0] === location.href.split('#')[0];
          if (_samePage) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (!reduce) { try { window.YiQiLogo.play(_svg, {phase:'all', force:true}); } catch(err){} }
            return;
          }
          if (reduce) return;
          e.preventDefault();
          let _done = false;
          const _go = () => { if (_done) return; _done = true; try { sessionStorage.setItem('yiqiLogoContinue','1'); } catch(err){} window.location.href = _home; };
          let _anims = [];
          try { _anims = window.YiQiLogo.play(_svg, {phase:'rise', force:true}) || []; } catch(err){ _go(); return; }
          if (_anims.length) { Promise.all(_anims.map(a => a.finished)).then(_go).catch(_go); setTimeout(_go, 600); }
          else _go();
        });
      }
    }).call(this);


    /* ── Overlay + mobile nav ── */
    const overlay   = this.querySelector('#overlay');
    const mobileNav = this.querySelector('#mobileNav');

    this.querySelector('#menuBtn').addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      overlay.classList.remove('show');
    });

    const navClose = this.querySelector('#mobileNavClose');
    if (navClose) navClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      overlay.classList.remove('show');
    });

    /* ── Theme (solo si no está definido ya en la página) ── */
    if (!window._yiqiHeaderTheme) {
      window._yiqiHeaderTheme = true;
      const _mq = window.matchMedia('(prefers-color-scheme: dark)');
      const _resolve = v => v === 'system' ? (_mq.matches ? 'dark' : 'light') : v;

      if (!window.setTheme) {
        window.setTheme = function(v) {
          localStorage.setItem('yiqi-theme', v);
          document.documentElement.dataset.theme = _resolve(v);
          document.querySelectorAll('.theme-opt[data-val]').forEach(b =>
            b.classList.toggle('active', b.dataset.val === v));
        };
        _mq.addEventListener('change', () => {
          if ((localStorage.getItem('yiqi-theme') || 'system') === 'system') window.setTheme('system');
        });
      }

      const _init = () => {
        const saved = localStorage.getItem('yiqi-theme') || 'system';
        document.documentElement.dataset.theme = _resolve(saved);
        document.querySelectorAll('.theme-opt[data-val]').forEach(b =>
          b.classList.toggle('active', b.dataset.val === saved));
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _init);
      } else {
        _init();
      }
    }
  }
}

customElements.define('site-header', SiteHeader);
