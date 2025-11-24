// From node_modules (installed with npm)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import { getProducts, addProduct, deleteProduct, updatePrice } from './controllers/productController.js';

// From my project files (relative path)
// import {getProducts, addProduct} from './controllers/productController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({message: 'Price Checker API is running'});
});


// Product routes
app.get('/api/products', getProducts);
app.post('/api/products', addProduct);
app.delete('/api/products/:id', deleteProduct);
app.put('/api/products/:id/price', updatePrice);

await connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});