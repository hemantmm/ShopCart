import {Routes, Route} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Home } from './pages/Home'
import { Store } from './pages/Store'
import { About } from './pages/About'
import { Testimonials } from './pages/Testimonials'
import {Navbar} from './components/Navbar'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'
import { Wishlist } from './pages/Wishlist'
import { ShoppingCart } from './components/ShoppingCart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <Navbar />
      <ShoppingCart />
      <Container className='mb-5' fluid="lg">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/store' element={<Store />} />
          <Route path='/about' element={<About />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
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
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WishlistProvider>
        <ShoppingCartProvider>
          <AppContent />
        </ShoppingCartProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App
