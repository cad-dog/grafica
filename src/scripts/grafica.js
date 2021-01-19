class Grafica {
  constructor() {
    this.vertices = [];
    this.aristas = {};
    this.numAristas = 0;
    this.numVertices = 0;
    this.lazos = {};
  }

  agregarVertice(vertice) {
    this.lazos[vertice] = 0;
    this.vertices.push(vertice);
    this.aristas[vertice] = [];
  }

  agregarArista(v1, v2, peso, etiqueta) {
    this.aristas[v1].push({ etiqueta: etiqueta, vertice: v2, peso: peso });
    this.aristas[v2].push({ etiqueta: etiqueta, vertice: v1, peso: peso });
  }

  eliminarVertice(vertice) {
    this.vertices = this.vertices.filter((v) => v != vertice);
    this.vaciaVertice(vertice);
    delete this.aristas[vertice];
  }

  eliminarArista(arista) {
    Object.keys(this.aristas).map((i) => {
      this.aristas[i] = this.aristas[i].filter((j) => j.arista != arista);
    });
  }

  buscaVertice(vertice) {
    return this.vertices.includes(vertice);
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
    return this.aristas[vertice].length;
  }

  numeroVertices() {
    return console.log(this.vertices.length);
  }

  numeroAristas() {
    return console.log(this.numAristas);
  }

  vaciaVertice(vertice) {
    this.aristas[vertice].map((arista) => {
      this.aristas[arista.vertice] = this.aristas[arista.vertice].filter(
        (i) => i.vertice != vertice
      );
    });
    this.aristas[vertice] = [];
  }

  vaciaGrafica() {
    this.vertices = [];
    this.aristas = {};
    this.lazos = {};
    this.numAristas = 0;
    this.numVertices = 0;
  }

  // copiaGrafica() {

  // }

  pintarVertices() {
    console.log(this.vertices);
  }

  pintarAristas() {
    console.log(this.aristas);
  }
}
