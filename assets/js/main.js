// Estado de la aplicación (simulando una base de datos en memoria)
let cart = {
    // combo1: 2 // Ejemplo: el carrito ya tiene 2 combos Big Mac
};
let currentCategory = 'combos';
let currentView = 'grid';

// Datos de productos (simulando una API)
const products = {
    // Combos
    combo1: { name: "Big Mac Combo", price: 8.99, category: "combos", emoji: "🍔", description: "El clásico Big Mac con papas medianas y bebida a elegir.", ingredients: "Big Mac + Papas Medianas + Bebida Mediana + Salsa" },
    combo2: { name: "Cuarto de Libra Combo", price: 9.49, category: "combos", emoji: "🍔", description: "Hamburguesa Cuarto de Libra con queso, papas grandes y bebida.", ingredients: "Cuarto de Libra + Papas Grandes + Bebida Grande + Postre" },
    combo3: { name: "McNuggets Combo", price: 7.99, category: "combos", emoji: "🍗", description: "10 piezas de McNuggets crujientes con papas y bebida.", ingredients: "10 McNuggets + Papas Medianas + Bebida Mediana + 2 Salsas" },
    combo4: { name: "McPollo Combo", price: 8.49, category: "combos", emoji: "🍗", description: "El icónico McPollo con papas medianas y tu bebida favorita.", ingredients: "McPollo + Papas Medianas + Bebida Mediana" },

    // Hamburguesas
    hamburguesa1: { name: "Big Mac", price: 5.49, category: "hamburguesas", emoji: "🍔", description: "Dos jugosas carnes, salsa especial, lechuga, queso, pepinillos, cebolla.", ingredients: "Carne, pan, salsa Big Mac" },
    hamburguesa2: { name: "Cuarto de Libra", price: 5.99, category: "hamburguesas", emoji: "🍔", description: "Carne 100% de res, queso, cebolla y pepinillos.", ingredients: "Carne, queso, pan" },
    hamburguesa3: { name: "McPollo", price: 4.99, category: "hamburguesas", emoji: "🍗", description: "Pechuga de pollo empanizada, lechuga y mayonesa.", ingredients: "Pollo, pan, mayonesa" },

    // Pollo
    pollo1: { name: "McNuggets 6u.", price: 4.99, category: "pollo", emoji: "🍗", description: "6 piezas de pollo crujiente.", ingredients: "Pollo, empanizado" },
    pollo2: { name: "McNuggets 10u.", price: 6.99, category: "pollo", emoji: "🍗", description: "10 piezas de pollo crujiente.", ingredients: "Pollo, empanizado" },

    // Acompañamientos
    acomp1: { name: "Papas Fritas Medianas", price: 2.99, category: "acompañamientos", emoji: "🍟", description: "Las papas más famosas del mundo.", ingredients: "Papas, sal" },
    acomp2: { name: "Papas Fritas Grandes", price: 3.49, category: "acompañamientos", emoji: "🍟", description: "Aún más de las papas más famosas.", ingredients: "Papas, sal" },
    acomp3: { name: "Aros de Cebolla", price: 3.29, category: "acompañamientos", emoji: "🧅", description: "Crujientes aros de cebolla.", ingredients: "Cebolla, empanizado" },

    // Postres
    postre1: { name: "McFlurry Oreo", price: 3.99, category: "postres", emoji: "🍨", description: "Cremoso helado con trozos de galleta Oreo.", ingredients: "Helado, Oreo" },
    postre2: { name: "Sundae Chocolate", price: 2.49, category: "postres", emoji: "🍨", description: "Helado de vainilla con salsa de chocolate.", ingredients: "Helado, salsa de chocolate" },

    // Bebidas
    bebida1: { name: "Coca-Cola Mediana", price: 1.99, category: "bebidas", emoji: "🥤", description: "Refrescante Coca-Cola.", ingredients: "Bebida carbonatada" },
    bebida2: { name: "Agua Mineral", price: 1.49, category: "bebidas", emoji: "💧", description: "Agua mineral sin gas.", ingredients: "Agua" },
};

const categories = {
    combos: "Combos Populares",
    hamburguesas: "Hamburguesas",
    pollo: "Pollo y Nuggets",
    ensaladas: "Ensaladas Frescas",
    acompañamientos: "Acompañamientos",
    postres: "Postres y Helados",
    bebidas: "Bebidas y Cafés"
};

// --- RENDERIZADO Y ACTUALIZACIONES DE UI ---

/**
 * Renderiza los productos en la cuadrícula principal según la categoría seleccionada.
 */
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ''; // Limpiar la vista actual

    const productsToRender = Object.entries(products).filter(([id, product]) => product.category === currentCategory);

    if (productsToRender.length === 0) {
        productGrid.innerHTML = `<p>No hay productos en esta categoría.</p>`;
        return;
    }

    productsToRender.forEach(([id, product]) => {
        const quantityInCart = cart[id] || 0;
        const isSelected = quantityInCart > 0;

        const card = document.createElement('div');
        card.className = `combo-card ${isSelected ? 'selected' : ''}`;
        card.dataset.productId = id;
        card.onclick = () => addToCart(id); // Click en la tarjeta agrega al carrito

        card.innerHTML = `
            <div class="combo-header">
                <div class="combo-image">${product.emoji}</div>
                <div class="combo-info">
                    <div class="combo-name">${product.name}</div>
                    <div class="combo-price">$${product.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="combo-description">${product.description}</div>
            <div class="combo-ingredients">
                <strong>Incluye:</strong> ${product.ingredients}
            </div>
            <div class="combo-actions">
                <button class="add-btn" onclick="event.stopPropagation(); addToCart('${id}')">
                    + Agregar
                </button>
                <div class="qty-controls" style="display: ${isSelected ? 'flex' : 'none'};">
                    <button class="qty-btn" onclick="event.stopPropagation(); removeFromCart('${id}')">-</button>
                    <span class="qty-number">${quantityInCart}</span>
                    <button class="qty-btn" onclick="event.stopPropagation(); addToCart('${id}')">+</button>
                </div>
            </div>
            <div class="selection-indicator" style="display: ${isSelected ? 'flex' : 'none'};">✓</div>
        `;
        productGrid.appendChild(card);
    });
}

/**
 * Actualiza la vista del carrito de compras.
 */
function updateCartView() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartCount = document.getElementById('cartCount');
    const subtotalEl = document.getElementById('subtotal');
    const taxesEl = document.getElementById('taxes');
    const totalEl = document.getElementById('total');
    const continueBtn = document.getElementById('continueBtn');

    cartItems.innerHTML = '';
    const cartEntries = Object.entries(cart);

    if (cartEntries.length === 0) {
        cartEmpty.style.display = 'block';
        cartCount.textContent = '(0)';
    } else {
        cartEmpty.style.display = 'none';
        cartCount.textContent = `(${cartEntries.reduce((acc, [, qty]) => acc + qty, 0)})`;
    }

    let subtotal = 0;
    cartEntries.forEach(([id, quantity]) => {
        const product = products[id];
        const totalPrice = product.price * quantity;
        subtotal += totalPrice;

        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <div class="cart-item-header">
                <div class="item-details">
                    <div class="item-name">${product.emoji} ${product.name}</div>
                </div>
                <div class="item-price">$${totalPrice.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="removeFromCart('${id}')">-</button>
                    <span class="qty-number">${quantity}</span>
                    <button class="qty-btn" onclick="addToCart('${id}')">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeItemCompletely('${id}')">
                    🗑
                </button>
            </div>
        `;
        cartItems.appendChild(item);
    });

    const taxes = subtotal * 0.08;
    const total = subtotal + taxes;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxesEl.textContent = `$${taxes.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    continueBtn.disabled = cartEntries.length === 0;
}

/**
 * Actualiza la hora en el header.
 */
function updateSystemStatus() {
    const timeEl = document.querySelector('.system-status span:last-child');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `⏱ ${hours}:${minutes}`;
}

// --- MANEJO DE EVENTOS ---

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 * @param {string} productId - El ID del producto a agregar.
 */
function addToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    showFeedbackMessage(`'${products[productId].name}' agregado.`);
    updateAllViews();
}

/**
 * Remueve una unidad de un producto del carrito.
 * @param {string} productId - El ID del producto a remover.
 */
function removeFromCart(productId) {
    if (cart[productId] && cart[productId] > 0) {
        cart[productId]--;
        if (cart[productId] === 0) {
            delete cart[productId];
        }
        showFeedbackMessage(`'${products[productId].name}' removido.`);
        updateAllViews();
    }
}

/**
 * Remueve un producto completamente del carrito.
 * @param {string} productId - El ID del producto a eliminar.
 */
function removeItemCompletely(productId) {
    if (cart[productId]) {
        delete cart[productId];
        showFeedbackMessage(`'${products[productId].name}' eliminado del carrito.`);
        updateAllViews();
    }
}

/**
 * Limpia todo el carrito de compras.
 */
function clearCart() {
    if (Object.keys(cart).length > 0) {
        cart = {};
        showFeedbackMessage("Carrito limpiado.", "success");
        updateAllViews();
    }
}

/**
 * Cambia la categoría de productos a mostrar.
 * @param {string} categoryId - El ID de la categoría.
 */
function selectCategory(categoryId) {
    currentCategory = categoryId;

    // Actualizar título
    document.getElementById('categoryTitle').textContent = categories[categoryId] || "Productos";

    // Actualizar botón activo
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoryId);
    });

    renderProducts();
}

/**
 * Cambia la vista de productos entre cuadrícula y lista.
 * @param {string} viewType - 'grid' o 'list'.
 */
function changeView(viewType) {
    currentView = viewType;
    const productGrid = document.getElementById('productGrid');
    const viewBtns = document.querySelectorAll('.view-btn');

    productGrid.className = viewType === 'grid' ? 'combo-grid' : 'combo-list'; // Necesitarás estilos para .combo-list
    
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(viewType === 'grid' ? '⊞' : '☰'));
    });
}

/**
 * Muestra u oculta el tooltip de ayuda.
 */
function toggleHelp() {
    const tooltip = document.getElementById('helpTooltip');
    const isVisible = tooltip.style.display === 'block';
    tooltip.style.display = isVisible ? 'none' : 'block';
}

/**
 * Muestra un mensaje de feedback (éxito o error).
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - 'success' o 'error'.
 */
function showFeedbackMessage(message, type = 'success') {
    const successMessageEl = document.getElementById('successMessage');
    const errorMessageEl = document.getElementById('errorMessage');
    
    const el = type === 'success' ? successMessageEl : errorMessageEl;
    
    el.textContent = message;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 2000);
}

// --- FUNCIONES DE NAVEGACIÓN (Simuladas) ---

function goBack() {
    showFeedbackMessage("Función 'Atrás' no implementada.", "error");
}

function editOrder() {
    showFeedbackMessage("Función 'Editar' no implementada.", "error");
}

function continueOrder() {
    if (Object.keys(cart).length > 0) {
        // Guardar el carrito en localStorage para que la siguiente página pueda leerlo
        localStorage.setItem('finalOrderCart', JSON.stringify(cart));
        
        // Redirigir a la página de confirmación
        window.location.href = 'pages/order-confirmation.html';
    } else {
        showFeedbackMessage("Tu carrito está vacío.", "error");
    }
}

// --- INICIALIZACIÓN ---

/**
 * Función que se ejecuta cuando el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Configuración inicial
    selectCategory('combos');
    updateCartView();
    updateSystemStatus();
    setInterval(updateSystemStatus, 30000); // Actualizar hora cada 30s

    // Cerrar tooltip si se hace clic fuera
    window.onclick = function(event) {
        const tooltip = document.getElementById('helpTooltip');
        if (tooltip.style.display === 'block' && !event.target.matches('.help-button')) {
            tooltip.style.display = 'none';
        }
    }
});

/**
 * Actualiza todas las vistas principales.
 */
function updateAllViews() {
    renderProducts();
    updateCartView();
}
