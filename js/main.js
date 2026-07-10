import "./components/acme-button.js";
import "./components/acme-input.js";
import "./components/acme-table.js";

import { initAuthEvents } from "../modules/app-auth.js";
import { initInventoryEvents, refreshUsersTable } from "../modules/inventory.js";
import { initProductionEvents } from "../modules/production.js";
import { DataManager } from "../data/dataManager.js";

export function showMessage(text, isError = false) {
  const messageEl = document.getElementById("message");
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = "message " + (isError ? "message--err" : "message--ok");
  messageEl.style.display = "block";
}

async function generarReporteFechas() {
  const fInicio = document.getElementById("rep-fecha-inicio").value;
  const fFin = document.getElementById("rep-fecha-fin").value;
  const tbody = document.querySelector("#tabla-reporte tbody");
  
  if (!fInicio || !fFin) return alert("Por favor selecciona ambas fechas.");
  if (!tbody) return;
  
  tbody.innerHTML = "";
  const ordenes = await DataManager.getTodasLasOrdenes();
  
  Object.values(ordenes).forEach(orden => {
    if (orden.fecha >= fInicio && orden.fecha <= fFin) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding: 8px;">${orden.codigoPT}</td>
        <td style="padding: 8px;">${orden.nombrePT}</td>
        <td style="padding: 8px;">${orden.cantidadAFabricar}</td>
        <td style="padding: 8px;">${orden.fecha}</td>
        <td style="padding: 8px; text-align: center;">
          <button class="btn btn-edit-orden" data-id="${orden.numeroOrden}" data-fecha="${orden.fecha}" style="padding: 4px 8px; width: auto;">✏️</button>
        </td>
      `;

      tr.querySelector(".btn-edit-orden").addEventListener("click", () => {
        document.getElementById("edit-orden-id").value = orden.numeroOrden;
        document.getElementById("edit-orden-fecha").value = orden.fecha;
      });

      tbody.appendChild(tr);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthEvents();

  const subInventario = document.getElementById("subpanel-inventario");
  const subProduccion = document.getElementById("subpanel-produccion");
  const subUsuarios = document.getElementById("subpanel-usuarios");
  const subReportes = document.getElementById("subpanel-reportes");

  document.getElementById("btn-tab-inventario")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "block";
    if (subProduccion) subProduccion.style.display = "none";
    if (subUsuarios) subUsuarios.style.display = "none";
    if (subReportes) subReportes.style.display = "none";
  });

  document.getElementById("btn-tab-produccion")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "none";
    if (subProduccion) subProduccion.style.display = "block";
    if (subUsuarios) subUsuarios.style.display = "none";
    if (subReportes) subReportes.style.display = "none";
  });

  document.getElementById("btn-tab-usuarios")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "none";
    if (subProduccion) subProduccion.style.display = "none";
    if (subUsuarios) subUsuarios.style.display = "block";
    if (subReportes) subReportes.style.display = "none";
    refreshUsersTable();
  });

  document.getElementById("btn-tab-reportes")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "none";
    if (subProduccion) subProduccion.style.display = "none";
    if (subUsuarios) subUsuarios.style.display = "none";
    if (subReportes) subReportes.style.display = "block";
  });

  document.getElementById("btn-generar-reporte")?.addEventListener("click", generarReporteFechas);

  document.getElementById("form-editar-orden")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const numeroOrden = document.getElementById("edit-orden-id").value;
    const nuevaFecha = document.getElementById("edit-orden-fecha").value;

    if (!numeroOrden) return alert("Selecciona una orden de la lista usando ✏️.");

    await DataManager.updateOrdenProduccion(numeroOrden, { fecha: nuevaFecha });
    showMessage("Fecha de orden actualizada.");
    
    document.getElementById("form-editar-orden").reset();
    generarReporteFechas();
  });
});

export function activarModulosPostLogin() {
  initInventoryEvents();
  initProductionEvents();
}