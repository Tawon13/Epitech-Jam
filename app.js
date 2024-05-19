const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.static(path.join(__dirname, 'Document')));

app.listen(PORT, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${PORT}`);
});
