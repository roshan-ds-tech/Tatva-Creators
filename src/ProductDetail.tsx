import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { isLoggedIn } from './utils/auth'
import { addToCart } from './utils/cart'
import CartIcon from './components/CartIcon'
import { getAllProducts, type ProductDetailInfo as Product, type Review } from './data/products'
import { getProducts as getProductsFromAPI, getProductById as getProductByIdFromAPI } from './utils/api'

interface FinishVariant {
  name: string
  color: string
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = isLoggedIn()
  const isAdminAuthed =
    typeof window !== 'undefined' && window.localStorage.getItem('adminAuthed') === 'true'
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedFinish, setSelectedFinish] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', userName: '' })
  
  const finishVariants: FinishVariant[] = [
    { name: 'Natural Oak', color: '#D2B48C' },
    { name: 'Walnut', color: '#8B4513' },
    { name: 'White Wash', color: '#F5F5DC' }
  ]

  // Product data state - will refresh when localStorage changes
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const isInitialLoadRef = useRef(true)

  // Refresh products when localStorage changes (for admin-created products)
  useEffect(() => {
    const loadProducts = async (showLoading = false) => {
      try {
        // Try to fetch from API first
        try {
          const apiProducts = await getProductsFromAPI()
          if (apiProducts && apiProducts.length > 0) {
            setAllProducts(apiProducts as Product[])
            return
          }
        } catch (error) {
          console.warn('Failed to fetch products from API, falling back to localStorage:', error)
        }
        // Fallback to localStorage
        setAllProducts(getAllProducts())
      } catch (error) {
        console.error('Error loading products:', error)
        setAllProducts(getAllProducts())
      }
    }
    
    // Load products on mount (with loading state only on initial load)
    loadProducts(true)
    isInitialLoadRef.current = false
    
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

  // Default sample reviews (used if product has no custom reviews)
  const defaultReviews: Review[] = [
    {
      id: 1,
      userName: 'Sarah J.',
      rating: 5,
      date: 'October 23, 2023',
      comment: 'Absolutely stunning. The quality is exceptional. You can feel the craftsmanship. It looks perfect on my mantlepiece and brings such a warm, natural feel to the room.'
    },
    {
      id: 2,
      userName: 'Mark Chen',
      rating: 4,
      date: 'September 15, 2023',
      comment: 'Beautiful and well-made. A simple, elegant frame that doesn\'t distract from the photo. Arrived quickly and was packaged beautifully. Minus one star only because I wish it came in more sizes!'
    },
    {
      id: 3,
      userName: 'Emily Rodriguez',
      rating: 5,
      date: 'November 5, 2023',
      comment: 'This exceeded my expectations! The attention to detail is remarkable. It\'s become the centerpiece of my home decor.'
    },
    {
      id: 4,
      userName: 'David Kim',
      rating: 4,
      date: 'August 20, 2023',
      comment: 'Good value for money. The product arrived well-packaged and in perfect condition. Would buy again!'
    }
  ]

  const productId = id ? parseInt(id) : null
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)

  // Load specific product
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setIsLoadingProduct(false)
        return
      }

      // Only show loading on initial load or when productId changes
      const shouldShowLoading = !product || product.id !== productId
      if (shouldShowLoading) {
        setIsLoadingProduct(true)
      }
      
      try {
        // Try to fetch from API first
        try {
          const apiProduct = await getProductByIdFromAPI(productId)
          
          // Map API product to ProductDetailInfo format
          const priceValue = typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : (apiProduct.price || 0)
          
          // Handle sub-descriptions
          const subDescriptions = (apiProduct as any).subDescriptions || (apiProduct as any).sub_descriptions || []
          
          // Handle thumbnails
          let thumbnails: string[] = []
          if ((apiProduct as any).thumbnails) {
            if (Array.isArray((apiProduct as any).thumbnails)) {
              thumbnails = (apiProduct as any).thumbnails.map((thumb: any) => {
                if (typeof thumb === 'object' && thumb !== null && thumb.image_url) {
                  return thumb.image_url
                }
                return typeof thumb === 'string' ? thumb : ''
              }).filter((url: string) => url)
            }
          }
          
          // Handle reviews
          let reviews: Review[] = []
          if ((apiProduct as any).reviews && Array.isArray((apiProduct as any).reviews)) {
            reviews = (apiProduct as any).reviews.map((r: any, index: number) => ({
              id: r.id || index + 1,
              userName: r.userName || r.user_name || 'Anonymous',
              rating: r.rating || 5,
              date: r.date || new Date().toLocaleDateString(),
              comment: r.comment || '',
            }))
          }
          
          const formattedProduct: Product = {
            id: apiProduct.id,
            name: apiProduct.name || '',
            category: (apiProduct.category || 'Photo Frames') as Product['category'],
            price: priceValue,
            image: apiProduct.image || '',
            alt: apiProduct.alt || apiProduct.name || '',
            description: (apiProduct as any).description || (apiProduct as any).main_description || apiProduct.mainDescription || '',
            mainDescription: (apiProduct as any).main_description || apiProduct.mainDescription || (apiProduct as any).description || '',
            subDescriptions: subDescriptions,
            dimensions: (apiProduct as any).dimensions || '',
            material: (apiProduct as any).material || '',
            weight: (apiProduct as any).weight || '',
            inStock: (apiProduct as any).inStock ?? (apiProduct as any).in_stock ?? true,
            thumbnails: thumbnails,
            reviews: reviews,
            rating: apiProduct.rating || 0,
          }
          
          setProduct(formattedProduct)
          if (shouldShowLoading) {
            setIsLoadingProduct(false)
          }
          return
        } catch (error) {
          console.warn('Failed to fetch product from API, falling back to localStorage:', error)
        }
        // Fallback to localStorage
        const localProduct = allProducts.find(p => p.id === productId)
        setProduct(localProduct || null)
        if (shouldShowLoading) {
          setIsLoadingProduct(false)
        }
      } catch (error) {
        console.error('Error loading product:', error)
        const localProduct = allProducts.find(p => p.id === productId)
        setProduct(localProduct || null)
        if (shouldShowLoading) {
          setIsLoadingProduct(false)
        }
      }
    }

    if (allProducts.length > 0 || productId) {
      loadProduct()
    }
  }, [productId, allProducts])

  // Get related products - prioritize same category, then fill with other products
  const relatedProducts = product ? (() => {
    const sameCategory = allProducts.filter(p => p.category === product.category && p.id !== product.id)
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4)
    }
    // If not enough in same category, add products from other categories
    const otherCategory = allProducts.filter(p => p.category !== product.category && p.id !== product.id)
    return [...sameCategory, ...otherCategory].slice(0, 4)
  })() : []

  const productReviews: Review[] =
    product && product.reviews && product.reviews.length > 0 ? product.reviews : defaultReviews

  // Render stars
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const sizeClassThin = size === 'sm' ? '!text-lg !font-thin' : size === 'lg' ? '!text-xl !font-thin' : '!text-xl !font-thin'

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className={`material-symbols-outlined ${sizeClassThin}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      )
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={`material-symbols-outlined ${sizeClassThin}`}>star_half</span>
      )
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <span key={i} className={`material-symbols-outlined ${sizeClassThin}`}>star</span>
      )
    }
    return stars
  }

  // Calculate rating distribution
  const getRatingDistribution = (list: Review[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    list.forEach(review => {
      const rating = Math.round(review.rating)
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++
      }
    })
    const total = list.length
    return {
      5: total > 0 ? (distribution[5] / total) * 100 : 0,
      4: total > 0 ? (distribution[4] / total) * 100 : 0,
      3: total > 0 ? (distribution[3] / total) * 100 : 0,
      2: total > 0 ? (distribution[2] / total) * 100 : 0,
      1: total > 0 ? (distribution[1] / total) * 100 : 0,
    }
  }

  const ratingDistribution = getRatingDistribution(productReviews)
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : product?.rating || 0

  const formatPrice = (value: number) =>
    value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleAddToCart = () => {
    if (!loggedIn && !isAdminAuthed) {
      navigate('/login')
      return
    }

    if (!product) return

    addToCart(product.id, product.name, product.price, product.image, product.alt, quantity)
  }

  const handleBuyNow = () => {
    if (!loggedIn && !isAdminAuthed) {
      alert('Please login to proceed')
      navigate('/login')
      return
    }

    if (!product) return

    const existingCart = localStorage.getItem('cartItems')
    let cartItems = existingCart ? JSON.parse(existingCart) : []
    
    const existingItem = cartItems.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      cartItems = cartItems.map((item: any) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      )
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        alt: product.alt,
        quantity: quantity
      })
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    navigate('/cart')
  }

  const handleToggleFavorite = () => {
    if (!loggedIn) {
      alert('Please login to add to favorites')
      navigate('/login')
      return
    }
    setIsFavorite(!isFavorite)
    // Save to localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (!isFavorite) {
      if (product && !favorites.find((f: any) => f.id === product.id)) {
        favorites.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          alt: product.alt
        })
      }
    } else {
      if (product) {
        const filtered = favorites.filter((f: any) => f.id !== product.id)
        localStorage.setItem('favorites', JSON.stringify(filtered))
        return
      }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loggedIn) {
      alert('Please login to write a review')
      navigate('/login')
      return
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
    const email = emailInput?.value
    
    if (email) {
      alert('Thank you for subscribing to our newsletter!')
      emailInput.value = ''
    }
    // In a real app, this would submit to a backend
    alert('Thank you for your review!')
    setShowReviewModal(false)
    setReviewForm({ rating: 5, comment: '', userName: '' })
  }

  // Check if product is in favorites on mount
  useEffect(() => {
    if (product && loggedIn) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.some((f: any) => f.id === product.id))
    }
  }, [product, loggedIn])

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-primary dark:text-brushed-gold text-4xl mb-4">refresh</span>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Loading product...</h2>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary dark:text-brushed-gold hover:underline">
            Return to Products
          </Link>
        </div>
      </div>
    )
  }

  // Create image array (using product image as first, then thumbnails or fallback images)
  const fallbackImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIoc5qcKbWY16YaN0pENYWgHkzLLT51x9Y2u0pPgBI1X5eFOBUoCpICXKGZiNl7LyTk-b0NPo7l9Zj1YmL8XRd6PgYHVejCfOOJM-jCoSpwAjVP5mMYeLem1XNfNvDqGx35k9vLsL5zmWrRlQmA9MXw0QbNEFnaM5Cb2s_-niovXt5wMvwHTrraQyljVNb9ABEXgiwVccAjwoxvbZP-n5wfJASFDBhQznP_g4sY9rGg8X7Lw4FmIbqdqgiQ3H2LiiaCK7y258wdSE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDa4LsXdCxcTY43zOwUA0_Tu-Zg97f_smY0mOaZYEjeJwz_km-vBlsSgzhsq5h9lDqZCnTxPUKXhqYj-auQvaPLJ_Tu0lHYI-q9FpUph5X6dUXADmnWagLOPEfcD034OVJkqm_TkCSn46NmCCCXMDWmJ4boT91XsaFOfzfk2_8N4-NwS5lSP_OD1meY9ShyKb2dvkHQxdQNp_MLM0u_zZYx2sJKjcDIChzG_Z2DX37MXlXoOU0Hnhv2QZcM1vai_s5op14ddCE4Ww4',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD0zQKZqWMVtR-Hn7woR6rDX8y3yLHMna50QtKcEPI9zTUg91XMJqJDhmmshk4ixaGSD9_VHJD17EgJdZmlDyRuIp1-dPR6uhI55f6MNzTQJmGxUSsejk5wHTqy5sOnvDxcGlecX6MqRr1IG6ZP_AFNxANaOAOh_G1S3zoeg81QwlidUXhxUz_hMhlnRNGt-VWD5NBB2AfkpZn2TdG560zX2hFzNNHLrzHQlFS7zPJ3LCN-3xXzE6TMCoQnUvok18s4C19I-pCbpZY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjdfeivip0NrlliYbiqtWxyjaclQ0Sms6AokmwdHPPb2l8Yzdy-Gv9R4ZVlcZtaSpqj8d5wRi3F9yRAcRy67Gb5FDHBQr7cM0zz3iIC3ODv9hUW3zlh_Git0Jy2DgVqT8fhkvD4S4zy_yEn4UO0ZZ-OtDtaAyKelNovyt8stdjgK2ZnF1WnR-5d3GzKpOlVbXgbtfHic9oPxJL-FZQjyXIw852BQtaeB_PtNvdlDvakVVAzbAtQyczqJME_AW16GVQap5DxCu1KU4',
  ]

  const extraImages =
    product && product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails : fallbackImages

  const productImages = product ? [product.image, ...extraImages] : []

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex w-full flex-col">
        {/* TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 sm:px-10 py-2 min-h-[64px] bg-background-light dark:bg-background-dark sticky top-0 z-50">
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

        <main className="layout-content-container flex flex-col w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-20 py-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link to="/" className="text-text-charcoal/60 dark:text-background-light/60 text-sm font-medium">Home</Link>
            <span className="text-text-charcoal/60 dark:text-background-light/60 text-sm font-medium">/</span>
            <Link to="/products" className="text-text-charcoal/60 dark:text-background-light/60 text-sm font-medium">Photo Frames</Link>
            <span className="text-text-charcoal/60 dark:text-background-light/60 text-sm font-medium">/</span>
            <span className="text-text-charcoal dark:text-background-light text-sm font-medium">{product.name}</span>
          </div>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-2.5">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg bg-center bg-no-repeat bg-cover cursor-pointer transition-opacity ${
                      selectedImage === index 
                        ? 'border-2 border-primary opacity-100' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{backgroundImage: `url("${img}")`}}
                    data-alt={`${product.name} view ${index + 1}`}
                  ></div>
                ))}
              </div>
              <div 
                className="flex-1 w-full bg-center bg-no-repeat bg-cover aspect-[4/5] rounded-xl" 
                data-alt={`Main image of ${product.name}`} 
                style={{backgroundImage: `url("${productImages[selectedImage]}")`}}
              ></div>
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col gap-6">
              {/* PageHeading */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-accent-green dark:text-green-200 text-4xl font-black leading-tight tracking-[-0.033em] flex-1">{product.name}</h1>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center rounded-lg h-10 w-10 transition-colors ${
                    isFavorite 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'bg-border-soft dark:bg-white/10 text-text-charcoal dark:text-background-light hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className={`material-symbols-outlined text-xl ${isFavorite ? '' : '!text-2xl'}`} style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {isFavorite ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              {/* Price and Rating */}
              <div className="flex items-center gap-4">
                <p className="text-accent-brown dark:text-orange-200 text-3xl font-bold">₹{formatPrice(product.price)}</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(averageRating, 'md')}
                  </div>
                  <a className="text-sm text-text-charcoal/70 dark:text-background-light/70 hover:underline" href="#reviews">
                    ({productReviews.length} reviews)
                  </a>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-base font-normal leading-relaxed">
                {product.mainDescription || product.description || 'Capture your cherished memories in our sustainably sourced, handcrafted oak wood frame. Its minimalist design and natural finish bring a touch of calm luxury to any space, celebrating both your photos and the art of fine craftsmanship.'}
              </p>

              {/* Variants */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold">Finish: <span className="font-medium">{finishVariants[selectedFinish].name}</span></p>
                <div className="flex gap-2">
                  {finishVariants.map((finish, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFinish(index)}
                      className={`size-10 rounded-full border-2 transition-colors ${
                        selectedFinish === index 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-primary/50'
                      }`}
                      style={{backgroundColor: finish.color}}
                      data-alt={`${finish.name} finish swatch`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex items-center border border-border-soft dark:border-white/20 rounded-lg p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="size-10 flex items-center justify-center text-text-charcoal/60 dark:text-background-light/60 hover:bg-border-soft dark:hover:bg-white/10 rounded-md transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input 
                    className="w-12 text-center bg-transparent border-0 focus:ring-0 p-0 font-medium" 
                    type="text" 
                    value={quantity}
                    readOnly
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="size-10 flex items-center justify-center text-text-charcoal/60 dark:text-background-light/60 hover:bg-border-soft dark:hover:bg-white/10 rounded-md transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-accent-green text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-accent-green/90 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="w-full flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-text-charcoal dark:bg-zinc-800 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-text-charcoal/90 dark:hover:bg-zinc-700 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Lower Sections: Details, Reviews etc. */}
          <div className="mt-16 lg:mt-24 space-y-16">
            {/* Description & Specifications */}
            <div className="border-t border-border-soft dark:border-white/10 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-4">Full Description</h3>
                  <p className="text-base leading-relaxed mb-4">
                    {product.mainDescription || product.description || 'Our Handcrafted Oak Photo Frame is more than just a border for your pictures; it\'s a piece of art designed to complement your most precious moments. Inspired by the principles of Japandi design, it blends Scandinavian functionality with Japanese rustic minimalism. Each frame is meticulously crafted by skilled artisans from solid, sustainably-harvested oak, ensuring that no two pieces are exactly alike. The natural grain of the wood is enhanced with a subtle, matte finish, protecting it while allowing its organic beauty to shine through.'}
                  </p>
                  {/* Display subDescriptions if they exist (for admin-created products) */}
                  {product.subDescriptions && product.subDescriptions.length > 0 && product.subDescriptions.some(sub => sub.title || sub.body) && (
                    <>
                      {product.subDescriptions.map((sub, index) => (
                        sub.title || sub.body ? (
                          <div key={index} className="mt-8">
                            <h3 className="text-xl font-bold mb-4">{sub.title || `Details ${index + 1}`}</h3>
                            <p className="text-base leading-relaxed">{sub.body}</p>
                          </div>
                        ) : null
                      ))}
                    </>
                  )}
                  {/* Fallback description for products without subDescriptions */}
                  {(!product.subDescriptions || product.subDescriptions.length === 0 || !product.subDescriptions.some(sub => sub.title || sub.body)) && (
                    <>
                      <h3 className="text-xl font-bold mb-4 mt-8">Materials & Craftsmanship</h3>
                      <p className="text-base leading-relaxed">
                        We believe in conscious creation. The oak used for our frames is sourced from responsibly managed forests in North America. The wood is hand-selected for its quality and character, then carefully shaped and joined using traditional woodworking techniques. We use a non-toxic, water-based finish to seal the wood, preserving its natural feel and ensuring it is safe for your home.
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Specifications</h3>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between border-b border-border-soft dark:border-white/10 pb-2">
                      <span className="font-medium">Dimensions</span>
                      <span>{product.dimensions || `8" x 10"`}</span>
                    </div>
                    <div className="flex justify-between border-b border-border-soft dark:border-white/10 pb-2">
                      <span className="font-medium">Material</span>
                      <span>{product.material || 'Solid Oak Wood'}</span>
                    </div>
                    <div className="flex justify-between border-b border-border-soft dark:border-white/10 pb-2">
                      <span className="font-medium">Weight</span>
                      <span>{product.weight || '1.2 kg'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="border-t border-border-soft dark:border-white/10 pt-10" id="reviews">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-transparent text-primary border border-primary gap-2 text-sm font-bold min-w-0 px-5 hover:bg-primary/10 transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {/* RatingSummary Component */}
              <div className="flex flex-col lg:flex-row flex-wrap gap-x-12 gap-y-8 p-4 bg-border-soft/50 dark:bg-white/5 rounded-xl">
                <div className="flex flex-col gap-2">
                  <p className="text-5xl font-black tracking-[-0.033em]">{averageRating.toFixed(1)}</p>
                  <div className="flex gap-0.5 text-primary">
                    {renderStars(averageRating, 'lg')}
                  </div>
                  <p className="text-base font-normal">Based on {productReviews.length} reviews</p>
                </div>
                <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-x-3 gap-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="contents">
                      <p className="text-sm font-normal">{rating}</p>
                      <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                        <div className="rounded-full bg-primary" style={{width: `${ratingDistribution[rating as keyof typeof ratingDistribution]}%`}}></div>
                      </div>
                      <p className="text-sm font-normal text-right text-text-charcoal/70 dark:text-background-light/70">{Math.round(ratingDistribution[rating as keyof typeof ratingDistribution])}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="mt-10 space-y-8 divide-y divide-border-soft dark:divide-white/10">
                {productReviews.map((review: Review, index: number) => {
                  const commentParts = review.comment.split('.')
                  const title = commentParts[0] || 'Great product'
                  const body = commentParts.slice(1).join('.').trim()
                  return (
                    <div key={review.id} className={`pt-8 ${index === 0 ? 'first:pt-0' : ''}`}>
                      <div className="flex items-center gap-1 text-primary">
                        {renderStars(review.rating, 'sm')}
                      </div>
                      <p className="mt-2 font-bold text-lg">{title}</p>
                      {body && <p className="mt-2 text-base leading-relaxed">{body}</p>}
                      <p className="mt-4 text-sm text-text-charcoal/70 dark:text-background-light/70">{review.userName} on {review.date}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-border-soft dark:border-white/10 pt-10">
                <h2 className="text-2xl font-bold tracking-tight mb-8">You Might Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`} className="flex flex-col gap-3 group">
                      <div 
                        className="aspect-square w-full bg-center bg-no-repeat bg-cover rounded-xl transition-transform group-hover:scale-105" 
                        data-alt={relatedProduct.alt} 
                        style={{backgroundImage: `url("${relatedProduct.image}")`}}
                      ></div>
                      <h4 className="font-bold text-base group-hover:text-primary dark:group-hover:text-brushed-gold transition-colors">{relatedProduct.name}</h4>
                      <p className="text-accent-brown dark:text-orange-200 font-medium">₹{formatPrice(relatedProduct.price)}</p>
                    </Link>
                  ))}
                </div>
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

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-background-dark rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating })}
                      className={`text-2xl ${reviewForm.rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.userName}
                  onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary dark:bg-brushed-gold text-white rounded-md hover:opacity-90"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

