const express = require('express');
const cors = require('cors');
const db = require('./database.js'); // Importamos nuestra conexión a la BD

const app = express();
const PORT = 3000; // El puerto en el que nuestro servidor escuchará

// --- MIDDLEWARE ---
// CORS: Permite que nuestro frontend (que corre en un origen diferente) se comunique con este backend.
app.use(cors());
// express.json: Parsea automáticamente los cuerpos de las solicitudes entrantes con formato JSON.
app.use(express.json());

// --- RUTAS (ENDPOINTS) ---

// Ruta para obtener todos los productos (útil para el futuro)
app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ products: rows });
    });
});

// Ruta para crear un nuevo pedido
app.post('/api/orders', (req, res) => {
    const { cart } = req.body; // Esperamos un objeto con una propiedad "cart"

    if (!cart || Object.keys(cart).length === 0) {
        return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 1. Calcular el total y validar productos
    const productIds = Object.keys(cart);
    const sqlProducts = `SELECT * FROM products WHERE product_id IN (${productIds.map(() => '?').join(',')})`;
    
    db.all(sqlProducts, productIds, (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (products.length !== productIds.length) {
            return res.status(400).json({ error: 'Uno o más productos en el carrito son inválidos.' });
        }

        const totalAmount = products.reduce((total, product) => {
            const quantity = cart[product.product_id];
            return total + (product.price * quantity);
        }, 0);

        // 2. Insertar en la base de datos dentro de una transacción
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            const sqlOrder = `INSERT INTO orders (total_amount) VALUES (?)`;
            db.run(sqlOrder, [totalAmount], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }

                const orderId = this.lastID; // Obtenemos el ID del pedido recién creado
                const sqlItem = `INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)`;
                const stmt = db.prepare(sqlItem);

                let itemsProcessed = 0;
                products.forEach(product => {
                    const quantity = cart[product.product_id];
                    stmt.run(orderId, product.product_id, quantity, product.price, (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            // Evitar enviar múltiples respuestas
                            if (!res.headersSent) {
                                res.status(500).json({ error: err.message });
                            }
                            return;
                        }
                        
                        itemsProcessed++;
                        if (itemsProcessed === products.length) {
                            db.run('COMMIT');
                            res.status(201).json({ 
                                message: 'Pedido creado exitosamente!', 
                                orderId: orderId 
                            });
                        }
                    });
                });
                stmt.finalize();
            });
        });
    });
});


// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
