/* ============================================================
   YiQi Site Footer — Web Component
   Uso: <site-footer base="./|../"></site-footer>
   DS v1.2.6
   ============================================================ */

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || './';
    const r = (path) => base + path;

    const logo = `<svg width="60" height="39" viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path class="yql" d="M20.44,48.34l2.57-6.15-6.79-16.91c-.14-.39.07-.61.46-.61h4.97c.29,0,.57.14.68.43l3.58,10.08,3.61-10.08c.11-.29.39-.43.68-.43h4.97c.39,0,.57.21.43.61l-9.26,23.27c-.11.29-.39.43-.68.43h-4.75c-.43,0-.68-.21-.47-.64Z"/>
      <path class="yql" d="M38.5,18.99c0-1.77,1.35-3.19,3.23-3.19s3.23,1.42,3.23,3.19-1.38,3.23-3.23,3.23-3.23-1.42-3.23-3.23ZM38.72,25.24c0-.32.25-.57.57-.57h4.89c.32,0,.57.25.57.57v16.24c0,.32-.25.57-.57.57h-4.89c-.32,0-.57-.25-.57-.57v-16.24Z"/>
      <path class="yqs" d="M57.91,44.78v-2.66c-2.18-.53-4.21-1.66-5.92-3.36-4.97-4.97-5.09-13.02-.03-18.08,5.09-5.09,13.14-4.97,18.11,0s5.09,13.02,0,18.11c-1.78,1.78-3.94,2.93-6.22,3.46v2.51c0,.35-.18.53-.58.53h-4.82c-.3,0-.55-.2-.55-.5ZM56.28,34.47c.5.5,1.05.9,1.65,1.2v-3.36c0-.35.18-.53.53-.53h4.87c.25,0,.53.18.53.53v3.36c.63-.33,1.23-.78,1.78-1.33,2.73-2.73,2.78-6.75.15-9.38s-6.67-2.61-9.41.13c-2.71,2.71-2.73,6.75-.1,9.38Z"/>
      <path class="yql" d="M77.22,18.99c0-1.77,1.35-3.19,3.23-3.19s3.23,1.42,3.23,3.19-1.38,3.23-3.23,3.23-3.23-1.42-3.23-3.23ZM77.44,25.24c0-.32.25-.57.57-.57h4.89c.32,0,.57.25.57.57v16.24c0,.32-.25.57-.57.57h-4.89c-.32,0-.57-.25-.57-.57v-16.24Z"/>
    </svg>`;

    const socials = `
<div class="footer-socials">
  <a href="https://www.linkedin.com/company/yiqi-sa" target="_blank" rel="noopener" class="social-btn" aria-label="LinkedIn">
    <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2" fill="currentColor" stroke="none"/></svg>
  </a>
  <a href="https://instagram.com/yiqisa" target="_blank" rel="noopener" class="social-btn" aria-label="Instagram">
    <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  </a>
  <a href="https://facebook.com/yiqi.com.ar" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook">
    <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  </a>
  <a href="https://youtube.com/@yiqi3369" target="_blank" rel="noopener" class="social-btn" aria-label="YouTube">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
  </a>
</div>`;

    this.innerHTML = `
<footer class="footer">
  <div class="footer-terminal">
    <div class="footer-grid">

      <!-- Col 1: Logo -->
      <div class="footer-block footer-block--brand">
        <a href="${r('index.html')}" class="footer-logo-link" aria-label="YiQi — inicio">
          ${logo}
        </a>
        ${socials}
      </div>

      <!-- Col 2: Producto -->
      <div class="footer-block">
        <p class="footer-block-label">Producto</p>
        <div class="footer-contacts">
          <a href="${r('capacitaciones.html')}">Capacitaciones</a>
          <a href="${r('novedades.html')}">Novedades</a>
          <a href="${r('ia-ready.html')}">IA Ready</a>
          <a href="https://apidoc.yiqi.com.ar/" target="_blank" rel="noopener">API Docs</a>
          <a href="${r('faq.html')}">FAQ</a>
          <a href="https://me.yiqi.com.ar" target="_blank" rel="noopener">Login</a>
        </div>
      </div>

      <!-- Col 3: Empresa -->
      <div class="footer-block">
        <p class="footer-block-label">Empresa</p>
        <div class="footer-contacts">
          <a href="${r('acerca-de.html')}">Acerca de YiQi</a>
          <a href="mailto:cv@yiqi.com.ar">Trabaja con nosotros</a>
          <a href="${r('contacto.html')}">Contacto</a>
          <a href="https://yiqi.com.ar" target="_blank" rel="noopener">yiqi.com.ar</a>
        </div>
      </div>

      <!-- Col 4: Ayuda ERP -->
      <div class="footer-block">
        <p class="footer-block-label">Ayuda ERP</p>
        <div class="footer-contacts">
          <a href="${r('ayuda-erp.html')}">Ayuda ERP</a>
          <a href="https://calendly.com/javierperez/meet-30-demo" target="_blank" rel="noopener">Reserva tu demo</a>
          <a href="mailto:comercial@yiqi.com.ar">comercial@yiqi.com.ar</a>
          <a href="https://wa.me/5491123727422" target="_blank" rel="noopener">+54 11 2372 7422</a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <p class="footer-copy">© 2026 YiQi S.A. · Todos los derechos reservados</p>
      <a href="${r('yiqi-design-system.html')}" class="footer-version footer-version-link">DS v1.2.6</a>
    </div>
  </div>
</footer>`;
  }
}

customElements.define('site-footer', SiteFooter);
