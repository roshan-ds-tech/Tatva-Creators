import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCartItemCount } from '../utils/cart'

interface CartIconProps {
  className?: string
}

function CartIcon({ className = '' }: CartIconProps) {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Set initial count
    setCartCount(getCartItemCount())

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartItemCount())
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    // Also listen for storage changes (in case cart is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        setCartCount(getCartItemCount())
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <Link
      to="/cart"
      className={`relative flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 transition-colors ${className}`}
    >
      <span className="material-symbols-outlined text-xl">shopping_bag</span>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary dark:bg-brushed-gold text-white text-xs font-bold">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  )
}

export default CartIcon


