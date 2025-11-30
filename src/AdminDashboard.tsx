import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  getAllProducts,
  type ProductCategory, 
  type Review,
  type ProductDetailInfo
} from './data/products'
import { isAdminAuthenticated, setAdminAuthenticated, clearAdminAuth } from './utils/adminAuth'
import { createProduct, updateProduct, deleteProduct, getProducts, getProductById, getAccessToken, login, uploadImage, refreshAccessToken } from './utils/api'

interface SubDescription {
  title: string
  body: string
}

function AdminDashboard() {
  const navigate = useNavigate()
  
  // Always start with login form - never check previous authentication
  // This ensures admin must login every time they visit /admin
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Clear any existing authentication on mount to force fresh login
  useEffect(() => {
    clearAdminAuth()
  }, [])
  
  // Login form state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Product list state (must be declared before early return for Rules of Hooks)
  const [products, setProducts] = useState<ProductDetailInfo[]>([])
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  // Form state (must be declared before early return for Rules of Hooks)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('Photo Frames')
  const [price, setPrice] = useState<number>(0)
  const [mainImage, setMainImage] = useState('')
  const [thumbnailInputs, setThumbnailInputs] = useState<string[]>(['', '', ''])
  const [mainDescription, setMainDescription] = useState('')
  const [subDescriptions, setSubDescriptions] = useState<SubDescription[]>([
    { title: '', body: '' },
    { title: '', body: '' },
  ])
  const [dimensions, setDimensions] = useState('')
  const [material, setMaterial] = useState('')
  const [weight, setWeight] = useState('')
  const [inStock, setInStock] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewDraft, setReviewDraft] = useState<{ userName: string; rating: number; comment: string }>({
    userName: '',
    rating: 5,
    comment: '',
  })

  // Load products function (must be defined before useEffect)
  const loadProducts = async () => {
    setIsLoadingProducts(true)
    try {
      // Always try to fetch from API first (API endpoint is public, no auth required)
      try {
        const apiProducts = await getProducts()
        console.log('Fetched products from API:', apiProducts)
        
        if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
          // Convert API products to ProductDetailInfo format
          try {
            const formattedProducts: ProductDetailInfo[] = apiProducts.map((p: any) => {
              // Ensure price is a number
              const priceValue = typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0)
              
              // Handle sub-descriptions (backend may return sub_descriptions or subDescriptions)
              const subDescriptions = p.subDescriptions || p.sub_descriptions || []
              
              // Handle thumbnails - ensure it's an array of strings
              let thumbnails: string[] = []
              if (p.thumbnails) {
                if (Array.isArray(p.thumbnails)) {
                  thumbnails = p.thumbnails.map((thumb: any) => {
                    // If thumbnail is an object with image_url, extract it
                    if (typeof thumb === 'object' && thumb !== null && thumb.image_url) {
                      return thumb.image_url
                    }
                    // Otherwise, it should be a string URL
                    return typeof thumb === 'string' ? thumb : ''
                  }).filter((url: string) => url) // Remove empty strings
                }
              }
              
              // Handle reviews - ensure they have the correct format
              let reviews: Review[] = []
              if (p.reviews && Array.isArray(p.reviews)) {
                reviews = p.reviews.map((r: any, index: number) => ({
                  id: r.id || index + 1,
                  userName: r.userName || r.user_name || 'Anonymous',
                  rating: r.rating || 5,
                  date: r.date || new Date().toLocaleDateString(),
                  comment: r.comment || '',
                }))
              }
              
              return {
                id: p.id,
                name: p.name || 'Unnamed Product',
                category: (p.category || 'Photo Frames') as ProductCategory,
                price: priceValue,
                image: p.image || '',
                alt: p.alt || p.name || 'Product image',
                description: p.description || p.main_description || p.mainDescription || '',
                mainDescription: p.main_description || p.mainDescription || p.description || '',
                subDescriptions: subDescriptions,
                dimensions: p.dimensions || '',
                material: p.material || '',
                weight: p.weight || '',
                inStock: p.inStock ?? p.in_stock ?? true,
                thumbnails: thumbnails,
                reviews: reviews,
                rating: p.rating || 0,
              }
            })
            console.log('Formatted products:', formattedProducts)
            setProducts(formattedProducts)
            setIsLoadingProducts(false)
            return
          } catch (mapError) {
            console.error('Error mapping products:', mapError)
            // If mapping fails, try to use what we have or fallback
            setProducts([])
          }
        } else {
          // API returned empty array or invalid data, fallback to localStorage
          console.log('API returned no products or invalid data, falling back to localStorage')
          const localProducts = getAllProducts()
          setProducts(localProducts)
        }
      } catch (apiError) {
        console.warn('Failed to fetch products from API, falling back to localStorage:', apiError)
        // Fallback to localStorage
        const localProducts = getAllProducts()
        setProducts(localProducts)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to localStorage or empty array
      try {
        const localProducts = getAllProducts()
        setProducts(localProducts)
      } catch (fallbackError) {
        console.error('Failed to load from localStorage:', fallbackError)
        setProducts([]) // Set empty array as last resort
      }
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Dispatch custom event to notify other components of product changes
  const notifyProductUpdate = () => {
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('adminProductsUpdated'))
  }

  // Load products only when authenticated (MUST be before early return)
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoading(true)

    // Trim whitespace from inputs
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    // Only allow specific admin email
    const adminEmail = 'roshands00270@gmail.com'
    const adminPassword = 'hackerone007'

    // Check if credentials match the admin account
    if (trimmedUsername !== adminEmail || trimmedPassword !== adminPassword) {
      setLoginError('Access denied. Only authorized admin can access this dashboard.')
      setIsLoading(false)
      return
    }

    // Authenticate via API with the admin credentials
    try {
      await login({ email: adminEmail, password: adminPassword })
      // If API login succeeds, we have JWT token stored
      setAdminAuthenticated(true)
      setIsAuthenticated(true)
      setLoginError('')
      setUsername('')
      setPassword('')
      setIsLoading(false)
      return
    } catch (apiError: any) {
      // Extract error message
      const errorMessage = apiError?.error || apiError?.message || 'Failed to authenticate. Please check your credentials and ensure the backend server is running.'
      
      // Check if it's a backend connection issue
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        setLoginError('Cannot connect to backend server. Please ensure the backend is running at http://localhost:8000')
      } else {
        setLoginError(errorMessage)
      }
      setIsLoading(false)
      return
    }
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-background-dark/80 rounded-2xl shadow-lg border border-primary/10 dark:border-white/10 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-auto">
                <img src="/output_tatva.png" alt="TatvaCreators" className="h-full w-auto object-contain" />
              </div>
            </div>
                  <h1 className="text-3xl font-serif font-bold text-primary dark:text-brushed-gold">Admin Login</h1>
                  <p className="text-sm text-muted-charcoal dark:text-gray-400">
                    Authorized admin access only
                  </p>
          </div>

          {loginError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300">
                      Admin Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-primary/20 dark:border-white/20 bg-white dark:bg-background-dark/60 px-4 py-3 text-sm text-muted-charcoal dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all"
                      placeholder="Enter admin email address"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                    />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-primary/20 dark:border-white/20 bg-white dark:bg-background-dark/60 px-4 py-3 text-sm text-muted-charcoal dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all"
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 inline-flex items-center justify-center rounded-full bg-primary dark:bg-brushed-gold text-white dark:text-background-dark px-6 py-3 text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-primary/10 dark:border-white/10">
            <Link 
              to="/" 
              className="text-sm text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }


  // Reset form
  const resetForm = () => {
    setName('')
    setCategory('Photo Frames')
    setPrice(0)
    setMainImage('')
    setThumbnailInputs(['', '', ''])
    setMainDescription('')
    setSubDescriptions([{ title: '', body: '' }, { title: '', body: '' }])
    setDimensions('')
    setMaterial('')
    setWeight('')
    setInStock(true)
    setReviews([])
    setReviewDraft({ userName: '', rating: 5, comment: '' })
    setEditingProductId(null)
    setShowCreateForm(false)
  }

  // Load product into form for editing
  const handleEdit = async (product: ProductDetailInfo) => {
    setIsLoading(true)
    try {
      // Fetch full product details from API to ensure we have all data
      let fullProduct = product
      try {
        const apiProduct = await getProductById(product.id)
        console.log('Fetched full product from API:', apiProduct)
        
        // Map API response to ProductDetailInfo format
        const priceValue = typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : (apiProduct.price || 0)
        
        // Handle sub-descriptions (backend returns sub_descriptions in snake_case)
        let subDescriptions: { title: string; body: string }[] = []
        const rawSubDescs = (apiProduct as any).sub_descriptions || (apiProduct as any).subDescriptions
        console.log('Raw sub-descriptions from API:', rawSubDescs)
        
        if (rawSubDescs && Array.isArray(rawSubDescs)) {
          subDescriptions = rawSubDescs.map((sub: any) => ({
            title: sub?.title || sub?.Title || '',
            body: sub?.body || sub?.Body || '',
          })).filter((sub: any) => sub.title || sub.body) // Filter out completely empty ones
        }
        console.log('Processed sub-descriptions:', subDescriptions)
        
        // Handle thumbnails - ensure it's an array of strings
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
        
        // Handle reviews - backend returns reviews
        let reviews: Review[] = []
        const rawReviews = (apiProduct as any).reviews
        console.log('Raw reviews from API:', rawReviews)
        
        if (rawReviews && Array.isArray(rawReviews) && rawReviews.length > 0) {
          reviews = rawReviews.map((r: any, index: number) => ({
            id: r.id || r.pk || index + 1,
            userName: r.userName || r.user_name || 'Anonymous',
            rating: typeof r.rating === 'number' ? r.rating : (parseInt(r.rating) || 5),
            date: r.date || r.created_at || new Date().toLocaleDateString(),
            comment: r.comment || '',
          }))
        }
        console.log('Processed reviews:', reviews)
        
        fullProduct = {
          id: apiProduct.id,
          name: apiProduct.name || product.name || '',
          category: (apiProduct.category || product.category || 'Photo Frames') as ProductCategory,
          price: priceValue,
          image: apiProduct.image || product.image || '',
          alt: apiProduct.alt || product.alt || apiProduct.name || '',
          description: (apiProduct as any).description || (apiProduct as any).main_description || apiProduct.mainDescription || product.description || '',
          mainDescription: (apiProduct as any).main_description || apiProduct.mainDescription || (apiProduct as any).description || product.mainDescription || '',
          subDescriptions: subDescriptions,
          dimensions: (apiProduct as any).dimensions || product.dimensions || '',
          material: (apiProduct as any).material || product.material || '',
          weight: (apiProduct as any).weight || product.weight || '',
          inStock: (apiProduct as any).inStock ?? (apiProduct as any).in_stock ?? product.inStock ?? true,
          thumbnails: thumbnails,
          reviews: reviews,
          rating: apiProduct.rating || product.rating || 0,
        }
      } catch (error) {
        console.warn('Failed to fetch full product details, using cached data:', error)
        // Use the product data we already have
      }
      
      console.log('Loading product for editing:', fullProduct)
      
      setName(fullProduct.name || '')
      setCategory(fullProduct.category || 'Photo Frames')
      setPrice(typeof fullProduct.price === 'number' ? fullProduct.price : 0)
      setMainImage(fullProduct.image || '')
      
      // Preserve all thumbnails - pad to at least 3 slots, but keep all existing ones
      const productThumbnails = fullProduct.thumbnails || []
      const thumbnailArray = [...productThumbnails]
      // Ensure we have at least 3 slots for editing
      while (thumbnailArray.length < 3) {
        thumbnailArray.push('')
      }
      setThumbnailInputs(thumbnailArray)
      console.log('Loaded thumbnails:', thumbnailArray)
      
      // Preserve main description
      setMainDescription(fullProduct.mainDescription || fullProduct.description || '')
      
      // Preserve all sub-descriptions - pad to at least 2 slots, but keep all existing ones
      const productSubDescriptions = fullProduct.subDescriptions || []
      console.log('Product sub-descriptions before processing:', productSubDescriptions)
      console.log('Type of subDescriptions:', typeof productSubDescriptions, Array.isArray(productSubDescriptions))
      
      // Ensure each sub-description has title and body properties
      let subDescArray: { title: string; body: string }[] = []
      if (Array.isArray(productSubDescriptions) && productSubDescriptions.length > 0) {
        subDescArray = productSubDescriptions.map((sub: any) => {
          if (typeof sub === 'object' && sub !== null) {
            return {
              title: String(sub.title || sub.Title || ''),
              body: String(sub.body || sub.Body || ''),
            }
          }
          return { title: '', body: '' }
        })
      }
      
      // Ensure we have at least 2 slots for editing
      while (subDescArray.length < 2) {
        subDescArray.push({ title: '', body: '' })
      }
      setSubDescriptions(subDescArray)
      console.log('Loaded sub-descriptions into form state:', subDescArray)
      
      setDimensions(fullProduct.dimensions || '')
      setMaterial(fullProduct.material || '')
      setWeight(fullProduct.weight || '')
      setInStock(fullProduct.inStock ?? true)
      
      // Preserve all reviews
      const productReviews = fullProduct.reviews || []
      console.log('Product reviews before setting state:', productReviews)
      console.log('Type of reviews:', typeof productReviews, Array.isArray(productReviews))
      
      // Ensure reviews is always an array
      const reviewsArray = Array.isArray(productReviews) ? productReviews : []
      setReviews(reviewsArray)
      console.log('Loaded reviews into form state:', reviewsArray)
      
      setEditingProductId(fullProduct.id)
      setShowCreateForm(true)
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error loading product for editing:', error)
      alert('Failed to load product details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete with confirmation
  const handleDelete = async (productId: number) => {
    const product = products.find(p => p.id === productId)
    const productName = product?.name || 'this product'
    
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      // JWT token is optional - backend may allow unauthenticated requests
      try {
        await deleteProduct(productId)
        alert('Product deleted successfully from backend.')
        
        if (editingProductId === productId) {
          resetForm()
        }
        
        // Reload products asynchronously
        loadProducts().catch(err => {
          console.error('Error reloading products after deletion:', err)
        })
        
        notifyProductUpdate()
      } catch (error: any) {
        // Extract error message properly
        let errorMessage = 'Failed to delete product'
        
        if (typeof error === 'string') {
          errorMessage = error
        } else if (error?.error) {
          errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error)
        } else if (error?.message) {
          errorMessage = error.message
        } else if (error?.detail) {
          errorMessage = error.detail
        }
        
        console.error('Failed to delete product:', error)
        alert(
          `Failed to delete product from backend:\n\n${errorMessage}\n\n` +
          'Please check:\n' +
          '1. Backend server is running (http://localhost:8000)\n' +
          '2. You have proper admin permissions\n' +
          '3. Your JWT token is valid\n\n' +
          'Check the browser console for more details.'
        )
      }
    }
  }

  const handleAddThumbnail = (index: number, value: string) => {
    const next = [...thumbnailInputs]
    next[index] = value
    setThumbnailInputs(next)
  }

  const handleMainImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Show loading state
      setIsLoading(true)
      
      // Upload image to backend
      const result = await uploadImage(file)
      
      // Set the returned URL
      setMainImage(result.url)
      
      alert('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Failed to upload image:', error)
      alert(
        `Failed to upload image:\n\n${error?.message || 'Unknown error'}\n\n` +
        'Please try again or use an image URL instead.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleThumbnailFile = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Upload image to backend
      const result = await uploadImage(file)
      
      // Set the returned URL
      handleAddThumbnail(index, result.url)
      
      alert(`Thumbnail ${index + 1} uploaded successfully!`)
    } catch (error: any) {
      console.error(`Failed to upload thumbnail ${index + 1}:`, error)
      alert(
        `Failed to upload thumbnail ${index + 1}:\n\n${error?.message || 'Unknown error'}\n\n` +
        'Please try again or use an image URL instead.'
      )
    }
  }

  const handleSubDescriptionChange = (index: number, field: keyof SubDescription, value: string) => {
    const next = [...subDescriptions]
    next[index] = { ...next[index], [field]: value }
    setSubDescriptions(next)
  }

  const handleAddReview = () => {
    if (!reviewDraft.userName || !reviewDraft.comment) return
    const newReview: Review = {
      id: Date.now(),
      userName: reviewDraft.userName,
      rating: reviewDraft.rating,
      date: new Date().toLocaleDateString(),
      comment: reviewDraft.comment,
    }
    setReviews(prev => [...prev, newReview])
    setReviewDraft({ userName: '', rating: 5, comment: '' })
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAdminAuth()
      setIsAuthenticated(false)
      // Reset login form
      setUsername('')
      setPassword('')
      setLoginError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !mainImage || !price || !mainDescription) {
      alert('Please fill in product name, main image, price, and main description.')
      return
    }

    const thumbnails = thumbnailInputs.filter(Boolean)
    
    // Validate image URL
    const imageUrl = mainImage.trim()
    
    if (!imageUrl) {
      alert('Please provide a main product image.')
      return
    }
    
    // Validate URL format (must be a valid URL)
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
      alert(
        'Invalid image URL!\n\n' +
        'Please enter a valid image URL that starts with:\n' +
        '- http://\n' +
        '- https://\n' +
        '- data: (for base64)\n\n' +
        'Or upload an image file using the file upload button.'
      )
      return
    }
    
    // If it's a base64 data URL and too long, try to upload it first
    let finalImageUrl = imageUrl
    if (imageUrl.startsWith('data:') && imageUrl.length > 500) {
      try {
        setIsLoading(true)
        // Extract base64 data and upload
        const result = await uploadImage(imageUrl)
        finalImageUrl = result.url
        setMainImage(result.url) // Update the field with the server URL
      } catch (error: any) {
        alert(
          `Failed to upload image:\n\n${error?.message || 'Unknown error'}\n\n` +
          'Please try uploading the image file using the file upload button, or use a shorter image URL.'
        )
        setIsLoading(false)
        return
      } finally {
        setIsLoading(false)
      }
    }
    
    // Prepare product data for backend API
    // Build object and only include defined fields
    const productData: any = {
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      image: finalImageUrl,
      alt: name.trim(),
      description: mainDescription.trim(),
      mainDescription: mainDescription.trim(),
      inStock: inStock ?? true,
    }
    
    // Add optional fields only if they have values
    // Filter out empty sub-descriptions and ensure proper format
    const filteredSubDescriptions = subDescriptions
      .filter(sub => sub && (sub.title?.trim() || sub.body?.trim()))
      .map(sub => ({
        title: (sub.title || '').trim(),
        body: (sub.body || '').trim(),
      }))
    
    console.log('Filtered sub-descriptions to save:', filteredSubDescriptions)
    
    if (filteredSubDescriptions.length > 0) {
      // Backend expects sub_descriptions (snake_case) in the request
      ;(productData as any).sub_descriptions = filteredSubDescriptions
    }
    
    if (dimensions.trim()) {
      productData.dimensions = dimensions.trim()
    }
    
    if (material.trim()) {
      productData.material = material.trim()
    }
    
    if (weight.trim()) {
      productData.weight = weight.trim()
    }
    
    // Validate and filter thumbnails
    // Upload any base64 thumbnails that are too long
    const validThumbnails: string[] = []
    
    for (let i = 0; i < thumbnails.length; i++) {
      const thumb = thumbnails[i]
      if (!thumb.trim()) continue
      
      // Validate URL format
      if (!thumb.startsWith('data:') && !thumb.startsWith('http://') && !thumb.startsWith('https://')) {
        alert(`Thumbnail ${i + 1} is not a valid URL. Please enter a valid image URL or upload a file.`)
        continue
      }
      
      // If it's a base64 data URL and too long, upload it
      let finalThumbUrl = thumb
      if (thumb.startsWith('data:') && thumb.length > 500) {
        try {
          const result = await uploadImage(thumb)
          finalThumbUrl = result.url
        } catch (error: any) {
          console.warn(`Failed to upload thumbnail ${i + 1}:`, error)
          alert(`Failed to upload thumbnail ${i + 1}. Please try again or use a URL.`)
          continue
        }
      }
      
      validThumbnails.push(finalThumbUrl)
    }
    
    if (validThumbnails.length > 0) {
      productData.thumbnails = validThumbnails
    }
    
    // Always include reviews (even if empty array) to ensure they're saved/updated
    productData.reviews = reviews.map(r => ({
      userName: r.userName || 'Anonymous',
      rating: r.rating || 5,
      date: r.date || new Date().toLocaleDateString(),
      comment: r.comment || '',
    }))
    console.log('Reviews to save:', productData.reviews)

    try {
      const token = getAccessToken()
      
      if (editingProductId) {
        // Update existing product - ALWAYS use backend API
        // JWT token is optional - backend may allow unauthenticated requests
        try {
          await updateProduct(editingProductId, productData)
          alert('Product updated successfully in backend.')
          
          // Reset form first
          resetForm()
          
          // Reload products asynchronously
          loadProducts().catch(err => {
            console.error('Error reloading products after update:', err)
          })
          
          notifyProductUpdate()
          return
        } catch (error: any) {
          // API failed - extract error message properly
          let errorMessage = 'API request failed'
          
          // Try to extract error message from various possible locations
          if (typeof error === 'string') {
            errorMessage = error
          } else if (error?.error) {
            errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error)
          } else if (error?.message) {
            errorMessage = typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
          } else if (error?.detail) {
            errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail)
          } else if (error?.non_field_errors) {
            errorMessage = Array.isArray(error.non_field_errors) 
              ? error.non_field_errors.join(', ') 
              : String(error.non_field_errors)
          } else if (error) {
            // If error is an object, try to stringify it properly
            try {
              const errorStr = JSON.stringify(error, null, 2)
              if (errorStr !== '{}') {
                errorMessage = errorStr
              }
            } catch {
              errorMessage = String(error)
            }
          }
          
          console.error('Failed to update product in API:', error)
          console.error('Extracted error message:', errorMessage)
          
          // Check if error is token-related
          const isTokenError = errorMessage.toLowerCase().includes('token') || 
                               errorMessage.toLowerCase().includes('unauthorized') ||
                               errorMessage.toLowerCase().includes('authentication')
          
          if (isTokenError) {
            alert(
              `Authentication Error:\n\n${errorMessage}\n\n` +
              'Your session has expired or the token is invalid.\n\n' +
              'Please:\n' +
              '1. Log out and log in again with your email and password\n' +
              '2. Make sure you\'re using a registered account (not the legacy credentials)\n' +
              '3. The backend server is running (http://localhost:8000)\n\n' +
              'Note: Using "RoshanDS" / "hackerone007" won\'t work for updating products.\n' +
              'You need to log in with a registered email to get a valid JWT token.'
            )
          } else {
            alert(
              `Failed to update product in backend:\n\n${errorMessage}\n\n` +
              'Please check:\n' +
              '1. Backend server is running (http://localhost:8000)\n' +
              '2. You have proper admin permissions\n' +
              '3. All required fields are filled correctly\n' +
              '4. Your JWT token is valid\n\n' +
              'Check the browser console for more details.'
            )
          }
          return
        }
      } else {
        // Create new product - ALWAYS use backend API
        // Check and refresh token if needed before creating
        let token = getAccessToken()
        
        // If token exists but might be expired, try to refresh it
        if (!token) {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              token = await refreshAccessToken()
              console.log('Token refreshed successfully')
            } catch (refreshError) {
              console.warn('Failed to refresh token:', refreshError)
              // Continue without token - backend may allow unauthenticated requests
            }
          }
        }
        
        // JWT token is optional - backend may allow unauthenticated requests
        try {
          const createdProduct = await createProduct(productData)
          console.log('Product created in backend:', createdProduct)
          alert('Product created successfully in backend.')
          
          // Reset form first to hide the create form
          resetForm()
          
          // Reload products asynchronously - don't await to avoid blocking
          loadProducts().catch(err => {
            console.error('Error reloading products after creation:', err)
            // Don't show error to user, just log it - dashboard should still render
          })
          
          notifyProductUpdate()
          return
        } catch (error: any) {
          // API failed - extract error message properly
          let errorMessage = 'API request failed'
          
          // Try to extract error message from various possible locations
          if (typeof error === 'string') {
            errorMessage = error
          } else if (error?.error) {
            errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error)
          } else if (error?.message) {
            errorMessage = typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
          } else if (error?.detail) {
            errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail)
          } else if (error?.non_field_errors) {
            errorMessage = Array.isArray(error.non_field_errors) 
              ? error.non_field_errors.join(', ') 
              : String(error.non_field_errors)
          } else if (error) {
            // If error is an object, try to stringify it properly
            try {
              const errorStr = JSON.stringify(error, null, 2)
              if (errorStr !== '{}') {
                errorMessage = errorStr
              }
            } catch {
              errorMessage = String(error)
            }
          }
          
          console.error('Failed to create product in API:', error)
          console.error('Extracted error message:', errorMessage)
          
          // Check if error is token-related
          const isTokenError = errorMessage.toLowerCase().includes('token') || 
                               errorMessage.toLowerCase().includes('unauthorized') ||
                               errorMessage.toLowerCase().includes('authentication')
          
          if (isTokenError) {
            alert(
              `Authentication Error:\n\n${errorMessage}\n\n` +
              'Your session has expired or the token is invalid.\n\n' +
              'Please:\n' +
              '1. Log out and log in again with your email and password\n' +
              '2. Make sure you\'re using a registered account (not the legacy credentials)\n' +
              '3. The backend server is running (http://localhost:8000)\n\n' +
              'Note: Using "RoshanDS" / "hackerone007" won\'t work for creating products.\n' +
              'You need to log in with a registered email to get a valid JWT token.'
            )
          } else {
            alert(
              `Failed to create product in backend:\n\n${errorMessage}\n\n` +
              'Please check:\n' +
              '1. Backend server is running (http://localhost:8000)\n' +
              '2. You have proper admin permissions\n' +
              '3. All required fields are filled correctly\n' +
              '4. Your JWT token is valid\n\n' +
              'Check the browser console for more details.'
            )
          }
          return
        }
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again.')
      console.error('Unexpected error saving product:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-muted-charcoal dark:text-gray-100 px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white dark:bg-background-dark/80 rounded-xl shadow-lg border border-primary/10 dark:border-white/10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-brushed-gold">Admin Product Dashboard</h1>
              <p className="text-sm text-muted-charcoal dark:text-gray-400 mt-1">
                Manage all products available on the website
              </p>
              {!getAccessToken() && (
                <div className="mt-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>
                    No valid JWT token. You can view products, but creating/updating requires logging in with a registered email.
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetForm()
                  setShowCreateForm(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="px-5 py-2 rounded-lg bg-primary dark:bg-brushed-gold text-white dark:text-background-dark text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                + Create New Product
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                title="Logout from admin dashboard"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Products List */}
        <section className="bg-white dark:bg-background-dark/80 rounded-xl shadow-lg border border-primary/10 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary dark:text-brushed-gold">
              All Products ({Array.isArray(products) ? products.length : 0})
            </h2>
            <button
              onClick={() => {
                loadProducts().catch(err => {
                  console.error('Error refreshing products:', err)
                  alert('Failed to refresh products. Please try again.')
                })
              }}
              disabled={isLoadingProducts}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 disabled:opacity-50 flex items-center gap-1"
              title="Refresh products list"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Refresh
            </button>
          </div>
          
          {isLoadingProducts ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-brushed-gold mb-4"></div>
              <p className="text-muted-charcoal dark:text-gray-400">Loading products...</p>
            </div>
          ) : !Array.isArray(products) ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">Error: Products data is invalid</p>
              <button
                onClick={() => {
                  setProducts([]) // Reset to empty array
                  loadProducts().catch(err => {
                    console.error('Error reloading products:', err)
                    alert('Failed to reload products. Please refresh the page.')
                  })
                }}
                className="px-4 py-2 rounded-md bg-primary dark:bg-brushed-gold text-white text-sm hover:opacity-90"
              >
                Retry Loading Products
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted-charcoal dark:text-gray-400 text-center py-8">No products available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/10 dark:border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr key={product.id} className="border-b border-primary/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <img 
                            src={product.image} 
                            alt={product.alt} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Link 
                            to={`/products/${product.id}`}
                            className="font-medium text-primary dark:text-brushed-gold hover:underline"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm">{product.category}</td>
                        <td className="py-3 px-4 text-sm font-semibold">
                          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(String(product.price || 0))).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.inStock 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 flex items-center gap-1"
                              title="Edit product"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                              title="Delete product"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <section className="bg-white dark:bg-background-dark/80 rounded-xl shadow-lg border border-primary/10 dark:border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-primary dark:text-brushed-gold">
                  {editingProductId ? 'Edit Product' : 'Create New Product'}
                </h2>
                {editingProductId && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editing Mode
                  </span>
                )}
              </div>
              <button
                onClick={resetForm}
                className="text-sm text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      placeholder="e.g. Handcrafted Oak Photo Frame"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as ProductCategory)}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                    >
                      <option value="Photo Frames">Photo Frames</option>
                      <option value="Idols">Idols</option>
                      <option value="Home Interiors">Home Interiors</option>
                      <option value="Corporate Gifts">Corporate Gifts</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      placeholder="e.g. 1499"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Stock Status</label>
                    <select
                      value={inStock ? 'in' : 'out'}
                      onChange={e => setInStock(e.target.value === 'in')}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                    >
                      <option value="in">In Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Images */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Images</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Main Product Image</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={mainImage}
                        onChange={(e) => setMainImage(e.target.value)}
                        placeholder="Enter image URL or upload a file below"
                        className="w-full rounded-lg border border-primary/20 dark:border-white/20 bg-white dark:bg-background-dark/60 px-4 py-3 text-sm text-muted-charcoal dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all"
                        required
                      />
                      <div>
                        <label className="block text-xs font-medium mb-1 text-muted-charcoal dark:text-gray-400">
                          Or upload image from your device:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageFile}
                          disabled={isLoading}
                          className="block w-full text-sm text-muted-charcoal dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-brushed-gold/10 dark:hover:file:bg-brushed-gold/20 disabled:opacity-50"
                        />
                        <p className="text-xs text-muted-charcoal dark:text-gray-400 mt-1">
                          Upload an image file and it will be automatically saved to the server.
                        </p>
                      </div>
                    </div>
                    {mainImage && (
                      <div className="mt-3">
                        <p className="text-xs mb-1 text-muted-charcoal dark:text-gray-400">Preview:</p>
                        <img
                          src={mainImage}
                          alt="Main product preview"
                          className="max-h-40 rounded-md border border-border-soft dark:border-white/20 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {thumbnailInputs.map((value, idx) => (
                      <div key={idx} className="space-y-1">
                        <label className="block text-xs font-medium">{`Thumbnail ${idx + 1} (optional)`}</label>
                        <input
                          type="text"
                          value={value}
                          onChange={e => handleAddThumbnail(idx, e.target.value)}
                          placeholder="Enter image URL or upload below"
                          className="w-full rounded-md border border-primary/20 dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-xs text-muted-charcoal dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleThumbnailFile(idx, e)}
                          disabled={isLoading}
                          className="block w-full mt-1 text-xs text-muted-charcoal dark:text-gray-200 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-brushed-gold/10 dark:hover:file:bg-brushed-gold/20 disabled:opacity-50"
                        />
                        {value && (
                          <img
                            src={value}
                            alt={`Thumbnail ${idx + 1} preview`}
                            className="mt-1 h-16 w-full object-cover rounded-md border border-border-soft dark:border-white/20"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Descriptions */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Descriptions</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Main Product Description</label>
                    <textarea
                      value={mainDescription}
                      onChange={e => setMainDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      placeholder="One paragraph describing the product."
                      required
                    />
                  </div>
                  {/* Always show at least 2 sub-description slots */}
                  {((subDescriptions && Array.isArray(subDescriptions) && subDescriptions.length >= 2
                    ? subDescriptions
                    : Array.from({ length: 2 }, (_, i) => subDescriptions?.[i] || { title: '', body: '' })
                  )).map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium">{`Sub Section ${idx + 1} Title`}</label>
                        <input
                          type="text"
                          value={sub?.title || ''}
                          onChange={e => handleSubDescriptionChange(idx, 'title', e.target.value)}
                          className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                          placeholder="e.g. Materials & Craftsmanship"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium">{`Sub Section ${idx + 1} Description`}</label>
                        <textarea
                          value={sub?.body || ''}
                          onChange={e => handleSubDescriptionChange(idx, 'body', e.target.value)}
                          rows={2}
                          className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                          placeholder="One short paragraph with details."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Specifications */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Dimensions</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={e => setDimensions(e.target.value)}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      placeholder={`e.g. 8" x 10"`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Material</label>
                    <input
                      type="text"
                      value={material}
                      onChange={e => setMaterial(e.target.value)}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      placeholder="e.g. Solid Oak Wood"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      placeholder="e.g. 1.2 kg"
                    />
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Reviews (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-4 items-start">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Customer Name</label>
                      <input
                        type="text"
                        value={reviewDraft.userName}
                        onChange={e => setReviewDraft(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                        placeholder="e.g. Sarah J."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Rating</label>
                      <select
                        value={reviewDraft.rating}
                        onChange={e => setReviewDraft(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>
                            {r} Stars
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Review Text</label>
                      <textarea
                        value={reviewDraft.comment}
                        onChange={e => setReviewDraft(prev => ({ ...prev, comment: e.target.value }))}
                        rows={3}
                        className="w-full rounded-md border border-border-soft dark:border-white/20 bg-white dark:bg-background-dark/60 px-3 py-2 text-sm"
                        placeholder="Write the customer's review here."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddReview}
                      className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-primary/90"
                    >
                      Add Review
                    </button>
                  </div>

                  <div className="space-y-2">
                    {!reviews || !Array.isArray(reviews) || reviews.length === 0 ? (
                      <p className="text-sm text-muted-charcoal dark:text-gray-400">No reviews added yet.</p>
                    ) : (
                      <ul className="space-y-2 max-h-48 overflow-y-auto border border-border-soft dark:border-white/10 rounded-md p-3">
                        {reviews.map((review, idx) => (
                          <li key={review?.id || idx} className="text-sm border-b border-border-soft dark:border-white/10 pb-2 last:border-b-0">
                            <p className="font-semibold">{review?.userName || 'Anonymous'}</p>
                            <p className="text-xs text-muted-charcoal dark:text-gray-400 mb-1">
                              Rating: {review?.rating || 5} / 5
                            </p>
                            <p>{review?.comment || ''}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-soft dark:border-white/10">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg border border-border-soft dark:border-white/20 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg bg-primary dark:bg-brushed-gold text-white dark:text-background-dark text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">sync</span>
                        {editingProductId ? 'Saving...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">
                          {editingProductId ? 'save' : 'add'}
                        </span>
                        {editingProductId ? 'Save Changes' : 'Create Product'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
