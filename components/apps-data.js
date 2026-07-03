/* ============================================================
   YiQi Apps — FUENTE ÚNICA de datos del Marketplace
   Consumida por: <app-card> (grid del marketplace + carrusel del
   banner iAready). Actualizá una app acá y se refleja en todos lados.
   Campos: id, name, category, accent (clase c-*), state (live|dev),
   stateLabel, desc, glyph (SVG inner). img y url se derivan del id.
   ============================================================ */
(function () {
  const APPS = [
    {
      id: 'yiqi-analytics-pro',
      name: 'YiQi Analytics Pro',
      category: 'Analytics',
      accent: 'c-ana',
      state: 'live',
      stateLabel: 'Disponible',
      desc: 'Tablero gerencial con KPIs en tiempo real con IA: ventas, stock, finanzas, canales y márgenes en una sola vista.',
      glyph: '<path d="M3 3v18h18"/><polyline points="7 13 11 9 14 12 20 6"/>'
    },
    {
      id: 'front-de-proveedores-ocr',
      name: 'Front de Proveedores OCR',
      category: 'Proveedores',
      accent: 'c-prov',
      state: 'dev',
      stateLabel: 'En desarrollo',
      desc: 'Portal de autogestión para proveedores: carga de facturas y órdenes de compra con OCR, integrado a YiQi.',
      glyph: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/>'
    },
    {
      id: 'inventariado-mobile',
      name: 'Inventariado Mobile',
      category: 'Inventario',
      accent: 'c-pick',
      state: 'dev',
      stateLabel: 'En desarrollo',
      desc: 'Relevamiento y control de stock desde el celular: escaneo de códigos y sincronización en tiempo real con YiQi.',
      glyph: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/><path d="M12 13l2 2 4-4"/>'
    },
    {
      id: 'yiqi-pos',
      name: 'YiQi POS',
      category: 'Punto de venta',
      accent: 'c-pos',
      state: 'live',
      stateLabel: 'Disponible',
      desc: 'Punto de venta para Windows: modo offline, multi-caja, medios de pago e impresión fiscal, integrado al ERP.',
      glyph: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'
    },
    {
      id: 'picking-list',
      name: 'Picking List',
      category: 'Operaciones',
      accent: 'c-inv',
      state: 'dev',
      stateLabel: 'En desarrollo',
      desc: 'Listas de preparación para depósito: arma el picking de varios pedidos y controla la salida de mercadería.',
      glyph: '<path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/><rect x="9" y="2.5" width="6" height="4" rx="1"/><path d="M8.5 13.5l2 2 4-4"/>'
    },
    {
      id: 'consulta-de-pedidos',
      name: 'Consulta de pedidos',
      category: 'Pedidos',
      accent: 'c-cons',
      state: 'dev',
      stateLabel: 'En desarrollo',
      desc: 'Búsqueda y seguimiento ágil de pedidos por estado, canal y cliente, sincronizado con YiQi en tiempo real.',
      glyph: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'
    }
  ];

  // Derivados
  APPS.forEach(a => {
    a.img = 'img/apps/' + a.id + '-horiz.webp';
    a.url = 'app.html?id=' + a.id;
  });

  window.YIQI_APPS = APPS;
  window.YIQI_APP_BY_ID = Object.fromEntries(APPS.map(a => [a.id, a]));
})();
