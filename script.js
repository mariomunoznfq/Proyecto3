const API_KEY = 'af01d373'; 
const inputBuscador = document.getElementById('searchInput');
const botonBuscar = document.getElementById('Boton1');
const contenedorResultados = document.querySelector('.contenedor-peliculas');


async function buscarPeliculas() {
    const titulo = inputBuscador.value;

    //Validación inicial
    if (titulo.trim() === '') {
        alert('No se ha introducido ninguna película');
        return; 
    }

    console.log("Buscando la película:", titulo);

    try {
        //Petición a la API
        const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${titulo}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        //Limpiar pantalla
        contenedorResultados.innerHTML = '';

        if (datos.Response === "True") {
            // Mostrar los resultados
            datos.Search.forEach(pelicula => {
                const tarjetaHtml = `
                    <div class="pelicula">
                        <img 
                            src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'img2.jpg'}" 
                            onerror="this.onerror=null; this.src='img2.jpg';" 
                            alt="${pelicula.Title}"
                        >
                        <h3>${pelicula.Title}</h3>
                        <p style="padding-bottom: 10px; color: #666;">${pelicula.Year}</p>
                    </div>
                `;
                contenedorResultados.innerHTML += tarjetaHtml;
            });
        } else {
            //Esto nos muestra cuando no hya resultados
            contenedorResultados.innerHTML = `<p style="width: 100%; text-align: center;">No hay peliculas dispoibles con ese titulo "${titulo}".</p>`;
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Hubo un error al conectar con el servidor.");
    }
}


botonBuscar.addEventListener('click', buscarPeliculas);