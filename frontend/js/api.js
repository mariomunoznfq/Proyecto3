const OMDB_API_KEY = 'af01d373'; 
const API_LOCAL = 'http://localhost:3000/api/peliculas'; 

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
                    <button class="btn-guardar" style="background-color: var(--color-acento); color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Añadir a colección</button>
                `;
                
                div.querySelector('.btn-guardar').onclick = () => guardarEnBaseDeDatos({
                    titulo: pelicula.Title,
                    anio: parseInt(pelicula.Year),
                    poster: pelicula.Poster,
                    imdbID: pelicula.imdbID
                });
                
                contenedor.appendChild(div);
            });
        } else {
            contenedor.innerHTML = '<p style="text-align: center; color: var(--color-acento);">No se encontraron resultados.</p>';
        }
    } catch (error) {
        console.error("Error buscando:", error);
    }
}

export async function cargarRecomendados() {
    const ano = document.getElementById('selector-ano').value;
    const contenedor = document.getElementById('contenedor-generales');
    
    contenedor.innerHTML = '<p style="text-align: center;">Cargando Marvel...</p>';

    let url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=Marvel&type=movie`;
    if (ano !== '') url += `&y=${ano}`; 

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        contenedor.innerHTML = '';
        if (data.Response === "True") {
            data.Search.forEach(pelicula => {
                contenedor.innerHTML += `
                    <div class="pelicula">
                        <img src="${pelicula.Poster !== 'assets/img2.jpg' ? pelicula.Poster : 'assets/img2.jpg'}" alt="${pelicula.Title}">
                        <h3>${pelicula.Title}</h3>
                        <p style="padding-bottom: 10px; color: var(--texto-secundario);">Año: ${pelicula.Year}</p>
                    </div>
                `;
            });
        } else {
            contenedor.innerHTML = '<p style="text-align: center; color: var(--color-acento);">No se encontraron películas.</p>';
        }
    } catch (error) {
        console.error("Error cargando recomendados:", error);
    }
}

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
                    <img src="${pelicula.poster}" onerror="this.onerror=null; this.src='assets/img2.jpg';" alt="${pelicula.titulo}">
                    <h3>${pelicula.titulo}</h3>
                    <p style="padding-bottom: 10px; color: var(--texto-secundario);">Año: ${pelicula.anio}</p>
                    <button onclick="borrarPelicula(${pelicula.id})" style="background-color: var(--color-acento); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Eliminar</button>
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

window.borrarPelicula = async function(id) {
    if (!confirm("¿Seguro que quieres borrar esta película?")) return;

    try {
        const res = await fetch(`${API_LOCAL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            cargarColeccion(); 
        }
    } catch (error) {
        console.error("Error borrando:", error);
    }
}