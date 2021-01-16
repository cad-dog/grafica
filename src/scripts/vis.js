let vertices,
  aristas,
  graficaVis,
  idVertice = 1,
  idArista = 1;

const grafica = new Grafica();

const graficar = () => {
  vertices = new vis.DataSet([]);
  aristas = new vis.DataSet([]);

  let contenedor = document.getElementById("grafica");

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let opciones = {};
  graficaVis = new vis.Network(contenedor, datos, opciones);
};

const agregaVertice = () => {
  if (
    vertices.get({
      filter: (item) => {
        return item.label == document.getElementById("etiqueta").value;
      },
    })[0]
  ) {
    return;
  }

  let etiqueta = document.getElementById("etiqueta").value;
  vertices.add({
    id: idVertice,
    label: etiqueta,
  });

  idVertice += 1;
  grafica.numVertices += 1;

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";

  grafica.agregarVertice(etiqueta);
  grafica.pintarVertices();
  grafica.pintarAristas();
};

const agregaArista = () => {
  if (
    aristas.get({
      filter: (item) => {
        return item.label == document.getElementById("arista").value;
      },
    })[0]
  ) {
    return;
  }

  let v1, v2;

  v1 = vertices.get({
    filter: (item) => {
      return item.label == document.getElementById("de").value;
    },
  })[0];

  v2 = vertices.get({
    filter: (item) => {
      return item.label == document.getElementById("a").value;
    },
  })[0];

  if (v1.label == v2.label) {
    grafica.lazos[v1.label] += 1;
  }

  aristas.add([
    {
      id: idArista,
      from: v1.id,
      to: v2.id,
      label: document.getElementById("arista").value,
    },
  ]);

  idArista += 1;

  grafica.agregarArista(
    v1.label,
    v2.label,
    0,
    document.getElementById("arista").value
  );

  grafica.numAristas += 1;

  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
};

const eliminaVertice = () => {
  vertices.remove({
    id: vertices.get({
      filter: (item) => {
        return item.label == document.getElementById("eliminar").value;
      },
    })[0].id,
  });

  grafica.numAristas -=
    grafica.gradoVertice(document.getElementById("eliminar").value) -
    grafica.lazos[document.getElementById("eliminar").value];

  grafica.numVertices -= 1;
  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";
  grafica.eliminarVertice(document.getElementById("eliminar").value);
  grafica.pintarAristas();
};

const eliminaArista = () => {
  let arista = aristas.get({
    filter: (item) => {
      return item.label == document.getElementById("eliminarArista").value;
    },
  })[0];

  aristas.remove({ id: arista.id });

  grafica.numAristas -= 1;
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.eliminarArista(arista.label);
  grafica.numAristas -= 1;
  grafica.pintarAristas();
};

const buscaVertice = () => {
  document.getElementById("busquedaVertice").innerHTML =
    "<p> El vertice " +
    document.getElementById("buscarVertice").value +
    (grafica.buscaVertice(document.getElementById("buscarVertice").value)
      ? ""
      : " no") +
    " existe</p>";
};

const buscaArista = () => {
  document.getElementById("busquedaArista").innerHTML =
    "<p> La arista " +
    document.getElementById("buscarArista").value +
    (grafica.buscaArista(document.getElementById("buscarArista").value)
      ? ""
      : " no") +
    " existe</p>";
};

const gradoVertice = () => {
  document.getElementById("grado").innerHTML =
    "<p>El grado del vertice " +
    document.getElementById("gradoVertice").value +
    " es: " +
    grafica.gradoVertice(document.getElementById("gradoVertice").value) +
    " </p>";
};

const numVertices = () => {
  grafica.numeroVertices();
};

const numAristas = () => {
  grafica.numeroAristas();
};

const vaciarVertice = () => {
  let vertice = document.getElementById("vaciarVertice").value;
  grafica.aristas[vertice].map((arista) => {
    arista = aristas.get({
      filter: (item) => {
        return item.label == arista.etiqueta;
      },
    })[0];

    if (arista) {
      aristas.remove({ id: arista.id });
    }
  });

  grafica.numAristas -=
    grafica.gradoVertice(document.getElementById("vaciarVertice").value) -
    grafica.lazos[document.getElementById("vaciarVertice").value];

  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.vaciaVertice(vertice);
  grafica.pintarAristas();
};

const vaciaGrafica = () => {
  vertices = new vis.DataSet([]);
  aristas = new vis.DataSet([]);
  let contenedor = document.getElementById("grafica");

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let opciones = {};

  graficaVis = new vis.Network(contenedor, datos, opciones);
  grafica.vaciaGrafica();

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};
