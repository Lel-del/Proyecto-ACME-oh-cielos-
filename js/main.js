import "./components/acme-button.js";
import "./components/acme-input.js";
import "./components/acme-table.js";

import { initAuthEvents } from "../modules/app-auth.js";
import { initInventoryEvents, refreshUsersTable } from "../modules/inventory.js";
import { initProductionEvents } from "../modules/production.js";

export function showMessage(text, isError = false) {
  const messageEl = document.getElementById("message");
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = "message " + (isError ? "message--err" : "message--ok");
  messageEl.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthEvents();

  const subInventario = document.getElementById("subpanel-inventario");
  const subProduccion = document.getElementById("subpanel-produccion");
  const subUsuarios = document.getElementById("subpanel-usuarios");

  document.getElementById("btn-tab-inventario")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "block";
    if (subProduccion) subProduccion.style.display = "none";
    if (subUsuarios) subUsuarios.style.display = "none";
  });

  document.getElementById("btn-tab-produccion")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "none";
    if (subProduccion) subProduccion.style.display = "block";
    if (subUsuarios) subUsuarios.style.display = "none";
  });

  document.getElementById("btn-tab-usuarios")?.addEventListener("click", () => {
    if (subInventario) subInventario.style.display = "none";
    if (subProduccion) subProduccion.style.display = "none";
    if (subUsuarios) subUsuarios.style.display = "block";
    refreshUsersTable();
  });
});

export function activarModulosPostLogin() {
  initInventoryEvents();
  initProductionEvents();
}