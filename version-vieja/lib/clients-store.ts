import { loadLogoItems, type LogoItem } from "./logo-utils"

const CLIENTS_QUERY = `
SELECT
    CLIE_NOMBRE as clientName,
    CAST('' AS XML).value (
        'xs:base64Binary(sql:column("ARCH.ARCH_CONTENIDO"))',
        'VARCHAR(MAX)'
    ) as clientImage,
    ARCH_TIPO as typeImage,
    ISNULL(CLIE_RADIO, 0) as radioTamano
FROM
    ENT_CLIENTES
    LEFT JOIN ADM_ARCHIVO ARCH ON CLIE_ARCHIVO = ARCH.ARCH_CODIGO;
`

export type ClientLogo = LogoItem

export const getClientLogos = () => loadLogoItems(CLIENTS_QUERY, "Cliente")
