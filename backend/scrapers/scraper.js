import puppeteer from "puppeteer";

async function scrapeAmazon(page) {
    return await page.evaluate();
}

async function scrapeEbay(page) {
    return await page.evaluate(() => {
        // Try to find the product name
        const name = document.querySelector('h1.x-item-title__mainTitle')?.innerText.trim() || 
                    document.querySelector('.it-ttl')?.innerText.trim() || 
                    document.querySelector('h1')?.innerText.trim() || 
                    'Unknown Product';
        
        // Try to find the price
        const price = document.querySelector('.x-price-primary')?.innerText.trim() || 
                    document.querySelector('#prcIsum')?.innerText.trim() || 
                    'Price not found';
        
        // Try to find the image
        const image = document.querySelector('.ux-image-carousel-item.active img')?.src || 
                    document.querySelector('#icImg')?.src || 
                    '';

        return { name, price, image };
    });
}

async function scrapeGeneric(page) {
    return await page.evaluate(() => {
        // Try common selectors for product name
        const name = document.querySelector('h1')?.innerText.trim() || 
                    document.querySelector('[itemprop="name"]')?.innerText.trim() || 
                    document.querySelector('.product-title')?.innerText.trim() ||
                    document.querySelector('[class*="product"][class*="name"]')?.innerText.trim() ||
                    document.title || 
                    'Unknown Product';
        
        // Try common selectors for price
        const price = document.querySelector('[itemprop="price"]')?.innerText.trim() || 
                    document.querySelector('.price')?.innerText.trim() || 
                    document.querySelector('[class*="price"]')?.innerText.trim() ||
                    document.querySelector('[id*="price"]')?.innerText.trim() ||
                    'Price not found';
        
        // Try common selectors for image
        const image = document.querySelector('[itemprop="image"]')?.src || 
                    document.querySelector('.product-image img')?.src || 
                    document.querySelector('img[alt*="product"]')?.src ||
                    document.querySelector('[class*="product"][class*="image"] img')?.src ||
                    '';

        return { name, price, image };
    });
}

export async function scrapeProduct(url) {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args:['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'   
        );

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const hostname = new URL(url).hostname;

        let productData;

        if (hostname.includes('amazon')) {
            productData = await scrapeAmazon(page);
        } else if (hostname.includes('ebay')) {
            productData = await scrapeEbay(page);
        } else {
            productData = await scrapeGeneric(page);
        }

        return {
            success: true,
            data: {
                ...productData,
                url,
                lastChecked: new Date().toISOString()
            }
        };

    }catch(error) {
        if (browser) await browser.close();

        return {
            success: false,
            error: error.message
        }

    }finally {
        await browser.close();
    }
}