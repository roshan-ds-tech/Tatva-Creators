import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { isLoggedIn } from './utils/auth'
import CartIcon from './components/CartIcon'

function AccountSettings() {
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

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notifications'>('profile')
  
  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: 'Evelyn',
    lastName: 'Reed',
    email: 'evelyn.reed@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    bio: 'Interior design enthusiast and lover of minimalist decor.'
  })

  // Address state
  const [addressData, setAddressData] = useState({
    street: '123 Serenity Lane, Apt 4B',
    city: 'Evergreen',
    state: 'CO',
    zipCode: '80439',
    country: 'United States'
  })

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'USD',
    language: 'English',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    promotionalOffers: false
  })

  if (!loggedIn) {
    navigate('/login')
    return null
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Profile updated successfully!')
  }

  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Address updated successfully!')
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    alert('Password changed successfully!')
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handlePreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Preferences updated successfully!')
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('accessToken')
    navigate('/')
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: 'person' },
    { id: 'security' as const, label: 'Security', icon: 'lock' },
    { id: 'preferences' as const, label: 'Preferences', icon: 'tune' },
    { id: 'notifications' as const, label: 'Notifications', icon: 'notifications' }
  ]

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
          <h1 className="font-display text-4xl font-medium tracking-tight text-muted-charcoal dark:text-gray-300 md:text-5xl">Account Settings</h1>
          <p className="mt-2 text-sm text-muted-charcoal/70 dark:text-gray-400">Manage your account preferences and settings</p>
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
              <Link to="/profile/saved" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-xl">favorite</span>
                <p className="text-sm font-medium">Saved Items</p>
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-3 rounded-lg bg-sage-grey/30 dark:bg-sage-grey/20 px-3 py-2.5 text-primary dark:text-brushed-gold">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
                <p className="text-sm font-bold">Account Settings</p>
              </Link>
            </div>
          </aside>

          {/* Settings Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-8 border-b border-black/10 dark:border-white/10">
              <div className="flex flex-wrap gap-2 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary dark:border-brushed-gold text-primary dark:text-brushed-gold'
                        : 'border-transparent text-muted-charcoal/70 dark:text-gray-400 hover:text-muted-charcoal dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm p-6 md:p-8">
                    <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300 mb-6">Personal Information</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Date of Birth</label>
                          <input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors resize-none"
                        />
                      </div>
                      <div className="pt-4 border-t border-black/5 dark:border-white/5">
                        <button type="submit" className="px-6 py-2.5 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm p-6 md:p-8">
                    <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300 mb-6">Shipping Address</h2>
                    <form onSubmit={handleAddressUpdate} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Street Address</label>
                        <input
                          type="text"
                          value={addressData.street}
                          onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">City</label>
                          <input
                            type="text"
                            value={addressData.city}
                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">State</label>
                          <input
                            type="text"
                            value={addressData.state}
                            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={addressData.zipCode}
                            onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Country</label>
                        <input
                          type="text"
                          value={addressData.country}
                          onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                        />
                      </div>
                      <div className="pt-4 border-t border-black/5 dark:border-white/5">
                        <button type="submit" className="px-6 py-2.5 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm p-6 md:p-8">
                  <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">New Password</label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                      />
                    </div>
                    <div className="pt-4 border-t border-black/5 dark:border-white/5">
                      <button type="submit" className="px-6 py-2.5 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm p-6 md:p-8">
                  <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300 mb-6">Preferences</h2>
                  <form onSubmit={handlePreferencesUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Currency</label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">Language</label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-muted-charcoal dark:text-gray-300 focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-primary dark:focus:border-brushed-gold transition-colors"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-black/5 dark:border-white/5">
                      <button type="submit" className="px-6 py-2.5 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 shadow-sm p-6 md:p-8">
                  <h2 className="font-display text-2xl font-medium text-muted-charcoal dark:text-gray-300 mb-6">Notification Settings</h2>
                  <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                        <div>
                          <h3 className="font-medium text-muted-charcoal dark:text-gray-300">Email Notifications</h3>
                          <p className="text-sm text-muted-charcoal/70 dark:text-gray-400">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.emailNotifications}
                            onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-brushed-gold/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-brushed-gold"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                        <div>
                          <h3 className="font-medium text-muted-charcoal dark:text-gray-300">SMS Notifications</h3>
                          <p className="text-sm text-muted-charcoal/70 dark:text-gray-400">Receive updates via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.smsNotifications}
                            onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-brushed-gold/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-brushed-gold"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                        <div>
                          <h3 className="font-medium text-muted-charcoal dark:text-gray-300">Order Updates</h3>
                          <p className="text-sm text-muted-charcoal/70 dark:text-gray-400">Get notified about order status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.orderUpdates}
                            onChange={(e) => setPreferences({ ...preferences, orderUpdates: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-brushed-gold/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-brushed-gold"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                        <div>
                          <h3 className="font-medium text-muted-charcoal dark:text-gray-300">Marketing Emails</h3>
                          <p className="text-sm text-muted-charcoal/70 dark:text-gray-400">Receive promotional offers and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.marketingEmails}
                            onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-brushed-gold/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-brushed-gold"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h3 className="font-medium text-muted-charcoal dark:text-gray-300">Promotional Offers</h3>
                          <p className="text-sm text-muted-charcoal/70 dark:text-gray-400">Get exclusive deals and discounts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.promotionalOffers}
                            onChange={(e) => setPreferences({ ...preferences, promotionalOffers: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-brushed-gold/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-brushed-gold"></div>
                        </label>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-black/5 dark:border-white/5">
                      <button type="submit" className="px-6 py-2.5 bg-primary dark:bg-brushed-gold text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                        Save Notification Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="mt-8 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-6">
              <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 dark:text-red-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
              >
                Logout
              </button>
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

export default AccountSettings

