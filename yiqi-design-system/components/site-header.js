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
      { label: 'API Docs',      href: r('api-docs.html')                                      },
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

    const logo = `<svg width="60" height="39" viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path class="yql" d="M20.44,48.34l2.57-6.15-6.79-16.91c-.14-.39.07-.61.46-.61h4.97c.29,0,.57.14.68.43l3.58,10.08,3.61-10.08c.11-.29.39-.43.68-.43h4.97c.39,0,.57.21.43.61l-9.26,23.27c-.11.29-.39.43-.68.43h-4.75c-.43,0-.68-.21-.47-.64Z"/>
      <path class="yql" d="M38.5,18.99c0-1.77,1.35-3.19,3.23-3.19s3.23,1.42,3.23,3.19-1.38,3.23-3.23,3.23-3.23-1.42-3.23-3.23ZM38.72,25.24c0-.32.25-.57.57-.57h4.89c.32,0,.57.25.57.57v16.24c0,.32-.25.57-.57.57h-4.89c-.32,0-.57-.25-.57-.57v-16.24Z"/>
      <path class="yqs" d="M57.91,44.78v-2.66c-2.18-.53-4.21-1.66-5.92-3.36-4.97-4.97-5.09-13.02-.03-18.08,5.09-5.09,13.14-4.97,18.11,0s5.09,13.02,0,18.11c-1.78,1.78-3.94,2.93-6.22,3.46v2.51c0,.35-.18.53-.58.53h-4.82c-.3,0-.55-.2-.55-.5ZM56.28,34.47c.5.5,1.05.9,1.65,1.2v-3.36c0-.35.18-.53.53-.53h4.87c.25,0,.53.18.53.53v3.36c.63-.33,1.23-.78,1.78-1.33,2.73-2.73,2.78-6.75.15-9.38s-6.67-2.61-9.41.13c-2.71,2.71-2.73,6.75-.1,9.38Z"/>
      <path class="yql" d="M77.22,18.99c0-1.77,1.35-3.19,3.23-3.19s3.23,1.42,3.23,3.19-1.38,3.23-3.23,3.23-3.23-1.42-3.23-3.23ZM77.44,25.24c0-.32.25-.57.57-.57h4.89c.32,0,.57.25.57.57v16.24c0,.32-.25.57-.57.57h-4.89c-.32,0-.57-.25-.57-.57v-16.24Z"/>
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
  ${navItems}
  ${themeToggle}
  <a href="https://me.yiqi.com.ar" target="_blank" class="nav-link">Login</a>
</nav>

<header class="topbar">
  <a href="${r('index.html')}" class="topbar-logo">${logo}</a>

  <div class="topbar-spacer"></div>

  <nav class="topbar-nav">
    ${navItems}
  </nav>

  ${themeToggle}

  <a href="https://me.yiqi.com.ar" target="_blank" class="btn-login">
    Login
  </a>

  <button class="mobile-menu-btn" id="menuBtn" style="margin-left:auto" aria-label="Menú">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</header>`;

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
