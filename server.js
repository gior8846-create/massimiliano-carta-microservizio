const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send("Microservizio Massimiliano Carta — Funziona!");
});

app.get('/info', (req, res) => {
    res.json({
        autore: "Massimiliano Carta",
        versione: "1.0.0",
        stato: "OK"
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server avviato sulla porta ${PORT}`);
});


