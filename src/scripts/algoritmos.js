const algoritmoFleury = (grafica) => {
  cerrarModal();

  if (!esConexa(grafica)) {
    vaciarMensaje();
    imprimirMensaje("La gráfica no tiene paseo de Euler", "text-red-500");
    return false;
  }

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
      vaciarMensaje();
      imprimirMensaje("La gráfica no tiene paseo de Euler", "text-red-500");
      return false;
    }
  }

  // Checamos que la grafica no tenga solo 1 vertice de
  if (impares == 1) {
    vaciarMensaje();
    imprimirMensaje("La gráfica no tiene paseo de Euler", "text-red-500");
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
        cola.unshift(verticeActual);
        verticeActual = pila.pop();
      }
      pila.push(verticeActual);
    }
  }

  let a = [];
  let ignorar = [];

  pila = pila.concat(cola);

  for (let i = 0; i < pila.length; i++) {
    if (i == pila.length - 1) break;
    let ae = grafica.buscaArista2(pila[i], pila[i + 1], ignorar);
    ignorar.push(ae.etiqueta);
    a.push(ae);
  }

  vaciarMensaje();
  imprimirMensaje("Paseo de Euler: {" + pila + "}", "text-green-500");

  return { aristas: a, vertices: pila };
};

const busquedaAncho = (grafica) => {
  cerrarModal();

  let cola = [],
    aristasMarcadas = [],
    verticesMarcados = [],
    verticeActual,
    conexa = true,
    c = 0;

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
          aristasMarcadas.push(grafica.buscaArista(i.etiqueta));
          verticesMarcados.push(i.vertice);
          cola.push(i.vertice);
        }
      });
    }
    c++;
  }

  if (c > 1) conexa = false;
  return {
    aristas: aristasMarcadas,
    vertices: Object.keys(grafica.vertices),
    conexa,
  };
};

const busquedaProfundidad = (grafica) => {
  cerrarModal();

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
      aristasMarcadas.push(grafica.buscaArista(arista.etiqueta));
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
  cerrarModal();

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
      aristasMarcadas.push(grafica.buscaArista(aristaActual.etiqueta));
    }
  }

  let peso = 0;
  for (let i in aristasMarcadas) peso += aristasMarcadas[i].peso;

  vaciarMensaje();
  imprimirMensaje(
    "El peso del árbol de expansión mínima es de " + peso + " unidades."
  );

  return { aristas: aristasMarcadas, vertices: Object.keys(grafica.vertices) };
};

const prim = (grafica) => {
  cerrarModal();

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

      aristasMarcadas.push(grafica.buscaArista(menor.etiqueta));
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
        aristasMarcadas.push(grafica.buscaArista(menor.etiqueta));
      }
    }
  }

  let peso = 0;
  for (let i in aristasMarcadas) peso += aristasMarcadas[i].peso;

  vaciarMensaje();
  imprimirMensaje(
    "El peso del árbol de expansión mínima es de " + peso + " unidades."
  );

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
  cerrarModal();

  let camino = {},
    cola = new ColaPrioridad(),
    aristas = [],
    verticeActual,
    inicio,
    destino,
    vertices = [];

  // Creamos el objeto de aristas
  let { objetoAristas } = creaObjetoAristas(grafica);

  inicio = document.getElementById("dijkstra1").value;
  destino = document.getElementById("dijkstra2").value;

  // Dijkstra Basico
  if (inicio == "") inicio = "a";

  ({ vertices, aristas, camino, msj } = dijkstraBasico(grafica, inicio, ""));

  cola = [];
  for (i in objetoAristas) {
    if (!aristas.includes(i)) {
      cola.push(i);
    }
  }

  let continuar = true;

  while (continuar) {
    continuar = false;

    for (let i in cola) {
      let a = objetoAristas[cola[i]];

      if (camino[a.fuente].peso + a.peso < camino[a.sumidero].peso) {
        let ancestros = [];
        let descendientes = [];

        verticeActual = a.fuente;

        // Guardamos los ancestros en un arreglo
        while (verticeActual != inicio) {
          ancestros.push(camino[verticeActual].anterior);
          verticeActual = camino[verticeActual].anterior;
        }

        // Guardamos los descendientes en un arreglo
        for (let j in grafica.vertices) {
          verticeActual = j;

          while (verticeActual != inicio) {
            if (camino[verticeActual].anterior == a.sumidero) {
              descendientes.push(j);
              break;
            }

            verticeActual = camino[verticeActual].anterior;
          }
        }

        if (a.sumidero == inicio || ancestros.includes(a.sumidero)) {
          let longitud = a.peso;

          verticeActual = a.fuente;
          vertices = [a.fuente];
          aristas = [grafica.buscaArista(a.etiqueta)];
          while (verticeActual != a.sumidero) {
            vertices.push(camino[verticeActual].anterior);
            aristas.push(grafica.buscaArista(camino[verticeActual].arista));
            longitud += objetoAristas[camino[verticeActual].arista].peso;

            verticeActual = camino[verticeActual].anterior;
          }

          if (longitud == 0) continue;

          vaciarMensaje();
          imprimirMensaje(
            "La longitud del ciclo negativo es de " + longitud + " unidades.",
            "text-red-500"
          );

          return { aristas: aristas.reverse(), vertices: vertices, msj: msj };
        } else {
          camino[a.sumidero] = {
            arista: a.etiqueta,
            anterior: a.fuente,
            peso: camino[a.fuente].peso + a.peso,
          };

          for (let j in descendientes) {
            camino[descendientes[j]] = {
              arista: camino[descendientes[j]].arista,
              anterior: camino[descendientes[j]].anterior,
              peso: camino[camino[descendientes[j]].anterior].peso + a.peso,
            };
          }
        }
        continuar = true;
        break;
      }
    }
  }

  vertices = [];
  aristas = [];

  if (destino != "") {
    verticeActual = destino;
    vertices.push(verticeActual);
    while (verticeActual != inicio) {
      vertices.push(camino[verticeActual].anterior);

      if (camino[verticeActual].arista != undefined)
        aristas.push(grafica.buscaArista(camino[verticeActual].arista));

      verticeActual = camino[verticeActual].anterior;
    }

    aristas.reverse();

    let peso = 0;
    for (let i in aristas) peso += aristas[i].peso;

    vaciarMensaje();
    imprimirMensaje(
      "El peso de la ruta mas corta de " +
        inicio +
        " a " +
        destino +
        " es de " +
        peso +
        " unidades."
    );
  } else {
    let ignorar = [];
    for (let i in grafica.vertices) {
      verticeActual = i;

      vertices.push(verticeActual);
      while (verticeActual != inicio) {
        vertices.push(camino[verticeActual].anterior);

        if (camino[verticeActual].arista != undefined)
          if (!ignorar.includes(camino[verticeActual].arista)) {
            aristas.push(grafica.buscaArista(camino[verticeActual].arista));
            ignorar.push(camino[verticeActual].arista);
          }

        verticeActual = camino[verticeActual].anterior;
      }
    }

    let peso = 0;
    for (let i in aristas) peso += aristas[i].peso;

    vaciarMensaje();
    imprimirMensaje(
      "El peso de la arborescencia con raiz en " +
        inicio +
        " es de " +
        peso +
        " unidades."
    );
  }

  let longitud = 0;
  for (let i in aristas) {
    longitud += objetoAristas[aristas[i].etiqueta].peso;
  }

  msj = {
    text: "La longitud de la arborescencia es de " + longitud + " unidades.",
    color: "text-green-500",
  };

  return { aristas: aristas, vertices: vertices, msj: msj };
};

const floyd = (grafica, a, b, uni) => {
  cerrarModal();

  let dist = {},
    antecesor,
    vertices = [],
    aristas = [],
    etiquetasAristas = [],
    longitud = 0;

  if (uni != false) uni = true;

  a = a;
  b = b;

  let inicio = document.getElementById("inicioFloyd")
      ? document.getElementById("inicioFloyd").value
      : a,
    destino = document.getElementById("destinoFloyd")
      ? document.getElementById("destinoFloyd").value
      : b;

  // Llenamos la matriz de camino y distancias
  for (let i in grafica.vertices) {
    dist[i] = {};

    grafica.aristas[i].map((arista) => {
      if (uni) {
        if (arista.tipo === "saliente")
          dist[i][arista.vertice] = {
            etiqueta: arista.vertice,
            antecesor: i,
            peso: arista.peso,
            arista: arista.etiqueta,
          };
      } else
        dist[i][arista.vertice] = {
          etiqueta: arista.vertice,
          antecesor: i,
          peso: arista.peso,
          arista: arista.etiqueta,
        };
    });

    for (j in grafica.vertices) {
      if (dist[i][j] == undefined)
        dist[i][j] = { etiqueta: j, antecesor: i, peso: Infinity };
      if (i === j) dist[i][j] = { etiqueta: i, antecesor: i, peso: 0 };
    }
  }

  // Aplicamos Floyd Warshall
  for (let k in grafica.vertices) {
    for (let i in grafica.vertices) {
      for (let j in grafica.vertices) {
        if (dist[i][k].peso + dist[k][j].peso < dist[i][j].peso) {
          dist[i][j] = {
            etiqueta: j,
            antecesor: dist[k][j].antecesor,
            peso: dist[i][k].peso + dist[k][j].peso,
            arista: dist[k][j].arista,
          };
        }
      }

      if (dist[i][i].peso < 0) {
        let ciclo = [];
        antecesor = dist[i][i];
        (vertices = []), (aristas = []);

        longitud = antecesor.peso;
        while (true) {
          if (vertices.includes(antecesor.antecesor)) break;
          vertices.push(antecesor.antecesor);
          aristas.push(grafica.buscaArista(antecesor.arista));
          etiquetasAristas.push(antecesor.arista);
          ciclo.push(grafica.buscaArista(antecesor.arista));
          antecesor = dist[i][antecesor.antecesor];
        }

        let msj = {
          text: "La longitud del ciclo negativo es: " + longitud + " unidades",
          color: "text-red-500",
        };

        vaciarMensaje();
        imprimirMensaje(
          "La longitud del ciclo negativo es de " + longitud + " unidades.",
          "text-red-500"
        );

        aristas.reverse();

        return {
          vertices: vertices,
          aristas: aristas,
          ciclo: ciclo,
          longitud: longitud,
          msj: msj,
          etiquetasAristas,
        };
      }
    }
  }

  if (destino != "") {
    antecesor = dist[inicio][destino];

    vertices.push(destino);

    while (antecesor.antecesor != inicio) {
      vertices.push(antecesor.antecesor);
      aristas.push(grafica.buscaArista(antecesor.arista));
      etiquetasAristas.push(antecesor.arista);
      antecesor = dist[inicio][antecesor.antecesor];
    }

    aristas.push(grafica.buscaArista(antecesor.arista));
    etiquetasAristas.push(antecesor.arista);
    vertices.push(inicio);

    dist[inicio][destino].antecesor;

    let peso = 0;
    for (let i in aristas) peso += aristas[i].peso;

    vaciarMensaje();
    imprimirMensaje(
      "El peso de la ruta mas corta de " +
        inicio +
        " a " +
        destino +
        " es de " +
        peso +
        " unidades."
    );

    aristas.reverse();
  } else {
    if (inicio == undefined) inicio = "a";
    let ignorar = [];
    for (let i in grafica.vertices) {
      destino = i;
      antecesor = dist[inicio][destino];

      vertices.push(destino);

      while (antecesor.antecesor != inicio) {
        vertices.push(antecesor.antecesor);
        if (!ignorar.includes(antecesor.arista)) {
          aristas.push(grafica.buscaArista(antecesor.arista));
          etiquetasAristas.push(antecesor.arista);
          ignorar.push(antecesor.arista);
        }
        antecesor = dist[inicio][antecesor.antecesor];
      }

      if (!ignorar.includes(antecesor.arista)) {
        let a = grafica.buscaArista(antecesor.arista);
        if (a) {
          aristas.push(a);
          etiquetasAristas.push(a.etiqueta);
          ignorar.push(antecesor.arista);
        }
      }
      vertices.push(inicio);
    }

    let peso = 0;
    for (let i in aristas) {
      console.log(aristas[i]);
      peso += aristas[i].peso;
    }

    vaciarMensaje();
    imprimirMensaje(
      "El peso de la arborescencia con raíz en " +
        inicio +
        " es de " +
        peso +
        " unidades."
    );

    aristas = aristas.reverse();
  }

  return {
    aristas: aristas,
    vertices: vertices,
    longitud: undefined,
    msj: "",
    etiquetasAristas,
  };
};

const fordFulkerson = (red) => {
  cerrarModal();

  let flujo = 0,
    redCopia = _.cloneDeep(red);

  // ***Variante 1 (varios vertices fuente y sumidero)***

  // Se crean los vertices superfuente y supersumidero y se conectan con los fuentes y sumideros
  let { fuente, sumidero } = creaSuperVertices(
    redCopia,
    document.getElementById("ford1").value.split(","),
    document.getElementById("ford2").value.split(",")
  );

  // // ***Variante 3 (restricciones en vertices)***

  // Se crea un clon por cada vertice con restriccion y se cambian los arcos
  let { verticesDuplicados } = creaClones(redCopia);

  // ***Variante 2 (restricciones en los arcos)***

  // Se satisfacen las restricciones en los arcos
  ({ red: redCopia, objetoAristas } = satisfacerRestriccionesArcos(
    redCopia,
    fuente,
    sumidero
  ));

  // Aplicamos Ford Fulkerson
  ({ objetoAristas } = fordFulkerson2(redCopia, fuente, sumidero, Infinity));

  // Cambiamos los arcos de los vertices clon a los vertices originales y eliminamos los clones
  eliminarClones(redCopia, verticesDuplicados, objetoAristas);

  // Obtenemos el flujo total
  for (i in redCopia.aristas[sumidero])
    flujo += objetoAristas[redCopia.aristas[sumidero][i].etiqueta].flujo;

  // Terminamos de eliminar arcos y vertices ficticios
  for (let i in objetoAristas)
    if (i.includes("'") || i.includes("#")) delete objetoAristas[i];

  let msj = "El flujo maximo es de: " + flujo + " unidades";

  vaciarMensaje();
  imprimirMensaje(msj);

  return {
    objetoAristas: objetoAristas,
    flujoMax: flujo,
    msj: msj,
    costo: false,
  };
};

const fordFulkerson2 = (red, a, b, ff) => {
  let verticeActual,
    arista,
    flujo,
    flujoAumentado = 0;

  let fuente = a,
    sumidero = b,
    flujoFactible = ff;

  // Objeto aristas
  let { objetoAristas } = creaObjetoAristas(red);

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

      for (let j in red.aristas[verticeActual.etiqueta]) {
        arista = red.aristas[verticeActual.etiqueta][j];

        if (!Object.keys(etiquetasVertices).includes(arista.vertice)) {
          // Sentido propio
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
          }
          // Sentido impropio
          else if (
            arista.tipo == "entrante" &&
            objetoAristas[arista.etiqueta].flujo >
              objetoAristas[arista.etiqueta].flujoMin
          ) {
            flujo = Math.min(
              verticeActual.flujo,
              objetoAristas[arista.etiqueta].flujo -
                objetoAristas[arista.etiqueta].flujoMin
            );
          } else continue;

          flujo = Math.min(flujo, flujoFactible - flujoAumentado);

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

    // Aumentamos
    if (etiquetasVertices[sumidero] != undefined) {
      verticeActual = etiquetasVertices[sumidero];
      flujo = verticeActual.flujo;

      while (verticeActual.etiqueta != fuente) {
        let aristas = red.aristas[verticeActual.etiqueta];
        for (let i in red.aristas[verticeActual.etiqueta]) {
          if (aristas[i].vertice == verticeActual.adyacente) {
            if (verticeActual.signo == "+")
              objetoAristas[aristas[i].etiqueta].flujo += flujo;
            else objetoAristas[aristas[i].etiqueta].flujo -= flujo;
            verticeActual = etiquetasVertices[aristas[i].vertice];
            break;
          }
        }
      }
    } else break;

    flujoAumentado = 0;

    for (i in red.aristas[sumidero])
      flujoAumentado += objetoAristas[red.aristas[sumidero][i].etiqueta].flujo;

    if (flujoAumentado == flujoFactible) break;
  }

  flujoAumentado = 0;
  for (i in red.aristas[sumidero])
    flujoAumentado += objetoAristas[red.aristas[sumidero][i].etiqueta].flujo;

  let redCopia = _.cloneDeep(red);

  for (let i in objetoAristas)
    redCopia.editarArista(
      i,
      objetoAristas[i].peso,
      objetoAristas[i].flujoMin,
      objetoAristas[i].flujo,
      objetoAristas[i].flujoMax
    );

  return {
    objetoAristas: objetoAristas,
    flujoMax: flujoAumentado,
    redCopia: redCopia,
  };
};

const primal = (red) => {
  cerrarModal();

  let costo,
    objetoAristas,
    flujoMax,
    redCopia = _.cloneDeep(red);

  let flujoFactible = parseInt(document.getElementById("primal3").value);

  // Se crean los vertices superfuente y supersumidero y se conectan con los fuentes y sumideros
  let { fuente, sumidero } = creaSuperVertices(
    redCopia,
    document.getElementById("primal1").value.split(","),
    document.getElementById("primal2").value.split(",")
  );

  // Se crea un clon por cada vertice con restriccion y se cambian los arcos
  let { verticesDuplicados } = creaClones(redCopia);

  // Satisfacemos las restricciones
  ({ red: redCopia, objetoAristas } = satisfacerRestriccionesArcos(
    redCopia,
    fuente,
    sumidero
  ));

  // Aplicamos Ford Fulkerson
  ({ objetoAristas, redCopia } = fordFulkerson2(
    redCopia,
    fuente,
    sumidero,
    flujoFactible
  ));

  while (true) {
    // Creamos la red marginal
    let { redMarginal } = creaRedMarginal(redCopia);

    let datos = floyd(redMarginal, fuente, sumidero);

    if (!datos.longitud) break;

    let delta = Infinity;

    for (let i in datos.etiquetasAristas) {
      let valor = redMarginal.buscaArista(datos.etiquetasAristas[i]).flujoMax;
      delta = Math.min(delta, valor);
    }

    for (let i in datos.etiquetasAristas) {
      if (datos.etiquetasAristas[i].includes("+")) {
        let arista = objetoAristas[datos.etiquetasAristas[i].split("+")[0]];
        redCopia.editarArista(
          datos.etiquetasAristas[i].split("+")[0],
          arista.peso,
          arista.flujoMin,
          arista.flujo + delta,
          arista.flujoMax
        );

        arista.flujo += delta;
      } else {
        let arista = objetoAristas[datos.etiquetasAristas[i].split("-")[0]];

        if (arista.flujo - delta < arista.flujo)
          redCopia.editarArista(
            datos.etiquetasAristas[i].split("-")[0],
            arista.peso,
            arista.flujoMin,
            arista.flujo - delta,
            arista.flujoMax
          );
        arista.flujo -= delta;
      }
    }

    costo = 0;

    for (let i in redCopia.listaAristas)
      costo += redCopia.listaAristas[i].costo * redCopia.listaAristas[i].flujo;

    flujoTotal = 0;
    for (let i in redCopia.aristas[sumidero]) {
      if (redCopia.aristas[sumidero][i].tipo == "entrante")
        flujoTotal += redCopia.aristas[sumidero][i].flujo;
    }
  }

  // Cambiamos los arcos de los vertices clon a los vertices originales y eliminamos los clones
  eliminarClones(redCopia, verticesDuplicados, objetoAristas);

  // Terminamos de eliminar arcos y vertices ficticios
  for (let i in objetoAristas)
    if (i.includes("'") || i.includes("#")) delete objetoAristas[i];

  let msj = "El costo minimo es de " + costo + " unidades";

  console.log(objetoAristas);

  vaciarMensaje();
  imprimirMensaje(msj);

  return {
    objetoAristas: objetoAristas,
    flujoMax: flujoMax,
    msj: msj,
    costo: true,
  };
};

const dual = (red) => {
  cerrarModal();

  let costo;

  let delta,
    flujoTotal = 0,
    redCopia = _.cloneDeep(red);

  let objetoAristas, redMarginal;

  let flujoFactible = parseInt(document.getElementById("dual3").value);

  // Se crean los vertices superfuente y supersumidero y se conectan con los fuentes y sumideros
  let { fuente, sumidero } = creaSuperVertices(
    redCopia,
    document.getElementById("dual1").value.split(","),
    document.getElementById("dual2").value.split(",")
  );

  // Se crea un clon por cada vertice con restriccion y se cambian los arcos
  let { verticesDuplicados } = creaClones(redCopia);

  // Satisfacemos las restricciones
  ({ red: redCopia, objetoAristas } = satisfacerRestriccionesArcos(
    redCopia,
    fuente,
    sumidero
  ));

  for (let i in redCopia.aristas[sumidero]) {
    let a = redCopia.aristas[sumidero][i];
    if (a.tipo == "entrante") flujoTotal += a.flujo;
  }

  while (flujoTotal < flujoFactible) {
    // creamos red marginal
    ({ redMarginal, objetoAristas } = creaRedMarginal(redCopia));

    // aplicamos floyd
    let { etiquetasAristas: arcos } = floyd(redMarginal, fuente, sumidero);

    delta = Infinity;

    // calculamos delta
    for (let i in arcos) {
      let a = redMarginal.buscaArista(arcos[i]);
      delta = Math.min(delta, a.flujoMax);
    }

    // checamos que no se sobrepase el flujo factible
    if (delta + flujoTotal > flujoFactible) delta = flujoFactible - flujoTotal;

    // actualizamos la red
    for (let i in arcos) {
      let etiqueta;
      let valor;

      if (arcos[i].includes("+")) {
        etiqueta = arcos[i].split("+")[0];
        valor = delta;
      } else {
        etiqueta = arcos[i].split("-")[0];
        valor = -delta;
      }

      redCopia.editarArista(
        etiqueta,
        objetoAristas[etiqueta].peso,
        objetoAristas[etiqueta].flujoMin,
        objetoAristas[etiqueta].flujo + valor,
        objetoAristas[etiqueta].flujoMax
      );

      objetoAristas[etiqueta] = {
        fuente: objetoAristas[etiqueta].fuente,
        sumidero: objetoAristas[etiqueta].sumidero,
        flujoMin: objetoAristas[etiqueta].flujoMin,
        flujo: objetoAristas[etiqueta].flujo + valor,
        flujoMax: objetoAristas[etiqueta].flujoMax,
        costo: objetoAristas[etiqueta].costo,
        peso: objetoAristas[etiqueta].costo,
      };
    }

    // calculamos el flujo total
    flujoTotal = 0;
    for (let i in redCopia.aristas[sumidero]) {
      let arco = redCopia.aristas[sumidero][i];
      if (arco.tipo == "entrante") flujoTotal += arco.flujo;
    }

    costo = 0;
    // calculamos el costo
    for (let i in objetoAristas)
      costo += objetoAristas[i].flujo * objetoAristas[i].costo;
  }

  // Cambiamos los arcos de los vertices clon a los vertices originales y eliminamos los clones
  eliminarClones(redCopia, verticesDuplicados, objetoAristas);

  // Terminamos de eliminar arcos y vertices ficticios
  for (let i in objetoAristas)
    if (i.includes("'") || i.includes("#")) delete objetoAristas[i];

  let msj = {
    text: "El costo minimo es de " + costo + " unidades",
    color: "text-green-500",
  };

  vaciarMensaje();
  imprimirMensaje(msj.text);

  return { objetoAristas: objetoAristas, msj, costo: true };
};

const simplex = (red) => {
  cerrarModal();

  let redCopia = _.cloneDeep(red),
    numAristasSolucion = 0;

  // Agregamos el vertice puente
  redCopia.agregarVertice("puente");

  for (let i in red.listaAristas) {
    let a = red.listaAristas[i];

    redCopia.editarArista(
      a.etiqueta,
      a.flujoMin,
      a.flujoMin,
      a.flujo,
      a.flujoMax
    );

    red.editarArista(a.etiqueta, a.flujoMin, a.flujoMin, a.flujo, a.flujoMax);
  }

  // Agregamos las aristas ficticias
  for (let i in red.vertices) {
    let vertice = redCopia.vertices[i];
    let valor = vertice.valor;

    for (let j in red.aristas[vertice.etiqueta]) {
      let arco = redCopia.aristas[vertice.etiqueta][j];

      if (arco.tipo == "entrante") {
        valor += arco.peso;
      } else {
        valor -= arco.peso;
      }
    }

    if (valor > 0) {
      redCopia.agregarArista(
        vertice.etiqueta + "%",
        vertice.etiqueta,
        "puente",
        valor,
        0,
        0,
        Infinity,
        1
      );
    } else if (valor < 0) {
      redCopia.agregarArista(
        vertice.etiqueta + "%",
        "puente",
        vertice.etiqueta,
        -valor,
        0,
        0,
        Infinity,
        1
      );
    }
  }

  // Cambiamos los arcos reales
  for (let i in red.listaAristas) {
    let arco = redCopia.listaAristas[i];
    arco.costo = 0;
  }

  // console.log(redCopia);
  // console.log(red);

  let solucion = [],
    noSolucion = [];

  for (let i in redCopia.listaAristas) {
    let arco = redCopia.listaAristas[i];
    if (arco.peso > arco.flujoMin && arco.peso < arco.flujoMax)
      solucion.push(arco.etiqueta);
    else noSolucion.push(arco.etiqueta);
  }

  ({ objetoAristas, solucion } = simplexBasico(
    redCopia,
    solucion,
    noSolucion,
    true
  ));

  // console.log(objetoAristas);
  // return;

  let primeraSolucion = [];
  // aristas.push(soluciones);
  // aristas.push(objetoAristas);

  for (let i in objetoAristas) {
    if (!i.includes("%")) {
      red.editarArista(
        i,
        objetoAristas[i].peso,
        objetoAristas[i].flujoMin,
        objetoAristas[i].flujo,
        objetoAristas[i].flujoMax
      );

      primeraSolucion.push(objetoAristas[i]);
    }
  }

  // console.log(primeraSolucion);
  // console.log(soluciones);

  // return;

  noSolucion = [];

  for (let i in red.listaAristas) {
    if (!solucion.includes(red.listaAristas[i].etiqueta))
      noSolucion.push(red.listaAristas[i].etiqueta);
  }

  console.log(solucion);
  console.log(noSolucion);

  ({
    aristas: arcos,
    vertices: v,
    objetoAristas,
    msj: text,
    soluciones,
  } = simplexBasico(red, solucion, noSolucion));

  // console.log(
  //   ({
  //     aristas: arcos,
  //     vertices: v,
  //     objetoAristas,
  //     msj: text,
  //     soluciones,
  //   } = simplexBasico(red))
  // );

  soluciones["0"] = primeraSolucion;

  let msj = { text: text, color: "text-green-500" };

  v = [];

  for (let i in red.vertices) {
    v.push(i + "\n" + red.vertices[i].valor);
  }

  // console.log(soluciones);

  // for (let i in soluciones[
  //   Object.keys(soluciones)[Object.keys(soluciones).length - 1]
  // ]) {
  //   if (
  //     soluciones[Object.keys(soluciones)[Object.keys(soluciones).length - 1]][i]
  //       .peso >
  //       soluciones[Object.keys(soluciones)[Object.keys(soluciones).length - 1]][
  //         i
  //       ].flujoMin &&
  //     soluciones[Object.keys(soluciones)[Object.keys(soluciones).length - 1]][i]
  //       .peso <
  //       soluciones[Object.keys(soluciones)[Object.keys(soluciones).length - 1]][
  //         i
  //       ].flujoMax
  //   ) {
  //     numAristasSolucion++;
  //   }
  // }

  // if (numAristasSolucion != red.numVertices - 1) {
  //   solucion = false;
  //   msj = {
  //     text: "La red de transporte no tiene solución",
  //     color: "text-red-500",
  //   };
  // }

  console.log(soluciones);

  return {
    objetoAristas,
    msj,
    aristas: solucion,
    vertices: v,
    iteraciones: soluciones,
    solucion,
  };
};
