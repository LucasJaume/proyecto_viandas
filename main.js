document.addEventListener('DOMContentLoaded', () => {
    const agregarPlatoForm = document.getElementById("agregarPlatoForm");
    
    // const cambiarTema = document.querySelector('.temaOscuro');
    // const body = document.body;
    // const nav = document.querySelector('nav');
    // const paginas = document.querySelectorAll('.paginas li');

    // function alternarTema() {
    //     body.classList.toggle('oscuro');
    //     body.classList.toggle('claro');
    //     nav.classList.toggle('oscuro');
    //     nav.classList.toggle('claro');
    //     cambiarTema.classList.toggle('oscuro');
    //     cambiarTema.classList.toggle('claro');
    //     paginas.forEach(li => {
    //         li.classList.toggle('oscuro');
    //         li.classList.toggle('claro');
    //     });
    // }

    // cambiarTema.addEventListener('click', alternarTema);

    // Función para obtener y mostrar los datos iniciales
    async function obtenerDatos() {
        try {
            const comidasResponse = await fetch("http://localhost:3000/comida");
            const comidas = await comidasResponse.json();
            const menuSemanaResponse = await fetch("http://localhost:3000/menu_semana");
            const menuSemana = await menuSemanaResponse.json();
            const guarnicionesResponse = await fetch("http://localhost:3000/guarnicion");
            const guarniciones = await guarnicionesResponse.json();
            
            mostrarTabla(comidas, menuSemana, guarniciones);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    }

    obtenerDatos();

    // Función para mostrar la tabla
    function mostrarTabla(comidas, menuSemana, guarniciones) {
        const tabla = document.querySelector("#menuTabla tbody");

        tabla.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Añadir comidas
        tabla.innerHTML += '<tr><td colspan="6"><strong>Comidas</strong></td></tr>';
        comidas.forEach(comida => {
            const fila = document.createElement('tr');
            const nombreComida = document.createElement('td');
            nombreComida.textContent = comida.nombre_comida;
            fila.appendChild(nombreComida);

            menuSemana.forEach((semana, index) => {
                const celdaSemana = document.createElement('td');
                if (semana.comida.includes(comida.id_comida)) {
                    celdaSemana.classList.add("disponible");
                    celdaSemana.textContent = "X";
                }
                fila.appendChild(celdaSemana);
            });

            // Añadir botón eliminar
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            const idRol = usuario.id_rol;

            if (idRol === 3) {
                const eliminarCelda = document.createElement('td');
                const eliminarBoton = document.createElement('button');
                eliminarBoton.textContent = 'Eliminar';
                eliminarBoton.classList.add('btnEliminar');
                eliminarBoton.dataset.id = comida.id_comida;
                eliminarBoton.dataset.tipo = 'comida';
                eliminarCelda.appendChild(eliminarBoton);
                fila.appendChild(eliminarCelda);

                // Añadir botón editar
                const editarCelda = document.createElement('td');
                const editarBoton = document.createElement('button');
                editarBoton.textContent = 'Editar';
                editarBoton.classList.add('btnEditar');
                editarBoton.dataset.id = comida.id;
                editarBoton.dataset.tipo = 'comida';
                editarCelda.appendChild(editarBoton);
                fila.appendChild(editarCelda);
            }

            tabla.appendChild(fila);
        });

        // Añadir guarniciones
        tabla.innerHTML += '<tr><td colspan="6"><strong>Guarniciones</strong></td></tr>';
        guarniciones.forEach(guarnicion => {
            const fila = document.createElement('tr');
            const nombreGuarnicion = document.createElement('td');
            nombreGuarnicion.textContent = guarnicion.nombre_guarnicion;
            fila.appendChild(nombreGuarnicion);

            menuSemana.forEach((semana, index) => {
                const celdaSemana = document.createElement('td');
                if (semana.guarnicion.includes(guarnicion.id_guarnicion)) {
                    celdaSemana.classList.add("disponible");
                    celdaSemana.textContent = "X";
                }
                fila.appendChild(celdaSemana);
            });

            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            const idRol = usuario.id_rol;

            // Añadir botón eliminar
            if (idRol === 3) {
                const eliminarCelda = document.createElement('td');
            const eliminarBoton = document.createElement('button');
            eliminarBoton.textContent = 'Eliminar';
            eliminarBoton.classList.add('btnEliminar');
            eliminarBoton.dataset.id = guarnicion.id_guarnicion;
            eliminarBoton.dataset.tipo = 'guarnicion';
            eliminarCelda.appendChild(eliminarBoton);
            fila.appendChild(eliminarCelda);

            // Añadir botón editar
            const editarCelda = document.createElement('td');
            const editarBoton = document.createElement('button');
            editarBoton.textContent = 'Editar';
            editarBoton.classList.add('btnEditar');
            editarBoton.dataset.id = guarnicion.id;
            editarBoton.dataset.tipo = 'guarnicion';
            editarCelda.appendChild(editarBoton);
            fila.appendChild(editarCelda);
            }

            tabla.appendChild(fila);
        });

        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        const idRol = usuario.id_rol;
        const vistaProveedor = document.getElementById('agregarEliminarEditar');

    if (idRol !== 3) {
        vistaProveedor.style.display = 'none';
    } else {
        vistaProveedor.style.display = 'block';
    }

        // Asignar eventos a los botones 
        document.querySelectorAll('.btnEliminar').forEach(button => {
            button.addEventListener('click', function(event) {
                const id = event.target.dataset.id;
                const tipo = event.target.dataset.tipo;
                eliminarPlato(id, tipo);
            });
        });

        document.querySelectorAll('.btnEditar').forEach(button => {
            button.addEventListener('click', function(event) {
                const id = event.target.dataset.id;
                const tipo = event.target.dataset.tipo;
                editarPlato(id, tipo);
            });
        });
    }

    // Función para eliminar comida o guarnición
    function eliminarPlato(id_plato, tipo_plato) {
        fetch(`http://localhost:3000/${tipo_plato}/${id_plato}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al eliminar");
            }
            return response.json();
        })
        .then(() => {
            alert(`${tipo_plato} eliminada`);
            obtenerDatos();
        })
        .catch(error => {
            console.error('Error al eliminar:', error);
            alert(`Error al eliminar ${tipo_plato}`);
        });
    }

    // Función para editar comida o guarnición
    function editarPlato(id_plato, tipo_plato) {
        fetch(`http://localhost:3000/${tipo_plato}/${id_plato}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener el plato: ${response.statusText}`);
                }
                return response.json();
            })
            .then(plato => {
                document.getElementById("nombrePlato").value = tipo_plato === 'comida' ? plato.nombre_comida : plato.nombre_guarnicion;
                const semanasDisponibles = document.getElementById("semanasDisponibles");
                semanasDisponibles.value = ""; // Limpiar selección previa
                for (const option of semanasDisponibles.options) {
                    if (plato.semanas && plato.semanas.includes(parseInt(option.value, 10))) {
                        option.selected = true;
                    }
                }
                document.getElementById("tipoPlato").value = tipo_plato;

                // Cambiar el form para cuando se edita
                const submitButton = document.querySelector("#agregarPlatoForm button[type='submit']");
                const agregarEditar = document.querySelector("#agregarEditar")
                agregarEditar.textContent= "Editar un plato"
                submitButton.textContent = "Guardar Cambios";
                submitButton.dataset.id = id_plato;
                submitButton.dataset.tipo = tipo_plato;
                submitButton.classList.add("editando");
            })
            .catch(error => console.error("Error al obtener los datos del plato:", error));
    }
    
    agregarPlatoForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
    
        const tipoPlato = document.getElementById("tipoPlato").value;
        const nombrePlato = document.getElementById("nombrePlato").value;
        const semanasDisponibles = Array.from(document.getElementById("semanasDisponibles").selectedOptions).map(option => parseInt(option.value, 10));
        const submitButton = document.querySelector("#agregarPlatoForm button[type='submit']");
    
        if (submitButton.classList.contains("editando")) {
            const id_plato = submitButton.dataset.id;
    
            const updatedPlato = tipoPlato === 'comida' ? {
                id_comida: id_plato,
                nombre_comida: nombrePlato
            } : {
                id_guarnicion: id_plato,
                nombre_guarnicion: nombrePlato
            };
    
            fetch(`http://localhost:3000/${tipoPlato}/${id_plato}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPlato)
            })
            .then(response => response.json())
            .then(() => {
                // Actualizar las semanas disponibles
                fetch("http://localhost:3000/menu_semana")
                    .then(response => response.json())
                    .then(semanas => {
                        const semanasActualizadas = semanas.map(menu => {
                            if (tipoPlato === 'comida') {
                                if (semanasDisponibles.includes(menu.id_semana)) {
                                    if (!menu.comida.includes(id_plato)) menu.comida.push(id_plato);
                                } else {
                                    menu.comida = menu.comida.filter(comidaId => comidaId !== id_plato);
                                }
                            } else {
                                if (semanasDisponibles.includes(menu.id_semana)) {
                                    if (!menu.guarnicion.includes(id_plato)) menu.guarnicion.push(id_plato);
                                } else {
                                    menu.guarnicion = menu.guarnicion.filter(guarnicionId => guarnicionId !== id_plato);
                                }
                            }
                            return menu;
                        });
    
                        return Promise.all(semanasActualizadas.map(menu =>
                            fetch(`http://localhost:3000/menu_semana/${menu.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(menu)
                            })
                        ));
                    })
                    .then(() => obtenerDatos())
                    .catch(error => console.error('Error al actualizar disponibilidad', error));
            })
            .catch(error => console.error('Error al actualizar plato', error));
            // Resetear formulario y botón
            submitButton.textContent = "Agregar Plato";
            submitButton.classList.remove("editando");
        } else {
            // Agregar nuevo plato (código existente)
            if (tipoPlato === "comida") {
                fetch("http://localhost:3000/comida")
                    .then(response => response.json())
                    .then(comidas => {
                        const id_comida = comidas.length > 0 ? Math.max(...comidas.map(c => parseInt(c.id_comida, 10))) + 1 : 1;
                        const nuevaComida = {
                            id_comida: id_comida,
                            nombre_comida: nombrePlato
                        };
    
                        fetch("http://localhost:3000/comida", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(nuevaComida)
                        })
                        .then(response => response.json())
                        .then(() => {
                            fetch("http://localhost:3000/menu_semana")
                                .then(response => response.json())
                                .then(semanas => {
                                    const semanasActualizadas = semanas.map(menu => {
                                        if (semanasDisponibles.includes(menu.id_semana)) {
                                            menu.comida.push(id_comida);
                                        } else {
                                            menu.comida = menu.comida.filter(comidaId => comidaId !== id_comida);
                                        }
                                        return menu;
                                    });
    
                                    return Promise.all(semanasActualizadas.map(menu =>
                                        fetch(`http://localhost:3000/menu_semana/${menu.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(menu)
                                        })
                                    ));
                                })
                                .then(() => obtenerDatos())
                                .catch(error => console.error('Error al actualizar disponibilidad', error));
                        });
                    })
                    .catch(error => console.error('Error al agregar comida', error));
            } else if (tipoPlato === "guarnicion") {
                fetch("http://localhost:3000/guarnicion")
                    .then(response => response.json())
                    .then(guarniciones => {
                        const id_guarnicion = guarniciones.length > 0 ? Math.max(...guarniciones.map(c => parseInt(c.id_guarnicion, 10))) + 1 : 1;
                        const nuevaGuarnicion = {
                            id_guarnicion: id_guarnicion,
                            nombre_guarnicion: nombrePlato
                        };
    
                        fetch("http://localhost:3000/guarnicion", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(nuevaGuarnicion)
                        })
                        .then(response => response.json())
                        .then(() => {
                            fetch("http://localhost:3000/menu_semana")
                                .then(response => response.json())
                                .then(semanas => {
                                    const semanasActualizadas = semanas.map(menu => {
                                        if (semanasDisponibles.includes(menu.id_semana)) {
                                            menu.guarnicion.push(id_guarnicion);
                                        } else {
                                            menu.guarnicion = menu.guarnicion.filter(guarnicionId => guarnicionId !== id_guarnicion);
                                        }
                                        return menu;
                                    });
    
                                    return Promise.all(semanasActualizadas.map(menu =>
                                        fetch(`http://localhost:3000/menu_semana/${menu.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(menu)
                                        })
                                    ));
                                })
                                .then(() => obtenerDatos())
                                .catch(error => console.error('Error al actualizar disponibilidad', error));
                        });
                    })
                    .catch(error => console.error('Error al agregar guarnicion', error));
            }
        }
    });
});
