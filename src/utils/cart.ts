export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  alt: string
  quantity: number
}

/**
 * Get all cart items from localStorage
 */
export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  
  const cartItems = localStorage.getItem('cartItems')
  if (!cartItems) return []
  
  try {
    return JSON.parse(cartItems)
  } catch (e) {
    console.error('Error parsing cart items:', e)
    return []
  }
}

/**
 * Get total number of items in cart (sum of quantities)
 */
export const getCartItemCount = (): number => {
  const items = getCartItems()
  return items.reduce((total, item) => total + item.quantity, 0)
}

/**
 * Add item to cart
 */
export const addToCart = (
  productId: number,
  name: string,
  price: number,
  image: string,
  alt: string,
  quantity: number = 1
): CartItem[] => {
  const existingCart = getCartItems()
  
  const existingItem = existingCart.find((item) => item.id === productId)
  
  let updatedCart: CartItem[]
  
  if (existingItem) {
    updatedCart = existingCart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
    )
  } else {
    updatedCart = [
      ...existingCart,
      {
        id: productId,
        name,
        price,
        image,
        alt,
        quantity: quantity
      }
    ]
  }
  
  localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  
  // Dispatch custom event to notify cart icon to update
  window.dispatchEvent(new CustomEvent('cartUpdated'))
  
  return updatedCart
}

/**
 * Remove item from cart
 */
export const removeFromCart = (productId: number): CartItem[] => {
  const existingCart = getCartItems()
  const updatedCart = existingCart.filter((item) => item.id !== productId)
  
  localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  window.dispatchEvent(new CustomEvent('cartUpdated'))
  
  return updatedCart
}

/**
 * Update item quantity in cart
 */
export const updateCartQuantity = (productId: number, quantity: number): CartItem[] => {
  if (quantity < 1) {
    return removeFromCart(productId)
  }
  
  const existingCart = getCartItems()
  const updatedCart = existingCart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  )
  
  localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  window.dispatchEvent(new CustomEvent('cartUpdated'))
  
  return updatedCart
}

/**
 * Clear entire cart
 */
export const clearCart = (): void => {
  localStorage.removeItem('cartItems')
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

