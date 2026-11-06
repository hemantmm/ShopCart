import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ProductQuickViewProvider } from './context/ProductQuickViewContext'
import { OrderHistoryProvider } from './context/OrderHistoryContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { ShoppingCart } from './components/ShoppingCart'
import { ProductQuickViewModal } from './components/ProductQuickViewModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Lazy-loaded page components for optimal bundle splitting
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Store = lazy(() => import('./pages/Store').then((m) => ({ default: m.Store })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Testimonials = lazy(() => import('./pages/Testimonials').then((m) => ({ default: m.Testimonials })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Wishlist = lazy(() => import('./pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const Orders = lazy(() => import('./pages/Orders').then((m) => ({ default: m.Orders })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      style={{ minHeight: '45vh' }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: '2.5rem', height: '2.5rem' }}
      >
        <span className="visually-hidden">Loading page...</span>
      </div>
      <p className="text-muted small fw-semibold mb-0">Loading content...</p>
    </div>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <ShoppingCart />
      <ProductQuickViewModal />
      <main className="flex-grow-1">
        <Container className="mb-5" fluid="lg">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/store' element={<Store />} />
              <Route path='/about' element={<About />} />
              <Route path='/testimonials' element={<Testimonials />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
      <Footer />
      <ScrollToTop />
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WishlistProvider>
        <OrderHistoryProvider>
          <ShoppingCartProvider>
            <ProductQuickViewProvider>
              <AppContent />
            </ProductQuickViewProvider>
          </ShoppingCartProvider>
        </OrderHistoryProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App
