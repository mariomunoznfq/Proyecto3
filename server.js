const express = require('express');
const cors = require('cors'); 
const app = express();
const puerto = 3000;

app.use(cors()); 
app.use(express.json());


let misPeliculas = [];

app.get('/api/peliculas', (req, res) => {
    res.json(misPeliculas);
});

app.post('/api/peliculas', (req, res) => {
    const nuevaPelicula = req.body; 
    misPeliculas.push(nuevaPelicula);
    res.json();
});

app.listen(puerto, () => {
    console.log(`Servidor encendido en http://localhost:${puerto}`);
});