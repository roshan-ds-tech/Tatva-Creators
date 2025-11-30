import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { signup } from './utils/api'
import type { ApiError } from './utils/api'
import { isLoggedIn } from './utils/auth'

function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = isLoggedIn()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
      })
      
      // Navigate to homepage on success
      navigate('/')
    } catch (error) {
      // Handle API errors
      const apiError = error as ApiError
      if (apiError.error) {
        setErrors({ general: apiError.error as string })
      } else if (apiError.email) {
        setErrors({ email: Array.isArray(apiError.email) ? apiError.email[0] : apiError.email })
      } else if (apiError.password) {
        setErrors({ password: Array.isArray(apiError.password) ? apiError.password[0] : apiError.password })
      } else if (apiError.confirm_password) {
        setErrors({ confirmPassword: Array.isArray(apiError.confirm_password) ? apiError.confirm_password[0] : apiError.confirm_password })
      } else {
        setErrors({ general: 'An error occurred. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: 'google' | 'github') => {
    // Simulate social signup
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup would be implemented here`)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="relative flex w-full flex-col group/design-root overflow-x-hidden min-h-screen bg-background-light dark:bg-background-dark">
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
                  <Link to="/cart" className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 transition-colors">
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  </Link>
                  <Link to="/profile" className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 transition-colors">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-transparent text-primary dark:text-primary border-2 border-primary hover:bg-primary/10 dark:border-brushed-gold dark:text-brushed-gold dark:hover:bg-brushed-gold/10 text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                  <span className="truncate">Login</span>
                </Link>
              )}
            </div>
          </div>
          <button className="lg:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-muted-charcoal dark:text-gray-200">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
          <div className="w-full max-w-md">
            {/* Signup Card */}
            <div className="bg-white dark:bg-background-dark/80 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/10 dark:border-white/10 p-8 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-primary dark:text-gray-100 text-3xl md:text-4xl font-serif font-bold mb-2">Create Account</h1>
                <p className="text-muted-charcoal dark:text-gray-400 text-sm">Join us and discover premium decor</p>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.firstName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-white/20'
                      } dark:bg-background-dark/50 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all`}
                      placeholder="Darshan"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.lastName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-white/20'
                      } dark:bg-background-dark/50 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all`}
                      placeholder="DS"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-white/20'
                    } dark:bg-background-dark/50 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.password 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-white/20'
                      } dark:bg-background-dark/50 dark:text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all`}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength <= 2 ? 'text-red-600 dark:text-red-400' :
                          passwordStrength <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                  {!errors.password && (
                    <p className="mt-1 text-xs text-muted-charcoal/70 dark:text-gray-500">Must be at least 8 characters</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-charcoal dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.confirmPassword 
                          ? 'border-red-300 dark:border-red-600' 
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-300 dark:border-green-600'
                          : 'border-gray-300 dark:border-white/20'
                      } dark:bg-background-dark/50 dark:text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brushed-gold focus:border-transparent transition-all`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-charcoal dark:text-gray-400 hover:text-primary dark:hover:text-brushed-gold transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">Passwords match</p>
                  )}
                </div>

                <div className="flex items-start text-sm">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked)
                      if (errors.terms) setErrors({ ...errors, terms: undefined })
                    }}
                    className="h-4 w-4 rounded border-gray-300 dark:border-white/30 text-primary dark:text-brushed-gold focus:ring-primary dark:focus:ring-brushed-gold mt-0.5"
                  />
                  <label className="ml-2 text-muted-charcoal dark:text-gray-400">
                    I agree to the{' '}
                    <Link to="#" className="text-primary dark:text-brushed-gold hover:opacity-80 transition-opacity">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="#" className="text-primary dark:text-brushed-gold hover:opacity-80 transition-opacity">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-600 dark:text-red-400 -mt-3">{errors.terms}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white dark:text-background-dark dark:bg-brushed-gold text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-primary/10 dark:border-white/10">
                <p className="text-center text-sm text-muted-charcoal dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary dark:text-brushed-gold hover:opacity-80 transition-opacity font-semibold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/10 dark:border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-background-dark/80 text-muted-charcoal dark:text-gray-400">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSocialSignup('google')}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-white/20 dark:bg-background-dark/50 px-4 py-3 text-sm font-medium text-muted-charcoal dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-brushed-gold/10 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialSignup('github')}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-white/20 dark:bg-background-dark/50 px-4 py-3 text-sm font-medium text-muted-charcoal dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-brushed-gold/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Signup

