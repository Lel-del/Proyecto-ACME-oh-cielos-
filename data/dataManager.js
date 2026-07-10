const URL_BASE = "https://stock-flow-79314-default-rtdb.firebaseio.com";

export const DataManager = {
  async getUsuario(id) {
    const res = await fetch(`${URL_BASE}/users/${id}.json`);
    return await res.json();
  },

  async saveUsuario(id, datos) {
    return await fetch(`${URL_BASE}/users/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
  },

  async getTodosLosUsuarios() {
    const res = await fetch(`${URL_BASE}/users.json`);
    return (await res.json()) || {};
  },

  async removeUsuario(id) {
    return await fetch(`${URL_BASE}/users/${id}.json`, { method: "DELETE" });
  },

  async getTodosLosProductos() {
    const res = await fetch(`${URL_BASE}/products.json`);
    return (await res.json()) || {};
  },

  async saveProducto(codigo, datos) {
    return await fetch(`${URL_BASE}/products/${codigo}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
  },

  async updateStock(codigo, nuevoStock) {
    return await fetch(`${URL_BASE}/products/${codigo}/stock.json`, {
      method: "PUT",
      body: nuevoStock
    });
  },

  async getConsecutivoProduccion() {
    const res = await fetch(`${URL_BASE}/consecutivo.json`);
    const num = await res.json();
    return num || 1;
  },

  async updateConsecutivoProduccion(nuevoNum) {
    return await fetch(`${URL_BASE}/consecutivo.json`, {
      method: "PUT",
      body: nuevoNum
    });
  },

  async saveOrdenProduccion(numeroOrden, datos) {
    return await fetch(`${URL_BASE}/ordenes/${numeroOrden}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
  },

  async getTodasLasOrdenes() {
    const res = await fetch(`${URL_BASE}/ordenes.json`);
    return (await res.json()) || {};
  },

  async updateOrdenProduccion(numeroOrden, nuevosDatos) {
    return await fetch(`${URL_BASE}/ordenes/${numeroOrden}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevosDatos)
    });
  }
};