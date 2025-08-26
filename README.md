# 🍟 Kiosco de Autoservicio McDonald's (Simulación)

Este proyecto es una simulación de una aplicación web completa para un kiosco de autoservicio de McDonald's. La aplicación cuenta con un frontend interactivo para que los clientes seleccionen productos y un backend robusto que procesa y almacena los pedidos en una base de datos.

## ✨ Características

- **Frontend Interactivo:** Interfaz de usuario moderna construida con HTML, CSS y JavaScript puro, que permite a los usuarios navegar por categorías, ver productos y añadirlos a un carrito.
- **Flujo de Pedido Completo:** Desde la selección de productos hasta una página de confirmación de pedido.
- **Backend y Persistencia de Datos:** Un servidor backend construido con Node.js y Express que recibe los pedidos y los guarda en una base de datos SQLite.
- **Estructura Profesional:** El código está organizado siguiendo las mejores prácticas, con una clara separación entre el frontend, el backend y los recursos (`assets`).

---

## 🏛️ Arquitectura del Proyecto

El proyecto está dividido en dos componentes principales:

1.  **Frontend (Cliente):**
    - **Tecnologías:** HTML5, CSS3, JavaScript (Vanilla).
    - **Responsabilidad:** Renderizar la interfaz de usuario, gestionar las interacciones del cliente (clics, selecciones) y comunicarse con el backend a través de peticiones API (`fetch`) para enviar el pedido final.

2.  **Backend (Servidor):**
    - **Tecnologías:** Node.js, Express.js, SQLite3.
    - **Responsabilidad:** Exponer una API para recibir pedidos. Valida los datos recibidos del frontend y los almacena de forma segura y persistente en una base de datos SQLite. Se encarga de toda la lógica de negocio.

---

## 📁 Estructura de Carpetas

El proyecto está organizado de la siguiente manera para facilitar su mantenimiento y escalabilidad:

```
/MCDONALDS/
|
|-- assets/                 # Todos los recursos estáticos del frontend
|   |-- css/                # Archivos de estilos CSS
|   |-- js/                 # Archivos de lógica JavaScript
|   `-- images/             # Imágenes (logos, productos, etc.)
|
|-- backend/                # Contiene toda la lógica del servidor
|   |-- node_modules/       # (Ignorado por Git) Dependencias del backend
|   |-- database.js         # Script para crear y poblar la base de datos
|   |-- server.js           # El servidor principal de la API (Express)
|   |-- mcdonalds.db        # (Ignorado por Git) El archivo de la base de datos SQLite
|   |-- package.json        # Define el proyecto de Node.js y sus dependencias
|   `-- package-lock.json
|
|-- pages/                  # Páginas HTML adicionales
|   |-- order-confirmation.html
|   `-- special-offers.html
|
|-- .gitignore              # Especifica qué archivos ignorar en el repositorio
|-- index.html              # Punto de entrada principal de la aplicación (el kiosco)
`-- README.md               # Este archivo
```

---

## 🚀 Cómo Ejecutar el Proyecto

Sigue estos pasos para poner en marcha la aplicación completa en tu entorno local.

**Requisitos:** Tener [Node.js](https://nodejs.org/) instalado (que incluye npm).

**1. Iniciar el Backend:**

   El servidor debe estar en funcionamiento para que la aplicación pueda guardar los pedidos.

   ```bash
   # 1. Navega a la carpeta del backend
   cd backend

   # 2. Instala las dependencias (solo la primera vez)
   npm install

   # 3. Inicia el servidor
   node server.js
   ```

   Si todo va bien, verás el mensaje: `Servidor corriendo en http://localhost:3000`.
   **Deja esta terminal abierta.**

**2. Abrir el Frontend:**

   Con el servidor ya corriendo, simplemente abre el archivo `index.html` que se encuentra en la raíz del proyecto en tu navegador web preferido (como Google Chrome, Firefox, etc.).

¡Y listo! Ya puedes interactuar con el kiosco, y cada vez que completes un pedido, se guardará en la base de datos `mcdonalds.db`.
