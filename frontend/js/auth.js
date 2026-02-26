const API_LOCAL = 'http://localhost:3000/api'; 

export async function registrarUsuario(email, password, nombre, apellido) {
    if (password.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
    const res = await fetch(`${API_LOCAL}/registro`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, apellido }) 
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
    } else alert("Error: " + data.error);
}