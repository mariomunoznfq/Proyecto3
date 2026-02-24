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

        contenedor.innerHTML = '<p style="color: white; text-align: center;">Buscando en la base de datos mundial...</p>';

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${textoCaja}&apikey=${API_KEY}`);
            const data = await response.json();

            if (data.Response === "True") {
                contenedor.innerHTML = ''; 
                
                data.Search.forEach(pelicula => {
                    const tarjeta = `
                        <div class="pelicula">
                            <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450?text=Sin+Poster'}" alt="${pelicula.Title}">
                            <h3>${pelicula.Title}</h3>
                            <p>Año: ${pelicula.Year}</p>
                        </div>
                    `;
                    contenedor.innerHTML += tarjeta;
                });
            } else {
                contenedor.innerHTML = '<p style="color: white; text-align: center;">No hemos encontrado nada con ese nombre.</p>';
            }
        } catch (error) {
            console.error("Error:", error);
            contenedor.innerHTML = '<p style="color: red; text-align: center;">Error al conectar con OMDb.</p>';
        }
    }

    // Eventos para el botón y para la tecla Enter
    botonBuscar.addEventListener('click', buscarPeliculas);

    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarPeliculas();
        }
    });