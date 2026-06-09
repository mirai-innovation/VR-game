# Mundo Seguro VR

Escena WebVR/A-Frame voxel para un videojuego terapéutico que reacciona a una diadema EEG. Sitio 100% estático — desplegable en Vercel sin build.

## Estructura

```
VR-World/
├── index.html      # Escena A-Frame (templo + bosque voxel + guía Luma + portales)
├── vercel.json     # Headers + permissions para WebXR en producción
├── server.js       # Servidor HTTPS local (solo dev, ignorado por Vercel)
├── package.json    # Scripts dev local
├── .vercelignore   # Excluye certs/, server.js, etc. del deploy
└── certs/          # Certificados HTTPS locales (generados, no commiteados)
```

## Despliegue en Vercel

El sitio es estático: no hay build, no hay dependencias en runtime. Vercel lo sirve sobre HTTPS automáticamente (necesario para WebXR).

### Opción A — desde GitHub (recomendado)

1. Haz push de la rama `main` a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo `VR-game`.
3. En la pantalla de configuración:
   - **Framework Preset:** Other
   - **Build Command:** *(vacío)*
   - **Output Directory:** *(vacío — usa la raíz)*
4. Deploy. Vercel te da una URL `https://vr-game-xxx.vercel.app`.

Cada push a `main` re-deploya automáticamente.

### Opción B — Vercel CLI

```bash
npm i -g vercel
vercel          # primer deploy (preview)
vercel --prod   # deploy a producción
```

## Desarrollo local (HTTPS)

WebXR exige HTTPS también en local si pruebas con visor. Para navegador de escritorio, `localhost` funciona en HTTP, pero el servidor incluido sirve HTTPS por consistencia.

```bash
npm run cert    # genera certs/ auto-firmados (una sola vez)
npm run dev     # arranca en https://localhost:8443
```

Acepta la advertencia de cert no confiable (es esperado en dev).

### Probar desde visor VR en la red local

1. IP local de tu Mac:
   ```bash
   ipconfig getifaddr en0
   ```
2. En el visor abre `https://<TU_IP>:8443`.
3. Algunos visores rechazan certs auto-firmados — en ese caso usa el deploy de Vercel directamente, o un túnel:
   ```bash
   ngrok http https://localhost:8443
   ```

## Integración con la diadema EEG

En `index.html`, sustituye `simularEEG()` por tu fuente real:

```js
const ws = new WebSocket('wss://tu-servidor-eeg/stream');
ws.onmessage = (e) => {
  const { calma } = JSON.parse(e.data); // 0.0–1.0
  aplicarCalma(calma);
};
```

`aplicarCalma(nivel)` modifica:
- `intensity` de `#luz-calma` (0.2 ansioso → 1.2 calmado)
- color de la luz ambiental (frío → cálido)
- brillo emisivo de la reliquia dorada del templo
