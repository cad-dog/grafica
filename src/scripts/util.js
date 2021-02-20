const busqueda = (v, padre) => {
  if (padre[v] == v) return v;
  padre[v] = busqueda(padre[v], padre);
  return padre[v];
};

const union = (u, v, padre) => {
  padre[busqueda(u, padre)] = busqueda(v, padre);
};
