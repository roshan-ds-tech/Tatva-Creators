import { Link, useLocation } from 'react-router-dom'

import { isLoggedIn } from './utils/auth'

function BlogPage() {
  const location = useLocation()
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Elevate Your Interiors with Brass Ashtalakshmi Wall Frames',
        text: 'A Perfect Blend of Tradition & Luxury',
        url: window.location.href,
      }).catch(console.error)
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
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
          <article className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16">
            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-primary dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
                Elevate Your Interiors with Brass Ashtalakshmi Wall Frames: A Perfect Blend of Tradition & Luxury
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>May 5, 2025</span>
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold hover:bg-primary/20 dark:hover:bg-brushed-gold/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/blog.webp" 
                alt="Brass Ashtalakshmi Wall Frames" 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                In the world of luxury interior décor, where elegance meets spiritual charm, brass Ashtalakshmi wall frames are making a distinctive mark. Whether you're designing a modern villa, a heritage-inspired apartment, or a culturally rich living room, these art pieces infuse spaces with grace, abundance, and divine presence.
              </p>

              <div className="my-8 p-6 bg-primary/5 dark:bg-primary/10 rounded-xl border-l-4 border-primary dark:border-brushed-gold">
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-3xl">✨</span>
                  What Are Ashtalakshmi Wall Frames?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The Ashtalakshmi refers to the eight manifestations of Goddess Lakshmi, each representing a unique form of wealth — from prosperity and courage to wisdom and victory. These depictions are intricately engraved in handcrafted brass and often arranged in a square or collage layout, as seen in many premium homes today.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Each frame is more than décor — it is a symbol of blessing and abundance, revered in Indian traditions for centuries.
                </p>
              </div>

              <div className="my-8">
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">🏡</span>
                  Why They're Perfect for Premium Interiors
                </h2>
                
                <div className="space-y-6">
                  <div className="p-5 bg-white dark:bg-background-dark/50 rounded-lg border border-gray-200 dark:border-white/10 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-2">1. Rich Cultural Appeal</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Incorporating brass Ashtalakshmi frames into your walls connects your home with Indian heritage and spirituality, ideal for those who appreciate timeless traditions in modern settings.
                    </p>
                  </div>

                  <div className="p-5 bg-white dark:bg-background-dark/50 rounded-lg border border-gray-200 dark:border-white/10 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-2">2. Luxury Meets Handcraftsmanship</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      The golden tones of polished brass paired with colorful backdrops (like deep green, crimson red, saffron, and rustic orange) bring depth and richness, elevating any space. These frames often feature intricate floral carvings and traditional motifs that reflect skilled Indian artisanship.
                    </p>
                  </div>

                  <div className="p-5 bg-white dark:bg-background-dark/50 rounded-lg border border-gray-200 dark:border-white/10 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-2">3. Statement Wall Decor</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      As featured in premium living rooms, the frames form a commanding centerpiece — perfect for high-ceiling walls, accent walls in lounges, or meditation rooms. When enhanced with soft wall lighting, their aura transforms the entire space into a serene sanctuary.
                    </p>
                  </div>

                  <div className="p-5 bg-white dark:bg-background-dark/50 rounded-lg border border-gray-200 dark:border-white/10 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-2">4. Vastu and Feng Shui Benefits</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Not just aesthetic, these sacred images are believed to bring positivity, harmony, and fortune to your home. Placing Ashtalakshmi art in the northeast or east direction is considered highly auspicious as per Vastu Shastra.
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-8">
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">🛋</span>
                  How to Style Brass Ashtalakshmi Frames in Your Home
                </h2>
                
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-primary dark:text-brushed-gold font-bold mt-1">•</span>
                    <div>
                      <strong className="text-primary dark:text-white">Living Rooms:</strong> Create a divine gallery wall above seating areas to instantly catch the eye of guests and family.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary dark:text-brushed-gold font-bold mt-1">•</span>
                    <div>
                      <strong className="text-primary dark:text-white">Entryways:</strong> Make a spiritual first impression with these sacred frames welcoming visitors.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary dark:text-brushed-gold font-bold mt-1">•</span>
                    <div>
                      <strong className="text-primary dark:text-white">Prayer Rooms or Mandirs:</strong> Enhance the devotional ambiance with traditional lighting and incense holders.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary dark:text-brushed-gold font-bold mt-1">•</span>
                    <div>
                      <strong className="text-primary dark:text-white">Corporate Gifting or Housewarming Gifts:</strong> These make elegant, thoughtful gifts for spiritual and culturally appreciative individuals.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="my-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-brushed-gold/20 dark:to-brushed-gold/10 rounded-xl border border-primary/20 dark:border-brushed-gold/20">
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-3xl">🛒</span>
                  Where to Find Them
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  High-quality, handcrafted brass Ashtalakshmi wall frames are now available on premium handicraft websites and select curated stores like <strong className="text-primary dark:text-brushed-gold">Tatva Creators</strong>. These pieces are not just décor; they're heirlooms that narrate a story of culture, prosperity, and artistry.
                </p>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Enjoyed this article?</p>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary dark:bg-brushed-gold text-white dark:text-background-dark hover:opacity-90 transition-opacity font-semibold"
                >
                  <span className="material-symbols-outlined">share</span>
                  Share this Article
                </button>
              </div>
            </div>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-background-light dark:bg-background-dark border-t border-primary/20 pt-16 pb-8 px-4 sm:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold text-primary dark:text-gray-100">TatvaCreators</h3>
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
            <p>© 2024 TatvaCreators. All Rights Reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default BlogPage

