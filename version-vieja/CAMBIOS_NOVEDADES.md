Perfecto. Ya dejé implementado todo en www.yiqi sin levantar el proyecto.

## Cambios realizados

1. Nueva opción Novedades en la barra superior
- Agregada entre Blog y Preguntas frecuentes en [www.yiqi/components/header.tsx](www.yiqi/components/header.tsx)

2. Método para obtener y guardar token de YiQi
- Implementado cliente de autenticación con cache en memoria y renovación automática por expiración en [www.yiqi/lib/yiqi-api.ts](www.yiqi/lib/yiqi-api.ts)
- Usa POST a /token con application/x-www-form-urlencoded y grant_type=password
- El token queda guardado en cache del servidor (proceso Node), reutilizable entre llamadas

3. Consulta paginada de NOVEDADES (schemaId 1387)
- Implementada en [www.yiqi/lib/novedades-store.ts](www.yiqi/lib/novedades-store.ts)
- Endpoint: /api/public/NOVEDADES/query?schemaId=1387
- Payload armado según lo que pediste (columnas, filtro DESC_ESTADO=Publicada, pageSize 50)
- Paginación por total: si total es 50 sigue a la siguiente página; corta cuando es menor a 50
- Se toma el array data y se normaliza para UI

4. Nueva página Novedades con tarjetas
- Página creada en [www.yiqi/app/novedades/page.tsx](www.yiqi/app/novedades/page.tsx)
- UI de tarjetas creada en [www.yiqi/components/novedades-content.tsx](www.yiqi/components/novedades-content.tsx)
- Cada tarjeta muestra:
  - Título
  - Descripción
  - Módulo y Tipo en tamaño menor
  - Link de ayuda desde NOVE_LINK_WIKI

5. Buscador y filtros
- Buscador por texto libre (título, descripción, módulo, tipo, producto)
- Filtro por módulo
- Filtro por tipo de mejora
- Todo implementado en [www.yiqi/components/novedades-content.tsx](www.yiqi/components/novedades-content.tsx)

6. Configuración de entorno
- Variables agregadas en [www.yiqi/.env.example](www.yiqi/.env.example):
  - YIQI_API_USERNAME
  - YIQI_API_PASSWORD
  - YIQI_API_SECURITY_BASE_URL
  - YIQI_API_PUBLIC_BASE_URL
  - YIQI_API_SCHEMA_ID
- Sitemap actualizado para incluir la ruta nueva en [www.yiqi/app/sitemap.ts](www.yiqi/app/sitemap.ts)

## Validación
- Revisé errores de TypeScript/lenguaje en archivos modificados y no se detectaron errores.

## Importante
- Como pediste, no levanté el proyecto.
- Para que la página traiga novedades reales, falta completar YIQI_API_USERNAME y YIQI_API_PASSWORD en tu .env.local.

Si querés, en el próximo paso te agrego también un endpoint interno de revalidación/cache para invalidar token y recargar novedades bajo demanda.
