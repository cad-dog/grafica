const seleccionaTipo = (opcion) => {
  if (tipo == opcion) return;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  bipartitamsj.innerHTML = "";

  vaciaGrafica();

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

  // Agregar vertice
  if (funcion == "agregarVertice") {
    tituloModal.innerHTML = "Agregar Vertice";
    if (tipo != "red") {
      contenidoModal.innerHTML =
        '<div class="flex flex-col space-y-4 mt-4"> <div>Introduzca los datos del vertice que desea agregar.</div> <div class="text-sm flex space-x-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaVG1" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="agregaVertice1()" > Agregar </button> </div> </div>';
    } else {
      contenidoModal.innerHTML =
        '<div class="flex flex-col space-y-4 mt-4"> <div>Introduzca los datos del vertice que desea agregar.</div> <div class="text-sm flex flex-col"> <div class="flex space-x-2"> <div class="mt-1">Etiqueta:</div> <input id="agregaVR1" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <div class="mt-1">Valor:</div> <input id="agregaVR4" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <div class="mt-1">Flujo minimo:</div> <input id="agregaVR2" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> <div class="mt-1">Flujo maximo:</div> <input id="agregaVR3" type="text" class="w-10 rounded-md border focus:outline-none bg-gray-700" /> </div> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none mt-5 " onclick="agregaVertice2()" > Agregar </button> </div> </div>';
    }
  }
  // Agregar arco
  else if (funcion == "agregarArco") {
    tituloModal.innerHTML = "Agregar Arco";

    if (tipo != "red") {
      contenidoModal.innerHTML =
        'Introduzca los datos del arco que desea agregar. <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaAG1" type="text" class="w-10 rounded-md border focus:outline-none text-gray-800" /> <div class="mt-1">de:</div> <input id="agregaAG2" type="text" class="w-10 rounded-md border focus:outline-none text-gray-800" /> <div class="mt-1">a:</div> <input id="agregaAG3" type="text" class="w-10 rounded-md border focus:outline-none text-gray-800" /> <div class="mt-1">w:</div> <input id="agregaAG4" type="text" class="w-10 rounded-md border focus:outline-none text-gray-800" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="agregaArista1()" > Agregar </button> </div>';
    } else {
      contenidoModal.innerHTML =
        'Introduzca los datos del arco que desea agregar. <div class="text-sm flex flex-col mt-1"> <div class="flex space-x-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaAR1" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> <div class="mt-1">de:</div> <input id="agregaAR2" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> <div class="mt-1">a:</div> <input id="agregaAR3" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> <div class="mt-1">Peso:</div> <input id="agregaAR7" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> <div class="mt-1">Costo:</div> <input id="agregaAR8" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> </div> <div class="flex space-x-1 mt-5"> <div class="mt-1">Flujo mínimo:</div> <input id="agregaAR4" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> <div class="mt-1">Flujo:</div> <input id="agregaAR6" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> <div class="mt-1">Flujo máximo:</div> <input id="agregaAR5" type="text" class=" w-10 rounded-md border mt-1 text-gray-800 focus:outline-none " /> </div> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none mt-5 " onclick="agregaArista2()" > Agregar </button> </div>';
    }
  }
  // Eliminar vertice
  else if (funcion == "eliminarVertice") {
    tituloModal.innerHTML = "Eliminar Vértice";

    if (tipo != "red") {
      contenidoModal.innerHTML =
        '<div> Introduzca la etiqueta del vértice que se desea eliminar <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaVG1" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="eliminaVertice1()" > Eliminar </button> </div> </div>';
    } else {
      contenidoModal.innerHTML =
        '<div> Introduzca la etiqueta del vértice que se desea eliminar <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaVR1" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="eliminaVertice2()" > Eliminar </button> </div> </div>';
    }
  }
  // Eliminar Arco
  else if (funcion == "eliminarArista") {
    tituloModal.innerHTML = "Eliminar Arco";

    if (tipo != "red") {
      contenidoModal.innerHTML =
        '<div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaAG1" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="eliminaArista1()" > Eliminar </button> </div>';
    } else {
      contenidoModal.innerHTML =
        '<div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaAR1" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="eliminaArista2()" > Eliminar </button> </div>';
    }
  }
  // Menu
  else if (funcion == "menu") {
    tituloModal.innerHTML = "Menú";

    if (tipo == "grafica") {
      contenidoModal.innerHTML =
        '<div class="border-t border-b p-1"> <div class="font-bold">Graficar Archivo</div> <div class="text-sm flex space-x-1 mt-1"> <input id="archivo" type="file" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="graficarArchivo1()" > Graficar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Buscar vertice --> <div> <div class="font-bold">Buscar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="buscarVertice" type="text" class=" w-10 rounded-md border text-gray-800 focus:outline-none " /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="buscaVertice()" > Buscar </button> </div> </div> <!-- Buscar arista --> <div class="border-l px-1"> <div class="font-bold">Buscar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="buscarArista" type="text" class=" w-10 rounded-md border text-gray-800 focus:outline-none " /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="buscaArista()" > Buscar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Grado vertice --> <div> <div class="font-bold">Paseo de Euler</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(algoritmoFleury)" > Buscar </button> </div> </div> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class=" w-10 rounded-md border text-gray-800 focus:outline-none " /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="vaciarVertice1()" > Vaciar </button> </div> </div> </div> <!-- Arboles de expansion  --> <!-- Ancho --> <div class="flex border-t border-b p-1 space-x-1"> <div> <div class="font-bold">Búsqueda a lo ancho</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(busquedaAncho)" > Buscar </button> </div> </div> <!-- Produndo --> <div class="border-l px-1"> <div class="font-bold">Búsqueda a lo profundo</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(busquedaProfundidad)" > Buscar </button> </div> </div> <!-- Kruskal --> <div class="border-l px-1"> <div class="font-bold">Kruskal</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(kruskal)" > Buscar </button> </div> </div> <!-- Prim --> <div class="border-l px-1"> <div class="font-bold">Prim</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(prim)" > Buscar </button> </div> </div> </div> <div> <div class="flex p-1 space-x-1"> <!-- Prufer --> <div class="px-1"> <div class="font-bold">Prufer</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Secuencia:</div> <input id="prufer" type="text" class=" w-20 rounded-md border text-gray-800 focus:outline-none " /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="crearGrafica(prufer)" > dibujar </button> </div> </div> </div> </div>';
    } else if (tipo == "digrafica") {
      contenidoModal.innerHTML =
        '<div class="border-t border-b p-1"> <div class="font-bold">Graficar Archivo</div> <div class="text-sm flex space-x-1 mt-1"> <input id="archivo" type="file" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="graficarArchivo1()" > Graficar </button> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Vaciar vertice --> <div class="px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class=" w-10 rounded-md border text-gray-800 focus:outline-none " /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="vaciarVertice1()" > Vaciar </button> </div> </div> </div> <!-- Dijkstra --> <div class="border-t border-b p-1"> <div class="font-bold">Dijkstra</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Vértice inicial:</div> <input id="dijkstra1" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> <div class="mt-1">Vértice destino:</div> <input id="dijkstra2" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /><button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(dijkstra)" > Buscar </button> </div> </div> <!-- Floyd --> <div class="border-t p-1"> <div class="font-bold">Floyd</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Vértice inicial:</div> <input id="inicioFloyd" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> Vértice destino:<input id="destinoFloyd" type="text" class="w-10 rounded-md border text-gray-800 focus:outline-none" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="pintarIteraciones(floyd)" > Buscar </button> </div> </div>';
    } else if (tipo == "red") {
      contenidoModal.innerHTML =
        '<div class="border-t border-b p-1"> <div class="font-bold">Graficar Archivo</div> <div class="text-sm flex space-x-1 mt-1"> <input id="archivo2" type="file" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none " onclick="graficarArchivo2()" > Graficar </button> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Vaciar vertice --> <div class="px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class=" w-10 rounded-md borderm text-gray-800 focus:outline-none " /> <button class=" bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none " onclick="vaciarVertice1()" > Vaciar </button> </div> </div> </div> <!-- Ford Fulkerson --> <div class="border-t border-b p-1"> <div class="font-bold">Ford Fulkerson</div> <div class="text-sm flex mt-1"> <div class="mt-1">Fuente(s):</div> <input id="ford1" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <div class="mt-1">Sumidero(s):</div> <input id="ford2" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1 " onclick="actualizarGrafica(fordFulkerson)" > Buscar </button> </div> </div> <!-- primal --> <div class="border-t border-b p-1"> <div class="font-bold">Primal</div> <div class="text-sm flex mt-1"> <div class="mt-1">Fuente(s):</div> <input id="primal1" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <div class="mt-1">Sumidero(s):</div> <input id="primal2" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <div class="mt-1">Flujo deseado:</div> <input id="primal3" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1 " onclick="actualizarGrafica(primal)" > Buscar </button> </div> </div> <!-- dual --> <div class="border-t border-b p-1"> <div class="font-bold">Dual</div> <div class="text-sm flex mt-1"> <div class="mt-1">Fuente(s):</div> <input id="dual1" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <div class="mt-1">Sumidero(s):</div> <input id="dual2" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <div class="mt-1">Flujo deseado:</div> <input id="dual3" type="text" class="w-10 rounded-md borderm text-gray-800 focus:outline-none" /> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1 " onclick="actualizarGrafica(dual)" > Buscar </button> </div> </div> <!-- simplex --> <div class="border-t p-1"> <div class="font-bold">Simplex</div> <div class="text-sm flex mt-1"> <button class=" bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1 " onclick="actualizarIteraciones(simplex)" > Buscar </button> </div> </div>';
    }
  }
};

const cerrarModal = () => {
  let modal = document.getElementById("modal");
  modal.classList.add("hidden");
};
