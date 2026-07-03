class AcmeTable extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead><tr style="border-bottom: 2px solid var(--accent, #f4f0d4); text-align: left;"></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    `;
  }

  build(headers, rowsData, actionCallback = null) {
    const theadRow = this.querySelector("thead tr");
    const tbody = this.querySelector("tbody");
    if (!theadRow || !tbody) return;

    theadRow.innerHTML = headers.map(h => `<th style="padding: 8px;">${h}</th>`).join("");
    tbody.innerHTML = "";

    rowsData.forEach(rowData => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px dashed rgba(244, 240, 212, 0.1)";
      
      let columnsHTML = rowData.cells.map(cell => `<td style="padding: 8px;">${cell}</td>`).join("");
      
      if (actionCallback && rowData.id) {
        columnsHTML += `
          <td style="padding: 8px; text-align: center;">
            <button class="btn btn-tbl-edit" data-id="${rowData.id}" style="width:auto; padding:4px 8px; font-size:0.8rem; margin-right:4px;">✏️</button>
            <button class="btn btn--alt btn-tbl-del" data-id="${rowData.id}" style="width:auto; padding:4px 8px; font-size:0.8rem;">❌</button>
          </td>
        `;
      }
      
      tr.innerHTML = columnsHTML;
      tbody.appendChild(tr);
    });

    if (actionCallback) {
      this.querySelectorAll(".btn-tbl-edit").forEach(b => {
        b.addEventListener("click", () => actionCallback("edit", b.getAttribute("data-id")));
      });
      this.querySelectorAll(".btn-tbl-del").forEach(b => {
        b.addEventListener("click", () => actionCallback("delete", b.getAttribute("data-id")));
      });
    }
  }
}
customElements.define("acme-table", AcmeTable);