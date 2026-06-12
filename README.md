# www.yiqi

Sitio estatico de YiQi servido por `node server.js`.

## Ejecutar en local

1. Instalar dependencias:

```bash
npm install
```

2. Credenciales para cargar novedades desde la API de YiQi:

El servidor ya trae configuradas por defecto las credenciales solicitadas para novedades:

```text
Usuario: cristal@yiqi.com.ar
Password: yiqibot2023X
```

Opcionalmente, se pueden sobreescribir por variables de entorno:

```powershell
$env:YIQI_API_USER="<usuario>"
$env:YIQI_API_PASSWORD="<password>"
$env:YIQI_API_SCHEMA_ID="1387"
$env:YIQI_API_CONTACT_SCHEMA_ID="23"
```

Variables opcionales:

- `YIQI_API_AUTH_URL` (default: `https://api.yiqi.com.ar/token`)
- `YIQI_API_PUBLIC_BASE_URL` (default: `https://api.yiqi.com.ar/api/public`)
- `YIQI_API_CONTACT_SCHEMA_ID` (default: `23`)

3. Iniciar servidor:

```bash
npm start
```

4. Abrir:

- `http://localhost:8080`
- `http://localhost:8080/novedades.html`

## Endpoint local de novedades

El servidor expone `GET /api/novedades`.

- Obtiene un token OAuth en backend.
- Consulta `POST /api/public/NOVEDADES/query?schemaId=...`.
- Filtra novedades publicadas y retorna items normalizados para UI.

De esta forma, las credenciales no se exponen en el navegador.

## Endpoint local de contacto

El servidor expone `POST /api/contacto`.

- Recibe payload JSON con formato:

```json
{
	"schemaId": 23,
	"data": {
		"COCO_CONTACTO": "...",
		"COCO_CLIENTE": "...",
		"COCO_CONSULTA": "...",
		"COCO_TELEFONO": "...",
		"COCO_MAIL": "...",
		"COCO_CANT_EMPLEADOS": 50,
		"COCO_RUBRO_PRINCIPAL": "...",
		"COCO_MODULOS_DE_INTERES": "Ventas, Stock"
	}
}
```

- Si `schemaId` no se envia, usa `YIQI_API_CONTACT_SCHEMA_ID` (default `23`).
- Obtiene token OAuth en backend y llama `POST /api/public/CONSULTA_COMERCIAL`.

---

## Assets — Logo de mails (NO BORRAR)

Los mails que salen de YiQi referencian un logo **por URL absoluta** en el WordPress
(`yiqi.com.ar`), no en este repo. Si se borra ese archivo, los mails salen **sin logo**.

- **URL / archivo:** `https://yiqi.com.ar/wp-content/uploads/2022/05/FM_logo_header-544x303-1-300x167.png`
- **Nombre exacto:** `FM_logo_header-544x303-1-300x167.png` (no renombrar)
- **Carpeta exacta:** `wp-content/uploads/2022/05/`
- **Tamaño:** 300×167 px (PNG)

**Regla:** aunque el sitio nuevo use logos en SVG, este PNG debe seguir existiendo con ese
nombre y en esa carpeta para que los mails ya enviados / plantillas existentes sigan funcionando.
Si hace falta regenerarlo, se puede exportar desde `system/icons/LOGO YiQi 100x65.svg` a 300×167.

**Respaldo en el repo:** en `mail-assets/` hay una copia lista para subir (fondo transparente, 300×167, logo YiQi actual — no el "FM" original). Para que sea obvio dónde va en el servidor, se replicó la ruta exacta:

```
mail-assets/wp-content/uploads/2022/05/FM_logo_header-544x303-1-300x167.png
```

Subí ese `wp-content/...` por FTP a la raíz del WordPress respetando la estructura. (También queda una copia plana en `mail-assets/` con el mismo archivo.)
