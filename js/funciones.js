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

const categorias = {
  1: 'Comida',
  2: 'Bebida',
  3: 'Postre',
}


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
    .then(resultado => {
      mostrarPlatillos(resultado)
    })
    .catch(error => console.log(error))
};



// * Muestra los platillos en pantalla 
const mostrarPlatillos = (platillos) => {
  const contenido = document.querySelector('#platillos .contenido');

  platillos.forEach(plato => {
    const row = document.createElement('DIV');
    row.classList.add('row', 'py-3', 'border-top');

    const nombre = document.createElement('DIV');
    nombre.classList.add('col-md-4');
    nombre.textContent = plato.nombre;

    const precio = document.createElement('DIV');
    precio.classList.add('col-md-3', 'fw-bold');
    precio.textContent = `$${plato.precio}`;

    const categoria = document.createElement('DIV');
    categoria.classList.add('col-md-3');
    categoria.textContent = categorias[plato.categoria];

    const inputCantidad = document.createElement('INPUT');
    inputCantidad.type = 'number';
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${plato.id}`;
    inputCantidad.classList.add('form-control');
    inputCantidad.onchange = () => {
      const cantidad = Number(inputCantidad.value);
      agregarPedido({ cantidad, ...plato });
    };

    const agregar = document.createElement('DIV')
    agregar.classList.add('col-md-2');

    agregar.appendChild(inputCantidad);

    row.append(nombre, precio, categoria, agregar);

    contenido.appendChild(row);
  });
};



// * Agrega un pedio al array de pedidos  
const agregarPedido = (producto) => {
  const exiteProductoEnPedido = cliente.pedido.some(pedido => pedido.id === producto.id);

  // Validamos que al cantidad sea mayor a 0
  if (producto.cantidad > 0) {
    // Agregamos +o aumentamos la cantidad
    (exiteProductoEnPedido)
      ? aumentarCantidadProducto(producto)
      : agregarProductoPedido(producto)
  } else {
    // Eliminamos un producto
    eliminarProductoPedido(producto.id);
  }

  // Mostramos el resumen
  mostrarResumen();
};



// * Agrega un producto como pedido
const agregarProductoPedido = (producto) => {
  cliente.pedido = [...cliente.pedido, producto];
};



// * Aumenta la cantidad de un producto en la lisat de pedidos
const aumentarCantidadProducto = (producto) => {
  cliente.pedido = cliente.pedido.map(pedido => {
    if (pedido.id === producto.id) {
      pedido.cantidad = producto.cantidad;
    }
    return pedido;
  });
};



// * Elimina un producto de la lista de pedidos
const eliminarProductoPedido = (id) => {
  cliente.pedido = cliente.pedido.filter(pedido => pedido.id !== id);
};



// * Muestra el resumen de pedids en pantalla
const mostrarResumen = () => {
  const contenido = document.querySelector('#resumen .contenido');

  const resumen = document.createElement('DIV');
  resumen.classList.add('col-md-6');

  const mesa = document.createElement('P');
  mesa.textContent = `Mesa :`
  mesa.classList.add('fw-bold');

  const mesaSpan = document.createElement('SPAN');
  mesaSpan.textContent = `${cliente.mesa}`
  mesaSpan.classList.add('fw-normal');

  const hora = document.createElement('P');
  hora.textContent = `Hora :`
  hora.classList.add('fw-bold');

  const horaSpan = document.createElement('SPAN');
  horaSpan.textContent = `${cliente.hora}`
  horaSpan.classList.add('fw-normal');

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  contenido.append(mesa, hora)
};