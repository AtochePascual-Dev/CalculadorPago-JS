// * IMPORTACIONES
import { mesaHtml, horaHtml } from './variables.js';

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