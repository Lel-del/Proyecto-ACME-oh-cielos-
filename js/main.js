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

const btnTabInventario = document.getElementById("btn-tab-inventario");
const btnTabProduccion = document.getElementById("btn-tab-produccion");
const subInventario = document.getElementById("sub-inventario");
const subProduccion = document.getElementById("sub-produccion");

const formProducto = document.getElementById("form-producto");
const prodCodigo = document.getElementById("prod-codigo");
const prodNombre = document.getElementById("prod-nombre");
const prodProveedor = document.getElementById("prod-proveedor");
const prodEsTerminado = document.getElementById("prod-es-terminado");
const wrapperFormula = document.getElementById("wrapper-formula");
const formMp1Codigo = document.getElementById("form-mp1-codigo");
const formMp1Cant = document.getElementById("form-mp1-cant");

const formStock = document.getElementById("form-stock");
const stockCodigo = document.getElementById("stock-codigo");
const stockCantidad = document.getElementById("stock-cantidad");

const tablaInventarioBody = document.getElementById("tabla-inventario-body");
const inventarioBuscar = document.getElementById("inventario-buscar");

const formProduccion = document.getElementById("form-produccion");
const ordenCodigo = document.getElementById("orden-codigo");
const ordenCantidad = document.getElementById("orden-cantidad");
const resumenProduccionBox = document.getElementById("resumen-produccion-box");

let listadoProductosGlobal = {};

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

btnTabInventario.addEventListener("click", () => {
  subInventario.style.display = "block";
  subProduccion.style.display = "none";
});

btnTabProduccion.addEventListener("click", () => {
  subInventario.style.display = "none";
  subProduccion.style.display = "block";
});

prodEsTerminado.addEventListener("change", () => {
  wrapperFormula.style.display = prodEsTerminado.checked ? "block" : "none";
});

async function cargarInventario() {
  try {
    const res = await fetch(`${URL_BASE}/products.json`);
    listadoProductosGlobal = (await res.json()) || {};
    pintarTabla("");
  } catch (err) {
    console.error(err);
  }
}

function pintarTabla(filtro) {
  tablaInventarioBody.innerHTML = "";
  const termino = filtro.toLowerCase();

  Object.values(listadoProductosGlobal).forEach(prod => {
    if (prod.codigo.toLowerCase().includes(termino) || prod.nombre.toLowerCase().includes(termino)) {
      const fila = document.createElement("tr");
      fila.style.borderBottom = "1px dashed rgba(244, 240, 212, 0.1)";
      fila.innerHTML = `
        <td style="padding: 8px; color: var(--accent);">${prod.codigo}</td>
        <td style="padding: 8px;">${prod.nombre}</td>
        <td style="padding: 8px; color: var(--muted);">${prod.proveedor}</td>
        <td style="padding: 8px; font-weight: bold;">${prod.stock}</td>
        <td style="padding: 8px;">${prod.esTerminado ? "Terminado" : "Materia Prima"}</td>
      `;
      tablaInventarioBody.appendChild(fila);
    }
  });
}

inventarioBuscar.addEventListener("input", (e) => {
  pintarTabla(e.target.value);
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
      cargarInventario();
    }, 1500);

  } catch (error) {
    console.error(error);
    showMessage("Error al intentar iniciar sesión.", true);
  }
});

formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = prodCodigo.value.trim();
  const nombre = prodNombre.value.trim();
  const proveedor = prodProveedor.value.trim();
  const esTerminado = prodEsTerminado.checked;

  let formula = null;
  if (esTerminado) {
    formula = {
      materiaCodigo: formMp1Codigo.value.trim(),
      cantidadRequerida: parseInt(formMp1Cant.value) || 0
    };
  }

  const nuevoProducto = { codigo, nombre, proveedor, stock: 0, esTerminado, formula };

  try {
    await fetch(`${URL_BASE}/products/${codigo}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto)
    });
    showMessage("Producto creado con éxito.");
    formProducto.reset();
    wrapperFormula.style.display = "none";
    cargarInventario();
  } catch (err) {
    showMessage("Error al guardar producto.", true);
  }
});

formStock.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = stockCodigo.value.trim();
  const cantidad = parseInt(stockCantidad.value);

  if (!listadoProductosGlobal[codigo]) {
    showMessage("El código de producto no existe en el sistema.", true);
    return;
  }

  const nuevoStock = (listadoProductosGlobal[codigo].stock || 0) + cantidad;

  try {
    await fetch(`${URL_BASE}/products/${codigo}/stock.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoStock)
    });
    showMessage("Inventario actualizado.");
    formStock.reset();
    cargarInventario();
  } catch (err) {
    showMessage("Error al actualizar stock.", true);
  }
});

formProduccion.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigoPT = ordenCodigo.value.trim();
  const cantAFabricar = parseInt(ordenCantidad.value);

  const producto = listadoProductosGlobal[codigoPT];
  if (!producto || !producto.esTerminado || !producto.formula) {
    showMessage("Código inválido o no es un Producto Terminado con receta.", true);
    return;
  }

  const codMP = producto.formula.materiaCodigo;
  const cantNecesariaTotal = producto.formula.cantidadRequerida * cantAFabricar;

  const materiaPrima = listadoProductosGlobal[codMP];
  if (!materiaPrima || (materiaPrima.stock || 0) < cantNecesariaTotal) {
    showMessage(`Stock insuficiente de la materia prima (${codMP}). Se necesitan ${cantNecesariaTotal}.`, true);
    return;
  }

  try {
    const nuevoStockMP = materiaPrima.stock - cantNecesariaTotal;
    const nuevoStockPT = (producto.stock || 0) + cantAFabricar;

    await fetch(`${URL_BASE}/products/${codMP}/stock.json`, { method: "PUT", body: nuevoStockMP });
    await fetch(`${URL_BASE}/products/${codigoPT}/stock.json`, { method: "PUT", body: nuevoStockPT });

    showMessage("¡Proceso de producción completado con éxito!");
    formProduccion.reset();
    await cargarInventario();

    resumenProduccionBox.innerHTML = `
      <p style="color: var(--accent-2); font-weight: bold;">✓ Proceso Registrado</p>
      <p><strong>Producto Fabricado:</strong> ${producto.nombre} (${cantAFabricar} uds)</p>
      <p><strong>Materia Usada:</strong> ${materiaPrima.nombre} (-${cantNecesariaTotal} unidades)</p>
    `;

  } catch (err) {
    showMessage("Error en la ejecución del proceso productivo.", true);
  }
});