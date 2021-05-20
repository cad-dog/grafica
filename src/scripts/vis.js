let vertices,
  tipo,
  aristas,
  aristasPintadas,
  verticesPintados,
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
      d: { color: { border: "#ff499b" } }, // borde rojo
      e: { color: "#ff499b" },
    },
    nodes: {
      font: {
        color: tipo == "red" ? "#ffffff" : "#000000",
      },
    },
    edges: {
      color: { color: "#ff9900" },
    },
  },
  opcionesCopia;

let grafica = new Grafica();

// Elementos html
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

  if (tipo != "red") {
    opciones["nodes"]["font"] = { color: "#000000" };
  } else {
    opciones["nodes"]["font"] = { color: "#ffffff" };
  }

  grafica.tipo = tipo;

  esBipartita = grafica.esBipartita();

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let titulo;

  opciones["nodes"]["shape"] = tipo == "red" ? "dot" : "ellipse";
  graficaVis = new vis.Network(contenedor, datos, opciones);

  if (tipo === "grafica") titulo = "Gráfica";
  else if (tipo === "digrafica") titulo = "Digráfica";
  else if (tipo === "red") titulo = "Red de transporte";

  // header.innerHTML = titulo;

  bipartita.innerHTML =
    "<p>" + titulo + " " + (esBipartita ? "" : "no ") + "bipartita</p>";
};

const graficarArchivo = () => {
  cerrarModal();

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
      if (tipo == "grafica")
        bipartita.innerHTML =
          "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";
      else if (tipo == "digrafica")
        bipartita.innerHTML =
          "<p>Digráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";

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
  cerrarModal();

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

  console.log(grafica);

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const agregaArista1 = () => {
  cerrarModal();

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
  console.log(etiquetaVertice1, etiquetaVertice2);
  grafica.agregarArista(etiqueta, etiquetaVertice1, etiquetaVertice2, peso);

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
  cerrarModal();

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
  cerrarModal();

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
  cerrarModal();

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
  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  bipartita.innerHTML = "";

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
  aristasCopia = _.cloneDeep(aristas);
  verticesCopia = _.cloneDeep(vertices);
  opcionesCopia = _.cloneDeep(opciones);
};

const restauraGrafica = () => {
  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  if (!graficaCopia) {
    console.log("No hay una copia guardada");
    return;
  }

  vertices = _.cloneDeep(verticesCopia);
  aristas = _.cloneDeep(aristasCopia);

  let datos = {
    nodes: vertices,
    edges: aristas,
  };

  // Si la grafica no es bipartita ponemos todos los vertices en el mismo conjunto
  if (!esBipartita) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Actualizamos la grafica
  vertices.update(vertices.get());

  graficaVis = new vis.Network(contenedor, datos, opciones);

  grafica = _.cloneDeep(graficaCopia);

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

  let arbol = algoritmo(grafica);

  console.log(arbol);

  // Pintamos el borde de los vertices
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

  if (arbol.msj.color == undefined) arbol.msj.color = "text-green-500";

  mensaje.classList.add(arbol.msj.color);
  mensaje.innerHTML = arbol.msj.text;
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
  // mensaje.innerHTML = "";
  // mensaje.classList.remove("text-red-500", "text-green-500");

  // mensaje.classList.add(datos["msj"]["color"]);
  // mensaje.innerHTML = datos["msj"]["text"];
};

const vaciarMensaje = () => {
  mensaje.classList.remove("text-red-500", "text-green-500");
  mensaje.innerHTML = "";
};

const imprimirMensaje = (msj, color) => {
  if (color == undefined) color = "text-green-500";
  mensaje.classList.add(color);
  mensaje.innerHTML = msj;
};
