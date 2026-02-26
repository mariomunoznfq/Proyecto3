const API_LOCAL = 'http://localhost:3000/api'; 

export async function cargarColeccion() {
    const usuario = localStorage.getItem('usuarioLogueado');
    const contenedor = document.getElementById('contenedor-mis-peliculas');
    const selectorOrden = document.getElementById('orden-coleccion');
    const dashboard = document.getElementById('dashboard-estadisticas'); 
    const orden = selectorOrden ? selectorOrden.value : 'recientes';

    if (!usuario) {
        contenedor.innerHTML = '<p style="text-align: center;">Debes iniciar sesión para ver tu colección.</p>';
        return;
    }
    
    // ⏳ Ponemos el Loader (el círculo que gira) mientras esperamos los datos
    contenedor.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    try {
        const res = await fetch(`${API_LOCAL}/peliculas/${usuario}`);
        let peliculas = await res.json();
        
        if (peliculas.length === 0) {
            if (dashboard) dashboard.style.display = 'none';
            return contenedor.innerHTML = '<p style="text-align: center;">Tu colección está vacía. ¡Añade alguna película!</p>';
        }

        // 📊 Lógica del Dashboard de Estadísticas
        if (dashboard) {
            const totalPelis = peliculas.length;
            const totalFavs = peliculas.filter(p => p.favorito === true).length;
            const anios = peliculas.map(p => p.anio).filter(a => !isNaN(a));
            const peliMasAntigua = anios.length > 0 ? Math.min(...anios) : '-';

            dashboard.innerHTML = `
                <div class="stat-box">
                    <h4>${totalPelis}</h4>
                    <p>🎬 Guardadas</p>
                </div>
                <div class="stat-box">
                    <h4>${totalFavs}</h4>
                    <p>⭐ Favoritas</p>
                </div>
                <div class="stat-box">
                    <h4>${peliMasAntigua}</h4>
                    <p>🕰️ Más antigua</p>
                </div>
            `;
            dashboard.style.display = 'flex'; 
        }

        // 📋 Filtros y Ordenación
        if (orden === 'solo-favoritas') {
            peliculas = peliculas.filter(pelicula => pelicula.favorito === true);
            if (peliculas.length === 0) {
                contenedor.innerHTML = '<p style="text-align: center; font-size: 1.2em;">Aún no tienes ninguna película marcada como favorita ⭐</p>';
                return;
            }
        }

        if (orden === 'az') peliculas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        else if (orden === 'za') peliculas.sort((a, b) => b.titulo.localeCompare(a.titulo));
        else if (orden === 'ano-nuevo') peliculas.sort((a, b) => b.anio - a.anio);
        else if (orden === 'ano-viejo') peliculas.sort((a, b) => a.anio - b.anio);

        // Borramos el loader y dibujamos las tarjetas
        contenedor.innerHTML = '';
        
        peliculas.forEach(pelicula => {
            const div = document.createElement('div');
            div.className = 'pelicula';
            div.style.cursor = 'pointer'; 
            const estrella = pelicula.favorito ? '⭐' : '☆';

            div.innerHTML = `
                <img src="${pelicula.poster}" onerror="this.onerror=null; this.src='Assets/img2.jpg';" alt="${pelicula.titulo}">
                <h3>${pelicula.titulo}</h3>
                <p style="padding-bottom: 10px; color: var(--texto-secundario);">Año: ${pelicula.anio}</p>
                <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <button class="btn-borrar-peli" style="background-color: var(--color-acento); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Eliminar</button>
                    <span class="btn-favorito" style="font-size: 28px; cursor: pointer; transition: transform 0.2s; line-height: 1; user-select: none;" title="Marcar/Desmarcar favorito">${estrella}</span>
                </div>
            `;
            
            // Eventos de la tarjeta
            div.onclick = () => abrirModal(pelicula.titulo, pelicula.anio, pelicula.poster);
            
            div.querySelector('.btn-borrar-peli').onclick = (e) => { 
                e.stopPropagation(); 
                borrarPelicula(pelicula.id); 
            };

            const btnEstrella = div.querySelector('.btn-favorito');
            btnEstrella.onmouseenter = () => btnEstrella.style.transform = 'scale(1.2)';
            btnEstrella.onmouseleave = () => btnEstrella.style.transform = 'scale(1)';
            
            btnEstrella.onclick = (e) => { 
                e.stopPropagation(); 
                toggleFavorito(pelicula.id, btnEstrella); // Pasamos el botón para el cambio en vivo
            };

            contenedor.appendChild(div);
        });
    } catch (error) { console.error("Error cargando colección:", error); }
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

// ⭐ Función de Favoritos optimizada (Sin recargar toda la página)
window.toggleFavorito = async function(id, btnEstrella) {
    const esFavoritoAhora = btnEstrella.textContent === '⭐';
    const nuevoEstado = !esFavoritoAhora; 
    
    try {
        const res = await fetch(`${API_LOCAL}/peliculas/${id}/favorito`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ favorito: nuevoEstado }) 
        });
        
        if (res.ok) {
            btnEstrella.textContent = nuevoEstado ? '⭐' : '☆';
            
            // Si el usuario está viendo solo favoritas y quita una, la ocultamos suavemente
            const selectorOrden = document.getElementById('orden-coleccion');
            if (selectorOrden && selectorOrden.value === 'solo-favoritas' && !nuevoEstado) {
                btnEstrella.closest('.pelicula').style.display = 'none';
            }
        } 
    } catch (error) { console.error("Error cambiando favorito:", error); }
}

window.borrarPelicula = async function(id) {
    if (!confirm("¿Seguro que quieres borrar esta película?")) return;
    try {
        const res = await fetch(`${API_LOCAL}/peliculas/${id}`, { method: 'DELETE' });
        if (res.ok) cargarColeccion(); 
    } catch (error) { console.error("Error borrando:", error); }
}

// 🍿 Modal de Información
window.abrirModal = function(titulo, anio, poster) {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-anio').textContent = `Estreno: ${anio}`;
    document.getElementById('modal-poster').src = poster;
    document.getElementById('modal-info').classList.add('activo');
}

window.cerrarModal = function(e) {
    if (e && e.target.id !== 'modal-info' && !e.target.classList.contains('cerrar-modal')) return;
    document.getElementById('modal-info').classList.remove('activo');
}

// ✨ FILTRADO INSTANTÁNEO SIN RECARGAR LA PÁGINA
window.aplicarFiltroVisual = function() {
    const selector = document.getElementById('orden-coleccion');
    const filtro = selector.value;
    const peliculasHTML = document.querySelectorAll('.pelicula'); // Pillamos todas las tarjetas que ya hay
    
    // Si el filtro es "solo favoritas", ocultamos las que no tengan estrella llena
    if (filtro === 'solo-favoritas') {
        peliculasHTML.forEach(peli => {
            const estrella = peli.querySelector('.btn-favorito').textContent;
            if (estrella === '⭐') {
                peli.style.display = 'block'; // Mostrar
            } else {
                peli.style.display = 'none';  // Ocultar
            }
        });
    } else {
        // Para cualquier otro filtro (AZ, Año, etc.), de momento mostramos todas
        // (Nota: Para reordenar visualmente sin recargar se necesita una lógica más compleja de Flexbox/Grid, 
        // pero para "Solo Favoritas" esto es lo más rápido y limpio que pide tu tutor).
        peliculasHTML.forEach(peli => peli.style.display = 'block');
        
        // Si queremos cambiar el orden real (A-Z), ahí sí llamamos a cargarColeccion 
        // porque necesitamos reordenar el Array, pero para el filtro de Favoritos ya no parpadeará.
        if (filtro !== 'recientes') {
            cargarColeccion(); 
        }
    }
}