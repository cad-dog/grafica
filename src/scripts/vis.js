let vertices,
  aristas,
  aristasCopia,
  verticesCopia,
  graficaVis,
  idVertice = 1,
  idArista = 1,
  graficaCopia;

let grafica = new Grafica();

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
    document.getElementById("error").innerHTML =
      "<p>El vértice " +
      document.getElementById("etiqueta").value +
      " ya existe</p>";

    return;
  }

  document.getElementById("error").innerHTML = "";

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
  grafica.pintarAristas();
};

const agregaArista = () => {
  if (!grafica.aristas[document.getElementById("de").value]) {
    document.getElementById("exito").innerHTML = "";

    document.getElementById("error").innerHTML =
      "<p>El vértice " + document.getElementById("de").value + " no existe</p>";

    return;
  } else if (!grafica.aristas[document.getElementById("a").value]) {
    document.getElementById("exito").innerHTML = "";

    document.getElementById("error").innerHTML =
      "<p>El vértice " + document.getElementById("a").value + " no existe</p>";

    return;
  }

  if (
    aristas.get({
      filter: (item) => {
        return item.label == document.getElementById("arista").value;
      },
    })[0]
  ) {
    document.getElementById("error").innerHTML =
      "<p>La arista " +
      document.getElementById("arista").value +
      " ya existe</p>";
    return;
  }
  document.getElementById("error").innerHTML = "";

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
  if (
    !vertices.get({
      filter: (item) => {
        return item.label == document.getElementById("eliminar").value;
      },
    })[0]
  ) {
    document.getElementById("error").innerHTML =
      "<p>El vértice " +
      document.getElementById("eliminar").value +
      " no existe</p>";
    console.log(
      "El vértice " + document.getElementById("eliminar").value + " no existe"
    );

    document.getElementById("exito").innerHTML = "";

    return;
  }
  document.getElementById("error").innerHTML = "";

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
  if (
    !aristas.get({
      filter: (item) => {
        return item.label == document.getElementById("eliminarArista").value;
      },
    })[0]
  ) {
    grafica.eliminarArista(document.getElementById("eliminarArista").value);

    document.getElementById("error").innerHTML =
      "<p>La arista " +
      document.getElementById("eliminarArista").value +
      " no existe</p>";
    console.log(
      "La arista " +
        document.getElementById("eliminarArista").value +
        " no existe"
    );

    document.getElementById("exito").innerHTML = "";

    return;
  }

  document.getElementById("error").innerHTML = "";

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
  grafica.pintarAristas();
};

const buscaVertice = () => {
  if (grafica.buscaVertice(document.getElementById("buscarVertice").value)) {
    document.getElementById("exito").innerHTML =
      "<p> El vértice " +
      document.getElementById("buscarVertice").value +
      " existe</p>";

    document.getElementById("error").innerHTML = "";
  } else {
    document.getElementById("error").innerHTML =
      "<p> El vértice " +
      document.getElementById("buscarVertice").value +
      " no existe</p>";

    document.getElementById("exito").innerHTML = "";
  }
};

const buscaArista = () => {
  if (grafica.buscaArista(document.getElementById("buscarArista").value)) {
    document.getElementById("exito").innerHTML =
      "<p> La arista " +
      document.getElementById("buscarArista").value +
      " existe</p>";

    document.getElementById("error").innerHTML = "";
  } else {
    document.getElementById("error").innerHTML =
      "<p> La arista " +
      document.getElementById("buscarArista").value +
      " no existe</p>";

    document.getElementById("exito").innerHTML = "";
  }
};

const gradoVertice = () => {
  if (
    !vertices.get({
      filter: (item) => {
        return item.label == document.getElementById("gradoVertice").value;
      },
    })[0]
  ) {
    document.getElementById("error").innerHTML =
      "<p>El vértice " +
      document.getElementById("gradoVertice").value +
      " no existe</p>";

    document.getElementById("exito").innerHTML = "";

    console.log(
      "El vértice " +
        document.getElementById("gradoVertice").value +
        " no existe"
    );
    return;
  }
  document.getElementById("error").innerHTML = "";

  document.getElementById("exito").innerHTML =
    "<p>El grado del vértice " +
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
  if (
    !vertices.get({
      filter: (item) => {
        return item.label == document.getElementById("vaciarVertice").value;
      },
    })[0]
  ) {
    document.getElementById("error").innerHTML =
      "<p>El vértice " +
      document.getElementById("vaciarVertice").value +
      " no existe</p>";

    document.getElementById("exito").innerHTML = "";

    console.log(
      "El vértice " +
        document.getElementById("vaciarVertice").value +
        " no existe"
    );
    return;
  }
  document.getElementById("error").innerHTML = "";

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
  grafica = new Grafica();

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  console.log(grafica);
};

const copiaGrafica = () => {
  graficaCopia = grafica.copiaGrafica();

  aristasCopia = new vis.DataSet();
  verticesCopia = new vis.DataSet();

  aristasCopia.add(aristas.get());
  verticesCopia.add(vertices.get());

  console.log(graficaCopia);
};

const restauraGrafica = () => {
  if (!graficaCopia) {
    console.log("No hay una copia guardada");
    return;
  }

  let contenedor = document.getElementById("grafica");

  vertices = verticesCopia;
  aristas = aristasCopia;

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let opciones = {};

  graficaVis = new vis.Network(contenedor, datos, opciones);

  grafica = graficaCopia.copiaGrafica();

  grafica.pintarAristas();

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";
};
