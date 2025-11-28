function extractPrice(priceString) {
    if(!priceString) return null;

    const match = priceString.replace(/[,$€£]/g, '').match(/[\d.]+/);

    return match ? parseFloat(match[0]) : null;
}

function checkPriceDrop(product, oldPrice, newPrice) {
    // Check if alerts are enabled
    if (!product.alertEnabled) return null;

    // Extract numeric prices
    const oldPriceNum = extractPrice(oldPrice);
    const newPriceNum = extractPrice(newPrice);

    // Validate both prices exist
    if (!oldPriceNum || !newPriceNum) return null;

    // Check if price dropped (new price is LOWER)
    if (newPriceNum < oldPriceNum) {
        const difference = oldPriceNum - newPriceNum;
        const percentDrop = ((difference / oldPriceNum) * 100).toFixed(2);

        const alert = {
            message: `Price dropped by $${difference.toFixed(2)} (${percentDrop}%)`,
            oldPrice,
            newPrice,
            timestamp: new Date()
        };

        console.log(`🔔 PRICE DROP ALERT: ${product.name}`);
        console.log(`   Old: ${oldPrice} → New: ${newPrice}`);
        console.log(`   Drop: $${difference.toFixed(2)} (${percentDrop}%)`);

        return alert;
    }

    // Check if price reached target
    if (product.targetPrice && newPriceNum <= product.targetPrice) {
        const alert = {
            message: `Price reached target! Now ${newPrice} (Target: $${product.targetPrice})`,
            oldPrice,
            newPrice,
            timestamp: new Date()
        };

        console.log(`🎯 TARGET PRICE REACHED: ${product.name}`);
        console.log(`   Current: ${newPrice} | Target: $${product.targetPrice}`);

        return alert;
    }

    // No alert needed
    return null;
}
function sendNotificatin(product, alert) {
    
}
export { extractPrice, checkPriceDrop };