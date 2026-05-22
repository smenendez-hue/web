import { loadLogoItems, type LogoItem } from "./logo-utils"

const INTEGRATIONS_QUERY = `
SELECT
    INTE_NOMBRE as clientName,
    CAST('' AS XML).value (
        'xs:base64Binary(sql:column("ARCH.ARCH_CONTENIDO"))',
        'VARCHAR(MAX)'
    ) as clientImage,
    ARCH_TIPO as typeImage,
    ISNULL(INTE_RADIO, 0) as radioTamano
FROM
    ENT_INTEGRACIONES
    LEFT JOIN ADM_ARCHIVO ARCH ON INTE_ARCHIVO = ARCH.ARCH_CODIGO;
`

export type IntegrationLogo = LogoItem

export const getIntegrationLogos = () => loadLogoItems(INTEGRATIONS_QUERY, "Integración")
