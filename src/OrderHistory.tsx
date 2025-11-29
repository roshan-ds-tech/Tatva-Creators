import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn } from './utils/auth'
import CartIcon from './components/CartIcon'

interface OrderItem {
  id: number
  name: string
  image: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  total: number
  items: OrderItem[]
  trackingNumber?: string
}

function OrderHistory() {
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

  if (!loggedIn) {
    navigate('/login')
    return null
  }

  const orders: Order[] = [
    {
      id: '#CF-10452',
      date: 'Oct 12, 2023',
      status: 'Delivered',
      total: 189.00,
      trackingNumber: 'TRK123456789',
      items: [
        { id: 1, name: 'Handcrafted Oak Frame', image: '/best_seller1.png', quantity: 1, price: 85.00 },
        { id: 3, name: 'Artisan Ceramic Vase', image: '/best_seller2.png', quantity: 2, price: 65.00 }
      ]
    },
    {
      id: '#CF-10449',
      date: 'Sep 28, 2023',
      status: 'Delivered',
      total: 75.50,
      trackingNumber: 'TRK987654321',
      items: [
        { id: 4, name: 'Golden Abstract Print', image: '/best_seller3.png', quantity: 1, price: 75.50 }
      ]
    },
    {
      id: '#CF-10445',
      date: 'Sep 15, 2023',
      status: 'Shipped',
      total: 220.00,
      trackingNumber: 'TRK456789123',
      items: [
        { id: 6, name: 'Brass Floating Frame', image: '/best_seller4.png', quantity: 2, price: 110.00 }
      ]
    },
    {
      id: '#CF-10440',
      date: 'Aug 30, 2023',
      status: 'Processing',
      total: 145.00,
      items: [
        { id: 2, name: 'Modern Walnut Frame', image: '/best_seller1.png', quantity: 1, price: 110.00 },
        { id: 5, name: 'Smoked Glass Idols', image: '/best_seller2.png', quantity: 1, price: 35.00 }
      ]
    }
  ]

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const handleReorder = (orderId: string) => {
    alert(`Reordering items from ${orderId}`)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
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
        <div className="mb-10 w-full md:mb-12">
          <h1 className="font-display text-4xl font-medium tracking-tight text-muted-charcoal dark:text-gray-300 md:text-5xl">Order History</h1>
          <p className="mt-2 text-sm text-muted-charcoal/70 dark:text-gray-400">Track and manage all your orders in one place</p>
        </div>

        <div className="flex flex-1 flex-col gap-12 md:flex-row md:gap-16">
          {/* SideNavBar */}
          <aside className="w-full md:w-64">
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">person</span>
                <p className="text-sm font-medium">My Profile</p>
              </Link>
              <Link to="/profile/orders" className="flex items-center gap-3 rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 px-3 py-2.5 text-primary dark:text-brushed-gold">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                <p className="text-sm font-bold">Order History</p>
              </Link>
              <Link to="/profile/saved" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">favorite</span>
                <p className="text-sm font-medium">Saved Items</p>
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">tune</span>
                <p className="text-sm font-medium">Account Settings</p>
              </Link>
            </div>
          </aside>

          {/* Orders List */}
          <div className="flex-1">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">receipt_long</span>
                <h3 className="text-xl font-semibold text-muted-charcoal dark:text-gray-300 mb-2">No orders yet</h3>
                <p className="text-sm text-muted-charcoal/70 dark:text-gray-400 mb-6">Start shopping to see your order history</p>
                <Link to="/products" className="px-6 py-2 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    {/* Order Header */}
                    <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 bg-sage-grey/20 dark:bg-sage-grey/10 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-muted-charcoal dark:text-gray-300">{order.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-sm text-muted-charcoal/70 dark:text-gray-400">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.trackingNumber && (
                          <div className="text-sm">
                            <span className="text-muted-charcoal/70 dark:text-gray-400">Tracking: </span>
                            <span className="font-medium text-primary dark:text-brushed-gold">{order.trackingNumber}</span>
                          </div>
                        )}
                        <span className="text-lg font-bold text-primary dark:text-brushed-gold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4">
                      <div className="flex flex-col gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-muted-charcoal dark:text-gray-300 truncate">{item.name}</h4>
                              <p className="text-sm text-muted-charcoal/70 dark:text-gray-400">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-muted-charcoal dark:text-gray-300">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-3">
                        <Link 
                          to={`/profile/orders/${order.id}`}
                          className="px-4 py-2 border border-primary/30 dark:border-brushed-gold/30 text-primary dark:text-brushed-gold rounded-lg hover:bg-primary/5 dark:hover:bg-brushed-gold/5 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {order.status === 'Delivered' && (
                          <button 
                            onClick={() => handleReorder(order.id)}
                            className="px-4 py-2 border border-primary/30 dark:border-brushed-gold/30 text-primary dark:text-brushed-gold rounded-lg hover:bg-primary/5 dark:hover:bg-brushed-gold/5 transition-colors text-sm font-medium"
                          >
                            Reorder
                          </button>
                        )}
                        {order.status === 'Shipped' && order.trackingNumber && (
                          <button className="px-4 py-2 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                            Track Package
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
            <a href="#" className="hover:text-primary dark:hover:text-brushed-gold">Terms of Service</a>
            <a href="#" className="hover:text-primary dark:hover:text-brushed-gold">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default OrderHistory

