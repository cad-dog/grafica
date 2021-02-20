let vertices,
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
let mensaje = document.getElementById("mensaje");
let contenedor = document.getElementById("grafica");
let bipartita = document.getElementById("bipartita");
let numVertices = document.getElementById("numVertices");
let numAristas = document.getElementById("numAristas");
let leyenda = document.getElementById("leyenda");

const graficar = () => {
  vertices = new vis.DataSet([]);
  aristas = new vis.DataSet([]);

  esBipartita = grafica.esBipartita();

  let datos = {
    nodes: vertices,
    edges: aristas,
  };

  graficaVis = new vis.Network(contenedor, datos, opciones);

  bipartita.innerHTML =
    "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";
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
  aristas.add([
    {
      id: idArista,
      label: peso,
      from: v1.id,
      to: v2.id,
      title: etiqueta,
      color: "#6762cc",
    },
  ]);

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

  // kruskal(grafica);
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

  let aristasMarcadas;
  aristasMarcadas = algoritmo(grafica);

  /// Pintamos el borde de los vertices
  vertices.get().map((i) => {
    i.group = "d";
  });

  vertices.update(vertices.get());

  // Pintamos el borde de las aristas
  aristas.get().map((i) => {
    if (aristasMarcadas.includes(i.title)) i.color = "#ff0000";
  });

  aristas.update(aristas.get());
};
