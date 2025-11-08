const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { db, run, get, all } = require('./db');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize DB
const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
db.serialize(() => {
  db.exec(seedSQL, (err) => {
    if (err) console.error('DB seed error:', err);
    else console.log('✅ Database seeded and ready.');
  });
});

app.get('/', (req, res) => {
  res.send('🚀 Mock E-Commerce API running!');
});

// ✅ Get Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await all('SELECT id, name, price, description, image FROM products ORDER BY id');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Get Cart
app.get('/api/cart', async (req, res) => {
  try {
    const items = await all(`
      SELECT cart.id, cart.productId, cart.qty, p.name, p.price, p.image
      FROM cart
      JOIN products p ON cart.productId = p.id
    `);
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    res.json({ items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ✅ Add to Cart
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty || qty <= 0)
      return res.status(400).json({ error: 'Invalid payload' });

    const existing = await get('SELECT id, qty FROM cart WHERE productId = ?', [productId]);
    if (existing) {
      await run('UPDATE cart SET qty = qty + ? WHERE id = ?', [qty, existing.id]);
      res.json({ message: 'Updated quantity' });
    } else {
      const result = await run('INSERT INTO cart (productId, qty) VALUES (?, ?)', [productId, qty]);
      res.json({ message: 'Added to cart', id: result.id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// ✅ Delete from Cart
app.delete('/api/cart/:id', async (req, res) => {
  try {
    await run('DELETE FROM cart WHERE id = ?', [req.params.id]);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// ✅ Update Quantity
app.patch('/api/cart/:id', async (req, res) => {
  try {
    const { qty } = req.body;
    if (!qty || qty < 1) return res.status(400).json({ error: 'Invalid qty' });
    await run('UPDATE cart SET qty = ? WHERE id = ?', [qty, req.params.id]);
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update qty' });
  }
});

// ✅ Checkout (mock)
app.post('/api/checkout', async (req, res) => {
  try {
    const items = await all(`
      SELECT cart.id, cart.productId, cart.qty, p.name, p.price
      FROM cart JOIN products p ON cart.productId = p.id
    `);
    if (!items.length) return res.status(400).json({ error: 'Cart is empty' });

    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const receipt = {
      id: 'RCPT-' + Date.now(),
      total,
      timestamp: new Date().toISOString(),
      items,
    };

    await run('DELETE FROM cart');
    res.json({ message: 'Checkout successful', receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
