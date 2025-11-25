import cron from 'node-cron';
import Product from '../models/Product.js';
import {scrapeProduct } from '../scrapers/scraper.js';

async function updateAllPrices() {
    console.log('Starting scheduled price update');

    try {
        const products = await Product.find();

        if (products.length === 0) {
            console.log('No products to update');
            return;
        }

        let updated = 0;
        let failed = 0;

        for (const product of products) {
            try {
                console.log(`Updating: ${product.name}`);

                const result = await scrapeProduct(product.url);

                if (result.success) {
                    const oldPrice = product.price;
                    const newPrice = result.data.price;

                    product.name = result.data.name;
                    product.price = newPrice;
                    product.image = result.data.image;
                    product.lastChecked = new Date();

                    product.priceHistory.push({
                        price: newPrice,
                        timestamp: new Date()
                    });

                    await product.save();

                    updated++;

                    if(oldPrice !== newPrice) {
                        console.log(`Price changed: ${oldPrice} -> ${newPrice}`);
                    } else {
                        console.log(`Price unchanged: ${newPrice}`);
                    }
                } else {
                    console.log(`Price unchanged: ${newPrice}`);
                }

                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch(error) {
                console.error(`Error updating ${product.name}`, error.message);
                failed++;
            }
        }
        console.log(`Price update complete: ${updated} updated, ${failed} failed`);
    } catch (error) {
        console.log('Error in scheduled price update:', error);
    }
}

export function startScheduler() {
    cron.schedule('0 9 * * 1', () => {
        console.log('Scheduled price check triggered');
        updateAllPrices();
    });

    console.log('Scheduler started - Price checks will run every Monday at 9 AM');
}

export async function triggerManualUpdate() {
    await updateAllPrices();
}
