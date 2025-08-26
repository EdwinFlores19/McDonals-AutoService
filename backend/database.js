const sqlite3 = require('sqlite3').verbose();

// --- CONEXIÓN A LA BASE DE DATOS ---
// Se conectará al archivo mcdonalds.db en la carpeta backend.
// Si el archivo no existe, se creará automáticamente.
const db = new sqlite3.Database('./mcdonalds.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Una vez conectados, nos aseguramos de que las tablas existan.
        createTables();
    }
});

// --- CREACIÓN DE TABLAS ---
function createTables() {
    // Usamos db.serialize para asegurar que las operaciones se ejecutan en orden.
    db.serialize(() => {
        console.log('Creating database tables...');

        // Tabla de Productos
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                product_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                category TEXT NOT NULL
            )
        `, (err) => {
            if (err) console.error("Error creating products table", err);
            else {
                console.log("Table 'products' is ready.");
                // Después de crear la tabla, la poblamos con datos.
                seedProducts();
            }
        });

        // Tabla de Pedidos
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_date TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                total_amount REAL NOT NULL
            )
        `, (err) => {
            if (err) console.error("Error creating orders table", err);
            else console.log("Table 'orders' is ready.");
        });

        // Tabla de Artículos del Pedido (Tabla intermedia)
        db.run(`
            CREATE TABLE IF NOT EXISTS order_items (
                order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price_per_unit REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (order_id),
                FOREIGN KEY (product_id) REFERENCES products (product_id)
            )
        `, (err) => {
            if (err) console.error("Error creating order_items table", err);
            else console.log("Table 'order_items' is ready.");
        });
    });
}

// --- POBLACIÓN INICIAL DE DATOS (SEEDING) ---
function seedProducts() {
    const products = [
        { id: "combo1", name: "Big Mac Combo", price: 8.99, category: "combos" },
        { id: "combo2", name: "Cuarto de Libra Combo", price: 9.49, category: "combos" },
        { id: "combo3", name: "McNuggets Combo", price: 7.99, category: "combos" },
        { id: "combo4", name: "McPollo Combo", price: 8.49, category: "combos" },
        { id: "hamburguesa1", name: "Big Mac", price: 5.49, category: "hamburguesas" },
        { id: "hamburguesa2", name: "Cuarto de Libra", price: 5.99, category: "hamburguesas" },
        { id: "hamburguesa3", name: "McPollo", price: 4.99, category: "hamburguesas" },
        { id: "pollo1", name: "McNuggets 6u.", price: 4.99, category: "pollo" },
        { id: "pollo2", name: "McNuggets 10u.", price: 6.99, category: "pollo" },
        { id: "acomp1", name: "Papas Fritas Medianas", price: 2.99, category: "acompañamientos" },
        { id: "acomp2", name: "Papas Fritas Grandes", price: 3.49, category: "acompañamientos" },
        { id: "acomp3", name: "Aros de Cebolla", price: 3.29, category: "acompañamientos" },
        { id: "postre1", name: "McFlurry Oreo", price: 3.99, category: "postres" },
        { id: "postre2", name: "Sundae Chocolate", price: 2.49, category: "postres" },
        { id: "bebida1", name: "Coca-Cola Mediana", price: 1.99, category: "bebidas" },
        { id: "bebida2", name: "Agua Mineral", price: 1.49, category: "bebidas" },
    ];

    const stmt = db.prepare("INSERT OR IGNORE INTO products (product_id, name, price, category) VALUES (?, ?, ?, ?)");

    console.log('Seeding products...');
    db.serialize(() => {
        products.forEach(product => {
            stmt.run(product.id, product.name, product.price, product.category, (err) => {
                if (err) console.error(`Error inserting product ${product.id}`, err);
            });
        });
        stmt.finalize((err) => {
            if (err) console.error('Error finalizing statement', err);
            else console.log('Product seeding complete.');
        });
    });
}

// Exportamos la base de datos para que otros archivos (como el servidor) puedan usarla.
module.exports = db;
