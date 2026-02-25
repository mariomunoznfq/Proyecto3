const express = require('express');
const cors = require('cors'); 
const path = require('path');
const { createClient } = require('@supabase/supabase-js'); // Importamos Supabase

const app = express();
const puerto = 3000;

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 👇 CONEXIÓN A LA BASE DE DATOS 👇
const supabaseUrl = 'https://elpnmbkkyghhcsdljhnz.supabase.co'; // <--- ¡CÁMBIALO POR TU URL DE SUPABASE!
const supabaseKey = 'sb_publishable_Z-DC50jbtbjl2c1JnRzmzg_p0nZl43Y'; // Tu clave ya puesta
const supabase = createClient(supabaseUrl, supabaseKey);
 


app.get('/api/peliculas', async (req, res) => {
    // Busca en la tabla 'Peliculas' y devuelve todos los registros
    const { data, error } = await supabase.from('Peliculas').select('*');

    if (error) {
        console.error("Error al leer Supabase:", error);
        return res.status(500).json({ error: 'Error al obtener los datos' });
    }

    res.json(data); // Devolvemos los datos a la web
});


// 2. GUARDAR una película nueva (Escribir en Supabase)
app.post('/api/peliculas', async (req, res) => {
    const nuevaPelicula = req.body; 

    // Inserta la nueva película en la tabla 'Peliculas'
    const { data, error } = await supabase.from('Peliculas').insert([nuevaPelicula]);

    if (error) {
        console.error("Error al guardar en Supabase:", error);
        return res.status(500).json({ error: 'Error al guardar el dato' });
    }

    res.json({ mensaje: "Película guardada correctamente" });
});


app.listen(puerto, () => {
    console.log(`Servidor encendido en http://localhost:${puerto}`);
});