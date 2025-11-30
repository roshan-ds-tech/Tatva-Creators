import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isLoggedIn } from './utils/auth'
import CartIcon from './components/CartIcon'
import { getCartItems, updateCartQuantity, removeFromCart, type CartItem } from './utils/cart'

function CartPage() {
  const location = useLocation()
  const loggedIn = isLoggedIn()
  
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Load cart items from localStorage
    setCartItems(getCartItems())

    // Listen for cart updates from other parts of the app
    const handleCartUpdate = () => {
      setCartItems(getCartItems())
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = updateCartQuantity(id, newQuantity)
    setCartItems(updatedCart)
  }

  const removeItem = (id: number) => {
    const updatedCart = removeFromCart(id)
    setCartItems(updatedCart)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (!loggedIn) {
    return (
      <div className="relative flex w-full flex-col group/design-root overflow-x-hidden min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-6xl text-primary dark:text-brushed-gold mb-4">shopping_bag</span>
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-muted-charcoal dark:text-gray-400 mb-6">Please login to view your cart items.</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full h-12 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-base font-bold hover:opacity-90 transition-opacity"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex w-full flex-col group/design-root overflow-x-hidden min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-container flex w-full flex-col">
        {/* TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 sm:px-10 py-2 min-h-[64px] bg-background-light dark:bg-background-dark sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 text-primary dark:text-brushed-gold">
            <div className="h-12 w-auto">
              <img src="/output_tatva.png" alt="TatvaCreators" className="h-full w-auto object-contain" />
            </div>
          </Link>
          <div className="hidden lg:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link to="/" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
                location.pathname === '/' 
                  ? 'text-primary dark:text-brushed-gold' 
                  : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
              }`}>
                <span className="relative z-10">Home</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${
                  location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link to="/products" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
                location.pathname === '/products' 
                  ? 'text-primary dark:text-brushed-gold' 
                  : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
              }`}>
                <span className="relative z-10">Products</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${
                  location.pathname === '/products' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link to="/about" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
                location.pathname === '/about' 
                  ? 'text-primary dark:text-brushed-gold' 
                  : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
              }`}>
                <span className="relative z-10">About Us</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${
                  location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link to="/blog" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
                location.pathname === '/blog' 
                  ? 'text-primary dark:text-brushed-gold' 
                  : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
              }`}>
                <span className="relative z-10">Blogs</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${
                  location.pathname === '/blog' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link to="/contact" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
                location.pathname === '/contact' 
                  ? 'text-primary dark:text-brushed-gold' 
                  : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
              }`}>
                <span className="relative z-10">Contact</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${
                  location.pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            </div>
            <div className="flex gap-3">
              {loggedIn ? (
                <>
                  <CartIcon />
                  <Link to="/profile" className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 transition-colors">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-transparent text-primary dark:text-primary border-2 border-primary hover:bg-primary/10 dark:border-brushed-gold dark:text-brushed-gold dark:hover:bg-brushed-gold/10 text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    <span className="truncate">Login</span>
                  </Link>
                  <Link to="/signup" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                    <span className="truncate">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <button className="lg:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-muted-charcoal dark:text-gray-200">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </header>

        <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary dark:text-white mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <span className="material-symbols-outlined text-6xl text-primary dark:text-brushed-gold mb-4">shopping_bag</span>
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-muted-charcoal dark:text-gray-400 mb-6">Start adding items to your cart!</p>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full h-12 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-base font-bold hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-background-dark/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col sm:flex-row gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-primary dark:text-white mb-1">{item.name}</h3>
                          <p className="text-xl font-bold text-primary dark:text-brushed-gold">₹{item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-white/20 text-primary dark:text-brushed-gold hover:bg-primary/10 dark:hover:bg-brushed-gold/10 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="text-lg font-semibold text-primary dark:text-white w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-white/20 text-primary dark:text-brushed-gold hover:bg-primary/10 dark:hover:bg-brushed-gold/10 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <p className="text-lg font-bold text-primary dark:text-brushed-gold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-background-dark/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/10 sticky top-24">
                    <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-muted-charcoal dark:text-gray-400">
                        <span>Subtotal</span>
                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-charcoal dark:text-gray-400">
                        <span>Shipping</span>
                        <span className="font-semibold">
                          {shipping === 0 ? (
                            <span className="text-green-600 dark:text-green-400">Free</span>
                          ) : (
                            `₹${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      {subtotal < 100 && (
                        <p className="text-xs text-muted-charcoal/80 dark:text-gray-400">
                          Add ₹{(100 - subtotal).toFixed(2)} more for free shipping
                        </p>
                      )}
                      <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                        <div className="flex justify-between text-lg font-bold text-primary dark:text-white">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        alert('Checkout functionality would be implemented here')
                      }}
                      className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity mb-4"
                    >
                      Proceed to Checkout
                    </button>

                    <Link
                      to="/products"
                      className="block w-full text-center text-sm text-primary dark:text-brushed-gold hover:opacity-80 transition-opacity"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CartPage

