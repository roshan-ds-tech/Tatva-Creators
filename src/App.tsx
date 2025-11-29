import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './Homepage'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import Login from './Login'
import Signup from './Signup'
import AboutUs from './AboutUs'
import ContactPage from './ContactPage'
import BlogPage from './BlogPage'
import FAQsPage from './FAQsPage'
import CartPage from './CartPage'
import ProfileDashboard from './ProfileDashboard'
import OrderHistory from './OrderHistory'
import SavedItems from './SavedItems'
import AccountSettings from './AccountSettings'
import AdminDashboard from './AdminDashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/profile/orders" element={<OrderHistory />} />
        <Route path="/profile/saved" element={<SavedItems />} />
        <Route path="/profile/settings" element={<AccountSettings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
