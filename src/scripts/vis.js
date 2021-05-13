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
      '<div class="border-t border-b p-1"> <div class="font-bold">Graficar Archivo</div> <div class="text-sm flex space-x-1 mt-1"> <input id="archivo" type="file" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="graficarArchivo1()" > Graficar </button> </div> </div> <div class="border-t border-b p-1"> <div class="font-bold">Agregar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaVG1" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaVertice1()" > Agregar </button> </div> </div> <!-- Agregar arista input --> <div class="border-t border-b p-1"> <div class="font-bold">Agregar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaAG1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">de:</div> <input id="agregaAG2" type="text" class="w-10 rounded-md border" /> <div class="mt-1">a:</div> <input id="agregaAG3" type="text" class="w-10 rounded-md border" /> <div class="mt-1">w:</div> <input id="agregaAG4" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaArista1()" > Agregar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Eliminar vertice --> <div> <div class="font-bold">Eliminar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaVG1" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaVertice1()" > Eliminar </button> </div> </div> <!-- Eliminar arista --> <div class="border-l px-1"> <div class="font-bold">Eliminar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaAG1" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaArista1()" > Eliminar </button> </div> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Buscar vertice --> <div> <div class="font-bold">Buscar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="buscarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="buscaVertice1()" > Buscar </button> </div> </div> <!-- Buscar arista --> <div class="border-l px-1"> <div class="font-bold">Buscar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="buscarArista" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="buscaArista()" > Buscar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Grado vertice --> <div> <div class="font-bold">Paseo de Euler</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="encuentraPaseo()" > Buscar </button> </div> </div> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciarVertice1()" > Vaciar </button> </div> </div> </div> <!-- Arboles de expansion  --> <!-- Ancho --> <div class="flex border-t border-b p-1 space-x-1"> <div> <div class="font-bold">Búsqueda a lo ancho</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(busquedaAncho)" > Buscar </button> </div> </div> <!-- Produndo --> <div class="border-l px-1"> <div class="font-bold">Búsqueda a lo profundo</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(busquedaProfundidad)" > Buscar </button> </div> </div> <!-- Kruskal --> <div class="border-l px-1"> <div class="font-bold">Kruskal</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(kruskal)" > Buscar </button> </div> </div> <!-- Prim --> <div class="border-l px-1"> <div class="font-bold">Prim</div> <div class="text-sm flex space-x-1 mt-1 justify-center"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(prim)" > Buscar </button> </div> </div> </div> <div> <div class="flex border-b p-1 space-x-1"> <!-- Prufer --> <div class="px-1"> <div class="font-bold">Prufer</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Secuencia:</div> <input id="prufer" type="text" class="w-20 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="crearGrafica(prufer)" > dibujar </button> </div> </div> </div> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="copiarGrafica()" > Copiar gráfica </button> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="restauraGrafica()" > Restaurar gráfica </button> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciaGrafica()" > Vaciar gráfica </button> </div>';
    inputPrufer = document.getElementById("prufer");
  } else if (document.getElementById("tipo2").checked) {
    tipo = document.getElementById("tipo2").value;
    menu.innerHTML =
      '<div class="border-t border-b p-1"> <div class="font-bold">Graficar Archivo</div> <div class="text-sm flex space-x-1 mt-1"> <input id="archivo" type="file" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="graficarArchivo1()" > Graficar </button> </div> </div> <div class="border-t border-b p-1"> <div class="font-bold">Agregar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaVG1" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaVertice1()" > Agregar </button> </div> </div> <!-- Agregar arista input --> <div class="border-t border-b p-1"> <div class="font-bold">Agregar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaAG1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">de:</div> <input id="agregaAG2" type="text" class="w-10 rounded-md border" /> <div class="mt-1">a:</div> <input id="agregaAG3" type="text" class="w-10 rounded-md border" /> <div class="mt-1">w:</div> <input id="agregaAG4" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaArista1()" > Agregar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Eliminar vertice --> <div> <div class="font-bold">Eliminar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaVG1" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaVertice1()" > Eliminar </button> </div> </div> <!-- Eliminar arista --> <div class="border-l px-1"> <div class="font-bold">Eliminar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaAG1" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaArista1()" > Eliminar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciarVertice1()" > Vaciar </button> </div> </div> </div> <!-- Dijkstra --> <div class="border-t border-b p-1"> <div class="font-bold">Dijkstra</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Vértice inicial:</div> <input id="dijkstra" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(dijkstra)" > Buscar </button> </div> </div> <!-- Floyd --> <div class="border-t border-b p-1"> <div class="font-bold">Floyd</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Vértice inicial:</div> <input id="inicioFloyd" type="text" class="w-10 rounded-md border" /> <input id="destinoFloyd" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="pintarArbol(floyd)" > Buscar </button> </div> </div> <div> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="copiarGrafica()" > Copiar gráfica </button> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="restauraGrafica()" > Restaurar gráfica </button> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciaGrafica()" > Vaciar gráfica </button> </div>';
  } else if (document.getElementById("tipo3").checked) {
    tipo = document.getElementById("tipo3").value;
    menu.innerHTML =
      '<div class="border-t border-b p-1"> <div class="font-bold">Graficar Archivo</div> <div class="text-sm flex space-x-1 mt-1"> <input id="archivo2" type="file" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="graficarArchivo2()" > Graficar </button> </div> </div> <div class="border-t border-b p-1"> <div class="font-bold">Agregar vértice</div> <div class="text-sm flex space-x-2 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaVR1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Flujo Minimo:</div> <input id="agregaVR2" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Flujo Maximo:</div> <input id="agregaVR3" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaVertice2()" > Agregar </button> </div> </div> <!-- Agregar arista input --> <div class="border-t border-b p-1"> <div class="font-bold">Agregar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="agregaAR1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">de:</div> <input id="agregaAR2" type="text" class="w-10 rounded-md border" /> <div class="mt-1">a:</div> <input id="agregaAR3" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Flujo minimo:</div> <input id="agregaAR4" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Capacidad:</div> <input id="agregaAR5" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="agregaArista2()" > Agregar </button> </div> </div> <div class="border-t border-b p-1 flex space-x-1"> <!-- Eliminar vertice --> <div> <div class="font-bold">Eliminar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaVR1" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaVertice2()" > Eliminar </button> </div> </div> <!-- Eliminar arista --> <div class="border-l px-1"> <div class="font-bold">Eliminar arista</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="eliminaAR1" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="eliminaArista2()" > Eliminar </button> </div> </div> </div> <div class="flex border-t border-b p-1 space-x-1"> <!-- Vaciar vertice --> <div class="border-l px-1"> <div class="font-bold">Vaciar vértice</div> <div class="text-sm flex space-x-1 mt-1"> <div class="mt-1">Etiqueta:</div> <input id="vaciarVertice" type="text" class="w-10 rounded-md border" /> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciarVertice1()" > Vaciar </button> </div> </div> </div> <!-- Ford Fulkerson --> <div class="border-t border-b p-1"> <div class="font-bold">Ford Fulkerson</div> <div class="text-sm flex mt-1"> <div class="mt-1">Fuente(s):</div> <input id="ford1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Sumidero(s):</div> <input id="ford2" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1" onclick="actualizarGrafica(fordFulkerson)" > Buscar </button> </div> </div> <!-- primal --> <div class="border-t border-b p-1"> <div class="font-bold">Primal</div> <div class="text-sm flex mt-1"> <div class="mt-1">Fuente(s):</div> <input id="primal1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Sumidero(s):</div> <input id="primal2" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Flujo deseado:</div> <input id="primal3" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1" onclick="actualizarGrafica(primal)" > Buscar </button> </div> </div> <!-- dual --> <div class="border-t border-b p-1"> <div class="font-bold">Dual</div> <div class="text-sm flex mt-1"> <div class="mt-1">Fuente(s):</div> <input id="dual1" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Sumidero(s):</div> <input id="dual2" type="text" class="w-10 rounded-md border" /> <div class="mt-1">Flujo deseado:</div> <input id="dual3" type="text" class="w-10 rounded-md border" /> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1" onclick="actualizarGrafica(dual)" > Buscar </button> </div> </div> <!-- simplex --> <div class="border-t border-b p-1"> <div class="font-bold">Simplex</div> <div class="text-sm flex mt-1"> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none ml-1" onclick="pintarArbol(simplex)" > Buscar </button> </div> </div> <div> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="copiarGrafica()" > Copiar gráfica </button> <button class="bg-blue-500 rounded-md px-2 py-1 text-white hover:bg-blue-600 focus:outline-none" onclick="restauraGrafica()" > Restaurar gráfica </button> <button class="bg-red-500 rounded-md px-2 py-1 text-white hover:bg-red-600 focus:outline-none" onclick="vaciaGrafica()" > Vaciar gráfica </button> </div>';
  }
  grafica.tipo = tipo;

  esBipartita = grafica.esBipartita();

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let titulo;

  opciones.nodes = tipo == "red" ? { shape: "dot" } : { shape: "ellipse" };
  graficaVis = new vis.Network(contenedor, datos, opciones);

  if (tipo === "grafica") titulo = "Gráfica";
  else if (tipo === "digrafica") titulo = "Digráfica";
  else if (tipo === "red") titulo = "Red de transporte";

  header.innerHTML = titulo;

  bipartita.innerHTML =
    "<p>" + titulo + " " + (esBipartita ? "" : "no ") + "bipartita</p>";
};

const graficarArchivo = () => {
  let archivo = "../" + document.getElementById("archivo").files[0].name;

  console.log(archivo);

  let request = new XMLHttpRequest();

  request.open("GET", archivo, true);

  request.send(null);

  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      let type = request.getResponseHeader("Content-Type");
      try {
        graficaArchivo(JSON.parse(request.responseText));
      } catch (err) {
        console.log(err);
      }
    }
  };

  let graficaArchivo = (datos) => {
    console.log(datos.aristas);
    if (datos.vertices) {
      for (let i in datos.vertices) {
        let etiqueta = datos.vertices[i].etiqueta;
        grafica.agregarVertice(etiqueta);

        vertices.add({
          id: idVertice,
          label: etiqueta,
          group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
        });

        let esBipartita = grafica.esBipartita();

        vertices.get().map((i) => {
          i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
        });

        // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
        if (!esBipartita) {
          vertices.get().map((i) => {
            i.group = "c";
          });
        }

        idVertice += 1;
        grafica.numVertices += 1;
      }

      for (let i in datos.aristas) {
        let v1 = vertices.get({
          filter: (item) => {
            return item.label == datos.aristas[i].v1;
          },
        })[0];

        let v2 = vertices.get({
          filter: (item) => {
            return item.label == datos.aristas[i].v2;
          },
        })[0];

        if (datos.aristas[i].v1 == datos.aristas[i].v2) {
          if (!grafica.lazos[datos.aristas[i].v1])
            grafica.lazos[datos.aristas[i].v1] = 0;
          grafica.lazos[datos.aristas[i].v1] += 1;
        }

        grafica.agregarArista(
          datos.aristas[i].v1,
          datos.aristas[i].v2,
          peso,
          etiqueta
        );

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

        esBipartita = grafica.esBipartita();
        v1.group =
          grafica.vertices[datos.aristas[i].v1].conjunto == 1 ? "a" : "b";
        v2.group =
          grafica.vertices[datos.aristas[i].v2].conjunto == 1 ? "a" : "b";

        // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
        if (!esBipartita) {
          vertices.get().map((i) => {
            i.group = "c";
          });
        }
      }

      vertices.update(vertices.get());

      // Imprimimimos si la grafica es o no es bipartita
      bipartita.innerHTML =
        "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

      // Imprimimos la leyenda
      leyenda.innerHTML = esBipartita
        ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
        : "";

      // Actualizamos el numero de vertices en la pagina
      numVertices.innerHTML = grafica.numVertices;
      // Actualizamos el numero de vertices en la pagina
      numAristas.innerHTML = grafica.numAristas;
    }
  };
};

const agregaVertice1 = () => {
  // Entradas
  let etiqueta = document.getElementById("agregaVG1").value;

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

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const agregaArista1 = () => {
  // Entradas
  let etiqueta = document.getElementById("agregaAG1").value;
  let etiquetaVertice1 = document.getElementById("agregaAG2").value;
  let etiquetaVertice2 = document.getElementById("agregaAG3").value;
  let peso = document.getElementById("agregaAG4").value;

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
  if (etiquetaVertice1 == etiquetaVertice2) {
    if (!grafica.lazos[etiquetaVertice1]) grafica.lazos[etiquetaVertice1] = 0;
    grafica.lazos[etiquetaVertice1] += 1;
  }

  // Agregamos la arista a la estructura grafica
  grafica.agregarArista(etiquetaVertice1, etiquetaVertice2, peso, etiqueta);

  // Agregamos la arista a la grafica visual
  aristas.add([
    {
      id: idArista,
      label: peso,
      from: v1.id,
      to: v2.id,
      title: etiqueta,
      color: "#6762cc",
      arrows: {
        to: {
          enabled: tipo == "grafica" ? false : true,
        },
      },
    },
  ]);

  // Actualizamos el conjunto al que pertenece cada vertice
  esBipartita = grafica.esBipartita();
  v1.group = grafica.vertices[etiquetaVertice1].conjunto == 1 ? "a" : "b";
  v2.group = grafica.vertices[etiquetaVertice2].conjunto == 1 ? "a" : "b";

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

const eliminaVertice1 = () => {
  // Entradas
  let etiqueta = document.getElementById("eliminaVG1").value;

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

const eliminaArista1 = () => {
  // Entradas
  let etiqueta = document.getElementById("eliminaAG1").value;

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
  if (tipo == "red")
    vertices.get().map((i) => {
      i.group = grafica.vertices[i.label.split("\n")[0]].conjunto ? "a" : "b";
    });
  else
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

const vaciarVertice1 = () => {
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
  if (tipo == "red")
    vertices.get().map((i) => {
      i.group = grafica.vertices[i.label.split("\n")[0]].conjunto ? "a" : "b";
    });
  else
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

  if (arbol.objetoAristas != undefined) {
    for (i in arbol.objetoAristas) {
      let arista = arbol.objetoAristas[i];
      // Si es un lazo disminuimos el numero de lazos
      if (arista.fuente == arista.sumidero) {
        grafica.lazos[arista.fuente] -= 1;
        if (!grafica.lazos[arista.fuente] == 0)
          delete grafica.lazos[arista.fuente];
      }
      grafica.editarArista(
        i,
        arista.peso,
        arista.flujoMin,
        arista.flujo,
        arista.flujoMax
      );
    }

    aristas.get().map((i) => {
      i.label =
        "[" +
        (arbol.objetoAristas[i.title].flujoMin
          ? arbol.objetoAristas[i.title].flujoMin
          : 0) +
        ", " +
        (arbol.objetoAristas[i.title].flujoMax
          ? arbol.objetoAristas[i.title].flujoMax != Infinity
            ? arbol.objetoAristas[i.title].flujoMax
            : "∞"
          : 0) +
        ", $" +
        arbol.objetoAristas[i.title].costo +
        "]\n" +
        arbol.objetoAristas[i.title].peso;
    });

    aristas.update(aristas.get());
  }

  aristas.update(aristas.get());

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  mensaje.classList.add("text-green-500");
  mensaje.innerHTML = arbol.msj;
};

const actualizarGrafica = (algoritmo) => {
  let datos = algoritmo(grafica);

  if (datos.objetoAristas == undefined) return;

  for (i in datos.objetoAristas) {
    let arista = datos.objetoAristas[i];
    // Si es un lazo disminuimos el numero de lazos
    if (arista.fuente == arista.sumidero) {
      grafica.lazos[arista.fuente] -= 1;
      if (!grafica.lazos[arista.fuente] == 0)
        delete grafica.lazos[arista.fuente];
    }
    grafica.editarArista(
      i,
      arista.peso,
      arista.flujoMin,
      arista.flujo,
      arista.flujoMax
    );
  }

  aristas.get().map((i) => {
    i.label =
      "[" +
      (datos.objetoAristas[i.title].flujoMin == undefined
        ? ""
        : datos.objetoAristas[i.title].flujoMin + ", ") +
      datos.objetoAristas[i.title].flujo +
      ", " +
      datos.objetoAristas[i.title].flujoMax +
      "]" +
      (datos.costo ? "\n$" + datos.objetoAristas[i.title].costo : "");
  });

  aristas.update(aristas.get());

  let mensaje = document.getElementById("mensaje");

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  mensaje.classList.add("text-green-500");
  mensaje.innerHTML = datos.msj;
};
