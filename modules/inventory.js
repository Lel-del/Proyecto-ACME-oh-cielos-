import { DataManager } from "../data/dataManager.js";
import { showMessage } from "../js/main.js";

export let cachedProducts = {};
let ingredientesTemporales = [];

export async function refreshInventoryTable() {
  const table = document.getElementById("tabla-inventario");
  if (!table) return;
  const data = await DataManager.getTodosLosProductos() || {};
  cachedProducts = data;
  
  const tbody = table.querySelector("tbody") || table;
  tbody.innerHTML = "";
  const buscar = document.getElementById("search-inventario")?.value.toLowerCase() || "";
  
  Object.values(data).forEach(prod => {
    if (prod.nombre.toLowerCase().includes(buscar) || prod.codigo.toLowerCase().includes(buscar)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.codigo}</td>
        <td>${prod.nombre}</td>
        <td>${prod.proveedor}</td>
        <td>${prod.esTerminado ? "Terminado" : "Materia Prima"}</td>
        <td>${prod.stock || 0}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}

export async function refreshUsersTable() {
  const tbody = document.querySelector("#tabla-usuarios tbody") || document.querySelector("#tabla-usuarios");
  if (!tbody) return;
  const usuarios = await DataManager.getTodosLosUsuarios() || {};
  tbody.innerHTML = "";
  
  Object.values(usuarios).forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
        <button class="btn btn-edit" data-id="${user.id}">✏️</button>
        <button class="btn btn-delete" data-id="${user.id}" style="background-color:#f44336;">🗑️</button>
      </td>
    `;
    
    tr.querySelector(".btn-edit").addEventListener("click", () => {
      document.getElementById("edit-user-id").value = user.id;
      document.getElementById("edit-user-name").value = user.name;
      document.getElementById("edit-user-role").value = user.role;
      document.getElementById("edit-user-password").value = user.password;
    });
    
    tr.querySelector(".btn-delete").addEventListener("click", async () => {
      if (confirm(`¿Eliminar a ${user.name}?`)) {
        await DataManager.removeUsuario(user.id);
        showMessage("Usuario eliminado.");
        refreshUsersTable();
      }
    });
    
    tbody.appendChild(tr);
  });
}

export function initInventoryEvents() {
  refreshInventoryTable();
  refreshUsersTable();
  
  document.getElementById("search-inventario")?.addEventListener("input", refreshInventoryTable);

  const cbTerminado = document.getElementById("prod-es-terminado");
  const wrapFormula = document.getElementById("wrapper-formula");
  const listaVisual = document.getElementById("lista-ingredientes-agregados");

  cbTerminado?.addEventListener("change", () => {
    wrapFormula.style.display = cbTerminado.checked ? "block" : "none";
    ingredientesTemporales = [];
    listaVisual.innerHTML = "";
  });

  document.getElementById("btn-add-ingrediente")?.addEventListener("click", () => {
    const codMP = document.getElementById("form-mp-codigo").value.trim();
    const cantMP = parseInt(document.getElementById("form-mp-cant").value);

    if (!codMP || !cantMP) return alert("Completa los campos del ingrediente.");

    ingredientesTemporales.push({ materiaCodigo: codMP, cantidadRequerida: cantMP });
    const li = document.createElement("li");
    li.textContent = `• Insumo: ${codMP} → Requiere: ${cantMP} uds.`;
    listaVisual.appendChild(li);

    document.getElementById("form-mp-codigo").value = "";
    document.getElementById("form-mp-cant").value = "";
  });

  document.getElementById("form-producto")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codigo = document.getElementById("prod-codigo").value.trim();
    const nombre = document.getElementById("prod-nombre").value.trim();
    const proveedor = document.getElementById("prod-proveedor").value.trim();
    const esTerminado = cbTerminado ? cbTerminado.checked : false;

    if (esTerminado && ingredientesTemporales.length === 0) return alert("Añade ingredientes a la fórmula.");

    await DataManager.saveProducto(codigo, {
      codigo, nombre, proveedor, stock: 0, esTerminado,
      formula: esTerminado ? ingredientesTemporales : null
    });

    showMessage("Producto guardado.");
    document.getElementById("form-producto").reset();
    if (wrapFormula) wrapFormula.style.display = "none";
    if (listaVisual) listaVisual.innerHTML = "";
    ingredientesTemporales = [];
    refreshInventoryTable();
  });

  document.getElementById("form-add-stock")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codigo = document.getElementById("stock-codigo").value.trim();
    const cantidad = parseInt(document.getElementById("stock-cantidad").value);

    if (!cachedProducts[codigo]) return showMessage("El producto no existe.", true);

    const nuevoStock = (cachedProducts[codigo].stock || 0) + cantidad;
    await DataManager.updateStock(codigo, nuevoStock);
    
    showMessage("Stock actualizado.");
    document.getElementById("form-add-stock").reset();
    refreshInventoryTable();
  });

  document.getElementById("form-editar-usuario")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-user-id").value.trim();
    const name = document.getElementById("edit-user-name").value.trim();
    const role = document.getElementById("edit-user-role").value.trim();
    const password = document.getElementById("edit-user-password").value;

    if (!id) return showMessage("Selecciona un operario usando ✏️.", true);

    await DataManager.saveUsuario(id, { id, name, role, password });
    showMessage("Usuario modificado.");
    document.getElementById("form-editar-usuario").reset();
    refreshUsersTable();
  });
}