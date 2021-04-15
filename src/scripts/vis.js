let vertices,
  tipo,
  aristas,
  aristasCopia,
  verticesCopia,
  graficaVis,
  idVertice = 1,
  idArista = 1,
  graficaCopia,
  esBipartita,
  opciones = {
    groups: {
      a: { color: "#f4b1f7" }, // amarillo
      b: { color: "#f7f6b1" }, // morado
      c: { color: "#b5f7b1" }, // verde
      d: { color: { border: "#ff0000" } }, // borde rojo
    },
  };

let grafica = new Grafica();

// Elementos html
let inputPrufer;
let header = document.getElementById("header");
let mensaje = document.getElementById("mensaje");
let contenedor = document.getElementById("grafica");
let bipartita = document.getElementById("bipartita");
let numVertices = document.getElementById("numVertices");
let numAristas = document.getElementById("numAristas");
let leyenda = document.getElementById("leyenda");

const graficar = () => {
  vertices = new vis.DataSet([]);
  aristas = new vis.DataSet([]);

  if (document.getElementById("tipo1").checked) {
    tipo = document.getElementById("tipo1").value;
    menu.innerHTML =
      '<div class="border-t border-b p-1"> <div class="font-bold">Agregar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="etiqueta" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaVertice()" > Agregar </button> </div> </div> <!-- Agregar arista input --> <div class="border-t border-b p-1"> <div class="font-bold">Agregar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="arista" type="text" class="w-10 rounded-md border" /> <div class="mt-1">de:</div> <input id="de" type="text" class="w-10 rounded-md border" /> <div class="mt-1">a:</div> <input id="a" type="text" class="w-10 rounded-md border" /> <div class="mt-1">w:</div> <input id="peso" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaArista()" > Agregar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Eliminar vertice --> <div> <div class="font-bold">Eliminar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminar" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaVertice()" > Eliminar </button> </div> </div> <!-- Eliminar arista --> <div class="border-l px-1"> <div class="font-bold">Eliminar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminarArista" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaArista()" > Eliminar </button> </div> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Buscar vertice --> <div> <div class="font-bold">Buscar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="buscarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="buscaVertice()" > Buscar </button> </div> </div> <!-- Buscar arista --> <div class="border-l px-1"> <div class="font-bold">Buscar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="buscarArista" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="buscaArista()" > Buscar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Grado vertice --> <div> <div class="font-bold">Paseo de Euler</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="encuentraPaseo()" > Buscar </button> </div> </div> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciarVertice()" > Vaciar </button> </div> </div> </div> <!-- Arboles de expansion  --> <!-- Ancho --> <div class="flex border-t border-b p-1 space-x-1"> <div> <div class="font-bold">Búsqueda a lo ancho</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(busquedaAncho)" > Buscar </button> </div> </div> <!-- Produndo --> <div class="border-l px-1"> <div class="font-bold">Búsqueda a lo profundo</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(busquedaProfundidad)" > Buscar </button> </div> </div> <!-- Kruskal --> <div class="border-l px-1"> <div class="font-bold">Kruskal</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(kruskal)" > Buscar </button> </div> </div> <!-- Prim --> <div class="border-l px-1"> <div class="font-bold">Prim</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(prim)" > Buscar </button> </div> </div> </div> <div> <div class="flex border-b p-1 space-x-1"> <!-- Prufer --> <div class="px-1"> <div class="font-bold">Prufer</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Secuencia:</div><input id="prufer" type="text" class="w-20 rounded-md border"/> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="crearGrafica(prufer)" > dibujar </button> </div> </div> </div> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="copiarGrafica()" > Copiar gráfica </button> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="restauraGrafica()" > Restaurar gráfica </button> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciaGrafica()" > Vaciar gráfica </button> </div>';
    inputPrufer = document.getElementById("prufer");
  } else if (document.getElementById("tipo2").checked) {
    tipo = document.getElementById("tipo2").value;
    menu.innerHTML =
      '<div class="border-t border-b p-1"> <div class="font-bold">Agregar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="etiqueta" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaVertice()" > Agregar </button> </div> </div> <!-- Agregar arista input --> <div class="border-t border-b p-1"> <div class="font-bold">Agregar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="arista" type="text" class="w-10 rounded-md border" /> <div class="mt-1">de:</div> <input id="de" type="text" class="w-10 rounded-md border" /> <div class="mt-1">a:</div> <input id="a" type="text" class="w-10 rounded-md border" /> <div class="mt-1">w:</div> <input id="peso" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaArista()" > Agregar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Eliminar vertice --> <div> <div class="font-bold">Eliminar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminar" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaVertice()" > Eliminar </button> </div> </div> <!-- Eliminar arista --> <div class="border-l px-1"> <div class="font-bold">Eliminar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminarArista" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaArista()" > Eliminar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciarVertice()" > Vaciar </button> </div> </div> </div> <!-- Dijkstra --> <div class="border-t border-b p-1"> <div class="font-bold">Dijkstra</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Vértice inicial:</div> <input id="dijkstra" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(dijkstra)" > Buscar </button> </div> </div> <!-- Floyd --> <div class="border-t border-b p-1"> <div class="font-bold">Floyd</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Vértice inicial:</div> <input id="inicioFloyd" type="text" class="w-10 rounded-md border" /> <input id="destinoFloyd" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(floyd)" > Buscar </button> </div> </div> <div> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="copiarGrafica()" > Copiar gráfica </button> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="restauraGrafica()" > Restaurar gráfica </button> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciaGrafica()" > Vaciar gráfica </button> </div>';
  } else if (document.getElementById("tipo3").checked) {
    tipo = document.getElementById("tipo3").value;
    menu.innerHTML =
      '<div class="border-t border-b p-1"> <div class="font-bold">Agregar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="etiqueta" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaVertice()" > Agregar </button> </div> </div> <!-- Agregar arista input --> <div class="border-t border-b p-1"> <div class="font-bold">Agregar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="arista" type="text" class="w-10 rounded-md border" /> <div class="mt-1">de:</div> <input id="de" type="text" class="w-10 rounded-md border" /> <div class="mt-1">a:</div> <input id="a" type="text" class="w-10 rounded-md border" /> <div class="mt-1">w:</div> <input id="peso" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaArista()" > Agregar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Eliminar vertice --> <div> <div class="font-bold">Eliminar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminar" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaVertice()" > Eliminar </button> </div> </div> <!-- Eliminar arista --> <div class="border-l px-1"> <div class="font-bold">Eliminar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminarArista" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaArista()" > Eliminar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciarVertice()" > Vaciar </button> </div> </div> </div> <!-- Floyd Fulkerson --> <div class="border-t border-b p-1"> <div class="font-bold">Floyd Fulkerson</div> <div class="text-sm flex mt-1"> <div class="mt-1">Vértice fuente:</div> <input id="ford1" type="text" class="w-10 rounded-md border" /> <div class="mt-1 ml-2">Vértice sumidero:</div> <input id="ford2" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1" onclick="actualizarGrafica(fordFulkerson)" > Buscar </button> </div> </div> <div> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="copiarGrafica()" > Copiar gráfica </button> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="restauraGrafica()" > Restaurar gráfica </button> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciaGrafica()" > Vaciar gráfica </button> </div>';
  }
  grafica.tipo = tipo;

  esBipartita = grafica.esBipartita();

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let titulo;

  graficaVis = new vis.Network(contenedor, datos, opciones);

  if (tipo === "grafica") {
    titulo = "Gráfica";
  } else if (tipo === "digrafica") {
    titulo = "Digráfica";
  } else if (tipo === "red") {
    titulo = "Red de transporte";
  }

  header.innerHTML = titulo;

  bipartita.innerHTML =
    "<p>" + titulo + " " + (esBipartita ? "" : "no ") + "bipartita</p>";
};

const agregaVertice = () => {
  // Entradas
  let etiqueta = document.getElementById("etiqueta").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos que el vertice que queremos agregar no exista

  if (grafica.vertices[etiqueta]) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML =
      "<p>El vértice " +
      document.getElementById("etiqueta").value +
      " ya existe</p>";

    return;
  }

  // Agregamos el vertice a la estructura grafica
  grafica.agregarVertice(etiqueta);

  // Agregagamos el vertice a la grafica visual
  vertices.add({
    id: idVertice,
    label: etiqueta,
    group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
  });

  // Asignamos la particion
  esBipartita = grafica.esBipartita();
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
  if (!esBipartita) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Actualizamos la grafica
  vertices.update(vertices.get());

  idVertice += 1;
  grafica.numVertices += 1;

  // Imprimimimos si la grafica es o no es bipartita
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Imprimimos la leyenda
  leyenda.innerHTML = esBipartita
    ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
    : "";

  // Actualizamos el numero de vertices en la pagina
  numVertices.innerHTML = grafica.numVertices;

  busquedaAncho(grafica);
  grafica.pintarAristas();
  grafica.pintarVertices();
};

const agregaArista = () => {
  // Entradas
  let etiqueta = document.getElementById("arista").value;
  let peso = document.getElementById("peso").value;
  let etiquetaVertice1 = document.getElementById("de").value;
  let etiquetaVertice2 = document.getElementById("a").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos que los vertices en los que se quiere agregar la arista existen
  if (!grafica.vertices[etiquetaVertice1]) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>El vértice " + etiquetaVertice1 + " no existe</p>";

    return;
  } else if (!grafica.vertices[etiquetaVertice2]) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>El vértice " + etiquetaVertice2 + " no existe</p>";

    return;
  }

  // Checamos que la arista que se quiere agregar no exista
  if (grafica.buscaArista(etiqueta)) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>La arista " + etiqueta + " ya existe</p>";
    return;
  }

  let v1, v2;

  // Obtenemos los vertices de la grafica visual
  v1 = vertices.get({
    filter: (item) => {
      return item.label == etiquetaVertice1;
    },
  })[0];

  v2 = vertices.get({
    filter: (item) => {
      return item.label == etiquetaVertice2;
    },
  })[0];

  // Si es un lazo aumentamos el numero de lazos
  if (v1.label == v2.label) {
    if (!grafica.lazos[v1.label]) grafica.lazos[v1.label] = 0;
    grafica.lazos[v1.label] += 1;
  }

  // Agregamos la arista a la estructura grafica
  grafica.agregarArista(v1.label, v2.label, peso, etiqueta);

  // Agregamos la arista a la grafica visual

  if (tipo != "red") {
    aristas.add([
      {
        id: idArista,
        label: peso,
        from: v1.id,
        to: v2.id,
        arrows: {
          to: {
            enabled: tipo == "grafica" ? false : true,
          },
        },

        title: etiqueta,
        color: "#6762cc",
      },
    ]);
  } else {
    aristas.add([
      {
        id: idArista,
        label: "[0, " + peso + "]",
        from: v1.id,
        to: v2.id,
        arrows: {
          to: {
            enabled: tipo == "grafica" ? false : true,
          },
        },

        title: etiqueta,
        color: "#6762cc",
      },
    ]);
  }

  // Actualizamos el conjunto al que pertenece cada vertice
  esBipartita = grafica.esBipartita();
  v1.group = grafica.vertices[v1.label].conjunto == 1 ? "a" : "b";
  v2.group = grafica.vertices[v2.label].conjunto == 1 ? "a" : "b";

  // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
  if (!esBipartita) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Actualizamos la grafica
  vertices.update(vertices.get());

  idArista += 1;

  // Imprimimimos si la grafica es o no es bipartita
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Imprimimos la leyenda
  leyenda.innerHTML = esBipartita
    ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
    : "";

  // Actualizamos el numero de aristas en la pagina
  numAristas.innerHTML = "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const eliminaVertice = () => {
  // Entradas
  let etiqueta = document.getElementById("eliminar").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos que el vertice que queremos eliminar existe
  if (!grafica.vertices[etiqueta]) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>El vértice " + etiqueta + " no existe</p>";

    return;
  }

  // Obtenemos el vertice en la grafica visual
  let vertice = vertices.get({
    filter: (item) => {
      return item.label == etiqueta;
    },
  })[0];

  grafica.numVertices -= 1;

  // Eliminamos el vertice de la estructura grafica
  grafica.eliminarVertice(vertice.label);

  // Eliminamos el vertice de la grafica visual
  vertices.remove({
    id: vertice.id,
  });

  // Eliminamos las aristas que inciden en el vertice de la grafica visual
  aristas.remove(
    aristas.get().filter((i) => {
      return i.from == vertice.id || i.to == vertice.id;
    })
  );

  // Asignamos la particion
  esBipartita = grafica.esBipartita();
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
  if (!esBipartita) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Actualizamos la grafica
  vertices.update(vertices.get());

  // Imprimimimos si la grafica es o no es bipartita
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Imprimimos la leyenda
  leyenda.innerHTML = esBipartita
    ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
    : "";

  // Actualizamos el numero de vertices y aristas en la pagina
  numVertices.innerHTML = "<p>" + grafica.numVertices + "</p>";
  numAristas.innerHTML = "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const eliminaArista = () => {
  // Entradas
  let etiqueta = document.getElementById("eliminarArista").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos que la arista que se quiere eliminar exista
  if (!grafica.buscaArista(etiqueta)) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>La arista " + etiqueta + " no existe</p>";

    return;
  }

  // Obtenemos la arista en la grafica visual
  let arista = aristas.get({
    filter: (item) => {
      return item.title == etiqueta;
    },
  })[0];

  // Obtenemos los vertices en la grafica visual
  v1 = vertices.get({
    filter: (item) => {
      return item.id == arista.from;
    },
  })[0];

  v2 = vertices.get({
    filter: (item) => {
      return item.id == arista.to;
    },
  })[0];

  // Si es un lazo disminuimos el numero de lazos
  if (v1.label == v2.label) {
    grafica.lazos[v1.label] -= 1;
    if (!grafica.lazos[v1.label] == 0) delete grafica.lazos[v1.label];
  }

  // Eliminamos la arista de la estructura grafica
  grafica.eliminarArista(arista.title);

  // Eliminamos la arista de la grafica visual
  aristas.remove({ id: arista.id });

  // Asignamos la particion
  esBipartita = grafica.esBipartita();
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
  if (!esBipartita) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Actualizamos la grafica
  vertices.update(vertices.get());

  // Imprimimimos si la grafica es o no es bipartita
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Imprimimos la leyenda
  leyenda.innerHTML = esBipartita
    ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
    : "";

  // Actualizamos el numero de aristas en la pagina
  numAristas.innerHTML = "<p>" + grafica.numAristas + "</p>";

  grafica.pintarVertices();
  grafica.pintarAristas();
};

const buscaVertice = () => {
  // Entradas
  let etiqueta = document.getElementById("buscarVertice").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Imprimimos si el vertice existe o no existe
  if (grafica.buscaVertice(etiqueta)) {
    mensaje.classList.add("text-green-500");
    mensaje.innerHTML = "<p> El vértice " + etiqueta + " existe</p>";
  } else {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p> El vértice " + etiqueta + " no existe</p>";
  }
};

const buscaArista = () => {
  // Entradas
  let etiqueta = document.getElementById("buscarArista").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Imprimimos si la arista existe o no existe
  if (grafica.buscaArista(etiqueta)) {
    mensaje.classList.add("text-green-500");
    mensaje.innerHTML = "<p> La arista " + etiqueta + " existe</p>";
  } else {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p> La arista " + etiqueta + " no existe</p>";
  }
};

const gradoVertice = () => {
  // Entradas
  let etiqueta = document.getElementById("gradoVertice").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos que el vertice existe
  if (!grafica.buscaVertice(etiqueta)) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>El vértice " + etiqueta + " no existe</p>";

    return;
  }

  // Imprimimos el grado del vertice
  mensaje.innerHTML =
    "<p>El grado del vértice " +
    etiqueta +
    " es: " +
    grafica.gradoVertice(etiqueta) +
    " </p>";
};

const vaciarVertice = () => {
  // Entradas
  let etiqueta = document.getElementById("vaciarVertice").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos si el vertice que queremos vaciar existe
  if (!grafica.buscaVertice(etiqueta)) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>El vértice " + etiqueta + " no existe</p>";

    return;
  }

  // Vaciamos el vertice en la grafica visual
  grafica.aristas[etiqueta].map((arista) => {
    arista = aristas.get({
      filter: (item) => {
        return item.title == arista.etiqueta;
      },
    })[0];

    if (arista) {
      aristas.remove({ id: arista.id });
    }
  });

  // Vaciamos el vertice en la estructura grafica
  grafica.vaciaVertice(etiqueta);

  // Asignamos la particion
  esBipartita = grafica.esBipartita();
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
  if (!esBipartita) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Actualizamos la grafica
  vertices.update(vertices.get());

  // Imprimimos si la grafica es bipartita o no
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Imprimimos la leyenda
  leyenda.innerHTML = esBipartita
    ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
    : "";

  // Actualizamos el numero de aristas
  numAristas.innerHTML = "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const vaciaGrafica = () => {
  vertices = new vis.DataSet([]);
  aristas = new vis.DataSet([]);
  let contenedor = document.getElementById("grafica");

  let datos = {
    nodes: vertices,
    edges: aristas,
  };

  graficaVis = new vis.Network(contenedor, datos, opciones);
  grafica = new Grafica();

  // Imprimimos si la grafica es bipartita o no
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Imprimimos la leyenda
  leyenda.innerHTML = esBipartita
    ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
    : "";

  // Actualizamos el numero de vertices ya aristas en la grafica
  numVertices.innerHTML = "<p>" + grafica.numVertices + "</p>";
  numAristas.innerHTML = "<p>" + grafica.numAristas + "</p>";
};

const copiarGrafica = () => {
  graficaCopia = _.cloneDeep(grafica);

  aristasCopia = new vis.DataSet();
  verticesCopia = new vis.DataSet();

  aristasCopia.add(aristas.get());
  verticesCopia.add(vertices.get());
};

const restauraGrafica = () => {
  if (!graficaCopia) {
    console.log("No hay una copia guardada");
    return;
  }

  vertices = verticesCopia;
  aristas = aristasCopia;

  let datos = {
    nodes: vertices,
    edges: aristas,
  };

  graficaVis = new vis.Network(contenedor, datos, opciones);

  grafica = graficaCopia;

  grafica.pintarAristas();

  // Imprimimos si la grafica es bipartita o no
  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

  // Actualizamos el numero de vertices y aristas
  numVertices.innerHTML = "<p>" + grafica.numVertices + "</p>";
  numAristas.innerHTML = "<p>" + grafica.numAristas + "</p>";
};

const encuentraPaseo = () => {
  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  let salida = algoritmoFleury(grafica);

  if (!salida) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>La gráfica no tiene paseo de Euler</p>";
  } else {
    mensaje.classList.add("text-green-500");
    mensaje.innerHTML = "<p>Paseo de Euler: {" + salida + "}</p>";
  }
};

const pintarArbol = (algoritmo) => {
  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // let aristasMarcadas;
  // aristasMarcadas = algoritmo(grafica);

  let arbol = algoritmo(grafica);

  console.log(arbol);

  /// Pintamos el borde de los vertices
  vertices.get().map((i) => {
    if (arbol.vertices.includes(i.label)) i.group = "d";
  });

  vertices.update(vertices.get());

  // Pintamos el borde de las aristas
  aristas.get().map((i) => {
    if (arbol.aristas.includes(i.title)) i.color = "#ff0000";
  });

  aristas.update(aristas.get());
};

const crearGrafica = (algoritmo) => {
  let listas = algoritmo(inputPrufer.value);
  let verticesAlg = listas[0],
    aristasAlg = listas[1],
    ids = {};

  for (let i = 0; i < verticesAlg.length; i++) {
    vertices.add({
      id: idVertice,
      label: verticesAlg[i],
      group: "c",
    });
    ids[verticesAlg[i]] = idVertice;
    idVertice++;
  }

  for (let i = 0; i < aristasAlg.length; i++) {
    aristas.add([
      {
        id: idArista,
        label: aristasAlg[i].peso,
        from: ids[aristasAlg[i].v1],
        to: ids[aristasAlg[i].v2],
        title: aristasAlg[i].etiqueta,
        color: "#6762cc",
      },
    ]);
    idArista++;
  }
};

actualizarGrafica = (algoritmo) => {
  let datos = algoritmo(grafica);

  for (i in datos.objetoAristas) {
    // Si es un lazo disminuimos el numero de lazos
    if (datos.objetoAristas[i].fuente == datos.objetoAristas[i].sumidero) {
      grafica.lazos[datos.objetoAristas[i].fuente] -= 1;
      if (!grafica.lazos[datos.objetoAristas[i].fuente] == 0)
        delete grafica.lazos[datos.objetoAristas[i].fuente];
    }

    // Eliminamos la arista de la estructura grafica
    grafica.eliminarArista(datos.objetoAristas[i].etiqueta);
    grafica.agregarArista(
      datos.objetoAristas[i].fuente,
      datos.objetoAristas[i].sumidero,
      datos.objetoAristas[i].flujoMax,
      datos.objetoAristas[i].etiqueta,
      datos.objetoAristas[i].flujo
    );
  }
  aristas.get().map((i) => {
    i.label =
      "[" +
      datos.objetoAristas[i.title].flujo +
      ", " +
      datos.objetoAristas[i.title].flujoMax +
      "]";
  });

  aristas.update(aristas.get());

  let mensaje = document.getElementById("mensaje");

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  mensaje.classList.add("text-green-500");
  mensaje.innerHTML = "<p>Flujo maximo: " + datos.flujoMax;
};
