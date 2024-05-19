const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// Définir le répertoire contenant les fichiers statiques
app.use(express.static(path.join(__dirname, 'Document')));

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${PORT}`);
});
