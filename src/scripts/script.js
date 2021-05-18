const seleccionaTipo = (opcion) => {
  if (tipo == opcion) return;

  tipo = opcion;

  let display = document.getElementById("displayTipo");
  let v = document.getElementById("verticesh");
  let a = document.getElementById("aristash");
  let nv = document.getElementById("numVertices");
  let na = document.getElementById("numAristas");

  nv.innerHTML = "0";
  na.innerHTML = "0";

  v.innerHTML = "Vértices:";
  if (opcion == "grafica") {
    a.innerHTML = "Aristas:";
    display.innerHTML =
      '<span class="mr-1">Gráfica</span> <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" > <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>';
  } else if (opcion == "digrafica") {
    a.innerHTML = "Arcos:";
    display.innerHTML =
      '<span class="mr-1">Digráfica</span> <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" > <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>';
  } else if (opcion == "red") {
    a.innerHTML = "Arcos:";
    display.innerHTML =
      '<span class="mr-1">Red de transporte</span> <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" > <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>';
  }

  graficar();
};

const abrirModal = (funcion) => {
  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  if (tipo == undefined) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>Seleccione el tipo de gráfica</p>";

    return;
  }

  let modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  let tituloModal = document.getElementById("tituloModal");
  let contenidoModal = document.getElementById("contenidoModal");
  if (funcion == "agregarVertice") {
    tituloModal.innerHTML = "Agregar Vertice";
    if (tipo != "red") {
      contenidoModal.innerHTML =
        '<div class="flex flex-col space-y-4 mt-4"> <div>Introduzca los datos del vertice que desea agregar.</div> <div class="text-sm flex space-x-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaVG1" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="agregaVertice1()" > Agregar </button> </div> </div>';
    } else {
      contenidoModal.innerHTML =
        '<div class="flex flex-col space-y-4 mt-4"> <div>Introduzca los datos del vertice que desea agregar.</div> <div class="text-sm flex space-x-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaVR1" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <div class="mt-1">Flujo minimo:</div> <input id="agregaVR2" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <div class="mt-1">Flujo maximo:</div> <input id="agregaVR3" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <div class="mt-1">Valor:</div> <input id="agregaVR3" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="agregaVertice2()" > Agregar </button> </div> </div>';
    }
  }
};

const cerrarModal = () => {
  let modal = document.getElementById("modal");
  modal.classList.add("hidden");
};
