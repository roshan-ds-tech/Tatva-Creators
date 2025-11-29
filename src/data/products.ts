export type ProductCategory = 'Photo Frames' | 'Idols' | 'Home Interiors' | 'Corporate Gifts'

export interface Review {
  id: number
  userName: string
  rating: number
  date: string
  comment: string
}

export interface ProductBase {
  id: number
  name: string
  price: number
  category: ProductCategory
  image: string
  alt: string
  rating: number
}

export interface ProductDetailInfo extends ProductBase {
  description?: string
  mainDescription?: string
  subDescriptions?: { title: string; body: string }[]
  dimensions?: string
  material?: string
  weight?: string
  inStock?: boolean
  thumbnails?: string[]
  reviews?: Review[]
}

// Static products removed - only admin-created products are used now

const ADMIN_PRODUCTS_KEY = 'adminProducts'

/**
 * Check if localStorage has enough space
 */
function checkLocalStorageQuota(): { canSave: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { canSave: false, error: 'Window is not available' }
  }

  try {
    // Try to set a test item to check quota
    const testKey = '__quota_test__'
    const testValue = 'test'
    window.localStorage.setItem(testKey, testValue)
    window.localStorage.removeItem(testKey)
    return { canSave: true }
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
      return { canSave: false, error: 'LocalStorage quota exceeded' }
    }
    return { canSave: false, error: e.message || 'Unknown error' }
  }
}

/**
 * Try to free up space by removing old products
 */
function cleanupOldProducts(keepCount: number = 10): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const existing = getAdminProducts()
    if (existing.length <= keepCount) return false
    
    // Keep the most recent products (assuming higher IDs are newer)
    const sorted = [...existing].sort((a, b) => b.id - a.id)
    const toKeep = sorted.slice(0, keepCount)
    
    window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(toKeep))
    return true
  } catch {
    return false
  }
}

export function getAdminProducts(): ProductDetailInfo[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ADMIN_PRODUCTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveAdminProduct(product: Omit<ProductDetailInfo, 'id' | 'rating'> & { rating?: number }) {
  if (typeof window === 'undefined') return
  
  const existing = getAdminProducts()
  // Start IDs from 1 if no products exist
  const nextId = existing.length ? Math.max(...existing.map(p => p.id)) + 1 : 1
  const newProduct: ProductDetailInfo = {
    ...product,
    id: nextId,
    rating: product.rating ?? 5,
  }
  const updated = [...existing, newProduct]
  
  // Check quota before saving
  const quotaCheck = checkLocalStorageQuota()
  if (!quotaCheck.canSave) {
    // Try to clean up old products
    const cleaned = cleanupOldProducts(10)
    if (cleaned) {
      // Retry after cleanup
      const retryCheck = checkLocalStorageQuota()
      if (!retryCheck.canSave) {
        throw new Error(
          'LocalStorage quota exceeded. Please use the backend API to store products, ' +
          'or clear your browser\'s localStorage to free up space. ' +
          'You can clear it by opening browser console and running: localStorage.clear()'
        )
      }
    } else {
      throw new Error(
        'LocalStorage quota exceeded and unable to free up space. ' +
        'Please use the backend API to store products, or clear your browser\'s localStorage.'
      )
    }
  }
  
  try {
    window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(updated))
    return newProduct
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
      // Try cleanup one more time
      const cleaned = cleanupOldProducts(5)
      if (cleaned) {
        try {
          window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(updated))
          return newProduct
        } catch (retryError) {
          throw new Error(
            'LocalStorage quota exceeded. Please use the backend API to store products, ' +
            'or clear your browser\'s localStorage to free up space.'
          )
        }
      }
      throw new Error(
        'LocalStorage quota exceeded. Please use the backend API to store products, ' +
        'or clear your browser\'s localStorage to free up space.'
      )
    }
    throw e
  }
}

export function getAllProducts(): ProductDetailInfo[] {
  // Only return admin-created products (static products removed)
  return getAdminProducts()
}

export function findProductById(id: number): ProductDetailInfo | undefined {
  return getAllProducts().find(p => p.id === id)
}

/**
 * Update an admin-created product
 */
export function updateAdminProduct(id: number, updates: Partial<ProductDetailInfo>): ProductDetailInfo | null {
  if (typeof window === 'undefined') return null
  
  const existing = getAdminProducts()
  const productIndex = existing.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    return null // Product not found
  }
  
  const updatedProduct: ProductDetailInfo = {
    ...existing[productIndex],
    ...updates,
    id, // Ensure ID doesn't change
  }
  
  const updated = [...existing]
  updated[productIndex] = updatedProduct
  window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(updated))
  
  return updatedProduct
}

/**
 * Delete an admin-created product
 */
export function deleteAdminProduct(id: number): boolean {
  if (typeof window === 'undefined') return false
  
  const existing = getAdminProducts()
  const filtered = existing.filter(p => p.id !== id)
  
  if (filtered.length === existing.length) {
    return false // Product not found
  }
  
  try {
    window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(filtered))
    return true
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
      throw new Error('LocalStorage quota exceeded. Unable to delete product.')
    }
    throw e
  }
}

/**
 * Clear all admin products from localStorage
 */
export function clearAllAdminProducts(): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.removeItem(ADMIN_PRODUCTS_KEY)
    return true
  } catch {
    return false
  }
}

/**
 * Get estimated localStorage usage for adminProducts
 */
export function getAdminProductsStorageSize(): { size: number; count: number } {
  if (typeof window === 'undefined') return { size: 0, count: 0 }
  
  try {
    const raw = window.localStorage.getItem(ADMIN_PRODUCTS_KEY)
    if (!raw) return { size: 0, count: 0 }
    
    const size = new Blob([raw]).size // Size in bytes
    const products = getAdminProducts()
    return { size, count: products.length }
  } catch {
    return { size: 0, count: 0 }
  }
}


