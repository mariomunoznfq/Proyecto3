// VARIABLES GLOBALES
const OMDB_API_KEY = '7ce7960e'; // Tu clave de OMDB
const API_LOCAL = 'http://localhost:3000/api/peliculas'; // Tu servidor de Node

// -----------------------------------------
// 1. LÓGICA DEL BUSCADOR
// -----------------------------------------
export async function buscarPeliculas() {
    const input = document.getElementById('input-busqueda').value;
    const contenedor = document.getElementById('contenedor-peliculas');

    if (input.trim() === '') {
        alert("¡Escribe el nombre de una película!");
        return;
    }

    contenedor.innerHTML = '<p style="text-align: center;">Buscando...</p>';

    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${input}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();

        if (data.Response === "True") {
            contenedor.innerHTML = '';
            data.Search.forEach(pelicula => {
                const div = document.createElement('div');
                div.className = 'pelicula';
                div.innerHTML = `
                    <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'Assets/img2.jpg'}" alt="${pelicula.Title}">
                    <h3>${pelicula.Title}</h3>
                    <p style="margin-bottom: 10px;">Año: ${pelicula.Year}</p>
                    <button class="btn-guardar" style="background-color: #333; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Añadir a colección</button>
                `;
                
                // Le conectamos la función de guardar a este botón concreto
                div.querySelector('.btn-guardar').onclick = () => guardarEnBaseDeDatos({
                    titulo: pelicula.Title,
                    anio: parseInt(pelicula.Year),
                    poster: pelicula.Poster,
                    imdbID: pelicula.imdbID
                });
                
                contenedor.appendChild(div);
            });
        } else {
            contenedor.innerHTML = '<p style="text-align: center;">No hay resultados.</p>';
        }
    } catch (error) {
        console.error("Error buscando:", error);
    }
}

// -----------------------------------------
// 2. LÓGICA DE RECOMENDADOS (Marvel)
// -----------------------------------------
export async function cargarRecomendados() {
    const ano = document.getElementById('selector-ano').value;
    const contenedor = document.getElementById('contenedor-generales');
    
    contenedor.innerHTML = '<p style="text-align: center;">Cargando Marvel...</p>';

    let url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=Marvel&type=movie`;
    if (ano !== '') url += `&y=${ano}`; // Le inyectamos el año si hay filtro

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        contenedor.innerHTML = '';
        if (data.Response === "True") {
            data.Search.forEach(pelicula => {
                contenedor.innerHTML += `
                    <div class="pelicula">
                        <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'Assets/img2.jpg'}" alt="${pelicula.Title}">
                        <h3>${pelicula.Title}</h3>
                        <p style="padding-bottom: 10px; color: #666;">Año: ${pelicula.Year}</p>
                    </div>
                `;
            });
        } else {
            contenedor.innerHTML = '<p style="text-align: center;">No se encontraron películas de ese año.</p>';
        }
    } catch (error) {
        console.error("Error cargando recomendados:", error);
    }
}

// -----------------------------------------
// 3. LÓGICA DE MI COLECCIÓN (Supabase)
// -----------------------------------------
export async function cargarColeccion() {
    const contenedor = document.getElementById('contenedor-mis-peliculas');
    contenedor.innerHTML = '<p style="text-align: center;">Cargando tu colección...</p>';

    try {
        const res = await fetch(API_LOCAL);
        const peliculas = await res.json();
        
        contenedor.innerHTML = '';

        if (peliculas.length === 0) {
            contenedor.innerHTML = '<p style="text-align: center;">Aún no tienes películas guardadas.</p>';
            return;
        }

        peliculas.forEach(pelicula => {
            contenedor.innerHTML += `
                <div class="pelicula">
                    <img src="${pelicula.poster}" onerror="this.onerror=null; this.src='Assets/img2.jpg';" alt="${pelicula.titulo}">
                    <h3>${pelicula.titulo}</h3>
                    <p style="padding-bottom: 10px; color: #666;">Año: ${pelicula.anio}</p>
                    <button onclick="borrarPelicula(${pelicula.id})" style="background-color: #e50914; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Eliminar</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error conectando al servidor local:", error);
    }
}

export async function guardarEnBaseDeDatos(pelicula) {
    try {
        const res = await fetch(API_LOCAL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pelicula)
        });

        if (res.ok) {
            alert("¡Película guardada en tu colección!");
            // Si el usuario está justo ahora en la pestaña de colección, recargamos la lista para que la vea aparecer
            if (document.getElementById('contenedor-mis-peliculas')) {
                cargarColeccion();
            }
        } else {
            alert("Hubo un problema al guardar.");
        }
    } catch (error) {
        console.error("Error guardando:", error);
    }
}

// Hacemos que la función de borrar sea GLOBAL para que el HTML la encuentre al hacer clic
window.borrarPelicula = async function(id) {
    if (!confirm("¿Seguro que quieres borrar esta película?")) return;

    try {
        const res = await fetch(`${API_LOCAL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            cargarColeccion(); // Recargamos para que desaparezca visualmente
        }
    } catch (error) {
        console.error("Error borrando:", error);
    }
}