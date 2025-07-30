// src/server/server.ts
import express from 'express';
import path from 'path';
import history from 'connect-history-api-fallback';

const app = express();
const port = 46145; // Puedes cambiarlo por cualquier otro

// 🧠 Middleware SPA fallback: redirige todas las rutas que no sean archivos reales a index.html
app.use(
  history({
    verbose: true,
  })
);

// 🧱 Servir archivos estáticos desde la carpeta "dist"
const staticPath = path.resolve(__dirname, '../../dist');
app.use(express.static(staticPath));

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🟢 Servidor frontend corriendo en http://localhost:${port}`);
});
