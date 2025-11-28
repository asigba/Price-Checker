function extractPrice(priceString) {
    if(!priceString) return null;

    const number = priceString.replace(/[,$€£]/g, '').match(/[\d.]+/);

    return number ? parseFloat(match[0]) : null;
}

function checkPriceDrop(product, oldPrice, newPrice) {
    
}