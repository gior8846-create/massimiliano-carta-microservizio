const express = require('express');
const morgan = require('morgan');
const os = require('os');

const app = express();
const startedAt = new Date();
const version = '1.0.0';
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());           // parsing JSON request body
app.use(morgan('combined'));       // log standard Apache-style

// Helper per info di pod/cluster (se variabili impostate nel Deployment)
function getRuntimeInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    podName: process.env.HOSTNAME || os.hostname(),
    namespace: process.env.NAMESPACE || 'unknown',
    nodeName: process.env.NODE_NAME || 'unknown',
    startedAt: startedAt.toISOString(),
    uptimeSeconds: Math.round((Date.now() - startedAt.getTime()) / 1000)
  };
}

// ---- ROUTES ----

// Home: info generali
app.get('/', (req, res) => {
  res.json({
    service: 'Massimiliano_Carta_microservizio',
    description: 'Microservizio demo esposto su OpenShift Developer Sandbox',
    version,
    now: new Date().toISOString(),
    info: getRuntimeInfo(),
    endpoints: [
      '/',
      '/healthz/live',
      '/healthz/ready',
      '/api/info',
      '/api/random',
      '/api/echo?msg=...',
      '/api/sum'
    ]
  });
});

// Liveness: il processo Node è vivo?
app.get('/healthz/live', (req, res) => {
  res.status(200).json({ status: 'ok', type: 'liveness', at: new Date().toISOString() });
});

// Readiness: il servizio è pronto a ricevere traffico?
app.get('/healthz/ready', (req, res) => {
  // qui potresti aggiungere check su DB, code, ecc.
  res.status(200).json({ status: 'ok', type: 'readiness', at: new Date().toISOString() });
});

// Info di sistema
app.get('/api/info', (req, res) => {
  res.json({
    service: 'Massimiliano_Carta_microservizio',
    version,
    runtime: getRuntimeInfo(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  });
});

// Numero casuale
app.get('/api/random', (req, res) => {
  res.json({
    random: Math.random(),
    generatedAt: new Date().toISOString(),
    runtime: getRuntimeInfo()
  });
});

// Echo: restituisce il messaggio ricevuto
app.get('/api/echo', (req, res) => {
  const msg = req.query.msg || 'Nessun messaggio ricevuto';
  res.json({
    message: msg,
    length: msg.length,
    from: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    at: new Date().toISOString()
  });
});

// Somma di due numeri (POST JSON)
app.post('/api/sum', (req, res) => {
  const { a, b } = req.body;

  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({
      error: 'a e b devono essere numeri',
      received: { a, b }
    });
  }

  res.json({
    a,
    b,
    sum: a + b,
    at: new Date().toISOString()
  });
});

// Error handler generico
app.use((err, req, res, next) => {
  console.error('Errore non gestito:', err);
  res.status(500).json({
    error: 'Errore interno del server',
    details: err.message
  });
});

// Avvio server
app.listen(port, '0.0.0.0', () => {
  console.log(
    `Massimiliano_Carta_microservizio v${version} in ascolto su 0.0.0.0:${port} (start: ${startedAt.toISOString()})`
  );
});

