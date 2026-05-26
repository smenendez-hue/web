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
```

Variables opcionales:

- `YIQI_API_AUTH_URL` (default: `https://api.yiqi.com.ar/token`)
- `YIQI_API_PUBLIC_BASE_URL` (default: `https://api.yiqi.com.ar/api/public`)

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