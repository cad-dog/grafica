const algoritmoFleury = (grafica) => {
  if (!grafica.esConexa()) return false;

  let impares = 0;
  let comienzo;
  let pila = [],
    cola = [];
  let verticeActual;
  let aristaEliminada;

  // Checamos que la grafica no tenga mas de 2 vertices de grado impar
  for (let i in grafica.vertices) {
    if (grafica.vertices[i].grado % 2 != 0) {
      impares += 1;
      comienzo = i;
    }
    if (impares > 2) {
      return false;
    }
  }

  // Checamos que la grafica no tenga solo 1 vertice de
  if (impares == 1) {
    return false;
  }

  // Si no hay vertices con grado impar empezamos en el primero
  if (!comienzo) {
    comienzo = Object.keys(grafica.vertices)[0];
  }

  verticeActual = comienzo;

  // Copiamos la grafica
  let graficaCopia = _.cloneDeep(grafica);

  // Inicializamos la pila
  pila.push(comienzo);

  while (graficaCopia.numAristas > 0) {
    if (graficaCopia.aristas[verticeActual].length > 0) {
      // Asignamos la arista que vamos a eliminar
      aristaEliminada = graficaCopia.aristas[verticeActual][0].etiqueta;

      // Cambiamos al siguiente vertice
      verticeActual = graficaCopia.aristas[verticeActual][0].vertice;

      // Eliminamos la arista
      graficaCopia.eliminarArista(aristaEliminada);

      // Metemos el vertice actual a la pila
      pila.push(verticeActual);
    } else {
      pila.pop();
      while (!graficaCopia.aristas[verticeActual].length > 0) {
        console.log(graficaCopia.aristas[verticeActual]);
        cola.unshift(verticeActual);
        verticeActual = pila.pop();
      }
      pila.push(verticeActual);
    }
  }

  return pila.concat(cola);
};

const busquedaAncho = (grafica) => {
  let cola = [],
    aristasMarcadas = [],
    verticesMarcados = [],
    verticeActual;

  while (verticesMarcados.length < grafica.numVertices) {
    for (let i in grafica.vertices) {
      if (!verticesMarcados.includes(i)) {
        verticeActual = i;
        break;
      }
    }

    cola.push(verticeActual);
    verticesMarcados.push(verticeActual);
    while (cola.length > 0) {
      verticeActual = cola.shift();
      grafica.aristas[verticeActual].map((i) => {
        if (!verticesMarcados.includes(i.vertice)) {
          aristasMarcadas.push(i.etiqueta);
          verticesMarcados.push(i.vertice);
          cola.push(i.vertice);
        }
      });
    }
  }

  return { aristas: aristasMarcadas, vertices: Object.keys(grafica.vertices) };
};

const busquedaProfundidad = (grafica) => {
  let verticesMarcados = [],
    aristasMarcadas = [],
    pila = [],
    verticeActual,
    arista;

  verticeActual = Object.keys(grafica.vertices)[0];

  while (verticesMarcados.length < grafica.numVertices) {
    arista = undefined;
    if (!verticesMarcados.includes(verticeActual))
      verticesMarcados.push(verticeActual);
    for (let i = 0; i < grafica.aristas[verticeActual].length; i++) {
      if (
        !verticesMarcados.includes(grafica.aristas[verticeActual][i].vertice)
      ) {
        arista = grafica.aristas[verticeActual][i];
        break;
      }
    }
    if (arista) {
      aristasMarcadas.push(arista.etiqueta);
      pila.push(verticeActual);
      verticeActual = arista.vertice;
    } else {
      if (pila.length > 0) {
        verticeActual = pila.pop();
      } else {
        for (let i in grafica.vertices) {
          if (!verticesMarcados.includes(i)) {
            verticeActual = i;
            break;
          }
        }
      }
    }
  }
  return { aristas: aristasMarcadas, vertices: Object.keys(grafica.vertices) };
};

const kruskal = (grafica) => {
  let aristasMarcadas = [],
    padres = {},
    aristaActual,
    cola = new ColaPrioridad();

  // Guardamos las aristas ordenadas por peso
  for (let i = 0; i < grafica.listaAristas.length; i++) {
    cola.agregar(grafica.listaAristas[i], grafica.listaAristas[i].peso);
  }

  cola.pintar();

  // Guardamos los padres de cada vertice
  for (let i in grafica.vertices) {
    padres[i] = i;
  }

  while (cola.longitud > 0) {
    aristaActual = cola.sacar().etiqueta;
    if (
      busqueda(aristaActual.v1, padres) != busqueda(aristaActual.v2, padres)
    ) {
      union(aristaActual.v1, aristaActual.v2, padres);
      aristasMarcadas.push(aristaActual.etiqueta);
    }
  }

  return { aristas: aristasMarcadas, vertices: Object.keys(grafica.vertices) };
};

const prim = (grafica) => {
  let cola = new ColaPrioridad(),
    verticesMarcados = [],
    aristasMarcadas = [],
    verticeActual,
    menor,
    verticesNoMarcados = Object.keys(grafica.vertices);

  while (verticesNoMarcados.length > 0) {
    verticeActual = verticesNoMarcados[0];
    verticesMarcados.push(verticeActual);
    verticesNoMarcados.splice(verticesNoMarcados.indexOf(verticeActual), 1);

    for (let i = 0; i < grafica.aristas[verticeActual].length; i++) {
      cola.agregar(
        grafica.aristas[verticeActual][i],
        grafica.aristas[verticeActual][i].peso
      );
    }

    if (cola.longitud > 0) {
      menor = cola.sacar().etiqueta;

      aristasMarcadas.push(menor.etiqueta);
      verticesMarcados.push(menor.vertice);
      verticesNoMarcados.splice(verticesNoMarcados.indexOf(menor.vertice), 1);
    }

    while (cola.longitud > 0) {
      for (let i = 0; i < grafica.aristas[menor.vertice].length; i++) {
        if (
          !verticesMarcados.includes(grafica.aristas[menor.vertice][i].vertice)
        ) {
          cola.agregar(
            grafica.aristas[menor.vertice][i],
            grafica.aristas[menor.vertice][i].peso
          );
        }
      }

      while (cola.longitud > 0 && verticesMarcados.includes(menor.vertice)) {
        menor = cola.sacar().etiqueta;
      }

      if (!verticesMarcados.includes(menor.vertice)) {
        verticesMarcados.push(menor.vertice);
        verticesNoMarcados.splice(verticesNoMarcados.indexOf(menor.vertice), 1);
        aristasMarcadas.push(menor.etiqueta);
      }
    }
  }

  return { aristas: aristasMarcadas, vertices: Object.keys(grafica.vertices) };
};

const prufer = (secuencia) => {
  secuencia = secuencia.split(",");

  let l = [],
    aristas = [],
    vertices = [],
    arista = 1,
    n;
  for (let i = 1; i <= secuencia.length + 2; i++) {
    l.push(i.toString());
  }

  n = l.length;

  for (let i = 0; i < n - 2; i++) {
    for (let j = 0; j < n; j++) {
      if (!secuencia.includes(l[j])) {
        if (!vertices.includes(secuencia[0])) vertices.push(secuencia[0]);
        if (!vertices.includes(l[j])) vertices.push(l[j]);

        aristas.push({
          etiqueta: "e" + arista,
          v1: secuencia[0],
          v2: l[j],
          peso: 0,
        });

        secuencia.splice(0, 1);
        l.splice(j, 1);

        arista++;

        break;
      }
    }
  }

  if (!vertices.includes(l[0])) vertices.push(l[0]);
  if (!vertices.includes(l[1])) vertices.push(l[1]);
  aristas.push({
    etiqueta: "e" + arista,
    v1: l[0],
    v2: l[1],
    peso: 0,
  });

  return [vertices, aristas];
};

const dijkstra = (grafica) => {
  let camino = {},
    cola = new ColaPrioridad(),
    marcasDef = [],
    aristas = [],
    verticeActual,
    aristaActual,
    objetoAristas = {},
    inicio,
    destino,
    aux,
    hayCiclo = false,
    ciclo = [],
    pesoCiclo,
    ancestro,
    vertices = [];

  for (let i = 0; i < grafica.listaAristas.length; i++) {
    objetoAristas[grafica.listaAristas[i].etiqueta] = {
      inicio: grafica.listaAristas[i].v1,
      destino: grafica.listaAristas[i].v2,
      peso: grafica.listaAristas[i].peso,
    };
  }

  let inicial = document.getElementById("dijkstra").value;

  camino[inicial] = { arista: undefined, peso: 0 };

  cola.agregar(inicial, 0);
  while (cola.longitud > 0) {
    verticeActual = cola.sacar();
    marcasDef.push(verticeActual.etiqueta);
    grafica.aristas[verticeActual.etiqueta].map((a) => {
      if (a.tipo === "saliente" && !marcasDef.includes(a.vertice)) {
        aux = cola.existe(a.vertice);
        if (aux) {
          if (a.peso + verticeActual.peso < aux.peso) {
            cola.cambiarPeso(a.vertice, a.peso + verticeActual.peso);
            camino[a.vertice] = {
              arista: a.etiqueta,
              peso: a.peso + verticeActual.peso,
            };
          }
        } else {
          cola.agregar(a.vertice, a.peso + verticeActual.peso);
          camino[a.vertice] = {
            arista: a.etiqueta,
            peso: a.peso + verticeActual.peso,
          };
        }
      }
    });
  }

  for (let i in camino) {
    if (camino[i].arista) aristas.push(camino[i].arista);
  }

  for (i in objetoAristas) {
    if (!aristas.includes(i)) {
      cola.agregar(i, objetoAristas[i].peso);
    }
  }

  while (cola.longitud > 0) {
    aristaActual = cola.sacar().etiqueta;
    inicio = objetoAristas[aristaActual].inicio;
    destino = objetoAristas[aristaActual].destino;
    if (
      camino[inicio].peso + objetoAristas[aristaActual].peso <
      camino[destino].peso
    ) {
      ancestro = inicio;
      ciclo = [aristaActual];
      vertices = [destino];
      pesoCiclo = objetoAristas[aristaActual].peso;
      while (!hayCiclo) {
        if (ancestro == destino) {
          hayCiclo = true;

          let mensaje = document.getElementById("mensaje");

          // Vaciamos el mensaje de salida
          mensaje.innerHTML = "";
          mensaje.classList.remove("text-red-500", "text-green-500");

          mensaje.classList.add("text-red-500");
          mensaje.innerHTML =
            "<p>La longitud del ciclo negativo es: " + pesoCiclo + " unidades";

          return { aristas: ciclo, vertices: vertices };
        }

        if (ancestro == inicial) break;
        ciclo.push(camino[ancestro].arista);
        pesoCiclo += objetoAristas[camino[ancestro].arista].peso;
        vertices.push(ancestro);

        ancestro = objetoAristas[camino[ancestro].arista].inicio;
      }

      if (!hayCiclo) {
        if (camino[destino].arista)
          cola.agregar(
            camino[destino].arista,
            objetoAristas[camino[destino].arista].peso
          );

        camino[destino] = {
          arista: aristaActual,
          peso: camino[inicio].peso + objetoAristas[aristaActual].peso,
        };

        for (i = 0; i < grafica.aristas[destino].length; i++) {
          if (grafica.aristas[destino][i].tipo === "saliente") {
            if (camino[grafica.aristas[destino][i].vertice].arista)
              cola.agregar(
                camino[grafica.aristas[destino][i].vertice].arista,
                objetoAristas[
                  camino[grafica.aristas[destino][i].vertice].arista
                ].peso
              );

            camino[grafica.aristas[destino][i].vertice] = {
              arista: grafica.aristas[destino][i].etiqueta,
              peso: camino[destino].peso + grafica.aristas[destino][i].peso,
            };
          }
        }
      }
    }
  }

  aristas = [];

  for (let i in camino) {
    if (camino[i].arista) aristas.push(camino[i].arista);
  }

  return { aristas: aristas, vertices: Object.keys(grafica.vertices) };
};

const floyd = (grafica) => {
  let dist = {},
    antecesor,
    vertices = [],
    aristas = [],
    hayCiclo = false,
    longitud = 0,
    etiquetaAntecesor;

  let inicio = document.getElementById("inicioFloyd").value,
    destino = document.getElementById("destinoFloyd").value;

  for (let i in grafica.vertices) {
    dist[i] = {};

    grafica.aristas[i].map((arista) => {
      if (arista.tipo === "saliente")
        dist[i][arista.vertice] = {
          antecesor: i,
          peso: arista.peso,
          arista: arista.etiqueta,
        };
    });

    for (j in grafica.vertices) {
      if (dist[i][j] == undefined)
        dist[i][j] = { antecesor: i, peso: Infinity };
      if (i === j) dist[i][j] = { antecesor: i, peso: 0 };
    }
  }

  for (let i in grafica.vertices) {
    for (let j in grafica.vertices) {
      for (let k in grafica.vertices) {
        if (dist[i][k].peso + dist[k][j].peso < dist[i][j].peso) {
          dist[i][j] = {
            antecesor: dist[k][j].antecesor,
            peso: dist[i][k].peso + dist[k][j].peso,
            arista: dist[k][j].arista,
          };
          if (i == j && dist[i][k].peso + dist[k][j].peso < 0) {
            hayCiclo = true;
            break;
          }
        }
      }
    }
  }

  for (let i in grafica.vertices) {
    if (dist[i][i].peso < 0) {
      etiquetaAntecesor = i;
      antecesor = dist[i][i];
      break;
    }
  }

  if (hayCiclo) {
    (vertices = []), (aristas = []);

    longitud = antecesor.peso;
    while (true) {
      if (vertices.includes(antecesor.antecesor)) break;
      vertices.push(antecesor.antecesor);
      aristas.push(antecesor.arista);
      antecesor = dist[etiquetaAntecesor][antecesor.antecesor];
    }

    let mensaje = document.getElementById("mensaje");

    // Vaciamos el mensaje de salida
    mensaje.innerHTML = "";
    mensaje.classList.remove("text-red-500", "text-green-500");

    mensaje.classList.add("text-red-500");
    mensaje.innerHTML =
      "<p>La longitud del ciclo negativo es: " + longitud + " unidades";

    return { aristas: aristas, vertices: vertices };
  }

  antecesor = dist[inicio][destino];

  vertices.push(destino);

  while (antecesor.antecesor != inicio) {
    vertices.push(antecesor.antecesor);
    aristas.push(antecesor.arista);
    antecesor = dist[inicio][antecesor.antecesor];
  }

  aristas.push(antecesor.arista);
  vertices.push(inicio);

  dist[inicio][destino].antecesor;

  return { aristas: aristas, vertices: vertices };
};

const fordFulkerson = (grafica) => {
  let verticeActual,
    arista,
    flujo,
    objetoAristas = {},
    fuente = [],
    sumidero = [],
    esFuente,
    esSumidero,
    arcosRestriccion = [],
    verticesDuplicados = [];

  let graficaCopia = _.cloneDeep(grafica);

  // Variante 1
  for (let i in graficaCopia.aristas) {
    esFuente = true;
    esSumidero = true;

    for (let j in graficaCopia.aristas[i])
      if (graficaCopia.aristas[i][j].tipo == "entrante") esFuente = false;

    if (esFuente) fuente.push(i);

    for (let j in graficaCopia.aristas[i])
      if (graficaCopia.aristas[i][j].tipo == "saliente") esSumidero = false;

    if (esSumidero) sumidero.push(i);
  }

  if (fuente.length > 1) {
    graficaCopia.agregarVertice("superfuente");

    for (let i in fuente) {
      objetoAristas["e" + (parseInt(i) + 1) + "'"] = {
        fuente: "superfuente",
        sumidero: fuente[i],
        flujoMax: Infinity,
        flujo: 0,
      };

      graficaCopia.agregarArista(
        "superfuente",
        fuente[i],
        Infinity,
        "e" + (parseInt(i) + 1) + "'"
      );
    }

    fuente = "superfuente";
  } else fuente = fuente[0];

  if (sumidero.length > 1) {
    graficaCopia.agregarVertice("supersumidero");

    for (let i in sumidero) {
      objetoAristas["e" + (parseInt(i) + 1) + "''"] = {
        fuente: sumidero[i],
        sumidero: "supersumidero",
        flujoMax: Infinity,
        flujo: 0,
      };

      graficaCopia.agregarArista(
        sumidero[i],
        "supersumidero",
        Infinity,
        "e" + (parseInt(i) + 1) + "''"
      );
    }

    sumidero = "supersumidero";
  } else sumidero = sumidero[0];

  for (let i = 0; i < graficaCopia.listaAristas.length; i++) {
    objetoAristas[graficaCopia.listaAristas[i].etiqueta] = {
      fuente: graficaCopia.listaAristas[i].v1,
      sumidero: graficaCopia.listaAristas[i].v2,
      flujoMin: graficaCopia.listaAristas[i].flujoMin,
      flujo: graficaCopia.listaAristas[i].flujo,
      flujoMax: graficaCopia.listaAristas[i].flujoMax,
    };

    if (graficaCopia.listaAristas[i].flujo > 0)
      arcosRestriccion.push({
        v1: graficaCopia.listaAristas[i].v1,
        v2: graficaCopia.listaAristas[i].v2,
        etiqueta: graficaCopia.listaAristas[i].etiqueta,
        flujoMin: graficaCopia.listaAristas[i].flujoMin,
        flujo: graficaCopia.listaAristas[i].flujo,
        flujoMax: graficaCopia.listaAristas[i].flujoMax,
      });
  }

  // Variante 3
  for (let i in graficaCopia.vertices) {
    if (
      graficaCopia.vertices[i].flujoMin > 0 ||
      graficaCopia.vertices[i].flujoMax > 0
    ) {
      verticesDuplicados.push(i.toUpperCase());
      graficaCopia.agregarVertice(i.toUpperCase());

      graficaCopia.agregarArista(
        i,
        i.toLowerCase(),
        graficaCopia.vertices[i].flujoMax,
        i.toUpperCase(),
        graficaCopia.vertices[i].flujoMin
      );

      for (let j in graficaCopia.aristas[i]) {
        let eliminar = [];
        if (graficaCopia.aristas[i][j].tipo == "saliente") {
          graficaCopia.agregarArista(
            i.toUpperCase(),
            graficaCopia.aristas[i][j].vertice,
            graficaCopia.aristas[i][j].flujoMax,
            graficaCopia.aristas[i][j].etiqueta + "#",
            graficaCopia.aristas[i][j].flujoMin
          );

          objetoAristas[graficaCopia.aristas[i][j].etiqueta + "#"] = {
            fuente: i.toUpperCase(),
            sumidero: graficaCopia.aristas[i][j].vertice,
            flujoMin: graficaCopia.aristas[i][j].flujoMin,
            flujo: graficaCopia.aristas[i][j].flujo,
            flujoMax: graficaCopia.aristas[i][j].flujoMax,
          };

          eliminar.push(graficaCopia.aristas[i][j].etiqueta);
        }
      }

      for (let j in eliminar) {
        graficaCopia.eliminarArista(eliminar[j]);
        delete objetoAristas[j];
      }
    }
  }

  // Variante 2
  if (arcosRestriccion.length > 0) {
    graficaCopia.agregarVertice("A'");
    graficaCopia.agregarVertice("Z'");

    console.log(arcosRestriccion);

    for (let i in arcosRestriccion) {
      let arco = graficaCopia.buscaArista2("A'", arcosRestriccion[i].v2);
      if (!arco) {
        graficaCopia.agregarArista(
          "A'",
          arcosRestriccion[i].v2,
          arcosRestriccion[i].flujoMin,
          arcosRestriccion[i].etiqueta + "*"
        );

        objetoAristas[arcosRestriccion[i].etiqueta + "*"] = {
          fuente: "A'",
          sumidero: arcosRestriccion[i].v2,
          flujoMin: 0,
          flujo: 0,
          flujoMax: arcosRestriccion[i].flujoMin,
        };
      } else {
        graficaCopia.editarArista(
          arco.etiqueta,
          arco.flujoMin,
          arco.flujo,
          arco.flujoMax + arcosRestriccion[i].flujoMin
        );
      }

      arco = graficaCopia.buscaArista2(arcosRestriccion[i].v1, "Z'");
      if (!arco) {
        graficaCopia.agregarArista(
          arcosRestriccion[i].v1,
          "Z'",
          arcosRestriccion[i].flujoMin,
          arcosRestriccion[i].etiqueta + "**"
        );

        objetoAristas[arcosRestriccion[i].etiqueta + "**"] = {
          fuente: arcosRestriccion[i].v1,
          sumidero: "Z'",
          flujoMin: 0,
          flujo: 0,
          flujoMax: arcosRestriccion[i].flujoMin,
        };
      } else {
        graficaCopia.editarArista(
          arco.etiqueta,
          arco.flujoMin,
          arco.flujo,
          arco.flujoMax + arcosRestriccion[i].flujoMin
        );
      }

      graficaCopia.eliminarArista(arcosRestriccion[i].etiqueta);
      graficaCopia.agregarArista(
        arcosRestriccion[i].v1,
        arcosRestriccion[i].v2,
        arcosRestriccion[i].flujoMax - arcosRestriccion[i].flujoMin,
        arcosRestriccion[i].etiqueta
      );

      objetoAristas[arcosRestriccion[i].etiqueta] = {
        fuente: arcosRestriccion[i].v1,
        sumidero: arcosRestriccion[i].v2,
        flujoMin: 0,
        flujo: 0,
        flujoMax: arcosRestriccion[i].flujoMax - arcosRestriccion[i].flujoMin,
      };
    }

    graficaCopia.agregarArista(fuente, sumidero, Infinity, "e*");

    objetoAristas["e*"] = {
      fuente: fuente,
      sumidero: sumidero,
      flujoMin: 0,
      flujo: 0,
      flujoMax: Infinity,
    };

    graficaCopia.agregarArista(sumidero, fuente, Infinity, "e**");

    objetoAristas["e**"] = {
      fuente: sumidero,
      sumidero: fuente,
      flujoMin: 0,
      flujo: 0,
      flujoMax: Infinity,
    };

    let fuente2 = "A'";
    let sumidero2 = "Z'";

    while (true) {
      let etiquetasVertices = {},
        cola = [];

      verticeActual = {
        etiqueta: fuente2,
        adyacente: fuente2,
        flujo: Infinity,
        signo: "+",
      };
      etiquetasVertices[verticeActual.etiqueta] = verticeActual;

      cola.push(verticeActual.etiqueta);

      while (etiquetasVertices[sumidero2] == undefined && cola.length > 0) {
        verticeActual = etiquetasVertices[cola.shift()];

        for (let j in graficaCopia.aristas[verticeActual.etiqueta]) {
          arista = graficaCopia.aristas[verticeActual.etiqueta][j];

          if (!Object.keys(etiquetasVertices).includes(arista.vertice)) {
            if (
              arista.tipo == "saliente" &&
              objetoAristas[arista.etiqueta].flujo <
                objetoAristas[arista.etiqueta].flujoMax
            ) {
              flujo = Math.min(
                verticeActual.flujo,
                objetoAristas[arista.etiqueta].flujoMax -
                  objetoAristas[arista.etiqueta].flujo
              );
            } else if (
              arista.tipo == "entrante" &&
              objetoAristas[arista.etiqueta].flujo > 0
            ) {
              flujo = Math.min(
                verticeActual.flujo,
                objetoAristas[arista.etiqueta].flujo
              );
            } else continue;

            etiquetasVertices[arista.vertice] = {
              etiqueta: arista.vertice,
              adyacente: verticeActual.etiqueta,
              flujo: flujo,
              signo: arista.tipo == "saliente" ? "+" : "-",
            };

            cola.push(arista.vertice);
          }
        }
      }

      if (etiquetasVertices[sumidero2] != undefined) {
        verticeActual = etiquetasVertices[sumidero2];

        flujo = verticeActual.flujo;

        while (verticeActual.etiqueta != fuente2) {
          for (let i in graficaCopia.aristas[verticeActual.etiqueta]) {
            if (
              graficaCopia.aristas[verticeActual.etiqueta][i].vertice ==
              verticeActual.adyacente
            ) {
              objetoAristas[
                graficaCopia.aristas[verticeActual.etiqueta][i].etiqueta
              ].flujo += flujo;
              verticeActual =
                etiquetasVertices[
                  graficaCopia.aristas[verticeActual.etiqueta][i].vertice
                ];
              break;
            }
          }
        }
      } else break;
    }

    // Reparticiones
    for (let i in arcosRestriccion) {
      graficaCopia.eliminarArista(arcosRestriccion[i].etiqueta);
      graficaCopia.agregarArista(
        arcosRestriccion[i].v1,
        arcosRestriccion[i].v2,
        arcosRestriccion[i].flujoMax,
        arcosRestriccion[i].etiqueta,
        objetoAristas[arcosRestriccion[i].etiqueta + "**"].flujoMin,
        objetoAristas[arcosRestriccion[i].etiqueta + "**"].flujoMin
      );

      objetoAristas[arcosRestriccion[i].etiqueta] = {
        fuente: arcosRestriccion[i].v1,
        sumidero: arcosRestriccion[i].v2,
        flujoMin: objetoAristas[arcosRestriccion[i].etiqueta + "**"].flujoMin,
        flujo: objetoAristas[arcosRestriccion[i].etiqueta + "**"].flujoMin,
        flujoMax: arcosRestriccion[i].flujoMax,
      };
    }

    graficaCopia.eliminarArista("e*");
    graficaCopia.eliminarArista("e**");

    console.log(graficaCopia.aristas);

    for (let i in objetoAristas) if (i.includes("*")) delete objetoAristas[i];

    graficaCopia.eliminarVertice("A'");
    graficaCopia.eliminarVertice("Z'");
  }

  while (true) {
    let etiquetasVertices = {},
      cola = [];

    verticeActual = {
      etiqueta: fuente,
      adyacente: fuente,
      flujo: Infinity,
      signo: "+",
    };
    etiquetasVertices[verticeActual.etiqueta] = verticeActual;

    cola.push(verticeActual.etiqueta);

    while (etiquetasVertices[sumidero] == undefined && cola.length > 0) {
      verticeActual = etiquetasVertices[cola.shift()];

      for (let j in graficaCopia.aristas[verticeActual.etiqueta]) {
        arista = graficaCopia.aristas[verticeActual.etiqueta][j];

        if (!Object.keys(etiquetasVertices).includes(arista.vertice)) {
          // console.log(arista.etiqueta);
          // console.log(objetoAristas);

          if (
            arista.tipo == "saliente" &&
            objetoAristas[arista.etiqueta].flujo <
              objetoAristas[arista.etiqueta].flujoMax
          ) {
            flujo = Math.min(
              verticeActual.flujo,
              objetoAristas[arista.etiqueta].flujoMax -
                objetoAristas[arista.etiqueta].flujo
            );
          } else if (
            arista.tipo == "entrante" &&
            objetoAristas[arista.etiqueta].flujo >
              objetoAristas[arista.etiqueta].flujoMin
          ) {
            flujo = Math.min(
              verticeActual.flujo,
              objetoAristas[arista.etiqueta].flujo
            );
          } else {
            continue;
          }

          etiquetasVertices[arista.vertice] = {
            etiqueta: arista.vertice,
            adyacente: verticeActual.etiqueta,
            flujo: flujo,
            signo: arista.tipo == "saliente" ? "+" : "-",
          };

          cola.push(arista.vertice);
        }
      }
    }

    if (etiquetasVertices[sumidero] != undefined) {
      verticeActual = etiquetasVertices[sumidero];

      flujo = verticeActual.flujo;

      while (verticeActual.etiqueta != fuente) {
        for (let i in graficaCopia.aristas[verticeActual.etiqueta]) {
          if (
            graficaCopia.aristas[verticeActual.etiqueta][i].vertice ==
            verticeActual.adyacente
          ) {
            objetoAristas[
              graficaCopia.aristas[verticeActual.etiqueta][i].etiqueta
            ].flujo += flujo;
            verticeActual =
              etiquetasVertices[
                graficaCopia.aristas[verticeActual.etiqueta][i].vertice
              ];
            break;
          }
        }
      }
    } else break;
  }

  for (let i in verticesDuplicados) {
    for (let j in graficaCopia.aristas[verticesDuplicados[i]]) {
      console.log(arista.etiqueta);
      console.log(objetoAristas);

      graficaCopia.agregarArista(
        verticesDuplicados[i].split("#")[0],
        graficaCopia.aristas[verticesDuplicados[i]][j].vertice,
        objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta]
          .flujoMax,
        graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta,
        objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta]
          .flujoMin,
        objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta]
          .flujo
      );

      objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta] = {
        fuente: verticesDuplicados[i].split("#")[0],
        sumidero: graficaCopia.aristas[verticesDuplicados[i]][j].vertice,
        flujoMin:
          objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta]
            .flujoMin,
        flujo:
          objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta]
            .flujo,
        flujoMax:
          objetoAristas[graficaCopia.aristas[verticesDuplicados[i]][j].etiqueta]
            .flujoMax,
      };
    }

    graficaCopia.eliminarVertice(verticesDuplicados[i]);
  }

  flujo = 0;
  for (i in graficaCopia.aristas[sumidero]) {
    flujo += objetoAristas[graficaCopia.aristas[sumidero][i].etiqueta].flujo;
  }

  for (let i in objetoAristas)
    if (i.includes("'") || i.includes("#")) delete objetoAristas[i];

  console.log(objetoAristas);

  return { objetoAristas: objetoAristas, flujoMax: flujo };
};
