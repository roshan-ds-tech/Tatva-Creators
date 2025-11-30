import { Link, useLocation } from 'react-router-dom'
import { isLoggedIn } from './utils/auth'

function AboutUs() {
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

        <main className="flex-grow bg-background-light dark:bg-background-dark">
          {/* HeroSection */}
          <section className="w-full">
            <div 
              className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-4 text-center sm:min-h-[75vh]"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9zCk1o88dav5hgdU9Zqpt9LtXLVEJWxikzk8weelOhzSx_NPUv-ijZq7J4PqXIqJXhN3FMI1ybM_yNprXQqTausbnqq39e_PGpxl34g8Ekcn94nsYo-xPR8GmPAPGvrHhaiA6EQBs73pcAL-3WxrWr3mMt35u3NtpuREZnwygPbSLeeg3fK9QoQMvlEcy5fANfJL4UHGB1RxrXx0YGQzK_rCjsooL-M3s9UbOKwA9e8TtPUEvqzJ12qe2W4jL15jL9rpXDSvVtpU")`
              }}
            >
              <div className="flex flex-col gap-4">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl font-serif">Handcrafted for a Life of Intention</h1>
                <h2 className="text-white text-base font-normal leading-normal md:text-lg max-w-2xl mx-auto">Discover timeless pieces designed to bring harmony and natural beauty into your home.</h2>
              </div>
            </div>
          </section>

          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 sm:space-y-32 bg-background-light dark:bg-background-dark">
            {/* Our Philosophy Section */}
            <section className="text-center">
              <h4 className="text-primary dark:text-primary/90 text-sm font-bold uppercase leading-normal tracking-widest">Our Philosophy</h4>
              <p className="text-muted-charcoal dark:text-gray-300 text-lg md:text-xl font-normal leading-relaxed pt-3 max-w-3xl mx-auto">
                We believe in intentional living and timeless design. Our creations are inspired by the Japanese appreciation for natural beauty and the Scandinavian value of cherished moments, designed to be a quiet, elegant presence in your space.
              </p>
            </section>

            {/* Craftsmanship Section */}
            <section>
              <div className="flex flex-col gap-10">
                <div className="text-center">
                  <h1 className="text-primary dark:text-gray-100 tracking-tight text-3xl font-serif font-bold leading-tight md:text-4xl">The Art of Craftsmanship</h1>
                  <p className="text-muted-charcoal dark:text-gray-400 text-base font-normal leading-normal max-w-3xl mx-auto mt-4">
                    Every piece is a testament to meticulous detail and traditional techniques. We honor the character of the wood, celebrate its imperfections, and craft each item with a passion for lasting quality.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="flex flex-col gap-3">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQJyjt8utPwuroqA7fiNpPpYSiI705jNrJZhvR88-f4QwajwBdmOjSxvJVU51XrjkSr8FA18lfjooWJtit1Rub4QA6iqyx59AmQDyip8e0akDD4Un5W_zP-YlKrameiSxViXuSyNG2aBrygke8mm_6xRqt8jNi3WM-fF9JC8EF1F9ToabW9HrEtw3vp6bKTeAXRki5W7ZPV31q4qRlmFjtd1DZDd6iEsbWXF6uUay1VX_aSQz6QliwcMpadf4R1VEQSJTCNdKnNuA")`
                      }}
                    ></div>
                    <div>
                      <p className="text-primary dark:text-gray-100 text-base font-medium leading-normal">Sustainably Sourced Wood</p>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm font-normal leading-normal">We carefully select premium, eco-conscious timber for its unique grain and enduring strength.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4neXk8q2WCSScTt48He4yUzXf9bMra6m87I1-sNlmuJy3G7CuIBJ2f0se1PoDnriqDT8V2JgBq7y8MR--G68LtMVnvyZk2uzISGtFKg2Xy9bnUI2MJlp6z1l8g4toq2p0X0VW5ZtAxe4H56w34YTxENKL62DYkEZcRLwglsAfD_W3U8RYZHZIRmSLb-cKcocGfa5uO-KGKM2toiGQWjOWKYzaCA9WDUBLukgc9e_z_CGn86vUATvi8GlCsBy0HUa4y8yfn8uPH9I")`
                      }}
                    ></div>
                    <div>
                      <p className="text-primary dark:text-gray-100 text-base font-medium leading-normal">Hand-Finished Details</p>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm font-normal leading-normal">Each frame is sanded, joined, and finished by the skilled hands of our dedicated artisans.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsohJ9jEOKtHjMkKKm06HXVbeyog5RtEuAtPilX1xnM6vL3gO-23n3S4vNoutw86GQRiUDYrwrOzRV2rkp1pmIdU1uYNMmZPFRMKrmPEpATFLeZ2LRQ4i1IygvuIo1araXGzxiPQVB41ckx1NBYmlRz0vp-0wS37ec6oCLWDhR7iJA0umzHe5ha52pEeGckU11cXki15wn5adCfBUHiOI-cHvdpIoBwIcgFT5ox2JtAlQo2a805GyY3ruc9TO7q35WbiCmBp-_QSw")`
                      }}
                    ></div>
                    <div>
                      <p className="text-primary dark:text-gray-100 text-base font-medium leading-normal">Timeless Design</p>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm font-normal leading-normal">Our minimalist aesthetic ensures each piece complements your home for years to come.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Workshop Gallery */}
            <section>
              <div className="text-center mb-10">
                <h1 className="text-primary dark:text-gray-100 tracking-tight text-3xl font-serif font-bold leading-tight md:text-4xl">From Our Workshop</h1>
                <p className="text-muted-charcoal dark:text-gray-400 text-base font-normal leading-normal max-w-3xl mx-auto mt-4">
                  A glimpse into the space where passion, precision, and natural materials come together.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="grid gap-4">
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="A bright, airy workshop with tools neatly organized on a wall."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOyMCTDxXknIlsjU-a206wkPIMpuvv-r9EI6Sy3Ez0NwYQYuvpLp5hO3MrYpE6jKrFQRwpFf22IODsuQlp5AhSQK2d9UZXKR5nbyKTCQr6PjxW_pCmymwp99KPiNrMmWF1CWy-V0fOSe43OoQCF9bW39iBmhvKDOeiwjMpAPsZzbDm2dlQnYt9Wuj0ypg6UvHk0E8MRsXdcMNDWnFcutgJlLuyAPUXMQd3WrDvS0hxRzT2YViuizX6_iZK7jSFv3GhoSPXEjBhazI"
                    />
                  </div>
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="Close-up of wood shavings on a workbench."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Owz0wKswSXKIUZigZCkmJEfAL1DZGEOGd5C3ox3jsNxFYMpOCKKXHgonq6rt6qf2fpyKFVAVQB-15PWdottNwpig_FSWwiavMGXI0L2nmnbc1wTd2C3Rc_7BbQKBnxK5YPpQTdFtbZFULA4nry0YwRrDb02PZT8pBLL9-0Cf1wpWwwmSVZrQPRY-1l6PXB6xZXa4Zdnal_9XzeIXVk3ocbL1wQfRHo9elbiygpmBX-uXQgQsaSjJv-BvkZdxW9ia7Jmzhb0cU4w"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="An artisan measures a piece of wood with precision."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8f_esjltJrwMAwyrGE2Z_NVVZDMCHdF8ohI7Q0DkGmD6D0bNFCe7GL9btqLp9b2wiqdjadwwYHRrfxNYy5tfSI703FhfLf45EdM1mvIN_HNgHX7Ry547DM7SA18LNnw02V4yNRiQ0Ht47E-bpXE6XxSjVAf5PfkHf8MK6SN9AH6IsTQTbDeESy_U2CiN2SCMZpTcjtlt6TM1n6B7SnC2MDoHFFm1L99IW3C4yEsjJa9Z-2s3mZwE6J2YhI3_WOunnk5EIJg8nyPU"
                    />
                  </div>
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="A collection of finished frames stacked against a wall."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcEVBb8Um4troXfdpOqUsqlRObGuW1H5THTxXMJ_ificpQfQUjyv7i6gRvXIyvjTA6AT_axeq2G_lcKLNyy54qVfgrFa9hGtntgejyLiSo2JuYxQBWbgmssiYRMs8lVC_N7DP-9Aw4Y_gR2ym4WeFp85tZcl09UCPWiUUzEuK4a1FlSO1TRJmvS0PxBLEG7-mDfdum1P8Ry0QGtTw0GmzbrIkXjyNQlRMyPSDzWMrcUmnBGXoXgaBe6gvBGd3Wa4_P0OftyoPwPpk"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="Sunlight streaming through a workshop window onto a piece of wood."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt3LUvJ2aOzvVTBPsb6Pv3f7KNHqmpT2LpR4b4bRkwSWw3UQEnFZebktG4Hxyzzbv7FKtd76KH84dNJKvYtswew2Lxnpspbc_qYTVQZSWxI2YtXJcxqcuMgWt_gxGbKI6dHKWsFRXT5T-MiOinvqGAGx81FHqiR_80_XQdQD311vOd2bgCRxGrqOs_4D3DurODj5q9skRUK9MYmaxQtHluGTlrET9P1Ppj-bEy1DCg-BqIIIOiZ4E93D1QNmnr7MgTIVAYuxiicOY"
                    />
                  </div>
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="A craftsman applying a natural oil finish to a frame."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsR8Iv_aCEf7BSZ3-DoNpndxFddXEzO_odmg-6QjfpbdGKChrVFp84ixDl67o7b6JLJNpNSF2mQkl2WUnAKj7-kL0iO2f7l5Qr1fZf7eGx26McfcaiFqweqSdl3joPt5o1WOQlXiSr2RyzzLEvPTqzoYA0BbvfOl_ZSTaakWxoFWj6Fh9Sm0QKeDplFEEdfYVJ0rC8aIMG_x5TEOXXdr0aOLO5gRV5U5WbPViw0AT2s6-e1uC4sJGjwqRfbWgteSrBLBhEIGNcKjk"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="Various hand tools hanging in an orderly fashion."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuChxLrq6_7SG2hJ-OahtZqSO8MJrDCS8CMpMXmleGrNh0Z4pC3efk9R1GJ-CyGARHBso1I-P3iZk3FN4l4sruP7T5mx92HNepPvxtGlFE1fotipGEGNxMcJ4UfGhMurcS2tzMaCh8FGnkzttAClIYCIAnG_km4pRQ0p9lCTgISKxkeczUNvY8LUwGpxuN3RwZVEDTYi03F7mgaKnC8cW2BWHEE5UgrVq-uxlgUZPq6zqtpSP1yl_JhHx8FGcSwtDXQoG1uuUPCT8zg"
                    />
                  </div>
                  <div>
                    <img 
                      className="h-auto w-full rounded-lg object-cover" 
                      alt="A finished frame capturing a serene landscape photograph."
                      src="/ganesha_prem.png"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Our Journey Timeline */}
            <section>
              <div className="text-center mb-16">
                <h1 className="text-primary dark:text-gray-100 tracking-tight text-3xl font-serif font-bold leading-tight md:text-4xl">Our Journey</h1>
                <p className="text-muted-charcoal dark:text-gray-400 text-base font-normal leading-normal max-w-3xl mx-auto mt-4">
                  Tracing the path from a simple idea to a celebrated craft.
                </p>
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div aria-hidden="true" className="absolute left-1/2 -ml-px w-0.5 h-full bg-primary/20 dark:bg-primary/30"></div>

                <div className="space-y-16">
                  {/* Timeline Item 1 */}
                  <div className="relative flex items-center">
                    <div className="w-1/2 pr-8 text-right">
                      <h3 className="text-lg font-bold text-primary dark:text-gray-100">2018: The Spark</h3>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm mt-1">
                        A simple sketch and a passion for woodworking ignites the Calm Frames journey in a small garage workshop.
                      </p>
                    </div>
                    <div className="absolute left-1/2 -ml-2.5 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative flex items-center">
                    <div className="w-1/2 pr-8"></div>
                    <div className="absolute left-1/2 -ml-2.5 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <div className="w-1/2 pl-8 text-left">
                      <h3 className="text-lg font-bold text-primary dark:text-gray-100">2020: First Collection</h3>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm mt-1">
                        We launch our first curated collection online, focusing on minimalist designs and locally sourced oak.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative flex items-center">
                    <div className="w-1/2 pr-8 text-right">
                      <h3 className="text-lg font-bold text-primary dark:text-gray-100">2022: Growing the Team</h3>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm mt-1">
                        Our team expands, bringing together artisans who share our vision for quality and intentional craftsmanship.
                      </p>
                    </div>
                    <div className="absolute left-1/2 -ml-2.5 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="relative flex items-center">
                    <div className="w-1/2 pr-8"></div>
                    <div className="absolute left-1/2 -ml-2.5 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <div className="w-1/2 pl-8 text-left">
                      <h3 className="text-lg font-bold text-primary dark:text-gray-100">Today: A Quiet Presence</h3>
                      <p className="text-muted-charcoal dark:text-gray-400 text-sm mt-1">
                        Our frames are now cherished in homes around the world, bringing a touch of calm to everyday life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sustainability Section */}
            <section className="bg-primary/5 dark:bg-primary/10 rounded-xl p-8 sm:p-12 text-center">
              <h1 className="text-primary dark:text-gray-100 tracking-tight text-3xl font-serif font-bold leading-tight md:text-4xl">A Commitment to Nature</h1>
              <p className="text-muted-charcoal dark:text-gray-400 text-base font-normal leading-normal max-w-3xl mx-auto mt-4 mb-10">
                We build with reverence for the natural world, ensuring our craft honors the resources it comes from and preserves its beauty for future generations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold">
                    <span className="material-symbols-outlined text-3xl">forest</span>
                  </div>
                  <h4 className="text-base font-medium text-primary dark:text-gray-100">Ethical Sourcing</h4>
                  <p className="text-sm text-muted-charcoal dark:text-gray-400">Our wood is sourced from responsibly managed forests certified by the FSC.</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold">
                    <span className="material-symbols-outlined text-3xl">recycling</span>
                  </div>
                  <h4 className="text-base font-medium text-primary dark:text-gray-100">Minimal Waste</h4>
                  <p className="text-sm text-muted-charcoal dark:text-gray-400">We utilize every piece of timber, and our packaging is 100% recyclable and plastic-free.</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-brushed-gold/20 text-primary dark:text-brushed-gold">
                    <span className="material-symbols-outlined text-3xl">water_drop</span>
                  </div>
                  <h4 className="text-base font-medium text-primary dark:text-gray-100">Natural Finishes</h4>
                  <p className="text-sm text-muted-charcoal dark:text-gray-400">We use non-toxic, plant-based oils and waxes to protect the wood and your home's air quality.</p>
                </div>
              </div>
            </section>
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

export default AboutUs

