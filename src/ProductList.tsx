import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useState, useMemo, useEffect, useRef } from 'react'
import { isLoggedIn } from './utils/auth'
import { addToCart } from './utils/cart'
import CartIcon from './components/CartIcon'
import { getAllProducts, type ProductDetailInfo as Product } from './data/products'
import { getProducts as getProductsFromAPI } from './utils/api'

function ProductList() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const loggedIn = isLoggedIn()
  const isAdminAuthed =
    typeof window !== 'undefined' && window.localStorage.getItem('adminAuthed') === 'true'
  
  // Product data state - will refresh when localStorage changes
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const isInitialLoadRef = useRef(true)
  
  // Refresh products when localStorage changes (for admin-created products)
  useEffect(() => {
    const loadProducts = async (showLoading = false) => {
      // Only show loading state on initial load or when explicitly requested
      if (showLoading || isInitialLoadRef.current) {
        setIsLoadingProducts(true)
      }
      
      try {
        // Try to fetch from API first
        try {
          const apiProducts = await getProductsFromAPI()
          console.log('Fetched products from API:', apiProducts)
          
          if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
            // Map API products to ProductDetailInfo format
            const formattedProducts: Product[] = apiProducts.map((p: any) => {
              // Ensure price is a number
              const priceValue = typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0)
              
              return {
                id: p.id,
                name: p.name || 'Unnamed Product',
                category: (p.category || 'Photo Frames') as Product['category'],
                price: priceValue,
                image: p.image || '',
                alt: p.alt || p.name || 'Product image',
                description: p.description || p.mainDescription || '',
                mainDescription: p.mainDescription || p.description || '',
                subDescriptions: p.subDescriptions || p.sub_descriptions || [],
                dimensions: p.dimensions || '',
                material: p.material || '',
                weight: p.weight || '',
                inStock: p.inStock ?? true,
                thumbnails: p.thumbnails || [],
                reviews: p.reviews || [],
                rating: p.rating || 0,
              }
            })
            console.log('Formatted products:', formattedProducts)
            setAllProducts(formattedProducts)
            if (showLoading || isInitialLoadRef.current) {
              setIsLoadingProducts(false)
            }
            isInitialLoadRef.current = false
            return
          } else {
            console.log('API returned no products or empty array')
          }
        } catch (error) {
          console.warn('Failed to fetch products from API, falling back to localStorage:', error)
        }
        // Fallback to localStorage
        const localProducts = getAllProducts()
        console.log('Using localStorage products:', localProducts)
        setAllProducts(localProducts)
        if (showLoading || isInitialLoadRef.current) {
          setIsLoadingProducts(false)
        }
        isInitialLoadRef.current = false
      } catch (error) {
        console.error('Error loading products:', error)
        const localProducts = getAllProducts()
        setAllProducts(localProducts)
        if (showLoading || isInitialLoadRef.current) {
          setIsLoadingProducts(false)
        }
        isInitialLoadRef.current = false
      }
    }
    
    // Load products on mount (with loading state)
    loadProducts(true)
    
    // Listen for storage changes (when admin adds/updates/deletes products)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminProducts' || e.key === null) {
        loadProducts(false) // Don't show loading spinner on background updates
      }
    }
    
    // Listen for custom event (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadProducts(false) // Don't show loading spinner on background updates
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('adminProductsUpdated', handleCustomStorageChange)
    
    // Remove aggressive polling - rely on event system instead
    // Only poll every 60 seconds for background sync (without showing loading)
    const interval = setInterval(() => loadProducts(false), 60000) // Check every 60 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('adminProductsUpdated', handleCustomStorageChange)
      clearInterval(interval)
    }
  }, [])
  
  // Calculate price range from products (useMemo to recalculate when products change)
  const { minPriceValue, maxPriceValue } = useMemo(() => {
    if (allProducts.length === 0) {
      return { minPriceValue: 0, maxPriceValue: 100000 }
    }
    const prices = allProducts.map(p => typeof p.price === 'number' ? p.price : 0)
    return {
      minPriceValue: Math.floor(Math.min(...prices)),
      maxPriceValue: Math.ceil(Math.max(...prices))
    }
  }, [allProducts])

  // Get category from URL parameter
  const categoryFromUrl = searchParams.get('category')
  
  // Filter states - initialize with category from URL if present, otherwise show all collections
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (categoryFromUrl) {
      // Validate that the category exists in our product categories
      const validCategories = ['Photo Frames', 'Idols', 'Home Interiors', 'Corporate Gifts']
      if (validCategories.includes(categoryFromUrl)) {
        return [categoryFromUrl]
      }
    }
    // Default to showing all collections (empty array = no filter)
    return []
  })
  
  // Update selected categories when URL parameter changes
  useEffect(() => {
    if (categoryFromUrl) {
      const validCategories = ['Photo Frames', 'Idols', 'Home Interiors', 'Corporate Gifts']
      if (validCategories.includes(categoryFromUrl)) {
        setSelectedCategories([categoryFromUrl])
      }
    } else {
      // If no category in URL, show all collections
      setSelectedCategories([])
    }
  }, [categoryFromUrl])
  
  // Initialize price range, and update it when products load
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  
  // Update price range when products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      setPriceRange([minPriceValue, maxPriceValue])
    }
  }, [allProducts, minPriceValue, maxPriceValue])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('Popularity')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const productsPerPage = 6

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    if (category === 'All Collections') {
      // When "All Collections" is selected, clear all category filters
      setSelectedCategories([])
    } else {
      // When a specific category is selected, remove "All Collections" logic
      setSelectedCategories(prev => {
        // If clicking a category, add/remove it from selection
        const newCategories = prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
        return newCategories
      })
    }
  }
  
  // Check if "All Collections" should be checked (when no categories are selected)
  const isAllCollectionsSelected = selectedCategories.length === 0

  // Handle color filter
  const handleColorChange = (color: string) => {
    setSelectedColor(color === selectedColor ? null : color)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]) // Show all collections
    setPriceRange([minPriceValue, maxPriceValue])
    setSelectedColor(null)
    setCurrentPage(1)
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // Safety check: ensure allProducts is an array
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return []
    }
    
    let filtered = allProducts.filter(product => {
      // Ensure product has required fields
      if (!product || typeof product.price !== 'number') {
        console.warn('Invalid product found:', product)
        return false
      }
      
      // Category filter - if no categories selected (All Collections), show all products
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false
      }
      // Price range filter
      const productPrice = typeof product.price === 'number' ? product.price : 0
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false
      }
      return true
    })

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price - b.price
        case 'Price: High to Low':
          return b.price - a.price
        case 'Newest':
          return b.id - a.id
        case 'Popularity':
        default:
          return b.rating - a.rating
      }
    })

    return sorted
  }, [allProducts, selectedCategories, priceRange, selectedColor, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + productsPerPage)

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    if (!loggedIn && !isAdminAuthed) {
      return
    }

      addToCart(product.id, product.name, product.price, product.image, product.alt)
  }

  // Handle newsletter submit
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

  // Render stars
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      )
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
      )
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined !text-lg">star</span>
      )
    }
    return stars
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex w-full flex-col">
        {/* TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 sm:px-10 py-2 bg-background-light dark:bg-background-dark sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 text-primary dark:text-brushed-gold">
            <div className="h-12 w-auto">
              <img src="/output_tatva.png" alt="Calm Luxury Decor" className="h-full w-auto object-contain" />
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

      {/* Main Content */}
      <main className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5">
            <div className="sticky top-28 flex h-full flex-col justify-between bg-white dark:bg-gray-800/60 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700/50">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <h1 className="text-heading-text dark:text-card-background text-lg font-bold">Filters</h1>
                  <p className="text-body-text dark:text-white/70 text-sm font-normal">Refine your search</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col gap-2 border-t border-border-soft dark:border-white/10 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-heading-text dark:text-card-background text-xl">category</span>
                    <p className="text-heading-text dark:text-card-background text-base font-medium">Category</p>
                  </div>
                  <div className="px-2" style={{'--checkbox-tick-svg': "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill='%23FDFBF6'%20xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath%20d=%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27/%3e%3c/svg%3e')"} as React.CSSProperties}>
                    <label className="flex gap-x-3 py-2 flex-row">
                      <input 
                        checked={isAllCollectionsSelected}
                        onChange={() => handleCategoryChange('All Collections')}
                        className="h-5 w-5 rounded border-border-soft dark:border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-border-soft" 
                        type="checkbox"
                      />
                      <p className="text-body-text dark:text-white/80 text-sm font-medium">All Collections</p>
                    </label>
                    <label className="flex gap-x-3 py-2 flex-row">
                      <input 
                        checked={selectedCategories.includes('Photo Frames')}
                        onChange={() => handleCategoryChange('Photo Frames')}
                        className="h-5 w-5 rounded border-border-soft dark:border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-border-soft" 
                        type="checkbox"
                      />
                      <p className="text-body-text dark:text-white/80 text-sm">Photo Frames</p>
                    </label>
                    <label className="flex gap-x-3 py-2 flex-row">
                      <input 
                        checked={selectedCategories.includes('Idols')}
                        onChange={() => handleCategoryChange('Idols')}
                        className="h-5 w-5 rounded border-border-soft dark:border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-border-soft" 
                        type="checkbox"
                      />
                      <p className="text-body-text dark:text-white/80 text-sm">Idols</p>
                    </label>
                    <label className="flex gap-x-3 py-2 flex-row">
                      <input 
                        checked={selectedCategories.includes('Home Interiors')}
                        onChange={() => handleCategoryChange('Home Interiors')}
                        className="h-5 w-5 rounded border-border-soft dark:border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-border-soft" 
                        type="checkbox"
                      />
                      <p className="text-body-text dark:text-white/80 text-sm">Home Interiors</p>
                    </label>
                    <label className="flex gap-x-3 py-2 flex-row">
                      <input 
                        checked={selectedCategories.includes('Corporate Gifts')}
                        onChange={() => handleCategoryChange('Corporate Gifts')}
                        className="h-5 w-5 rounded border-border-soft dark:border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-border-soft" 
                        type="checkbox"
                      />
                      <p className="text-body-text dark:text-white/80 text-sm">Corporate Gifts</p>
                    </label>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="flex flex-col gap-2 border-t border-border-soft dark:border-white/10 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-heading-text dark:text-card-background text-xl">sell</span>
                    <p className="text-heading-text dark:text-card-background text-base font-medium">Price Range</p>
                  </div>
                  <div className="relative flex w-full flex-col items-start justify-between gap-3">
                    <div className="flex h-[38px] w-full pt-1.5">
                      <div className="flex h-1 w-full rounded-sm bg-border-soft dark:bg-white/20 pl-[10%] pr-[30%]">
                        <div className="relative">
                          <div className="absolute -left-2 -top-1.5 flex flex-col items-center gap-1">
                            <div className="size-4 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark cursor-pointer"></div>
                            <p className="text-body-text dark:text-white/80 text-xs">₹{priceRange[0]}</p>
                          </div>
                        </div>
                        <div className="h-1 flex-1 rounded-sm bg-primary"></div>
                        <div className="relative">
                          <div className="absolute -left-2 -top-1.5 flex flex-col items-center gap-1">
                            <div className="size-4 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark cursor-pointer"></div>
                            <p className="text-body-text dark:text-white/80 text-xs">₹{priceRange[1]}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full mt-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="1000" 
                        value={priceRange[0]} 
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-20 px-2 py-1 rounded border border-border-soft dark:border-white/20 dark:bg-background-dark/50 dark:text-white text-sm"
                      />
                      <span className="text-body-text dark:text-white/70">-</span>
                      <input 
                        type="number" 
                        min="0" 
                        max="1000" 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-20 px-2 py-1 rounded border border-border-soft dark:border-white/20 dark:bg-background-dark/50 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Filter */}
                <div className="flex flex-col gap-2 border-t border-border-soft dark:border-white/10 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-heading-text dark:text-card-background text-xl">palette</span>
                    <p className="text-heading-text dark:text-card-background text-base font-medium">Color</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className={`size-8 rounded-full border border-border-soft dark:border-white/20 cursor-pointer ring-offset-2 dark:ring-offset-background-dark ring-primary dark:ring-white ${selectedColor === 'dark' ? 'ring-2' : ''}`} style={{backgroundColor: 'rgb(54, 69, 79)'}}>
                      <input 
                        checked={selectedColor === 'dark'}
                        onChange={() => handleColorChange('dark')}
                        className="invisible" 
                        name="color-filter" 
                        type="radio"
                      />
                    </label>
                    <label className={`size-8 rounded-full border border-border-soft dark:border-white/20 cursor-pointer ring-offset-2 dark:ring-offset-background-dark ring-primary dark:ring-white ${selectedColor === 'light' ? 'ring-2' : ''}`} style={{backgroundColor: 'rgb(253, 251, 246)'}}>
                      <input 
                        checked={selectedColor === 'light'}
                        onChange={() => handleColorChange('light')}
                        className="invisible" 
                        name="color-filter" 
                        type="radio"
                      />
                    </label>
                    <label className={`size-8 rounded-full border border-border-soft dark:border-white/20 cursor-pointer ring-offset-2 dark:ring-offset-background-dark ring-primary dark:ring-white ${selectedColor === 'brown' ? 'ring-2' : ''}`} style={{backgroundColor: 'rgb(160, 82, 45)'}}>
                      <input 
                        checked={selectedColor === 'brown'}
                        onChange={() => handleColorChange('brown')}
                        className="invisible" 
                        name="color-filter" 
                        type="radio"
                      />
                    </label>
                    <label className={`size-8 rounded-full border border-border-soft dark:border-white/20 cursor-pointer ring-offset-2 dark:ring-offset-background-dark ring-primary dark:ring-white ${selectedColor === 'gold' ? 'ring-2' : ''}`} style={{backgroundColor: 'rgb(255, 215, 0)'}}>
                      <input 
                        checked={selectedColor === 'gold'}
                        onChange={() => handleColorChange('gold')}
                        className="invisible" 
                        name="color-filter" 
                        type="radio"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-8 border-t border-border-soft dark:border-white/10 pt-4">
                <button 
                  onClick={() => setCurrentPage(1)}
                  className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
                >
                  <span className="truncate">Apply Filters</span>
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="flex items-center justify-center gap-2 py-2 text-body-text dark:text-white/70 hover:text-heading-text dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-base">delete_sweep</span>
                  <p className="text-sm font-medium">Clear All</p>
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6">
              <h1 className="text-2xl font-bold text-heading-text dark:text-card-background">
                All Products {filteredAndSortedProducts.length > 0 && `(${filteredAndSortedProducts.length})`}
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-body-text dark:text-white/70">Sort by:</p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-border-soft dark:border-white/20 dark:bg-background-dark/50 dark:text-white/80 focus:border-primary focus:ring-primary text-sm p-2"
                >
                  <option>Popularity</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined animate-spin text-primary dark:text-brushed-gold text-4xl">refresh</span>
                  <p className="text-body-text dark:text-white/70 text-lg">Loading products...</p>
                </div>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body-text dark:text-white/70 text-lg">No products found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white dark:bg-gray-800/70 rounded-lg shadow-md border border-gray-100 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 dark:hover:border-brushed-gold/30">
                    <Link to={`/products/${product.id}`} className="relative overflow-hidden block">
                      <img alt={product.alt} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" src={product.image}/>
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-bold text-heading-text dark:text-card-background hover:text-primary dark:hover:text-brushed-gold transition-colors mb-1">{product.name}</h3>
                      </Link>
                  <p className="text-base text-primary font-semibold mt-1 mb-2">
                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                      <div className="flex items-center gap-1 text-primary dark:text-yellow-400 mb-4">
                        {renderStars(product.rating)}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                        className="mt-auto flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center size-10 rounded-lg transition-colors ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/10 cursor-pointer'
                    }`}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`flex items-center justify-center size-10 rounded-lg transition-colors font-bold ${
                            page === currentPage
                              ? 'text-white bg-primary'
                              : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/10'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="flex items-center justify-center size-10 rounded-lg text-muted-charcoal dark:text-gray-300">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center size-10 rounded-lg transition-colors ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-muted-charcoal dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-brushed-gold/10 cursor-pointer'
                    }`}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-light dark:bg-background-dark border-t border-primary/20 pt-16 pb-8 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-primary dark:text-gray-100">Calm Luxury Decor</h3>
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
          <p>© 2024 Calm Luxury Decor. All Rights Reserved.</p>
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

export default ProductList;

