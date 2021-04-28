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
    hayCiclo = false,
    longitud = 0,
    etiquetaAntecesor;

  a = "a";
  b = "g";

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
  for (let i in grafica.vertices) {
    for (let j in grafica.vertices) {
      for (let k in grafica.vertices) {
        if (dist[i][k].peso + dist[k][j].peso < dist[i][j].peso) {
          dist[i][j] = {
            etiqueta: j,
            antecesor: dist[k][j].antecesor,
            peso: dist[i][k].peso + dist[k][j].peso,
            arista: dist[k][j].arista,
          };
          if (i == j && dist[i][k].peso + dist[k][j].peso < 0) {
            hayCiclo = true;
            break;
          }
        } else {
          dist[i][j] = {
            etiqueta: j,
            antecesor: dist[i][j].antecesor,
            peso: dist[i][j].peso,
            arista: dist[i][j].arista,
          };
        }
      }
    }
  }

  let cola = [];

  console.log(dist);

  for (let i in grafica.vertices)
    if (dist[i][i].peso < 0) cola.push(dist[i][i]);

  if (hayCiclo) {
    let ciclo;

    while (cola.length > 0) {
      let valor = 0;
      ciclo = [];
      antecesor = cola.shift();
      etiquetaAntecesor = antecesor.etiqueta;
      (vertices = []), (aristas = []);

      longitud = antecesor.peso;
      while (true) {
        if (vertices.includes(antecesor.antecesor)) break;
        vertices.push(antecesor.antecesor);
        aristas.push(antecesor.arista);
        ciclo.push(grafica.buscaArista(antecesor.arista));
        antecesor = dist[etiquetaAntecesor][antecesor.antecesor];
      }

      for (let i in ciclo) {
        valor += ciclo[i].peso;
      }

      if (valor == longitud) break;
    }

    let mensaje = document.getElementById("mensaje");

    // Vaciamos el mensaje de salida
    mensaje.innerHTML = "";
    mensaje.classList.remove("text-red-500", "text-green-500");

    mensaje.classList.add("text-red-500");
    mensaje.innerHTML =
      "<p>La longitud del ciclo negativo es: " + longitud + " unidades";

    return {
      aristas: aristas,
      vertices: vertices,
      longitud: longitud,
      ciclo: ciclo,
    };
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

  return { aristas: aristas, vertices: vertices, longitud: undefined };
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

  // ***Variante 1 (varios vertices fuente y sumidero)***

  // Ciclo para encontrar los vertices fuente y sumidero de la red de transporte
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

  fuente = document.getElementById("ford1").value.split(",");
  sumidero = document.getElementById("ford2").value.split(",");

  // Si hay mas de un vertice fuente
  if (fuente.length > 1) {
    // Se agrega un vertice superfuente
    graficaCopia.agregarVertice("superfuente");

    // Se conectan los vertices fuente con el superfuente
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

  // Si hay mas de un vertice sumidero
  if (sumidero.length > 1) {
    // Se agrega un vertice supersumidero
    graficaCopia.agregarVertice("supersumidero");

    // Se conectan los vertices fuente con el supersumidero
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

  console.log(fuente);
  console.log(sumidero);

  // ***Variante 3 (restricciones en vertices)***

  // Ciclo para encontrar los vertices con restricciones
  for (let i in graficaCopia.vertices) {
    // Si el vertice tiene restricciones
    if (
      graficaCopia.vertices[i].flujoMin != undefined ||
      graficaCopia.vertices[i].flujoMax != undefined
    ) {
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
        graficaCopia.vertices[i].flujoMax,
        i + "#",
        graficaCopia.vertices[i].flujoMin,
        "0"
      );
    }
  }

  // Objeto de aristas
  for (let i = 0; i < graficaCopia.listaAristas.length; i++) {
    objetoAristas[graficaCopia.listaAristas[i].etiqueta] = {
      fuente: graficaCopia.listaAristas[i].v1,
      sumidero: graficaCopia.listaAristas[i].v2,
      flujoMin: graficaCopia.listaAristas[i].flujoMin,
      flujo: graficaCopia.listaAristas[i].flujo,
      flujoMax: graficaCopia.listaAristas[i].flujoMax,
    };

    // Si hay arcos con restriccion los agregamos a un arreglo
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

  // ***Variante 2 (restricciones en los arcos)***

  // Si hay arcos con restriccion
  if (arcosRestriccion.length > 0) {
    // Creamos un vertice fuente y sumidero ficticios
    graficaCopia.agregarVertice("A'");
    graficaCopia.agregarVertice("Z'");

    // Por cada arco con restriccion
    for (let i in arcosRestriccion) {
      // Buscamos un arco que conecte al vertice fuente ficticio con el vertice destino del arco
      let arco = graficaCopia.buscaArista2("A'", arcosRestriccion[i].v2);

      // Si no se encuentra un arco
      if (!arco) {
        // Creamos una arco
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
      }
      // Si se encuentra un arco
      else {
        // Cambiamos el flujo maximo del arco existente
        graficaCopia.editarArista(
          arco.etiqueta,
          arco.flujoMin,
          arco.flujo,
          arco.flujoMax + arcosRestriccion[i].flujoMin
        );

        objetoAristas[arco.etiqueta] = {
          fuente: arco.v1,
          sumidero: arco.v2,
          flujoMin: arco.flujoMin,
          flujo: arco.flujo,
          flujoMax: arco.flujoMax,
        };
      }

      // Buscamos un arco que conecte al vertice sumidero ficticio con el vertice inicial del arco
      arco = graficaCopia.buscaArista2(arcosRestriccion[i].v1, "Z'");

      // Si no se encuentra un arco
      if (!arco) {
        // Creamos una arco
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
      }
      // Si se encuentra un arco
      else {
        // Cambiamos el flujo maximo del arco existente
        graficaCopia.editarArista(
          arco.etiqueta,
          arco.flujoMin,
          arco.flujo,
          arco.flujoMax + arcosRestriccion[i].flujoMin
        );

        objetoAristas[arco.etiqueta] = {
          fuente: arco.v1,
          sumidero: arco.v2,
          flujoMin: arco.flujoMin,
          flujo: arco.flujo,
          flujoMax: arco.flujoMax,
        };
      }

      // Quitamos la restriccion del arco
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

    // Conectamos los vertices fuente y sumidero ficticios
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

    // Aplicamos Ford Fulkerson a la grafica ficticia
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
        arcosRestriccion[i].flujoMin,
        arcosRestriccion[i].flujoMin +
          objetoAristas[arcosRestriccion[i].etiqueta].flujo
      );

      objetoAristas[arcosRestriccion[i].etiqueta] = {
        fuente: arcosRestriccion[i].v1,
        sumidero: arcosRestriccion[i].v2,
        flujoMin: arcosRestriccion[i].flujoMin,
        flujo:
          arcosRestriccion[i].flujoMin +
          objetoAristas[arcosRestriccion[i].etiqueta].flujo,
        flujoMax: arcosRestriccion[i].flujoMax,
      };
    }

    // Eliminamos las aristas ficticias
    graficaCopia.eliminarArista("e*");
    graficaCopia.eliminarArista("e**");

    for (let i in objetoAristas) if (i.includes("*")) delete objetoAristas[i];

    // Eliminamos los vertices ficticios
    graficaCopia.eliminarVertice("A'");
    graficaCopia.eliminarVertice("Z'");
  }

  // Aplicamos Ford Fulkerson normal
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
      }
    }

    // Eliminamos los vertices clon
    graficaCopia.eliminarVertice(duplicado);
  }

  // Obtenemos el flujo total
  flujo = 0;

  for (i in graficaCopia.aristas[sumidero]) {
    flujo += objetoAristas[graficaCopia.aristas[sumidero][i].etiqueta].flujo;
  }

  console.log(objetoAristas);
  // Terminamos de eliminar arcos y vertices ficticios
  for (let i in objetoAristas)
    if (i.includes("'") || i.includes("#")) delete objetoAristas[i];

  return { objetoAristas: objetoAristas, flujoMax: flujo };
};

// const fordFulkersonBasico = (grafica, aristas, fuente, sumidero) => {
//   let verticeActual,
//     arista,
//     flujo,
//     objetoAristas = aristas || {},

//   if (Object.keys(objetoAristas).length < 1)
//     for (let i = 0; i < grafica.listaAristas.length; i++) {
//       objetoAristas[grafica.listaAristas[i].etiqueta] = {
//         fuente: grafica.listaAristas[i].v1,
//         sumidero: grafica.listaAristas[i].v2,
//         flujoMin: grafica.listaAristas[i].flujoMin,
//         flujo: grafica.listaAristas[i].flujo,
//         flujoMax: grafica.listaAristas[i].flujoMax,
//       };
//     }

//   while (true) {
//     let etiquetasVertices = {},
//       cola = [];

//     verticeActual = {
//       etiqueta: fuente,
//       adyacente: fuente,
//       flujo: Infinity,
//       signo: "+",
//     };
//     etiquetasVertices[verticeActual.etiqueta] = verticeActual;

//     cola.push(verticeActual.etiqueta);

//     while (etiquetasVertices[sumidero] == undefined && cola.length > 0) {
//       verticeActual = etiquetasVertices[cola.shift()];

//       for (let j in grafica.aristas[verticeActual.etiqueta]) {
//         arista = grafica.aristas[verticeActual.etiqueta][j];

//         if (!Object.keys(etiquetasVertices).includes(arista.vertice)) {
//           if (
//             arista.tipo == "saliente" &&
//             objetoAristas[arista.etiqueta].flujo <
//               objetoAristas[arista.etiqueta].flujoMax
//           ) {
//             flujo = Math.min(
//               verticeActual.flujo,
//               objetoAristas[arista.etiqueta].flujoMax -
//                 objetoAristas[arista.etiqueta].flujo
//             );
//           } else if (
//             arista.tipo == "entrante" &&
//             objetoAristas[arista.etiqueta].flujo >
//               objetoAristas[arista.etiqueta].flujoMin
//           ) {
//             flujo = Math.min(
//               verticeActual.flujo,
//               objetoAristas[arista.etiqueta].flujo
//             );
//           } else {
//             continue;
//           }

//           etiquetasVertices[arista.vertice] = {
//             etiqueta: arista.vertice,
//             adyacente: verticeActual.etiqueta,
//             flujo: flujo,
//             signo: arista.tipo == "saliente" ? "+" : "-",
//           };

//           cola.push(arista.vertice);
//         }
//       }
//     }

//     if (etiquetasVertices[sumidero] != undefined) {
//       verticeActual = etiquetasVertices[sumidero];

//       flujo = verticeActual.flujo;

//       while (verticeActual.etiqueta != fuente) {
//         for (let i in grafica.aristas[verticeActual.etiqueta]) {
//           if (
//             grafica.aristas[verticeActual.etiqueta][i].vertice ==
//             verticeActual.adyacente
//           ) {
//             objetoAristas[
//               grafica.aristas[verticeActual.etiqueta][i].etiqueta
//             ].flujo += flujo;
//             verticeActual =
//               etiquetasVertices[
//                 grafica.aristas[verticeActual.etiqueta][i].vertice
//               ];
//             break;
//           }
//         }
//       }
//     } else break;
//   }
// };

const fordFulkerson2 = (grafica) => {
  let verticeActual,
    arista,
    flujo,
    flujoAumentado = 0,
    objetoAristas = {};

  // let fuente = document.getElementById("primal1").value,
  //   sumidero = document.getElementById("primal2").value,
  //   flujoFactible = document.getElementById("primal3").value;

  let fuente = "a",
    sumidero = "g",
    flujoFactible = 15;

  // Objeto aristas
  for (let i = 0; i < grafica.listaAristas.length; i++) {
    objetoAristas[grafica.listaAristas[i].etiqueta] = {
      fuente: grafica.listaAristas[i].v1,
      sumidero: grafica.listaAristas[i].v2,
      flujoMax: grafica.listaAristas[i].flujoMax,
      flujo: 0,
    };
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

      for (let j in grafica.aristas[verticeActual.etiqueta]) {
        arista = grafica.aristas[verticeActual.etiqueta][j];

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
            objetoAristas[arista.etiqueta].flujo > 0
          ) {
            flujo = Math.min(
              verticeActual.flujo,
              objetoAristas[arista.etiqueta].flujo
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
        let aristas = grafica.aristas[verticeActual.etiqueta];
        for (let i in grafica.aristas[verticeActual.etiqueta]) {
          if (aristas[i].vertice == verticeActual.adyacente) {
            objetoAristas[aristas[i].etiqueta].flujo += flujo;
            verticeActual = etiquetasVertices[aristas[i].vertice];
            break;
          }
        }
      }
    } else break;

    flujoAumentado = 0;

    for (i in grafica.aristas[sumidero])
      flujoAumentado +=
        objetoAristas[grafica.aristas[sumidero][i].etiqueta].flujo;

    if (flujoAumentado == flujoFactible) break;
  }

  return { objetoAristas: objetoAristas, flujoMax: flujoAumentado };
};

const primal = (grafica) => {
  // aplicamos Ford Fulkerson
  let { objetoAristas, flujoMax } = fordFulkerson2(grafica);

  for (let i in grafica.listaAristas) {
    let arista = objetoAristas[grafica.listaAristas[i].etiqueta];
    grafica.editarArista(
      grafica.listaAristas[i].etiqueta,
      arista.flujoMin,
      arista.flujo,
      arista.flujoMax
    );
  }

  // loop: while (true) {
  let graficaCopia = _.cloneDeep(grafica);

  // ITERACION 1//////////////////////////////////////////////////////////////////////////////////////////

  let costo = 0;

  console.log(grafica);

  for (let i in objetoAristas) {
    if (objetoAristas[i].flujo)
      graficaCopia.agregarArista(
        objetoAristas[i].sumidero,
        objetoAristas[i].fuente,
        objetoAristas[i].flujo,
        i + "-",
        "0",
        "0",
        -graficaCopia.buscaArista(i).costo
      );

    graficaCopia.agregarArista(
      objetoAristas[i].fuente,
      objetoAristas[i].sumidero,
      objetoAristas[i].flujoMax - objetoAristas[i].flujo,
      i + "+",
      "0",
      "0",
      graficaCopia.buscaArista(i).costo
    );
    graficaCopia.eliminarArista(i);
  }

  let datos = floyd(graficaCopia);

  console.log(datos);
  // if (datos.ciclo.length < 1) break loop;

  console.log(datos.aristas);
  console.log(graficaCopia.aristas);

  let delta = Infinity;
  for (let i in datos.aristas) {
    let valor = graficaCopia.buscaArista(datos.aristas[i]).flujoMax;
    if (valor < delta) delta = valor;
  }

  console.log(delta);

  for (let i in datos.aristas) {
    console.log(datos.aristas[i]);

    if (datos.aristas[i].split("+")[0].length == 2) {
      let arista = objetoAristas[datos.aristas[i].split("+")[0]];
      console.log(datos);
      grafica.editarArista(
        datos.aristas[i].split("+")[0],
        arista.flujoMin,
        arista.flujo + delta,
        arista.flujoMax
      );

      arista.flujo += delta;
    } else if (datos.aristas[i].split("-")[0].length == 2) {
      let arista = objetoAristas[datos.aristas[i].split("-")[0]];
      grafica.editarArista(
        datos.aristas[i].split("-")[0],
        arista.flujoMin,
        arista.flujo - delta,
        arista.flujoMax
      );
      arista.flujo -= delta;
    }
  }

  for (let i in grafica.listaAristas) {
    let arista = objetoAristas[grafica.listaAristas[i].etiqueta];
    grafica.editarArista(
      grafica.listaAristas[i].etiqueta,
      arista.flujoMin,
      arista.flujo,
      arista.flujoMax
    );
  }

  for (let i in grafica.listaAristas) {
    costo += grafica.listaAristas[i].costo * grafica.listaAristas[i].flujo;
  }

  console.log("Costo");
  console.log(costo);
  console.log(graficaCopia);
  console.log(objetoAristas);
  // }

  console.log(grafica.listaAristas);

  // // ITERACION 2//////////////////////////////////////////////////////////////////////////////////////////
  costo = 0;
  graficaCopia = _.cloneDeep(grafica);

  console.log(graficaCopia);
  console.log(grafica);

  for (let i in objetoAristas) {
    if (objetoAristas[i].flujo)
      graficaCopia.agregarArista(
        objetoAristas[i].sumidero,
        objetoAristas[i].fuente,
        objetoAristas[i].flujo,
        i + "-",
        "0",
        "0",
        -graficaCopia.buscaArista(i).costo
      );

    graficaCopia.agregarArista(
      objetoAristas[i].fuente,
      objetoAristas[i].sumidero,
      objetoAristas[i].flujoMax - objetoAristas[i].flujo,
      i + "+",
      "0",
      "0",
      graficaCopia.buscaArista(i).costo
    );
    graficaCopia.eliminarArista(i);
  }

  datos = floyd(graficaCopia);

  console.log(datos);
  // if (datos.ciclo.length < 1) break loop;

  console.log(datos.aristas);
  console.log(graficaCopia.aristas);

  delta = Infinity;
  for (let i in datos.aristas) {
    let valor = graficaCopia.buscaArista(datos.aristas[i]).flujoMax;
    if (valor < delta) delta = valor;
  }

  console.log(delta);

  for (let i in datos.aristas) {
    console.log(datos.aristas[i]);

    if (datos.aristas[i].split("+")[0].length == 2) {
      let arista = objetoAristas[datos.aristas[i].split("+")[0]];
      console.log(datos);
      grafica.editarArista(
        datos.aristas[i].split("+")[0],
        arista.flujoMin,
        arista.flujo + delta,
        arista.flujoMax
      );

      arista.flujo += delta;
    } else if (datos.aristas[i].split("-")[0].length == 2) {
      let arista = objetoAristas[datos.aristas[i].split("-")[0]];
      grafica.editarArista(
        datos.aristas[i].split("-")[0],
        arista.flujoMin,
        arista.flujo - delta,
        arista.flujoMax
      );
      arista.flujo -= delta;
    }
  }

  for (let i in grafica.listaAristas) {
    let arista = objetoAristas[grafica.listaAristas[i].etiqueta];
    grafica.editarArista(
      grafica.listaAristas[i].etiqueta,
      arista.flujoMin,
      arista.flujo,
      arista.flujoMax
    );
  }

  for (let i in grafica.listaAristas)
    costo += grafica.listaAristas[i].costo * grafica.listaAristas[i].flujo;

  console.log("Costo");
  console.log(costo);
  console.log(graficaCopia);

  // // ITERACION 3//////////////////////////////////////////////////////////////////////////////////////////
  costo = 0;
  graficaCopia = _.cloneDeep(grafica);

  console.log(graficaCopia);
  console.log(grafica);

  for (let i in objetoAristas) {
    if (objetoAristas[i].flujo)
      graficaCopia.agregarArista(
        objetoAristas[i].sumidero,
        objetoAristas[i].fuente,
        objetoAristas[i].flujo,
        i + "-",
        "0",
        "0",
        -graficaCopia.buscaArista(i).costo
      );

    graficaCopia.agregarArista(
      objetoAristas[i].fuente,
      objetoAristas[i].sumidero,
      objetoAristas[i].flujoMax - objetoAristas[i].flujo,
      i + "+",
      "0",
      "0",
      graficaCopia.buscaArista(i).costo
    );
    graficaCopia.eliminarArista(i);
  }

  datos = floyd(graficaCopia);

  console.log(datos);
  // if (datos.ciclo.length < 1) break loop;

  console.log(datos.aristas);
  console.log(graficaCopia.aristas);

  delta = Infinity;
  for (let i in datos.aristas) {
    let valor = graficaCopia.buscaArista(datos.aristas[i]).flujoMax;
    if (valor < delta) delta = valor;
  }

  console.log(delta);

  for (let i in datos.aristas) {
    console.log(datos.aristas[i]);

    if (datos.aristas[i].split("+")[0].length == 2) {
      let arista = objetoAristas[datos.aristas[i].split("+")[0]];
      console.log(datos);
      grafica.editarArista(
        datos.aristas[i].split("+")[0],
        arista.flujoMin,
        arista.flujo + delta,
        arista.flujoMax
      );

      arista.flujo += delta;
    } else if (datos.aristas[i].split("-")[0].length == 2) {
      let arista = objetoAristas[datos.aristas[i].split("-")[0]];
      grafica.editarArista(
        datos.aristas[i].split("-")[0],
        arista.flujoMin,
        arista.flujo - delta,
        arista.flujoMax
      );
      arista.flujo -= delta;
    }
  }

  for (let i in grafica.listaAristas) {
    let arista = objetoAristas[grafica.listaAristas[i].etiqueta];
    grafica.editarArista(
      grafica.listaAristas[i].etiqueta,
      arista.flujoMin,
      arista.flujo,
      arista.flujoMax
    );
  }

  for (let i in grafica.listaAristas)
    costo += grafica.listaAristas[i].costo * grafica.listaAristas[i].flujo;

  console.log("Costo");
  console.log(costo);
  console.log(graficaCopia);
  // }
  console.log(grafica.aristas);

  return { objetoAristas: objetoAristas, flujoMax: flujoMax };
};
