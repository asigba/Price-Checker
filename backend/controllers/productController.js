import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/products.json');

async function readProducts() {
    try {
        const data = await fs.readFile(DATA_FILE,'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeProducts(products) {
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null,2))
}

export async function getProducts(req, res) {
    try {
        const products = await readProducts();
        res.json({success: true, products});
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

export async function addProduct(req, res) {
    
}