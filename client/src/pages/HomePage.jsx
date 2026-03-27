import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [categories, setCategories] = useState({});
  const [currentPromotion, setCurrentPromotion] = useState(0);
  const nextPromotion = () => {
    if (promotions.length === 0) return;
    setCurrentPromotion((p) => (p + 1) % promotions.length);
  };
  const prevPromotion = () => {
    if (promotions.length === 0) return;
    setCurrentPromotion((p) => (p - 1 + promotions.length) % promotions.length);
  };
  const promotions = (() => {
    const stored = localStorage.getItem('promotions');
    if (!stored) {
      return [];
    }
    try {
      const all = JSON.parse(stored);
      return all.filter((p) => p.active);
    } catch {
      return [];
    }
  })();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        data.forEach((p) => {
          if (!grouped[p.mainCategory]) {
            grouped[p.mainCategory] = new Set();
          }
          grouped[p.mainCategory].add(p.subCategory);
        });
        const sorted = {};
        Object.keys(grouped).sort().forEach((key) => {
          sorted[key] = Array.from(grouped[key]).sort();
        });
        setCategories(sorted);
      });

  }, []);

  const hasPromotions = promotions.length > 0;
  const activePromotion = hasPromotions ? promotions[currentPromotion] : null;

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <h1>Prime Hardware Store</h1>
          <p>
            Everything you need for construction, plumbing, electrical, and
            more.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn primary">
              Shop products
            </Link>
            <Link to="/contact" className="btn ghost">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Categories</h2>
        <div className="category-grid">
          {Object.keys(categories).map((mainCat) => (
            <div key={mainCat} className="category-card dropdown">
              <Link to={`/products?mainCategory=${encodeURIComponent(mainCat)}`}>
                <span>{mainCat}</span>
              </Link>
              <div className="dropdown-menu">
                {categories[mainCat].map((subCat) => (
                  <Link
                    key={subCat}
                    to={`/products?mainCategory=${encodeURIComponent(mainCat)}&subCategory=${encodeURIComponent(subCat)}`}
                    className="dropdown-item"
                  >
                    {subCat}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Promotions</h2>
        {!hasPromotions ? (
          <div className="promo-empty">
            <p>No active promotions.</p>
          </div>
        ) : (
          <div className="promo-slider">
            <div className="promo">
              <div className="promo-icon">★</div>
              <div className="promo-content">
                <h3 className="promo-title">{activePromotion.title}</h3>
                {activePromotion.description && (
                  <p className="promo-description">{activePromotion.description}</p>
                )}
                {activePromotion.discount && (
                  <p className="promo-discount">{activePromotion.discount}</p>
                )}
              </div>
            </div>
            {promotions.length > 1 && (
              <div className="promo-nav">
                <div className="promo-dots">
                  {promotions.map((promo, index) => (
                    <button
                      key={promo.id}
                      type="button"
                      className={`promo-dot${index === currentPromotion ? ' active' : ''}`}
                      onClick={() => setCurrentPromotion(index)}
                      aria-label={`Show promotion ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="promo-arrows">
                  <button
                    type="button"
                    className="promo-arrow"
                    aria-label="Previous promotion"
                    onClick={prevPromotion}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="promo-arrow"
                    aria-label="Next promotion"
                    onClick={nextPromotion}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Contact</h2>
        <p>Phone: +91-98765-43210</p>
        <p>Email: store@example.com</p>
        <p>Address: Main Road, Your City</p>
      </section>
    </div>
  );
}

export default HomePage;
