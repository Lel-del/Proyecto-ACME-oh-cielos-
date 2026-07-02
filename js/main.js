const URL_BASE = "https://stock-flow-79314-default-rtdb.firebaseio.com";

const messageEl = document.getElementById("message");
const userDisplay = document.getElementById("user-display");

const sectionLogin = document.getElementById("section-login");
const sectionRegister = document.getElementById("section-register");
const sectionSystem = document.getElementById("section-system");

const goToRegisterBtn = document.getElementById("go-to-register");
const goToLoginBtn = document.getElementById("go-to-login");

const formRegister = document.getElementById("form-register");
const regId = document.getElementById("reg-id");
const regName = document.getElementById("reg-name");
const regRole = document.getElementById("reg-role");
const regPassword = document.getElementById("reg-password");
const regConfirmPassword = document.getElementById("reg-confirm-password");

const formLogin = document.getElementById("form-login");
const loginId = document.getElementById("login-id");
const loginPassword = document.getElementById("login-password");
const welcomeText = document.getElementById("welcome-text");

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = "message " + (isError ? "message--err" : "message--ok");
  messageEl.style.display = "block";
}

goToRegisterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  messageEl.style.display = "none";
  sectionLogin.style.display = "none";
  sectionRegister.style.display = "block";
});

goToLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  messageEl.style.display = "none";
  sectionRegister.style.display = "none";
  sectionLogin.style.display = "block";
});

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = regId.value.trim();
  const name = regName.value.trim();
  const role = regRole.value.trim();
  const password = regPassword.value;
  const confirmPassword = regConfirmPassword.value;

  if (password !== confirmPassword) {
    showMessage("Error: Las contraseñas ingresadas no coinciden.", true);
    return;
  }

  try {
    const checkRes = await fetch(`${URL_BASE}/users/${id}.json`);
    const existingUser = await checkRes.json();

    if (existingUser !== null) {
      showMessage("Esta identificación ya se encuentra registrada.", true);
      return;
    }

    const newUser = { id, name, role, password };

    const saveRes = await fetch(`${URL_BASE}/users/${id}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    if (saveRes.ok) {
      showMessage("Usuario registrado con éxito en la planta.");
      formRegister.reset();
      
      setTimeout(() => {
        messageEl.style.display = "none";
        sectionRegister.style.display = "none";
        sectionLogin.style.display = "block";
      }, 1500);
    } else {
      showMessage("Error al conectar con la base de datos de ACME.", true);
    }

  } catch (error) {
    console.error(error);
    showMessage("Ocurrió un error en el servidor.", true);
  }
});

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = loginId.value.trim();
  const password = loginPassword.value;

  try {
    const res = await fetch(`${URL_BASE}/users/${id}.json`);
    const user = await res.json();

    if (user === null || user.password !== password) {
      showMessage("Identificación o contraseña incorrectas.", true);
      return;
    }

    showMessage(`¡Bienvenido, ${user.name}! Iniciando sesión...`);
    formLogin.reset();

    userDisplay.textContent = `Operario: ${user.name} (${user.role})`;

    setTimeout(() => {
      messageEl.style.display = "none";
      sectionLogin.style.display = "none";
      welcomeText.textContent = `¡Hola ${user.name}! Has ingresado correctamente con el cargo de ${user.role}.`;
      sectionSystem.style.display = "block";
    }, 1500);

  } catch (error) {
    console.error(error);
    showMessage("Error al intentar iniciar sesión.", true);
  }
});