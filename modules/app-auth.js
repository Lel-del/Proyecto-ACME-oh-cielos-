import { DataManager } from "../data/dataManager.js";
import { showMessage, activarModulosPostLogin } from "../js/main.js";

export function initAuthEvents() {
  const secLogin = document.getElementById("section-login");
  const secRegister = document.getElementById("section-register");
  const secSystem = document.getElementById("section-system");

  document.getElementById("go-to-register").addEventListener("click", (e) => {
    e.preventDefault();
    secLogin.style.display = "none";
    secRegister.style.display = "block";
  });

  document.getElementById("go-to-login").addEventListener("click", (e) => {
    e.preventDefault();
    secRegister.style.display = "none";
    secLogin.style.display = "block";
  });

  document.getElementById("form-register").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("reg-id").value.trim();
    const name = document.getElementById("reg-name").value.trim();
    const role = document.getElementById("reg-role").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;

    if (password !== confirm) {
      showMessage("Error: Las contraseñas no coinciden.", true);
      return;
    }

    const existe = await DataManager.getUsuario(id);
    if (existe) {
      showMessage("El usuario ya se encuentra registrado.", true);
      return;
    }

    await DataManager.saveUsuario(id, { id, name, role, password });
    showMessage("Operario registrado exitosamente.");
    document.getElementById("form-register").reset();
    setTimeout(() => {
      secRegister.style.display = "none";
      secLogin.style.display = "block";
    }, 1500);
  });

  document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("login-id").value.trim();
    const password = document.getElementById("login-password").value;

    const user = await DataManager.getUsuario(id);
    if (!user || user.password !== password) {
      showMessage("Credenciales incorrectas.", true);
      return;
    }

    showMessage(`Conexión exitosa. ¡Bienvenido ${user.name}!`);
    document.getElementById("form-login").reset();
    document.getElementById("user-display").textContent = `Operario: ${user.name} (${user.role})`;

    setTimeout(() => {
      document.getElementById("message").style.display = "none";
      secLogin.style.display = "none";
      document.getElementById("welcome-text").textContent = `Sesión iniciada como: ${user.name} - Planta Macondo.`;
      secSystem.style.display = "block";
      activarModulosPostLogin();
    }, 1200);
  });
}