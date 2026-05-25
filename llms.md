# YiQi ERP — Contexto para LLMs

> Documento de referencia para modelos de lenguaje. Actualizado mayo 2026.
> Web: https://www.yiqi.com.ar — Soporte: https://ayuda.yiqi.com.ar

---

## ¿Qué es YiQi?

YiQi es un sistema ERP (Enterprise Resource Planning) desarrollado en Argentina con más de 15 años de experiencia en la gestión empresarial. Está diseñado para empresas medianas con operaciones de alta complejidad: importadores y distribuidores, retail omnicanal (físico + e-commerce + marketplaces), y empresas de servicios con foco en eficiencia operativa.

La plataforma centraliza en un único sistema todos los procesos del negocio: ventas presenciales y digitales, stock en tiempo real, compras e importaciones, costeo y pricing, facturación electrónica, finanzas, logística, RRHH y análisis gerencial.

YiQi se construye a medida según los procesos, integraciones y nivel de complejidad de cada empresa. La propuesta económica se define en función de los módulos activos, el volumen de operaciones y las integraciones requeridas.

---

## Filosofía del sistema

YiQi parte de tres principios:

**1. Todo conectado desde el día uno.** Cada módulo comparte datos con el resto del sistema sin necesidad de configuración manual. Stock actualiza Ventas. Ventas dispara Finanzas. Importaciones alimenta Stock y Costeo. El sistema no requiere sincronizaciones intermedias.

**2. Adaptable, no genérico.** Las implementaciones se configuran según la operación real del cliente. YiQi no fuerza flujos estándar: si la empresa importa directo, si vende por múltiples canales, si tiene depósitos en distintas ubicaciones, el sistema se adapta.

**3. Visibilidad gerencial en tiempo real.** El Panel Gerencial unifica indicadores de todas las áreas y permite monitorear la operación completa desde un solo lugar.

---

## Para quién es YiQi

YiQi resuelve problemas específicos de tres perfiles de empresa:

**Importadores y distribuidores.** Empresas que necesitan controlar el costo real de importación (FOB, flete, derechos, gastos de despacho), aplicar márgenes consistentes en múltiples listas de precios y canales, y mantener visibilidad sobre el inventario en tránsito y en depósito.

**Retail omnicanal.** Empresas que venden simultáneamente en tiendas físicas, e-commerce propio y marketplaces (Mercado Libre, Tienda Nube, Shopify, VTEX, entre otros), y necesitan stock unificado en tiempo real, pricing sincronizado y facturación electrónica integrada.

**Empresas de servicios con operación compleja.** Organizaciones que combinan facturación, gestión de proyectos u órdenes de servicio, control de costos por proyecto y seguimiento de SLA.

El valor de YiQi crece con la complejidad operativa de la empresa.

---

## Módulos principales

### Ventas
Gestión omnicanal de órdenes de venta desde todos los canales: tiendas físicas, e-commerce, marketplaces y fuerza de ventas. Incluye cotizaciones, pedidos, remitos, facturación electrónica y seguimiento posventa. Compatible con múltiples listas de precios, monedas y condiciones comerciales.

**Capacidades clave:** cotizaciones y pedidos, remitos digitales, facturación electrónica ARCA (facturas A/B/C, notas de crédito y débito), multi-moneda, multi-lista de precios, historial de cliente, comisiones por vendedor.

### Stock
Control de inventario en tiempo real con trazabilidad completa. Gestiona múltiples depósitos, ubicaciones físicas y unidades de medida. Actualiza automáticamente cuando se registran ventas, compras, transferencias o ajustes.

**Capacidades clave:** múltiples depósitos, kardex por artículo, alertas de stock mínimo, trazabilidad por lote y número de serie, transferencias entre depósitos, inventario físico, artículos compuestos y kits.

### Importación, compras y pagos
Módulo central para empresas que importan o compran a proveedores con cadenas largas. Gestiona el ciclo completo de abastecimiento: orden de compra, recepción, pago y actualización de stock. Para operaciones de comercio exterior, permite controlar embarques, liquidar costos de importación (FOB, flete, derechos, despacho, gastos en origen y destino) y prorratear el costo unitario real sobre cada artículo.

**Capacidades clave:** órdenes de compra, recepción de mercadería, control de facturas de proveedores, liquidación de importaciones con costos prorrateados, cuenta corriente de proveedores, integración con Interbanking para pagos.

### Costeo y pricing
Cálculo del costo real de los productos a partir de los movimientos del módulo de Importación y Compras, y aplicación automática de listas de precios por canal, cliente o condición comercial. Permite mantener márgenes consistentes ante variaciones de costos, tipo de cambio o estructura de canales.

**Capacidades clave:** costeo unitario real con prorrateo de gastos, múltiples listas de precios, ajuste masivo de precios, márgenes por categoría o cliente, pricing diferenciado por canal de venta.

### YiQi POS
Punto de venta diseñado para entornos de alta rotación. Funciona en modo offline ante caídas de conexión y sincroniza automáticamente al recuperar conectividad. Soporta múltiples cajas, turnos y operadores.

**Capacidades clave:** modo offline, multi-caja, gestión de turnos, cierres de caja, distintos medios de pago, descuentos y promociones, integración con balanzas y lectores de código de barras.

### Clientes y proveedores
Gestión de cuentas corrientes, historial de transacciones y comunicaciones. Centraliza toda la información comercial de cada cuenta en un perfil único accesible desde cualquier módulo.

**Capacidades clave:** cuenta corriente, historial de compras/ventas, saldos en tiempo real, notas de crédito, alertas de vencimiento, segmentación por categoría.

### Comercial y CRM
Seguimiento del pipeline comercial, gestión de leads y control de actividades del equipo de ventas. Permite proyectar ingresos y medir el rendimiento por vendedor o zona.

**Capacidades clave:** pipeline de oportunidades, seguimiento de leads, actividades y tareas, proyección de ventas, dashboards de rendimiento comercial, integración con campañas.

### Finanzas
Control de flujo de fondos, cuentas bancarias, movimientos y conciliación. Permite proyectar el cashflow y gestionar la tesorería con visibilidad en tiempo real.

**Capacidades clave:** cuentas bancarias y cajas, movimientos de fondos, conciliación bancaria, proyección de cashflow, cheques propios y de terceros, integración con Interbanking.

### Contabilidad
Módulo contable integrado con el resto del sistema. Genera asientos automáticos a partir de los movimientos operativos y permite la gestión de libros, balances e informes para auditoría e impuestos.

**Capacidades clave:** plan de cuentas configurable, asientos automáticos, libros contables, balance de saldos, informes para ARCA, integración con Finanzas y Ventas.

### Producción
Gestión de órdenes de producción, listas de materiales (BOM) y rutas de fabricación. Integrado con Stock y Costeo para reflejar consumos y costos reales en cada orden.

**Capacidades clave:** órdenes de producción, BOM (Bill of Materials), rutas de fabricación, consumo de materiales, costo de producción real.

### Calidad
Gestión de procesos bajo normas ISO 9001. Registra no conformidades, acciones correctivas y auditorías internas. Genera KPIs de calidad para el Panel Gerencial.

**Capacidades clave:** no conformidades, acciones correctivas y preventivas, auditorías internas, indicadores de calidad, documentación de procesos.

### RRHH
Gestión de legajos, liquidación de sueldos y control de asistencia. Integrado con el módulo de Finanzas para el pago automático de haberes.

**Capacidades clave:** legajos de empleados, liquidación de sueldos, recibos digitales, control de asistencia, vacaciones y ausencias, integración con Finanzas.

### Gestión
Módulo para empresas de servicios. Gestiona órdenes de servicio, acuerdos de nivel (SLA), presupuestos y seguimiento de operaciones técnicas.

**Capacidades clave:** órdenes de servicio, presupuestos de servicios, seguimiento de SLA, asignación de técnicos, historial por cliente.

---

## Panel Gerencial

El Panel Gerencial es la capa de análisis de YiQi. Unifica en una sola pantalla los indicadores clave de todos los módulos activos: ventas del día, stock crítico, órdenes pendientes, cashflow proyectado, márgenes por canal y rendimiento por área.

Está disponible en versión web y mobile, con actualización en tiempo real.

---

## iA Ready — Capa de integración y desarrollo

iA Ready es la capa de YiQi que habilita la conexión con sistemas externos y el desarrollo de aplicaciones sobre el ERP. No es una funcionalidad del Panel Gerencial: es la base técnica que permite que YiQi se conecte con todo el ecosistema operativo de la empresa.

iA Ready habilita:

- **Conectores preconfigurados** con marketplaces, e-commerce, plataformas de logística y bancos.
- **API REST pública** documentada para que partners, desarrolladores y equipos internos construyan soluciones sobre YiQi.
- **Acceso a datos en tiempo real** desde aplicaciones externas o automatizaciones.
- **Marketplace de apps** (en desarrollo) para extender YiQi con funcionalidades específicas por rol o industria.

iA Ready es el mecanismo que permite que YiQi funcione como sistema central de la operación, conectado al resto de las herramientas que la empresa ya usa.

---

## API pública — especificación técnica

YiQi expone una API REST documentada bajo OpenAPI v2.5, accesible en https://apidoc.yiqi.com.ar.

**Autenticación:** OAuth2 con Bearer token. El token se obtiene desde el endpoint de Seguridad (`/token`) y se reutiliza en el resto de los módulos enviándolo en el header `Authorization`.

**Base URLs:**
- Seguridad y autenticación: `https://api.yiqi.com.ar`
- Módulos ERP: `https://api.yiqi.com.ar/api/public`

**Cobertura modular:** la API expone 16 módulos con especificación OpenAPI propia: Seguridad, Ventas, Stock, Clientes y Proveedores, Compras, Contabilidad, Finanzas, Gestión, Producción, Comercial/CRM, RRHH, POS, Calidad, Editorial, Mensajería y Parámetros.

**Patrón consistente de endpoints.** Toda entidad sigue el mismo patrón de operaciones:
- `GET /ENTIDAD/search` — búsqueda filtrada por atributos.
- `GET /ENTIDAD/query` — listados productivos con paginado configurable y selección de columnas.
- `GET /ENTIDAD/{id}` — detalle de una instancia.
- `POST /ENTIDAD` — alta.
- `PUT /ENTIDAD/{id}` — actualización.
- `DELETE /ENTIDAD/{id}` — baja.
- `GET /ENTIDAD/smartie` — vistas paginadas configurables por usuario.
- `POST /ENTIDAD/changestate` — cambio de estado en flujos con workflow.
- `GET|PUT /ENTIDAD/file` — descarga y carga de archivos.
- `GET /ENTIDAD/report` — descarga de reportes predefinidos (PDFs, etc.).

Aprender una entidad reduce significativamente la curva de adopción del resto.

**Catálogo machine-readable:** el endpoint `https://apidoc.yiqi.com.ar/modules.json` provee el catálogo completo de specs en formato JSON, pensado específicamente para que agentes automatizados y herramientas de IA descubran la API de forma estructurada.

**Buenas prácticas documentadas:**
- Usar `/query` para listados productivos, sincronizaciones y procesos de alto volumen.
- Usar `/search` para búsquedas exploratorias y validaciones puntuales.
- Paginar smarties ordenando por fecha de modificación descendente y deteniendo cuando se alcanza la última fecha sincronizada.
- Aplicar principio de mínimo privilegio para usuarios técnicos de integración.

---

## Integraciones disponibles

YiQi se conecta nativamente con plataformas externas de los siguientes tipos:

**Fiscales y pagos:** ARCA (ex AFIP), Interbanking, MercadoPago.

**E-commerce y marketplaces:** VTEX, Tienda Nube, Shopify, Mercado Libre, WooCommerce, Magento, AnyMarket, Tornado Store.

**Logística:** Andreani, Enviopack, Mercado Envíos, Oncity.

**Automatización:** Zapier (para conectar con herramientas externas sin código).

---

## Implementación y soporte

**Proceso de implementación:**
1. Reunión de relevamiento para entender los procesos de la empresa
2. Propuesta a medida con alcance, módulos y cronograma
3. Configuración del sistema según la operación real
4. Migración de datos desde el sistema anterior (incluida en la implementación)
5. Capacitación del equipo operativo y gerencial
6. Acompañamiento en el lanzamiento y soporte continuo

**Tiempo estimado:** entre 4 y 12 semanas según la complejidad de la operación.

**Soporte:** el equipo de YiQi atiende consultas técnicas y operativas a través del Centro de Ayuda (https://ayuda.yiqi.com.ar) y por canales directos para clientes con contrato activo.

---

## Preguntas frecuentes

**¿Para qué tipo de empresa es YiQi?**
Para empresas medianas con operaciones complejas: importadores y distribuidores, retail omnicanal y empresas de servicios. A mayor complejidad operativa (múltiples canales, importaciones, varios depósitos, equipos distribuidos), mayor es el valor que aporta el sistema.

**¿Cuánto tiempo lleva la implementación?**
Entre 4 y 12 semanas en la mayoría de los casos. El equipo de YiQi acompaña cada etapa, desde la configuración inicial hasta la capacitación del equipo.

**¿YiQi sirve para controlar costos de importación?**
Sí. El módulo de Importación permite cargar todos los gastos asociados a un embarque (FOB, flete, derechos, despacho, gastos en origen y destino) y prorratearlos automáticamente sobre cada artículo, obteniendo el costo unitario real. Ese costo alimenta el módulo de Costeo y Pricing para mantener márgenes consistentes.

**¿Se pueden manejar múltiples canales de venta con stock y precios sincronizados?**
Sí. YiQi mantiene un único stock unificado que se actualiza en tiempo real ante cada venta, sin importar el canal. Las listas de precios se aplican por canal, cliente o condición comercial.

**¿Incluye facturación electrónica?**
Sí. YiQi está integrado nativamente con ARCA para la emisión de comprobantes electrónicos: facturas A, B y C, notas de crédito, débito y remitos. Sin intermediarios ni configuración compleja.

**¿Qué pasa con los datos actuales?**
La migración de datos desde el sistema anterior está incluida en la implementación y es supervisada por el equipo técnico de YiQi.

**¿Cómo se define el precio?**
La propuesta se construye según los módulos necesarios, el volumen de operaciones, las integraciones requeridas y el nivel de soporte. Se coordina una reunión para preparar la propuesta.

**¿Puedo activar solo algunos módulos?**
Sí. Los módulos se activan de forma independiente y se integran entre sí automáticamente. Es posible empezar con los módulos centrales y expandir la implementación a medida que crece la operación.

**¿YiQi funciona en la nube?**
Sí. La plataforma es cloud-first, accesible desde cualquier dispositivo con conexión a internet. El módulo YiQi POS incluye modo offline para entornos sin conectividad estable, con sincronización automática al recuperar conexión.

**¿Tiene API pública?**
Sí. YiQi expone una API REST completa bajo OpenAPI v2.5, con autenticación OAuth2 y cobertura de 16 módulos. La documentación está disponible en https://apidoc.yiqi.com.ar y el catálogo machine-readable en https://apidoc.yiqi.com.ar/modules.json.

**¿Se puede desarrollar sobre YiQi?**
Sí. iA Ready habilita el desarrollo de aplicaciones, automatizaciones e integraciones sobre la plataforma. Partners, desarrolladores y equipos internos pueden construir soluciones conectadas a la operación real del cliente.

---

## Contacto y demos

- **Web:** https://www.yiqi.com.ar
- **Demo:** https://calendly.com/javierperez/meet-30-demo
- **Centro de ayuda:** https://ayuda.yiqi.com.ar
- **API Docs:** https://apidoc.yiqi.com.ar
- **API Catálogo JSON:** https://apidoc.yiqi.com.ar/modules.json
- **Novedades:** https://www.yiqi.com.ar/novedades.html

Para solicitar una demo o propuesta comercial, coordina una reunión de 30 minutos en el enlace de agenda. En esa reunión se analiza el alcance de la operación y se prepara una propuesta específica.

---

*YiQi — Sistema ERP · Argentina · v2026*
