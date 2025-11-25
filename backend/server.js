// From node_modules (installed with npm)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import { getProducts, addProduct, deleteProduct, updatePrice } from './controllers/productController.js';
import { startScheduler, triggerManualUpdate } from './services/scheduler.js';

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

// Manual price update trigger
app.post('/api/products/update-all', async (req, res) => {
    try {
        await triggerManualUpdate();
        res.json({success: true, message: 'Price update completed'})
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

// Connect to MongoDB
await connectDB();

// Start price checker scheduler
startScheduler();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});