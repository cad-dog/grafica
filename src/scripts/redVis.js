const graficarArchivo2 = () => {
  cerrarModal();

  let archivo = "../" + document.getElementById("archivo2").files[0].name;

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
    if (datos.vertices) {
      for (let i in datos.vertices) {
        let etiqueta = datos.vertices[i].etiqueta;

        grafica.agregarVertice(
          etiqueta,
          datos.vertices[i].flujoMin,
          datos.vertices[i].flujoMax,
          datos.vertices[i].valor
        );

        if (datos.estilo == "simplex") {
          vertices.add({
            id: idVertice,
            label: etiqueta + "\n" + datos.vertices[i].valor,
            group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
            flujoMin: undefined,
            flujoMax: undefined,
            valor: datos.vertices[i].valor,
          });
        } else {
          vertices.add({
            id: idVertice,
            label:
              etiqueta +
              "\n(" +
              (datos.vertices[i].flujoMin != undefined
                ? datos.vertices[i].flujoMin
                : "0") +
              ", " +
              (datos.vertices[i].flujoMax != undefined ||
              datos.vertices[i].flujoMax == "Infinity"
                ? datos.vertices[i].flujoMax
                : "∞") +
              ")",
            group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
            flujoMin: datos.vertices[i].flujoMin,
            flujoMax: datos.vertices[i].flujoMax,
          });
        }
        let esBipartita = grafica.esBipartita();

        vertices.get().map((i) => {
          i.group = grafica.vertices[i.label.split("\n")[0]].conjunto
            ? "a"
            : "b";
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
            return item.label.split("\n")[0] == datos.aristas[i].v1;
          },
        })[0];

        let v2 = vertices.get({
          filter: (item) => {
            return item.label.split("\n")[0] == datos.aristas[i].v2;
          },
        })[0];

        if (datos.aristas[i].v1 == datos.aristas[i].v2) {
          if (!grafica.lazos[datos.aristas[i].v1])
            grafica.lazos[datos.aristas[i].v1] = 0;
          grafica.lazos[datos.aristas[i].v1] += 1;
        }

        grafica.agregarArista(
          datos.aristas[i].etiqueta,
          datos.aristas[i].v1,
          datos.aristas[i].v2,
          datos.aristas[i].peso,
          datos.aristas[i].flujoMin,
          datos.aristas[i].flujo,
          datos.aristas[i].flujoMax,
          datos.aristas[i].costo
        );

        if (datos.estilo == "simplex") {
          aristas.add([
            {
              id: idArista,
              label:
                "[" +
                (datos.aristas[i].flujoMin ? datos.aristas[i].flujoMin : 0) +
                ", " +
                (datos.aristas[i].flujoMax ? datos.aristas[i].flujoMax : 0) +
                ", $" +
                datos.aristas[i].costo +
                "]\n" +
                datos.aristas[i].peso,
              from: v1.id,
              to: v2.id,
              arrows: {
                to: {
                  enabled: true,
                },
              },
              title: datos.aristas[i].etiqueta,
              color: "#6762cc",
            },
          ]);
        } else {
          aristas.add([
            {
              id: idArista,
              label:
                "[" +
                (datos.aristas[i].flujoMin ? datos.aristas[i].flujoMin : "0") +
                ", 0, " +
                datos.aristas[i].flujoMax +
                "]" +
                (datos.aristas[i].costo != undefined
                  ? "\n$" + datos.aristas[i].costo
                  : ""),
              from: v1.id,
              to: v2.id,
              arrows: {
                to: {
                  enabled: true,
                },
              },
              title: datos.aristas[i].etiqueta,
              color: "#6762cc",
            },
          ]);
        }

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

        idArista++;
      }

      console.log(grafica.aristas);
      console.log(grafica.vertices);

      console.log(aristas.get());

      aristas.update(aristas.get());
      vertices.update(vertices.get());

      // Imprimimimos si la grafica es o no es bipartita
      bipartita.innerHTML =
        "<p>Red de transporte " + (esBipartita ? "" : "no ") + "bipartita</p>";

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

const agregaVertice2 = () => {
  cerrarModal();

  // Entradas
  let etiqueta = document.getElementById("agregaVR1").value;
  let flujoMin = document.getElementById("agregaVR2").value;
  let flujoMax = document.getElementById("agregaVR3").value;
  let valor = document.getElementById("agregaVR4").value;

  let estilo;

  if (valor == "") estilo = "flujo";
  else estilo = "simplex";

  if (flujoMin == "") flujoMin = "0";
  if (flujoMax == "") flujoMax = Infinity;
  if (valor == "") valor = "0";

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Checamos que el vertice que queremos agregar no exista
  if (grafica.vertices[etiqueta]) {
    mensaje.classList.add("text-red-500");
    mensaje.innerHTML = "<p>El vértice " + etiqueta + " ya existe</p>";

    return;
  }

  // Agregamos el vertice a la estructura grafica
  grafica.agregarVertice(etiqueta, flujoMin, flujoMax, valor);

  // Agregagamos el vertice a la grafica visual
  if (estilo == "flujo")
    vertices.add({
      id: idVertice,
      label: etiqueta + "\n(" + flujoMin + ", " + flujoMax + ")",
      group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
    });
  else if (estilo == "simplex")
    vertices.add({
      id: idVertice,
      label: etiqueta + "\n" + valor,
      group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
      valor: valor,
    });

  // Asignamos la particion
  esBipartita = grafica.esBipartita();

  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label.split("\n")[0]].conjunto ? "a" : "b";
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

const agregaArista2 = () => {
  cerrarModal();

  // Entradas
  let etiqueta = document.getElementById("agregaAR1").value;
  let etiquetaVertice1 = document.getElementById("agregaAR2").value;
  let etiquetaVertice2 = document.getElementById("agregaAR3").value;
  let flujoMin = document.getElementById("agregaAR4").value;
  let flujoMax = document.getElementById("agregaAR5").value;
  let flujo = document.getElementById("agregaAR6").value;
  let peso = document.getElementById("agregaAR7").value;
  let costo = document.getElementById("agregaAR8").value;

  let estilo;

  if (flujoMin == "") flujoMin = "0";
  if (flujo == "") flujo = "0";
  if (flujoMax == "") flujoMax = Infinity;

  if (peso == "" && costo == "") estilo = "flujo";
  else estilo == "simplex";

  if (peso == "") peso = "0";
  if (costo == "") costo = "0";

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
      return item.label.split("\n")[0] == etiquetaVertice1;
    },
  })[0];

  v2 = vertices.get({
    filter: (item) => {
      return item.label.split("\n")[0] == etiquetaVertice2;
    },
  })[0];

  // Si es un lazo aumentamos el numero de lazos
  if (etiquetaVertice1 == etiquetaVertice2) {
    if (!grafica.lazos[etiquetaVertice1]) grafica.lazos[etiquetaVertice1] = 0;
    grafica.lazos[etiquetaVertice1] += 1;
  }

  // Agregamos la arista a la estructura grafica
  grafica.agregarArista(
    etiqueta,
    etiquetaVertice1,
    etiquetaVertice2,
    peso,
    flujoMin,
    flujo,
    flujoMax,
    costo
  );

  // Agregamos la arista a la grafica visual
  if (estilo == "flujo")
    aristas.add([
      {
        id: idArista,
        label:
          "[" +
          flujoMin +
          ", " +
          flujo +
          ", " +
          (flujoMax == Infinity ? "∞" : flujoMax) +
          "]",
        from: v1.id,
        to: v2.id,
        arrows: {
          to: {
            enabled: true,
          },
        },

        title: etiqueta,
        color: "#6762cc",
      },
    ]);
  else
    aristas.add([
      {
        id: idArista,
        label:
          "[" +
          flujoMin +
          ", " +
          (flujoMax == Infinity ? "∞" : flujoMax) +
          ", $" +
          costo +
          "]\n" +
          datos.aristas[i].peso,
        from: v1.id,
        to: v2.id,
        arrows: {
          to: {
            enabled: true,
          },
        },
        title: datos.aristas[i].etiqueta,
        color: "#6762cc",
      },
    ]);

  // Actualizamos el conjunto al que pertenece cada vertice
  aristas.esBipartita = grafica.esBipartita();
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

const eliminaVertice2 = () => {
  cerrarModal();

  // Entradas
  let etiqueta = document.getElementById("eliminaVR1").value;

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
      return item.label.split("\n")[0] == etiqueta;
    },
  })[0];

  grafica.numVertices -= 1;

  // Eliminamos el vertice de la estructura grafica
  grafica.eliminarVertice(vertice.label.split("\n")[0]);

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
    i.group = grafica.vertices[i.label.split("\n")[0]].conjunto ? "a" : "b";
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

const eliminaArista2 = () => {
  cerrarModal();

  // Entradas
  let etiqueta = document.getElementById("eliminaAR1").value;

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
    i.group = grafica.vertices[i.label.split("\n")[0]].conjunto ? "a" : "b";
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
