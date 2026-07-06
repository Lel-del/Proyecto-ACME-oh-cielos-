📖 Manual de Operación y Casos de Uso del Prototipo

Una vez que la aplicación esté corriendo en tu pantalla, el flujo operativo correcto para validar la totalidad de los requerimientos es el siguiente:

1. Sistema de Control de Accesos (Login y Registro)
Registro: Al iniciar por primera vez, haz clic en "Regístrate aquí". Completa el formulario con tu número de identificación, nombre completo, cargo operativo y contraseña. El sistema cuenta con una doble validación estricta; si las contraseñas no coinciden, se bloqueará el proceso. Al guardar, los datos se registrarán inmediatamente como un nodo en Firebase.

Autenticación: Regresa al Login e ingresa el ID y la contraseña configurados. El sistema buscará el registro en la nube de forma asíncrona. Si las credenciales son válidas, se desplegará un mensaje de bienvenida personalizado en la barra superior con tu nombre y cargo, y se desbloqueará el Panel de Control completo de la planta.

2. Módulo de Gestión de Inventarios
Alta de Insumos / Materias Primas: Haz clic en el botón 📦 Inventario. En el formulario izquierdo, añade elementos ingresando un código identificador único (ej: MP-01), nombre (ej: Harina) y proveedor. Deja desmarcada la casilla de producto terminado y haz clic en Guardar Producto. El artículo aparecerá en la tabla con stock en 0.

Abastecimiento de Bodega (Incrementar Stock): Ve al formulario Ingresar Materia Prima, digita el código que acabas de crear (ej: MP-01) y la cantidad exacta que ingresa a la planta (ej: 500). Haz clic en Incrementar Saldo. Verás cómo la tabla se actualiza automáticamente reflejando la nueva cantidad en stock.

Filtro y Búsqueda: Utiliza la barra de búsqueda ubicada arriba de la tabla de inventario. Escribe caracteres del código o del nombre; la tabla se filtrará en tiempo real ocultando los elementos que no coincidan.

3. Configuración de Fórmulas Dinámicas (Recetas Multi-Ingrediente)
Creación de Productos Complejos: En el mismo módulo de inventario, inicia el registro de un producto terminado (ej: Código: PT-01, Nombre: Galleta de Macondo).

Asignación de la Receta: Marca la casilla de verificación ¿Es producto terminado?. Esto desplegará un subpanel dinámico. Digita el código de tu primera materia prima (MP-01), la cantidad unitaria necesaria (100) y presiona el botón del símbolo más (➕). Repite este paso para todos los ingredientes que compongan la receta. La pantalla listará de forma visual cada insumo añadido. Al finalizar, haz clic en Guardar Producto.

4. Módulo de Producción Industrial (Transformación)
Ejecución del Proceso: Presiona el botón 🏭 Producción en el menú principal. En el formulario introduce el código del producto terminado que configuraste previamente (PT-01) y la cantidad de unidades que deseas fabricar (ej: 3).

Motor de Validación: Al presionar Ejecutar Transformación, el sistema leerá los ingredientes asociados a la fórmula en Firebase y calculará el consumo total acumulado. Si el inventario de alguna materia prima es insuficiente para cubrir la orden, la transformación se cancelará de inmediato lanzando una alerta y protegiendo al sistema de saldos negativos.

Consecutivo Incremental y Resumen: Si hay existencias suficientes de todos los insumos, el software descontará de forma automática el inventario correspondiente a cada materia prima y sumará las unidades finales al stock del producto terminado. Cada orden genera un código consecutivo único rastreable que inicia en 1 e incrementa de uno en uno en la base de datos. Finalmente, se renderizará en pantalla un cuadro de Resumen Técnico detallando la cantidad fabricada con éxito y el desglose exacto de los recursos consumidos.


Estructura de carpetas:

```
ProyectoAcmeProduccion_JavaScript_ApellidoNombre/
│
├── index.html                  # Interfaz de usuario principal y estructura DOM
├── style.css                   # Hoja de estilos central y diseño responsive
├── README.md                   # Documentación técnica general (este archivo)
│
├── data/
│   └── dataManager.js          # Conector asíncrono y operaciones Fetch con Firebase
│
├── js/
│   └── main.js                 # Enrutador principal, inicializador y Web Components
│
├── modules/
│   ├── app-auth.js             # Lógica del control de accesos, Login y Registro
│   ├── inventory.js            # Lógica del CRUD de productos y control de stock
│   └── production.js           # Motor de recetas y cálculo de órdenes consecutivas
│
└── media/
    ├── img/
    │   └── pato.gif            # Elemento visual interactivo para la UX del sistema
    └── sound/
        ├── Undertaleost.mp3    # Banda sonora de fondo de la aplicación
        └── cuack.mp3           # Efecto de audio para eventos interactivos
```