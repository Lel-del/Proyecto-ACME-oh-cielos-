import "./components/acme-button.js";
import "./components/acme-input.js";
import "./components/acme-table.js";

import { initAuthEvents } from "../modules/app-auth.js";
import { initInventoryEvents } from "../modules/inventory.js";
import { initProductionEvents } from "../modules/production.js";

const subInventario = document.getElementById("subpanel-inventario");
const subProduccion = document.getElementById("subpanel-produccion");
const subUsuarios = document.getElementById("subpanel-usuarios");

export function showMessage(text, isError = false) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (isError ? "message--err" : "message--ok");
  messageEl.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthEvents();

  document.getElementById("btn-tab-inventario").addEventListener("click", () => {
    subInventario.style.display = "block";
    subProduccion.style.display = "none";
    subUsuarios.style.display = "none";
  });

  document.getElementById("btn-tab-produccion").addEventListener("click", () => {
    subInventario.style.display = "none";
    subProduccion.style.display = "block";
    subUsuarios.style.display = "none";
  });

  document.getElementById("btn-tab-usuarios").addEventListener("click", () => {
    subInventario.style.display = "none";
    subProduccion.style.display = "none";
    subUsuarios.style.display = "block";
    window.dispatchEvent(new CustomEvent("recargar-usuarios"));
  });
});

export function activarModulosPostLogin() {
  initInventoryEvents();
  initProductionEvents();
}