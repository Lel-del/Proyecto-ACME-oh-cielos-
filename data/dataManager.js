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
  }
};