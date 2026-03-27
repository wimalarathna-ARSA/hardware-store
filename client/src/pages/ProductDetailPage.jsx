import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../useCart.js';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch(`http://localhost:5000/api/products/${id}`).then((response) =>
        response.ok ? response.json() : Promise.reject(),
      ),
      fetch('http://localhost:5000/api/products').then((response) =>
        response.ok ? response.json() : Promise.reject(),
      ),
    ])
      .then(([productData, allProducts]) => {
        if (!isMounted) {
          return;
        }
        setProduct(productData);
        setRelated(
          allProducts.filter(
            (item) =>
              (item._id || item.id) !== (productData._id || productData.id) &&
              (item.mainCategory === productData.mainCategory ||
               item.subCategory === productData.subCategory),
          ),
        );
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setError('Could not load product.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p className="status">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <p className="status error">{error || 'Product not found.'}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-main">
          <h1 style={{ fontSize: '1.5rem' }}>{product.name}</h1>
          <p className="category">{product.mainCategory} {product.subCategory && `> ${product.subCategory}`}</p>
          <p className="price">LKR {product.price.toFixed(2)}</p>
          <p className={`stock ${product.inStock ? 'in' : 'out'}`}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>
          <p>{product.description || 'No description available.'}</p>
          <button
            type="button"
            className="btn primary"
            onClick={() => addItem(product, 1)}
            disabled={!product.inStock}
          >
            Add to cart
          </button>
        </div>
        <div className="product-specs">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '0.5rem' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ width: '100%', height: '200px', backgroundColor: '#020617', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              No Image Available
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h2>Related products</h2>
        <div className="product-grid">
          {related.map((item) => (
            <Link
              key={item._id || item.id}
              to={`/products/${item._id || item.id}`}
              className="product-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem' }}
                />
              ) : (
                <div style={{ width: '100%', height: '120px', backgroundColor: '#1f2937', borderRadius: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '0.8rem' }}>
                  No Image
                </div>
              )}
              <h3>{item.name}</h3>
              <p className="price">LKR {item.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
