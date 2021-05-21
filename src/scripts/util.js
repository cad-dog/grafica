class ColaPrioridad {
  constructor() {
    this.elementos = [];
    this.longitud = 0;
  }

  agregar(elemento, peso) {
    let contiene = false;

    for (let i = 0; i < this.elementos.length; i++) {
      if (this.elementos[i]["peso"] > peso) {
        this.elementos.splice(i, 0, {
          etiqueta: elemento,
          peso: peso,
        });
        contiene = true;
        break;
      }
    }

    if (!contiene) {
      this.elementos.push({ etiqueta: elemento, peso: peso });
    }

    this.longitud++;
  }

  existe(elemento) {
    for (let i = 0; i < this.elementos.length; i++) {
      if (elemento == this.elementos[i].etiqueta) {
        return this.elementos[i];
      }
    }
    return false;
  }

  cambiarPeso(elemento, peso) {
    for (let i = 0; i < this.elementos.length; i++) {
      if (elemento == this.elementos[i].etiqueta) {
        this.elementos.splice(i, 1);
        this.longitud--;
        break;
      }
    }

    this.agregar(elemento, peso);
  }

  sacar() {
    this.longitud--;
    return this.elementos.shift();
  }

  pintar() {
    console.log(this.elementos);
  }
}

const busqueda = (v, padre) => {
  if (padre[v] == v) return v;
  padre[v] = busqueda(padre[v], padre);
  return padre[v];
};

const union = (u, v, padre) => {
  padre[busqueda(u, padre)] = busqueda(v, padre);
};

const bipartita = (grafica) => {
  let cola = [],
    aristasMarcadas = [],
    verticesMarcados = [],
    verticeActual;

  for (let i in grafica.vertices) {
    grafica.vertices[i].conjunto = undefined;
  }

  while (verticesMarcados.length < grafica.numVertices) {
    for (let i in grafica.vertices) {
      if (!verticesMarcados.includes(i)) {
        verticeActual = i;
        break;
      }
    }

    cola.push(verticeActual);
    grafica.vertices[verticeActual].conjunto = 0;
    verticesMarcados.push(verticeActual);
    while (cola.length > 0) {
      verticeActual = cola.shift();

      if (!verticesMarcados.includes(verticeActual))
        verticesMarcados.push(verticeActual);

      for (let i in grafica.aristas[verticeActual]) {
        let a = grafica.aristas[verticeActual][i];

        if (!verticesMarcados.includes(a.vertice)) cola.push(a.vertice);

        if (!aristasMarcadas.includes(a.etiqueta))
          aristasMarcadas.push(a.etiqueta);

        if (
          grafica.vertices[verticeActual].conjunto !==
          grafica.vertices[a.vertice].conjunto
        ) {
          if (grafica.vertices[verticeActual].conjunto == 0) {
            grafica.asignarConjunto(a.vertice, 1);
            // grafica.vertices[i.vertice].conjunto = 1;
          } else {
            grafica.asignarConjunto(a.vertice, 0);

            // grafica.vertices[i.vertice].conjunto = 0;
          }
        } else {
          console.log("no bipartita");
          return false;
        }
      }
    }
  }

  return true;
};

const esConexa = (grafica) => {
  let { conexa } = busquedaAncho(grafica);

  return conexa;
};

const creaObjetoAristas = (grafica) => {
  let objetoAristas = {},
    arcosRestriccion = [];
  // Objeto de aristas

  for (let i = 0; i < grafica.listaAristas.length; i++) {
    let arista = grafica.listaAristas[i];
    objetoAristas[arista.etiqueta] = {
      etiqueta: arista.etiqueta,
      fuente: arista.v1,
      sumidero: arista.v2,
      peso: arista.peso,
      flujoMin: arista.flujoMin,
      flujo: arista.flujo,
      flujoMax: arista.flujoMax,
      costo: arista.costo,
    };

    // Si hay aristas con restriccion los agregamos a un arreglo
    if (arista.flujoMin > 0)
      arcosRestriccion.push({
        v1: arista.v1,
        v2: arista.v2,
        etiqueta: arista.etiqueta,
        peso: arista.peso,
        flujoMin: arista.flujoMin,
        flujo: arista.flujo,
        flujoMax: arista.flujoMax,
        costo: arista.costo,
      });
  }

  return { objetoAristas: objetoAristas, arcosRestriccion: arcosRestriccion };
};

const dijkstraBasico = (grafica, inicio, destino) => {
  let camino = {},
    cola = new ColaPrioridad(),
    marcasDef = [],
    aristas = [],
    verticeActual,
    vertices = [];

  // Creamos el objeto de aristas
  let { objetoAristas } = creaObjetoAristas(grafica);

  if (inicio == "") inicio = "a";

  for (let i in grafica.vertices) camino[i] = { anterior: i, peso: Infinity };

  camino[inicio] = {
    arista: undefined,
    anterior: inicio,
    peso: 0,
  };

  cola.agregar(inicio, 0);

  // Mientras existan vertices con marca temporal
  while (cola.longitud > 0) {
    verticeActual = cola.sacar();
    marcasDef.push(verticeActual.etiqueta);

    // Si se llego al destino paramos
    if (verticeActual.etiqueta == destino) break;
    // Si no
    else {
      // Por cada vertice adyacente
      for (let i in grafica.aristas[verticeActual.etiqueta]) {
        let a = grafica.aristas[verticeActual.etiqueta][i];
        let adyacente = objetoAristas[a.etiqueta];
        if (a.tipo == "saliente" && !marcasDef.includes(adyacente.sumidero)) {
          // Si no tiene marca temporal
          if (!cola.existe(adyacente.sumidero)) {
            // Se etiqueta temporal
            cola.agregar(adyacente.sumidero, adyacente.peso);
            camino[adyacente.sumidero] = {
              arista: a.etiqueta,
              anterior: adyacente.fuente,
              peso: camino[verticeActual.etiqueta].peso + a.peso,
            };
          }
          // Si tiene marca temporal
          else {
            // Si el peso es menor que el peso que ya tenia
            if (
              camino[verticeActual.etiqueta].peso + a.peso <
              camino[adyacente.sumidero]
            ) {
              // Se actualiza
              cola.cambiarPeso(
                adyacente.sumidero,
                camino[verticeActual.etiqueta].peso + a.peso
              );
              camino[adyacente.sumidero] = {
                arista: a.etiqueta,
                anterior: adyacente.fuente,
                peso: camino[verticeActual.etiqueta].peso + a.peso,
              };
            }
          }
        }
      }
    }
  }

  if (destino != "")
    if (!camino[destino]) {
      console.log("no existe ruta");
      return {
        aristas: aristas,
        vertices: vertices,
        msj: {
          text: "No existe una ruta de " + inicio + " a " + destino,
          color: "text-red-500",
        },
      };
    }

  if (destino != "") {
    verticeActual = destino;
    vertices.push(verticeActual);
    while (verticeActual != inicio) {
      vertices.push(camino[verticeActual].anterior);

      if (
        camino[verticeActual].arista != undefined &&
        !arista.includes(camino[verticeActual].arista)
      )
        aristas.push(camino[verticeActual].arista);

      verticeActual = camino[verticeActual].anterior;
    }
  } else {
    for (let i in grafica.vertices) {
      verticeActual = i;

      vertices.push(verticeActual);
      while (verticeActual != inicio) {
        vertices.push(camino[verticeActual].anterior);

        if (
          camino[verticeActual].arista != undefined &&
          !aristas.includes(camino[verticeActual].arista)
        )
          aristas.push(camino[verticeActual].arista);

        verticeActual = camino[verticeActual].anterior;
      }
    }
  }

  return { camino: camino, aristas: aristas, vertices: vertices, msj: "" };
};

const creaSuperVertices = (red, fuente, sumidero) => {
  // Si hay mas de un vertice fuente
  if (fuente.length > 1) {
    // Se agrega un vertice superfuente
    red.agregarVertice("superfuente");

    // Se conectan los vertices fuente con el superfuente
    for (let i in fuente) {
      red.agregarArista(
        "e" + (parseInt(i) + 1) + "'",
        "superfuente",
        fuente[i],
        0,
        0,
        0,
        Infinity,
        0
      );
    }

    fuente = "superfuente";
  } else fuente = fuente[0];

  // Si hay mas de un vertice sumidero
  if (sumidero.length > 1) {
    // Se agrega un vertice supersumidero
    red.agregarVertice("supersumidero");

    // Se conectan los vertices fuente con el supersumidero
    for (let i in sumidero) {
      red.agregarArista(
        "e" + (parseInt(i) + 1) + "''",
        sumidero[i],
        "supersumidero",
        0,
        0,
        0,
        Infinity,
        0
      );
    }
    sumidero = "supersumidero";
  } else sumidero = sumidero[0];

  return { fuente: fuente, sumidero: sumidero };
};

const satisfacerRestriccionesArcos = (red, fuente, sumidero) => {
  let redCopia = _.cloneDeep(red);

  // Objeto de aristas
  let { objetoAristas, arcosRestriccion } = creaObjetoAristas(red);

  // Si hay arcos con restriccion
  if (arcosRestriccion.length > 0) {
    // Creamos un vertice fuente y sumidero ficticios
    redCopia.agregarVertice("A'");
    redCopia.agregarVertice("Z'");

    // Por cada arco con restriccion
    for (let i in arcosRestriccion) {
      // Buscamos un arco que conecte al vertice fuente ficticio con el vertice destino del arco
      let arco = redCopia.buscaArista2("A'", arcosRestriccion[i].v2);

      // Si no se encuentra un arco
      if (!arco) {
        // Creamos una arco
        redCopia.agregarArista(
          arcosRestriccion[i].etiqueta + "*",
          "A'",
          arcosRestriccion[i].v2,
          arcosRestriccion[i].peso,
          0,
          0,
          arcosRestriccion[i].flujoMin,
          arcosRestriccion[i].costo
        );

        objetoAristas[arcosRestriccion[i].etiqueta + "*"] = {
          fuente: "A'",
          sumidero: arcosRestriccion[i].v2,
          peso: arcosRestriccion[i].peso,
          flujoMin: 0,
          flujo: 0,
          flujoMax: arcosRestriccion[i].flujoMin,
          costo: arcosRestriccion[i].costo,
        };
      }
      // Si se encuentra un arco
      else {
        // Cambiamos el flujo maximo del arco existente
        redCopia.editarArista(
          arco.etiqueta,
          arco.peso,
          arco.flujoMin,
          arco.flujo,
          arco.flujoMax + arcosRestriccion[i].flujoMin
        );

        objetoAristas[arco.etiqueta] = {
          fuente: arco.v1,
          sumidero: arco.v2,
          peso: arco.peso,
          flujoMin: arco.flujoMin,
          flujo: arco.flujo,
          flujoMax: arco.flujoMax + arcosRestriccion[i].flujoMin,
          costo: arco.costo,
        };
      }

      // Buscamos un arco que conecte al vertice sumidero ficticio con el vertice inicial del arco
      arco = redCopia.buscaArista2(arcosRestriccion[i].v1, "Z'");

      // Si no se encuentra un arco
      if (!arco) {
        // Creamos una arco
        redCopia.agregarArista(
          arcosRestriccion[i].etiqueta + "**",
          arcosRestriccion[i].v1,
          "Z'",
          arcosRestriccion[i].peso,
          0,
          0,
          arcosRestriccion[i].flujoMin,
          arcosRestriccion[i].costo
        );

        objetoAristas[arcosRestriccion[i].etiqueta + "**"] = {
          fuente: arcosRestriccion[i].v1,
          sumidero: "Z'",
          peso: arcosRestriccion[i].peso,
          flujoMin: 0,
          flujo: 0,
          flujoMax: arcosRestriccion[i].flujoMin,
          costo: arcosRestriccion[i].costo,
        };
      }
      // Si se encuentra un arco
      else {
        // Cambiamos el flujo maximo del arco existente
        redCopia.editarArista(
          arco.etiqueta,
          arco.peso,
          arco.flujoMin,
          arco.flujo,
          arco.flujoMax + arcosRestriccion[i].flujoMin
        );

        objetoAristas[arco.etiqueta] = {
          fuente: arco.v1,
          sumidero: arco.v2,
          peso: arco.peso,
          flujoMin: arco.flujoMin,
          flujo: arco.flujo,
          flujoMax: arco.flujoMax + arcosRestriccion[i].flujoMin,
          costo: arco.costo,
        };
      }

      // Quitamos la restriccion del arco

      redCopia.editarArista(
        arcosRestriccion[i].etiqueta,
        arcosRestriccion[i].peso,
        0,
        arcosRestriccion[i].flujo,
        arcosRestriccion[i].flujoMax - arcosRestriccion[i].flujoMin
      );

      objetoAristas[arcosRestriccion[i].etiqueta] = {
        fuente: arcosRestriccion[i].v1,
        sumidero: arcosRestriccion[i].v2,
        peso: arcosRestriccion[i].peso,
        flujoMin: 0,
        flujo: 0,
        flujoMax: arcosRestriccion[i].flujoMax - arcosRestriccion[i].flujoMin,
        costo: arcosRestriccion[i].costo,
      };
    }

    // Conectamos los vertices fuente y sumidero
    redCopia.agregarArista("e*", fuente, sumidero, 0, 0, 0, Infinity);

    objetoAristas["e*"] = {
      fuente: fuente,
      sumidero: sumidero,
      flujoMin: 0,
      flujo: 0,
      flujoMax: Infinity,
    };

    redCopia.agregarArista("e**", sumidero, fuente, 0, 0, 0, Infinity);

    objetoAristas["e**"] = {
      fuente: sumidero,
      sumidero: fuente,
      flujoMin: 0,
      flujo: 0,
      flujoMax: Infinity,
    };

    let fuente2 = "A'";
    let sumidero2 = "Z'";

    ({ redCopia, objetoAristas } = fordFulkerson2(
      redCopia,
      fuente2,
      sumidero2,
      Infinity
    ));

    // Reparticiones
    for (let i in arcosRestriccion) {
      let arco = arcosRestriccion[i];

      redCopia.editarArista(
        arco.etiqueta,
        arco.peso,
        arco.flujoMin,
        arco.flujoMin + objetoAristas[arco.etiqueta].flujo,
        arco.flujoMax
      );

      objetoAristas[arco.etiqueta] = {
        fuente: arco.v1,
        sumidero: arco.v2,
        peso: arco.peso,
        flujoMin: arco.flujoMin,
        flujo: arco.flujoMin + objetoAristas[arco.etiqueta].flujo,
        flujoMax: arco.flujoMax,
        costo: arco.costo,
      };
    }

    // Eliminamos las aristas ficticias
    redCopia.eliminarArista("e*");
    redCopia.eliminarArista("e**");

    for (let i in objetoAristas) {
      if (i.includes("*")) {
        delete objetoAristas[i];
        redCopia.eliminarArista(i);
      }
    }

    // Eliminamos los vertices ficticios
    redCopia.eliminarVertice("A'");
    redCopia.eliminarVertice("Z'");
  }

  return { red: redCopia, objetoAristas: objetoAristas };
};

const creaRedMarginal = (red, arcos) => {
  let redCopia = _.cloneDeep(red),
    { objetoAristas } = creaObjetoAristas(red);

  arcos = arcos || Object.keys(red.listaAristas);

  for (let i in objetoAristas) {
    redCopia.eliminarArista(i);
    // if (arcos.includes(i)) {
    if (objetoAristas[i].flujo > objetoAristas[i].flujoMin)
      redCopia.agregarArista(
        i + "-",
        objetoAristas[i].sumidero,
        objetoAristas[i].fuente,
        -red.buscaArista(i).costo,
        0,
        0,
        objetoAristas[i].flujo - objetoAristas[i].flujoMin,
        -red.buscaArista(i).costo
      );

    if (
      objetoAristas[i].flujo <
      objetoAristas[i].flujoMax - objetoAristas[i].flujoMin
    )
      redCopia.agregarArista(
        i + "+",
        objetoAristas[i].fuente,
        objetoAristas[i].sumidero,
        red.buscaArista(i).costo,
        0,
        0,
        objetoAristas[i].flujoMax -
          objetoAristas[i].flujo -
          objetoAristas[i].flujoMin,
        red.buscaArista(i).costo
      );
    // }
  }
  return { redMarginal: redCopia, objetoAristas: objetoAristas };
};

const creaClones = (red, verticesDuplicados) => {
  verticesDuplicados = [];

  for (let i in red.vertices) {
    // Si el vertice tiene restricciones
    let vertice = red.vertices[i];

    if (vertice.flujoMin != undefined || vertice.flujoMax != undefined) {
      // Creamos un vertice clon
      verticesDuplicados.push(i.toUpperCase());
      red.agregarVertice(i.toUpperCase());

      // Ciclo para agregar los arcos salientes del vertice original al vertice clon
      let eliminar = [];

      for (let j in red.aristas[i]) {
        if (red.aristas[i][j].tipo == "saliente") {
          red.agregarArista(
            red.aristas[i][j].etiqueta + "#",
            i.toUpperCase(),
            red.aristas[i][j].vertice,
            0,
            red.aristas[i][j].flujoMin,
            0,
            red.aristas[i][j].flujoMax,
            red.aristas[i][j].costo
          );

          eliminar.push(red.aristas[i][j].etiqueta);
        }
      }

      // Ciclo para eliminar los arcos que agregamos al vertice clon
      for (let j in eliminar) red.eliminarArista(eliminar[j]);

      // Conectamos el vertice original con el vertice clon
      red.agregarArista(
        i + "#",
        i,
        i.toUpperCase(),
        0,
        vertice.flujoMin,
        0,
        vertice.flujoMax,
        0
      );
    }
  }
  return { verticesDuplicados };
};

const eliminarClones = (red, verticesDuplicados, objetoAristas) => {
  // Cambiamos los arcos de los vertices clon a los vertices originales
  for (let i in verticesDuplicados) {
    let duplicado = verticesDuplicados[i];
    for (let j in red.aristas[duplicado]) {
      arista = red.aristas[duplicado][j];
      if (arista.tipo == "saliente") {
        red.agregarArista(
          arista.etiqueta,
          duplicado.toLocaleLowerCase(),
          arista.vertice,
          "0",
          objetoAristas[arista.etiqueta].flujoMin,
          objetoAristas[arista.etiqueta].flujo,
          objetoAristas[arista.etiqueta].flujoMax,
          arista.costo
        );

        objetoAristas[arista.etiqueta.split("#")[0]] = {
          fuente: duplicado.toLowerCase(),
          sumidero: arista.vertice,
          flujoMin: objetoAristas[arista.etiqueta].flujoMin,
          flujo: objetoAristas[arista.etiqueta].flujo,
          flujoMax: objetoAristas[arista.etiqueta].flujoMax,
          costo: arista.costo,
        };
      }
    }

    // Eliminamos los vertices clon
    red.eliminarVertice(duplicado);
  }
};

const simplexBasico = (red, solucion, noSolucion, ficticia) => {
  let soluciones = {};

  if (ficticia != true) ficticia = false;

  while (true) {
    ({ objetoAristas } = creaObjetoAristas(red));

    let vertices = Object.keys(red.vertices);
    let arcoMejora = { mejora: 0 };

    for (let i in noSolucion) {
      if (
        objetoAristas[noSolucion[i]].peso >=
        objetoAristas[noSolucion[i]].flujoMax
      )
        continue;

      let arco = objetoAristas[noSolucion[i]];
      let miniRed = new Grafica();

      let ciclo = encuentraCiclo(
        miniRed,
        vertices,
        solucion,
        objetoAristas,
        arco
      );

      if (ciclo[0] == undefined) continue;

      ciclo.unshift(noSolucion[i]);

      let contrario = false;
      let verticeSiguiente = objetoAristas[ciclo[0]].fuente;
      let mejora = 0;
      let delta = Infinity;

      for (let j in ciclo) {
        if (ciclo[j] == undefined) continue;

        let arista = objetoAristas[ciclo[j]];

        // Mismo sentido
        if (arista.fuente == verticeSiguiente) {
          mejora -= arista.costo;
          contrario = false;

          delta = Math.min(delta, arista.flujoMax - arista.peso);
        }
        // Sentido contrario
        else {
          mejora += arista.costo;
          contrario = true;

          delta = Math.min(delta, arista.peso - arista.flujoMin);
        }

        if (!contrario) verticeSiguiente = arista.sumidero;
        else verticeSiguiente = arista.fuente;
      }

      if (delta <= 0) continue;

      if (mejora > arcoMejora.mejora) {
        arcoMejora = {
          etiqueta: ciclo[0],
          mejora: mejora,
          ciclo: ciclo,
          delta: delta,
        };
      }
    }

    console.log(arcoMejora);
    console.log("------------------------\nAntes");
    console.log("arcos ciclo");
    for (let i in arcoMejora.ciclo) {
      let x = objetoAristas[arcoMejora.ciclo[i]];
      console.log(
        x.etiqueta + "(" + x.fuente + "->" + x.sumidero + ")",
        "min: " + x.flujoMin,
        "max: " + x.flujoMax,
        "peso: " + x.peso,
        "costo: " + x.costo
      );
    }

    console.log(
      "arco: " + arcoMejora.etiqueta,
      "mejora: " + arcoMejora.mejora,
      "delta: " + arcoMejora.delta
    );
    console.log("arcos solucion");
    for (let i in solucion) {
      let x = objetoAristas[solucion[i]];
      console.log(
        x.etiqueta + "(" + x.fuente + "->" + x.sumidero + ")",
        "min: " + x.flujoMin,
        "max: " + x.flujoMax,
        "peso: " + x.peso,
        "costo: " + x.costo
      );
    }
    console.log("arcos no solucion");
    for (let i in noSolucion) {
      let x = objetoAristas[noSolucion[i]];
      console.log(
        x.etiqueta + "(" + x.fuente + "->" + x.sumidero + ")",
        "min: " + x.flujoMin,
        "max: " + x.flujoMax,
        "peso: " + x.peso,
        "costo: " + x.costo
      );
    }

    if (arcoMejora.mejora <= 0) {
      if (ficticia) {
        // Sacamos aristas ficticias

        console.log(solucion);

        let numFicticios = 0;

        for (let i in solucion) if (solucion[i].includes("%")) numFicticios++;

        solucion = solucion.filter((a) => !a.includes("%"));

        if (numFicticios > 1) {
          // Elegimos una arista de la red original para formar el arbol de expansion
          for (let i in objetoAristas) {
            if (!solucion.includes(i)) {
              solucion.push(i);
              break;
            }
          }
        }

        console.log(solucion);

        // soluciones[Object.keys(soluciones).length + 1] = [];

        // for (let i in objetoAristas)
        //   soluciones[Object.keys(soluciones).length].push(objetoAristas[i]);

        console.log(soluciones);

        for (let i in red.listaAristas) {
          let a = red.listaAristas[i];
          if (a.peso <= a.flujoMin || a.peso >= a.flujoMax) {
            console.log("TOTO");

            console.log("sool: " + solucion);
            console.log("length: " + solucion.length);
            if (solucion.length == red.numVertices) {
              console.log("TATA");
              noSolucion.push(a.etiqueta);
              solucion.splice(solucion.indexOf(a.etiqueta), 1);

              console.log("sacamos");
              console.log(a);
              break;
            }
          }
        }

        for (let i in red.listaAristas) {
          let a = red.listaAristas[i];
          if (a.peso <= a.flujoMin || a.peso >= a.flujoMax) {
            console.log("TOTO");

            console.log("sool: " + solucion);
            console.log("length: " + solucion.length);
            if (solucion.length == red.numVertices) {
              console.log("TATA");
              noSolucion.push(a.etiqueta);
              solucion.splice(solucion.indexOf(a.etiqueta), 1);

              console.log("sacamos");
              console.log(a);
              break;
            }
          }
        }

        let costo = 0;

        for (let i in objetoAristas)
          costo += objetoAristas[i].costo * objetoAristas[i].peso;

        let msj = "Costo minimo de " + costo + " unidades.";

        return {
          aristas: solucion,
          vertices: Object.keys(red.vertices),
          objetoAristas: objetoAristas,
          msj: msj,
          soluciones: soluciones,
          solucion: solucion,
        };
      } else {
        for (let i in arcoMejora.ciclo) {
          let a = objetoAristas[arcoMejora.ciclo[i]];

          if (a.peso <= a.flujoMin || a.peso >= a.flujoMax) {
            noSolucion.push(a.etiqueta);
            solucion.splice(solucion.indexOf(a.etiqueta), 1);

            console.log("sacamos");
            console.log(a);
            break;
          }
        }

        console.log("BBB");
        let costo = 0;

        for (let i in objetoAristas)
          costo += objetoAristas[i].costo * objetoAristas[i].peso;

        let msj = "Costo minimo de " + costo + " unidades.";

        console.log(solucion);

        return {
          aristas: solucion,
          vertices: Object.keys(red.vertices),
          objetoAristas: objetoAristas,
          msj: msj,
          soluciones: soluciones,
          solucion: solucion,
        };
      }
    }

    let contrario = false;
    let verticeSiguiente = objetoAristas[arcoMejora.ciclo[0]].fuente;

    for (let i in arcoMejora.ciclo) {
      let arista = objetoAristas[arcoMejora.ciclo[i]];

      // Mismo sentido
      if (arista.fuente == verticeSiguiente) {
        contrario = false;
        arista.peso += arcoMejora.delta;

        red.editarArista(
          arcoMejora.ciclo[i],
          arista.peso,
          arista.flujoMin,
          arista.flujo,
          arista.flujoMax
        );
      }
      // Sentido contrario
      else {
        contrario = true;
        arista.peso -= arcoMejora.delta;

        red.editarArista(
          arcoMejora.ciclo[i],
          arista.peso,
          arista.flujoMin,
          arista.flujo,
          arista.flujoMax
        );
      }

      // if (arista.peso <= arista.flujoMin || arista.peso >= arista.flujoMax) {
      //   noSolucion.push(arista.etiqueta);
      //   solucion.splice(solucion.indexOf(arista.etiqueta), 1);
      // }

      if (!contrario) verticeSiguiente = arista.sumidero;
      else verticeSiguiente = arista.fuente;
    }

    console.log("------------------------\nDespues");
    for (let i in arcoMejora.ciclo) {
      let x = objetoAristas[arcoMejora.ciclo[i]];
      console.log(
        x.etiqueta + "(" + x.fuente + "->" + x.sumidero + ")",
        "min: " + x.flujoMin,
        "max: " + x.flujoMax,
        "peso: " + x.peso,
        "costo: " + x.costo
      );
    }
    console.log("arcos solucion");
    for (let i in solucion) {
      let x = objetoAristas[solucion[i]];
      console.log(
        x.etiqueta + "(" + x.fuente + "->" + x.sumidero + ")",
        "min: " + x.flujoMin,
        "max: " + x.flujoMax,
        "peso: " + x.peso,
        "costo: " + x.costo
      );
    }
    console.log("arcos no solucion");
    for (let i in noSolucion) {
      let x = objetoAristas[noSolucion[i]];
      console.log(
        x.etiqueta + "(" + x.fuente + "->" + x.sumidero + ")",
        "min: " + x.flujoMin,
        "max: " + x.flujoMax,
        "peso: " + x.peso,
        "costo: " + x.costo
      );
    }

    noSolucion.splice(noSolucion.indexOf(arcoMejora.etiqueta), 1);
    solucion.push(arcoMejora.etiqueta);

    /// BORARRR
    console.log(objetoAristas);
    for (let i in arcoMejora.ciclo) {
      let a = objetoAristas[arcoMejora.ciclo[i]];

      if (ficticia) {
        if (a.etiqueta.includes("%")) {
          if (a.peso <= a.flujoMin) {
            noSolucion.push(a.etiqueta);
            solucion.splice(solucion.indexOf(a.etiqueta), 1);

            console.log(solucion);
            console.log("sacamos");
            console.log(a);
            break;
          }
        } /*else {
          console.log(a.peso, a.flujoMin, a.flujoMax);
          if (a.peso <= a.flujoMin || a.peso >= a.flujoMax) {
            console.log("TOTO");

            console.log("sool: " + solucion);
            console.log("length: " + solucion.length);
            if (solucion.length == red.numVertices) {
              console.log("TATA");
              noSolucion.push(a.etiqueta);
              solucion.splice(solucion.indexOf(a.etiqueta), 1);

              console.log("sacamos");
              console.log(a);
              break;
            }
          }
        }*/
      } else {
        if (a.peso <= a.flujoMin || a.peso >= a.flujoMax) {
          noSolucion.push(a.etiqueta);
          solucion.splice(solucion.indexOf(a.etiqueta), 1);

          console.log("sacamos");
          console.log(a);
          break;
        }
      }
    }
    //////////////

    let parar = true;
    for (let i in noSolucion) {
      if (noSolucion[i].includes("%")) parar = false;
    }

    soluciones[Object.keys(soluciones).length + 1] = [];

    for (let i in objetoAristas)
      soluciones[Object.keys(soluciones).length].push(objetoAristas[i]);

    if (ficticia) if (parar) break;
  }

  arcos = [];
  let costo = 0;
  for (let i in objetoAristas)
    costo += objetoAristas[i].costo * objetoAristas[i].peso;

  solucion = [];
  noSolucion = [];

  for (let i in red.listaAristas) {
    let arco = red.listaAristas[i];
    if (arco.peso > arco.flujoMin && arco.peso < arco.flujoMax)
      solucion.push(arco.etiqueta);
    else noSolucion.push(arco.etiqueta);
  }

  let msj = "Costo minimo de " + costo + " unidades.";

  return {
    solucion: solucion,
    vertices: Object.keys(red.vertices),
    objetoAristas: objetoAristas,
    msj: msj,
    soluciones: soluciones,
  };
};

const encuentraCiclo = (red, vertices, solucion, objetoAristas, arco) => {
  for (let j in vertices) red.agregarVertice(vertices[j]);

  for (let j in solucion) {
    let a = objetoAristas[solucion[j]];
    red.agregarArista(
      solucion[j],
      a.fuente,
      a.sumidero,
      a.peso,
      a.flujoMin,
      a.flujo,
      a.flujoMax,
      a.costo
    );
  }
  ({ etiquetasAristas: ciclo } = floyd(red, arco.fuente, arco.sumidero, false));

  return ciclo;
};
