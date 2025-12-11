const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Middleware di logging semplice
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint di info generale
app.get('/info', (req, res) => {
  res.json({
    servizio: 'Massimiliano_Carta_microservizio',
    versione: '1.0.0',
    autore: 'Massimiliano Carta',
    ambiente: process.env.APP_ENV || 'dev'
  });
});

// Orario server (utile per testare)
app.get('/time', (req, res) => {
  res.json({ now: new Date().toISOString() });
});

// Echo (restituisce quello che il client manda come query ?msg=...)
app.get('/echo', (req, res) => {
  res.json({ echo: req.query.msg || null });
});

// Probe di health
app.get('/healthz/live', (_req, res) => res.status(200).send('OK'));
app.get('/healthz/ready', (_req, res) => res.status(200).send('OK'));

app.listen(port, () => {
  console.log(`Massimiliano_Carta_microservizio in ascolto sulla porta ${port}`);
});


