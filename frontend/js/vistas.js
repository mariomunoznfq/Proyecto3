
export const vistaBuscador = () => `
    <div style="text-align: center; margin-bottom: 30px;">
        <div class="search-container" style="justify-content: center; display: flex; gap: 10px;">
            <input type="text" id="input-busqueda" placeholder="Buscar película (ej: Batman)..." style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: 250px;">
            <button id="btn-buscar" style="background-color: #e50914; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Buscar</button>
        </div>
    </div>
    <div id="contenedor-peliculas" class="contenedor-peliculas"></div>
`;

export const vistaRecomendados = () => `
    <section style="text-align: center; margin-bottom: 30px;">
        <div class="filtros-container" style="margin-top: 20px;">
            <label for="selector-ano" style="font-weight: bold; margin-right: 10px;">Filtrar Marvel por año:</label>
            <select id="selector-ano" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="">Todos los años</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
            </select>
            <button id="btn-filtro-ano" class="btn-filtro" style="background-color: #333; color: white; padding: 8px 20px; border-radius: 5px; cursor: pointer;">Filtrar</button>
        </div>
    </section>
    <div id="contenedor-generales" class="contenedor-peliculas"></div>
`;

export const vistaColeccion = () => `
    <section style="text-align: center; margin-bottom: 40px; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3>Añadir Nueva Película Manual</h3>
        <form id="formulario-pelicula" style="margin-top: 15px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            <input type="text" id="tituloPeli" placeholder="Titulo" required style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
            <input type="number" id="anioPeli" placeholder="Año" required style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; width: 80px;">
            <input type="url" id="posterPeli" placeholder="URL de la imagen" required style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; width: 250px;">
            <button type="submit" class="btn-filtro" style="background-color: #333; color: white; padding: 8px 20px; border-radius: 5px; cursor: pointer;">Guardar</button>
        </form>
    </section>
    <div id="contenedor-mis-peliculas" class="contenedor-peliculas"></div>
`;