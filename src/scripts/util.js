class ColaPrioridad {
  constructor() {
    this.elementos = [];
    this.longitud = 0;
  }

  // agregar(elemento, prioridad) {
  //   let contiene = false;

  //   for (let i = 0; i < this.elementos.length; i++) {
  //     if (this.prioridad[i] > prioridad) {
  //       this.elementos.splice(i, 0, elemento);
  //       this.prioridad.splice(i, 0, prioridad);
  //       contiene = true;
  //       break;
  //     }
  //   }

  //   if (!contiene) {
  //     this.elementos.push(elemento);
  //     this.prioridad.push(prioridad);
  //   }

  //   this.pintar();
  //   this.longitud++;
  // }

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
