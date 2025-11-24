import { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductCard from './components/ProductCard';
import { getProducts, addProduct, deleteProduct, updatePrice } from './services/api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (url) => {
    await addProduct(url);
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const handleUpdatePrice = async (id) => {
    await updatePrice(id);
    fetchProducts();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛍️ Price Checker</h1>
        <p>Track product prices and never miss a deal!</p>
      </header>

      <main className="container">
        <ProductForm onAdd={handleAddProduct} />

        <div className="products-section">
          <h2>Tracked Products ({products.length})</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p className="no-products">No products tracked yet. Add one above!</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteProduct}
                  onUpdate={handleUpdatePrice}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;