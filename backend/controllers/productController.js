import Product from "../models/Product.js";
import { scrapeProduct } from "../scrapers/scraper.js";

export async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({success: true, products});
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

export async function addProduct(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }

    // Check if already tracking
    const existingProduct = await Product.findOne({ url });
    if (existingProduct) {
      return res.status(400).json({ success: false, error: 'Product already being tracked' });
    }

    console.log(`🔍 Scraping product from: ${url}`);

    // Scrape product
    const result = await scrapeProduct(url);

    if (!result.success) {
      return res.status(400).json({ success: false, error: `Failed to scrape: ${result.error}` });
    }

    // Create product in database
    const newProduct = await Product.create({
      name: result.data.name,
      url,
      price: result.data.price,
      image: result.data.image,
      priceHistory: [{
        price: result.data.price,
        timestamp: new Date()
      }],
      lastChecked: new Date()
    });

    console.log(`✅ Product added: ${newProduct.name}`);

    res.status(201).json({ success: true, product: newProduct });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    console.log(`🗑️  Product deleted: ${id}`);

    res.json({ success: true, message: 'Product removed' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updatePrice(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    console.log(`🔄 Updating price for: ${product.name}`);

    // Re-scrape
    const result = await scrapeProduct(product.url);

    if (!result.success) {
      return res.status(400).json({ success: false, error: `Failed to update: ${result.error}` });
    }

    // Update product
    product.name = result.data.name;
    product.price = result.data.price;
    product.image = result.data.image;
    product.lastChecked = new Date();
    product.priceHistory.push({
      price: result.data.price,
      timestamp: new Date()
    });

    await product.save();

    console.log(`✅ Price updated: ${product.price}`);

    res.json({ success: true, product });

  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}