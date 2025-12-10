const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 8080; // OpenShift userà 8080

// Middleware per log minimale
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Endpoint root: info servizio
app.get('/', (req, res) => {
  res.json({
    name: "Massimiliano_Carta_microservizio",
    technicalName: "massimiliano-carta-microservizio",
    version: "1.0.0",
    description: "Microservizio di esempio accessibile pubblicamente da Internet.",
    endpoints: {
      "/": "Informazioni generali sul servizio",
      "/time": "Ora corrente in UTC e Europe/Rome",
      "/random": "Numero casuale + UUID",
      "/echo?msg=...": "Rimanda indietro il messaggio",
      "/headers": "Ritorna gli header della richiesta",
      "/healthz/live": "Liveness probe",
      "/healthz/ready": "Readiness probe"
    }
  });
});

// Ora corrente
app.get('/time', (req, res) => {
  const now = new Date();
  res.json({
    utc: now.toISOString(),
    // Rappresentazione semplice “locale” Europe/Rome
    europe_rome: now.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })
  });
});

// Random + UUID
app.get('/random', (req, res) => {
  res.json({
    randomNumber: Math.random(),
    uuid: uuidv4(),
    ts: Date.now()
  });
});

// Echo
app.get('/echo', (req, res) => {
  const msg = req.query.msg || 'nessun messaggio ricevuto';
  res.json({ echo: msg });
});

// Headers
app.get('/headers', (req, res) => {
  res.json({
    headers: req.headers
  });
});

// Probe di salute
app.get('/healthz/live', (_req, res) => {
  res.status(200).send('OK'); // app viva
});

app.get('/healthz/ready', (_req, res) => {
  res.status(200).send('READY'); // app pronta
});

// Avvio server
app.listen(port, () => {
  console.log(`Massimiliano_Carta_microservizio in ascolto sulla porta ${port}`);
});

