const graficarArchivo1 = () => {
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
    console.log(datos);
    console.log(grafica);

    if (datos.vertices) {
      for (let i in datos.vertices) {
        let etiqueta = datos.vertices[i].etiqueta;
        grafica.agregarVertice(etiqueta);

        vertices.add({
          id: idVertice,
          label: etiqueta,
          group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
        });

        let esBipartita = bipartita(grafica);

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
          datos.aristas[i].etiqueta,
          datos.aristas[i].v1,
          datos.aristas[i].v2,
          datos.aristas[i].peso
        );

        aristas.add([
          {
            id: idArista,
            label: datos.aristas[i].peso,
            from: v1.id,
            to: v2.id,
            arrows: {
              to: {
                enabled: tipo == "grafica" ? false : true,
              },
            },
            title: datos.aristas[i].etiqueta,
            color: "#6762cc",
          },
        ]);

        esBipartita = bipartita(grafica);
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
      console.log(aristas.get());

      aristas.update(aristas.get());
      vertices.update(vertices.get());

      // Imprimimimos si la grafica es o no es bipartit
      if (tipo == "grafica")
        bipartitamsj.innerHTML =
          "<p>Gráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";
      else {
        bipartitamsj.innerHTML =
          "<p>Digráfica " + (esBipartita ? "" : "no ") + "bipartita</p>";
      }

      // Imprimimos la leyenda
      leyenda.innerHTML = esBipartita
        ? '<div class="h-4 w-4" style="background-color: #f7f6b1"></div><div class="ml-1">V1</div><div class="h-4 w-4 ml-2" style="background-color: #f4b1f7"></div><div class="ml-1">V2</div>'
        : "";

      // Actualizamos el numero de vertices en la pagina
      numVertices.innerHTML = grafica.numVertices;
      // Actualizamos el numero de aristas en la pagina
      numAristas.innerHTML = grafica.numAristas;
    }
  };
};

const buscaVertice = () => {
  cerrarModal();
  // Entradas
  let etiqueta = document.getElementById("buscarVertice").value;

  // Vaciamos el mensaje de salida
  mensaje.innerHTML = "";
  mensaje.classList.remove("text-red-500", "text-green-500");

  // Imprimimos si el vertice existe o no existe
  if (grafica.buscaVertice(etiqueta)) {
    mensaje.classList.add("text-green-500");
    mensaje.innerHTML = "<p> El vértice " + etiqueta + " existe</p>";

    if (tipo != "red") {
      for (let i in vertices.get()) {
        if (vertices.get()[i].label == etiqueta) vertices.get()[i].group = "e";
      }
    }

    vertices.update(vertices.get());
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

const pintarIteraciones = async (algoritmo) => {
  let { aristas: arcos } = algoritmo(grafica);

  let aVis = aristas.get();
  let vVis = vertices.get();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  for (i in arcos) {
    let a = arcos[i];
    let vs = [a.v1, a.v2];

    for (let j in aVis) {
      if (a.etiqueta == aVis[j].title) {
        aVis[j].color = "#ff499b";
        break;
      }
    }

    for (let j in vVis) {
      if (vs.length < 1) break;

      if (vs.includes(vVis[j].label)) {
        vVis[j].group = "d";

        vs.splice(vs.indexOf(vVis[j].label), 1);
      }
    }

    vertices.update(vVis);
    aristas.update(aVis);

    await sleep(1000);
  }

  for (let i in vVis) {
    vVis[i].group = "d";
  }

  vertices.update(vVis);
};

const actualizarIteraciones = async (algoritmo) => {
  let { iteraciones, msj, objetoAristas, solucion } = algoritmo(grafica);
  let aVis = aristas.get();
  let vVis = vertices.get();

  console.log(solucion);

  if (solucion) {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (let i = 0; i < 1; i++) {
      sleep(5000);
    }
    for (let i in iteraciones) {
      for (let j in iteraciones[i]) {
        let iteracion = iteraciones[i][j];
        let vs = [iteracion.fuente, iteracion.sumidero];

        grafica.editarArista(
          iteracion.etiqueta,
          iteracion.peso,
          iteracion.flujoMin,
          iteracion.flujo,
          iteracion.flujoMax
        );

        if (
          iteracion.peso > iteracion.flujoMin &&
          iteracion.peso < iteracion.flujoMax
        ) {
          for (let k in aVis) {
            if (iteracion.etiqueta == aVis[k].title) {
              aVis[k].color = "#ff499b";
              aVis[k].label =
                "[" +
                (iteracion.flujoMin ? iteracion.flujoMin : 0) +
                ", " +
                (iteracion.flujoMax != Infinity && iteracion.flujoMax
                  ? iteracion.flujoMax
                  : "∞") +
                ", $" +
                objetoAristas[iteracion.etiqueta].costo +
                "]\n" +
                iteracion.peso;
              break;
            }
          }
        } else {
          for (let k in aVis) {
            if (iteracion.etiqueta == aVis[k].title) {
              aVis[k].color = "#6864cc";
              aVis[k].label =
                "[" +
                (iteracion.flujoMin ? iteracion.flujoMin : 0) +
                ", " +
                (iteracion.flujoMax != Infinity && iteracion.flujoMax
                  ? iteracion.flujoMax
                  : "∞") +
                ", $" +
                iteracion.costo +
                "]\n" +
                iteracion.peso;
              break;
            }
          }
        }

        for (let j in vVis) {
          if (vs.length < 1) break;

          if (vs.includes(vVis[j].label)) {
            vVis[j].group = "d";

            vs.splice(vs.indexOf(vVis[j].label), 1);
          }
        }

        vertices.update(vVis);
        aristas.update(aVis);
      }
      await sleep(3000);
    }
  }
  vaciarMensaje();

  console.log(msj);
  imprimirMensaje(msj["text"], msj["color"]);
};

const crearGrafica = (algoritmo) => {
  let inputPrufer = document.getElementById("prufer");

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

  cerrarModal();
};
