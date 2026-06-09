# Mundo Seguro VR

Escena WebVR/A-Frame voxel para un videojuego terapéutico que reacciona a una diadema EEG.

## Estructura

```
VR-World/
├── index.html      # Escena A-Frame (templo + bosque voxel + luz reactiva)
├── server.js       # Servidor HTTPS estático (Node, sin dependencias)
├── package.json    # Scripts: cert + start
└── certs/          # Generado por `npm run cert`
    ├── key.pem
    └── cert.pem
```

## Requisitos

- Node.js 16+
- OpenSSL (viene preinstalado en macOS y Linux)

## Puesta en marcha (3 pasos)

```bash
# 1. Genera el certificado HTTPS auto-firmado (una sola vez)
npm run cert

# 2. Levanta el servidor
npm start

# 3. Abre en el navegador
#    https://localhost:8443
```

Acepta la advertencia de "certificado no confiable" (es esperado en dev).

## Probar desde un visor VR (Quest, etc.)

WebXR requiere HTTPS también en la red local. Pasos:

1. Averigua la IP local de tu Mac:
   ```bash
   ipconfig getifaddr en0
   ```
2. En el visor, abre el navegador y ve a `https://<TU_IP>:8443`.
3. Acepta el certificado. Pulsa el botón "Enter VR" de A-Frame (esquina inferior derecha).

> Nota: algunos visores no permiten certificados auto-firmados. Para esos casos usa [ngrok](https://ngrok.com/) o [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) para exponer HTTPS válido:
> ```bash
> ngrok http https://localhost:8443
> ```

## Integración con la diadema EEG

En `index.html`, sustituye `simularEEG()` por la lectura real:

```js
// Ejemplo con WebSocket
const ws = new WebSocket('wss://tu-servidor-eeg/stream');
ws.onmessage = (e) => {
  const { calma } = JSON.parse(e.data); // valor 0.0–1.0
  aplicarCalma(calma);
};
```

`aplicarCalma(nivel)` modifica:
- `intensity` de `#luz-calma` (0.2 ansioso → 1.2 calmado)
- color de la luz ambiental (frío → cálido)
- brillo emisivo de la reliquia dorada del templo

## Cambiar el puerto

```bash
PORT=9000 npm start
```
# VR-game
