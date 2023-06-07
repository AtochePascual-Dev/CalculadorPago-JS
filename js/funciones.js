// * IMPORTACIONES
import { mesaHtml, horaHtml } from './variables.js';

export const guardarCliente = () => {
  const mesa = mesaHtml.value;
  const hora = horaHtml.value;

  // Validamos si existen valores vacios
  const existenVacio = [mesa, hora].includes('');

  if (existenVacio) {
    console.log('Todos los campos son obligatorios');
  }
};