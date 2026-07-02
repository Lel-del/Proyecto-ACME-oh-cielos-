document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app-container");
  const userDisplay = document.getElementById("user-display");

  const authComponent = document.createElement("app-auth");
  container.appendChild(authComponent);

  container.addEventListener("login-success", (event) => {
    const loggedUser = event.detail.user;
    
    userDisplay.textContent = `Operario: ${loggedUser.name} (${loggedUser.role})`;

    container.innerHTML = `
      <section class="panel">
        <div class="card">
          <h2 class="card__title" style="color: var(--accent-2);">✓ Acceso Concedido</h2>
          <p>¡Hola ${loggedUser.name}! Has ingresado correctamente con el cargo de ${loggedUser.role}. Próximamente aquí verás los módulos de Inventario y Producción de la planta Macondo.</p>
        </div>
      </section>
    `;
  });
}); 