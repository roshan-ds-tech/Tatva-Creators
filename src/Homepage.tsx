import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isLoggedIn } from './utils/auth'
import { addToCart } from './utils/cart'
import CartIcon from './components/CartIcon'
import { getAllProducts } from './data/products'
import { getProducts as getProductsFromAPI } from './utils/api'

function Homepage() {
  const location = useLocation()
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  // Load favorites on mount
  useEffect(() => {
    if (loggedIn) {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setFavorites(savedFavorites.map((f: any) => f.id))
    }
  }, [loggedIn])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (mobileMenuOpen && !target.closest('header') && !target.closest('[class*="mobile"]')) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])
  
  // Helper function to normalize product price
  const normalizeProduct = (product: any) => {
    return {
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : (typeof product.price === 'number' ? product.price : 0),
      rating: typeof product.rating === 'string' ? parseFloat(product.rating) : (typeof product.rating === 'number' ? product.rating : 0),
    }
  }

  // Product data state - will refresh when localStorage changes
  const [allProducts, setAllProducts] = useState(() => {
    const products = getAllProducts()
    return products.map(normalizeProduct)
  })
  
  // Refresh products when localStorage changes (for admin-created products)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Try to fetch from API first
        try {
          const apiProducts = await getProductsFromAPI()
          if (apiProducts && apiProducts.length > 0) {
            // Normalize all products to ensure price and rating are numbers
            const normalizedProducts = apiProducts.map(normalizeProduct)
            setAllProducts(normalizedProducts as any[])
            return
          }
        } catch (error) {
          console.warn('Failed to fetch products from API, falling back to localStorage:', error)
        }
        // Fallback to localStorage
        const localProducts = getAllProducts()
        const normalizedLocalProducts = localProducts.map(normalizeProduct)
        setAllProducts(normalizedLocalProducts)
      } catch (error) {
        console.error('Error loading products:', error)
        const localProducts = getAllProducts()
        const normalizedLocalProducts = localProducts.map(normalizeProduct)
        setAllProducts(normalizedLocalProducts)
      }
    }
    
    // Load products on mount
    loadProducts()
    
    // Listen for storage changes (when admin adds/updates/deletes products)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminProducts' || e.key === null) {
        loadProducts()
      }
    }
    
    // Listen for custom event (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadProducts()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('adminProductsUpdated', handleCustomStorageChange)
    
    // Poll periodically to refresh from API
    const interval = setInterval(loadProducts, 5000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('adminProductsUpdated', handleCustomStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleAddToCart = (productId: number) => {
    if (!loggedIn) {
      navigate('/login')
      return
    }

    const product = allProducts.find(p => p.id === productId)
    if (product) {
      addToCart(product.id, product.name, product.price, product.image, product.alt)
      // Optional: You could show a toast notification here
    }
  }

  const handleToggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!loggedIn) {
      navigate('/login')
      return
    }

    // Toggle favorite in localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const product = allProducts.find(p => p.id === productId)
    
    if (product) {
      const existingIndex = savedFavorites.findIndex((f: any) => f.id === product.id)
      if (existingIndex >= 0) {
        savedFavorites.splice(existingIndex, 1)
        setFavorites(prev => prev.filter(id => id !== product.id))
      } else {
        savedFavorites.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          alt: product.alt
        })
        setFavorites(prev => [...prev, product.id])
      }
      localStorage.setItem('favorites', JSON.stringify(savedFavorites))
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
    const email = emailInput?.value
    
    if (email) {
      // In a real app, this would submit to a backend
      alert('Thank you for subscribing to our newsletter!')
      emailInput.value = ''
    }
  }

  // Get best seller products (top 4 products by rating, or all products if less than 4)
  const bestSellers = allProducts
    .map(p => normalizeProduct(p))
    .sort((a, b) => {
      const ratingA = typeof a.rating === 'number' ? a.rating : (parseFloat(a.rating) || 0)
      const ratingB = typeof b.rating === 'number' ? b.rating : (parseFloat(b.rating) || 0)
      return ratingB - ratingA
    })
    .slice(0, 4)

  return (
    <div className="relative flex w-full flex-col group/design-root overflow-x-hidden">
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
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-muted-charcoal dark:text-gray-200"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[64px] bg-background-light dark:bg-background-dark z-40 border-t border-primary/20">
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'text-primary dark:text-brushed-gold bg-primary/10 dark:bg-brushed-gold/20' 
                    : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === '/products' 
                    ? 'text-primary dark:text-brushed-gold bg-primary/10 dark:bg-brushed-gold/20' 
                    : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20'
                }`}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === '/about' 
                    ? 'text-primary dark:text-brushed-gold bg-primary/10 dark:bg-brushed-gold/20' 
                    : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20'
                }`}
              >
                About Us
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === '/blog' 
                    ? 'text-primary dark:text-brushed-gold bg-primary/10 dark:bg-brushed-gold/20' 
                    : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20'
                }`}
              >
                Blogs
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === '/contact' 
                    ? 'text-primary dark:text-brushed-gold bg-primary/10 dark:bg-brushed-gold/20' 
                    : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20'
                }`}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-primary/20 flex flex-col gap-3">
                {loggedIn ? (
                  <>
                    <Link 
                      to="/cart" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-base font-medium py-2 px-4 rounded-lg text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20"
                    >
                      <span className="material-symbols-outlined">shopping_cart</span>
                      Cart
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-base font-medium py-2 px-4 rounded-lg text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/20"
                    >
                      <span className="material-symbols-outlined">person</span>
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center text-base font-medium py-2 px-4 rounded-lg border-2 border-primary dark:border-brushed-gold text-primary dark:text-brushed-gold hover:bg-primary/10 dark:hover:bg-brushed-gold/20"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center text-base font-medium py-2 px-4 rounded-lg bg-primary dark:bg-brushed-gold text-white dark:text-background-dark hover:opacity-90"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <main className="layout-content-container flex flex-col w-full">
          {/* HeroSection */}
          <div 
            className="w-full flex flex-col gap-6 items-center justify-center text-center p-4" 
            style={{ 
              minHeight: 'calc(100vh - 64px)',
              backgroundImage: `linear-gradient(to top, rgba(245, 241, 233, 0.6), rgba(245, 241, 233, 0.4)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZ7A5WuD6TOD-NPvfdvZU1EDZK31N2QPbKVG1qKuR36znaiHYjX0lXCA_RjZ23V97O7iSgKYE_PKTakK8isLFAqTttQoSj3YraswvyDi0TQSWcFBw8xLw5Yb66FQUiU7hZ_FxUkzRU86CF4km-Hkj4cIG9rqyuRTiVJpvXco_172nay4vyd5rqTqLv305f2lxfi28WR243UQHQpQ_Jnul55ZVE-jIZQKFcJf8FbvZ_wmaBMINMDL1VhjnC7FDhHb-6Qr6G8G86tn4")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%'
            }}
          >
            <div className="flex flex-col gap-6 items-center">
              <div className="h-24 w-auto">
                <img src="/output_tatva.png" alt="TatvaCreators" className="h-full w-auto object-contain" />
              </div>
              <div className="flex flex-col gap-4 max-w-3xl">
                <h1 className="text-primary dark:text-primary text-4xl md:text-6xl font-serif font-bold leading-tight">Crafted With Purpose Designed To Inspire Your Space</h1>
                <h2 className="text-muted-charcoal dark:text-muted-charcoal text-base md:text-lg font-normal leading-normal">Discover our collection of handcrafted decor, made from sustainable materials with a commitment to timeless quality and minimalist design.</h2>
              </div>
            </div>
            <div className="flex-wrap gap-3 flex justify-center mt-4">
              <Link 
                to="/products"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
              >
                <span className="truncate">Shop All Collections</span>
              </Link>
              <Link 
                to="/products?category=Corporate Gifts"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-transparent text-primary dark:text-primary border-2 border-primary hover:bg-primary/10 dark:border-brushed-gold dark:text-brushed-gold dark:hover:bg-brushed-gold/10 text-base font-bold leading-normal tracking-[0.015em] transition-colors"
              >
                <span className="truncate">Explore Gifts</span>
              </Link>
            </div>
          </div>

          {/* Category Grid */}
          <div className="px-4 md:px-10 lg:px-20 py-12 md:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/products?category=Photo Frames" className="group relative overflow-hidden rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 aspect-square flex flex-col justify-end shadow-none hover:shadow-sm hover:border-brushed-gold border-2 border-transparent transition-all duration-300 cursor-pointer">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" data-alt="Close up of a wooden picture frame" src="/ganesha1.png" alt="Close up of a wooden picture frame" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <p className="text-white relative z-10 text-xl font-serif font-bold leading-tight p-4">Photo Frames</p>
              </Link>
              <Link to="/products?category=Idols" className="group relative overflow-hidden rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 aspect-square flex flex-col justify-end shadow-none hover:shadow-sm hover:border-brushed-gold border-2 border-transparent transition-all duration-300 cursor-pointer">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" data-alt="Minimalist wall decor in a modern living room" src="/idol.png" alt="Minimalist wall decor in a modern living room" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <p className="text-white relative z-10 text-xl font-serif font-bold leading-tight p-4">Idols</p>
              </Link>
              <Link to="/products?category=Home Interiors" className="group relative overflow-hidden rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 aspect-square flex flex-col justify-end shadow-none hover:shadow-sm hover:border-brushed-gold border-2 border-transparent transition-all duration-300 cursor-pointer">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" data-alt="Interior image" src="/interior2.png" alt="A beautifully wrapped gift box with a ribbon" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <p className="text-white relative z-10 text-xl font-serif font-bold leading-tight p-4">Interiors</p>
              </Link>
              <Link to="/products?category=Corporate Gifts" className="group relative overflow-hidden rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 aspect-square flex flex-col justify-end shadow-none hover:shadow-sm hover:border-brushed-gold border-2 border-transparent transition-all duration-300 cursor-pointer">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" data-alt="A framed art print hanging on a textured wall" src="/4th.png" alt="A framed art print hanging on a textured wall" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <p className="text-white relative z-10 text-xl font-serif font-bold leading-tight p-4">Corporate Gifts</p>
              </Link>
            </div>
          </div>

          {/* Featured Collection */}
          <div className="px-4 md:px-10 lg:px-20 py-12 md:py-20 bg-background-light dark:bg-background-dark">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 rounded-lg">
              <div className="flex flex-[1_1_0px] flex-col gap-4 text-center md:text-left items-center md:items-start">
                <p className="text-sm font-bold uppercase tracking-widest text-brushed-gold">Featured Collection</p>
                <p className="text-primary dark:text-gray-100 text-3xl md:text-4xl font-serif font-bold leading-tight">The Artisan's Touch</p>
                <p className="text-muted-charcoal dark:text-gray-300 text-base font-normal leading-relaxed max-w-md">
                  Explore our latest collaboration with master artisans, featuring unique pieces that blend traditional techniques with modern aesthetics. Each item tells a story of heritage and craft.
                </p>
                <Link 
                  to="/products"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-sm font-bold leading-normal mt-4 hover:opacity-90 transition-opacity"
                >
                  <span className="truncate">Discover the Collection</span>
                </Link>
              </div>
              <div 
                className="w-full h-80 md:h-auto md:aspect-square bg-center bg-no-repeat bg-cover rounded-lg flex-[1_1_0px]" 
                data-alt="A lifestyle shot of handcrafted pottery on a wooden table." 
                style={{
                  backgroundImage: `url("/hero_art.png")`
                }}
              ></div>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="px-4 md:px-10 lg:px-20 py-12 md:py-20">
            <h2 className="text-primary dark:text-gray-100 text-3xl font-serif font-bold text-center mb-10">Our Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => {
                const fullStars = Math.floor(product.rating)
                const hasHalfStar = product.rating % 1 !== 0
                return (
                  <div key={product.id} className="group">
                    <Link to={`/products/${product.id}`} className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square shadow-none group-hover:shadow-sm transition-shadow duration-300 block">
                      <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={product.alt} src={product.image} />
                      <button 
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        className={`absolute top-3 right-3 flex items-center justify-center h-9 w-9 rounded-full transition z-10 ${
                          favorites.includes(product.id)
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-white/80 dark:bg-black/50 text-muted-charcoal dark:text-white hover:bg-white dark:hover:bg-black'
                        }`}
                        title={favorites.includes(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <span 
                          className="material-symbols-outlined text-xl" 
                          style={favorites.includes(product.id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          favorite
                        </span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAddToCart(product.id)
                        }}
                        className="absolute bottom-0 left-0 right-0 h-12 bg-primary dark:bg-brushed-gold text-white dark:text-background-dark font-bold text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center z-10"
                      >
                        Add to Cart
                      </button>
                    </Link>
                    <div className="mt-3 text-center">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-base text-muted-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-brushed-gold transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-lg font-bold text-primary dark:text-brushed-gold mt-1">₹{typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}</p>
                      <div className="flex justify-center items-center mt-1 gap-0.5 text-brushed-gold">
                        {Array.from({ length: fullStars }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        {hasHalfStar && (
                          <span className="material-symbols-outlined !text-base">star_half</span>
                        )}
                        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
                          <span key={`empty-${i}`} className="material-symbols-outlined !text-base">star</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-sage-grey/40 dark:bg-sage-grey/20 px-4 md:px-10 lg:px-20 py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-primary dark:text-gray-100 text-3xl font-serif font-bold text-center mb-10">Why Choose TatvaCreators?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                <div className="text-center flex flex-col items-center max-w-xs">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold mb-4">
                    <span className="material-symbols-outlined text-3xl">eco</span>
                  </div>
                  <h3 className="font-bold text-lg text-muted-charcoal dark:text-gray-200">Sustainable Materials</h3>
                  <p className="text-sm text-muted-charcoal/80 dark:text-gray-400 mt-1 text-center">Responsibly sourced woods and recycled materials.</p>
                </div>
                <div className="text-center flex flex-col items-center max-w-xs">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold mb-4">
                    <span className="material-symbols-outlined text-3xl">construction</span>
                  </div>
                  <h3 className="font-bold text-lg text-muted-charcoal dark:text-gray-200">Handcrafted Quality</h3>
                  <p className="text-sm text-muted-charcoal/80 dark:text-gray-400 mt-1 text-center">Meticulously crafted by hand for a superior finish.</p>
                </div>
                <div className="text-center flex flex-col items-center max-w-xs">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold mb-4">
                    <span className="material-symbols-outlined text-3xl">brush</span>
                  </div>
                  <h3 className="font-bold text-lg text-muted-charcoal dark:text-gray-200">Artisan Made</h3>
                  <p className="text-sm text-muted-charcoal/80 dark:text-gray-400 mt-1 text-center">Supporting independent makers and their craft.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="px-4 md:px-10 lg:px-20 py-12 md:py-20">
            <h2 className="text-primary dark:text-gray-100 text-3xl font-serif font-bold text-center mb-10">Kind Words From Our Customers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-black/5 dark:border-white/10 flex flex-col items-center text-center">
                <div className="flex items-center gap-0.5 text-brushed-gold mb-4">
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-muted-charcoal dark:text-gray-300 italic">"The quality of the frame I ordered is exceptional. It has completely transformed my living room space. Truly a piece of art."</p>
                <p className="font-bold text-primary dark:text-brushed-gold mt-4">- Roshan DS</p>
              </div>
              <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-black/5 dark:border-white/10 flex flex-col items-center text-center">
                <div className="flex items-center gap-0.5 text-brushed-gold mb-4">
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-muted-charcoal dark:text-gray-300 italic">"I bought a set of ceramic vases as a gift and my friend was overjoyed. The packaging was beautiful and sustainable."</p>
                <p className="font-bold text-primary dark:text-brushed-gold mt-4">- Prasanna Kumar</p>
              </div>
              <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-black/5 dark:border-white/10 flex flex-col items-center text-center">
                <div className="flex items-center gap-0.5 text-brushed-gold mb-4">
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined !text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-muted-charcoal dark:text-gray-300 italic">"Fast shipping and incredible customer service. You can feel the care that goes into every single product. Highly recommend."</p>
                <p className="font-bold text-primary dark:text-brushed-gold mt-4">- Sharan Shekaran</p>
              </div>
            </div>
          </div>

          {/* Social Grid */}
          <div className="px-4 md:px-10 lg:px-20 py-12 md:py-20 text-center">
            <h2 className="text-primary dark:text-gray-100 text-3xl font-serif font-bold">Follow Our Journey</h2>
            <p className="text-muted-charcoal dark:text-gray-300 mt-2 mb-10">@TatvaCreators on Instagram</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-none hover:shadow-sm transition-shadow duration-300">
                <img className="w-full h-full object-cover" data-alt="Aesthetic shot of a decor item in a home" src="/hero_art.png" alt="Aesthetic shot of a decor item in a home" />
              </div>
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-none hover:shadow-sm transition-shadow duration-300">
                    <img className="w-full h-full object-cover" data-alt="Aesthetic shot of a decor item in a home" src="/ganesha_prem.png" alt="Aesthetic shot of a decor item in a home" />
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-none hover:shadow-sm transition-shadow duration-300">
                <img className="w-full h-full object-cover" data-alt="Aesthetic shot of a decor item in a home" src="/social1.png" alt="Aesthetic shot of a decor item in a home" />
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-none hover:shadow-sm transition-shadow duration-300">
                <img className="w-full h-full object-cover" data-alt="Aesthetic shot of a decor item in a home" src="/social2.png" alt="Aesthetic shot of a decor item in a home" />
              </div>
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
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Homepage;

