const API_KEY = '7ce7960e'; 

const botonBuscar = document.getElementById('btn-buscar');
const inputBusqueda = document.getElementById('input-busqueda');
const contenedor = document.getElementById('contenedor-peliculas');

async function buscarPeliculas() {
    const textoCaja = inputBusqueda.value;
    
    if (textoCaja.trim() === '') {
        alert("¡Escribe el nombre de una peli primero!");
        return;
    }

    contenedor.innerHTML = '<p style="color: white; text-align: center;">Buscando...</p>';

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${textoCaja}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            contenedor.innerHTML = ''; 
            
            data.Search.forEach(pelicula => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'pelicula';
                tarjeta.innerHTML = `
                    <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450?text=Sin+Poster'}" alt="${pelicula.Title}">
                    <h3>${pelicula.Title}</h3>
                    <p>Año: ${pelicula.Year}</p>
                    <button class="btn-guardar" data-id="${pelicula.imdbID}">Añadir a mi colección</button>
                `;
                
                // Evento para el botón de guardar
                tarjeta.querySelector('.btn-guardar').addEventListener('click', () => guardarEnColeccion(pelicula));
                
                contenedor.appendChild(tarjeta);
            });
        } else {
            contenedor.innerHTML = '<p style="color: white; text-align: center;">No hay resultados.</p>';
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para enviar la película a nuestro BACKEND
async function guardarEnColeccion(pelicula) {
    const nuevaPelicula = {
        titulo: pelicula.Title,
        anio: pelicula.Year,
        poster: pelicula.Poster,
        imdbID: pelicula.imdbID
    };

    try {
        const res = await fetch('/api/peliculas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaPelicula)
        });

        if (res.ok) {
            alert("¡Película guardada en Supabase!");
        } else {
            alert("Error al guardar.");
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

botonBuscar.addEventListener('click', buscarPeliculas);
inputBusqueda.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscarPeliculas(); });