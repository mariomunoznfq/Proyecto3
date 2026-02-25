import { vistaBuscador, vistaRecomendados, vistaColeccion } from './vistas.js';
import { buscarPeliculas, cargarRecomendados, cargarColeccion, guardarEnBaseDeDatos } from './api.js';

const appRoot = document.getElementById('app-root');

function enrutador() {
    let ruta = window.location.hash || '#buscador';
    appRoot.innerHTML = '';

    switch (ruta) {
        case '#buscador':
            appRoot.innerHTML = vistaBuscador();
            document.getElementById('btn-buscar').onclick = buscarPeliculas;
            document.getElementById('input-busqueda').onkeypress = (e) => { 
                if (e.key === 'Enter') buscarPeliculas(); 
            };
            break;

        case '#recomendados':
            appRoot.innerHTML = vistaRecomendados();
            document.getElementById('btn-filtro-ano').onclick = cargarRecomendados;
            cargarRecomendados(); 
            break;

        case '#coleccion':
            appRoot.innerHTML = vistaColeccion();
            document.getElementById('formulario-pelicula').onsubmit = (e) => {
                e.preventDefault(); 
                const peliManual = {
                    titulo: document.getElementById('tituloPeli').value,
                    anio: parseInt(document.getElementById('anioPeli').value),
                    poster: document.getElementById('posterPeli').value
                };
                guardarEnBaseDeDatos(peliManual);
                document.getElementById('formulario-pelicula').reset(); 
            };
            cargarColeccion(); 
            break;

        default:
            appRoot.innerHTML = '<h2 style="text-align:center;">❌ Error 404 - Página no encontrada</h2>';
    }
}

window.addEventListener('hashchange', enrutador);
window.addEventListener('load', enrutador);

const btnDarkMode = document.getElementById('btn-dark-mode');
const body = document.body;

if (localStorage.getItem('tema') === 'oscuro') {
    body.classList.add('dark-mode');
    btnDarkMode.textContent = '☀️';
}

btnDarkMode.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    btnDarkMode.style.transform = 'rotate(360deg)';
    setTimeout(() => btnDarkMode.style.transform = 'none', 300);
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('tema', 'oscuro');
        btnDarkMode.textContent = '☀️';
    } else {
        localStorage.setItem('tema', 'claro');
        btnDarkMode.textContent = '🌙';
    }
});