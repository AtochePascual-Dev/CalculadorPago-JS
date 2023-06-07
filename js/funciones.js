// * IMPORTACIONES
import {
  mesaHtml, horaHtml, modal, platillosHtml, resumenHtml
} from './variables.js';



// * VARIABLES
let cliente = {
  mesa: '',
  hora: '',
  pedido: [],
};



// * Cuarda un cliente
export const guardarCliente = () => {
  const mesa = mesaHtml.value;
  const hora = horaHtml.value;

  // Validamos si existen valores vacios
  const existenVacio = [mesa, hora].includes('');

  if (existenVacio) {
    mostrarAlerta('Todos los campos son obligatorios');
    return;
  }

  // Asignamos los valores al objeto
  cliente = { ...cliente, mesa, hora, }

  // Ocultamos el modal
  const modalBootstrap = bootstrap.Modal.getInstance(modal);
  modalBootstrap.hide();

  // Mostramos las secciones
  mostrarSecciones();

  // Obtener platillos de PI JSON-SERVER
  obtnerPlatillos()
};



// * Muestra una alerta en pantalla
const mostrarAlerta = (mensaje) => {
  const existeAlerta = document.querySelector('.invalid-feedback');

  if (!existeAlerta) {
    const alerta = document.createElement('DIV');

    alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
    alerta.textContent = mensaje;

    document.querySelector('.modal-body form').appendChild(alerta);

    // Eliminamos la alerta
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
};



// * Muestra las secciones
const mostrarSecciones = () => {
  platillosHtml.classList.remove('d-none');
  resumenHtml.classList.remove('d-none');
};



// * Obtiene los platillos del API
const obtnerPlatillos = () => {
  const URL = `http://localhost:4000/platillos`;

  fetch(URL)
    .then(respuesta => respuesta.json())
    .then(resultado => console.log(resultado))
    .catch(error => console.log(error))
};