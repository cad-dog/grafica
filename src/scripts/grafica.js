class Grafica {
  constructor() {
    this.vertices = {};
    this.aristas = {};
    this.numAristas = 0;
    this.numVertices = 0;
    this.lazos = {};
  }

  agregarVertice(vertice) {
    this.vertices[vertice] = { etiqueta: vertice, grado: 0 };
    this.aristas[vertice] = [];
  }

  agregarArista(v1, v2, peso, etiqueta) {
    this.numAristas += 1;
    if (v1 == v2) {
      this.vertices[v1].grado += 2;
    } else {
      this.vertices[v1].grado += 1;
      this.vertices[v2].grado += 1;
    }

    this.aristas[v1].push({ etiqueta: etiqueta, vertice: v2, peso: peso });
    this.aristas[v2].push({ etiqueta: etiqueta, vertice: v1, peso: peso });
  }

  eliminarVertice(vertice) {
    this.vaciaVertice(vertice);
    delete this.vertices[vertice];
    delete this.aristas[vertice];
  }

  eliminarArista(arista) {
    this.numAristas -= 1;

    Object.keys(this.aristas).map((i) => {
      this.aristas[i]
        .filter((j) => j.etiqueta == arista)
        .map((k) => {
          this.vertices[k.vertice].grado -= 1;
        });

      this.aristas[i] = this.aristas[i].filter((j) => j.etiqueta != arista);
    });
  }

  buscaVertice(vertice) {
    return Object.keys(this.vertices).includes(vertice);
  }

  buscaArista(arista) {
    let encontrado = false;
    Object.keys(this.aristas).map((i) => {
      if (this.aristas[i].filter((j) => j.etiqueta == arista).length > 0) {
        encontrado = true;
      }
    });
    return encontrado;
  }

  gradoVertice(vertice) {
    return this.vertices[vertice].grado;
  }

  numeroVertices() {
    return console.log(this.vertices.length);
  }

  numeroAristas() {
    return console.log(this.numAristas);
  }

  vaciaVertice(vertice) {
    this.aristas[vertice].map((i) => {
      this.vertices[i.vertice].grado -= 1;
    });

    this.vertices[vertice].grado = 0;

    this.aristas[vertice].map((arista) => {
      this.numAristas -= 1;
      this.aristas[arista.vertice] = this.aristas[arista.vertice].filter(
        (i) => i.vertice != vertice
      );
    });
    if (this.lazos[vertice]) {
      this.numAristas += this.lazos[vertice];
      delete this.lazos[vertice];
    }
    this.aristas[vertice] = [];
  }

  vaciaGrafica() {
    this.vertices = {};
    this.aristas = {};
    this.lazos = {};
    this.numAristas = 0;
    this.numVertices = 0;
  }

  copiaGrafica() {
    graficaCopia = new Grafica();
    graficaCopia.aristas = this.aristas;
    graficaCopia.vertices = this.vertices;
    graficaCopia.lazos = this.lazos;
    graficaCopia.numAristas = this.numAristas;
    graficaCopia.numVertices = this.numVertices;

    return graficaCopia;
  }

  esBipartita() {
    Object.keys(this.vertices).map((i) => {
      if (this.vertices[i].conjunto) delete this.vertices[i].conjunto;
    });

    if (Object.keys(this.vertices).length < 1) {
      return true;
    }

    if (this.numAristas < 1) {
      console.log("hola");
      Object.keys(this.vertices).map((i) => {
        this.vertices[i].conjunto = 1;
      });
    }

    this.vertices[Object.keys(this.vertices)[0]].conjunto = 1;
    let cola = [],
      u,
      bipartita = true,
      seguir = true;

    cola.push(Object.keys(this.vertices)[0]);

    if (Object.keys(this.lazos).length > 0) return false;
    while (seguir) {
      while (cola.length > 0) {
        u = cola.pop();

        this.aristas[u].map((i) => {
          if (!this.vertices[i.vertice].conjunto) {
            this.vertices[i.vertice].conjunto = 1 - this.vertices[u].conjunto;
            cola.push(i.vertice);
          } else if (
            this.vertices[i.vertice].conjunto == this.vertices[u].conjunto ||
            this.aristas[i.vertice].filter((j) => {
              return j.vertice == u;
            }).length > 1
          ) {
            bipartita = false;
          }
        });
      }

      for (let i in this.vertices) {
        if (this.vertices[i].conjunto == undefined) {
          this.vertices[i].conjunto = 1;
          cola.push(i);
          break;
        }
      }
      if (cola.length < 1) seguir = false;
    }

    return bipartita;
  }

  pintarVertices() {
    console.log(this.vertices);
  }

  pintarAristas() {
    console.log(this.aristas);
  }
}
