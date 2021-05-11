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
      fuente: arista.v1,
      sumidero: arista.v2,
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
    red.agregarVertice("supersumidero");

    // Se conectan los vertices fuente con el supersumidero
    for (let i in sumidero) {
      red.agregarArista(
        sumidero[i],
        "supersumidero",
        Infinity,
        "e" + (parseInt(i) + 1) + "''"
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
          costo: arcosRestriccion[i].costo,
        };
      }
      // Si se encuentra un arco
      else {
        // Cambiamos el flujo maximo del arco existente
        redCopia.editarArista(
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
          costo: arco.costo,
        };
      }

      // Buscamos un arco que conecte al vertice sumidero ficticio con el vertice inicial del arco
      arco = redCopia.buscaArista2(arcosRestriccion[i].v1, "Z'");

      // Si no se encuentra un arco
      if (!arco) {
        // Creamos una arco
        redCopia.agregarArista(
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
          costo: arcosRestriccion[i].costo,
        };
      }
      // Si se encuentra un arco
      else {
        // Cambiamos el flujo maximo del arco existente
        redCopia.editarArista(
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
          arco: arco.costo,
        };
      }

      // Quitamos la restriccion del arco

      redCopia.editarArista(
        arcosRestriccion[i].etiqueta,
        0,
        arcosRestriccion[i].flujo,
        arcosRestriccion[i].flujoMax - arcosRestriccion[i].flujoMin
      );

      objetoAristas[arcosRestriccion[i].etiqueta] = {
        fuente: arcosRestriccion[i].v1,
        sumidero: arcosRestriccion[i].v2,
        flujoMin: 0,
        flujo: 0,
        flujoMax: arcosRestriccion[i].flujoMax - arcosRestriccion[i].flujoMin,
        costo: arcosRestriccion[i].costo,
      };
    }

    // Conectamos los vertices fuente y sumidero
    redCopia.agregarArista(fuente, sumidero, Infinity, "e*");

    objetoAristas["e*"] = {
      fuente: fuente,
      sumidero: sumidero,
      flujoMin: 0,
      flujo: 0,
      flujoMax: Infinity,
    };

    redCopia.agregarArista(sumidero, fuente, Infinity, "e**");

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
        arco.flujoMin,
        arco.flujoMin + objetoAristas[arco.etiqueta].flujo,
        arco.flujoMax
      );

      objetoAristas[arco.etiqueta] = {
        fuente: arco.v1,
        sumidero: arco.v2,
        flujoMin: arco.flujoMin,
        flujo: arco.flujoMin + objetoAristas[arco.etiqueta].flujo,
        flujoMax: arco.flujoMax,
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
    if (arcos.includes(i)) {
      if (objetoAristas[i].flujo > objetoAristas[i].flujoMin)
        redCopia.agregarArista(
          objetoAristas[i].sumidero,
          objetoAristas[i].fuente,
          objetoAristas[i].flujo - objetoAristas[i].flujoMin,
          i + "-",
          "0",
          "0",
          -red.buscaArista(i).costo
        );

      if (
        objetoAristas[i].flujo <
        objetoAristas[i].flujoMax - objetoAristas[i].flujoMin
      )
        redCopia.agregarArista(
          objetoAristas[i].fuente,
          objetoAristas[i].sumidero,
          objetoAristas[i].flujoMax -
            objetoAristas[i].flujo -
            objetoAristas[i].flujoMin,
          i + "+",
          "0",
          "0",
          red.buscaArista(i).costo
        );
    }
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
            i.toUpperCase(),
            red.aristas[i][j].vertice,
            red.aristas[i][j].flujoMax,
            red.aristas[i][j].etiqueta + "#",
            red.aristas[i][j].flujoMin,
            "0",
            red.aristas[i][j].costo
          );

          eliminar.push(red.aristas[i][j].etiqueta);
        }
      }

      // Ciclo para eliminar los arcos que agregamos al vertice clon
      for (let j in eliminar) red.eliminarArista(eliminar[j]);

      // Conectamos el vertice original con el vertice clon
      red.agregarArista(
        i,
        i.toUpperCase(),
        vertice.flujoMax,
        i + "#",
        vertice.flujoMin,
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
          duplicado.toLocaleLowerCase(),
          arista.vertice,
          objetoAristas[arista.etiqueta].flujoMax,
          arista.etiqueta,
          objetoAristas[arista.etiqueta].flujoMin,
          objetoAristas[arista.etiqueta].flujo,
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
