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
    if (arista.flujo > 0)
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
        };
      }

      // Quitamos la restriccion del arco
      redCopia.eliminarArista(arcosRestriccion[i].etiqueta);
      redCopia.agregarArista(
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

    fordFulkerson2(redCopia, fuente2, sumidero2);

    // Reparticiones
    for (let i in arcosRestriccion) {
      let arco = arcosRestriccion[i];
      redCopia.eliminarArista(arco.etiqueta);
      redCopia.agregarArista(
        arco.v1,
        arco.v2,
        arco.flujoMax,
        arco.etiqueta,
        arco.flujoMin,
        arco.flujoMin + objetoAristas[arco.etiqueta].flujo
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

    for (let i in objetoAristas) if (i.includes("*")) delete objetoAristas[i];

    // Eliminamos los vertices ficticios
    redCopia.eliminarVertice("A'");
    redCopia.eliminarVertice("Z'");

    for (let i in objetoAristas) {
      let arco = objetoAristas[i];
      red.editarArista(i, arco.flujoMin, arco.flujo, arco.flujoMax);
    }
  }

  return red;
};

const creaRedMarginal = (red) => {
  let redCopia = _.cloneDeep(red),
    { objetoAristas } = creaObjetoAristas(red);

  for (let i in objetoAristas) {
    redCopia.eliminarArista(i);

    if (objetoAristas[i].flujo > 0)
      redCopia.agregarArista(
        objetoAristas[i].sumidero,
        objetoAristas[i].fuente,
        objetoAristas[i].flujo,
        i + "-",
        "0",
        "0",
        -red.buscaArista(i).costo
      );

    if (objetoAristas[i].flujo < objetoAristas[i].flujoMax)
      redCopia.agregarArista(
        objetoAristas[i].fuente,
        objetoAristas[i].sumidero,
        objetoAristas[i].flujoMax - objetoAristas[i].flujo,
        i + "+",
        "0",
        "0",
        red.buscaArista(i).costo
      );
  }
  return { redMarginal: redCopia, objetoAristas: objetoAristas };
};
