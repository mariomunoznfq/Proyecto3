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
const supabaseKey = 'sb_publishable_Z-DC50jbtbjl2c1JnRzmzg_p0nZl43Y'; // 👈 ¡PON TU CLAVE AQUÍ!
const supabase = createClient(supabaseUrl, supabaseKey);

// 🔐 REGISTRO (¡Ahora guardamos el nombre!)
app.post('/api/registro', async (req, res) => {
    const { email, password, nombre, apellido } = req.body;
    
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { nombre: nombre, apellido: apellido } } // 👈 El bolsillo secreto
    });
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ mensaje: "¡Registro exitoso! Ya puedes iniciar sesión." });
});

// 🔐 LOGIN (¡Ahora devolvemos el nombre!)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return res.status(400).json({ error: "Correo o contraseña incorrectos." });
    
    // Sacamos el nombre del bolsillo secreto (o usamos el correo si es un usuario antiguo)
    const nombre = data.user.user_metadata?.nombre || email.split('@')[0];
    const apellido = data.user.user_metadata?.apellido || '';

    res.json({ 
        email: data.user.email,
        nombreCompleto: `${nombre} ${apellido}`.trim() 
    }); 
});

// 🍿 LEER PELÍCULAS DEL USUARIO
app.get('/api/peliculas/:email', async (req, res) => {
    const emailUsuario = req.params.email; 
    const { data, error } = await supabase.from('Peliculas').select('*').eq('usuario_email', emailUsuario).order('id', { ascending: false });

    if (error) return res.status(500).json({ error: 'Error al obtener los datos' });
    res.json(data); 
});

// 🍿 GUARDAR PELÍCULA
app.post('/api/peliculas', async (req, res) => {
    const peliRecibida = req.body; 

    const peliculaListaParaSupabase = {
        titulo: peliRecibida.titulo,   
        anio: parseInt(peliRecibida.anio), 
        poster: peliRecibida.poster,
        imdbID: peliRecibida.imdbID || `manual-${Date.now()}`,
        usuario_email: peliRecibida.usuario_email 
    };

    const { data, error } = await supabase.from('Peliculas').insert([peliculaListaParaSupabase]);

    if (error) return res.status(500).json({ error: 'Error al guardar el dato' });
    res.json({ mensaje: "¡Guardada en tu colección personal!" });
});

// 🍿 BORRAR PELÍCULA
app.delete('/api/peliculas/:id', async (req, res) => {
    const idPelicula = req.params.id; 
    const { error } = await supabase.from('Peliculas').delete().eq('id', idPelicula);
    if (error) return res.status(500).json({ error: 'Error al borrar' });
    res.json({ mensaje: "¡Película eliminada!" });
});

app.listen(puerto, () => {
    console.log(`Servidor encendido en http://localhost:${puerto}`);
});