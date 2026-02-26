import { vistaBuscador, vistaRecomendados, vistaColeccion, vistaLogin, vistaRegistro } from './views.js';

// 📂 Importamos desde los nuevos módulos separados
import { buscarPeliculas, cargarRecomendados } from './api.js';
import { cargarColeccion, guardarEnBaseDeDatos } from './collection.js'; // Ahora se llama collection.js
import { loginUsuario, registrarUsuario } from './auth.js';

const appRoot = document.getElementById('app-root');

// 👤 GESTIÓN DEL MENÚ Y SESIÓN
const usuarioLogueado = localStorage.getItem('usuarioLogueado');
const nombreUsuario = localStorage.getItem('nombreUsuario'); 

if (usuarioLogueado) {
    document.getElementById('nav-coleccion').style.display = 'inline-block';
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-registro').style.display = 'none';
    g
    const infoUsuario = document.getElementById('info-usuario');
    infoUsuario.style.display = 'inline-block';
    infoUsuario.textContent = `Hola, ${nombreUsuario || usuarioLogueado.split('@')[0]}`; 
    
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.style.display = 'inline-block';
    btnLogout.onclick = () => {
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('nombreUsuario'); 
        window.location.hash = '#login';
        window.location.reload();
    };
}

// 🚦 ENRUTADOR (SPA)
function enrutador() {
    let ruta = window.location.hash || '#buscador';
    appRoot.innerHTML = '';

    switch (ruta) {
        case '#login': 
            appRoot.innerHTML = vistaLogin();
            document.getElementById('formulario-login').onsubmit = (e) => {
                e.preventDefault(); 
                loginUsuario(document.getElementById('email-login').value, document.getElementById('password-login').value);
            };
            break;

        case '#registro': 
            appRoot.innerHTML = vistaRegistro();
            document.getElementById('formulario-registro').onsubmit = (e) => {
                e.preventDefault(); 
                registrarUsuario(
                    document.getElementById('email-registro').value, 
                    document.getElementById('password-registro').value,
                    document.getElementById('nombre-registro').value,
                    document.getElementById('apellido-registro').value
                ); 
            };
            break;

        case '#buscador':
            appRoot.innerHTML = vistaBuscador();
            document.getElementById('btn-buscar').onclick = () => buscarPeliculas(true);
            document.getElementById('input-busqueda').onkeypress = (e) => { 
                if (e.key === 'Enter') buscarPeliculas(true); 
            };
            break;

        case '#recomendados':
            appRoot.innerHTML = vistaRecomendados();
            document.getElementById('btn-filtro-ano').onclick = () => cargarRecomendados(true);
            cargarRecomendados(true); 
            break;

        case '#coleccion':
            if (!localStorage.getItem('usuarioLogueado')) {
                window.location.hash = '#login'; 
                return;
            }
            appRoot.innerHTML = vistaColeccion();
            
            // ✨ CONFIGURACIÓN DEL FILTRO INTELIGENTE (SIN PARPADEO)
            const selectorOrden = document.getElementById('orden-coleccion');
            if (selectorOrden) {
                // Usamos la nueva función visual que creamos para favoritos
                selectorOrden.addEventListener('change', window.aplicarFiltroVisual);
            }

            // Manejo del formulario de añadir peli manual
            document.getElementById('formulario-pelicula').onsubmit = (e) => {
                e.preventDefault(); 
                guardarEnBaseDeDatos({
                    titulo: document.getElementById('tituloPeli').value,
                    anio: parseInt(document.getElementById('anioPeli').value),
                    poster: document.getElementById('posterPeli').value
                });
                document.getElementById('formulario-pelicula').reset(); 
            };

            cargarColeccion(); // Carga inicial de la base de datos
            break;

        default:
            appRoot.innerHTML = '<h2 style="text-align:center;">❌ Error 404 - Página no encontrada</h2>';
    }
}

window.addEventListener('hashchange', enrutador);
window.addEventListener('load', enrutador);

// 🌙 MODO OSCURO (Inteligente por horas)
const btnDarkMode = document.getElementById('btn-dark-mode');
const body = document.body;

let temaGuardado = localStorage.getItem('tema');

if (!temaGuardado) {
    const horaActual = new Date().getHours();
    temaGuardado = (horaActual >= 20 || horaActual < 7) ? 'oscuro' : 'claro';
}

if (temaGuardado === 'oscuro') {
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