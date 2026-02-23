import { Link, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthProvider, { useAuth } from './AuthContext.jsx';
import CartProvider from './CartContext.jsx';
import { useCart } from './useCart.js';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminPromotionsPage from './pages/AdminPromotionsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';

function Layout({ children }) {
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo-text">
            Prime Hardware
          </Link>
          <nav className="nav">
            {isAdmin ? (
              <>
                <NavLink to="/admin">Dashboard</NavLink>
                <NavLink to="/admin/products">Products</NavLink>
                <NavLink to="/admin/orders">Orders</NavLink>
                <NavLink to="/admin/promotions">Promotions</NavLink>
                <button type="button" className="nav-link-button" onClick={logout}>
                  Logout ({user?.name})
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" end>
                  Home
                </NavLink>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                {isLoggedIn ? (
                  <>
                    <NavLink to="/orders">Orders</NavLink>
                <NavLink to="/cart">
                      Cart
                      {totalItems > 0 && (
                        <span className="cart-badge">{totalItems}</span>
                      )}
                    </NavLink>
                    <button type="button" className="nav-link-button" onClick={logout}>
                      Logout ({user?.name})
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Prime Hardware Store</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/promotions" element={<AdminPromotionsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
