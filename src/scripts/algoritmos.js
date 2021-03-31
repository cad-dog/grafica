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
    hayCiclo = false;

  let inicio = document.getElementById("inicioFloyd").value,
    destino = document.getElementById("destinoFloyd").value;

  for (let i in grafica.vertices) {
    dist[i] = {};

    grafica.aristas[i].forEach((arista) => {
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

  /*loop1:*/ for (let i in grafica.vertices) {
    /* loop2:*/ for (let j in grafica.vertices) {
      /*loop3:*/ for (let k in grafica.vertices) {
        if (dist[i][k].peso + dist[k][j].peso < dist[i][j].peso) {
          dist[i][j] = {
            antecesor: k,
            peso: dist[i][k].peso + dist[k][j].peso,
            arista: dist[k][j].arista,
          };
          // if (i == j && dist[i][k].peso + dist[k][j].peso < 0) {
          //   hayCiclo = true;
          //   break loop1;
          // }
        }
      }
    }
  }

  // if (hayCiclo) {
  //   vertices = [];
  //   aristas = [];
  //   for (let i in grafica.vertices) {
  //     if (dist[i][i].peso != 0) {
  //       vertices.push(i);
  //       aristas.push(dist[i][i].arista);
  //     }
  //   }
  //   console.log(dist);

  //   return { aristas: aristas, vertices: vertices };
  // }

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
