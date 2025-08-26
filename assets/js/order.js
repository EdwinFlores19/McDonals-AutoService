document.addEventListener('DOMContentLoaded', () => {
    // Se necesita una lista de productos para obtener los detalles. 
    // En una aplicación real, esto vendría de una API o un archivo de configuración compartido.
    const products = {
        combo1: { name: "Big Mac Combo", price: 8.99, emoji: "🍔" },
        combo2: { name: "Cuarto de Libra Combo", price: 9.49, emoji: "🍔" },
        combo3: { name: "McNuggets Combo", price: 7.99, emoji: "🍗" },
        combo4: { name: "McPollo Combo", price: 8.49, emoji: "🍗" },
        hamburguesa1: { name: "Big Mac", price: 5.49, emoji: "🍔" },
        hamburguesa2: { name: "Cuarto de Libra", price: 5.99, emoji: "🍔" },
        hamburguesa3: { name: "McPollo", price: 4.99, emoji: "🍗" },
        pollo1: { name: "McNuggets 6u.", price: 4.99, emoji: "🍗" },
        pollo2: { name: "McNuggets 10u.", price: 6.99, emoji: "🍗" },
        acomp1: { name: "Papas Fritas Medianas", price: 2.99, emoji: "🍟" },
        acomp2: { name: "Papas Fritas Grandes", price: 3.49, emoji: "🍟" },
        acomp3: { name: "Aros de Cebolla", price: 3.29, emoji: "🧅" },
        postre1: { name: "McFlurry Oreo", price: 3.99, emoji: "🍨" },
        postre2: { name: "Sundae Chocolate", price: 2.49, emoji: "🍨" },
        bebida1: { name: "Coca-Cola Mediana", price: 1.99, emoji: "🥤" },
        bebida2: { name: "Agua Mineral", price: 1.49, emoji: "💧" },
    };

    const orderedItemsContainer = document.getElementById('orderedItems');
    const finalTotalEl = document.getElementById('finalTotal');
    const orderNumberEl = document.getElementById('orderNumber');

    // Recuperar el carrito desde localStorage
    const finalCart = JSON.parse(localStorage.getItem('finalOrderCart'));

    if (!finalCart || Object.keys(finalCart).length === 0) {
        orderedItemsContainer.innerHTML = '<p>No se encontró información del pedido.</p>';
        return;
    }

    let subtotal = 0;
    Object.entries(finalCart).forEach(([id, quantity]) => {
        const product = products[id];
        if (product) {
            const item = document.createElement('div');
            item.className = 'summary-item';
            item.innerHTML = `
                <span>${quantity}x ${product.emoji} ${product.name}</span>
                <span>$${(product.price * quantity).toFixed(2)}</span>
            `;
            orderedItemsContainer.appendChild(item);
            subtotal += product.price * quantity;
        }
    });

    const taxes = subtotal * 0.08;
    const total = subtotal + taxes;

    finalTotalEl.textContent = `$${total.toFixed(2)}`;

    // Generar un número de pedido aleatorio
    orderNumberEl.textContent = `#${Math.floor(Math.random() * 90000) + 10000}`;
});

/**
 * Limpia el almacenamiento y redirige a la página principal.
 */
function startNewOrder() {
    localStorage.removeItem('finalOrderCart');
    window.location.href = '../index.html';
}
