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

  // Mostramos el resumen ó un texto
  (cliente.pedido.length)
    ? mostrarResumen()
    : textoPeidoVacio()

  // mostrarResumen();
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
  resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

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

  resumen.append(titulo, mesa, hora, grupo);

  contenido.appendChild(resumen);

  // Mostramos el formulario de propinas
  mostrarFormularioPropinas();
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

  // Mostramos el resumen ó un texto
  (cliente.pedido.length)
    ? mostrarResumen()
    : textoPeidoVacio();

  const productoEliminado = `#producto-${id}`;
  const inputEliminado = document.querySelector(`${productoEliminado}`);
  inputEliminado.value = 0;
};



// * Muestra un texto en pantalla cuando no hay pedidos
const textoPeidoVacio = () => {
  limpiarHtml();

  const contenido = document.querySelector('#resumen .contenido');
  const texto = document.createElement('P');
  texto.textContent = 'Añade los elementos del pedido';
  texto.classList.add('text-center');

  contenido.appendChild(texto);
};



// * Muestra un formulario de propina
const mostrarFormularioPropinas = () => {
  const contenido = document.querySelector('#resumen .contenido');

  const formulario = document.createElement('div');
  formulario.classList.add('col-md-6', 'formulario');

  const divFormulario = document.createElement('DIV');
  divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

  // titulo
  const heading = document.createElement('H3');
  heading.textContent = 'Propina';
  heading.classList.add('my-4', 'text-center');

  // Radio Buttoms
  // Radio 10%
  const radio10 = document.createElement('INPUT');
  radio10.classList.add('form-check-input');
  radio10.type = 'radio';
  radio10.name = 'propina';
  radio10.value = 10;
  radio10.onclick = calcularPropina;

  const radio10Label = document.createElement('LABEL');
  radio10Label.textContent = '10%';
  radio10Label.classList.add('form-check-label');

  const radio10Div = document.createElement('DIV');
  radio10Div.classList.add('form-check');

  // Radio 25%
  const radio25 = document.createElement('INPUT');
  radio25.classList.add('form-check-input');
  radio25.type = 'radio';
  radio25.name = 'propina';
  radio25.value = 25;
  radio25.onclick = calcularPropina;

  const radio25Label = document.createElement('LABEL');
  radio25Label.textContent = '25%';
  radio25Label.classList.add('form-check-label');

  const radio25Div = document.createElement('DIV');
  radio25Div.classList.add('form-check');

  // Radio 50%
  const radio50 = document.createElement('INPUT');
  radio50.classList.add('form-check-input');
  radio50.type = 'radio';
  radio50.name = 'propina';
  radio50.value = 50;
  radio50.onclick = calcularPropina;

  const radio50Label = document.createElement('LABEL');
  radio50Label.textContent = '50%';
  radio50Label.classList.add('form-check-label');

  const radio50Div = document.createElement('DIV');
  radio50Div.classList.add('form-check');


  // Agregamos elementos
  radio10Div.append(radio10, radio10Label);
  radio25Div.append(radio25, radio25Label);
  radio50Div.append(radio50, radio50Label);

  divFormulario.append(heading, radio10Div, radio25Div, radio50Div);

  formulario.append(divFormulario);

  contenido.appendChild(formulario);
};


// * Calcula la propina
const calcularPropina = () => {

  let subTotal = 0;
  const { pedido } = cliente;

  // Calculamos el subTotal
  pedido.forEach(articulo => {
    subTotal += articulo.cantidad * articulo.precio;
  })

  // Obtenemos el radio seleccionado
  const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

  // Calculamos la propina
  const propina = ((subTotal * Number(propinaSeleccionada)) / 100);

  // Calculamos total
  const total = subTotal + propina;

  mostrarTotalHTML(subTotal, total, propina);
};



// * Muestra el total a pagar en pantall
const mostrarTotalHTML = (subTotal, total, propina) => {

  const divTotales = document.createElement('DIV');
  divTotales.classList.add('total-pagar', 'my-5')

  // Subtotal
  const subTotalParrafo = document.createElement('P');
  subTotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  subTotalParrafo.textContent = 'Subtotal Consumo: ';

  const subTotalSpan = document.createElement('SPAN');
  subTotalSpan.classList.add('fw-normal');
  subTotalSpan.textContent = `$${subTotal}`;

  // Propina
  const propinaParrafo = document.createElement('P');
  propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  propinaParrafo.textContent = 'Propina Consumo: ';

  const propinaSpan = document.createElement('SPAN');
  propinaSpan.classList.add('fw-normal');
  propinaSpan.textContent = `$${propina}`;

  // Total
  const totalParrafo = document.createElement('P');
  totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  totalParrafo.textContent = 'Total Consumo: ';

  const totalSpan = document.createElement('SPAN');
  totalSpan.classList.add('fw-normal');
  totalSpan.textContent = `$${total}`;

  // Agregamos a contendores
  subTotalParrafo.appendChild(subTotalSpan);
  propinaParrafo.appendChild(propinaSpan);
  totalParrafo.appendChild(totalSpan);

  // Limpiar el resultado previo
  const totalPagarDiv = document.querySelector('.total-pagar');
  if (totalPagarDiv) {
    totalPagarDiv.remove();
  }

  divTotales.append(subTotalParrafo, propinaParrafo, totalParrafo);

  // Agregamos la formulario
  const formulario = document.querySelector('.formulario > div');
  formulario.appendChild(divTotales);
};