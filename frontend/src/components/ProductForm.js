import { useState } from 'react';

function ProductForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onAdd(url);
      setUrl('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>Track a New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Paste product URL (eBay, etc.)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ProductForm;