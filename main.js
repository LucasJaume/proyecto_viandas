document.addEventListener('DOMContentLoaded', () => {
    const agregarPlatoForm = document.getElementById("agregarPlatoForm");

    fetch("http://localhost:3000/comida")
        .then(response => response.json())
        .then(comidas => {
            fetch("http://localhost:3000/menu_semana")
                .then(response => response.json())
                .then(menuSemana => {
                    fetch("http://localhost:3000/guarnicion")
                        .then(response => response.json())
                        .then(guarniciones => {
                            mostrarTabla(comidas, menuSemana, guarniciones);
                        })
                        .catch(error => console.error("Error al obtener guarniciones:", error));
                })
                .catch(error => console.error("Error al obtener el menú de la semana:", error));
        })
        .catch(error => console.error("Error al obtener las comidas:", error));

    function mostrarTabla(comidas, menuSemana, guarniciones) {
        const tabla = document.querySelector("#menuTabla tbody");

        tabla.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Añadir encabezados para comidas
        tabla.innerHTML += '<tr><td colspan="5"><strong>Comidas</strong></td></tr>';
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

            tabla.appendChild(fila);
        });

        // Añadir encabezados para guarniciones
        tabla.innerHTML += '<tr><td colspan="5"><strong>Guarniciones</strong></td></tr>';
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

            tabla.appendChild(fila);
        });
    }

    // Evento al enviar el formulario para agregar plato
    agregarPlatoForm.addEventListener('submit', event => {
        event.preventDefault();

        const nombrePlato = document.getElementById("nombrePlato").value;
        const semanasDisponibles = Array.from(document.getElementById("semanasDisponibles").selectedOptions).map(option => parseInt(option.value));
        const tipoPlato = document.getElementById("tipoPlato").value;
        // Generar un nuevo ID para la comida o guarnición
        const nuevoId = Math.floor(Math.random() * 1000000); // O usar un método más robusto para generar ID únicos

        if (tipoPlato === 'comida') {
            const nuevaComida = {
                id_comida: nuevoId,
                nombre_comida: nombrePlato
            };
            fetch("http://localhost:3000/comida", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaComida)
            })
            .then(response => response.json())
            .then(nuevaComida => {
                semanasDisponibles.forEach(semanaId => {
                    // Encontrar la semana correspondiente en menuSemana
                    const semana = menuSemana.find(s => s.id_semana === semanaId);
            
                    if (semana) {
                        const nuevasComidas = [...semana.comida, nuevaComida.id_comida];
                        fetch(`http://localhost:3000/menu_semana/${semana.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ comida: nuevasComidas })
                        })
                        .then(response => response.json())
                        .then(actualizadaSemana => {
                            // Actualizar menuSemana localmente
                            const index = menuSemana.findIndex(s => s.id === actualizadaSemana.id);
                            if (index !== -1) {
                                menuSemana[index].comida = actualizadaSemana.comida;
                                mostrarTabla(comidas, menuSemana, guarniciones);
                            }
                        })
                        .catch(error => console.error("Error al actualizar semana:", error));
                    }
                });
            })
            .catch(error => console.error("Error al agregar comida:", error));            
        } else if (tipoPlato === 'guarnicion') {
            const nuevaGuarnicion = {
                id_guarnicion: nuevoId,
                nombre_guarnicion: nombrePlato
            };
            fetch("http://localhost:3000/guarnicion", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaGuarnicion)
            })
            .then(response => response.json())
            .then(nuevaGuarnicion => {
                semanasDisponibles.forEach(semanaId => {
                    const semana = menuSemana.find(s => s.id === semanaId);
                    if (semana) {
                        const nuevasGuarniciones = [...semana.guarnicion, nuevaGuarnicion.id_guarnicion];
                        fetch('http://localhost:3000/menu_semana/${semanaId}', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ guarnicion: nuevasGuarniciones })
                        })
                        .then(response => response.json())
                        .then(actualizadaSemana => {
                            const semanaIndex = menuSemana.findIndex(s => s.id === semanaId);
                            menuSemana[semanaIndex].guarnicion = nuevasGuarniciones;
                            guarniciones.push(nuevaGuarnicion);
                            mostrarTabla();
                        })
                        .catch(error => console.error("Error al actualizar semana:", error));
                    }
                });
            })
            .catch(error => console.error("Error al agregar guarnición:", error));
        }
    });
});