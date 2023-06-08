// * IMPORTACIONES
import { btnGuardarCliente } from './variables.js'
import { guardarCliente } from './funciones.js'



// * EVENTOS
// * Cuando el documento esta listo
document.addEventListener('DOMContentLoaded', () => {
  btnGuardarCliente.addEventListener('click', guardarCliente)
});