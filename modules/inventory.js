import { DataManager } from "../data/dataManager.js";
import { showMessage } from "../js/main.js";

export let cachedProducts = {};
let ingredientesTemporales = [];

export async function refreshInventoryTable() {
  const table = document.getElementById("tabla-inventario");
  if (!table) return;
  const data = await DataManager.getTodosLosProductos();
  cachedProducts = data;
  
  const tbody = table.querySelector("tbody") || table;
  tbody.innerHTML = "";
  
  const buscar = document.getElementById("search-inventario")?.value.toLowerCase() || "";
  
  Object.keys(data).forEach(id => {
    const prod = data[id];
    if (prod.nombre.toLowerCase().includes(buscar) || prod.codigo.toLowerCase().includes(buscar)) {
      const tr = document.createElement("tr");
      
      const tdCod = document.createElement("td");
      tdCod.textContent = prod.codigo;
      tr.appendChild(tdCod);
      
      const tdNom = document.createElement("td");
      tdNom.textContent = prod.nombre;
      tr.appendChild(tdNom);
      
      const tdProv = document.createElement("td");
      tdProv.textContent = prod.proveedor;
      tr.appendChild(tdProv);
      
      const tdTipo = document.createElement("td");
      tdTipo.textContent = prod.esTerminado ? "Terminado" : "Materia Prima";
      tr.appendChild(tdTipo);
      
      const tdStock = document.createElement("td");
      tdStock.textContent = prod.stock || 0;
      tr.appendChild(tdStock);
      
      tbody.appendChild(tr);
    }
  });
}

export function initInventoryEvents() {
  refreshInventoryTable();
  
  document.getElementById("search-inventario")?.addEventListener("input", () => {
    refreshInventoryTable();
  });

  const cbTerminado = document.getElementById("prod-es-terminado");
  const wrapFormula = document.getElementById("wrapper-formula");
  const listaVisual = document.getElementById("lista-ingredientes-agregados");

  if (cbTerminado) {
    cbTerminado.addEventListener("change", () => {
      wrapFormula.style.display = cbTerminado.checked ? "block" : "none";
      ingredientesTemporales = [];
      listaVisual.innerHTML = "";
    });
  }

  document.getElementById("btn-add-ingrediente")?.addEventListener("click", () => {
    const codMP = document.getElementById("form-mp-codigo").value.trim();
    const cantMP = parseInt(document.getElementById("form-mp-cant").value);

    if (!codMP || !cantMP) {
      alert("Por favor digita el código y la cantidad del ingrediente.");
      return;
    }

    ingredientesTemporales.push({ materiaCodigo: codMP, cantidadRequerida: cantMP });
    
    const li = document.createElement("li");
    li.textContent = `• Insumo: ${codMP} → Requiere: ${cantMP} unidades.`;
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

    if (esTerminado && ingredientesTemporales.length === 0) {
      alert("Debes agregar al menos un ingrediente a la fórmula del producto terminado.");
      return;
    }

    await DataManager.saveProducto(codigo, {
      codigo,
      nombre,
      proveedor,
      stock: 0,
      esTerminado,
      formula: esTerminado ? ingredientesTemporales : null
    });

    showMessage("Ficha de producto almacenada con su fórmula completa.");
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

    if (!cachedProducts[codigo]) {
      showMessage("El producto especificado no existe.", true);
      return;
    }

    const nuevoStock = (cachedProducts[codigo].stock || 0) + cantidad;
    await DataManager.updateStock(codigo, nuevoStock);
    
    showMessage("Inventario actualizado correctamente.");
    document.getElementById("form-add-stock").reset();
    refreshInventoryTable();
  });
}