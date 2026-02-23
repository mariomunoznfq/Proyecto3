
const API_KEY = 'af01d373'; 

const inputBuscador = document.getElementById('searchInput');
const botonBuscar = document.getElementById('Boton1');
const contenedorResultados = document.querySelector('.contenedor-peliculas');

//Creamos la función que lee el texto
function buscarPeliculas() {
    // Leemos qué ha escrito el usuario en la caja de texto
    const titulo = inputBuscador.value;

    // Si el usuario le da a buscar sin escribir nada, le avisamos
    if (titulo.trim() === '') {
        alert('No se ha introducido ninguna película');
        return; // Esto detiene la función para que no siga ejecutándose
    }

    
    console.log("El usuario quiere buscar la película:", titulo);
    
    
}

botonBuscar.addEventListener('click', buscarPeliculas);