import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { isLoggedIn } from './utils/auth'
import { addToCart } from './utils/cart'
import CartIcon from './components/CartIcon'

interface SavedItem {
  id: number
  name: string
  price: number
  image: string
  alt: string
  category: string
  rating: number
  inStock: boolean
}

function SavedItems() {
  const location = useLocation()
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
    const email = emailInput?.value
    
    if (email) {
      alert('Thank you for subscribing to our newsletter!')
      emailInput.value = ''
    }
  }

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: 1,
      name: 'Handcrafted Oak Frame',
      price: 85.00,
      image: '/best_seller1.png',
      alt: 'Minimalist Oak Wood Frame',
      category: 'Photo Frames',
      rating: 4,
      inStock: true
    },
    {
      id: 3,
      name: 'Artisan Ceramic Vase',
      price: 65.00,
      image: '/best_seller2.png',
      alt: 'Ceramic Vase in Sage Green',
      category: 'Idols',
      rating: 4.5,
      inStock: true
    },
    {
      id: 4,
      name: 'Golden Abstract Print',
      price: 220.00,
      image: '/best_seller3.png',
      alt: 'Abstract Line Art Print',
      category: 'Art',
      rating: 5,
      inStock: false
    },
    {
      id: 6,
      name: 'Brass Floating Frame',
      price: 130.00,
      image: '/best_seller4.png',
      alt: 'Handwoven Wall Hanging Decor',
      category: 'Decor',
      rating: 4.5,
      inStock: true
    }
  ])

  if (!loggedIn) {
    navigate('/login')
    return null
  }

  const handleRemoveItem = (id: number) => {
    setSavedItems(savedItems.filter(item => item.id !== id))
  }

  const handleAddToCart = (item: SavedItem) => {
    if (!item.inStock) {
      return
    }
    
    addToCart(item.id, item.name, item.price, item.image, item.alt)
  }

  const handleMoveAllToCart = () => {
    const inStockItems = savedItems.filter(item => item.inStock)
    if (inStockItems.length === 0) {
      return
    }
    
    inStockItems.forEach(item => {
      addToCart(item.id, item.name, item.price, item.image, item.alt)
    })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
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
              location.pathname === '/' ? 'text-primary dark:text-brushed-gold' : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
            }`}>
              <span className="relative z-10">Home</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/products" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
              location.pathname === '/products' ? 'text-primary dark:text-brushed-gold' : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
            }`}>
              <span className="relative z-10">Products</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${location.pathname === '/products' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
              location.pathname === '/about' ? 'text-primary dark:text-brushed-gold' : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
            }`}>
              <span className="relative z-10">About Us</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/blog" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
              location.pathname === '/blog' ? 'text-primary dark:text-brushed-gold' : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
            }`}>
              <span className="relative z-10">Blogs</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${location.pathname === '/blog' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/contact" className={`relative text-sm font-medium leading-normal transition-all duration-300 hover:scale-105 py-2 px-1 group ${
              location.pathname === '/contact' ? 'text-primary dark:text-brushed-gold' : 'text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold'
            }`}>
              <span className="relative z-10">Contact</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-brushed-gold transition-all duration-300 ${location.pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
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

      {/* Main Content */}
      <main className="container mx-auto flex flex-1 flex-col px-4 py-10 md:py-16">
        <div className="mb-10 w-full md:mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-medium tracking-tight text-muted-charcoal dark:text-gray-300 md:text-5xl">Saved Items</h1>
            <p className="mt-2 text-sm text-muted-charcoal/70 dark:text-gray-400">Your favorite products saved for later</p>
          </div>
          {savedItems.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              Add All to Cart
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-12 md:flex-row md:gap-16">
          {/* SideNavBar */}
          <aside className="w-full md:w-64">
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">person</span>
                <p className="text-sm font-medium">My Profile</p>
              </Link>
              <Link to="/profile/orders" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                <p className="text-sm font-medium">Order History</p>
              </Link>
              <Link to="/profile/saved" className="flex items-center gap-3 rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 px-3 py-2.5 text-primary dark:text-brushed-gold">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <p className="text-sm font-bold">Saved Items</p>
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">tune</span>
                <p className="text-sm font-medium">Account Settings</p>
              </Link>
            </div>
          </aside>

          {/* Saved Items Grid */}
          <div className="flex-1">
            {savedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">favorite</span>
                <h3 className="text-xl font-semibold text-muted-charcoal dark:text-gray-300 mb-2">No saved items yet</h3>
                <p className="text-sm text-muted-charcoal/70 dark:text-gray-400 mb-6">Start adding items to your wishlist</p>
                <Link to="/products" className="px-6 py-2 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity">
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                {savedItems.length > 0 && (
                  <button
                    onClick={handleMoveAllToCart}
                    className="md:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-2 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    Add All to Cart
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedItems.map((item) => (
                    <div key={item.id} className="group relative rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {/* Product Image */}
                      <Link to={`/products/${item.id}`} className="relative block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={item.image} 
                          alt={item.alt} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-full text-xs font-semibold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleRemoveItem(item.id)
                          }}
                          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group/item"
                        >
                          <span className="material-symbols-outlined text-xl text-gray-700 dark:text-gray-300 group-hover/item:text-red-600 dark:group-hover/item:text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </button>
                      </Link>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="text-xs text-primary dark:text-brushed-gold font-medium">{item.category}</span>
                        </div>
                        <Link to={`/products/${item.id}`}>
                          <h3 className="font-semibold text-muted-charcoal dark:text-gray-300 mb-2 line-clamp-2 hover:text-primary dark:hover:text-brushed-gold transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-base"
                              style={{
                                fontVariationSettings: i < Math.floor(item.rating) ? "'FILL' 1" : "'FILL' 0",
                                color: '#c9a878'
                              }}
                            >
                              star
                            </span>
                          ))}
                          <span className="text-xs text-muted-charcoal/70 dark:text-gray-400 ml-1">({item.rating})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary dark:text-brushed-gold">${item.price.toFixed(2)}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              item.inStock
                                ? 'bg-primary dark:bg-brushed-gold text-white hover:opacity-90'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-light dark:bg-background-dark border-t border-primary/20 pt-16 pb-8 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-primary dark:text-gray-100">TatvaCreators</h3>
            <p className="text-sm text-muted-charcoal dark:text-gray-400 mt-2">Mindfully crafted decor for inspired living.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary dark:text-gray-200">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/products?category=Photo Frames" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">Photo Frames</Link></li>
              <li><Link to="/products?category=Idols" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">Idols</Link></li>
              <li><Link to="/products?category=Home Interiors" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">Interiors</Link></li>
              <li><Link to="/products?category=Corporate Gifts" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">Corporate Gifts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary dark:text-gray-200">About</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">Our Story</Link></li>
              <li><Link to="/contact" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">Contact Us</Link></li>
              <li><Link to="/faqs" className="text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary dark:text-gray-200">Join Our Newsletter</h4>
            <p className="text-sm text-muted-charcoal dark:text-gray-400 mt-4">Receive updates on new arrivals and special offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex">
              <input className="w-full rounded-l-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold text-sm" placeholder="Your email" type="email" required />
              <button className="bg-primary dark:bg-brushed-gold text-white dark:text-background-dark px-4 rounded-r-md font-bold text-sm hover:opacity-90 transition-opacity" type="submit">Sign Up</button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-primary/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-charcoal dark:text-gray-500">
          <p>© 2024 TatvaCreators. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary dark:hover:text-brushed-gold">Terms of Service</a>
            <a href="#" className="hover:text-primary dark:hover:text-brushed-gold">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SavedItems

