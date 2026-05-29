/*
  YiQi — Meta Pixel: carga base + eventos custom
  ----------------------------------------------
  Un solo archivo que:
    1. Inicializa el píxel base si no está ya cargado (id 455192279196875).
    2. Dispara PageView.
    3. Trackea Contact (Calendly, WhatsApp, mailto, tel).
    4. Trackea ViewContent según la página (pathname).
  
  Notas:
    • El evento Lead se dispara desde gracias.html cuando hay query ?from=...
    • Cargar con <script src="./components/meta-pixel-events.js" defer></script>
      justo antes de </body> en todas las páginas del sitio.
*/
(function () {
  'use strict';

  var PIXEL_ID = '455192279196875';

  // ---------- 1. Carga del píxel base si no existe ----------
  if (typeof window.fbq !== 'function') {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // ---------- 2. Contact — clicks salientes ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    var href = a.href.toLowerCase();

    if (href.indexOf('calendly.com') > -1) {
      fbq('track', 'Contact', { method: 'calendly', destination: a.href });
    } else if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp.com') > -1) {
      fbq('track', 'Contact', { method: 'whatsapp' });
    } else if (href.indexOf('mailto:') === 0) {
      fbq('track', 'Contact', { method: 'email' });
    } else if (href.indexOf('tel:') === 0) {
      fbq('track', 'Contact', { method: 'phone' });
    }
  }, { passive: true });

  // ---------- 3. ViewContent — páginas clave ----------
  var path = (location.pathname || '').toLowerCase();
  // Normaliza: quita / inicial y .html final para matchear robusto
  var slug = path.replace(/^\/+/, '').replace(/\.html?$/, '').replace(/\/$/, '');

  var PAGE_MAP = {
    'ia-ready':       { name: 'IA Ready',               category: 'product' },
    'contacto':       { name: 'Contacto',               category: 'contact' },
    'faq':            { name: 'Preguntas frecuentes',   category: 'support' },
    'ayuda-erp':      { name: 'Ayuda ERP',              category: 'support' },
    'api-docs':       { name: 'API Docs',               category: 'product' },
    'marketplace':    { name: 'Marketplace',            category: 'product' },
    'asistente':      { name: 'Asistente IA',           category: 'product' },
    'capacitaciones': { name: 'Capacitaciones',         category: 'support' },
    'novedades':      { name: 'Novedades',              category: 'content' },
    'acerca-de':      { name: 'Acerca de YiQi',         category: 'company' },
    'erp-mobile':     { name: 'YiQi Mobile',            category: 'product' },
    'erp-panel':      { name: 'YiQi Panel',             category: 'product' }
  };

  // Home: slug vacío o "index"
  if (slug === '' || slug === 'index') {
    fbq('track', 'ViewContent', {
      content_name:     'Home',
      content_category: 'landing',
      content_type:     'page'
    });
  }

  var page = PAGE_MAP[slug];
  if (page) {
    fbq('track', 'ViewContent', {
      content_name:     page.name,
      content_category: page.category,
      content_type:     'page'
    });
  }
})();
