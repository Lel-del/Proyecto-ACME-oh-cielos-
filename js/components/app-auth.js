const URL_BASE = "https://stock-flow-79314-default-rtdb.firebaseio.com";

class AppAuth extends HTMLElement {
  constructor() {
    super();
    this.view = "login"; 
  }

  connectedCallback() {
    this.render();
  }

  switchView(newView) {
    this.view = newView;
    this.render();
  }

  showMessage(text, isError = false) {
    const messageEl = this.querySelector("#auth-message");
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.className = "message " + (isError ? "message--err" : "message--ok");
      messageEl.style.display = "block";
    }
  }

  render() {
    if (this.view === "login") {
      this.renderLogin();
    } else {
      this.renderRegister();
    }
    this.addEventListeners();
  }

  renderLogin() {
    this.innerHTML = `
      <section class="panel">
        <div class="message" id="auth-message" role="status" style="display:none;"></div>
        <div class="card">
          <h2 class="card__title">Control de Acceso - Planta Macondo</h2>
          <form id="form-login" class="form" autocomplete="off">
            <label class="label">
              <span>Número de Identificación</span>
              <input id="login-id" type="text" required placeholder="Ej: 10987654" />
            </label>
            <label class="label">
              <span>Contraseña</span>
              <input id="login-password" type="password" required placeholder="••••••••" />
            </label>
            <button class="btn" type="submit">Ingresar al Sistema</button>
            <p class="small">¿No tienes cuenta? <a href="#" id="go-to-register" style="color: var(--accent);">Regístrate aquí</a></p>
          </form>
        </div>
      </section>
    `;
  }

  renderRegister() {
    this.innerHTML = `
      <section class="panel">
        <div class="message" id="auth-message" role="status" style="display:none;"></div>
        <div class="card">
          <h2 class="card__title">Registro de Personal - ACME</h2>
          <form id="form-register" class="form" autocomplete="off">
            <label class="label">
              <span>Número de Identificación</span>
              <input id="reg-id" type="text" required placeholder="Ej: 10987654" />
            </label>
            <label class="label">
              <span>Nombre Completo</span>
              <input id="reg-name" type="text" required placeholder="Ej: Coronel Aureliano Buendía" />
            </label>
            <label class="label">
              <span>Cargo Administrativo / Operativo</span>
              <input id="reg-role" type="text" required placeholder="Ej: Operario de Mezcla" />
            </label>
            <label class="label">
              <span>Contraseña</span>
              <input id="reg-password" type="password" required placeholder="••••••••" />
            </label>
            <label class="label">
              <span>Confirmar Contraseña</span>
              <input id="reg-confirm-password" type="password" required placeholder="••••••••" />
            </label>
            <button class="btn btn--alt" type="submit">Guardar y Registrar</button>
            <p class="small">¿Ya tienes usuario? <a href="#" id="go-to-login" style="color: var(--accent-2);">Iniciar Sesión</a></p>
          </form>
        </div>
      </section>
    `;
  }

  addEventListeners() {
    const toRegister = this.querySelector("#go-to-register");
    if (toRegister) toRegister.addEventListener("click", (e) => { e.preventDefault(); this.switchView("register"); });

    const toLogin = this.querySelector("#go-to-login");
    if (toLogin) toLogin.addEventListener("click", (e) => { e.preventDefault(); this.switchView("login"); });

    const formRegister = this.querySelector("#form-register");
    if (formRegister) {
      formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const id = this.querySelector("#reg-id").value.trim();
        const name = this.querySelector("#reg-name").value.trim();
        const role = this.querySelector("#reg-role").value.trim();
        const password = this.querySelector("#reg-password").value;
        const confirmPassword = this.querySelector("#reg-confirm-password").value;

        if (password !== confirmPassword) {
          this.showMessage("Error: Las contraseñas ingresadas no coinciden.", true);
          return;
        }

        try {
          const checkRes = await fetch(`${URL_BASE}/users/${id}.json`);
          const existingUser = await checkRes.json();

          if (existingUser !== null) {
            this.showMessage("Esta identificación ya se encuentra registrada.", true);
            return;
          }

          const newUser = { id, name, role, password };

          const saveRes = await fetch(`${URL_BASE}/users/${id}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
          });

          if (saveRes.ok) {
            this.showMessage("Usuario registrado con éxito en la planta.");
            setTimeout(() => this.switchView("login"), 1500);
          } else {
            this.showMessage("Error al conectar con la base de datos de ACME.", true);
          }
        } catch (error) {
          console.error(error);
          this.showMessage("Ocurrió un error de red o servidor.", true);
        }
      });
    }

    const formLogin = this.querySelector("#form-login");
    if (formLogin) {
      formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = this.querySelector("#login-id").value.trim();
        const password = this.querySelector("#login-password").value;

        try {
          const res = await fetch(`${URL_BASE}/users/${id}.json`);
          const user = await res.json();

          if (user === null || user.password !== password) {
            this.showMessage("Identificación o contraseña incorrectas.", true);
            return;
          }

          this.showMessage(`¡Bienvenido, ${user.name}! Iniciando sesión...`);
          
          this.dispatchEvent(new CustomEvent("login-success", {
            detail: { user: user },
            bubbles: true
          }));

        } catch (error) {
          console.error(error);
          this.showMessage("Error al intentar iniciar sesión.", true);
        }
      });
    }
  }
}

customElements.define("app-auth", AppAuth);