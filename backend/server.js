// From node_modules (installed with npm)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});