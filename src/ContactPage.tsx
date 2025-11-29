import { Link, useLocation } from 'react-router-dom'
import { isLoggedIn } from './utils/auth'

function ContactPage() {
  const location = useLocation()
  const loggedIn = isLoggedIn()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted')
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
  }

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
                      <Link to="/cart" className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 transition-colors">
                        <span className="material-symbols-outlined text-xl">shopping_bag</span>
                      </Link>
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

        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <main className="flex-1">
              <div className="@container px-4 sm:px-0">
                <div className="py-10 md:py-16">
                  <div 
                    className="flex min-h-[450px] md:min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 md:p-12 shadow-lg overflow-hidden relative" 
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("/hero_section.png")`
                    }}
                  >
                    <div className="flex flex-col gap-4 text-center max-w-2xl z-10">
                      <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg">Connect With Us</h1>
                      <h2 className="text-white/95 text-base md:text-lg font-normal leading-relaxed">We're here to help. Reach out with any questions or just to say hello.</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 px-4 md:px-8 py-10 md:py-16">
                <div className="bg-white dark:bg-background-dark/50 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 dark:bg-brushed-gold/20">
                      <span className="material-symbols-outlined text-primary dark:text-brushed-gold text-xl">mail</span>
                    </div>
                    <h2 className="text-primary dark:text-white text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.015em]">Send Us a Message</h2>
                  </div>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">Name</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 dark:text-gray-500 text-xl">person</span>
                        <input 
                          className="w-full h-12 pl-11 pr-4 py-2 border-2 border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-background-dark/50 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-white/30" 
                          id="name" 
                          name="name" 
                          type="text"
                          placeholder="Your name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 dark:text-gray-500 text-xl">email</span>
                        <input 
                          className="w-full h-12 pl-11 pr-4 py-2 border-2 border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-background-dark/50 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-white/30" 
                          id="email" 
                          name="email" 
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="message">Message</label>
                      <div className="relative">
                        <span className="absolute left-3 top-4 material-symbols-outlined text-gray-400 dark:text-gray-500 text-xl">message</span>
                        <textarea 
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-background-dark/50 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-white/30 resize-none" 
                          id="message" 
                          name="message" 
                          rows={5}
                          placeholder="Tell us how we can help..."
                          required
                        ></textarea>
                      </div>
                    </div>
                    <button 
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary dark:bg-brushed-gold text-white dark:text-background-dark text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md" 
                      type="submit"
                    >
                      <span className="truncate flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">send</span>
                        Send Message
                      </span>
                    </button>
                  </form>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 dark:bg-brushed-gold/20">
                      <span className="material-symbols-outlined text-primary dark:text-brushed-gold text-xl">location_on</span>
                    </div>
                    <h2 className="text-primary dark:text-white text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.015em]">Find Us & Get in Touch</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-white/5 dark:to-white/10 border border-gray-200/50 dark:border-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 dark:bg-brushed-gold/20 group-hover:bg-primary/20 dark:group-hover:bg-brushed-gold/30 transition-colors">
                        <span className="material-symbols-outlined text-primary dark:text-brushed-gold text-2xl">support_agent</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-primary dark:text-white mb-1.5">Support Information</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">For quick answers, visit our FAQ page or track your order status online.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-white/5 dark:to-white/10 border border-gray-200/50 dark:border-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 dark:bg-brushed-gold/20 group-hover:bg-primary/20 dark:group-hover:bg-brushed-gold/30 transition-colors">
                        <span className="material-symbols-outlined text-primary dark:text-brushed-gold text-2xl">schedule</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-primary dark:text-white mb-1.5">Opening Hours</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          <span className="block">Monday - Friday: <span className="font-semibold text-primary dark:text-brushed-gold">10am - 6pm</span></span>
                          <span className="block">Saturday: <span className="font-semibold text-primary dark:text-brushed-gold">11am - 4pm</span></span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-white/5 dark:to-white/10 border border-gray-200/50 dark:border-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 dark:bg-brushed-gold/20 group-hover:bg-primary/20 dark:group-hover:bg-brushed-gold/30 transition-colors">
                        <span className="material-symbols-outlined text-primary dark:text-brushed-gold text-2xl">alternate_email</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-primary dark:text-white mb-2">Contact Details</h3>
                        <div className="space-y-2">
                          <a className="flex items-center gap-2 text-sm text-primary dark:text-brushed-gold hover:underline font-medium transition-colors" href="mailto:support@calmframes.com">
                            <span className="material-symbols-outlined text-base">mail</span>
                            support@calmframes.com
                          </a>
                          <a className="flex items-center gap-2 text-sm text-primary dark:text-brushed-gold hover:underline font-medium transition-colors" href="tel:+1234567890">
                            <span className="material-symbols-outlined text-base">phone</span>
                            +1 (234) 567-890
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 md:px-8 py-10 md:py-16">
                <div className="mb-6">
                  <h2 className="text-primary dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">Visit Our Location</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Find us on the map below</p>
                </div>
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover shadow-lg border-2 border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl transition-shadow duration-300" 
                  style={{
                    backgroundImage: `url("/maps.png")`
                  }}
                ></div>
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
      </div>
    </div>
  )
}

export default ContactPage

