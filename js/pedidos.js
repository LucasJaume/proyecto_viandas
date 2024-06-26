document.addEventListener('DOMContentLoaded', function() {
    const guardarPedidoBtn = document.getElementById('guardarPedido');
    const buscarPedidoBtn = document.getElementById('buscarPedido');
    const tablaPedidos = document.getElementById('tablaPedidos');
    const semanaSelect = document.getElementById('semana');
    const diaSelect = document.getElementById('dia');
    const comidaSelect = document.getElementById('comida');
    const guarnicionSelect = document.getElementById('guarnicion');
    const buscarSemanaInput = document.getElementById('buscarSemana');

    let filaEnEdicion = null;

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

    semanaSelect.disabled = true;
    diaSelect.disabled = true;

    comidaSelect.addEventListener('change', function() {
        const comidaSeleccionada = comidaSelect.value;
        if (comidaSeleccionada) {
            semanaSelect.disabled = false;
            diaSelect.disabled = false;
        } else {
            semanaSelect.disabled = true;
            diaSelect.disabled = true;
        }
    });

    function cargarPedidos() {
        fetch('http://localhost:3000/pedido_menu_proximo')
            .then(response => response.json())
            .then(data => {
                tablaPedidos.querySelector('tbody').innerHTML = ''; 
                data.forEach(pedido => {
                    pedido.dia.forEach((dia, index) => {
                        if (dia.id_comida.length > 0 || dia.id_guarnicion.length > 0) {
                            const fila = document.createElement('tr');
                            fila.innerHTML = `
                                <td>${pedido.id_semana}</td>
                                <td>${dias[index]}</td>
                                <td>${dia.id_comida.join(', ')}</td>
                                <td>${dia.id_guarnicion.join(', ')}</td>
                                <td>
                                    <button class="editar">Editar</button>
                                    <button class="eliminar">Eliminar</button>
                                </td>
                            `;
                            tablaPedidos.querySelector('tbody').appendChild(fila);
                            agregarEventosAcciones(fila);
                        }
                    });
                });
            })
            .catch(error => console.error('Error al cargar pedidos:', error));
    }

    guardarPedidoBtn.addEventListener('click', function() {
        const semana = semanaSelect.value;
        const dia = diaSelect.value;
        const comida = comidaSelect.options[comidaSelect.selectedIndex].text;
        const guarnicion = guarnicionSelect.options[guarnicionSelect.selectedIndex].text;

        if (!semana || !dia || !comida || !guarnicion) {
            alert('Por favor, complete todos los campos antes de guardar.');
            return;
        }

        const usuario = JSON.parse(sessionStorage.getItem('usuario'));

        const pedido = {
            id_usuario: usuario.id_usuario,
            id_semana: parseInt(semana),
            dia: [{ id_comida: [parseInt(comidaSelect.value)], id_guarnicion: [parseInt(guarnicionSelect.value)] }, { id_comida: [], id_guarnicion: [] }, { id_comida: [], id_guarnicion: [] }, { id_comida: [], id_guarnicion: [] }, { id_comida: [], id_guarnicion: [] }]
        };

        fetch('http://localhost:3000/pedido_menu_proximo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Pedido guardado:', data);
            cargarPedidos(); 
        })
        .catch(error => console.error('Error al guardar el pedido:', error));

        semanaSelect.value = '';
        diaSelect.value = '';
        comidaSelect.value = '';
        guarnicionSelect.value = '';
    });

    function agregarEventosAcciones(fila) {
        const btnEditar = fila.querySelector('.editar');
        const btnEliminar = fila.querySelector('.eliminar');

        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (usuario && usuario.id_rol !== 2) {
            btnEliminar.style.display = 'none';
        }

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

    cargarPedidos(); 
});
