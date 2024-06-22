const usuarios = "http://localhost:3000/usuario";
const comida = "http://localhost:3000/comida";
const guarniciones = "http://localhost:3000/guarnicion";
let inputs = document.querySelectorAll(".inputLogin");
var error = document.querySelector("#error");

document.querySelector(".formLogin").addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    fetch(usuarios)
        .then((response) => response.json())
        .then((usuarios) => {
            const usuarioVerificado = usuarios.find((element) => {
                return element.usuario_login === data.usuario && element.usuario_pass === data.contrasena;
            });
            iniciarSesion(usuarioVerificado);
        })
        .catch((error) => {
            console.log(error);
        });
});

const iniciarSesion = (usuario) => {
    if (usuario) {
        window.location.href = '../index.html';
        sessionStorage.setItem("usuario", JSON.stringify(usuario))


    } else {
        inputs.forEach(input => {
            input.className = "inputError";
            input.value=""
        });
        error.innerHTML = "Usuario o Password incorrecto";

    }
};
