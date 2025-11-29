import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isLoggedIn } from './utils/auth'
import { getUserData, getUserProfile } from './utils/api'
import CartIcon from './components/CartIcon'

interface Order {
  id: string
  date: string
  status: string
  total: string
}

function ProfileDashboard() {
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

  const [userInfo, setUserInfo] = useState<{
    fullName: string
    email: string
    profilePicture?: string
    shippingAddress: {
      street: string
      city: string
      country: string
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
      return
    }

    // Load user data from localStorage
    const loadUserData = async () => {
      try {
        const storedUserData = getUserData()
        
        if (storedUserData) {
          // Try to fetch complete profile from API, fallback to localStorage data
          try {
            const profileData = await getUserProfile()
            setUserInfo({
              fullName: `${profileData.first_name} ${profileData.last_name}`,
              email: profileData.email,
              shippingAddress: {
                street: 'Address not set',
                city: 'City not set',
                country: 'Country not set'
              }
            })
          } catch (error) {
            // If API call fails, use localStorage data
            setUserInfo({
              fullName: storedUserData.fullName,
              email: storedUserData.email,
              shippingAddress: {
                street: 'Address not set',
                city: 'City not set',
                country: 'Country not set'
              }
            })
          }
        } else {
          // No user data found, redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [loggedIn, navigate])

  // Redirect if not logged in
  if (!loggedIn) {
    return null
  }

  // Show loading state
  if (isLoading || !userInfo) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-primary dark:text-brushed-gold">
          <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
        </div>
        <p className="mt-4 text-muted-charcoal dark:text-gray-400">Loading profile...</p>
      </div>
    )
  }

  const orders: Order[] = [
    {
      id: '#CF-10452',
      date: 'Oct 12, 2023',
      status: 'Shipped',
      total: '$189.00'
    },
    {
      id: '#CF-10449',
      date: 'Sep 28, 2023',
      status: 'Delivered',
      total: '$75.50'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('accessToken')
    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
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

      {/* Main Content */}
      <main className="container mx-auto flex flex-1 flex-col px-4 py-10 md:py-16">
        {/* PageHeading */}
        <div className="mb-10 w-full md:mb-12">
          <h1 className="font-display text-4xl font-medium tracking-tight text-muted-charcoal dark:text-gray-300 md:text-5xl">My Account</h1>
        </div>

        <div className="flex flex-1 flex-col gap-12 md:flex-row md:gap-16">
          {/* SideNavBar */}
          <aside className="w-full md:w-64">
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="flex items-center gap-3 rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 px-3 py-2.5 text-primary dark:text-brushed-gold">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                <p className="text-sm font-bold">My Profile</p>
              </Link>
              <Link to="/profile/orders" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                <p className="text-sm font-medium">Order History</p>
              </Link>
              <Link to="/profile/saved" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">favorite</span>
                <p className="text-sm font-medium">Saved Items</p>
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">tune</span>
                <p className="text-sm font-medium">Account Settings</p>
              </Link>
              <button onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 text-left w-full">
                <span className="material-symbols-outlined text-xl">logout</span>
                <p className="text-sm font-medium">Logout</p>
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <div className="flex flex-col gap-10">
              {/* Personal Information Card */}
              <div className="rounded-lg border border-black/10 dark:border-white/10 bg-sage-grey/30 dark:bg-sage-grey/20 p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300">Personal Information</h2>
                  <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 bg-primary dark:bg-brushed-gold text-white gap-2 px-4 text-sm font-bold tracking-wide hover:opacity-90">
                    Edit
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-t-black/10 dark:border-t-white/10 pt-6 sm:grid-cols-[150px_1fr]">
                  <p className="text-sm text-muted-charcoal/80 dark:text-gray-400">Full Name</p>
                  <p className="text-sm font-medium text-muted-charcoal dark:text-gray-300">{userInfo.fullName}</p>
                  <p className="text-sm text-muted-charcoal/80 dark:text-gray-400">Email Address</p>
                  <p className="text-sm font-medium text-muted-charcoal dark:text-gray-300">{userInfo.email}</p>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="rounded-lg border border-black/10 dark:border-white/10 bg-sage-grey/30 dark:bg-sage-grey/20 p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300">Shipping Address</h2>
                  <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 bg-primary dark:bg-brushed-gold text-white gap-2 px-4 text-sm font-bold tracking-wide hover:opacity-90">
                    Edit
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-t-black/10 dark:border-t-white/10 pt-6 sm:grid-cols-[150px_1fr]">
                  <p className="text-sm text-muted-charcoal/80 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-muted-charcoal dark:text-gray-300">
                    {userInfo.shippingAddress.street}<br/>
                    {userInfo.shippingAddress.city}<br/>
                    {userInfo.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Order History Card */}
              <div className="rounded-lg border border-black/10 dark:border-white/10 bg-sage-grey/30 dark:bg-sage-grey/20 p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300">Recent Orders</h2>
                  <Link to="/profile/orders" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 border border-muted-charcoal/50 dark:border-gray-600 text-muted-charcoal dark:text-gray-300 gap-2 px-4 text-sm font-bold tracking-wide hover:bg-black/5 dark:hover:bg-white/5">
                    View All
                  </Link>
                </div>
                <div className="mt-6 flow-root border-t border-t-black/10 dark:border-t-white/10 pt-6">
                  <div className="-mx-6 -my-4 overflow-x-auto sm:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-black/10 dark:divide-white/10">
                        <thead>
                          <tr>
                            <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-muted-charcoal dark:text-gray-300 sm:pl-0" scope="col">Order ID</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-muted-charcoal dark:text-gray-300" scope="col">Date</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-muted-charcoal dark:text-gray-300" scope="col">Status</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-muted-charcoal dark:text-gray-300" scope="col">Total</th>
                            <th className="relative py-3.5 pl-3 pr-6 sm:pr-0" scope="col"><span className="sr-only">View</span></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-muted-charcoal dark:text-gray-300 sm:pl-0">{order.id}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-charcoal/80 dark:text-gray-400">{order.date}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-charcoal/80 dark:text-gray-400">{order.status}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-charcoal/80 dark:text-gray-400">{order.total}</td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                                <Link to={`/profile/orders/${order.id}`} className="text-primary hover:text-primary/80 dark:text-brushed-gold dark:hover:text-brushed-gold/80">
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default ProfileDashboard

