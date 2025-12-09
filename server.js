const express = require('express');
const app = express();

// Porta (OpenShift userà 8080 di default)
const port = process.env.PORT || 8080;

// Configurazione da variabili d'ambiente / ConfigMap
const SERVICE_NAME = process.env.SERVICE_NAME || 'Massimiliano_Carta_microservizio';
const MOTD         = process.env.MOTD || 'Questo è il mio microservizio di esempio!';

app.use(express.json());

// Endpoint base
app.get('/', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    message: MOTD,
    time: new Date().toISOString(),
    client_ip: req.ip
  });
});

// Ora corrente
app.get('/time', (_req, res) => {
  res.json({ now: new Date().toISOString() });
});

// Numero random
app.get('/random', (_req, res) => {
  res.json({ random: Math.random() });
});

// Echo JSON
app.post('/echo', (req, res) => {
  res.json({
    received_at: new Date().toISOString(),
    body: req.body
  });
});

// Liveness
app.get('/healthz/live', (_req, res) => res.status(200).send('OK'));

// Readiness
app.get('/healthz/ready', (_req, res) => res.status(200).send('READY'));

app.listen(port, () => {
  console.log(`${SERVICE_NAME} in ascolto sulla porta ${port}`);
});

