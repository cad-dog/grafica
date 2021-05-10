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

  let inicial = document.getElementById("dijkstra")
    ? document.getElementById("dijkstra").value
    : "a";

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

          return { aristas: ciclo, vertices: vertices, longitud: pesoCiclo };
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

const floyd = (grafica, a, b) => {
  let dist = {},
    antecesor,
    vertices = [],
    aristas = [],
    longitud = 0;

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
      if (arista.tipo === "saliente")
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
          aristas.push(antecesor.arista);
          ciclo.push(grafica.buscaArista(antecesor.arista));
          antecesor = dist[i][antecesor.antecesor];
        }

        let mensaje = document.getElementById("mensaje");

        // Vaciamos el mensaje de salida
        mensaje.innerHTML = "";
        mensaje.classList.remove("text-red-500", "text-green-500");

        mensaje.classList.add("text-red-500");
        mensaje.innerHTML =
          "<p>La longitud del ciclo negativo es: " + longitud + " unidades";

        return {
          vertices: vertices,
          aristas: aristas,
          ciclo: ciclo,
          longitud: longitud,
        };
      }
    }
  }

  if (destino != "" && inicio != "") {
    console.log(inicio);
    console.log(destino);

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
  } else {
    inicio = "a";
    for (let i in grafica.vertices) {
      destino = i;
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
    }
  }

  return { aristas: aristas, vertices: vertices, longitud: undefined };
};

const fordFulkerson = (grafica) => {
  let arista,
    flujo,
    verticesDuplicados = [];

  let graficaCopia = _.cloneDeep(grafica);

  // // ***Variante 1 (varios vertices fuente y sumidero)***
  let { fuente, sumidero } = creaSuperVertices(
    graficaCopia,
    document.getElementById("ford1").value.split(","),
    document.getElementById("ford2").value.split(",")
  );

  // // ***Variante 3 (restricciones en vertices)***

  // // Ciclo para encontrar los vertices con restricciones
  // // creaClones(red)

  for (let i in graficaCopia.vertices) {
    // Si el vertice tiene restricciones
    let vertice = graficaCopia.vertices[i];

    if (vertice.flujoMin != undefined || vertice.flujoMax != undefined) {
      // Creamos un vertice clon
      verticesDuplicados.push(i.toUpperCase());
      graficaCopia.agregarVertice(i.toUpperCase());

      // Ciclo para agregar los arcos salientes del vertice original al vertice clon
      let eliminar = [];

      for (let j in graficaCopia.aristas[i]) {
        if (graficaCopia.aristas[i][j].tipo == "saliente") {
          graficaCopia.agregarArista(
            i.toUpperCase(),
            graficaCopia.aristas[i][j].vertice,
            graficaCopia.aristas[i][j].flujoMax,
            graficaCopia.aristas[i][j].etiqueta + "#",
            graficaCopia.aristas[i][j].flujoMin
          );

          eliminar.push(graficaCopia.aristas[i][j].etiqueta);
        }
      }

      // Ciclo para eliminar los arcos que agregamos al vertice clon
      for (let j in eliminar) graficaCopia.eliminarArista(eliminar[j]);

      // Conectamos el vertice original con el vertice clon
      graficaCopia.agregarArista(
        i,
        i.toUpperCase(),
        vertice.flujoMax,
        i + "#",
        vertice.flujoMin,
        "0"
      );
    }
  }

  // ***Variante 2 (restricciones en los arcos)***
  ({ red: graficaCopia, objetoAristas } = satisfacerRestriccionesArcos(
    graficaCopia,
    fuente,
    sumidero
  ));

  // Aplicamos Ford Fulkerson normal
  ({ objetoAristas } = fordFulkerson2(
    graficaCopia,
    fuente,
    sumidero,
    Infinity
  ));

  // Cambiamos los arcos de los vertices clon a los vertices originales
  for (let i in verticesDuplicados) {
    let duplicado = verticesDuplicados[i];
    for (let j in graficaCopia.aristas[duplicado]) {
      arista = graficaCopia.aristas[duplicado][j];
      if (arista.tipo == "saliente") {
        graficaCopia.agregarArista(
          duplicado.toLocaleLowerCase(),
          arista.vertice,
          objetoAristas[arista.etiqueta].flujoMax,
          arista.etiqueta,
          objetoAristas[arista.etiqueta].flujoMin,
          objetoAristas[arista.etiqueta].flujo
        );

        objetoAristas[arista.etiqueta.split("#")[0]] = {
          fuente: duplicado.toLowerCase(),
          sumidero: arista.vertice,
          flujoMin: objetoAristas[arista.etiqueta].flujoMin,
          flujo: objetoAristas[arista.etiqueta].flujo,
          flujoMax: objetoAristas[arista.etiqueta].flujoMax,
        };

        delete objetoAristas[arista.etiqueta];
      }
    }

    // Eliminamos los vertices clon
    graficaCopia.eliminarVertice(duplicado);
  }

  // Obtenemos el flujo total
  flujo = 0;

  for (i in graficaCopia.aristas[sumidero])
    flujo += objetoAristas[graficaCopia.aristas[sumidero][i].etiqueta].flujo;

  if (fuente == "superfuente") {
    graficaCopia.eliminarVertice(fuente);
  }
  if (sumidero == "supersumidero") graficaCopia.eliminarVertice(sumidero);

  // Terminamos de eliminar arcos y vertices ficticios
  for (let i in objetoAristas)
    if (i.includes("'") || i.includes("#")) delete objetoAristas[i];

  let msj = "El flujo maximo es de: " + flujo + " unidades";

  return { objetoAristas: objetoAristas, flujoMax: flujo, msj: msj };
};

const fordFulkerson2 = (red, a, b, ff) => {
  let verticeActual,
    arista,
    flujo,
    flujoAumentado = 0;

  let fuente = a || "a",
    sumidero = b || "b",
    flujoFactible = ff;

  // Objeto aristas
  let { objetoAristas } = creaObjetoAristas(red);

  // let iteracion = 0;
  while (true) {
    // if (iteracion == 1) console.log("AAAA");
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

          // flujo = Math.min(flujo, flujoFactible - flujoAumentado);

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
      console.log("Cadena");

      verticeActual = etiquetasVertices[sumidero];

      flujo = verticeActual.flujo;

      while (verticeActual.etiqueta != fuente) {
        console.log("delta:", verticeActual.signo + flujo);

        let aristas = red.aristas[verticeActual.etiqueta];
        for (let i in red.aristas[verticeActual.etiqueta]) {
          if (aristas[i].vertice == verticeActual.adyacente) {
            console.log(
              "Arco:",
              aristas[i].etiqueta +
                "(" +
                objetoAristas[aristas[i].etiqueta].fuente,
              verticeActual.signo == "+" ? "->" : "<-",
              objetoAristas[aristas[i].etiqueta].sumidero + ")",
              "flujo:",
              objetoAristas[aristas[i].etiqueta].flujo,
              "flujoMax:",
              objetoAristas[aristas[i].etiqueta].flujoMax
            );

            if (verticeActual.signo == "+")
              objetoAristas[aristas[i].etiqueta].flujo += flujo;
            else objetoAristas[aristas[i].etiqueta].flujo -= flujo;

            console.log(
              "Arco:",
              aristas[i].etiqueta +
                "(" +
                objetoAristas[aristas[i].etiqueta].fuente,
              verticeActual.signo == "+" ? "->" : "<-",
              objetoAristas[aristas[i].etiqueta].sumidero + ")",
              "flujo:",
              objetoAristas[aristas[i].etiqueta].flujo,
              "flujoMax:",
              objetoAristas[aristas[i].etiqueta].flujoMax
            );

            verticeActual = etiquetasVertices[aristas[i].vertice];

            break;
          }
        }
      }
    } else break;

    flujoAumentado = 0;

    for (i in red.aristas[sumidero])
      flujoAumentado += objetoAristas[red.aristas[sumidero][i].etiqueta].flujo;

    // if (flujoAumentado == flujoFactible) break;
    //iteracion++;
  }

  flujoAumentado = 0;
  for (i in red.aristas[sumidero])
    flujoAumentado += objetoAristas[red.aristas[sumidero][i].etiqueta].flujo;

  let redCopia = _.cloneDeep(red);

  for (let i in objetoAristas)
    redCopia.editarArista(
      i,
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
  let costo;
  let objetoAristas, flujoMax, flujoTotal;

  let fuente = document.getElementById("primal1").value,
    sumidero = document.getElementById("primal2").value,
    flujoFactible = parseInt(document.getElementById("primal3").value);

  // Satisfacemos las restricciones
  ({ red, objetoAristas } = satisfacerRestriccionesArcos(
    red,
    fuente,
    sumidero
  ));

  // Aplicamos Ford Fulkerson
  ({ objetoAristas, redCopia: red } = fordFulkerson2(
    red,
    fuente,
    sumidero,
    flujoFactible
  ));

  while (true) {
    // Creamos la red marginal
    let { redMarginal } = creaRedMarginal(red);

    let datos = floyd(redMarginal, fuente, sumidero);

    if (!datos.longitud) break;

    let delta = Infinity;

    for (let i in datos.aristas) {
      let valor = redMarginal.buscaArista(datos.aristas[i]).flujoMax;
      delta = Math.min(delta, valor);
    }

    for (let i in datos.aristas) {
      let etiqueta;
      console.log(datos.aristas[i]);

      if (datos.aristas[i].includes("+"))
        etiqueta = datos.aristas[i].split("+")[0];
      else etiqueta = datos.aristas[i].split("-")[0];

      let arista = red.buscaArista(etiqueta);

      if (arista.flujo - delta < arista.flujoMin && arista.flujoMin > 0)
        delta = arista.flujo - arista.flujoMin;
    }

    console.log(delta);
    console.log(datos);

    for (let i in datos.aristas) {
      if (datos.aristas[i].includes("+")) {
        let arista = objetoAristas[datos.aristas[i].split("+")[0]];
        red.editarArista(
          datos.aristas[i].split("+")[0],
          arista.flujoMin,
          arista.flujo + delta,
          arista.flujoMax
        );

        arista.flujo += delta;
      } else {
        let arista = objetoAristas[datos.aristas[i].split("-")[0]];

        if (arista.flujo - delta < arista.flujo)
          red.editarArista(
            datos.aristas[i].split("-")[0],
            arista.flujoMin,
            arista.flujo - delta,
            arista.flujoMax
          );
        arista.flujo -= delta;
      }
    }

    costo = 0;

    for (let i in red.listaAristas)
      costo += red.listaAristas[i].costo * red.listaAristas[i].flujo;

    flujoTotal = 0;
    for (let i in red.aristas[sumidero]) {
      if (red.aristas[sumidero][i].tipo == "entrante")
        flujoTotal += red.aristas[sumidero][i].flujo;
    }
    console.log(flujoTotal);
    console.log(red);
    console.log(objetoAristas);
    console.log(costo);

    console.log("a");
  }

  let msj = "El costo minimo es de " + costo + " unidades";

  console.log(objetoAristas);
  return { objetoAristas: objetoAristas, flujoMax: flujoMax, msj: msj };
};

const dual = (red) => {
  let costo;

  let delta,
    flujoTotal = 0,
    objetoAristas2;

  // let iteracion = 0;

  let objetoAristas, flujoMax, redMarginal;

  let fuente = document.getElementById("dual1").value,
    sumidero = document.getElementById("dual2").value,
    flujoFactible = parseInt(document.getElementById("dual3").value);

  // Satisfacemos las restricciones
  ({ red, objetoAristas } = satisfacerRestriccionesArcos(
    red,
    fuente,
    sumidero
  ));

  while (flujoTotal < flujoFactible) {
    // if (iteracion == 3) break;
    // console.log(red);

    // creamos red marginal
    ({ redMarginal, objetoAristas } = creaRedMarginal(red));

    // aplicamos floyd
    let { aristas } = floyd(redMarginal, fuente, sumidero);

    delta = Infinity;

    // calculamos delta
    for (let i in aristas) {
      let etiqueta;
      if (aristas[i].includes("+")) etiqueta = aristas[i].split("+")[0];
      else etiqueta = aristas[i].split("-")[0];

      delta = Math.min(
        delta,
        objetoAristas[etiqueta].flujoMax - objetoAristas[etiqueta].flujo
      );
    }

    // checamos que no se sobrepase el flujo factible
    if (delta + flujoTotal > flujoFactible) delta = flujoFactible - flujoTotal;

    // actualizamos la red
    for (let i in aristas) {
      let etiqueta;

      if (aristas[i].includes("+")) etiqueta = aristas[i].split("+")[0];
      else etiqueta = aristas[i].split("-")[0];

      red.editarArista(
        etiqueta,
        objetoAristas[etiqueta].flujoMin,
        objetoAristas[etiqueta].flujo + delta,
        objetoAristas[etiqueta].flujo
      );

      objetoAristas[etiqueta].flujo += delta;
    }

    // calculamos el flujo total
    flujoTotal = 0;
    for (let i in red.aristas[sumidero]) {
      let arco = red.aristas[sumidero][i];
      if (arco.tipo == "entrante") flujoTotal += arco.flujo;
    }

    costo = 0;
    // calculamos el costo
    for (let i in objetoAristas)
      costo += objetoAristas[i].flujo * objetoAristas[i].costo;

    objetoAristas2 = objetoAristas;

    console.log(costo);

    console.log(flujoTotal);

    console.log(delta);

    console.log(objetoAristas);

    // iteracion++;
  }

  let msj = "El costo minimo es de " + costo + " unidades";
  return { objetoAristas: objetoAristas2, msj: msj };
};
