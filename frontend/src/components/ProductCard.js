import { useState } from 'react';

function ProductCard({ product, onDelete, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await onUpdate(product._id);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="product-card">
      {product.image && (
        <img src={product.image} alt={product.name} />
      )}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price}</p>
        <p className="last-checked">
          Last checked: {formatDate(product.lastChecked)}
        </p>
        <div className="price-history">
          <small>Price History: {product.priceHistory?.length || 0} records</small>
        </div>
      </div>
      <div className="product-actions">
        <button 
          onClick={handleUpdate} 
          disabled={updating}
          className="btn-update"
        >
          {updating ? 'Updating...' : 'Update Price'}
        </button>
        <button 
          onClick={() => onDelete(product._id)}
          className="btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProductCard;