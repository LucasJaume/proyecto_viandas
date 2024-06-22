document.addEventListener('DOMContentLoaded', function() {
    const guardarPedidoBtn = document.getElementById('guardarPedido');
    const buscarPedidoBtn = document.getElementById('buscarPedido');
    const tablaPedidos = document.getElementById('tablaPedidos');
    const semanaSelect = document.getElementById('semana');
    const diaSelect = document.getElementById('dia');
    const comidaSelect = document.getElementById('comida');
    const guarnicionSelect = document.getElementById('guarnicion');
    const buscarSemanaInput = document.getElementById('buscarSemana');

    let filaEnEdicion = null; // Variable para rastrear la fila en edición

    function cargarOpcionesDesdeJSON(endpoint, elemento, textoDefault, valorId, nombre) {
        fetch(`http://localhost:3000/${endpoint}`)
            .then(response => response.json())
            .then(data => {
                elemento.innerHTML = ''; 
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = textoDefault;
                elemento.appendChild(defaultOption);
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[valorId]; 
                    option.textContent = item[nombre]; 
                    elemento.appendChild(option);
                });
            })
            .catch(error => console.error(`Error al cargar opciones para ${endpoint}:`, error));
    }

    cargarOpcionesDesdeJSON('menu_semana', semanaSelect, 'Seleccione una semana', 'id_semana', 'id_semana');

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    diaSelect.innerHTML = '';
    dias.forEach((dia, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = dia;
        diaSelect.appendChild(option);
    });

    cargarOpcionesDesdeJSON('comida', comidaSelect, 'Seleccione una comida', 'id_comida', 'nombre_comida');

    cargarOpcionesDesdeJSON('guarnicion', guarnicionSelect, 'Seleccione una guarnición', 'id_guarnicion', 'nombre_guarnicion');

    guardarPedidoBtn.addEventListener('click', function() {
        const semana = semanaSelect.value;
        const dia = diaSelect.value;
        const comida = comidaSelect.options[comidaSelect.selectedIndex].text;
        const guarnicion = guarnicionSelect.options[guarnicionSelect.selectedIndex].text;

        if (!semana || !dia || !comida || !guarnicion) {
            alert('Por favor, complete todos los campos antes de guardar.');
            return;
        }

        if (filaEnEdicion) {
            // Actualizar la fila existente
            filaEnEdicion.innerHTML = `
                <td>${semana}</td>
                <td>${dia}</td>
                <td>${comida}</td>
                <td>${guarnicion}</td>
                <td>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
            `;
            agregarEventosAcciones(filaEnEdicion);
            filaEnEdicion = null; // Restablecer la variable de seguimiento
        } else {
            // Crear una nueva fila
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${semana}</td>
                <td>${dia}</td>
                <td>${comida}</td>
                <td>${guarnicion}</td>
                <td>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
            `;
            tablaPedidos.querySelector('tbody').prepend(fila);
            agregarEventosAcciones(fila);
        }

        // Limpiar los campos del formulario después de guardar
        semanaSelect.value = '';
        diaSelect.value = '';
        comidaSelect.value = '';
        guarnicionSelect.value = '';
    });

    function agregarEventosAcciones(fila) {
        const btnEditar = fila.querySelector('.editar');
        const btnEliminar = fila.querySelector('.eliminar');

        btnEditar.addEventListener('click', function() {
            const columnas = fila.querySelectorAll('td');
            semanaSelect.value = columnas[0].textContent;
            diaSelect.value = dias.indexOf(columnas[1].textContent) + 1;
            comidaSelect.value = obtenerValorOpcion(comidaSelect, columnas[2].textContent);
            guarnicionSelect.value = obtenerValorOpcion(guarnicionSelect, columnas[3].textContent);

            filaEnEdicion = fila; // Establecer la fila en edición
        });

        btnEliminar.addEventListener('click', function() {
            fila.remove();
            semanaSelect.value = '';
            diaSelect.value = '';
            comidaSelect.value = '';
            guarnicionSelect.value = '';
        });
    }

    function obtenerValorOpcion(selectElement, textoOpcion) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].text === textoOpcion) {
                return selectElement.options[i].value;
            }
        }
        return '';
    }

    buscarPedidoBtn.addEventListener('click', function() {
        const semana = buscarSemanaInput.value;
        const filas = tablaPedidos.querySelectorAll('tbody tr');

        filas.forEach(fila => {
            if (fila.querySelector('td').textContent === semana || semana === '') {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    });

    function habilitarBotonGuardar() {
        const fechaActual = new Date();
        const diaSemana = fechaActual.getDay(); // 0 es domingo, 1 es lunes, ..., 6 es sábado

        if (diaSemana >= 5 || diaSemana === 0) {
            guardarPedidoBtn.disabled = false;
        } else {
            guardarPedidoBtn.disabled = true;
        }
    }

    habilitarBotonGuardar();
    setInterval(habilitarBotonGuardar, 60 * 60 * 1000); // Verificar cada hora
});
