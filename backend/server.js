const express = require('express');
const cors = require('cors'); 
const path = require('path');
const { createClient } = require('@supabase/supabase-js'); 

const app = express();
const puerto = 3000;

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// CONEXIÓN A SUPABASE
const supabaseUrl = 'https://elpnmbkkyghhcsdljhnz.supabase.co'; 
const supabaseKey = 'sb_publishable_Z-DC50jbtbjl2c1JnRzmzg_p0nZl43Y'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. LEER TODAS LAS PELÍCULAS
app.get('/api/peliculas', async (req, res) => {
    const { data, error } = await supabase.from('Peliculas').select('*').order('id', { ascending: false });

    if (error) {
        console.error("Error al leer Supabase:", error);
        return res.status(500).json({ error: 'Error al obtener los datos' });
    }

    res.json(data); 
});

// 2. GUARDAR UNA PELÍCULA NUEVA
app.post('/api/peliculas', async (req, res) => {
    const peliRecibida = req.body; 

    const peliculaListaParaSupabase = {
        titulo: peliRecibida.titulo || peliRecibida.Title,   
        anio: parseInt(peliRecibida.anio || peliRecibida.Year), 
        poster: peliRecibida.poster || peliRecibida.Poster,
        imdbID: peliRecibida.imdbID || `manual-${Date.now()}` // Crea un ID automático si es manual
    };

    const { data, error } = await supabase.from('Peliculas').insert([peliculaListaParaSupabase]);

    if (error) {
        console.error("Error de Supabase:", error); 
        return res.status(500).json({ error: 'Error al guardar el dato en Supabase' });
    }

    res.json({ mensaje: "¡Película guardada perfectamente en Supabase!" });
});

// 3. BORRAR UNA PELÍCULA (¡La ruta que te faltaba!)
app.delete('/api/peliculas/:id', async (req, res) => {
    const idPelicula = req.params.id; 

    const { data, error } = await supabase.from('Peliculas').delete().eq('id', idPelicula);

    if (error) {
        console.error("Error al borrar en Supabase:", error);
        return res.status(500).json({ error: 'Error al borrar' });
    }

    res.json({ mensaje: "¡Película eliminada!" });
});

app.listen(puerto, () => {
    console.log(`Servidor encendido en http://localhost:${puerto}`);
});