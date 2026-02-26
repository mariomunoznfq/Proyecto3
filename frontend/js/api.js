const OMDB_API_KEY = 'af01d373'; 
const API_LOCAL = 'http://localhost:3000/api'; 

// 🔐 AUTENTICACIÓN
export async function registrarUsuario(email, password, nombre, apellido) {
    if (password.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
    
    const res = await fetch(`${API_LOCAL}/registro`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, apellido }) // 👈 Pasamos los nuevos datos
    });
    const data = await res.json();
    if (res.ok) {
        alert(data.mensaje);
        window.location.hash = '#login';
    } else alert("Error: " + data.error);
}

export async function loginUsuario(email, password) {
    const res = await fetch(`${API_LOCAL}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
        localStorage.setItem('usuarioLogueado', data.email);
        localStorage.setItem('nombreUsuario', data.nombreCompleto); 
        
        alert(`¡Bienvenido/a de nuevo, ${data.nombreCompleto}!`);
        window.location.hash = '#coleccion'; 
        window.location.reload(); 
    } else {
        alert("Error: " + data.error);
    }
}


export async function buscarPeliculas() {
    const input = document.getElementById('input-busqueda').value;
    const contenedor = document.getElementById('contenedor-peliculas');
    if (input.trim() === '') return alert("¡Escribe el nombre de una película!");
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
                    titulo: pelicula.Title, anio: parseInt(pelicula.Year),
                    poster: pelicula.Poster, imdbID: pelicula.imdbID
                });
                contenedor.appendChild(div);
            });
        } else {
            contenedor.innerHTML = '<p style="text-align: center; color: var(--color-acento);">No se encontraron resultados.</p>';
        }
    } catch (error) { console.error("Error buscando:", error); }
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
                        <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'Assets/img2.jpg'}" alt="${pelicula.Title}">
                        <h3>${pelicula.Title}</h3>
                        <p style="padding-bottom: 10px; color: var(--texto-secundario);">Año: ${pelicula.Year}</p>
                    </div>`;
            });
        } else { contenedor.innerHTML = '<p style="text-align: center; color: var(--color-acento);">No se encontraron películas.</p>'; }
    } catch (error) { console.error("Error:", error); }
}

export async function cargarColeccion() {
    const usuario = localStorage.getItem('usuarioLogueado');
    const contenedor = document.getElementById('contenedor-mis-peliculas');
    
    if (!usuario) {
        contenedor.innerHTML = '<p style="text-align: center;">Debes iniciar sesión para ver tu colección.</p>';
        return;
    }

    contenedor.innerHTML = '<p style="text-align: center;">Cargando tu colección...</p>';
    try {
        const res = await fetch(`${API_LOCAL}/peliculas/${usuario}`);
        const peliculas = await res.json();
        contenedor.innerHTML = '';

        if (peliculas.length === 0) return contenedor.innerHTML = '<p style="text-align: center;">Tu colección está vacía.</p>';

        peliculas.forEach(pelicula => {
            contenedor.innerHTML += `
                <div class="pelicula">
                    <img src="${pelicula.poster}" onerror="this.onerror=null; this.src='Assets/img2.jpg';" alt="${pelicula.titulo}">
                    <h3>${pelicula.titulo}</h3>
                    <p style="padding-bottom: 10px; color: var(--texto-secundario);">Año: ${pelicula.anio}</p>
                    <button onclick="borrarPelicula(${pelicula.id})" style="background-color: var(--color-acento); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">Eliminar</button>
                </div>`;
        });
    } catch (error) { console.error("Error:", error); }
}

export async function guardarEnBaseDeDatos(pelicula) {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (!usuario) {
        alert("Debes iniciar sesión primero para guardar películas.");
        window.location.hash = '#login';
        return;
    }

    pelicula.usuario_email = usuario; 

    try {
        const res = await fetch(`${API_LOCAL}/peliculas`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pelicula)
        });
        if (res.ok) {
            alert("¡Película guardada!");
            if (document.getElementById('contenedor-mis-peliculas')) cargarColeccion();
        } else alert("Hubo un problema al guardar.");
    } catch (error) { console.error("Error guardando:", error); }
}

window.borrarPelicula = async function(id) {
    if (!confirm("¿Seguro que quieres borrar esta película?")) return;
    try {
        const res = await fetch(`${API_LOCAL}/peliculas/${id}`, { method: 'DELETE' });
        if (res.ok) cargarColeccion(); 
    } catch (error) { console.error("Error borrando:", error); }
}