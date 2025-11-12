const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'enquete.html'));
});

app.post('/submit', (req, res) => {
    const {
        naam, leeftijd, geslacht, beroep, kennis, dagelijkseTechnologieen, voordelen, andereVoordelen,
        zorgen, arbeidsmarkt, ethiek, privacy, maatschappelijkeRol, onderwijs, toekomst
    } = req.body;

    const stmt = db.prepare(`INSERT INTO enquete(naam, leeftijd, geslacht, beroep, kennis, dagelijkseTechnologieen, voordelen, andereVoordelen, zorgen, arbeidsmarkt, ethiek, privacy, maatschappelijkeRol, onderwijs, toekomst) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run([naam, leeftijd, geslacht, beroep, kennis, dagelijkseTechnologieen, voordelen.join(','), andereVoordelen, zorgen, arbeidsmarkt, ethiek, privacy, maatschappelijkeRol, onderwijs, toekomst], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row inserted with rowid ${this.lastID}`);
    });
    stmt.finalize();

    res.sendFile(path.join(__dirname, 'resultaten.html'));
});

// Download SQLite database endpoint
app.get('/download-database', (req, res) => {
    res.download(path.join(__dirname, './enquete.db'), 'enquete.db', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error downloading the file.');
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
