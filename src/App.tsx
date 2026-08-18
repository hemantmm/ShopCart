import {Routes, Route} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Home } from './pages/Home'
import { Store } from './pages/Store'
import { About } from './pages/About'
import {Navbar} from './components/Navbar'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import { Contact } from './pages/Contact'
import './App.css'

function App() {
  return(
    <ShoppingCartProvider>
      <Navbar />
      <Container className='mb-5' fluid="lg">
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/store' element={<Store />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
    </Routes>
  </Container>
  </ShoppingCartProvider>
   )
}

export default App
