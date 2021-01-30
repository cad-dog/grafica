const algoritmoFleury = (grafica) => {
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
  pila.unshift(comienzo);

  console.log(graficaCopia.aristas);
  console.log(grafica);

  while (graficaCopia.numAristas > 0) {
    console.log("AAASDASD");
    console.log(graficaCopia.aristas);
    if (graficaCopia.aristas[verticeActual].length > 0) {
      // Asignamos la arista que vamos a eliminar
      aristaEliminada = graficaCopia.aristas[verticeActual][0].etiqueta;

      // Cambiamos al siguiente vertice
      verticeActual = graficaCopia.aristas[verticeActual][0].vertice;

      // Eliminamos la arista
      graficaCopia.eliminarArista(aristaEliminada);

      // Metemos el vertice actual a la pila
      pila.unshift(verticeActual);
    } else {
      while (!graficaCopia.aristas[verticeActual].length > 0) {
        verticeActual = pila.shift();
        cola.push(verticeActual);
      }
      console.log("camino");
      console.log(cola.concat(pila));
    }
  }
  pila.unshift();
  while (pila.length > 0) {
    cola.push(pila.shift());
  }

  console.log(cola);
};
