import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeroCarousel } from './components/HeroCarousel';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import NewsletterSection from './components/NewsletterSection';
import NavbarOffer from './UI/NavbarOffer';
import Category from './components/CategorySection';
import KameezSection from './components/BestKameez';
import LatestProducts from './components/LatestProducts';
import FeaturedProducts from './components/FeaturedProducts';
import ProductDetails from './components/ProductDetails';
import ShopPage from './components/ShopPage';
import TrackOrder from './components/TrackOrder';
import CheckoutPage from './components/CheckoutPage';
import CartDrawer from './components/CartDrawer';
import AccountPage from './components/AccountPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Category />
      <KameezSection />
      <LatestProducts />
      <FeaturedProducts />
    </>
  );
}

  const App = () => {
    return (
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#f2f4f8]">
            <NavbarOffer />
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/deals" element={<ShopPage isDealsOnly={true} />} />
                <Route
                  path="/borka"
                  element={<ShopPage initialCategory="Borka" />}
                />
                <Route
                  path="/hijab"
                  element={<ShopPage initialCategory="Hijab" />}
                />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/account" element={<AccountPage />} />
              </Routes>
            </main>
            <NewsletterSection />
            <CartDrawer />
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </CartProvider>
      </AuthProvider>
    );
  };

export default App;
