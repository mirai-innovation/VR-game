// Servidor HTTPS mínimo para servir el Mundo Seguro VR.
// WebXR exige HTTPS (excepto en localhost). Usa cert auto-firmado en dev.
//
// Uso:
//   1) npm install
//   2) npm run cert   (genera certificados auto-firmados, una sola vez)
//   3) npm start
//   4) Abre https://TU_IP_LOCAL:8443  (acepta la advertencia del navegador)

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PORT = process.env.PORT || 8443;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.glb':  'model/gltf-binary',
  '.gltf': 'model/gltf+json',
};

const options = {
  key:  fs.readFileSync(path.join(ROOT, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(ROOT, 'certs', 'cert.pem')),
};

https.createServer(options, (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {  // anti path-traversal
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`\n  Mundo Seguro VR corriendo en:`);
  console.log(`  https://localhost:${PORT}`);
  console.log(`  https://<tu-ip-local>:${PORT}  (para visor VR en la misma red)\n`);
});
