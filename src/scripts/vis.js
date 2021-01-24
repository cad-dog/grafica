let vertices,
  aristas,
  aristasCopia,
  verticesCopia,
  graficaVis,
  idVertice = 1,
  idArista = 1,
  graficaCopia,
  bipartita;

let grafica = new Grafica();

const graficar = () => {
  vertices = new vis.DataSet([]);
  aristas = new vis.DataSet([]);

  let contenedor = document.getElementById("grafica");

  let datos = {
    nodes: vertices,
    edges: aristas,
  };
  let opciones = {
    groups: {
      a: { color: "#f4b1f7" },
      b: { color: "#f7f6b1" },
      c: { color: "#b5f7b1" },
    },
  };
  graficaVis = new vis.Network(contenedor, datos, opciones);

  bipartita = grafica.esBipartita();

  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (bipartita ? "" : "no ") + "bipartita</p>";
};

const agregaVertice = () => {
  // Checamos que el vertice no exista
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

  // Agregar vertice a la estructura grafica
  grafica.agregarVertice(etiqueta);

  // Agregar vertice a la grafica visual

  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";

  // Asignar particion
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  vertices.add({
    id: idVertice,
    label: etiqueta,
    group: grafica.vertices[etiqueta].conjunto == 1 ? "a" : "b",
  });
  console.log(vertices.get());

  idVertice += 1;
  grafica.numVertices += 1;

  // Actualizar informacion en la pagina

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const agregaArista = () => {
  // Checamos que los vertices en los que se quiere agregar la arista existen
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

  // Checamos que la arista que se quiere agregar no exista
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

  // Obtenemos los vertices de la grafica visual
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

  // Si es un lazo aumentamos el numero de lazos
  if (v1.label == v2.label) {
    if (!grafica.lazos[v1.label]) grafica.lazos[v1.label] = 0;
    grafica.lazos[v1.label] += 1;
  }

  // Agregamos la arista a la estructura grafica
  grafica.agregarArista(
    v1.label,
    v2.label,
    0,
    document.getElementById("arista").value
  );
  grafica.numAristas += 1;

  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";

  v1.group = grafica.vertices[v1.label].conjunto == 1 ? "a" : "b";
  v2.group = grafica.vertices[v2.label].conjunto == 1 ? "a" : "b";

  if (!grafica.esBipartita()) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  vertices.update(vertices.get());

  // Agregamos la arista a la grafica visual
  aristas.add([
    {
      id: idArista,
      from: v1.id,
      to: v2.id,
      label: document.getElementById("arista").value,
      color: "#6762cc",
    },
  ]);

  idArista += 1;

  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const eliminaVertice = () => {
  let vertice = vertices.get({
    filter: (item) => {
      return item.label == document.getElementById("eliminar").value;
    },
  })[0];

  // Checamos que el vertice que queremos eliminar existe
  if (!vertice) {
    document.getElementById("error").innerHTML =
      "<p>El vértice " +
      document.getElementById("eliminar").value +
      " no existe</p>";
    console.log("El vértice " + vertice.label + " no existe");

    document.getElementById("exito").innerHTML = "";

    return;
  }
  document.getElementById("error").innerHTML = "";

  grafica.numAristas -=
    grafica.gradoVertice(vertice.label) -
    (grafica.lazos[vertice.label] ? grafica.lazos[vertice.label] : 0);

  grafica.numVertices -= 1;

  // Asignar particion
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  // Eliminamos el vertice de la estructura grafica
  grafica.eliminarVertice(vertice.label);

  delete grafica.lazos[vertice.label];

  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";

  if (!grafica.esBipartita()) {
    vertices.get().map((i) => {
      i.group = "c";
    });
  }

  // Eliminamos el vertice de la grafica visual
  vertices.remove({
    id: vertice.id,
  });

  aristas.remove(
    aristas.get().filter((i) => {
      return i.from == vertice.id || i.to == vertice.id;
    })
  );

  vertices.update(vertices.get());
  aristas.update(aristas.get());

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.pintarAristas();
  grafica.pintarVertices();
};

const eliminaArista = () => {
  if (
    !aristas.get({
      filter: (item) => {
        return item.label == document.getElementById("eliminarArista").value;
      },
    })[0]
  ) {
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

  v1 = vertices.get({
    filter: (item) => {
      return item.id == arista.from;
    },
  })[0];

  v2 = vertices.get({
    filter: (item) => {
      return item.id == arista.to;
    },
  })[0];

  if (v1.label == v2.label) {
    if (!grafica.lazos[v1.label]) grafica.lazos[v1.label] = 0;
    grafica.lazos[v1.label] -= 1;
  }
  grafica.eliminarArista(arista.label);

  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  aristas.remove({ id: arista.id });

  vertices.update(vertices.get());
  aristas.update(aristas.get());

  grafica.numAristas -= 1;
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";
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
    (grafica.lazos[document.getElementById("vaciarVertice").value]
      ? grafica.lazos[document.getElementById("vaciarVertice").value]
      : 0);

  delete grafica.lazos[document.getElementById("vaciarVertice").value];

  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";

  grafica.vaciaVertice(vertice);
  grafica.esBipartita();
  vertices.get().map((i) => {
    i.group = grafica.vertices[i.label].conjunto ? "a" : "b";
  });

  vertices.update(vertices.get());
  aristas.update(aristas.get());

  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";

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
  let opciones = {
    groups: {
      a: { color: "#f4b1f7" },
      b: { color: "#f7f6b1" },
      c: { color: "#b5f7b1" },
    },
  };

  graficaVis = new vis.Network(contenedor, datos, opciones);
  grafica = new Grafica();

  document.getElementById("numVertices").innerHTML =
    "<p>" + grafica.numVertices + "</p>";
  document.getElementById("numAristas").innerHTML =
    "<p>" + grafica.numAristas + "</p>";
  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";

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
  document.getElementById("bipartita").innerHTML =
    "<p>Grafica " + (grafica.esBipartita() ? "" : "no ") + "bipartita</p>";
};
