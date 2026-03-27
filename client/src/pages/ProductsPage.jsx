import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../useCart.js';
import { useAuth } from '../AuthContext.jsx';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sort, setSort] = useState('');
  const query = useQuery();
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      alert('Please login first to add products to cart');
      navigate('/login');
      return;
    }
    addItem(product, 1);
  };

  useEffect(() => {
    const nextCategory = query.get('category') || '';
    if (!nextCategory) {
      return;
    }
    setTimeout(() => {
      setCategory(nextCategory);
    }, 0);
  }, [query]);

  useEffect(() => {
    let isMounted = true;
    if (!loading) {
      return undefined;
    }
    fetch('http://localhost:5000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setError('Could not load products.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loading]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(lower),
      );
    }

    if (category) {
      list = list.filter((p) => p.mainCategory === category);
    }

    if (priceFilter === 'low') {
      list = list.filter((p) => p.price < 500);
    } else if (priceFilter === 'mid') {
      list = list.filter((p) => p.price >= 500 && p.price <= 2000);
    } else if (priceFilter === 'high') {
      list = list.filter((p) => p.price > 2000);
    }

    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, searchTerm, category, priceFilter, sort]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.mainCategory))).filter(Boolean),
    [products],
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={priceFilter}
          onChange={(event) => setPriceFilter(event.target.value)}
        >
          <option value="">All prices</option>
          <option value="low">Below 500</option>
          <option value="mid">500 to 2000</option>
          <option value="high">Above 2000</option>
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="">Sort</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
        </select>
      </div>

      {loading && <p className="status">Loading products...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="product-grid">
        {filtered.map((product) => (
          <article
            key={product._id || product.id}
            className="product-card"
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.75rem' }}
              />
            ) : (
              <div style={{ width: '100%', height: '150px', backgroundColor: '#1f2937', borderRadius: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                No Image
              </div>
            )}
            <h2>{product.name}</h2>
            <p className="category">{product.mainCategory} {product.subCategory && `> ${product.subCategory}`}</p>
            <p className="price">LKR {product.price.toFixed(2)}</p>
            <p className={`stock ${product.inStock ? 'in' : 'out'}`}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </p>
            <div className="product-actions">
              <button
                type="button"
                className="btn small"
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
              >
                Add to cart
              </button>
              <Link
                to={`/products/${product._id || product.id}`}
                className="btn small ghost"
              >
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
