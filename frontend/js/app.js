// 1. IMPORTAMOS LAS VISTAS (El Dibujante)
import { vistaBuscador, vistaRecomendados, vistaColeccion } from './vistas.js';

const appRoot = document.getElementById('app-root');


function enrutador() {
    let ruta = window.location.hash || '#buscador';
    appRoot.innerHTML = '';

    switch (ruta) {
        case '#buscador':
            appRoot.innerHTML = vistaBuscador();
            break;

        case '#recomendados':
            appRoot.innerHTML = vistaRecomendados();
            break;

        case '#coleccion':
            appRoot.innerHTML = vistaColeccion();
            break;

        default:
            appRoot.innerHTML = '<h2 style="text-align:center;">❌ Error 404 - Página no encontrada</h2>';
    }
}

window.addEventListener('hashchange', enrutador);
window.addEventListener('load', enrutador);