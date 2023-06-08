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

  // Limpiamos el hmtl previo
  limpiarHtml();

  const contenido = document.querySelector('#resumen .contenido');

  const resumen = document.createElement('DIV');
  resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

  const mesa = document.createElement('P');
  mesa.textContent = `Mesa: `;
  mesa.classList.add('fw-bold');

  const mesaSpan = document.createElement('SPAN');
  mesaSpan.textContent = `${cliente.mesa}`
  mesaSpan.classList.add('fw-normal');

  const hora = document.createElement('P');
  hora.textContent = `Hora: `;
  hora.classList.add('fw-bold');

  const horaSpan = document.createElement('SPAN');
  horaSpan.textContent = `${cliente.hora}`
  horaSpan.classList.add('fw-normal');

  const titulo = document.createElement('H3');
  titulo.textContent = `Platillos Consumidos`;
  titulo.classList.add('my-4', 'text-center');

  const grupo = document.createElement('UL');
  grupo.classList.add('list-group');

  //  Iteremos sobre el array de pedidos
  const { pedido } = cliente;
  pedido.forEach(articulo => {
    const { nombre, cantidad, precio, id } = articulo;

    const lista = document.createElement('LI');
    lista.classList.add('list-group-item');

    const nombreEL = document.createElement('H4')
    nombreEL.textContent = nombre;
    nombreEL.classList.add('my-4');

    // Cantidad del articulo
    const cantidadEL = document.createElement('P');
    cantidadEL.textContent = `Cantidad: `
    cantidadEL.classList.add('fw-bold');

    const cantidadValor = document.createElement('SPAN');
    cantidadValor.textContent = cantidad;
    cantidadValor.classList.add('fw-normal');

    // precio del articulo
    const precioEL = document.createElement('P');
    precioEL.textContent = `Precio: `
    precioEL.classList.add('fw-bold');

    const precioValor = document.createElement('SPAN');
    precioValor.textContent = `$${precio}`;
    precioValor.classList.add('fw-normal');

    // SubTotal del articulo
    const subTotalEL = document.createElement('P');
    subTotalEL.textContent = `SubTotal: `
    subTotalEL.classList.add('fw-bold');

    const subTotalValor = document.createElement('SPAN');
    subTotalValor.textContent = `$${precio * cantidad}`;
    subTotalValor.classList.add('fw-normal');

    // Boton para eliminar
    const btnEliminar = document.createElement('BUTTOM');
    btnEliminar.textContent = 'Eliminar Pedido';
    btnEliminar.classList.add('btn', 'btn-danger');

    // Funcion para elimiar el pedido
    btnEliminar.onclick = () => {
      eliminarPedido(id);

      console.log(cliente.pedido);
    };

    // Agregar valores a los contenedores
    cantidadEL.appendChild(cantidadValor);
    precioEL.appendChild(precioValor);
    subTotalEL.appendChild(subTotalValor);

    // Agregar elementos al LI
    lista.append(nombreEL, cantidadEL, precioEL, subTotalEL, btnEliminar);

    grupo.append(lista);
  });

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  resumen.append(mesa, hora, titulo, grupo);

  contenido.appendChild(resumen);
};



// * Limpia el html previo  
const limpiarHtml = () => {
  const contenido = document.querySelector('#resumen .contenido');

  while (contenido.firstChild) {
    contenido.firstChild.remove()
  };
};



// * Elimina un producto del pedido
const eliminarPedido = (id) => {
  eliminarProductoPedido(id);

  // Mostramos el resumen
  mostrarResumen();
};