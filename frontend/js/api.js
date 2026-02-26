import { guardarEnBaseDeDatos } from './collection.js'; // 👈 Fíjate, ahora importa la función de tu nuevo archivo

const OMDB_API_KEY = 'af01d373'; // 👈 ¡Pon tu clave aquí!

let paginaBuscador = 1;
let busquedaActual = '';
let paginaRecomendados = 1;
let anoRecomendadoActual = '';

export async function buscarPeliculas(esNuevaBusqueda = true) {
    const inputElement = document.getElementById('input-busqueda');
    const input = inputElement ? inputElement.value : busquedaActual;
    const contenedor = document.getElementById('contenedor-peliculas');
    const btnVerMas = document.getElementById('btn-ver-mas-buscador');

    if (input.trim() === '') return alert("¡Escribe el nombre de una película!");

    if (esNuevaBusqueda) {
        paginaBuscador = 1;
        busquedaActual = input;
        contenedor.innerHTML = '<p style="text-align: center;">Buscando...</p>';
        if (btnVerMas) btnVerMas.style.display = 'none';
    } else {
        paginaBuscador++;
        if (btnVerMas) btnVerMas.textContent = 'Cargando...';
    }

    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${busquedaActual}&page=${paginaBuscador}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();
        
        if (data.Response === "True") {
            if (esNuevaBusqueda) contenedor.innerHTML = ''; 
            
            data.Search.forEach(pelicula => {
                const div = document.createElement('div');
                div.className = 'pelicula';
                div.innerHTML = `
                    <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'Assets/img2.jpg'}" onerror="this.onerror=null; this.src='Assets/img2.jpg';" alt="${pelicula.Title}">
                    <h3>${pelicula.Title}</h3>
                    <p style="margin-bottom: 10px;">Año: ${pelicula.Year}</p>
                    <button class="btn-guardar" style="background-color: var(--color-acento); color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Añadir a colección</button>
                `;
                div.querySelector('.btn-guardar').onclick = () => guardarEnBaseDeDatos({
                    titulo: pelicula.Title, anio: parseInt(pelicula.Year), poster: pelicula.Poster, imdbID: pelicula.imdbID
                });
                contenedor.appendChild(div);
            });

            const totalResultados = parseInt(data.totalResults);
            if (paginaBuscador * 10 < totalResultados) {
                if (btnVerMas) {
                    btnVerMas.style.display = 'inline-block';
                    btnVerMas.textContent = 'Ver más películas...';
                    btnVerMas.onclick = () => buscarPeliculas(false); 
                }
            } else if (btnVerMas) btnVerMas.style.display = 'none';

        } else {
            if (esNuevaBusqueda) contenedor.innerHTML = '<p style="text-align: center; color: var(--color-acento);">No se encontraron resultados.</p>';
            if (btnVerMas) btnVerMas.style.display = 'none';
        }
    } catch (error) { console.error("Error buscando:", error); }
}

export async function cargarRecomendados(esNuevaBusqueda = true) {
    const anoElement = document.getElementById('selector-ano');
    const ano = anoElement ? anoElement.value : anoRecomendadoActual;
    const contenedor = document.getElementById('contenedor-generales');
    const btnVerMas = document.getElementById('btn-ver-mas-recomendados');

    if (esNuevaBusqueda) {
        paginaRecomendados = 1;
        anoRecomendadoActual = ano;
        contenedor.innerHTML = '<p style="text-align: center;">Cargando Marvel...</p>';
        if (btnVerMas) btnVerMas.style.display = 'none';
    } else {
        paginaRecomendados++;
        if (btnVerMas) btnVerMas.textContent = 'Cargando...';
    }

    let url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=Marvel&type=movie&page=${paginaRecomendados}`;
    if (anoRecomendadoActual !== '') url += `&y=${anoRecomendadoActual}`; 
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.Response === "True") {
            if (esNuevaBusqueda) contenedor.innerHTML = '';
            
            data.Search.forEach(pelicula => {
                const div = document.createElement('div');
                div.className = 'pelicula';
                div.innerHTML = `
                    <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'Assets/img2.jpg'}" onerror="this.onerror=null; this.src='Assets/img2.jpg';" alt="${pelicula.Title}">
                    <h3>${pelicula.Title}</h3>
                    <p style="margin-bottom: 10px;">Año: ${pelicula.Year}</p>
                    <button class="btn-guardar" style="background-color: var(--color-acento); color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Añadir a colección</button>
                `;
                div.querySelector('.btn-guardar').onclick = () => guardarEnBaseDeDatos({
                    titulo: pelicula.Title, anio: parseInt(pelicula.Year), poster: pelicula.Poster, imdbID: pelicula.imdbID
                });
                contenedor.appendChild(div);
            });

            const totalResultados = parseInt(data.totalResults);
            if (paginaRecomendados * 10 < totalResultados) {
                if (btnVerMas) {
                    btnVerMas.style.display = 'inline-block';
                    btnVerMas.textContent = 'Ver más recomendadas...';
                    btnVerMas.onclick = () => cargarRecomendados(false);
                }
            } else if (btnVerMas) btnVerMas.style.display = 'none';
        } else { 
            if (esNuevaBusqueda) contenedor.innerHTML = '<p style="text-align: center; color: var(--color-acento);">No se encontraron películas.</p>'; 
            if (btnVerMas) btnVerMas.style.display = 'none';
        }
    } catch (error) { console.error("Error:", error); }
}