import {Routes, Route} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Home } from './pages/Home'
import { Store } from './pages/Store'
import { About } from './pages/About'
import { Testimonials } from './pages/Testimonials'
import {Navbar} from './components/Navbar'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'
import { ShoppingCart } from './components/ShoppingCart'
import './App.css'

function App() {
  return(
    <ShoppingCartProvider>
      <Navbar />
      <ShoppingCart />
      <Container className='mb-5' fluid="lg">
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/store' element={<Store />} />
      <Route path='/about' element={<About />} />
      <Route path='/testimonials' element={<Testimonials />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </Container>
  </ShoppingCartProvider>
   )
}

export default App
