import { DataManager } from "../data/dataManager.js";
import { showMessage } from "../js/main.js";

export let cachedProducts = {};
let cachedUsers = {};

export function refreshInventoryTable() {
  cachedProducts = DataManager.getTodosLosProductos();
  renderProducts("");
}

function renderProducts(filtro) {
  const acmeTable = document.getElementById("tabla-inventario");
  const query = filtro.toLowerCase();

  const headers = ["Código", "Nombre", "Proveedor", "Stock", "Tipo"];
  const rows = Object.values(cachedProducts)
    .filter(p => p.codigo.toLowerCase().includes(query) || p.nombre.toLowerCase().includes(query))
    .map(p => ({
      cells: [
        `<span style="color:var(--accent);">${p.codigo}</span>`,
        p.nombre,
        `<span style="color:var(--muted);">${p.proveedor}</span>`,
        `<strong>${p.stock}</strong>`,
        p.esTerminado ? "Terminado" : "Materia Prima"
      ]
    }));

  acmeTable.build(headers, rows);
}

function refreshUsersTable() {
  cachedUsers = DataManager.getTodosLosUsuarios();
  const acmeTable = document.getElementById("tabla-usuarios");

  const headers = ["ID", "Nombre", "Cargo", "Acciones"];
  const rows = Object.values(cachedUsers).map(u => ({
    id: u.id,
    cells: [u.id, u.name, u.role]
  }));

  acmeTable.build(headers, rows, (action, id) => {
    if (action === "edit") {
      const u = cachedUsers[id];
      document.getElementById("edit-user-id").value = u.id;
      document.getElementById("edit-user-name").value = u.name;
      document.getElementById("edit-user-role").value = u.role;
      document.getElementById("edit-user-password").value = u.password;
    } else if (action === "delete") {
      if (confirm(`¿Dar de baja al operario con ID ${id}?`)) {
        DataManager.removeUsuario(id);
        showMessage("Operario dado de baja.");
        refreshUsersTable();
      }
    }
  });
}

export function initInventoryEvents() {
  refreshInventoryTable();

  window.addEventListener("recargar-usuarios", () => {
    refreshUsersTable();
  });

  const cbTerminado = document.getElementById("prod-es-terminado");
  const wrapFormula = document.getElementById("wrapper-formula");
  cbTerminado.addEventListener("change", () => {
    wrapFormula.style.display = cbTerminado.checked ? "block" : "none";
  });

  document.getElementById("inventario-buscar").addEventListener("input", (e) => {
    renderProducts(e.target.value);
  });

  document.getElementById("form-producto").addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = document.getElementById("prod-codigo").value.trim();
    const nombre = document.getElementById("prod-nombre").value.trim();
    const proveedor = document.getElementById("prod-proveedor").value.trim();
    const esTerminado = cbTerminado.checked;

    let formula = null;
    if (esTerminado) {
      formula = {
        materiaCodigo: document.getElementById("form-mp-codigo").value.trim(),
        cantidadRequerida: parseInt(document.getElementById("form-mp-cant").value) || 0
      };
    }

    DataManager.saveProducto(codigo, { codigo, nombre, proveedor, stock: 0, esTerminado, formula });
    showMessage("Ficha de producto almacenada.");
    document.getElementById("form-producto").reset();
    wrapFormula.style.display = "none";
    refreshInventoryTable();
  });

  document.getElementById("form-stock").addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = document.getElementById("stock-codigo").value.trim();
    const cantidad = parseInt(document.getElementById("stock-cantidad").value);

    if (!cachedProducts[codigo]) {
      showMessage("Código inexistente.", true);
      return;
    }

    const nuevoStock = (cachedProducts[codigo].stock || 0) + cantidad;
    DataManager.updateStock(codigo, nuevoStock);
    showMessage("Saldo incrementado en inventario.");
    document.getElementById("form-stock").reset();
    refreshInventoryTable();
  });

  document.getElementById("form-editar-usuario").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-user-id").value;
    if (!id) return;

    const actualizados = {
      id,
      name: document.getElementById("edit-user-name").value.trim(),
      role: document.getElementById("edit-user-role").value.trim(),
      password: document.getElementById("edit-user-password").value
    };

    DataManager.saveUsuario(id, actualizados);
    showMessage("Datos de personal actualizados.");
    document.getElementById("form-editar-usuario").reset();
    refreshUsersTable();
  });
}