import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { isLoggedIn } from './utils/auth'
import CartIcon from './components/CartIcon'

function FAQsPage() {
  const location = useLocation()
  const loggedIn = isLoggedIn()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is TatvaCreators?',
          answer: 'TatvaCreators is a curated collection of handcrafted home decor items, including photo frames, idols, home interiors, and corporate gifts. We focus on sustainable materials, timeless design, and artisanal quality.'
        },
        {
          question: 'Where are your products made?',
          answer: 'Our products are handcrafted by skilled artisans using traditional techniques. We work with local craftspeople who share our commitment to quality and sustainability.'
        },
        {
          question: 'Do you offer custom orders?',
          answer: 'Yes, we offer custom orders for select products. Please contact us through our contact page or email us at support@calmframes.com to discuss your custom requirements.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'What are your shipping options?',
          answer: 'We offer standard shipping and express shipping options. Standard shipping typically takes 5-7 business days, while express shipping takes 2-3 business days. Free shipping is available on orders over ₹100.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we ship within India. We are working on expanding our international shipping options. Please check back soon or contact us for more information.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order is shipped, you will receive a tracking number via email. You can use this tracking number on our website or the courier\'s website to track your package.'
        },
        {
          question: 'What if my order is damaged during shipping?',
          answer: 'We take great care in packaging our products. If your order arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or refund.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy on all products in their original condition. Items must be unused and in their original packaging. Custom orders and personalized items are not eligible for returns.'
        },
        {
          question: 'How do I return an item?',
          answer: 'To initiate a return, please contact our customer service team at support@calmframes.com or through our contact page. We will provide you with a return authorization and instructions.'
        },
        {
          question: 'How long does it take to process a refund?',
          answer: 'Once we receive your returned item and verify its condition, we will process your refund within 5-7 business days. The refund will be credited to your original payment method.'
        }
      ]
    },
    {
      category: 'Products & Care',
      questions: [
        {
          question: 'How do I care for my wooden frames?',
          answer: 'Wooden frames should be kept away from direct sunlight and excessive moisture. Clean with a soft, dry cloth. For deeper cleaning, use a slightly damp cloth and dry immediately. Avoid using harsh chemicals.'
        },
        {
          question: 'Are your products eco-friendly?',
          answer: 'Yes, we are committed to sustainability. Our products are made from responsibly sourced materials, and we use eco-friendly packaging. Many of our products are made from FSC-certified wood.'
        },
        {
          question: 'What sizes are available?',
          answer: 'Our products come in various sizes. Please check the product description for specific dimensions. If you need a custom size, please contact us to discuss your requirements.'
        }
      ]
    },
    {
      category: 'Payment & Orders',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 24 hours of placing it, provided it hasn\'t been shipped yet. Please contact us immediately if you need to make changes.'
        },
        {
          question: 'Do you offer gift wrapping?',
          answer: 'Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout. We also include a personalized message card if requested.'
        }
      ]
    }
  ]

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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

        <main className="flex-1">
          {/* Hero Section */}
          <div 
            className="flex min-h-[350px] md:min-h-[400px] flex-col items-center justify-center gap-6 p-4 text-center relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(245, 241, 233, 0.85) 0%, rgba(245, 241, 233, 0.75) 100%), url("/social2.png")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="flex flex-col gap-4 max-w-2xl z-10 relative">
              <h1 className="text-primary dark:text-gray-100 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] drop-shadow-sm">Frequently Asked Questions</h1>
              <h2 className="text-muted-charcoal dark:text-gray-300 text-base md:text-lg font-normal leading-relaxed">Find answers to common questions about our products, shipping, and services.</h2>
            </div>
          </div>

          {/* FAQs Content */}
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-b from-background-light to-white/50 dark:from-background-dark dark:to-background-dark/80">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-primary/30 dark:bg-brushed-gold/30 rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-gray-100">{category.category}</h2>
                  <div className="flex-1 h-1 bg-primary/10 dark:bg-brushed-gold/10 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = faqs.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + faqIndex
                    const isOpen = openIndex === globalIndex
                    
                    return (
                      <div 
                        key={faqIndex} 
                        className={`bg-gradient-to-r from-white via-[#FDFBF6] to-white dark:from-background-dark/70 dark:via-background-dark/50 dark:to-background-dark/70 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                          isOpen 
                            ? 'border-primary/40 dark:border-brushed-gold/40 shadow-lg shadow-primary/10 dark:shadow-brushed-gold/10' 
                            : 'border-[#E8E0D5] dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-brushed-gold/30'
                        }`}
                      >
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className={`w-full flex items-center justify-between p-5 text-left transition-all duration-300 ${
                            isOpen 
                              ? 'bg-gradient-to-r from-primary/5 via-[#F5F1E9] to-primary/5 dark:from-brushed-gold/10 dark:via-background-dark/30 dark:to-brushed-gold/10' 
                              : 'hover:bg-gradient-to-r hover:from-primary/3 hover:via-[#FDFBF6] hover:to-primary/3 dark:hover:from-brushed-gold/5 dark:hover:via-background-dark/20 dark:hover:to-brushed-gold/5'
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-primary dark:text-gray-100 pr-4">{faq.question}</h3>
                          <span className={`material-symbols-outlined text-primary dark:text-brushed-gold transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 bg-gradient-to-b from-[#FDFBF6] to-white dark:from-background-dark/40 dark:to-background-dark/60">
                            <div className="border-l-4 border-primary/30 dark:border-brushed-gold/30 pl-4">
                              <p className="text-muted-charcoal dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Still Have Questions Section */}
            <div className="mt-16 bg-gradient-to-br from-[#F5F1E9] via-[#FDFBF6] to-[#F5F1E9] dark:from-primary/10 dark:via-background-dark/50 dark:to-primary/10 rounded-xl p-8 md:p-12 text-center border-2 border-primary/20 dark:border-brushed-gold/20 shadow-lg">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-brushed-gold/30 dark:to-brushed-gold/20 mx-auto mb-6 shadow-md">
                <span className="material-symbols-outlined text-primary dark:text-brushed-gold text-5xl">help</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 mb-4">Still Have Questions?</h2>
              <p className="text-muted-charcoal dark:text-gray-400 mb-8 max-w-2xl mx-auto text-base">
                Can't find the answer you're looking for? Our friendly customer service team is here to help.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary dark:bg-brushed-gold text-white dark:text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
                >
                  <span className="truncate flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">mail</span>
                    Contact Us
                  </span>
                </Link>
                <a 
                  href="mailto:support@calmframes.com" 
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white dark:bg-background-dark/70 text-primary dark:text-brushed-gold border-2 border-primary hover:bg-primary/10 dark:border-brushed-gold dark:hover:bg-brushed-gold/10 text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:shadow-md hover:scale-105"
                >
                  <span className="truncate flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">email</span>
                    Email Us
                  </span>
                </a>
              </div>
            </div>
          </div>
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

export default FAQsPage

