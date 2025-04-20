const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = 'super-secret-key';
const cors = require('cors');

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'https://agro-order-2.vercel.app',
  credentials: true
}));
app.use(express.json());

// Products
app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});
app.post('/products', async (req, res) => {
  const { name, price } = req.body;
  const product = await prisma.product.create({ data: { name, price } });
  res.json(product);
});

// Orders
app.get('/orders', async (req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
});
app.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { id: Number(id) } });
      if (!order) return res.status(404).json({ message: 'Not found' });
      res.json(order);
    } catch {
      res.status(500).json({ message: 'Error retrieving order' });
    }
  });
  
app.post('/orders', async (req, res) => {
  const { buyerName, buyerContact, deliveryAddress, items } = req.body;
  const order = await prisma.order.create({
    data: { buyerName, buyerContact, deliveryAddress, items, status: 'Pending' },
  });
  res.json(order);
});

// Update order status
app.put('/orders/:id', async (req, res) => {
    const { status } = req.body;
    const updated = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    res.json(updated);
});
  
// Update product
app.put('/products/:id', async (req, res) => {
    const { name, price } = req.body;
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, price },
    });
    res.json(updated);
});
  
// Delete product
app.delete('/products/:id', async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
});

// Register
app.post('/auth/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, password: hashed, role } });
    res.json({ id: user.id });
});
  
// Login
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
  
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role });
});
  
// Auth middleware
function verify(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(403).json({ message: 'No token' });
    try {
      const data = jwt.verify(auth.split(' ')[1], SECRET);
      req.user = data;
      next();
    } catch {
      res.status(403).json({ message: 'Invalid token' });
    }
}
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
