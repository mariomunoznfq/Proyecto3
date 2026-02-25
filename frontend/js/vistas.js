export const vistaBuscador = () => `
    <div style="text-align: center; margin-bottom: 30px; padding-top: 20px;">
        <div class="search-container" style="justify-content: center; display: flex; gap: 10px;">
            <input type="text" id="input-busqueda" placeholder="Buscar película (ej: Batman)..." style="padding: 10px; border-radius: 5px; width: 250px;">
            <button id="btn-buscar" style="background-color: var(--color-acento); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Buscar</button>
        </div>
    </div>
    <div id="contenedor-peliculas" class="contenedor-peliculas"></div>
`;

export const vistaRecomendados = () => `
    <section style="text-align: center; margin-bottom: 30px; padding-top: 20px;">
        <div class="filtros-container">
            <label for="selector-ano" style="font-weight: bold; margin-right: 10px;">Filtrar Marvel por año:</label>
            <select id="selector-ano" style="padding: 8px; border-radius: 5px;">
                <option value="">Todos los años</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
            </select>
            <button id="btn-filtro-ano" style="background-color: var(--texto-principal); color: var(--fondo-principal); padding: 8px 20px; border-radius: 5px; border:none; cursor: pointer; margin-left: 5px;">Filtrar</button>
        </div>
    </section>
    <div id="contenedor-generales" class="contenedor-peliculas"></div>
`;

export const vistaColeccion = () => `
    <section style="text-align: center; margin: 20px auto 40px; background-color: var(--fondo-tarjeta); padding: 20px; border-radius: 10px; max-width: 800px; box-shadow: 0 4px 10px var(--sombra-tarjeta);">
        <h3>Añadir Nueva Película Manual</h3>
        <form id="formulario-pelicula" style="margin-top: 15px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            <input type="text" id="tituloPeli" placeholder="Titulo" required style="padding: 8px; border-radius: 5px;">
            <input type="number" id="anioPeli" placeholder="Año" required style="padding: 8px; border-radius: 5px; width: 80px;">
            <input type="url" id="posterPeli" placeholder="URL de la imagen" required style="padding: 8px; border-radius: 5px; width: 250px;">
            <button type="submit" style="background-color: var(--texto-principal); color: var(--fondo-principal); padding: 8px 20px; border-radius: 5px; border:none; cursor: pointer;">Guardar</button>
        </form>
    </section>
    <div id="contenedor-mis-peliculas" class="contenedor-peliculas"></div>
`;