import { vistaBuscador, vistaRecomendados, vistaColeccion, vistaLogin, vistaRegistro } from './vistas.js';
import { buscarPeliculas, cargarRecomendados, cargarColeccion, guardarEnBaseDeDatos, loginUsuario, registrarUsuario } from './api.js';

const appRoot = document.getElementById('app-root');

// 👤 GESTIÓN DEL MENÚ SEGÚN USUARIO
const usuarioLogueado = localStorage.getItem('usuarioLogueado');
const nombreUsuario = localStorage.getItem('nombreUsuario'); // 👈 ¡Recuperamos su nombre!

if (usuarioLogueado) {
    document.getElementById('nav-coleccion').style.display = 'inline-block';
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-registro').style.display = 'none';
    
    const infoUsuario = document.getElementById('info-usuario');
    infoUsuario.style.display = 'inline-block';
    // Le saludamos por su nombre si lo tiene, si no, usamos el correo como antes
    infoUsuario.textContent = `Hola, ${nombreUsuario || usuarioLogueado.split('@')[0]}`; 
    
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.style.display = 'inline-block';
    btnLogout.onclick = () => {
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('nombreUsuario'); // 👈 ¡Limpiamos la memoria al salir!
        window.location.hash = '#login';
        window.location.reload();
    };
}

// 🚦 ENRUTADOR
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
                // 👈 Ahora recogemos los 4 datos del formulario
                const nombre = document.getElementById('nombre-registro').value;
                const apellido = document.getElementById('apellido-registro').value;
                const email = document.getElementById('email-registro').value;
                const pass = document.getElementById('password-registro').value;
                
                registrarUsuario(email, pass, nombre, apellido); 
            };
            break;

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
            if (!localStorage.getItem('usuarioLogueado')) {
                window.location.hash = '#login'; 
                return;
            }
            appRoot.innerHTML = vistaColeccion();
            document.getElementById('formulario-pelicula').onsubmit = (e) => {
                e.preventDefault(); 
                guardarEnBaseDeDatos({
                    titulo: document.getElementById('tituloPeli').value,
                    anio: parseInt(document.getElementById('anioPeli').value),
                    poster: document.getElementById('posterPeli').value
                });
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

// 🌙 MODO OSCURO
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