export interface ModuleDetail {
  title: string
  description: string
}

export interface ModuleInfo {
  headline: string
  details: ModuleDetail[]
}

export interface ModuleItem {
  name: string
  icon: string
  description?: string
}

export const MODULES: ModuleItem[] = [
  {
    name: "Ventas",
    icon: "/images/modulos/shopping-cart.svg",
    description: "Omnicanalidad, e-commerce y franquicias conectadas.",
  },
  {
    name: "Stock",
    icon: "/images/modulos/package.svg",
    description: "Depósitos en tiempo real para todos los canales.",
  },
  {
    name: "Clientes y proveedores",
    icon: "/images/modulos/users-three.svg",
    description: "Relaciones comerciales y cuentas corrientes.",
  },
  {
    name: "YiQi POS",
    icon: "/images/modulos/storefront.svg",
    description: "Punto de venta integrado con el resto del ERP.",
  },
  {
    name: "Comercial y CRM",
    icon: "/images/modulos/user-plus.svg",
    description: "Venta consultiva y gestión de leads.",
  },
  {
    name: "Importación, compras y pagos",
    icon: "/images/modulos/bag.svg",
    description: "Órdenes de compra con trazabilidad financiera.",
  },
  {
    name: "Finanzas",
    icon: "/images/modulos/calculator.svg",
    description: "Cuentas bancarias sincronizadas y extractos automatizados.",
  },
  {
    name: "Contabilidad",
    icon: "/images/modulos/book.svg",
    description: "Asientos, impuestos y balances listos para auditoría.",
  },
  {
    name: "Calidad",
    icon: "/images/modulos/medal.svg",
    description: "Implementación de normas como ISO 9001.",
  },
  {
    name: "RRHH",
    icon: "/images/modulos/users-three.svg",
    description: "Legajos y liquidación de sueldos sin fricciones.",
  },
  {
    name: "Gestión",
    icon: "/images/modulos/package.svg",
    description: "Servicios y operaciones con seguimiento completo.",
  },
]

export const MODULE_DETAILS: Record<string, ModuleInfo> = {
  Ventas: {
    headline: "Ventas omnicanal con control total",
    details: [
      {
        title: "Omnicanalidad sincronizada",
        description:
          "Ventas en tiendas físicas, e-commerce, marketplaces y B2B con stock y precios unificados.",
      },
      {
        title: "Pedidos y facturación",
        description:
          "Cotizaciones, pedidos y facturas automáticas con trazabilidad por canal y vendedor.",
      },
      {
        title: "Reportes comerciales",
        description: "Ranking de productos, vendedores y canales para tomar decisiones ágiles.",
      },
      {
        title: "Listas de precios y promociones",
        description: "Promociones y listas diferenciadas por segmento y canal.",
      },
    ],
  },
  Stock: {
    headline: "Inventario actualizado en todos los canales",
    details: [
      {
        title: "Stock en tiempo real",
        description:
          "Visibilidad instantánea del stock por depósito, sucursal y canal desde un único tablero.",
      },
      {
        title: "Movimientos y ajustes",
        description: "Transferencias, entradas, salidas y ajustes con trazabilidad completa.",
      },
      {
        title: "Alertas inteligentes",
        description: "Notificaciones de stock mínimo, reposición automática y controles por ubicación.",
      },
      {
        title: "Trazabilidad detallada",
        description: "Seguimiento por lote, vencimiento y serie para cada movimiento.",
      },
    ],
  },
  "Clientes y proveedores": {
    headline: "Relaciones comerciales organizadas",
    details: [
      {
        title: "Base unificada",
        description: "Contactos, condiciones y documentos centralizados por cuenta.",
      },
      {
        title: "Cuentas corrientes",
        description: "Saldos, límites y vencimientos visibles en tiempo real.",
      },
      {
        title: "Historial completo",
        description: "Compras, ventas y comunicaciones de cada cliente y proveedor.",
      },
      {
        title: "Segmentación avanzada",
        description: "Etiquetas, grupos y campañas personalizadas para cada segmento.",
      },
    ],
  },
  "YiQi POS": {
    headline: "Punto de venta conectado",
    details: [
      {
        title: "Ventas rápidas",
        description: "Interfaz ágil para facturar, cobrar y cerrar turnos en segundos.",
      },
      {
        title: "Operación online/offline",
        description: "Registra ventas sin conexión y sincroniza automáticamente al restablecer.",
      },
      {
        title: "Multi-caja y seguridad",
        description: "Usuarios, permisos y arqueos por caja con trazabilidad completa.",
      },
      {
        title: "Integración total",
        description: "Stock, precios y cuentas corrientes unificados con el ERP.",
      },
    ],
  },
  "Comercial y CRM": {
    headline: "Gestión comercial con foco en resultados",
    details: [
      {
        title: "Pipeline de oportunidades",
        description: "Embudo de leads con etapas, responsables y alertas configurables.",
      },
      {
        title: "Agenda inteligente",
        description: "Tareas, recordatorios y actividades comerciales coordinadas.",
      },
      {
        title: "Cotizaciones y pedidos",
        description: "Versionado de cotizaciones y generación automática de pedidos aprobados.",
      },
      {
        title: "Reportes de equipo",
        description: "KPIs, rendimiento y efectividad por vendedor y campaña.",
      },
    ],
  },
  "Importación, compras y pagos": {
    headline: "Compras, importaciones y pagos bajo control",
    details: [
      {
        title: "Flujo de compras",
        description: "Solicitudes, órdenes, recepción y facturación conectadas.",
      },
      {
        title: "Pagos controlados",
        description: "Cheques, transferencias y pagos parciales con aprobaciones.",
      },
      {
        title: "Costos e importación",
        description: "Despachos, gastos y costos prorrateados en cada operación.",
      },
      {
        title: "Reportes de compras",
        description: "Ranking por proveedor y análisis del ciclo de compra.",
      },
    ],
  },
  Finanzas: {
    headline: "Control financiero preciso",
    details: [
      {
        title: "Cajas y bancos",
        description: "Conciliación automática de extractos y movimientos bancarios.",
      },
      {
        title: "Cashflow proyectado",
        description: "Flujos proyectados y reales para decisiones financieras rápidas.",
      },
      {
        title: "Impuestos simplificados",
        description: "Liquidaciones y presentaciones alineadas con las normas fiscales.",
      },
      {
        title: "Tesorería consolidada",
        description: "Pagos, cobros y posición de fondos en un solo lugar.",
      },
    ],
  },
  Contabilidad: {
    headline: "Contabilidad clara y ordenada",
    details: [
      {
        title: "Asientos inteligentes",
        description: "Asientos automáticos y manuales con reglas configurables por empresa.",
      },
      {
        title: "Libros contables",
        description: "Libro diario, mayores y balances listos para auditoría.",
      },
      {
        title: "Cierres e impuestos",
        description: "Cierres periódicos y reportes fiscales alineados a normativas locales.",
      },
      {
        title: "Estados contables",
        description: "Estados financieros con soporte para auditorías y compliance.",
      },
    ],
  },
  Calidad: {
    headline: "Calidad integrada al ERP",
    details: [
      {
        title: "KPIs y objetivos",
        description: "Seguimiento de indicadores y metas de calidad en tiempo real.",
      },
      {
        title: "No conformidades",
        description: "Registro, seguimiento y cierre de acciones correctivas.",
      },
      {
        title: "Documentación centralizada",
        description: "Procedimientos, versiones y alertas automáticas para cada norma.",
      },
      {
        title: "Auditorías alineadas",
        description: "Conexión con compras, producción y operaciones para cumplir normas ISO.",
      },
    ],
  },
  RRHH: {
    headline: "Personas y sueldos en orden",
    details: [
      {
        title: "Legajos digitales",
        description: "Documentación, licencias, capacitaciones y licencias en un solo lugar.",
      },
      {
        title: "Liquidación de sueldos",
        description: "Cálculo, recibos y transferencias automáticas por convenio.",
      },
      {
        title: "Novedades operativas",
        description: "Altas, bajas y modificaciones con trazabilidad y aprobaciones.",
      },
      {
        title: "Reportes y cumplimiento",
        description: "Informes para organismos, sindicatos y gestión interna.",
      },
    ],
  },
  Gestión: {
    headline: "Servicios organizados y medibles",
    details: [
      {
        title: "Órdenes de servicio",
        description: "Creación y seguimiento de trabajos, proyectos y contratos.",
      },
      {
        title: "Planificación",
        description: "Asignación de recursos, tiempos y equipos optimizados.",
      },
      {
        title: "Facturación de servicios",
        description: "Facturación por hitos, servicios y contratos recurrentes.",
      },
      {
        title: "Seguimiento operativo",
        description: "Estados, SLA y reportes de progreso con alertas automáticas.",
      },
    ],
  },
}
