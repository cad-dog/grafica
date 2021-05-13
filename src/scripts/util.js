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
        "0",
        "0",
        "0",
        Infinity,
        "0"
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
        "0",
        "0",
        "0",
        Infinity,
        "0"
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
        0,
        arcosRestriccion[i].peso,
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
            "0",
            red.aristas[i][j].flujoMin,
            "0",
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
        "0",
        vertice.flujoMin,
        "0",
        vertice.flujoMax,
        "0"
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

const simplexBasico = (red) => {
  let solucion = [],
    noSolucion = [],
    arcos = [];

  let { objetoAristas } = creaObjetoAristas(red);

  for (let i in red.listaAristas) {
    let arco = red.listaAristas[i];
    if (arco.peso > arco.flujoMin && arco.peso < arco.flujoMax)
      solucion.push(arco.etiqueta);
    else noSolucion.push(arco.etiqueta);
  }

  while (true) {
    let vertices = Object.keys(red.vertices);
    let arcoMejora = { mejora: 0 };

    for (let i in noSolucion) {
      let arco = objetoAristas[noSolucion[i]];
      let miniRed = new Grafica();

      let ciclo = encuentraCiclo(
        miniRed,
        vertices,
        solucion,
        objetoAristas,
        arco
      );

      ciclo.unshift(noSolucion[i]);

      let contrario = false;
      let verticeSiguiente = objetoAristas[ciclo[0]].fuente;
      let mejora = 0;
      let delta = Infinity;

      for (let j in ciclo) {
        if (ciclo[j] == undefined) break;

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

      if (mejora > arcoMejora.mejora)
        arcoMejora = {
          etiqueta: ciclo[0],
          mejora: mejora,
          ciclo: ciclo,
          delta: delta,
        };
    }

    if (arcoMejora.mejora <= 0) break;

    let contrario = false;
    let verticeSiguiente = objetoAristas[arcoMejora.ciclo[0]].fuente;

    for (let i in arcoMejora.ciclo) {
      let arista = objetoAristas[arcoMejora.ciclo[i]];

      // Mismo sentido
      if (arista.fuente == verticeSiguiente) {
        contrario = false;
        arista.peso += arcoMejora.delta;
      }
      // Sentido contrario
      else {
        contrario = true;
        arista.peso -= arcoMejora.delta;
      }

      if (arista.peso <= arista.flujoMin || arista.peso >= arista.flujoMax) {
        noSolucion.push(arista.etiqueta);
        solucion.splice(solucion.indexOf(arista.etiqueta), 1);
      }

      if (!contrario) verticeSiguiente = arista.sumidero;
      else verticeSiguiente = arista.fuente;
    }

    noSolucion.splice(noSolucion.indexOf(arcoMejora.etiqueta), 1);
    solucion.push(arcoMejora.etiqueta);
  }

  arcos = [];
  let costo = 0;
  for (let i in solucion) {
    costo += objetoAristas[solucion[i]].costo * objetoAristas[solucion[i]].peso;
  }

  let msj = "Costo minimo de " + costo + " unidades.";

  return {
    aristas: solucion,
    vertices: Object.keys(red.vertices),
    objetoAristas: objetoAristas,
    msj: msj,
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
  ({ aristas: ciclo } = floyd(red, arco.fuente, arco.sumidero, false));

  return ciclo;
};
