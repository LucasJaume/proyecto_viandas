const button = document.querySelector(".temaOscuro");

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

    function actualizarEncabezados(menuSemana) {
        const encabezados = document.querySelectorAll(".semana");
        menuSemana.forEach((semana, index) => {
            if (encabezados[index]) {
                encabezados[index].textContent = `Semana ${semana.id_semana}`;
            }
        });
    }

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

    actualizarEncabezados(menuSemana);
}
