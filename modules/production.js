import { DataManager } from "../data/dataManager.js";
import { cachedProducts, refreshInventoryTable } from "./inventory.js";
import { showMessage } from "../js/main.js";

export function initProductionEvents() {
  document.getElementById("form-produccion")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codigoPT = document.getElementById("orden-codigo").value.trim();
    const cantidadAFabricar = parseInt(document.getElementById("orden-cantidad").value);

    const productoPT = cachedProducts[codigoPT];
    if (!productoPT || !productoPT.esTerminado || !productoPT.formula || !Array.isArray(productoPT.formula)) {
      showMessage("Código inválido o producto no posee una receta configurada.", true);
      return;
    }

    for (const ingrediente of productoPT.formula) {
      const codMP = ingrediente.materiaCodigo;
      const cantNecesariaTotal = ingrediente.cantidadRequerida * cantidadAFabricar;
      const productoMP = cachedProducts[codMP];

      if (!productoMP || (productoMP.stock || 0) < cantNecesariaTotal) {
        showMessage(`Insumos insuficientes. Falta material: ${codMP}. Requerido: ${cantNecesariaTotal}`, true);
        return;
      }
    }

    let resumenIngredientesHTML = "";

    for (const ingrediente of productoPT.formula) {
      const codMP = ingrediente.materiaCodigo;
      const cantNecesariaTotal = ingrediente.cantidadRequerida * cantidadAFabricar;
      const productoMP = cachedProducts[codMP];

      const nuevoStockMP = productoMP.stock - cantNecesariaTotal;
      await DataManager.updateStock(codMP, nuevoStockMP);

      resumenIngredientesHTML += `<li>❌ Consumido: ${productoMP.nombre} (-${cantNecesariaTotal} uds)</li>`;
    }

    const nuevoStockPT = (productoPT.stock || 0) + cantidadAFabricar;
    await DataManager.updateStock(codigoPT, nuevoStockPT);

    const numeroOrden = await DataManager.getConsecutivoProduccion();
    await DataManager.updateConsecutivoProduccion(numeroOrden + 1);

    const de = new Date();
    const fechaActual = `${de.getFullYear()}-${String(de.getMonth() + 1).padStart(2, '0')}-${String(de.getDate()).padStart(2, '0')}`;

    await DataManager.saveOrdenProduccion(numeroOrden, {
      numeroOrden,
      codigoPT,
      nombrePT: productoPT.nombre,
      cantidadAFabricar,
      fecha: fechaActual
    });

    showMessage(`Proceso Exitoso. Registrada Orden N° ${numeroOrden} el día ${fechaActual}`);
    document.getElementById("form-produccion").reset();
    refreshInventoryTable();

    const resumenBox = document.getElementById("resumen-produccion-box");
    if (resumenBox) {
      resumenBox.innerHTML = `
        <p style="color: var(--accent-2); font-weight: bold; margin-bottom:6px;">✓ Resumen Técnico (Orden N° ${numeroOrden})</p>
        <p><strong>Producto Terminado:</strong> ${productoPT.nombre} (+${cantidadAFabricar} uds)</p>
        <ul style="margin-top: 6px; padding-left: 15px; font-size: 0.85rem; color: #ff5722;">
          ${resumenIngredientesHTML}
        </ul>
      `;
    }
  });
}