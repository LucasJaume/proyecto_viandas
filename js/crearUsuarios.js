document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));

    if (!usuario) {
        alert('Usuario no encontrado en sessionStorage.');
        window.location.href = '../index.html'; // Redirigir a la página de inicio de sesión si no hay usuario
        return;
    }

    const rolSelect = document.getElementById('rolSelect');

    switch (usuario.id_rol) {
        case 1: // Administrador
            hideOptionsExcept(rolSelect, [2,3])
            break;
        case 2: // RRHH
            // Mostrar solo la opción de Empleado de i2T
            hideOptionsExcept(rolSelect, [4]);
            break;
        default:
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '../index.html'; // Redirigir a la página de inicio u otra página adecuada
            break;
    }

    const formularioUsuario = document.getElementById('formularioUsuario');

    formularioUsuario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombreUsuario = document.getElementById('nombreUsuario').value;
        const password = document.getElementById('password').value;
        const rolId = document.getElementById('rolSelect').value;

        // Verificar que no haya otro usuario con el mismo nombre
        if (await existeUsuario(nombreUsuario)) {
            alert('Ya existe un usuario con ese nombre. Por favor, elige otro.');
            return;
        }

        const nuevoUsuario = {
            usuario_nombre: nombreUsuario,
            usuario_login: nombreUsuario.toLowerCase().replace(/ /g, ""),
            usuario_pass: password,
            id_rol: parseInt(rolId)
        };

        try {
            const respuesta = await fetch('http://localhost:3000/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (respuesta.ok) {
                alert('Usuario creado correctamente');
                formularioUsuario.reset();
            } else {
                const error = await respuesta.json();
                alert(`Error al crear usuario: ${error.message}`);
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            alert('Hubo un error al crear el usuario. Por favor, intenta nuevamente.');
        }
    });
});

async function existeUsuario(nombreUsuario) {
    try {
        const respuesta = await fetch(`http://localhost:3000/usuario?usuario_nombre=${nombreUsuario}`);
        const usuarios = await respuesta.json();
        return usuarios.length > 0;
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        return false;
    }
}

function hideOptionsExcept(selectElement, allowedValues) {
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        if (!allowedValues.includes(parseInt(option.value))) {
            option.style.display = 'none';
        } else {
            option.style.display = 'block'; // Asegurar que las opciones permitidas sean visibles
        }
    }
}
