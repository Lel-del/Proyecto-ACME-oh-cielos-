import { DataManager } from "../data/dataManager.js";
import { cachedProducts, refreshInventoryTable } from "./inventory.js";
import { showMessage } from "../js/main.js";

export function initProductionEvents() {
  document.getElementById("form-produccion").addEventListener("submit", (e) => {
    e.preventDefault();
    const codigoPT = document.getElementById("orden-codigo").value.trim();
    const cantidadAFabricar = parseInt(document.getElementById("orden-cantidad").value);

    const productoPT = cachedProducts[codigoPT];
    if (!productoPT || !productoPT.esTerminado || !productoPT.formula) {
      showMessage("Código inválido o no posee receta asignada.", true);
      return;
    }

    const codMP = productoPT.formula.materiaCodigo;
    const cantNecesariaTotal = productoPT.formula.cantidadRequerida * cantidadAFabricar;
    const productoMP = cachedProducts[codMP];

    if (!productoMP || (productoMP.stock || 0) < cantNecesariaTotal) {
      showMessage(`Insumos insuficientes (${codMP}). Se requieren: ${cantNecesariaTotal}.`, true);
      return;
    }

    const nuevoStockMP = productoMP.stock - cantNecesariaTotal;
    const nuevoStockPT = (productoPT.stock || 0) + cantidadAFabricar;

    DataManager.updateStock(codMP, nuevoStockMP);
    DataManager.updateStock(codigoPT, nuevoStockPT);

    const numeroOrden = DataManager.getConsecutivoProduccion();
    DataManager.updateConsecutivoProduccion(numeroOrden + 1);

    showMessage(`Proceso Exitoso. Registrada Orden N° ${numeroOrden}`);
    document.getElementById("form-produccion").reset();
    refreshInventoryTable();

    document.getElementById("resumen-produccion-box").innerHTML = `
      <p style="color: var(--accent-2); font-weight: bold;">✓ Proceso Registrado (Orden N° ${numeroOrden})</p>
      <p><strong>Producto Fabricado:</strong> ${productoPT.nombre} (+${cantidadAFabricar} uds)</p>
      <p><strong>Materia Consumida:</strong> ${productoMP.nombre} (-${cantNecesariaTotal} unidades)</p>
    `;
  });
}